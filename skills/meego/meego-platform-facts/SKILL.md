---
name: meego-platform-facts
description: Resolve Feishu Project extension points, OpenAPI endpoints, events, permissions, structured contracts, fixtures, and evidence status before plugin implementation or remote work.
---

# Meego Platform Facts

在需要确定飞书项目平台能力、请求与响应契约、点位语义、事件、权限或证据状态时使用。`$SKILL_DIR` 表示本 `SKILL.md` 所在的绝对目录；使用本 skill 随附的解析器和规范语料作为主来源。

1. 以最小、准确的能力短语执行 `node "$SKILL_DIR/resources/cli/meego.mjs" resolve <query>`。
2. 结果不唯一时收窄查询，或依据用户已提供的目标选择；不得任意挑选匹配项。
3. 选定 ID 后执行 `node "$SKILL_DIR/resources/cli/meego.mjs" show <capability-id>`。返回的 `docPath` 相对 `$SKILL_DIR/resources/`；再只阅读该规范页面、fixture 与证据状态。
4. 将 `verified`、`needs_runtime_validation`、`source_silent` 与 `deprecated` 视为不同的事实状态。频次只影响阅读排序，不构成平台承诺。

本地资料缺失、处于 `source_silent` 或 `needs_runtime_validation`，或需要时效性核验时，Call the Skill tool with `meego-plugin-operations`，由其控制 `lpm ai docs`。核验返回结果的标题和官方 URL，且不得以外部查询静默覆盖本地契约。

完成时应明确给出选定能力及其证据边界。不要在这里实现代码、推断业务语义，或为验证示例发起真实 OpenAPI 请求。
