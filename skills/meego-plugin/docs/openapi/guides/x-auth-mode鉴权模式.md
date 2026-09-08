# x-auth-mode 模式说明

`x-auth-mode` 控制部分只读接口在使用插件凭证时，是否严格按 `X-User-Key` 指定的用户校验读取权限。它不是全部 OpenAPI 的通用权限开关，也不会扩大插件已获授权的接口范围。

**阅读导航**：[适用范围](#scope) · [模式对比](#modes) · [请求示例](#examples) · [支持接口](#supported-endpoints) · [常见问题](#faq)

<a id="rvlF2sWKty"></a>
<a id="scope"></a>

## 适用范围

| 使用场景 | `x-auth-mode` 是否生效 |
| --- | --- |
| `plugin_access_token` 调用下文列出的只读接口 | 生效 |
| `virtual_plugin_token` 调用下文列出的只读接口 | 生效；仍受开发数据范围限制 |
| 使用 `user_access_token` | 不改变鉴权方式，始终按凭证对应用户的身份严格鉴权 |
| 写接口或未列出的读接口 | 不生效 |

不要把“读接口”与 `GET` 等同。本页支持清单中包含多个使用 `POST` 的查询接口。

<a id="modes"></a>
<a id="385d8810"></a>

## 两种模式的区别

| 请求头设置 | 鉴权行为 | 对返回数据的影响 |
| --- | --- | --- |
| `x-auth-mode: 1` | 按 `X-User-Key` 对应用户严格校验 | 不返回该用户无读取权限的资源；权限不足时可能返回权限相关错误 |
| `x-auth-mode: 0` | 兼容模式 | 平台可能忽略 `X-User-Key`，使用内部虚拟身份读取数据 |
| 不传 `x-auth-mode` | 与 `0` 相同 | 可能返回超出该用户本身访问范围的数据 |

需要代表某个具体用户展示数据时，应选择强制鉴权，并传入该用户的 `X-User-Key`。原文也将后台任务的数据读取列为兼容模式的使用场景，但这不意味着其结果符合某个指定用户的可见范围。

<a id="h11oBY1KrH"></a>
<a id="97e898d3"></a>
<a id="examples"></a>

## 请求示例

以下两段都调用[获取工作项详情](../api/获取工作项详情.md)，只改变鉴权模式。空间、工作项类型、用户标识、实例 ID 和凭证均需替换为实际值。

原文示例误将 `field_values`、`order_by` 用作这个详情接口的请求体；这里按详情接口定义改为必填的 `work_item_ids`。同一请求最多传入 50 个实例 ID。

<a id="Mn870FGFaB"></a>

### 强制鉴权

```bash
curl --location \
  'https://project.feishu.cn/open_api/project_key_example/work_item/story/query' \
  --header "X-Plugin-Token: ${PLUGIN_ACCESS_TOKEN}" \
  --header "X-User-Key: ${USER_KEY}" \
  --header 'x-auth-mode: 1' \
  --header 'Content-Type: application/json' \
  --data '{"work_item_ids": [1234567890]}'
```

### 兼容模式

```bash
curl --location \
  'https://project.feishu.cn/open_api/project_key_example/work_item/story/query' \
  --header "X-Plugin-Token: ${PLUGIN_ACCESS_TOKEN}" \
  --header "X-User-Key: ${USER_KEY}" \
  --header 'x-auth-mode: 0' \
  --header 'Content-Type: application/json' \
  --data '{"work_item_ids": [1234567890]}'
```

省略 `x-auth-mode` 与显式传 `0` 的行为相同。两种模式都需要正确的凭证与业务参数，不能把兼容模式当作绕过接口授权或参数校验的机制。

<a id="cG8bKSWIFx"></a>
<a id="506b07c4"></a>
<a id="supported-endpoints"></a>

## 支持强制鉴权的接口

以下保留原文列出的全部 **20 个接口**，按业务对象分组。未出现在本表中的接口，不能仅根据“也是查询接口”推断其支持 `x-auth-mode`。

### 工作项查询

| 接口 | 方法 | 路径 |
| --- | --- | --- |
| [获取工作项详情](../api/获取工作项详情.md) | `POST` | `/open_api/:project_key/work_item/:work_item_type_key/query` |
| [单空间查询](../api/获取指定的工作项列表（单空间）.md) | `POST` | `/open_api/:project_key/work_item/filter` |
| [跨空间查询](../api/获取指定的工作项列表（跨空间）.md) | `POST` | `/open_api/work_items/filter_across_project` |
| [关联工作项查询](../api/获取指定的关联工作项列表（单空间）.md) | `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/search_by_relation` |
| [单空间复杂条件查询](../api/获取指定的工作项列表（单空间-复杂传参）.md) | `POST` | `/open_api/:project_key/work_item/:work_item_type_key/search/params` |
| [全局搜索](../api/获取指定的工作项列表（全局搜索）.md) | `POST` | `/open_api/compositive_search` |

### 工作流、子任务与评论

| 接口 | 方法 | 路径 |
| --- | --- | --- |
| [获取工作流详情](../api/获取工作流详情.md) | `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/query` |
| [获取 WBS 工作流](../api/获取工作流详情（WBS）.md) | `GET` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/wbs_view` |
| [获取子任务详情](../api/获取子任务详情.md) | `GET` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/task` |
| [跨空间搜索子任务](../api/获取指定的子任务列表（跨空间）.md) | `POST` | `/open_api/work_item/subtask/search` |
| [旧版评论查询](../api/查询评论（不再维护）.md) | `GET` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comments` |

支持清单中列的是旧版评论查询接口，该接口已不再维护。不能据此认定新的评论查询接口也支持这个请求头。

### 视图、配置与空间关联

| 接口 | 方法 | 路径 |
| --- | --- | --- |
| [非全景视图工作项](../api/获取视图下工作项列表（非全景视图）.md) | `GET` | `/open_api/:project_key/fix_view/:view_id` |
| [全景视图工作项](../api/获取视图下工作项列表（全景视图）.md) | `POST` | `/open_api/:project_key/view/:view_id` |
| [视图列表与配置](../api/获取视图列表及配置信息.md) | `POST` | `/open_api/:project_key/view_conf/list` |
| [工作项类型列表](../api/获取空间下工作项类型.md) | `GET` | `/open_api/:project_key/work_item/all-types` |
| [创建工作项元数据](../api/获取创建工作项元数据.md) | `GET` | `/open_api/:project_key/work_item/:work_item_type_key/meta` |
| [工作项关系列表](../api/获取工作项关系列表.md) | `GET` | `/open_api/:project_key/work_item/relation` |
| [流程模板列表](../api/获取工作项下的流程模板列表.md) | `GET` | `/open_api/:project_key/template_list/:work_item_type_key` |
| [流程模板详情](../api/获取流程模板配置详情.md) | `GET` | `/open_api/:project_key/template_detail/:template_id` |
| [空间关联规则](../api/获取空间关联规则列表.md) | `POST` | `/open_api/:project_key/relation/rules` |

<a id="LASPfFhC2Y"></a>
<a id="03da6f4e"></a>
<a id="faq"></a>

## 常见问题

<a id="128e38ea"></a>

### 什么时候使用 `1`？

当返回结果必须符合某个具体用户的访问权限时。例如，插件代表当前用户展示其可见的工作项，应传入该用户的 `X-User-Key` 并启用强制鉴权。

<a id="0e3fda7b"></a>

### 不传这个请求头会怎样？

对支持清单内、使用插件凭证的查询，默认进入兼容模式，可能返回用户自身无权访问的数据。对写接口和清单外的读接口，不传或传入该请求头都不会改变其原有鉴权规则。

<a id="6e5c0573"></a>

### 用户凭证可以切换成兼容模式吗？

不能。使用 `user_access_token` 时，平台始终按该凭证代表的用户身份严格鉴权；`x-auth-mode` 不改变这一行为。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/x7bjo7aw
