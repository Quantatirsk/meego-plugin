# Control 新建成功回调

当 Control 在新建页可见且工作项创建成功后，平台向配置的回调地址发送 HTTP POST。该回调用于将新建页控件的临时 UUID 与已创建的工作项关联。

## 请求与响应

请求头为 `Content-Type: application/json`。成功时接收端返回 HTTP `200` 且响应体为空。来源示例中的 `request_time` 为 13 位数值时间戳，`data.event_type` 为 `0`；二者都是示例值，不能作为通用字段枚举或时间单位契约。

```json
{
  "request_time": 1728363799655,
  "signature": "SIGNATURE_PLACEHOLDER",
  "source": "normal",
  "data": {
    "project_key": "PROJECT_KEY_PLACEHOLDER",
    "work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER",
    "event_type": 0,
    "work_item_info": [
      {
        "work_item_id": 1000000000000001,
        "work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER"
      }
    ],
    "field_info": [
      {
        "after_field_value": "{\"__system_control_uuid\":\"CONTROL_UUID_PLACEHOLDER\"}"
      }
    ]
  }
}
```

来源示例中的 `after_field_value` 是 JSON 字符串。处理该示例时应先解析字符串，再读取 `__system_control_uuid`；不能把整个字符串直接当作 UUID。来源没有定义该字段在所有 Control 回调中的必填性或其它序列化形态，需要运行时验证。

## 验签与关联边界

使用配置的 callback token 时，按[事件回调验签](webhook-signature.md)计算并比较签名。签名通过后，使用已创建的 `work_item_id` 和解析出的 UUID 建立关联。

来源只给出 `idempotent_key` 的空字符串示例，没有定义其生成规则或该回调的去重键。不能把它当作已验证的幂等实现依据；需要幂等时，应在目标运行时补充平台行为验证。

对应 fixture：[Control 新建成功回调](../../fixtures/events/control-create-callback.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/kui20z6a
