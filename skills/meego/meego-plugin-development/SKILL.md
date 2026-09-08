---
name: meego-plugin-development
description: Implement, modify, test, or diagnose Feishu Project plugin code after selecting the relevant platform capabilities.
---

# Meego Plugin Development

在本地实现、修改、测试或排查飞书项目插件代码时使用。先 Call the Skill tool with `meego-platform-facts`，只读取当前点位、接口或事件所需的资料、结构化契约和 fixture。

## 起步

1. 找到实际源码 checkout 和插件工程根目录。仅检查 `plugin.config.json` 中 `resources[].id -> entry` 的映射；它是宿主加载契约，不是业务数据来源。`resources` 为空时，不得凭空新建前端。
2. 将工作归为前端、服务端或全栈。前端代码必须在受版本控制的源码工程中维护；自建服务端可以是独立工程。托管配置与源码所有权不能混为同一件事。
3. 平台契约来自事实资料，业务名称、字段含义、流程和文案来自用户或目标工程。缺少任一依据时，不得补造默认行为。

## 硬约束

- 资源点决定 JSSDK namespace、必需上下文和 Web/Mobile 支持范围。不同 ResourceId 可以有意复用同一个入口，但不能破坏现有映射。
- `plugin_secret`、平台访问凭证和刷新凭证只能留在服务端受控环境；不能进入浏览器产物、存储、日志、fixture、错误消息或生成的上传脚本。
- 写工作项或字段前，先获取该空间和工作项类型的元数据；显示名称、字段 key 与选项 value 不能互相替代。
- 长任务、轮询、流式连接和可取消请求必须有终止条件、卸载清理和可见失败状态。
- 构建配置必须可复现且不修改受版本控制的源码；本地构建、上传、预览、发布和安装验证是不同状态。

## 按需阅读

| 当前工作 | 继续读取 |
| --- | --- |
| React、TypeScript、JSSDK、字段写回或异步 UI | [客户端运行时](references/client-runtime.md) |
| FastAPI、自建服务、凭证、OpenAPI 调用或长任务后端 | [服务边界](references/service-boundary.md) |
| 测试、构建、宿主联调或发布前检查 | [验证路径](references/verification.md) |
| `lpm`、托管配置、scope、预览、构建产物或发布 | Call the Skill tool with `meego-plugin-operations`。 |

按目标工程已有的技术栈和检查命令实现。完成时保留能力资料与实现的对应关系，并说明尚未在真实宿主中验证的运行时条件。
