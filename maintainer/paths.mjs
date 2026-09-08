import path from "node:path";
import { fileURLToPath } from "node:url";

const maintainerDirectory = path.dirname(fileURLToPath(import.meta.url));

export const repositoryRoot = path.resolve(maintainerDirectory, "..");
export const skillRoot = path.join(repositoryRoot, "skills", "meego-plugin");
export const skillEntrypointPath = path.join(skillRoot, "SKILL.md");
export const referencesDirectory = path.join(skillRoot, "references");
export const capabilitiesPath = path.join(skillRoot, "catalog", "capabilities.json");
export const documentationDirectory = path.join(skillRoot, "docs");
export const fixtureDirectory = path.join(skillRoot, "fixtures");
export const provenancePath = path.join(maintainerDirectory, "provenance", "document-sources.json");
export const capabilitySchemaPath = path.join(maintainerDirectory, "schemas", "capability.schema.json");
export const fixtureSchemaPath = path.join(maintainerDirectory, "schemas", "fixture.schema.json");
