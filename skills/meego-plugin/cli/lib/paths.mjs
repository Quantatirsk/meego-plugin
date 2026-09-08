import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));

const knowledgeRoot = path.resolve(moduleDirectory, "../..");
export const capabilitiesPath = path.join(knowledgeRoot, "catalog", "capabilities.json");
