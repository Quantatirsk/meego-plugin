# 更新 AI 字段

在 AI 字段计算完成后，根据任务 ID 将结果回写到对应字段。该接口随相应 AI 应用创建而自动授权，字段值必须符合目标字段的类型。

支持的字段类型为：文本、富文本、日期、日期区间、单选人员、多选人员、开关、URL 链接、数字和附件。不能从这些类型推断其他字段类型也支持 AI 回写。

<a id="请求说明"></a>

## 请求定义

**请求方式**：`PUT`
**请求地址**：`/open_api/ai_application_field/update`

<a id="请求参数"></a>
<a id="header"></a>

### 请求头

使用[通用请求头](../guides/OpenAPI概述.md#authentication)。

<a id="Body"></a>

### 请求体

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `ai_task_id` | `string` | 是 | AI 任务 ID，从[AI 字段事件](AI字段事件说明.md)获取 |
| `field_value` | 按字段类型确定 | 是 | 计算结果，格式见[字段与属性解析格式](../formats/字段与属性解析格式.md) |
| `billing_count` | `double` | 否 | ISV 浮动计费模式的消耗额度，按百分位上报，不能为 `0` |

文本和 URL 直接使用 JSON 字符串，其他类型按字段格式传值，不额外包装通用对象。

计费值只用于 ISV 浮动计费场景。例如实际消耗 `100` 点，上报 `10000`；下文保留的示例 `1000` 对应实际 `10` 点。

<a id="请求示例"></a>

## 请求示例

三个例子分别对应文本、链接和浮动计费。文本内容改为英文示例文案，任务 ID 与链接仍须替换为业务实际值。

### 文本结果

```json
{
  "ai_task_id": "762900511447292xxxx",
  "field_value": "AI-generated text content"
}
```

### 链接结果

```json
{
  "ai_task_id": "6d4a34a0-78cd-4e6b-b201-2f7e37acxxxx",
  "field_value": "https://bytedance.larkoffice.com/docx"
}
```

### 浮动计费

```json
{
  "ai_task_id": "46ee6925-b076-4d30-a50a-c01e3401xxxx",
  "field_value": "Usage-based billing",
  "billing_count": 1000
}
```

<a id="返回参数"></a>

## 响应字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `err` | `object` | 成功时为空，失败时可能提供详细错误 |
| `err.code` | `int32` | 详细错误码 |
| `err.msg` | `string` | 详细错误描述 |
| `err.log_id` | `string` | 失败请求的调用链标识 |
| `err_code` | `int32` | 成功为 `0`，失败为业务错误码 |
| `err_msg` | `string` | 成功时为空，失败时为错误信息 |

成功示例另包含空 `data` 对象，但原参数表未定义其字段。本篇保留这一外层对象，不据此推断还有其他返回数据。

<a id="返回示例"></a>

### 成功响应

```json
{
  "err": {},
  "err_code": 0,
  "err_msg": "",
  "data": {}
}
```

### 字段值格式不合法

```json
{
  "err_code": 20006,
  "err_msg": "Invalid Param",
  "err": {
    "code": 20006,
    "msg": "field [field_1beb36] is illegal",
    "log_id": "20260418122422857DD1A8708B6378xxxx"
  }
}
```

<a id="错误码"></a>

## 错误处理

原文列出的接口错误为外层和内层均返回 `20006`，外层信息为 `Invalid Param`，内层信息指出不合法的字段，例如 `field [field_1beb36] is illegal`。

此时先核对 AI 字段应用是否支持目标类型，再核对 `field_value` 的值格式。其他错误见[通用错误码](../formats/Open%20API%20错误码.md)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/ttbbzh62
