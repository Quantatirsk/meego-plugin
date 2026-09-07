# 事件回调验签

本文只定义回调 token 已配置时的签名计算和兼容性边界。监听事件的投递确认见[监听事件投递](listener-delivery.md)，拦截事件的同步决策见[拦截事件响应](intercept-response.md)。

## 签名规则

callback token 是监听事件和拦截事件配置中的可选项。配置后，平台请求中的 `signature` 使用该 token；它与 `plugin_secret`、插件访问凭证和用户访问凭证是不同的值，不能混用。未配置 token 时，不能把本页算法或签名字段存在性当作已知平台契约。

签名计算使用下列字符串的 UTF-8 字节：

```text
SHA256_UTF8(plugin_id + request_time + callback_token)
```

三个输入按顺序直接拼接，不添加分隔符。`request_time` 必须使用请求体中的原始十进制表示，不换算单位或改写成本地时间。监听与拦截事件的时间戳单位并不相同，验签前只把原始值转换为十进制字符串。计算结果为小写十六进制字符串，并与请求中的 `signature` 比较。示例使用常量时间比较是接收端的本地安全实现建议，不是平台签名协议。

```python
import hashlib
import hmac


def verify_signature(
    plugin_id: str,
    request_time: str,
    callback_token: str,
    signature: str,
) -> bool:
    payload = f"{plugin_id}{request_time}{callback_token}".encode("utf-8")
    expected = hashlib.sha256(payload).hexdigest()
    return hmac.compare_digest(expected, signature)
```

## 验签顺序

1. 解析 JSON，并只读取当前事件处理必需的字段。
2. 使用原始 `request_time`、插件 ID 和 callback token 验签。
3. 签名不匹配时，不进入后续业务处理。

验签本身不定义 HTTP 响应体、重试策略或事件幂等语义；这些规则由具体事件类型定义。

## 兼容性边界

平台可以在顶层或 `data` 中增加未知字段。接收端应忽略未知扩展字段，继续处理已知字段。可选字段缺失时可以按对应事件语义处理默认值；处理所必需的字段缺失时不能把它当作有效事件。

官方没有规定验签失败时接收端必须返回的 HTTP 响应体。实现可以使用服务自身的错误格式，但不能把自定义错误结构写成平台契约。

对应 fixture：[事件回调验签](../../fixtures/events/webhook-signature.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/kztn7qno
