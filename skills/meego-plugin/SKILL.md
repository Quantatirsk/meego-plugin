---
name: meego-plugin
description: Start, extend, or deliver a Feishu Project plugin, from console configuration through client, OpenAPI, debugging, and release.
---

# Meego Plugin

用于飞书项目插件的首次开发和日常迭代。先按当前任务进入一条资料路径，只读取实现所需的页面；不要把行业流程、外部系统或其他项目的字段当作平台默认行为。

| 当前情况 | 下一步 |
| --- | --- |
| 还没有插件工程 | 阅读 [快速开始](docs/plugin/guides/快速开始.md)，完成环境、凭证、构成和 `lpm init`。 |
| 已有 `plugin.config.json`，需要实现或修复客户端 | 阅读 [客户端运行时](references/client-runtime.md)。 |
| 需要实现或排查 FastAPI、自建服务、凭证或 OpenAPI 代理 | 阅读 [服务边界](references/service-boundary.md)。 |
| 需要查询计划表配置列、基线、引用关系，或更新排期依赖 | 阅读 [OpenAPI 接入导读](docs/openapi/GUIDE.md#计划表查询路径)。 |
| 需要开发 AI 应用或接入插件体系 MCP | 从 [插件与客户端文档](docs/plugin/README.md) 进入对应指南。 |
| 需要测试、构建、宿主联调或交付检查 | 阅读 [验证路径](references/verification.md)。 |
| 需要同步构成、申请 scope、调试、构建、预览或发布 | 阅读 [`lpm` 生命周期](references/lpm-lifecycle.md)。 |

已有工程时，先检查 `plugin.config.json` 的 `resources[].id -> entry` 映射。新增构成必须先在控制台配置，再通过 `lpm update` 同步。资源点决定可用的 JSSDK namespace、上下文和 Web/Mobile 支持范围；不同点位不能因名称或 UI 相似而互相替代。

## 精确平台事实

优先使用随附本地资料，不凭记忆补造点位、JSSDK、OpenAPI、事件、权限、请求或响应。`$SKILL_DIR` 表示本文件所在 skill 的绝对目录。

```sh
node "$SKILL_DIR/cli/meego.mjs" guide "<query>"
node "$SKILL_DIR/cli/meego.mjs" resolve "<query>"
node "$SKILL_DIR/cli/meego.mjs" show "<capability-id>"
```

- `guide` 用于环境、凭证、插件构成、客户端或服务端开发主题。
- `resolve` 用于精确查找点位、JSSDK 方法、OpenAPI、事件、字段或权限。
- 多个结果匹配时，收窄查询或依据用户给出的目标选择；不得任意挑选。选定 capability ID 后执行 `show`，只读取其页面和所需示例。
- 高频、中频、低频表示本地生产调用频次推断，不表示官方稳定性或推荐程度。已废弃或明确待运行时确认的内容不能作为新实现的默认依据。
- 本地资料没有覆盖，或用户明确要求核对当前官方内容时，按 [`lpm` 生命周期](references/lpm-lifecycle.md) 使用 `lpm ai docs` 补充证据。它不能静默覆盖已确认的本地契约。

## 实现边界

- `pluginSecret` 只能保存在受控的本机 LPM 配置或服务端密钥配置中；不得进入浏览器运行时、前端产物、日志、fixture、Git 或 CI 输出。`plugin.config.json` 出现 `pluginSecret` 字段或长字符串不等于已发现明文泄漏：先确认它是否由 `lpm config set` 管理，再检查客户端源码和产物是否读取或包含实际密钥。平台访问凭证和刷新凭证始终只留在服务端。
- 只使用 JSSDK、宿主上下文和客户端交互的纯前端插件不需要运行时 Secret。只要需要用 Secret 换取凭证或调用 OpenAPI，就应增加服务端边界；构建时环境变量不能把 Secret 安全地注入浏览器。
- 写入工作项或字段前，先查询目标空间和工作项类型的元数据。显示名称、字段 key 与选项 value 不能互换。
- 长任务、轮询、流式连接和可取消请求需要终止条件、卸载清理与可见失败状态。
- 本地构建、上传、预览、发布和安装验证是不同状态。涉及远端配置、scope 或发布时遵守 [`lpm` 生命周期](references/lpm-lifecycle.md) 的确认规则。
