#!/usr/bin/env node

import path from "node:path";

import {
  findCapabilities,
  loadDocumentSources,
  loadRegistry,
  summarizeCapabilities,
  summarizeDocumentSources,
} from "./lib/catalog.mjs";
import { renderCoverageReport, verifyRepository } from "./lib/verify.mjs";
import { repositoryRoot } from "./lib/paths.mjs";

function printUsage() {
  console.log(`Usage: meego <command> [options]

Commands:
  resolve <query> [--kind <kind>] [--format text|json]
  status [--format text|json]
  render
  verify
`);
}

function optionValue(argumentsList, option) {
  const index = argumentsList.indexOf(option);
  if (index === -1) {
    return undefined;
  }
  const value = argumentsList[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value.`);
  }
  return value;
}

function withoutOptions(argumentsList) {
  const values = [];
  for (let index = 0; index < argumentsList.length; index += 1) {
    const value = argumentsList[index];
    if (["--kind", "--format"].includes(value)) {
      index += 1;
      continue;
    }
    values.push(value);
  }
  return values;
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function printStatus(status) {
  const { capabilities, documentation } = status;
  console.log(`Repository: ${repositoryRoot}`);
  console.log(`Capabilities: ${capabilities.total}`);
  console.log(`By kind: ${JSON.stringify(capabilities.byKind)}`);
  console.log(`By status: ${JSON.stringify(capabilities.byStatus)}`);
  console.log(`By usage frequency: ${JSON.stringify(capabilities.byUsageFrequency)}`);
  console.log(`Documentation pages: ${documentation.total}`);
  console.log(`Documentation pages with official URL: ${documentation.withOfficialUrl}`);
  console.log(`Documentation navigation pages: ${documentation.sourceSilent}`);
  console.log(`Documentation pages by platform: ${JSON.stringify(documentation.byPlatform)}`);
}

function printMatches(matches) {
  if (matches.length === 0) {
    console.log("No capabilities matched the query.");
    return;
  }

  for (const { capability, score } of matches.slice(0, 12)) {
    console.log(`${capability.id} (${score})`);
    console.log(`  ${capability.title}`);
    console.log(`  ${capability.kind} | ${capability.usageFrequency} | ${capability.status}`);
    console.log(`  ${capability.docPath}#${capability.docAnchor}`);
    console.log(`  ${capability.officialUrl}`);
    if (capability.fixtureIds?.length) {
      console.log(`  Fixtures: ${capability.fixtureIds.join(", ")}`);
    }
    if (capability.related?.length) {
      console.log(`  Related: ${capability.related.join(", ")}`);
    }
  }
}

async function run() {
  const [command, ...argumentsList] = process.argv.slice(2);
  const format = optionValue(argumentsList, "--format") ?? "text";

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printUsage();
    return;
  }

  if (!["text", "json"].includes(format)) {
    throw new Error("--format must be text or json.");
  }

  if (command === "resolve") {
    const query = withoutOptions(argumentsList).join(" ");
    if (!query) {
      throw new Error("resolve requires a query.");
    }
    const kind = optionValue(argumentsList, "--kind");
    const registry = await loadRegistry();
    const matches = findCapabilities(registry.capabilities, query, kind);
    if (format === "json") {
      printJson(matches);
    } else {
      printMatches(matches);
    }
    return;
  }

  if (command === "status") {
    const [registry, documentSources] = await Promise.all([
      loadRegistry(),
      loadDocumentSources(),
    ]);
    const status = {
      capabilities: summarizeCapabilities(registry.capabilities),
      documentation: summarizeDocumentSources(documentSources),
    };
    if (format === "json") {
      printJson(status);
    } else {
      printStatus(status);
    }
    return;
  }

  if (command === "render") {
    const reportPath = await renderCoverageReport();
    console.log(`Wrote ${path.relative(repositoryRoot, reportPath)}.`);
    return;
  }

  if (command === "verify") {
    const result = await verifyRepository();
    for (const warning of result.warnings) {
      console.warn(`Warning: ${warning}`);
    }
    if (result.errors.length > 0) {
      for (const error of result.errors) {
        console.error(`Error: ${error}`);
      }
      process.exitCode = 1;
      return;
    }
    console.log(
      `Verified ${result.capabilityCount} capabilities, ${result.fixtureCount} fixtures, and ${result.documentCount} documents.`,
    );
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(`meego: ${error.message}`);
  process.exitCode = 1;
});
