import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(catalogDirectory, "..");
const registryPath = path.join(catalogDirectory, "registry.json");
const documentSourceManifestPath = path.join(catalogDirectory, "document-sources.json");
const fixtureDirectory = path.join(repositoryRoot, "fixtures");

export const metadataStartMarker = "<!-- capability-metadata:start -->";
export const metadataEndMarker = "<!-- capability-metadata:end -->";

const frequencyLabels = {
  high: "高",
  medium: "中",
  low: "低",
};

const statusLabels = {
  verified: "已验证",
  source_silent: "官方未定义",
  needs_runtime_validation: "待运行时验证",
  deprecated: "已废弃",
};

function metadataBlockPattern() {
  return new RegExp(
    `${metadataStartMarker}[\\s\\S]*?${metadataEndMarker}(?:\\r?\\n)*`,
    "gu",
  );
}

async function listJsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listJsonFiles(filePath)));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(filePath);
    }
  }

  return files;
}

export async function loadFixturePathsById() {
  const fixtures = new Map();
  for (const fixturePath of await listJsonFiles(fixtureDirectory)) {
    const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
    if (typeof fixture.id === "string") {
      fixtures.set(fixture.id, fixturePath);
    }
  }
  return fixtures;
}

function fixtureLink(documentPath, fixturePath, fixtureId) {
  const relativePath = path.relative(path.dirname(documentPath), fixturePath).split(path.sep).join("/");
  const target = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
  return `[\`${fixtureId}\`](<${target}>)`;
}

export function groupCapabilitiesByDocument(capabilities) {
  const capabilitiesByDocument = new Map();
  for (const capability of capabilities) {
    const entries = capabilitiesByDocument.get(capability.docPath) ?? [];
    entries.push(capability);
    capabilitiesByDocument.set(capability.docPath, entries);
  }
  return capabilitiesByDocument;
}

export function renderDocumentMetadata(documentPath, capabilities, fixturePathsById) {
  const lines = [metadataStartMarker, "## 平台能力标记", ""];

  if (capabilities.length === 0) {
    lines.push("> 调用频次：无直接调用频次。本页用于平台说明、格式、目录或支持信息。");
  } else {
    for (const capability of capabilities.slice().sort((left, right) => left.id.localeCompare(right.id))) {
      const attributes = [
        `**${capability.title}**`,
        `\`${capability.id}\``,
        `频次：${frequencyLabels[capability.usageFrequency]}`,
        `状态：${statusLabels[capability.status]}`,
      ];
      const fixtureLinks = (capability.fixtureIds ?? []).map((fixtureId) => {
        const fixturePath = fixturePathsById.get(fixtureId);
        return fixturePath ? fixtureLink(documentPath, fixturePath, fixtureId) : `\`${fixtureId}\``;
      });
      if (fixtureLinks.length > 0) {
        attributes.push(`示例：${fixtureLinks.join("、")}`);
      }

      lines.push(`<a id="${capability.docAnchor}"></a>`);
      lines.push(`- ${attributes.join(" ｜ ")}`);
    }
  }

  lines.push("", metadataEndMarker);
  return lines.join("\n");
}

export function replaceDocumentMetadata(content, metadata) {
  let replacementCount = 0;
  const replacedContent = content.replace(metadataBlockPattern(), () => {
    replacementCount += 1;
    return replacementCount === 1 ? `${metadata}\n\n` : "";
  });
  if (replacementCount > 0) {
    return replacedContent;
  }

  const heading = /^# .+\r?\n/u.exec(content);
  if (!heading) {
    throw new Error("Canonical document must start with a level-one heading.");
  }
  const insertionIndex = heading[0].length;
  const remainder = content.slice(insertionIndex).replace(/^(?:\r?\n)+/u, "");
  return `${content.slice(0, insertionIndex)}\n${metadata}\n\n${remainder}`;
}

export function documentMetadataIsCurrent(content, metadata) {
  const metadataBlocks = content.match(metadataBlockPattern()) ?? [];
  return metadataBlocks.length === 1 && metadataBlocks[0].trimEnd() === metadata;
}

async function loadCatalogArtifacts() {
  const [registryContent, manifestContent, fixturePathsById] = await Promise.all([
    readFile(registryPath, "utf8"),
    readFile(documentSourceManifestPath, "utf8"),
    loadFixturePathsById(),
  ]);
  const registry = JSON.parse(registryContent);
  const manifest = JSON.parse(manifestContent);
  if (!Array.isArray(registry.capabilities) || !Array.isArray(manifest.sources)) {
    throw new Error("Registry and document-source manifest must contain arrays.");
  }
  return { registry, manifest, fixturePathsById };
}

export async function synchronizeDocumentMetadata() {
  const { registry, manifest, fixturePathsById } = await loadCatalogArtifacts();
  const capabilitiesByDocument = groupCapabilitiesByDocument(registry.capabilities);
  let updated = 0;

  for (const source of manifest.sources) {
    const documentPath = path.join(repositoryRoot, source.targetPath);
    const content = await readFile(documentPath, "utf8");
    const metadata = renderDocumentMetadata(
      documentPath,
      capabilitiesByDocument.get(source.targetPath) ?? [],
      fixturePathsById,
    );
    const nextContent = replaceDocumentMetadata(content, metadata);
    if (nextContent !== content) {
      await writeFile(documentPath, nextContent, "utf8");
      updated += 1;
    }
  }

  return { documentCount: manifest.sources.length, updated };
}

export async function validateDocumentMetadata(manifest, registry) {
  const errors = [];
  const fixturePathsById = await loadFixturePathsById();
  const capabilitiesByDocument = groupCapabilitiesByDocument(registry.capabilities);

  for (const source of manifest.sources) {
    const documentPath = path.join(repositoryRoot, source.targetPath);
    let content;
    try {
      content = await readFile(documentPath, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        errors.push(`${source.targetPath}: capability metadata cannot be validated because the canonical document is missing.`);
        continue;
      }
      throw error;
    }
    const expected = renderDocumentMetadata(
      documentPath,
      capabilitiesByDocument.get(source.targetPath) ?? [],
      fixturePathsById,
    );
    if (!documentMetadataIsCurrent(content, expected)) {
      errors.push(`${source.targetPath}: capability metadata is stale; run npm run docs:sync.`);
    }
  }

  return errors;
}

async function main() {
  const result = await synchronizeDocumentMetadata();
  process.stdout.write(`Synchronized capability metadata in ${result.documentCount} documents (${result.updated} changed).\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
