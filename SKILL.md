---
name: meego-plugin
description: Develop, configure, debug, publish, or document Feishu Project plugins by resolving local platform knowledge first and routing lpm operations safely.
metadata:
  short-description: Resolve platform facts and operate plugins safely
---

# Meego 插件

当任务涉及飞书项目插件点位、客户端 JSSDK、OpenAPI、事件、插件配置、调试、发布或本仓库的平台资料时使用此技能。它不定义目标产品的业务行为。

通过 `npx skills@latest add Quantatirsk/meego-plugin -g -a codex --copy -y` 全局安装后，skill 位于 `$HOME/.agents/skills/meego-plugin`。项目级安装时，它位于目标项目的 `.agents/skills/meego-plugin`。先解析实际安装目录，再运行本地 CLI：

```sh
if [ -z "${MEEGO_PLUGIN_ROOT:-}" ]; then
  MEEGO_PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  for MEEGO_CANDIDATE in "$MEEGO_PROJECT_ROOT/.agents/skills/meego-plugin" "$HOME/.agents/skills/meego-plugin" "${CODEX_HOME:-$HOME/.codex}/skills/meego-plugin"; do
    if [ -f "$MEEGO_CANDIDATE/SKILL.md" ]; then
      export MEEGO_PLUGIN_ROOT="$MEEGO_CANDIDATE"
      break
    fi
  done
fi
test -f "${MEEGO_PLUGIN_ROOT:-}/cli/meego.mjs" || { echo "meego-plugin skill is not installed" >&2; exit 1; }
node "$MEEGO_PLUGIN_ROOT/cli/meego.mjs" resolve "work item create"
```

## 任务路由

先按任务意图选择下列路径。复合任务先解析所需平台能力；只在进入对应阶段时加载该阶段的参考页。

| 任务意图 | 立即动作 | 按需阅读 |
| --- | --- | --- |
| 发现平台能力、接口、点位、事件或契约 | 运行本地 `resolve` 命令，只打开它返回的唯一页面、锚点、schema 和 fixture | [导航](references/navigation.md#平台能力发现) |
| 在本地实现、修改、测试或调试插件 | 先解析涉及的能力，再在目标工程完成本地工作 | [开发工作流](references/development-workflow.md) |
| 执行任何 `lpm` 命令，包括 `lpm ai docs` | 在执行命令前阅读远端操作约束 | [远端操作](references/remote-operations.md) |
| 维护本仓库的规范文档、目录、fixture、schema 或校验 | 在唯一正文树中修改，并运行生成与校验链路 | [导航](references/navigation.md#文档维护) |

当一次任务同时包含本地实现和远端操作时，先完成能力解析与本地验证；在任何 `lpm` 命令前切换到“远端操作”。

## 证据边界

本地解析结果是平台事实的主来源。页面顶部的高、中、低频只决定查阅优先级，不是官方承诺；`source_silent` 页面不是平台契约。

- `verified`：实现已记录的契约。
- `needs_runtime_validation`：只实现已获支持的部分，并保留目标宿主中的验证项。
- `source_silent`：不得编造请求结构、行为或默认值。
- `deprecated`：除非用户明确需要兼容性，否则避免使用。

只有在本地资料缺失、处于 `source_silent` 或 `needs_runtime_validation` 状态，或资料对时效敏感时，才可使用 `lpm ai docs` 补充证据。核验返回内容的标题和官方 URL；它不得静默覆盖已解析的本地契约或填补无证据的缺口。

平台语义来自解析结果，业务语义来自用户或目标项目。不得从示例、能力名称或通用 SDK 习惯推断业务字段、流程或默认值。不得暴露凭据，也不得为验证示例自行执行真实 OpenAPI 请求。
