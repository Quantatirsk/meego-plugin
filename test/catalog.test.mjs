import test from "node:test";
import assert from "node:assert/strict";

import {
  findCapabilities,
  summarizeCapabilities,
  summarizeReferenceSources,
} from "../cli/lib/catalog.mjs";

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

test("summarizeReferenceSources distinguishes official pages from navigation pages", () => {
  assert.deepEqual(
    summarizeReferenceSources([
      { platform: "openapi", officialUrl: "https://project.feishu.cn/b/helpcenter/example" },
      { platform: "plugin", officialUrl: null },
      { platform: "openapi", officialUrl: "https://project.feishu.cn/b/helpcenter/another" },
    ]),
    {
      total: 3,
      withOfficialUrl: 2,
      sourceSilent: 1,
      byPlatform: {
        openapi: {
          total: 2,
          withOfficialUrl: 2,
          sourceSilent: 0,
        },
        plugin: {
          total: 1,
          withOfficialUrl: 0,
          sourceSilent: 1,
        },
      },
    },
  );
});
