# OpenAPI：刷新用户访问凭证

该接口用刷新凭证换取新的用户访问凭证。它只用于用户授权链路；插件凭证过期后应重新调用获取插件访问凭证接口。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/authen/refresh_token` |
| 请求体 | `application/json` |
| 认证 | `X-Plugin-Token` 必填，值为已获取的 `plugin_access_token` |

刷新凭证必须与服务端保存的用户授权记录绑定。不要把它发送给客户端、输出到日志或写入 fixture。

## 请求体

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `refresh_token` | 是 | 交换用户访问凭证时返回的刷新凭证 |
| `type` | 是 | 固定整数 `1`，表示刷新用户访问凭证 |

```json
{
  "refresh_token": "REFRESH_TOKEN_PLACEHOLDER",
  "type": 1
}
```

## 可复制示例

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/authen/refresh_token" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --data '{
    "refresh_token": "REFRESH_TOKEN_PLACEHOLDER",
    "type": 1
  }'
```

```typescript
type RefreshTokenEnvelope = {
  data?: {
    token: string;
    expire_time: number;
    refresh_token: string;
    refresh_token_expire_time: number;
  };
  error?: {
    code: number;
    msg: string;
  };
};

const response = await fetch(
  "https://project.feishu.cn/open_api/authen/refresh_token",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
    },
    body: JSON.stringify({
      refresh_token: "REFRESH_TOKEN_PLACEHOLDER",
      type: 1,
    }),
  },
);

const payload = (await response.json()) as RefreshTokenEnvelope;
if (!response.ok || payload.error?.code !== 0 || payload.data === undefined) {
  throw new Error(payload.error?.msg ?? `HTTP ${response.status}`);
}
```

```python
import httpx


async def refresh_user_token() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
    }
    body = {
        "refresh_token": "REFRESH_TOKEN_PLACEHOLDER",
        "type": 1,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/authen/refresh_token",
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
    "refresh_token_expire_time": 1209600
  },
  "error": {
    "code": 0,
    "msg": "success"
  }
}
```

应以刷新后的返回值替换缓存中的 token、刷新 token 和两项有效期，不能假设刷新 token 固定不变。

## 失败结果

通用错误码资料将无法校验的插件 token 列为 HTTP `401`、`err_code: 10022`、`err_msg: Check Token Failed`。该资料没有公布本端点的完整内层错误对象，fixture 只保存可核验的外层字段。

```json
{
  "err_code": 10022,
  "err_msg": "Check Token Failed"
}
```

对应 fixture：[刷新用户访问凭证](../../fixtures/openapi/refresh-token.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/4id4bvnf
