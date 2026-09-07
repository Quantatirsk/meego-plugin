# 更新 AI 操作的运行状态

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-openapi.put.open-api-ai-entity-update"></a>
- **更新 AI 操作的运行状态** ｜ `openapi.put.open-api-ai-entity-update` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

在 AI 操作任务完成或无法继续执行时，更新对应 AI 实体的运行状态。原文主要介绍将任务标为完成或停止；请求使用实体列表，而不是工作项 ID 列表。

权限范围见[AI 操作权限说明](AI操作权限说明.md)，实体标识来自[AI 操作事件](AI操作事件说明.md)的 `data.ai_entity.entity_id`。

<a id="请求说明"></a>

## 请求定义

**请求方式**：`PUT`
**请求地址**：`/open_api/ai_entity/update`

<a id="请求参数"></a>
<a id="header"></a>

### 请求头

使用[通用请求头](../guides/OpenAPI概述.md#authentication)。

<a id="Body"></a>

### 请求体

| 参数 | 类型 | 原文必填标记 | 含义 |
| --- | --- | --- | --- |
| `update_ai_entity_param` | `list<object>` | 可选 | 需要更新的 AI 实体及目标状态列表 |
| `project_key` | `string` | 可选 | 空间 ID 或空间域名标识 `simple_name` |
| `user_key` | `string` | 可选 | 操作人标识 |

空间 ID 可在空间双击名称获取；`simple_name` 通常来自空间 URL，例如 `https://project.feishu.cn/doc/overview` 中的 `doc`。

### update_ai_entity_param 元素

| 字段 | 类型 | 原文必填标记 | 含义 |
| --- | --- | --- | --- |
| `entity_id` | `string` | 可选 | 目标 AI 实体 ID |
| `status` | `string` | 可选 | 目标 AI 实体状态，常见值为 `running`、`done`、`stopped` |

原表将全部参数及子字段标为可选，但没有说明空请求的语义，也没有列出完整状态转换矩阵。实际允许的状态以服务端校验为准，不能从“可选”推断不提供实体或状态也能完成有效更新。

<a id="请求示例"></a>

## 请求示例

```json
{
  "project_key": "project_key",
  "update_ai_entity_param": [
    {
      "entity_id": "ai_entity_id",
      "status": "done"
    }
  ]
}
```

示例表示完成一个 AI 实体，空间和实体标识均需替换。虽然请求结构是列表，原文没有给出批量数量上限，不能将其他接口的批量限制直接套用到这里。

<a id="返回参数"></a>

## 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `err` | `object` | 成功时为空，失败时可能有详细错误 |
| `err.code` | `int32` | 详细错误码 |
| `err.msg` | `string` | 详细错误信息 |
| `err.log_id` | `string` | 调用链标识，用于定位日志 |
| `err_code` | `int32` | 成功为 `0`，失败为业务错误码 |
| `err_msg` | `string` | 成功时为空，失败时为错误信息 |

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
    "log_id": "20260630150000xxxxxxxxxxxx"
  }
}
```

此示例中，外层 RPC 错误并不足以定位问题，内层消息指出空间未找到。

<a id="错误码"></a>

## 错误处理

本页没有独立的错误码表。遇到失败时，保留外层错误、内层错误和 `log_id`，结合[通用错误码](../formats/Open%20API%20错误码.md)排查，不把示例 `50006` 当作唯一可能错误。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/7pwq27rz
