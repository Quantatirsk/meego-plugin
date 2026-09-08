import test from "node:test";
import assert from "node:assert/strict";

import {
  findCapabilities,
  summarizeCapabilities,
} from "../skills/meego-plugin/cli/lib/catalog.mjs";
import { findGuides } from "../skills/meego-plugin/cli/lib/guides.mjs";
import {
  documentMetadataIsCurrent,
  renderDocumentMetadata,
  replaceDocumentMetadata,
  validateDocumentMetadata,
} from "../maintainer/sync-document-metadata.mjs";

const capabilities = [
  {
    id: "plugin-point.control",
    kind: "plugin_point",
    title: "Control",
    tags: ["control", "plugin"],
    status: "verified",
    usageFrequency: "high",
  },
  {
    id: "openapi.work-item.update",
    kind: "http_api",
    title: "Update Work Item",
    tags: ["work-item", "update"],
    status: "needs_runtime_validation",
    usageFrequency: "medium",
  },
];

test("findCapabilities prioritizes an exact capability ID", () => {
  const matches = findCapabilities(capabilities, "plugin-point.control");

  assert.equal(matches.length, 1);
  assert.equal(matches[0].capability.id, "plugin-point.control");
});

test("findCapabilities filters by kind", () => {
  const matches = findCapabilities(capabilities, "update", "http_api");

  assert.equal(matches.length, 1);
  assert.equal(matches[0].capability.id, "openapi.work-item.update");
});

test("summarizeCapabilities groups stable dimensions", () => {
  assert.deepEqual(summarizeCapabilities(capabilities), {
    total: 2,
    byKind: {
      plugin_point: 1,
      http_api: 1,
    },
    byStatus: {
      verified: 1,
      needs_runtime_validation: 1,
    },
    byUsageFrequency: {
      high: 1,
      medium: 1,
    },
  });
});

test("findGuides routes setup and credential queries to a focused document", () => {
  const guides = [
    {
      id: "plugin.bootstrap",
      title: "Start a plugin",
      tags: ["environment", "lpm init"],
    },
    {
      id: "plugin.credentials",
      title: "Plugin ID and Plugin Secret",
      tags: ["app key", "plugin secret"],
    },
  ];

  assert.deepEqual(
    findGuides(guides, "plugin secret").map((guide) => guide.id),
    ["plugin.credentials"],
  );
  assert.deepEqual(
    findGuides(guides, "").map((guide) => guide.id),
    ["plugin.bootstrap", "plugin.credentials"],
  );
});

test("document metadata exposes frequency only for callables", () => {
  const callableMetadata = renderDocumentMetadata(
    "/workspace/docs/plugin/jssdk/storage.md",
    [
      {
        id: "jssdk.storage.get-item",
        title: "storage.getItem",
        docAnchor: "capability-jssdk.storage.get-item",
        usageFrequency: "high",
        status: "verified",
        fixtureIds: ["jssdk.storage.get-item.fixture"],
      },
    ],
    new Map([["jssdk.storage.get-item.fixture", "/workspace/fixtures/jssdk/storage-get-item.json"]]),
  );
  const guideMetadata = renderDocumentMetadata(
    "/workspace/docs/openapi/guides/OpenAPI概述.md",
    [],
    new Map(),
  );

  assert.match(callableMetadata, /capability-jssdk\.storage\.get-item/);
  assert.match(callableMetadata, /频次：高/);
  assert.match(callableMetadata, /fixtures\/jssdk\/storage-get-item\.json/);
  assert.equal(guideMetadata, "");
  const inserted = replaceDocumentMetadata("# Example\n\nBody\n", callableMetadata);
  assert.match(inserted, /# Example\n\n<!-- capability-metadata:start -->/);
  assert.equal(documentMetadataIsCurrent(inserted, callableMetadata), true);
});

test("document metadata sync removes guide blocks and reports missing pages", async () => {
  const metadata = renderDocumentMetadata("/workspace/docs/example.md", [], new Map());
  const legacyMetadata = [
    "<!-- capability-metadata:start -->",
    "## Capability metadata",
    "<!-- capability-metadata:end -->",
  ].join("\n");
  const duplicated = `# Example\n\n${legacyMetadata}\n\n${legacyMetadata}\n\nBody\n`;
  const synchronized = replaceDocumentMetadata(duplicated, metadata);

  assert.equal(
    (synchronized.match(/<!-- capability-metadata:start -->/gu) ?? []).length,
    0,
  );
  assert.equal(documentMetadataIsCurrent(synchronized, metadata), true);
  assert.equal(documentMetadataIsCurrent(duplicated, metadata), false);

  const missingTargetPath = `docs/__missing-metadata-${process.pid}.md`;
  const errors = await validateDocumentMetadata(
    { sources: [{ targetPath: missingTargetPath }] },
    { capabilities: [] },
  );
  assert.deepEqual(errors, [
    `${missingTargetPath}: capability metadata cannot be validated because the canonical document is missing.`,
  ]);
});
