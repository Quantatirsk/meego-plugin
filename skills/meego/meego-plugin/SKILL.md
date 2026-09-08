---
name: meego-plugin
description: Start, extend, or deliver a Feishu Project plugin, from console configuration through client, OpenAPI, debugging, and release.
---

# Meego Plugin

用于飞书项目插件的首次开发和日常迭代。先判断工作从哪里开始，再只读取当前阶段需要的资料；不要把行业流程、外部系统或其他项目的字段当作平台默认行为。

| 当前情况 | 下一步 |
| --- | --- |
| 还没有插件工程 | 阅读 [快速开始](<../meego-platform-facts/resources/docs/plugin/guides/快速开始.md>)，依次完成环境、凭证、构成和 `lpm init`。 |
| 已有 `plugin.config.json`，需要实现或修复功能 | Call the Skill tool with `meego-plugin-development`。 |
| 需要确认点位、JSSDK、OpenAPI、事件、权限、请求或响应 | Call the Skill tool with `meego-platform-facts`。 |
| 需要同步构成、申请 scope、调试、构建、预览或发布 | Call the Skill tool with `meego-plugin-operations`。 |

新建插件的默认顺序是：配置开发环境，取得 Plugin ID 与 Plugin Secret，添加插件构成，初始化工程，按点位实现客户端；需要平台数据时再增加自建服务端并调用 OpenAPI。发布、安装和权限配置是后续的独立阶段，不能由本地构建成功推断完成。
