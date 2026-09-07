# OpenAPI：交换用户访问凭证

插件客户端先取得一次性授权码，再把授权码交给自己的服务端。服务端使用已有插件凭证调用本接口，获取代表该用户的访问凭证和刷新凭证。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/authen/user_plugin_token` |
| 请求体 | `application/json` |
| 认证 | `X-Plugin-Token` 必填，值为已获取的 `plugin_access_token` |

授权码只能使用一次，有效期为 5 分钟。客户端不能直接调用此接口，也不能把用户 token 或刷新 token 写入前端存储。

## 请求体

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `code` | 是 | 客户端取得的一次性授权码 |
| `grant_type` | 是 | 固定为 `authorization_code` |

```json
{
  "code": "AUTHORIZATION_CODE_PLACEHOLDER",
  "grant_type": "authorization_code"
}
```

## 可复制示例

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/authen/user_plugin_token" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --data '{
    "code": "AUTHORIZATION_CODE_PLACEHOLDER",
    "grant_type": "authorization_code"
  }'
```

```typescript
type UserTokenEnvelope = {
  data?: {
    token: string;
    expire_time: number;
    refresh_token: string;
    refresh_token_expire_time: number;
    saas_tenant_key: string;
    user_key: string;
  };
  error?: {
    code: number;
    msg: string;
  };
};

const response = await fetch(
  "https://project.feishu.cn/open_api/authen/user_plugin_token",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
    },
    body: JSON.stringify({
      code: "AUTHORIZATION_CODE_PLACEHOLDER",
      grant_type: "authorization_code",
    }),
  },
);

const payload = (await response.json()) as UserTokenEnvelope;
if (!response.ok || payload.error?.code !== 0 || payload.data === undefined) {
  throw new Error(payload.error?.msg ?? `HTTP ${response.status}`);
}
```

```python
import httpx


async def exchange_user_token() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
    }
    body = {
        "code": "AUTHORIZATION_CODE_PLACEHOLDER",
        "grant_type": "authorization_code",
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/authen/user_plugin_token",
            headers=headers,
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
    "token": "USER_ACCESS_TOKEN_PLACEHOLDER",
    "expire_time": 7200,
    "refresh_token": "REFRESH_TOKEN_PLACEHOLDER",
    "refresh_token_expire_time": 1209600,
    "saas_tenant_key": "TENANT_KEY_PLACEHOLDER",
    "user_key": "USER_KEY_PLACEHOLDER"
  },
  "error": {
    "code": 0,
    "msg": "success"
  }
}
```

两个有效期都是相对秒数。服务端应根据本次响应重新计算自身的绝对过期时间。

## 失败结果

通用错误码资料将无效授权码列为 HTTP `403`、`err_code: 10210`、`err_msg: code invalid`。该资料未给出此端点的完整内层错误对象，因此 fixture 只保留已经发布的外层字段。

```json
{
  "err_code": 10210,
  "err_msg": "code invalid"
}
```

对应 fixture：[交换用户访问凭证](../../fixtures/openapi/user-plugin-token.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/4id4bvnf
