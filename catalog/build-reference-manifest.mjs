import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(catalogDirectory, "..");
const outputPath = path.join(catalogDirectory, "reference-sources.json");
const generatedAt = "2026-09-07";

const platforms = [
  {
    name: "openapi",
    sourceDirectory: "feishu-project-openapi",
    targetDirectory: "docs/reference/openapi",
  },
  {
    name: "plugin",
    sourceDirectory: "feishu-project-plugin",
    targetDirectory: "docs/reference/plugin",
  },
];

async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(filePath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(filePath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right, "zh-CN"));
}

function findOfficialUrl(content) {
  const sourceSection = content.match(/(?:^|\n)## 来源与校订[\s\S]*$/m)?.[0] ?? content;
  const sourceMatch = /来源[：:]?[^\n]*?\((https:\/\/project\.feishu\.cn\/b\/helpcenter\/[^\s)#]+)\)/.exec(
    sourceSection,
  );
  if (sourceMatch) {
    return sourceMatch[1];
  }

  const urls = [...sourceSection.matchAll(/https:\/\/project\.feishu\.cn\/b\/helpcenter\/[^\s)#]+/g)];
  return urls.at(-1)?.[0] ?? null;
}

function categoryFor(sourcePath) {
  const [category] = sourcePath.split(path.sep);
  return sourcePath.includes(path.sep) ? category : "root";
}

function contentHash(content) {
  return createHash("sha256").update(content).digest("hex");
}

export async function buildReferenceManifest(sourceRoot) {
  const sources = [];

  for (const platform of platforms) {
    const platformDirectory = path.join(sourceRoot, platform.sourceDirectory);
    const files = await listMarkdownFiles(platformDirectory);

    for (const filePath of files) {
      const content = await readFile(filePath, "utf8");
      const sourcePath = path.relative(platformDirectory, filePath);
      sources.push({
        platform: platform.name,
        sourcePath: sourcePath.split(path.sep).join("/"),
        targetPath: path.posix.join(
          platform.targetDirectory,
          sourcePath.split(path.sep).join("/"),
        ),
        category: categoryFor(sourcePath),
        officialUrl: findOfficialUrl(content),
        contentHash: contentHash(content),
      });
    }
  }

  sources.sort(
    (left, right) =>
      left.platform.localeCompare(right.platform) || left.sourcePath.localeCompare(right.sourcePath, "zh-CN"),
  );

  const totals = {
    sourceDocuments: sources.length,
    withOfficialUrl: sources.filter((source) => source.officialUrl !== null).length,
    withoutOfficialUrl: sources.filter((source) => source.officialUrl === null).length,
    byPlatform: Object.fromEntries(
      platforms.map((platform) => {
        const platformSources = sources.filter((source) => source.platform === platform.name);
        return [
          platform.name,
          {
            sourceDocuments: platformSources.length,
            withOfficialUrl: platformSources.filter((source) => source.officialUrl !== null).length,
            withoutOfficialUrl: platformSources.filter((source) => source.officialUrl === null).length,
          },
        ];
      }),
    ),
  };

  return {
    schemaVersion: 1,
    generatedAt,
    sources,
    totals,
  };
}

async function main() {
  const sourceRoot = process.argv[2];
  if (!sourceRoot) {
    throw new Error("Usage: node catalog/build-reference-manifest.mjs <source-docs-root>");
  }

  const manifest = await buildReferenceManifest(path.resolve(repositoryRoot, sourceRoot));
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`Wrote ${manifest.totals.sourceDocuments} reference sources to catalog/reference-sources.json.\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
