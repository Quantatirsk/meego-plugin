# AI 节点数据结构

本篇定义 AI 节点相关的属性、字段、应用标识、子任务和编辑值结构。结构名和字段名按官方拼写保留，读结构与写结构之间不能仅凭名称相似直接互换。

**结构导航**：[AI_info](#4845cbe4) · [props](#5f5101f5) · [prop_value](#60738c57) · [表单字段](#2115a360) · [子任务](#9bfe01f1) · [关联子工作项](#5018cb64) · [编辑结构](#d69387c3)

<a id="4845cbe4"></a>

## AI_info：AI 属性与执行状态

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `props` | `list<props>` | AI 属性列表，元素结构见下节 |
| `status` | `string` | AI 运行状态；本结构表没有列出状态枚举 |
| `app_identity` | `object` | AI 应用与点位标识，见 [app_identity](#7a9f175c) |

状态枚举与触发条件需要结合[AI 节点事件](AI节点事件.md)及具体读写接口；这里不将其他结构中的状态字段自动改名为 `status`。

<a id="5f5101f5"></a>

### props：单个属性

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `prop_key` | `string` | 属性键，例如 `prop_key_1` |
| `prop_type` | `string` 或 `list<string>` | 属性类型，兼容单值与列表形式 |
| `prop_value` | `prop_value` | 属性值对象，结构见下节 |

读取 `prop_type` 时兼容单字符串与字符串数组；内部统一使用列表可简化处理。

<a id="60738c57"></a>

### prop_value：属性引用的字段值

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `field` | `list<field>` | 普通字段列表 |
| `node_field` | `list<node_field>` | 节点字段列表 |

<a id="9490d5b3"></a>

#### field：普通字段元素

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `value` | `string` | 字段值 |
| `field_key` | `string` | 字段键，按[查询接口](获取AI节点信息.md)定义统一 |
| `field_type` | `string` | 字段类型 |

<a id="5c79654e"></a>

#### node_field：节点字段元素

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `value` | `string` | 字段值 |
| `field_key` | `string` | 字段键 |
| `field_type` | `string` | 字段类型 |

两个元素分别属于 `field` 与 `node_field` 列表，字段标识统一为 `field_key`，与[获取 AI 节点信息](获取AI节点信息.md)的实际接口定义一致。

<a id="7a9f175c"></a>

### app_identity：AI 应用标识

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `app_key` | `string` | AI 应用 key |
| `point_key` | `string` | AI 应用的节点 key |

<a id="2115a360"></a>

## conform_fields：表单字段

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `value` | `string` | 字段值 |
| `field_key` | `string` | 字段键 |
| `field_name` | `string` | 字段名称 |
| `field_type` | `string` | 字段类型 |

结构名为 `conform_fields`，读写字段键均为 `field_key`；写入时仍应按编辑结构选择允许提交的字段，不直接提交整个读取对象。

<a id="9bfe01f1"></a>

## sub_tasks：子任务状态

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `task_id` | `int64` | 子任务 ID |
| `is_finished` | `boolean` | `true` 表示已完成，`false` 表示未完成 |

<a id="5018cb64"></a>

## sub_workitems：关联子工作项

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `relation_id` | `string` | 关联 ID |
| `workitem_ids` | `list<string>` | 关联的子工作项 ID 列表 |
| `work_item_type` | `string` | 关联工作项类型 |

注意本结构的键是 `workitem_ids`，类型为字符串列表；其他接口可能使用 `work_item_ids` 和数值列表，应按各自定义构造参数。

<a id="d69387c3"></a>

## IEditAINode：编辑值结构

原文在 `IEditAINode` 下定义了两种子结构，没有在本页列出完整的顶层请求字段。实际修改请求还需参见[修改 AI 节点数据](修改AI节点数据.md)。

<a id="b081a57e"></a>

### Edit_Node_Field

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `value` | `string` | 节点字段值 |
| `node_field_key` | `string` | 节点字段键 |

<a id="8326839f"></a>

### Edit_Conform_Field

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `value` | `string` | 表单字段值 |
| `field_key` | `string` | 表单字段键 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/bw18ioud
