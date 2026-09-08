# Open API 概述

飞书项目 OpenAPI 用于从服务端读取和操作飞书项目数据，包括空间、人员、工作项、字段、流程、评论和视图等。调用接口前，需要同时准备插件权限、访问凭证，以及接口要求的用户身份。

本文说明通用接入规则。具体接口的权限、参数、限流和业务限制，以对应接口文档为准。

**阅读导航**：[接入流程](#getting-started) · [身份与请求头](#authentication) · [请求地址](#request-url) · [调用限流](#rate-limits) · [数据格式](#data-formats) · [调试入口](#examples)

<a id="a7a0e99d"></a>
<a id="getting-started"></a>

## 接入流程

1. **创建插件并配置权限。** 在开放平台的插件详情页申请所需接口权限；开发调试时配置数据范围，正式使用时确认目标空间已安装具有相应权限的插件版本。详见[权限管理](权限管理.md)。
2. **获取访问凭证。** 根据调用场景选择插件凭证或用户凭证。两种凭证使用同一个请求头传递，但用户身份的提供方式不同，见下文。获取与刷新流程见[获取访问凭证](获取访问凭证.md)。
3. **确定资源标识。** 根据目标接口准备空间、工作项类型和实例等标识。空间的 `project_key` 可在飞书项目中双击空间图标获取。
4. **调用并检查结果。** 按接口定义发送请求，核对返回字段和业务错误码。首次联调可使用[官方 Postman 模板](Postman调用API.md)。

插件从创建到发布的完整流程，参见官方[开发并发布第一个插件](https://project.feishu.cn/b/helpcenter/1p8d7djs/nh4exbsn)。

<a id="56999bc8"></a>
<a id="a8e43b86"></a>
<a id="authentication"></a>

## 身份与请求头

### 选择调用身份

| 调用方式 | `X-Plugin-Token` 的值 | 用户身份如何提供 |
| --- | --- | --- |
| 插件身份调用 | `plugin_access_token`，旧称 `plugin_token` | 按目标接口要求传入 `X-User-Key` |
| 用户授权调用 | `user_access_token`，旧称 `user_plugin_token` | 用户身份包含在凭证中 |

开发调试使用的 `virtual_plugin_token` 属于插件凭证，其数据范围另受开发配置约束。凭证名称、获取方式及适用场景见[获取访问凭证](获取访问凭证.md)。

### 通用请求头

| 请求头 | 用途 | 填写规则 |
| --- | --- | --- |
| `Content-Type` | 声明请求体格式 | 通用 JSON 请求使用 `application/json`；文件上传等接口按各自定义填写 |
| `X-Plugin-Token` | 传递访问凭证 | 必填；可以是插件凭证或用户凭证 |
| `X-User-Key` | 指定插件凭证调用时的用户身份 | 通用表将其列为可选，具体是否必填取决于接口与凭证类型；用户标识可双击用户头像获取 |
| `X-Idem-UUID` | 标识一次写操作，供平台判断重复请求 | 可选；幂等判断范围为同一个 `X-Plugin-Token` 下的同一接口 |
| `x-auth-mode` | 控制部分只读接口的用户权限校验 | 可选；仅作用于文档列明的接口 |

不要把通用表中的“可选”理解为所有接口都允许省略 `X-User-Key`。例如，[获取用户详情](../api/获取用户详情.md)明确说明：使用插件凭证时无需传该请求头；其他接口应分别核对。

### 只读鉴权模式

使用插件凭证调用受支持的只读接口时，`x-auth-mode` 决定如何校验 `X-User-Key` 对应用户的读取权限：

| 值 | 行为 |
| --- | --- |
| `1` | 严格按指定用户鉴权，不返回该用户无权读取的资源 |
| `0` 或省略 | 采用兼容模式，可能获取到指定用户本身无权访问的内容 |

如果业务要求结果严格符合当前用户的可见范围，应使用受支持接口的强制鉴权模式。完整适用接口列表及用户凭证的行为见[x-auth-mode 模式说明](x-auth-mode鉴权模式.md)。

<a id="0c447a86"></a>
<a id="request-url"></a>

## 请求地址

OpenAPI 通常使用 REST 风格的路径。以下以获取空间业务线为例：

```text
https://{domain}/open_api/:project_key/business/all
```

| 部分 | 含义 | 如何填写 |
| --- | --- | --- |
| `{domain}` | 当前使用的飞书项目域名 | 例如 `project.feishu.cn` |
| `/open_api` | OpenAPI 路径前缀 | 按接口文档保留 |
| `:project_key` | 路径参数，代表空间标识 | 替换为实际空间的 `project_key`，不保留冒号 |
| `/business/all` | 接口的固定路径 | 按目标接口文档填写 |

原文中的完整 URL 示例是创建工作项接口：

```text
https://project.feishu.cn/open_api/projectkeyisme/work_item/create
```

其中 `projectkeyisme` 是示例空间标识，需要替换。`/work_item/create` 是固定路径，**不是查询参数**。查询参数位于 URL 的 `?` 之后；上述两个示例均未包含查询参数。

<a id="f3e3ed32"></a>
<a id="rate-limits"></a>

## 调用限流

默认限制是：**每个租户下，每个插件调用单个接口，最多 15 QPS**。以下接口另有明确限制。

### 同时受秒级和分钟级限制的接口

下列接口均为 `POST`，同时限制 **15 QPS 和 450 QPM**。满足秒级限制并不代表满足分钟级限制。

| 接口 | 路径 |
| --- | --- |
| [更新条件视图](../api/更新条件视图.md) | `/open_api/view/v1/update_condition_view` |
| [跨空间查询工作项](../api/获取指定的工作项列表（跨空间）.md) | `/open_api/work_items/filter_across_project` |
| [跨空间查询子任务](../api/获取指定的子任务列表（跨空间）.md) | `/open_api/work_item/subtask/search` |
| [单空间复杂条件查询](../api/获取指定的工作项列表（单空间-复杂传参）.md) | `/open_api/:project_key/work_item/:work_item_type_key/search/params` |
| [单空间查询工作项](../api/获取指定的工作项列表（单空间）.md) | `/open_api/:project_key/work_item/filter` |

### 限制为 5 QPS 的计划表接口

下列接口均为 `POST`。草稿操作和进度轮询接口各有自己的限流，调用方应分别控制频率。

| 接口 | 路径 |
| --- | --- |
| [创建草稿](../api/创建计划表草稿.md) | `/open_api/work_item/wbs_draft/create` |
| [查询创建进度](../api/创建计划表草稿进度查询.md) | `/open_api/work_item/wbs_draft_create/progress/query` |
| [更新草稿](../api/更新计划表草稿.md) | `/open_api/work_item/wbs_draft/patch/update` |
| [查询更新进度](../api/更新计划表草稿查询进度.md) | `/open_api/work_item/wbs_draft_patch/progress/query` |
| [发布草稿](../api/发布计划表草稿.md) | `/open_api/work_item/wbs_draft/publish` |
| [查询发布进度](../api/计划表草稿发布进度查询.md) | `/open_api/work_item/wbs_draft_publish/progress/query` |
| [重置草稿](../api/重置计划表草稿.md) | `/open_api/work_item/wbs_draft/reset` |
| [查询重置进度](../api/重置计划表草稿进度查询.md) | `/open_api/work_item/wbs_draft_reset/progress/query` |
| [查询草稿骨架](../api/查询全量计划表草稿骨架.md) | `/open_api/work_item/wbs_draft/structure/query` |
| [查询草稿行详情](../api/查询计划表草稿数据行详细信息.md) | `/open_api/work_item/wbs_draft/detail/query` |

### 不应遗漏的接口级限制

上述两张表来自概述原文，并非所有特殊限制的完整清单。核对关联文档时，还需关注：

| 场景 | 约束 | 依据 |
| --- | --- | --- |
| 批量更新字段及查询处理进度 | 各限制为 `1 QPS` | [批量更新](../api/批量更新工作项字段值.md)、[处理进度](../api/获取批量更新处理进度.md) |
| 查询关联工作项列表 | 公告列为 `10 QPS` | [限流调整公告](../support/OpenAPI限流调整公告-2025-05-12.md) |
| 查询度量图表明细 | 并发度为 `1`；HTTP 超时设置为 `60` 秒以上 | [度量图表明细](../api/获取度量图表明细数据.md) |

以上补充来自对应官方文档，不应仅根据本页的默认 `15 QPS` 为所有接口配置统一阈值。

<a id="96478d05"></a>
<a id="data-formats"></a>

## 数据格式与错误处理

| 需要解决的问题 | 参考文档 |
| --- | --- |
| 确认工作项、工作流、评论等对象的字段定义 | [数据结构汇总](../formats/数据结构汇总.md) |
| 区分属性和字段，并正确构造字段值 | [字段与属性解析格式](../formats/字段与属性解析格式.md) |
| 编写复杂筛选条件 | [搜索参数格式及常用示例](../formats/搜索参数格式及常用示例.md) |
| 解释接口返回的业务错误码 | [Open API 错误码](../formats/Open%20API%20错误码.md) |

<a id="3014a48a"></a>
<a id="examples"></a>

## 调试与继续阅读

- [使用 Postman 调用 API](Postman调用API.md)：导入环境与接口模板，并以创建 `story` 工作项验证调用流程。
- [服务端 SDK](服务端SDK.md)：查阅官方 Go、Java SDK 的安装与使用说明。
- [接口索引](../ENDPOINTS.md)：按 HTTP 方法与路径查找具体接口。
- [全部文档](../INDEX.md)：浏览当前收录范围。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/4bsmoql6
