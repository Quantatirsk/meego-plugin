# meego-plugin

`meego-plugin` 是面向飞书项目插件开发的私有、平台中性知识基础设施。它只覆盖飞书项目的插件点位、客户端 JSSDK、OpenAPI、事件、凭证、权限、字段、工作项、视图与 AI 能力。

## Structure

| 路径 | 用途 |
| --- | --- |
| `docs/` | 唯一的规范文档树：OpenAPI 163 篇，插件与客户端 75 篇。 |
| `catalog/` | 能力索引、来源映射和生成脚本。 |
| `fixtures/` | 脱敏的请求、响应、运行时和事件示例。 |
| `schemas/` | 能力与 fixture 的 JSON Schema。 |
| `cli/` | 本地 `meego` 检索、报告与校验命令。 |
| `SKILL.md` 与 `references/` | 可由 `skills` CLI 发现的统一 skill 入口、任务路由与操作边界。 |

每个可调用能力指向一份唯一文档及稳定锚点，并标为高、中或低频。频次来自本地插件使用痕迹的静态推断，只用于查阅顺序；未直接调用的导读、格式和目录页明确标为无直接调用频次。

## 作为 Skill 安装

本仓库直接作为私有 GitHub skill 源，不发布或安装 npm 包。标准安装命令为：

```sh
npx skills@latest add Quantatirsk/meego-plugin -g -a codex --copy -y
```

在当前 `skills` CLI 中，它会将全局 Codex skill 复制到 `$HOME/.agents/skills/meego-plugin`；不带 `-g` 时则安装到当前项目的 `.agents/skills/meego-plugin`。交互式安装可省略其余 flag：

```sh
npx skills@latest add Quantatirsk/meego-plugin
```

私有仓库访问沿用 Git、GitHub CLI 或 SSH 的既有认证。安装后，agent 从根目录 `SKILL.md` 开始，先使用本地 `resolve` 找到唯一规范页面，再按 `references/` 的任务路由处理开发、远端操作或文档维护。

`skills` 会浅克隆仓库后复制根目录 skill，因此会同时带上完整的 Markdown 文档、索引、fixture、schema 和原始视觉资产；不依赖 npm 包安装器。

## 源码维护

以下命令仅供维护此源码 checkout 的资料、索引与校验使用，需要 Node.js 22+、Python 3 与 Bash。它们只解析示例，不会执行其中的请求。

```sh
npm install
npm run catalog:build
npm run docs:sync
npm run meego -- status
npm run meego -- resolve work-item create
npm run docs:render
npm run verify
```

`meego` 不会登录、保存凭证或修改飞书项目。插件创建、配置、权限、构建、调试与发布均使用 `lpm`。`npx skills` 安装后的 `resolve` 与 `status` 无需 npm 安装依赖即可使用。

## Source Policy

`catalog/document-sources.json` 逐页记录规范正文的官方 URL 与内容哈希。231 篇页面有独立官方 URL，另有 7 篇本地导航或覆盖页明确使用 `source_silent`。每篇来源页底部只保留更新时间和官方 URL；原始采集快照、来源工作区文件、租户数据和凭证均不进入版本控制。
