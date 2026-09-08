import { spawnSync } from "node:child_process";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "@babel/parser";
import Ajv from "ajv";

import { validateDocumentMetadata } from "./sync-document-metadata.mjs";
import {
  capabilitiesPath,
  capabilitySchemaPath,
  documentationDirectory,
  fixtureDirectory,
  fixtureSchemaPath,
  provenancePath,
  referencesDirectory,
  skillEntrypointPath,
  skillRoot,
} from "./paths.mjs";

const ignoredDirectories = new Set([".git", "node_modules", ".cache", ".meego-cache"]);
const provenanceLabel = "maintainer/provenance/document-sources.json";
const catalogLabel = "catalog/capabilities.json";
const textFenceLanguages = new Set(["", "text", "plaintext"]);
const typescriptFenceLanguages = new Set(["ts", "tsx", "typescript", "js", "jsx", "javascript"]);
const pythonFenceLanguages = new Set(["py", "python"]);
const shellFenceLanguages = new Set(["sh", "shell", "bash", "zsh"]);
const opaqueFenceLanguages = new Set([
  "css",
  "diff",
  "dotenv",
  "go",
  "html",
  "http",
  "ini",
  "java",
  "jsonc",
  "markdown",
  "md",
  "mermaid",
  "nginx",
  "sql",
  "toml",
  "vue",
  "xml",
  "yaml",
  "yml",
]);

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

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function formatAjvErrors(errors = []) {
  return errors
    .map((error) => (error.instancePath || "/") + " " + (error.message ?? "is invalid"))
    .join("; ");
}

function isPathInsideDirectory(filePath, directory) {
  const relative = path.relative(directory, filePath);
  return (
    relative === "" ||
    (!relative.startsWith(".." + path.sep) && relative !== ".." && !path.isAbsolute(relative))
  );
}

function isSafeRelativePath(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    !value.startsWith("/") &&
    !value.split("/").includes("..")
  );
}

function skillPath(targetPath) {
  return path.resolve(skillRoot, targetPath);
}

function skillRelativePath(filePath) {
  return path.relative(skillRoot, filePath).split(path.sep).join("/");
}

export function extractMarkdownLinks(content) {
  const links = [];
  const pattern = /!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g;
  const linkSource = stripMarkdownCode(content);
  let match;

  while ((match = pattern.exec(linkSource)) !== null) {
    links.push(match[1] ?? match[2]);
  }

  return links;
}

function stripMarkdownCode(content) {
  let fence;
  const lines = [];

  for (const line of content.split(/\r?\n/)) {
    if (!fence) {
      const openingMatch = /^(?: {0,3})(`{3,}|~{3,})/.exec(line);
      if (openingMatch) {
        fence = openingMatch[1];
        lines.push("");
        continue;
      }
      lines.push(line.replace(/`+[^`\n]*`+/g, ""));
      continue;
    }

    const closingMatch = /^(?: {0,3})(`{3,}|~{3,})\s*$/.exec(line);
    if (
      closingMatch &&
      closingMatch[1][0] === fence[0] &&
      closingMatch[1].length >= fence.length
    ) {
      fence = undefined;
    }
    lines.push("");
  }

  return lines.join("\n");
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

function markdownAnchors(content) {
  const anchors = new Set();
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
    anchors.add(occurrence === 0 ? baseSlug : baseSlug + "-" + occurrence);
  }

  const explicitAnchorPattern =
    /<(?:a|[a-z][a-z0-9-]*)\b[^>]*\b(?:id|name)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
  let match;
  while ((match = explicitAnchorPattern.exec(content)) !== null) {
    const anchor = match[1] ?? match[2] ?? match[3];
    anchors.add(anchor);
    anchors.add(markdownHeadingSlug(anchor));
  }

  return anchors;
}

export async function checkMarkdownLinks(content, markdownPath, errors, rootDirectory = skillRoot) {
  const relativePath = path.relative(rootDirectory, markdownPath);

  for (const link of extractMarkdownLinks(content)) {
    if (/^(?:https?:|mailto:)/i.test(link)) {
      continue;
    }

    const { pathPart, fragment } = splitMarkdownLink(link);
    const targetPath = pathPart ? path.resolve(path.dirname(markdownPath), pathPart) : markdownPath;
    if (!isPathInsideDirectory(targetPath, rootDirectory)) {
      errors.push(relativePath + ": local link escapes the corpus: " + link + ".");
      continue;
    }
    if (!(await exists(targetPath))) {
      errors.push(relativePath + ": broken local link " + link + ".");
      continue;
    }
    if (!fragment) {
      continue;
    }
    if (path.extname(targetPath).toLowerCase() !== ".md") {
      errors.push(relativePath + ": anchor target is not Markdown: " + link + ".");
      continue;
    }

    const targetContent = targetPath === markdownPath ? content : await readFile(targetPath, "utf8");
    const anchors = markdownAnchors(targetContent);
    if (!anchors.has(fragment) && !anchors.has(markdownHeadingSlug(fragment))) {
      errors.push(relativePath + ": broken local anchor " + link + ".");
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
    errors.push(relativePath + ":" + activeFence.line + ": unclosed code fence.");
  }

  return fences;
}

function checkCodeFences(content, relativePath, errors) {
  for (const fence of extractCodeFences(content, relativePath, errors)) {
    try {
      if (textFenceLanguages.has(fence.language) || opaqueFenceLanguages.has(fence.language)) {
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
      throw new Error("Unsupported code fence language " + fence.language + ".");
    } catch (error) {
      errors.push(
        relativePath +
          ":" +
          fence.line +
          ": invalid " +
          (fence.language || "plain") +
          " code fence: " +
          error.message,
      );
    }
  }
}

function checkDocumentFooter(content, officialUrl) {
  const lines = content.trimEnd().split(/\r?\n/);
  const footer = lines.slice(-2);
  return (
    footer.length === 2 &&
    /^更新时间：\d{4}-\d{2}-\d{2}$/.test(footer[0]) &&
    footer[1] === "官方 URL：" + officialUrl
  );
}

function hasMinimalDocumentFooter(content) {
  const lines = content.trimEnd().split(/\r?\n/);
  const footer = lines.slice(-2);
  return (
    footer.length === 2 &&
    /^更新时间：\d{4}-\d{2}-\d{2}$/.test(footer[0]) &&
    /^官方 URL：(source_silent|https:\/\/project\.feishu\.cn\/b\/helpcenter\/[^\s]+)$/.test(footer[1])
  );
}

function summarizeProvenanceSources(sources) {
  const byPlatform = Object.fromEntries(
    ["openapi", "plugin"].map((platform) => [
      platform,
      { sourceDocuments: 0, withOfficialUrl: 0, withoutOfficialUrl: 0 },
    ]),
  );
  let withOfficialUrl = 0;

  for (const source of sources) {
    if (!byPlatform[source.platform]) {
      continue;
    }
    byPlatform[source.platform].sourceDocuments += 1;
    if (source.officialUrl === null) {
      byPlatform[source.platform].withoutOfficialUrl += 1;
    } else {
      withOfficialUrl += 1;
      byPlatform[source.platform].withOfficialUrl += 1;
    }
  }

  return {
    sourceDocuments: sources.length,
    withOfficialUrl,
    withoutOfficialUrl: sources.length - withOfficialUrl,
    byPlatform,
  };
}

export function validateDocumentProvenance(provenance) {
  const errors = [];
  if (provenance?.schemaVersion !== 1 || !Array.isArray(provenance?.sources)) {
    return [provenanceLabel + ": expected schemaVersion 1 and a sources array."];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(provenance.generatedAt ?? "")) {
    errors.push(provenanceLabel + ": generatedAt must use YYYY-MM-DD.");
  }

  const sourceKeys = new Set();
  const targetPaths = new Set();
  for (const source of provenance.sources) {
    if (!source || typeof source !== "object") {
      errors.push(provenanceLabel + ": source entry must be an object.");
      continue;
    }
    if (!["openapi", "plugin"].includes(source.platform)) {
      errors.push(provenanceLabel + ": invalid platform " + (source.platform ?? "unknown") + ".");
      continue;
    }
    if (!isSafeRelativePath(source.sourcePath) || !source.sourcePath.endsWith(".md")) {
      errors.push(provenanceLabel + ": invalid source path for " + source.platform + ".");
    }
    const expectedPrefix = "docs/" + source.platform + "/";
    if (
      !isSafeRelativePath(source.targetPath) ||
      !source.targetPath.startsWith(expectedPrefix) ||
      !source.targetPath.endsWith(".md")
    ) {
      errors.push(provenanceLabel + ": invalid target path for " + source.sourcePath + ".");
    }
    if (typeof source.category !== "string" || source.category.length === 0) {
      errors.push(provenanceLabel + ": invalid category for " + source.sourcePath + ".");
    }
    if (
      source.officialUrl !== null &&
      (typeof source.officialUrl !== "string" ||
        !/^https:\/\/project\.feishu\.cn\/b\/helpcenter\/[^\s]+$/.test(source.officialUrl))
    ) {
      errors.push(provenanceLabel + ": invalid official URL for " + source.sourcePath + ".");
    }
    if (typeof source.contentHash !== "string" || !/^[a-f0-9]{64}$/.test(source.contentHash)) {
      errors.push(provenanceLabel + ": invalid content hash for " + source.sourcePath + ".");
    }

    const sourceKey = source.platform + ":" + source.sourcePath;
    if (sourceKeys.has(sourceKey)) {
      errors.push(provenanceLabel + ": duplicate source " + sourceKey + ".");
    }
    sourceKeys.add(sourceKey);
    if (targetPaths.has(source.targetPath)) {
      errors.push(provenanceLabel + ": duplicate target " + source.targetPath + ".");
    }
    targetPaths.add(source.targetPath);
  }

  const expectedTotals = summarizeProvenanceSources(provenance.sources);
  if (JSON.stringify(provenance.totals) !== JSON.stringify(expectedTotals)) {
    errors.push(provenanceLabel + ": totals do not match sources.");
  }
  return errors;
}

async function verifyDocumentProvenance(provenance, errors) {
  for (const source of provenance.sources) {
    if (!isSafeRelativePath(source?.targetPath)) {
      continue;
    }
    const documentPath = skillPath(source.targetPath);
    if (!isPathInsideDirectory(documentPath, documentationDirectory) || !(await exists(documentPath))) {
      errors.push(
        source.targetPath +
          ": missing canonical document for " +
          source.platform +
          "/" +
          source.sourcePath +
          ".",
      );
      continue;
    }

    const content = await readFile(documentPath, "utf8");
    const expectedOfficialUrl = source.officialUrl ?? "source_silent";
    if (!checkDocumentFooter(content, expectedOfficialUrl)) {
      errors.push(source.targetPath + ": footer does not match its provenance.");
    }
    if (source.officialUrl === null && !content.includes("来源链接：source_silent")) {
      errors.push(source.targetPath + ": source-silent pages must identify the missing official URL.");
    }
  }
}

async function verifyCanonicalDocumentSet(provenance, errors) {
  const expectedPaths = new Set(["docs/README.md"]);
  for (const source of provenance.sources) {
    if (isSafeRelativePath(source?.targetPath)) {
      expectedPaths.add(source.targetPath);
    }
  }

  for (const filePath of await listFiles(documentationDirectory, (item) => item.endsWith(".md"))) {
    const relativePath = skillRelativePath(filePath);
    if (!expectedPaths.has(relativePath)) {
      errors.push(relativePath + ": documentation page is not recorded in provenance.");
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
      fixture.id +
        ": kind " +
        fixture.kind +
        " does not match capability " +
        capability.id +
        " kind " +
        capability.kind +
        ".",
    );
  }

  const requestResponseKinds = new Set(["http_api"]);
  const inputOutputKinds = new Set(["plugin_point", "jssdk_api"]);
  for (const fixtureCase of fixture.cases) {
    if (!["success", "failure"].includes(fixtureCase.outcome)) {
      continue;
    }
    if (requestResponseKinds.has(capability.kind) && (!fixtureCase.request || !fixtureCase.response)) {
      errors.push(fixture.id + "/" + fixtureCase.name + ": requires request and response.");
    }
    if (inputOutputKinds.has(capability.kind) && (!fixtureCase.input || !fixtureCase.output)) {
      errors.push(fixture.id + "/" + fixtureCase.name + ": requires input and output.");
    }
    if (capability.kind === "event_contract") {
      const usesComputationShape = capability.id === "event-contract.webhook-signature";
      const hasRequiredShape = usesComputationShape
        ? fixtureCase.input && fixtureCase.output
        : fixtureCase.request && fixtureCase.response;
      if (!hasRequiredShape) {
        errors.push(
          fixture.id +
            "/" +
            fixtureCase.name +
            ": requires " +
            (usesComputationShape ? "input and output" : "request and response") +
            ".",
        );
      }
    }
  }

  return errors;
}

async function collectMarkdownFiles(errors) {
  if (!(await pathIsDirectory(documentationDirectory))) {
    errors.push("docs: required Markdown directory is missing.");
    return [];
  }
  return listFiles(documentationDirectory, (filePath) => filePath.endsWith(".md"));
}

async function collectRuntimeMarkdownFiles(errors) {
  const files = [];
  if (await exists(skillEntrypointPath)) {
    files.push(skillEntrypointPath);
  } else {
    errors.push("SKILL.md: required skill entry point is missing.");
  }

  if (!(await pathIsDirectory(referencesDirectory))) {
    errors.push("references: required runtime Markdown directory is missing.");
    return files;
  }

  files.push(...(await listFiles(referencesDirectory, (filePath) => filePath.endsWith(".md"))));
  return files;
}

async function loadOptionalJson(filePath, label, errors) {
  try {
    return await readJson(filePath);
  } catch (error) {
    const detail = error.code === "ENOENT" ? "is missing" : "invalid JSON: " + error.message;
    errors.push(label + ": " + detail + ".");
    return null;
  }
}

async function validateCapabilities(catalog, errors) {
  if (!catalog || !Array.isArray(catalog.capabilities)) {
    if (catalog) {
      errors.push(catalogLabel + ": capabilities must be an array.");
    }
    return { capabilitiesById: new Map(), fixtureReferences: new Map(), capabilityCount: 0 };
  }

  if (catalog.schemaVersion !== 1) {
    errors.push(catalogLabel + ": schemaVersion must be 1.");
  }

  const capabilitySchema = await loadOptionalJson(
    capabilitySchemaPath,
    "maintainer/schemas/capability.schema.json",
    errors,
  );
  if (!capabilitySchema) {
    return {
      capabilitiesById: new Map(),
      fixtureReferences: new Map(),
      capabilityCount: catalog.capabilities.length,
    };
  }

  const validateCapability = new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(
    capabilitySchema,
  );
  const capabilityIds = new Set();
  const capabilitiesById = new Map();
  const fixtureReferences = new Map();

  for (const capability of catalog.capabilities) {
    if (!validateCapability(capability)) {
      errors.push(
        catalogLabel +
          " (" +
          (capability.id ?? "unknown") +
          "): " +
          formatAjvErrors(validateCapability.errors),
      );
      continue;
    }
    if (capabilityIds.has(capability.id)) {
      errors.push(catalogLabel + ": duplicate capability ID " + capability.id + ".");
      continue;
    }
    capabilityIds.add(capability.id);
    capabilitiesById.set(capability.id, capability);

    for (const fixtureId of capability.fixtureIds ?? []) {
      const owners = fixtureReferences.get(fixtureId) ?? new Set();
      owners.add(capability.id);
      fixtureReferences.set(fixtureId, owners);
    }

    const documentPath = skillPath(capability.docPath);
    if (!isPathInsideDirectory(documentPath, documentationDirectory)) {
      errors.push(capability.id + ": documentation path escapes docs.");
      continue;
    }
    if (!(await exists(documentPath))) {
      errors.push(capability.id + ": missing documentation at " + capability.docPath + ".");
      continue;
    }

    const document = await readFile(documentPath, "utf8");
    if (!checkDocumentFooter(document, capability.officialUrl)) {
      errors.push(capability.docPath + ": footer does not match " + capability.id + "'s official URL.");
    }
    if (!markdownAnchors(document).has(capability.docAnchor)) {
      errors.push(capability.docPath + ": missing capability anchor " + capability.docAnchor + ".");
    }
  }

  for (const capability of capabilitiesById.values()) {
    for (const relatedId of capability.related ?? []) {
      if (!capabilityIds.has(relatedId)) {
        errors.push(capability.id + ": unknown related capability " + relatedId + ".");
      }
      if (relatedId === capability.id) {
        errors.push(capability.id + ": cannot relate to itself.");
      }
    }
  }

  return { capabilitiesById, fixtureReferences, capabilityCount: catalog.capabilities.length };
}

async function validateFixtures(capabilitiesById, fixtureReferences, errors) {
  if (!(await pathIsDirectory(fixtureDirectory))) {
    errors.push("fixtures: required fixture directory is missing.");
    return 0;
  }
  const fixtureSchema = await loadOptionalJson(
    fixtureSchemaPath,
    "maintainer/schemas/fixture.schema.json",
    errors,
  );
  if (!fixtureSchema) {
    return 0;
  }
  const validateFixture = new Ajv({ allErrors: true, strict: false, validateFormats: false }).compile(
    fixtureSchema,
  );
  const fixtureFiles = await listFiles(fixtureDirectory, (filePath) => filePath.endsWith(".json"));
  const fixtureIds = new Set();
  const fixturesById = new Map();

  for (const fixturePath of fixtureFiles) {
    const relativePath = skillRelativePath(fixturePath);
    let fixture;
    try {
      fixture = await readJson(fixturePath);
    } catch (error) {
      errors.push(relativePath + ": invalid JSON: " + error.message);
      continue;
    }
    if (!validateFixture(fixture)) {
      errors.push(relativePath + ": " + formatAjvErrors(validateFixture.errors));
      continue;
    }
    if (fixtureIds.has(fixture.id)) {
      errors.push(relativePath + ": duplicate fixture ID " + fixture.id + ".");
      continue;
    }
    fixtureIds.add(fixture.id);
    fixturesById.set(fixture.id, fixture);

    const capability = capabilitiesById.get(fixture.capabilityId);
    if (!capability) {
      errors.push(relativePath + ": unknown capability " + fixture.capabilityId + ".");
      continue;
    }
    errors.push(...validateFixtureSemantics(fixture, capability));
  }

  for (const [fixtureId, owners] of fixtureReferences) {
    const fixture = fixturesById.get(fixtureId);
    if (!fixture) {
      errors.push(catalogLabel + ": missing referenced fixture " + fixtureId + ".");
      continue;
    }
    for (const ownerId of owners) {
      if (fixture.capabilityId !== ownerId) {
        errors.push(
          catalogLabel +
            ": fixture " +
            fixtureId +
            " is linked by " +
            ownerId +
            " but declares " +
            fixture.capabilityId +
            ".",
        );
      }
    }
  }
  for (const fixtureId of fixtureIds) {
    if (!fixtureReferences.has(fixtureId)) {
      errors.push(fixtureId + ": fixture is not linked from its capability.");
    }
  }

  return fixtureFiles.length;
}

export async function verifyRepository() {
  const errors = [];
  const warnings = [];
  const [provenance, catalog] = await Promise.all([
    loadOptionalJson(provenancePath, provenanceLabel, errors),
    loadOptionalJson(capabilitiesPath, catalogLabel, errors),
  ]);

  if (provenance) {
    errors.push(...validateDocumentProvenance(provenance));
  }

  const markdownFiles = await collectMarkdownFiles(errors);
  for (const markdownPath of markdownFiles) {
    const content = await readFile(markdownPath, "utf8");
    const relativePath = skillRelativePath(markdownPath);
    if (!hasMinimalDocumentFooter(content)) {
      errors.push(relativePath + ": expected the minimal two-line source footer.");
    }
    checkCodeFences(content, relativePath, errors);
    await checkMarkdownLinks(content, markdownPath, errors);
  }

  const runtimeMarkdownFiles = await collectRuntimeMarkdownFiles(errors);
  for (const markdownPath of runtimeMarkdownFiles) {
    const content = await readFile(markdownPath, "utf8");
    const relativePath = skillRelativePath(markdownPath);
    checkCodeFences(content, relativePath, errors);
    await checkMarkdownLinks(content, markdownPath, errors);
  }

  if (provenance?.sources) {
    await verifyDocumentProvenance(provenance, errors);
    await verifyCanonicalDocumentSet(provenance, errors);
  }

  const { capabilitiesById, fixtureReferences, capabilityCount } = await validateCapabilities(catalog, errors);
  if (provenance?.sources && catalog?.capabilities) {
    try {
      errors.push(...(await validateDocumentMetadata(provenance, catalog)));
    } catch (error) {
      errors.push(provenanceLabel + ": cannot validate capability metadata: " + error.message);
    }
  }
  const fixtureCount = await validateFixtures(capabilitiesById, fixtureReferences, errors);

  return {
    errors,
    warnings,
    capabilityCount,
    fixtureCount,
    documentCount: markdownFiles.length,
  };
}

export async function pathIsDirectory(directory) {
  try {
    return (await stat(directory)).isDirectory();
  } catch {
    return false;
  }
}

async function main() {
  const result = await verifyRepository();
  if (result.errors.length > 0) {
    process.stderr.write("Corpus verification failed with " + result.errors.length + " error(s):\n");
    process.stderr.write(result.errors.map((error) => "- " + error).join("\n") + "\n");
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    "Verified " +
      result.capabilityCount +
      " capabilities, " +
      result.fixtureCount +
      " fixtures, and " +
      result.documentCount +
      " documents.\n",
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
