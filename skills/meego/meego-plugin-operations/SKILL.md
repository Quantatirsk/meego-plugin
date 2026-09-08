---
name: meego-plugin-operations
description: Safely inspect or change Feishu Project plugin lifecycle and hosted configuration with lpm, including scopes, builds, previews, and releases.
---

# Meego Plugin Operations

在需要运行 `lpm`、检查或变更飞书项目托管插件配置、申请 scope、构建、预览或发布时使用。与平台能力契约有关时，先 Call the Skill tool with `meego-platform-facts`。

- 使用 `lpm --cwd <plugin-root> ...`，其中 `<plugin-root>` 必须来自目标工程或用户提供的路径。`lpm` 是插件生命周期与托管配置的唯一操作路径。
- 用户请求范围内的只读检查可以直接执行。每次远端变更前，说明具体命令及影响，并在紧邻实际变更时取得明确确认。
- 变更配置前获取完整远端基线，准备完整替换内容，检查 diff，并列出将删除的项。不得绕过 CLI 的删除保护。
- 构建或上传产物不代表获准发布；scope、元数据、点位或资源配置变更与发布均需要各自的明确确认。
- `lpm ai docs` 只能补充证据：核对标题和官方 URL，不得将缺失信息写成平台事实。不得泄露凭据或用直接 HTTP、浏览器操作替代 `lpm`。

完成时记录已执行的只读检查或已获确认的变更，并清晰区分本地构建、上传、预览与发布状态。
