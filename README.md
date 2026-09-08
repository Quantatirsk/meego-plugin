# meego-plugin

`meego-plugin` 是私有的飞书项目插件开发 skill 集。它只覆盖飞书项目的平台语义：插件点位、客户端 JSSDK、OpenAPI、事件、权限和插件生命周期；不包含行业业务规则或外部企业系统集成。

## 安装

本仓库直接由 `skills` CLI 从 GitHub 安装，不发布 npm 包。推荐使用：

```sh
npx skills@latest add Quantatirsk/meego-plugin
```

CLI 会引导选择安装位置和 skill。`meego-platform-facts` 是本地规范资料的依赖；开发或远端操作 skill 应与它一起安装。

## Skills

| Skill | 调用方式 | 责任 |
| --- | --- | --- |
| `meego-plugin` | 人工显式调用 | 选择当前工作流。 |
| `meego-platform-facts` | 模型或人工调用 | 从唯一语料解析点位、接口、结构化契约、fixture 与证据状态。 |
| `meego-plugin-development` | 模型或人工调用 | 在本地工程实现、修改、测试或诊断插件代码。 |
| `meego-plugin-operations` | 模型或人工调用 | 通过 `lpm` 执行插件托管配置、scope、构建、预览和发布操作。 |

四个 `SKILL.md` 只保留各自的路由与完成边界。每个可调用能力都有唯一文档、稳定锚点与高、中、低频标记；频次仅是本地使用痕迹的阅读优先级，不是官方承诺。

## Source Layout

`skills/meego/meego-platform-facts/resources/` 是唯一的运行时资料根，包含规范 Markdown、能力目录、脱敏 fixture 与不依赖 npm 的查询 CLI。维护期 provenance、schema、同步与校验工具位于 `maintainer/`，不会成为已安装 agent 的默认资料。

## Source Maintenance

维护源码 checkout 需要 Node.js 22+。修改平台资料后运行：

```sh
npm run docs:sync
npm test
npm run verify
```

维护边界与完整性要求见 `AGENTS.md`。
