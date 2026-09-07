# meego-plugin

`meego-plugin` 是用于飞书项目插件开发的私有、平台中性知识系统。它提供全量本地平台参考、类型化能力契约、高频能力的完整示例 fixture、确定性的本地 CLI 与 Codex 适配层。

它只覆盖飞书项目平台能力：

- 插件点位、客户端运行时与 JSSDK API。
- 飞书项目 OpenAPI、权限、凭证、文件、字段、工作项与视图。
- 事件、Webhook 验签，以及 AI 节点、字段和操作能力。

它不包含外部企业系统集成、产品特定业务流程、租户凭证或官方原始文档快照。

## Structure

| 路径 | 用途 |
| --- | --- |
| `catalog/` | 机器可读的能力目录与关系。 |
| `schemas/` | 能力和 fixture 契约的 JSON Schema。 |
| `fixtures/` | 平台中性的请求、响应、运行时和事件示例。 |
| `docs/` | 高频能力的精修导读、契约与示例入口。 |
| `docs/reference/` | 全量平台参考页：OpenAPI 163 篇、插件与客户端 75 篇。 |
| `cli/` | 本地 `meego` 检索、报告、渲染与校验命令。 |
| `adapters/codex/` | Codex 原生 `meego-plugin` skill。 |

## Commands

本地校验器需要 Node.js 22+、Python 3 与 Bash。它只解析示例，不会执行其中的请求。

```sh
npm install
npm run catalog:build
npm run meego -- status
npm run meego -- resolve control
npm run docs:render
npm run verify
```

`meego` 不会登录、保存凭证或修改飞书项目。插件创建、配置、权限、构建、调试与发布均使用 `lpm`。

## Source Policy

资料分为两层：高频能力页提供经核对的契约和 fixture；`docs/reference/` 保留按官方页面逐篇整理的完整平台资料及正文必要资源。后者由 `catalog/reference-sources.json` 逐页映射：231 篇带官方 URL，7 篇本地导航页明确标为 `source_silent`。

每篇有官方来源的资料底部只保留更新时间和官方 URL。原始采集快照、来源工作区文件、租户数据和凭证均不进入版本控制。
