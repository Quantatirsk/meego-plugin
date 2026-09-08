---
name: meego-platform-facts
description: Locate exact Feishu Project extension-point, JSSDK, OpenAPI, event, permission, request, and response documentation for plugin development.
---

# Meego Platform Facts

在需要确定飞书项目平台能力、请求与响应契约、点位语义、事件或权限时使用。`$SKILL_DIR` 表示本 `SKILL.md` 所在的绝对目录；优先使用随附本地资料，不凭记忆补造接口参数或支持范围。

1. 创建工程、找 Plugin ID/Secret、添加构成、客户端与服务端安全策略等开发主题，先执行 `node "$SKILL_DIR/resources/cli/meego.mjs" guide <query>`。
2. 精确查点位、JSSDK 方法、OpenAPI、事件、字段或权限时，执行 `node "$SKILL_DIR/resources/cli/meego.mjs" resolve <query>`。
3. 结果不唯一时收窄查询，或依据用户已提供的目标选择；不得任意挑选匹配项。选定能力 ID 后执行 `node "$SKILL_DIR/resources/cli/meego.mjs" show <capability-id>`，只阅读返回的页面和其中需要的示例。
4. 高频、中频、低频表示本地项目中的调用优先级，不表示官方稳定性或推荐程度。已废弃或明确待运行时确认的内容不能作为新实现的默认依据。

本地资料没有覆盖、或用户明确要求核对当前官方内容时，Call the Skill tool with `meego-plugin-operations` 使用 `lpm ai docs`。它只用于补充或时效核验，不能静默覆盖本地文档中的已确认契约。

完成时给出选定页面、调用边界和仍需在真实宿主验证的条件。不要在这里实现代码、推断业务语义，或为文档示例发起真实 OpenAPI 请求。
