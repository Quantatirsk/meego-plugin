#!/usr/bin/env node

import {
  findCapabilities,
  loadCapabilities,
  summarizeCapabilities,
} from "./lib/catalog.mjs";
import { findGuides, loadGuides } from "./lib/guides.mjs";

function printUsage() {
  console.log(`Usage: meego <command> [options]

Commands:
  guide [query] [--format text|json]
  resolve <query> [--kind <kind>] [--format text|json]
  show <capability-id> [--format text|json]
  status [--format text|json]
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
  console.log(`Capabilities: ${status.total}`);
  console.log(`By kind: ${JSON.stringify(status.byKind)}`);
  console.log(`By status: ${JSON.stringify(status.byStatus)}`);
  console.log(`By usage frequency: ${JSON.stringify(status.byUsageFrequency)}`);
}

function printCapability(capability) {
  console.log(capability.id);
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

function printMatches(matches) {
  if (matches.length === 0) {
    console.log("No capabilities matched the query.");
    return;
  }

  console.log(`${matches.length} candidate(s). Use show <capability-id> after selecting one.`);
  for (const { capability } of matches.slice(0, 12)) {
    console.log(capability.id);
  }
}

function printGuides(guides) {
  if (guides.length === 0) {
    console.log("No development guide matched the query.");
    return;
  }

  for (const guide of guides) {
    console.log(guide.id);
    console.log(`  ${guide.title}`);
    console.log(`  ${guide.docPath}#${guide.docAnchor}`);
    console.log(`  ${guide.officialUrl}`);
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

  if (command === "guide") {
    const guides = findGuides(await loadGuides(), withoutOptions(argumentsList).join(" "));
    if (format === "json") {
      printJson(guides);
    } else {
      printGuides(guides);
    }
    return;
  }

  if (command === "resolve") {
    const query = withoutOptions(argumentsList).join(" ");
    if (!query) {
      throw new Error("resolve requires a query.");
    }
    const kind = optionValue(argumentsList, "--kind");
    const catalog = await loadCapabilities();
    const matches = findCapabilities(catalog.capabilities, query, kind);
    if (format === "json") {
      printJson(matches);
    } else {
      printMatches(matches);
    }
    return;
  }

  if (command === "show") {
    const capabilityId = withoutOptions(argumentsList).join(" ");
    if (!capabilityId) {
      throw new Error("show requires a capability ID.");
    }
    const catalog = await loadCapabilities();
    const capability = catalog.capabilities.find((item) => item.id === capabilityId);
    if (!capability) {
      throw new Error(`Unknown capability ID: ${capabilityId}`);
    }
    if (format === "json") {
      printJson(capability);
    } else {
      printCapability(capability);
    }
    return;
  }

  if (command === "status") {
    const catalog = await loadCapabilities();
    const status = summarizeCapabilities(catalog.capabilities);
    if (format === "json") {
      printJson(status);
    } else {
      printStatus(status);
    }
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

run().catch((error) => {
  console.error(`meego: ${error.message}`);
  process.exitCode = 1;
});
