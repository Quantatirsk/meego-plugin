# 获取 AI 节点信息

查询指定工作项上的 AI 节点及业务上下文，包括节点状态、AI 属性配置、节点字段、表单、子任务和关联子工作项。创建 AI 节点后自动授权，适用范围见[AI 节点权限说明](AI节点权限说明.md)。

业务数据位于响应的 `data` 对象中，下面按完整响应层级组织字段。

<a id="请求说明"></a>

## 请求定义

**请求方式**：`POST`
**请求地址**：`/open_api/ai_node/query`

<a id="请求参数"></a>
<a id="header"></a>

### 请求头

按[通用请求头](../guides/OpenAPI概述.md#authentication)提供凭证与调用身份。

<a id="Body"></a>

### 请求体

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `project_key` | `string` | 是 | 空间 ID，在空间双击名称获取 |
| `work_item_id` | `int64` | 是 | 工作项实例 ID，在实例详情右上角“更多”中获取 |
| `state_key` | `string` | 条件必填 | 节点 ID，也称 `node_key`；与 `node_uuid` 至少提供一个 |
| `node_uuid` | `string` | 条件必填 | 节点 UUID；与 `state_key` 至少提供一个 |

`state_key` 通过[工作流详情](../api/获取工作流详情.md)查询；`node_uuid` 从[AI 节点事件](AI节点事件.md)获取。本页没有声明两者禁止同时提供。

<a id="请求示例"></a>

### 请求示例

```json
{
  "project_key": "example_project",
  "work_item_id": 1234567890,
  "state_key": "doing"
}
```

原文的 `126027xxxx` 不是合法 JSON 数字；这里换为示例数值，实际请求应使用真实实例 ID。

<a id="返回参数"></a>

## 响应结构

### 外层与错误信息

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `object` | 成功示例中的业务数据外层；原参数表未列出这一层 |
| `err` | `object` | 成功时为空，失败时可能包含详细错误 |
| `err.code` | `int32` | 更详细的错误码 |
| `err.msg` | `string` | 更详细的错误信息 |
| `err.log_id` | `string` | 调用链标识，供日志定位 |
| `err_code` | `int32` | 成功为 `0`，失败为业务错误码 |
| `err_msg` | `string` | 成功时为空，失败时为错误信息 |

### data：节点上下文

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `node_state` | `string` | 节点状态；原成功示例为 `DOING`，本页没有完整枚举 |
| `ai_info` | `object` | 当前节点的 AI 配置与执行状态 |
| `node_fields` | `list<object>` | 节点字段，包含系统字段 |
| `conform_fields` | `list<object>` | 节点表单字段 |
| `sub_tasks` | `list<object>` | 子任务及完成状态 |
| `sub_workitems` | `list<object>` | 关联子工作项 |

`node_state` 与 `ai_info.status` 分别描述节点和 AI 执行状态，不能视为同一个状态字段。

### ai_info

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `props` | `list<object>` | AI 属性列表 |
| `status` | `string` | AI 运行状态 |
| `app_identity` | `object` | AI 应用与点位标识 |

### ai_info.props 元素

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `prop_key` | `string` | 属性键，例如 `prop_key_1` |
| `prop_type` | `string` 或 `list<string>` | 属性类型，兼容单值与列表 |
| `prop_value` | `object` | 节点上配置的属性值 |

### prop_value

| 字段 | 类型 | 何时返回 |
| --- | --- | --- |
| `field` | `list<object>` | 普通工作项字段引用 |
| `node_field` | `list<object>` | 节点字段引用 |
| `custom_property` | `object` | 属性配置为自定义属性时返回 |

字段引用按[AI 节点事件](AI节点事件.md)中的属性来源区分，表单字段另位于 `conform_fields`。

### 字段元素的共同结构

本接口的 `prop_value.field`、`prop_value.node_field`、`data.node_fields` 和 `data.conform_fields` 四个列表，均在参数表中列出以下四个字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 字段值 |
| `field_key` | `string` | 字段键 |
| `field_name` | `string` | 字段名称 |
| `field_type` | `string` | 字段类型 |

通用结构中的字段键已按本接口统一为 `field_key`，完整返回字段以本页为准。

### custom_property 与 app_identity

| 所属对象 | 字段 | 类型 | 说明 |
| --- | --- | --- | --- |
| `prop_value.custom_property` | `type` | `string` | 自定义属性值类型 |
| `prop_value.custom_property` | `value` | `string` | 自定义属性值 |
| `ai_info.app_identity` | `app_key` | `string` | AI 应用 key |
| `ai_info.app_identity` | `point_key` | `string` | AI 应用的节点 key |

### sub_tasks 与 sub_workitems

| 所属列表 | 字段 | 类型 | 说明 |
| --- | --- | --- | --- |
| `sub_tasks` | `task_id` | `int64` | 子任务 ID |
| `sub_tasks` | `is_finished` | `boolean` | `true` 已完成，`false` 未完成 |
| `sub_workitems` | `relation_id` | `string` | 关联 ID |
| `sub_workitems` | `workitem_ids` | `list<string>` | 关联工作项 ID 列表 |
| `sub_workitems` | `work_item_type` | `string` | 关联工作项类型 |

以下示例按接口类型定义使用布尔值 `is_finished` 和字符串列表 `workitem_ids`。

<a id="返回示例"></a>

## 响应示例

### 成功响应

此例保留原例覆盖的所有对象，修复缺失冒号、逗号、闭合符和脱敏数字。字段注释移到上述参数说明中。

```json
{
  "err": {},
  "err_code": 0,
  "err_msg": "",
  "data": {
    "node_state": "DOING",
    "ai_info": {
      "status": "running",
      "app_identity": {
        "app_key": "xxx",
        "point_key": "xxx"
      },
      "props": [
        {
          "prop_key": "prop_key_1",
          "prop_type": ["field"],
          "prop_value": {
            "field": [
              {
                "field_key": "field_1",
                "field_type": "text",
                "value": "xxx",
                "field_name": "xxx"
              }
            ],
            "node_field": [
              {
                "field_key": "node_field_1",
                "field_type": "text",
                "value": "xxx",
                "field_name": "xxx"
              }
            ]
          }
        },
        {
          "prop_key": "prop_key_custom",
          "prop_value": {
            "custom_property": { "type": "text", "value": "xxx" }
          }
        }
      ]
    },
    "node_fields": [
      {
        "field_key": "node_field_xxx",
        "field_type": "text",
        "value": "xxx",
        "field_name": "xxx"
      }
    ],
    "conform_fields": [
      {
        "field_key": "field_xxx",
        "field_type": "text",
        "value": "xxx",
        "field_name": "xxx"
      }
    ],
    "sub_tasks": [
      { "task_id": 123331000, "is_finished": false }
    ],
    "sub_workitems": [
      {
        "relation_id": "relation_xxx",
        "work_item_type": "story",
        "workitem_ids": ["123343000", "434242000"]
      }
    ]
  }
}
```

### 空间错误响应

```json
{
  "err_code": 50006,
  "err_msg": "RPC Call Error",
  "err": {
    "code": 50006,
    "msg": "biz error: project not found",
    "log_id": "20251027201432BE159FC9EC3B8F36xxxx"
  }
}
```

<a id="错误码"></a>

## 错误处理

| 外层错误码 | 外层信息 | 内层错误码 | 内层信息 | 排查方向 |
| --- | --- | --- | --- | --- |
| `20006` | `Invalid Param` | `20006` | `Invalid Param` | 核对 `state_key`、`node_uuid` |
| `50006` | `RPC Call Error` | `50006` | `biz error: project not found` | 核对 `project_key` |

其他错误见[通用错误码](../formats/Open%20API%20错误码.md)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/pskw0p8q
