import path from "node:path";
import { fileURLToPath } from "node:url";

const maintainerDirectory = path.dirname(fileURLToPath(import.meta.url));

export const repositoryRoot = path.resolve(maintainerDirectory, "..");
export const resourceRoot = path.join(
  repositoryRoot,
  "skills",
  "meego",
  "meego-platform-facts",
  "resources",
);
export const capabilitiesPath = path.join(resourceRoot, "catalog", "capabilities.json");
export const documentationDirectory = path.join(resourceRoot, "docs");
export const fixtureDirectory = path.join(resourceRoot, "fixtures");
export const provenancePath = path.join(maintainerDirectory, "provenance", "document-sources.json");
export const capabilitySchemaPath = path.join(maintainerDirectory, "schemas", "capability.schema.json");
export const fixtureSchemaPath = path.join(maintainerDirectory, "schemas", "fixture.schema.json");
