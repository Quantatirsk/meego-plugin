---
name: meego-plugin
description: Choose the appropriate Feishu Project plugin development flow.
disable-model-invocation: true
---

# Meego Plugin

将此 skill 作为人工显式入口，用来选择飞书项目插件工作的正确路径。它只路由，不读取平台语料、不运行命令，也不修改工程或远端配置。

| 用户目标 | 下一步 |
| --- | --- |
| 确认某个点位、接口、事件、字段或契约 | 使用 `meego-platform-facts`。 |
| 新建、实现、修改、测试或排查本地插件代码 | 使用 `meego-plugin-development`。 |
| 读取或变更插件托管配置、scope、构建、预览或发布 | 使用 `meego-plugin-operations`。 |
| 维护本地平台知识语料 | 在源码 checkout 中遵循 `AGENTS.md`。 |

复合任务先进入 `meego-plugin-development`；只有工作到达托管配置或发布阶段时，才由它调用 `meego-plugin-operations`。平台业务语义始终来自用户或目标工程，不能由本路由推断。
