---
name: meego-plugin-development
description: Implement, modify, test, or diagnose Feishu Project plugin code after selecting the relevant platform capabilities.
---

# Meego Plugin Development

在本地实现或修改飞书项目插件的前端、服务端或测试时使用。先 Call the Skill tool with `meego-platform-facts`，并以已选能力的规范资料为准。

- 仅为当前实现读取所选能力的资料、结构化契约和 fixture；不批量展开平台语料。
- 平台契约来自事实资料，业务名称、字段含义、流程和用户文案来自用户或目标工程。缺少其中任一依据时，不得补造默认行为。
- 按目标工程已有模式实现，并在本地运行与改动相称的检查。构建、上传或本地成功不等同于发布。
- 需要 `lpm`、托管配置、scope、预览、构建产物或发布时，Call the Skill tool with `meego-plugin-operations`；不要直接绕过该操作路径。

完成时保留能力资料与实现之间可追溯的对应关系，并说明未获证据支持的运行时验证项。
