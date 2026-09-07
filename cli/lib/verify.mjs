import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

import { parse } from "@babel/parser";
import Ajv from "ajv";

import { buildRegistry } from "../../catalog/build-registry.mjs";
import { buildCoverageMarkdown, loadRegistry } from "./catalog.mjs";
import {
  capabilitySchemaPath,
  coverageReportPath,
  documentationDirectory,
  fixtureDirectory,
  fixtureSchemaPath,
  registryPath,
  reportDirectory,
  repositoryRoot,
  sourceIndexPath,
} from "./paths.mjs";

const ignoredDirectories = new Set([".git", "node_modules", ".cache", ".meego-cache"]);
const markdownDirectories = [documentationDirectory, path.join(repositoryRoot, "adapters")];
const rootMarkdownFiles = [
  path.join(repositoryRoot, "README.md"),
  path.join(repositoryRoot, "AGENTS.md"),
];
const forbiddenPatterns = [
  { name: "external integration", pattern: /\bseafile\b/i },
  { name: "local workspace path", pattern: /\/Users\/quant\// },
  { name: "legacy source workspace", pattern: /\bsanxia-monorepo\b/i },
  { name: "legacy plugin workspace", pattern: /\bmeego-plugins\b/i },
  { name: "legacy backend workspace", pattern: /\bsoc-project\b/i },
  { name: "private key material", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];
const textFenceLanguages = new Set(["", "text", "plaintext"]);
const typescriptFenceLanguages = new Set(["ts", "tsx", "typescript", "js", "jsx", "javascript"]);
const pythonFenceLanguages = new Set(["py", "python"]);
const shellFenceLanguages = new Set(["sh", "shell", "bash"]);

export async function listFiles(directory, predicate = () => true) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await listFiles(path.join(directory, entry.name), predicate)));
      }
      continue;
    }
    const filePath = path.join(directory, entry.name);
    if (predicate(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readTextOrNull(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function formatAjvErrors(errors = []) {
  return errors
    .map((error) => `${error.instancePath || "/"} ${error.message ?? "is invalid"}`)
    .join("; ");
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isPathInsideDirectory(filePath, directory) {
  const relative = path.relative(directory, filePath);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function uniquePaths(filePaths) {
  return [...new Set(filePaths)];
}

export function extractMarkdownLinks(content) {
  const links = [];
  const pattern = /!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    links.push(match[1] ?? match[2]);
  }

  return links;
}

function decodeUriComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function splitMarkdownLink(link) {
  const fragmentIndex = link.indexOf("#");
  const pathWithQuery = fragmentIndex === -1 ? link : link.slice(0, fragmentIndex);
  const queryIndex = pathWithQuery.indexOf("?");

  return {
    pathPart: decodeUriComponent(queryIndex === -1 ? pathWithQuery : pathWithQuery.slice(0, queryIndex)),
    fragment: fragmentIndex === -1 ? "" : decodeUriComponent(link.slice(fragmentIndex + 1)),
  };
}

function markdownHeadingSlug(heading) {
  return heading
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[\\`*_~]/g, "")
    .toLocaleLowerCase("zh-CN")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function markdownHeadingSlugs(content) {
  const slugs = new Set();
  const occurrences = new Map();

  for (const line of content.split(/\r?\n/)) {
    const match = /^(?: {0,3})#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }
    const baseSlug = markdownHeadingSlug(match[1]);
    if (!baseSlug) {
      continue;
    }
    const occurrence = occurrences.get(baseSlug) ?? 0;
    occurrences.set(baseSlug, occurrence + 1);
    slugs.add(occurrence === 0 ? baseSlug : `${baseSlug}-${occurrence}`);
  }

  return slugs;
}

export async function checkMarkdownLinks(content, markdownPath, errors, rootDirectory = repositoryRoot) {
  const relativePath = path.relative(rootDirectory, markdownPath);

  for (const link of extractMarkdownLinks(content)) {
    if (/^(?:https?:|mailto:)/i.test(link)) {
      continue;
    }

    const { pathPart, fragment } = splitMarkdownLink(link);
    const targetPath = path.resolve(path.dirname(markdownPath), pathPart || ".");
    if (!isPathInsideDirectory(targetPath, rootDirectory)) {
      errors.push(`${relativePath}: local link escapes the repository: ${link}.`);
      continue;
    }
    if (!(await exists(targetPath))) {
      errors.push(`${relativePath}: broken local link ${link}.`);
      continue;
    }
    if (!fragment) {
      continue;
    }
    if (path.extname(targetPath).toLowerCase() !== ".md") {
      errors.push(`${relativePath}: anchor target is not Markdown: ${link}.`);
      continue;
    }

    const targetContent = targetPath === markdownPath ? content : await readFile(targetPath, "utf8");
    if (!markdownHeadingSlugs(targetContent).has(markdownHeadingSlug(fragment))) {
      errors.push(`${relativePath}: broken local anchor ${link}.`);
    }
  }
}

function extractCodeFences(content, relativePath, errors) {
  const fences = [];
  let activeFence;

  for (const [index, line] of content.split(/\r?\n/).entries()) {
    if (!activeFence) {
      const openingMatch = /^(?: {0,3})(`{3,}|~{3,})([A-Za-z0-9_-]*)\s*$/.exec(line);
      if (openingMatch) {
        activeFence = {
          marker: openingMatch[1][0],
          markerLength: openingMatch[1].length,
          language: openingMatch[2].toLowerCase(),
          line: index + 1,
          source: [],
        };
      }
      continue;
    }

    const closingMatch = /^(?: {0,3})(`{3,}|~{3,})\s*$/.exec(line);
    if (
      closingMatch &&
      closingMatch[1][0] === activeFence.marker &&
      closingMatch[1].length >= activeFence.markerLength
    ) {
      fences.push({
        language: activeFence.language,
        line: activeFence.line,
        source: activeFence.source.join("\n"),
      });
      activeFence = undefined;
      continue;
    }

    activeFence.source.push(line);
  }

  if (activeFence) {
    errors.push(`${relativePath}:${activeFence.line}: unclosed code fence.`);
  }

  return fences;
}

function checkCodeFences(content, relativePath, errors) {
  for (const fence of extractCodeFences(content, relativePath, errors)) {
    try {
      if (textFenceLanguages.has(fence.language)) {
        continue;
      }
      if (fence.language === "json") {
        JSON.parse(fence.source);
        continue;
      }
      if (typescriptFenceLanguages.has(fence.language)) {
        parse(fence.source, {
          sourceType: "module",
          plugins: ["typescript", "jsx"],
        });
        continue;
      }
      if (pythonFenceLanguages.has(fence.language)) {
        const result = spawnSync(
          "python3",
          ["-c", "import ast, sys; ast.parse(sys.stdin.read())"],
          { encoding: "utf8", input: fence.source },
        );
        if (result.error) {
          throw result.error;
        }
        if (result.status !== 0) {
          throw new Error(result.stderr.trim() || "Python parser rejected the source.");
        }
        continue;
      }
      if (shellFenceLanguages.has(fence.language)) {
        const result = spawnSync("bash", ["-n"], {
          encoding: "utf8",
          input: fence.source,
        });
        if (result.error) {
          throw result.error;
        }
        if (result.status !== 0) {
          throw new Error(result.stderr.trim() || "Shell parser rejected the source.");
        }
        continue;
      }
      throw new Error(`Unsupported code fence language ${fence.language}.`);
    } catch (error) {
      errors.push(
        `${relativePath}:${fence.line}: invalid ${fence.language || "plain"} code fence: ${error.message}`,
      );
    }
  }
}

function checkDocumentFooter(content) {
  const lines = content.trimEnd().split(/\r?\n/);
  const footer = lines.slice(-2);

  return (
    footer.length === 2 &&
    /^更新时间：\d{4}-\d{2}-\d{2}$/.test(footer[0]) &&
    /^官方 URL：https:\/\/.+/.test(footer[1])
  );
}

function checkForbiddenContent(content, relativePath, errors) {
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(content)) {
      errors.push(`${relativePath}: contains forbidden ${rule.name}.`);
    }
  }
}

export function validateFixtureSemantics(fixture, capability) {
  const errors = [];
  if (!capability) {
    return errors;
  }
  if (fixture.kind !== capability.kind) {
    errors.push(
      `${fixture.id}: kind ${fixture.kind} does not match capability ${capability.id} kind ${capability.kind}.`,
    );
  }

  const requestResponseKinds = new Set(["http_api"]);
  const inputOutputKinds = new Set(["plugin_point", "jssdk_api"]);
  for (const fixtureCase of fixture.cases) {
    if (!["success", "failure"].includes(fixtureCase.outcome)) {
      continue;
    }
    if (requestResponseKinds.has(capability.kind)) {
      if (!fixtureCase.request || !fixtureCase.response) {
        errors.push(`${fixture.id}/${fixtureCase.name}: requires request and response.`);
      }
    }
    if (inputOutputKinds.has(capability.kind)) {
      if (!fixtureCase.input || !fixtureCase.output) {
        errors.push(`${fixture.id}/${fixtureCase.name}: requires input and output.`);
      }
    }
    if (capability.kind === "event_contract") {
      const requiresSignatureShape = capability.id === "event-contract.webhook-signature";
      if (requiresSignatureShape && (!fixtureCase.input || !fixtureCase.output)) {
        errors.push(`${fixture.id}/${fixtureCase.name}: requires input and output.`);
      }
      if (!requiresSignatureShape && (!fixtureCase.request || !fixtureCase.response)) {
        errors.push(`${fixture.id}/${fixtureCase.name}: requires request and response.`);
      }
    }
  }

  return errors;
}

export function verifyGeneratedArtifacts(sourceIndex, registryContent, coverageContent) {
  const expectedRegistry = buildRegistry(sourceIndex);
  const expectedRegistryContent = `${JSON.stringify(expectedRegistry, null, 2)}\n`;
  const expectedCoverageContent = buildCoverageMarkdown(expectedRegistry);
  const errors = [];

  if (registryContent === null) {
    errors.push("catalog/registry.json: generated registry is missing.");
  } else if (registryContent !== expectedRegistryContent) {
    errors.push("catalog/registry.json: generated registry is stale; run npm run catalog:build.");
  }
  if (coverageContent === null) {
    errors.push("reports/coverage.md: generated coverage report is missing.");
  } else if (coverageContent !== expectedCoverageContent) {
    errors.push("reports/coverage.md: generated coverage report is stale; run npm run docs:render.");
  }

  return { errors, expectedRegistry };
}

async function collectMarkdownFiles(errors) {
  const markdownFiles = [];
  for (const directory of markdownDirectories) {
    if (!(await pathIsDirectory(directory))) {
      errors.push(`${path.relative(repositoryRoot, directory)}: required Markdown directory is missing.`);
      continue;
    }
    markdownFiles.push(...(await listFiles(directory, (filePath) => filePath.endsWith(".md"))));
  }
  for (const filePath of rootMarkdownFiles) {
    if (!(await exists(filePath))) {
      errors.push(`${path.relative(repositoryRoot, filePath)}: required Markdown file is missing.`);
      continue;
    }
    markdownFiles.push(filePath);
  }
  return uniquePaths(markdownFiles);
}

export async function verifyRepository() {
  const errors = [];
  const warnings = [];
  const sourceIndexContent = await readTextOrNull(sourceIndexPath);
  const registryContent = await readTextOrNull(registryPath);
  const coverageContent = await readTextOrNull(coverageReportPath);
  let registry;

  if (sourceIndexContent === null) {
    errors.push("catalog/source-index.json: source index is missing.");
  } else {
    try {
      const sourceIndex = JSON.parse(sourceIndexContent);
      errors.push(...verifyGeneratedArtifacts(sourceIndex, registryContent, coverageContent).errors);
    } catch (error) {
      errors.push(`catalog/source-index.json: cannot verify generated artifacts: ${error.message}`);
    }
  }

  if (registryContent === null) {
    errors.push("catalog/registry.json: generated registry is missing.");
  } else {
    try {
      registry = JSON.parse(registryContent);
    } catch (error) {
      errors.push(`catalog/registry.json: invalid JSON: ${error.message}`);
    }
  }

  const markdownFiles = await collectMarkdownFiles(errors);
  for (const markdownPath of markdownFiles) {
    const relativePath = path.relative(repositoryRoot, markdownPath);
    const content = await readFile(markdownPath, "utf8");
    checkCodeFences(content, relativePath, errors);
    await checkMarkdownLinks(content, markdownPath, errors);
  }

  if (!registry || !Array.isArray(registry.capabilities)) {
    if (registry) {
      errors.push("catalog/registry.json: capabilities must be an array.");
    }
    return {
      errors,
      warnings,
      capabilityCount: 0,
      fixtureCount: 0,
      documentCount: markdownFiles.length,
    };
  }

  const capabilitySchema = await readJson(capabilitySchemaPath);
  const fixtureSchema = await readJson(fixtureSchemaPath);
  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  const validateCapability = ajv.compile(capabilitySchema);
  const validateFixture = ajv.compile(fixtureSchema);
  const capabilityIds = new Set();
  const capabilitiesById = new Map();
  const fixtureReferences = new Map();

  if (registry.schemaVersion !== 1) {
    errors.push("catalog/registry.json: schemaVersion must be 1.");
  }

  for (const capability of registry.capabilities) {
    if (!validateCapability(capability)) {
      errors.push(
        `catalog/registry.json (${capability.id ?? "unknown"}): ${formatAjvErrors(validateCapability.errors)}`,
      );
      continue;
    }
    if (capabilityIds.has(capability.id)) {
      errors.push(`catalog/registry.json: duplicate capability ID ${capability.id}.`);
    }
    capabilityIds.add(capability.id);
    capabilitiesById.set(capability.id, capability);

    for (const fixtureId of capability.fixtureIds ?? []) {
      const owners = fixtureReferences.get(fixtureId) ?? new Set();
      owners.add(capability.id);
      fixtureReferences.set(fixtureId, owners);
    }

    const documentPath = path.join(repositoryRoot, capability.docPath);
    if (!isPathInsideDirectory(documentPath, repositoryRoot)) {
      errors.push(`${capability.id}: documentation path escapes the repository.`);
      continue;
    }
    if (!(await exists(documentPath))) {
      const message = `${capability.id}: missing documentation at ${capability.docPath}.`;
      if (capability.status === "verified") {
        errors.push(message);
      } else {
        warnings.push(message);
      }
      continue;
    }

    const document = await readFile(documentPath, "utf8");
    if (!checkDocumentFooter(document)) {
      errors.push(`${capability.docPath}: expected the minimal two-line source footer.`);
    }
  }

  for (const capability of registry.capabilities) {
    for (const relatedId of capability.related ?? []) {
      if (!capabilityIds.has(relatedId)) {
        errors.push(`${capability.id}: unknown related capability ${relatedId}.`);
      }
      if (relatedId === capability.id) {
        errors.push(`${capability.id}: cannot relate to itself.`);
      }
    }
  }

  const fixtureFiles = await listFiles(fixtureDirectory, (filePath) => filePath.endsWith(".json"));
  const fixtureIds = new Set();
  const fixturesById = new Map();

  for (const fixturePath of fixtureFiles) {
    const relativePath = path.relative(repositoryRoot, fixturePath);
    let fixture;
    try {
      fixture = await readJson(fixturePath);
    } catch (error) {
      errors.push(`${relativePath}: invalid JSON: ${error.message}`);
      continue;
    }
    if (!validateFixture(fixture)) {
      errors.push(`${relativePath}: ${formatAjvErrors(validateFixture.errors)}`);
      continue;
    }
    if (fixtureIds.has(fixture.id)) {
      errors.push(`${relativePath}: duplicate fixture ID ${fixture.id}.`);
    }
    fixtureIds.add(fixture.id);
    fixturesById.set(fixture.id, fixture);

    const capability = capabilitiesById.get(fixture.capabilityId);
    if (!capability) {
      errors.push(`${relativePath}: unknown capability ${fixture.capabilityId}.`);
      continue;
    }
    errors.push(...validateFixtureSemantics(fixture, capability));
  }

  for (const [fixtureId, owners] of fixtureReferences) {
    const fixture = fixturesById.get(fixtureId);
    if (!fixture) {
      errors.push(`catalog/registry.json: missing referenced fixture ${fixtureId}.`);
      continue;
    }
    for (const ownerId of owners) {
      if (fixture.capabilityId !== ownerId) {
        errors.push(
          `catalog/registry.json: fixture ${fixtureId} is linked by ${ownerId} but declares ${fixture.capabilityId}.`,
        );
      }
    }
  }

  for (const fixtureId of fixtureIds) {
    if (!fixtureReferences.has(fixtureId)) {
      errors.push(`fixtures: unreferenced fixture ${fixtureId}.`);
    }
  }

  const policyFiles = uniquePaths([
    ...markdownFiles,
    ...(await listFiles(path.join(repositoryRoot, "catalog"), (filePath) =>
      filePath.endsWith(".json") || filePath.endsWith(".md") || filePath.endsWith(".mjs"),
    )),
    ...fixtureFiles,
  ]);
  for (const filePath of policyFiles) {
    const relativePath = path.relative(repositoryRoot, filePath);
    checkForbiddenContent(await readFile(filePath, "utf8"), relativePath, errors);
  }

  return {
    errors,
    warnings,
    capabilityCount: registry.capabilities.length,
    fixtureCount: fixtureFiles.length,
    documentCount: markdownFiles.length,
  };
}

export async function renderCoverageReport() {
  const registry = await loadRegistry();
  await mkdir(reportDirectory, { recursive: true });
  await writeFile(coverageReportPath, buildCoverageMarkdown(registry), "utf8");
  return coverageReportPath;
}

export async function pathIsDirectory(directory) {
  try {
    return (await stat(directory)).isDirectory();
  } catch {
    return false;
  }
}
