# 修改 AI 节点数据

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-openapi.post.open-api-ai-node-edit"></a>
- **修改 AI 节点数据** ｜ `openapi.post.open-api-ai-node-edit` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

更新 AI 节点的执行状态、节点字段或节点表单。创建 AI 节点后自动获得对应权限；提交修改前，节点当前的 `ai_status` 必须是 `running`。

<a id="注意事项"></a>

## 使用条件

- 当前节点必须处于运行状态；请求中的 `status` 是要更新到的状态，不是对当前状态的声明。
- `state_key` 与 `node_uuid` 至少提供一个。原文写“必填一个”，没有禁止同时传入；原示例同时提供两者。
- 省略 `status`、`node_fields` 或 `conform_fields`，表示不更新对应部分。
- ISV 浮动计费场景下，写入 `done` 时必须提交 `billing_report`；其他场景该字段不生效。

权限与 AI 实体范围见[AI 节点权限说明](AI节点权限说明.md)。

<a id="请求说明"></a>

## 请求定义

**请求方式**：`POST`
**请求地址**：`/open_api/ai_node/edit`

<a id="请求参数"></a>
<a id="header"></a>

### 请求头

使用[通用请求头](../guides/OpenAPI概述.md#authentication)。

<a id="Body"></a>

### 请求体

| 参数 | 类型 | 必填 | 含义 |
| --- | --- | --- | --- |
| `project_key` | `string` | 否 | 空间 ID，可在空间双击空间名称获取 |
| `work_item_id` | `int64` | 是 | 工作项实例 ID，可在实例详情右上角“更多 → ID”获取 |
| `state_key` | `string` | 条件必填 | 节点 ID，也称 `node_key`；与 `node_uuid` 至少提供一个 |
| `node_uuid` | `string` | 条件必填 | 节点 UUID；与 `state_key` 至少提供一个 |
| `status` | `string` | 否 | 要写入的 AI 运行状态；省略则不更新 |
| `node_fields` | `list<object>` | 否 | 节点字段更新列表；元素结构见下表 |
| `conform_fields` | `list<object>` | 否 | 节点表单字段更新列表；元素结构见下表 |
| `billing_report` | `object` | 条件必填 | 仅 ISV 浮动计费且提交 `status = done` 时必填 |

`state_key` 可通过[获取工作流详情](../api/获取工作流详情.md)查询；`node_uuid` 从[AI 节点事件](AI节点事件.md)获取。

### 状态取值

| `status` | 含义 |
| --- | --- |
| `idle` | 空闲 |
| `running` | 运行中 |
| `done` | 完成 |
| `stopped` | 停止 |

原文还特别说明：ISV 浮动计费模式下，`done` 仅支持从 `running` 流转。状态枚举不代表任意两个状态间都允许转换。

### 字段更新元素

| 所属列表 | 字段 | 类型 | 含义 |
| --- | --- | --- | --- |
| `node_fields` | `node_field_key` | `string` | 节点字段键 |
| `node_fields` | `value` | `string` | 节点字段值 |
| `conform_fields` | `field_key` | `string` | 表单字段键 |
| `conform_fields` | `value` | `string` | 表单字段值 |

以上元素定义来自原文引用的 [Edit_Node_Field](AI节点数据结构.md#b081a57e) 和 [Edit_Conform_Field](AI节点数据结构.md#8326839f)。本页未单独规定元素内部字段的必填标记。

### 浮动计费：billing_report

| 字段 | 类型 | 原表必填标记 | 含义 |
| --- | --- | --- | --- |
| `flow_id` | `string` | 可选 | 一次启停周期的 ID，用于幂等保证，防止重复扣费 |
| `billing_count` | `double` | 可选 | 本次任务实际消耗额度，按百分位上报，且不可为 `0` |

`flow_id` 的获取路径待核实：当前 [8001 事件定义](AI节点事件.md#1b56adb1)未给出该字段，不能用 `entity_id` 或 `idempotent_key` 代替。实际消耗 `100` 点时上报 `10000`。计费对象为条件必填，子字段按参数表标为可选；联调前需确认实际计费要求。

<a id="请求示例"></a>

## 请求示例

以下四个示例是独立请求。原文无法解析的脱敏数字 `126027xxxx` 在此统一换为示例 ID `1234567890`，实际调用时替换全部资源标识。

### 更新运行状态

```json
{
  "project_key": "example_project",
  "work_item_id": 1234567890,
  "state_key": "state_0",
  "node_uuid": "node_state_0_1233212",
  "status": "done"
}
```

此例不包含计费对象，不能直接用于要求浮动计费上报的场景。

### 更新节点字段

```json
{
  "project_key": "example_project",
  "work_item_id": 1234567890,
  "state_key": "state_0",
  "node_uuid": "node_state_0_1233212",
  "node_fields": [
    { "node_field_key": "node_field_xxx", "value": "1" }
  ]
}
```

### 更新节点表单

```json
{
  "project_key": "example_project",
  "work_item_id": 1234567890,
  "state_key": "state_0",
  "node_uuid": "node_state_0_1233212",
  "conform_fields": [
    { "field_key": "field_xxx", "value": "1" }
  ]
}
```

### 完成计算并上报计费

```json
{
  "project_key": "example_project",
  "work_item_id": 1234567890,
  "state_key": "state_0",
  "node_uuid": "node_state_0_1233212",
  "status": "done",
  "billing_report": {
    "flow_id": "aiflow-xxxxxxxx",
    "billing_count": 100
  }
}
```

保留原示例的 `billing_count: 100`；按正文百分位规则，它表示实际消耗 `1` 点，而不是 `100` 点。

<a id="返回参数"></a>

## 响应字段

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `err` | `object` | 成功时为空，失败时包含详细错误 |
| `err.code` | `int32` | 部分场景提供的详细错误码 |
| `err.msg` | `string` | 部分场景提供的详细错误信息 |
| `err.log_id` | `string` | 失败请求的调用链标识，用于定位日志 |
| `err_code` | `int32` | 成功为 `0`，失败为实际业务错误码 |
| `err_msg` | `string` | 成功时为空，失败时为业务错误信息 |

<a id="返回示例"></a>

### 成功响应

```json
{
  "err": {},
  "err_code": 0,
  "err_msg": ""
}
```

### 失败响应

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

| 错误码 | 错误信息 | 核对位置 |
| --- | --- | --- |
| `20006` | 外层与内层均为 `Invalid Param` | `state_key`、`node_uuid` 是否正确 |
| `50006` | 外层 `RPC Call Error`，内层 `biz error: project not found` | `project_key` 是否正确 |

结合 `err_code`、内层 `err` 与 `log_id` 定位，不只匹配外层消息。其他错误见[通用错误码](../formats/Open%20API%20错误码.md)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/wlpb4t26
