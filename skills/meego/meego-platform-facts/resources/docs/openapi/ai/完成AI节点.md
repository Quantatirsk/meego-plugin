# 完成 AI 节点

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-openapi.post.open-api-ai-node-confirm"></a>
- **完成 AI 节点** ｜ `openapi.post.open-api-ai-node-confirm` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

在 AI 节点计算完成后，调用本接口推进节点流转。它与[修改 AI 节点数据](修改AI节点数据.md)是两个不同动作：写入结果或把 AI 状态改为 `done`，不等于已经完成节点流转。

<a id="注意事项"></a>

## 调用前提

AI 节点的当前 `ai_status` 必须为 `done`，才能通过本接口完成节点。该状态是调用前提，不是本接口的请求参数。

调用仅作用于当前 AI 节点，权限边界见[AI 节点权限说明](AI节点权限说明.md)。

<a id="请求说明"></a>

## 请求定义

**请求方式**：`POST`
**请求地址**：`/open_api/ai_node/confirm`

<a id="请求参数"></a>
<a id="header"></a>

### 请求头

按[通用请求头](../guides/OpenAPI概述.md#authentication)提供凭证与接口所需身份。

<a id="Body"></a>

### 请求体

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `project_key` | `string` | 是 | 空间 ID，可在空间双击名称获取 |
| `work_item_id` | `int64` | 是 | 工作项实例 ID，可在实例详情“更多 → ID”获取 |
| `state_key` | `string` | 条件必填 | 节点 ID，也称 `node_key`；与 `node_uuid` 至少提供一个 |
| `node_uuid` | `string` | 条件必填 | 节点 UUID；与 `state_key` 至少提供一个 |

`state_key` 从[工作流详情](../api/获取工作流详情.md)查询，`node_uuid` 从[AI 节点事件](AI节点事件.md)获取。原文表格将两者各标为可选，但备注要求“必填一个”；示例同时传入两者，并未声明互斥。

<a id="请求示例"></a>

### 请求示例

```json
{
  "project_key": "67da75df68c96514c210xxxx",
  "work_item_id": 1233212,
  "state_key": "state_0",
  "node_uuid": "node_state_0_1233212"
}
```

以上资源标识为原文示例，实际调用时需要替换。

<a id="返回参数"></a>

## 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `err` | `object` | 成功时为空对象；失败时可能包含详细错误 |
| `err.code` | `int32` | 详细错误码 |
| `err.msg` | `string` | 详细错误描述 |
| `err.log_id` | `string` | 调用链标识，用于日志排查 |
| `err_code` | `int32` | 成功为 `0`，失败返回业务错误码 |
| `err_msg` | `string` | 成功时为空，失败时返回错误信息 |

<a id="返回示例"></a>

### 成功响应

```json
{
  "err": {},
  "err_code": 0,
  "err_msg": ""
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

该示例表示 `project_key` 不正确。外层通用 RPC 错误与内层具体业务错误应一起保留。

<a id="错误码"></a>

## 错误处理

| 外层错误码 | 外层信息 | 内层错误码 | 内层信息 | 排查方向 |
| --- | --- | --- | --- | --- |
| `20006` | `Invalid Param` | `20006` | `Invalid Param` | 核对 `state_key`、`node_uuid` |
| `50006` | `RPC Call Error` | `50006` | `biz error: project not found` | 核对 `project_key` |

原文未为“节点尚未 done”单列错误码，本篇不补造。其他错误见[通用错误码](../formats/Open%20API%20错误码.md)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/xrny90gr
