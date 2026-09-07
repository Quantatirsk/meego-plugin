# OpenAPI：获取插件访问凭证

该接口由插件服务端使用 `plugin_id` 和 `plugin_secret` 换取插件访问凭证。它是凭证链路的起点，不能由浏览器端调用。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/authen/plugin_token` |
| 请求体 | `application/json` |
| 认证 | 不使用已有的 `X-Plugin-Token`；以请求体中的插件 ID 和密钥完成首次交换 |

`type` 省略时获取正式插件凭证；`type: 0` 也是正式插件凭证，`type: 1` 获取仅限开发调试数据范围的虚拟插件凭证。

## 安全边界

`plugin_secret`、返回的 token 以及其缓存必须只存在于服务端的受控密钥边界。不要把它们放入前端代码、浏览器存储、日志、fixture 或错误消息。缓存应以本次响应的 `expire_time` 为准；即将过期时重新获取，而不是假设重复请求总会返回相同 token。

## 请求体

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `plugin_id` | 是 | 插件 ID |
| `plugin_secret` | 是 | 插件密钥 |
| `type` | 否 | `0` 为正式插件凭证，`1` 为虚拟插件凭证 |

```json
{
  "plugin_id": "PLUGIN_ID_PLACEHOLDER",
  "plugin_secret": "PLUGIN_SECRET_PLACEHOLDER",
  "type": 0
}
```

## 可复制示例

以下示例描述插件服务端的运行时请求形状。它们不授权 agent 自行使用真实密钥发起请求；`lpm` 仅管理插件生命周期、scope 和平台托管配置。

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/authen/plugin_token" \
  --header "Content-Type: application/json" \
  --data '{
    "plugin_id": "PLUGIN_ID_PLACEHOLDER",
    "plugin_secret": "PLUGIN_SECRET_PLACEHOLDER",
    "type": 0
  }'
```

```typescript
type PluginTokenEnvelope = {
  data?: {
    expire_time: number;
    token: string;
  };
  error?: {
    code: number;
    msg: string;
  };
};

const response = await fetch(
  "https://project.feishu.cn/open_api/authen/plugin_token",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plugin_id: "PLUGIN_ID_PLACEHOLDER",
      plugin_secret: "PLUGIN_SECRET_PLACEHOLDER",
      type: 0,
    }),
  },
);

const payload = (await response.json()) as PluginTokenEnvelope;
if (!response.ok || payload.error?.code !== 0 || payload.data === undefined) {
  throw new Error(payload.error?.msg ?? `HTTP ${response.status}`);
}
```

```python
import httpx


async def get_plugin_token() -> dict[str, object]:
    body = {
        "plugin_id": "PLUGIN_ID_PLACEHOLDER",
        "plugin_secret": "PLUGIN_SECRET_PLACEHOLDER",
        "type": 0,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/authen/plugin_token",
            headers={"Content-Type": "application/json"},
            json=body,
        )
    response.raise_for_status()
    payload = response.json()
    if payload["error"]["code"] != 0:
        raise RuntimeError(payload["error"]["msg"])
    return payload
```

## 成功结果

```json
{
  "data": {
    "expire_time": 7200,
    "token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER"
  },
  "error": {
    "code": 0,
    "msg": "success"
  }
}
```

`expire_time` 是相对有效期秒数，不是绝对时间戳。

## 失败结果

官方主文未公布无效 `plugin_id` 或 `plugin_secret` 时的完整响应体。本地 fixture 将该场景标为 `source_silent`，保留请求并明确不构造猜测的错误 JSON。服务端应记录平台返回的状态、响应体和日志标识，但不得记录密钥或 token。

对应 fixture：[获取插件访问凭证](../../fixtures/openapi/plugin-token.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/4id4bvnf
