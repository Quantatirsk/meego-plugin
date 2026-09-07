import { readFile } from "node:fs/promises";

import { registryPath } from "./paths.mjs";

export async function loadRegistry() {
  const content = await readFile(registryPath, "utf8");
  const registry = JSON.parse(content);

  if (!Array.isArray(registry.capabilities)) {
    throw new Error("catalog/registry.json must contain a capabilities array.");
  }

  return registry;
}

function normalize(value) {
  return String(value).toLocaleLowerCase("zh-CN").trim();
}

function capabilityText(capability) {
  return [
    capability.id,
    capability.kind,
    capability.title,
    ...(capability.tags ?? []),
    JSON.stringify(capability.contract ?? {}),
  ]
    .map(normalize)
    .join(" ");
}

function scoreCapability(capability, queryTokens) {
  const id = normalize(capability.id);
  const title = normalize(capability.title);
  const tags = new Set((capability.tags ?? []).map(normalize));
  const text = capabilityText(capability);

  return queryTokens.reduce((score, token) => {
    if (id === token) {
      return score + 100;
    }
    if (title === token) {
      return score + 80;
    }
    if (tags.has(token)) {
      return score + 60;
    }
    if (id.includes(token)) {
      return score + 40;
    }
    if (title.includes(token)) {
      return score + 30;
    }
    if (text.includes(token)) {
      return score + 10;
    }
    return score;
  }, 0);
}

export function findCapabilities(capabilities, query, kind) {
  const queryTokens = normalize(query).split(/\s+/).filter(Boolean);

  return capabilities
    .filter((capability) => !kind || capability.kind === kind)
    .map((capability) => ({
      capability,
      score: scoreCapability(capability, queryTokens),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.capability.id.localeCompare(right.capability.id),
    );
}

export function summarizeCapabilities(capabilities) {
  const summary = {
    total: capabilities.length,
    byKind: {},
    byStatus: {},
    byUsageFrequency: {},
  };

  for (const capability of capabilities) {
    summary.byKind[capability.kind] = (summary.byKind[capability.kind] ?? 0) + 1;
    summary.byStatus[capability.status] =
      (summary.byStatus[capability.status] ?? 0) + 1;
    summary.byUsageFrequency[capability.usageFrequency] =
      (summary.byUsageFrequency[capability.usageFrequency] ?? 0) + 1;
  }

  return summary;
}

export function buildCoverageMarkdown(registry) {
  const summary = summarizeCapabilities(registry.capabilities);
  const rows = registry.capabilities
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(
      (capability) =>
        `| ${capability.id} | ${capability.kind} | ${capability.usageFrequency} | ${capability.status} | [${capability.title}](../${capability.docPath}) |`,
    );

  return [
    "# 能力覆盖状态",
    "",
    `生成日期：${registry.generatedAt}`,
    "",
    "## 汇总",
    "",
    `- 能力总数：${summary.total}`,
    `- 已验证：${summary.byStatus.verified ?? 0}`,
    `- 官方未定义：${summary.byStatus.source_silent ?? 0}`,
    `- 待运行时验证：${summary.byStatus.needs_runtime_validation ?? 0}`,
    `- 已废弃：${summary.byStatus.deprecated ?? 0}`,
    "",
    "## 能力目录",
    "",
    "| ID | 类型 | 使用频次 | 状态 | 文档 |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}
