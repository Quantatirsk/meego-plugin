# 监听事件投递

监听事件在数据变更完成后以 HTTP POST 通知插件。它不能阻止已发生的操作；接收端应把事件视为可能重复、无序的异步通知。

## 配置与投递

回调地址必须可从公网访问。监听事件的 callback token 为可选配置；只有配置 token 后，才能按[事件回调验签](webhook-signature.md)处理签名。

请求包裹层包含 `request_time`、`signature`、`data` 等字段。`request_time` 是毫秒级 Unix 时间戳，在 JSON 中应按数值读取；`data.idempotent_key` 是监听事件去重键。

```json
{
  "request_time": 1730184005453,
  "signature": "SIGNATURE_PLACEHOLDER",
  "source": "normal",
  "data": {
    "event_type": 1001,
    "idempotent_key": "EVENT_IDEMPOTENCY_KEY_PLACEHOLDER",
    "project_key": "PROJECT_KEY_PLACEHOLDER"
  }
}
```

## 接收确认

接收端必须在 1000ms 内返回 HTTP `200`。官方没有规定成功响应体或成功响应头的固定结构；不要把本地 `{}`、`null` 或其他返回格式写成平台协议。

监听事件可能重复且无序。投递失败时最多重试四次，间隔为立即、1 分钟、2 分钟和 7 分钟。应先完成必要的验签和去重，再把耗时处理转入异步执行。

## 实现边界

- `request_time` 可以帮助判断事件时间，但不是严格递增序号。
- 未配置 callback token 时，不要假定 `signature` 的格式或使用本地空 token 进行验签。
- 监听事件的快速 `200` 只表示接收端已确认投递，不表示异步业务处理已成功。

对应 fixture：[监听事件投递](../../fixtures/events/listen.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/lvojfwht
