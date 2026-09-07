import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));

export const repositoryRoot = path.resolve(moduleDirectory, "../..");
export const sourceIndexPath = path.join(repositoryRoot, "catalog", "source-index.json");
export const documentSourceManifestPath = path.join(
  repositoryRoot,
  "catalog",
  "document-sources.json",
);
export const registryPath = path.join(repositoryRoot, "catalog", "registry.json");
export const capabilitySchemaPath = path.join(
  repositoryRoot,
  "schemas",
  "capability.schema.json",
);
export const fixtureSchemaPath = path.join(
  repositoryRoot,
  "schemas",
  "fixture.schema.json",
);
export const fixtureDirectory = path.join(repositoryRoot, "fixtures");
export const documentationDirectory = path.join(repositoryRoot, "docs");
export const reportDirectory = path.join(repositoryRoot, "reports");
export const coverageReportPath = path.join(reportDirectory, "coverage.md");
