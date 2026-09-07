---
name: meego-plugin
description: Develop, configure, debug, or publish Meego plugins by resolving local capability knowledge first and using lpm for platform operations.
metadata:
  short-description: Resolve platform facts and operate plugins safely
---

# Meego 插件

当 Meego 插件工作涉及平台能力、客户端 API、插件配置、服务端契约、调试或发布时使用此技能。它不是目标产品业务行为的来源。

## 从能力开始

1. 提取用户的预期结果及其所需的最小平台能力。
2. 在浏览仓库的平台文档或起草面向平台的代码前，针对该能力运行 `meego resolve`。
3. 只阅读解析器选出的能力包。先读核心能力资料、schema、fixture 和验证状态；示例或适配器只能作为实现参考。
4. 将解析器结果附随任务：它定义了适用于实现的事实、关联资料和未解决边界。

当任务涉及实现、配置、调试或服务端集成时，阅读[开发工作流](references/development-workflow.md)。任何可能变更插件平台的命令执行前，立即阅读[远端操作](references/remote-operations.md)。

选出的本地资料为主来源。仅对缺失、处于 `source_silent` 或 `needs_runtime_validation` 状态，或对时效敏感的资料使用 `lpm ai docs`。核验其标题和官方 URL，将它记录为补充证据，且不得让它静默修改已解析的本地契约或填补不受支持的缺口。

## 保持证据边界

平台语义来自已解析的能力包。业务语义来自用户或目标项目。不得从一方推导另一方。

- `verified`：实现已记录的契约。
- `needs_runtime_validation`：只实现已获支持的部分，并说明所需的运行时检查。
- `source_silent`：不得编造请求结构、行为或默认值；要求补充证据或不使用该能力。
- `deprecated`：除非用户明确需要兼容性且接受该约束，否则避免使用。

若所需事实缺失，将 `meego resolve` 查询收窄一至两次。仍然缺失时，停止依赖该事实的工作并简洁说明缺失项。不得用通用 SDK 知识、类似 API 或示例应用替代。

## 平台边界

插件生命周期和平台托管配置的远端操作均使用 `lpm`，包括创建插件、读取或修改点位配置、管理 scope、上传构建产物和发布。不得用 HTTP 工具、浏览器自动化、自定义 SDK 客户端或手写配置替代这些 `lpm` 操作。

插件自身的服务端可按已解析的 OpenAPI 契约实现运行时 HTTP 客户端；这不是 `lpm` 的替代路径，也不得用于管理插件托管配置。agent 不得为验证示例自行执行真实 OpenAPI 请求，除非用户明确要求该远端操作。

用户请求范围内的本地分析、代码编辑和本地验证可以直接进行。以下远端变更前，展示确切影响并等待明确确认：

- 创建插件；
- 推送点位或资源配置，尤其包含删除时；
- 应用或变更权限 scope；
- 更新插件元数据；
- 发布插件版本。

上传构建产物不是发布。不得将其中一项操作的批准视为另一项的批准。

不得暴露凭据、编造业务值，或在没有证据时声称平台事实。变更应聚焦于用户请求。
