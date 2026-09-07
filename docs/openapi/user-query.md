# OpenAPI：查询用户详情

该接口按已知的用户标识批量读取用户资料。可用标识是飞书项目 `user_key`、开放平台 `out_id` 或绑定邮箱；只有关键词时应使用用户搜索接口，而不是把关键词传给本接口。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/user/query` |
| 请求体 | `application/json` |
| 认证 | `X-Plugin-Token` 必填；使用插件凭证调用本接口时不需要 `X-User-Key` |

虚拟插件凭证只能查询插件协作者范围内的用户；要查询其他用户，应使用正式插件凭证。`user_id` 已废弃并固定为 `0`，应保存 `user_key` 而不是 `user_id` 或 `username`。

## 请求体

`user_keys`、`out_ids`、`emails` 至少提供一项，一次最多查询 100 个用户。资料未定义同时传多类标识时的去重规则，不要据此突破上限。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `user_keys` | 条件必填 | 飞书项目用户标识数组 |
| `out_ids` | 条件必填 | 飞书开放平台用户统一标识数组 |
| `emails` | 条件必填 | 已绑定的邮箱数组 |
| `tenant_key` | 条件必填 | 仅按邮箱查询其他租户用户时必填；省略表示插件所属租户 |

```json
{
  "user_keys": ["USER_KEY_PLACEHOLDER"]
}
```

## 可复制示例

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/user/query" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --data '{
    "user_keys": ["USER_KEY_PLACEHOLDER"]
  }'
```

```typescript
type UserRecord = {
  user_id: number;
  user_key: string;
  username: string;
  email: string;
  avatar_url: string;
  name_cn: string;
  name_en: string;
  out_id: string;
  status: "initialized" | "resigned" | "frozen" | "activated";
  name: Record<string, string>;
};

type ApiEnvelope<T> = {
  data?: T;
  err: { log_id?: string };
  err_code: number;
  err_msg: string;
};

const response = await fetch("https://project.feishu.cn/open_api/user/query", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
  },
  body: JSON.stringify({ user_keys: ["USER_KEY_PLACEHOLDER"] }),
});

const payload = (await response.json()) as ApiEnvelope<UserRecord[]>;
if (!response.ok || payload.err_code !== 0) {
  const message = payload.err_msg || `HTTP ${response.status}`;
  const logId = payload.err.log_id;
  throw new Error(logId ? `${message} (log_id: ${logId})` : message);
}
```

```python
import httpx


async def query_users() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
    }
    body = {"user_keys": ["USER_KEY_PLACEHOLDER"]}
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/user/query",
            headers=headers,
            json=body,
        )
    payload = response.json()
    error = payload.get("err", {})
    log_id = error.get("log_id") if isinstance(error, dict) else None
    if not response.is_success or payload.get("err_code") != 0:
        message = payload.get("err_msg") or f"HTTP {response.status_code}"
        if log_id:
            message = f"{message} (log_id: {log_id})"
        raise RuntimeError(message)
    return payload
```

## 成功结果

```json
{
  "err": {},
  "err_code": 0,
  "err_msg": "",
  "data": [
    {
      "user_id": 0,
      "user_key": "USER_KEY_PLACEHOLDER",
      "username": "USER_KEY_PLACEHOLDER",
      "email": "user@example.invalid",
      "avatar_url": "https://example.invalid/avatar.png",
      "name_cn": "Example User",
      "name_en": "Example User",
      "out_id": "OUT_ID_PLACEHOLDER",
      "status": "activated",
      "name": {
        "default": "Example User",
        "zh_cn": "Example User",
        "en_us": "Example User"
      }
    }
  ]
}
```

`status` 的可用值为 `initialized`、`resigned`、`frozen`、`activated`。

## 失败结果

查不到请求中的用户标识时，官方示例返回 `30006 / User Not Found`，通用错误码资料将其映射为 HTTP `404`。超过 100 个用户时，错误码为 `20004 / Search User Limit`。

```json
{
  "err_code": 30006,
  "err_msg": "User Not Found",
  "err": {
    "code": 30006,
    "msg": "User Not Found, please refer to https://project.feishu.cn/b/helpcenter/1p8d7djs/5aueo3jr",
    "log_id": "LOG_ID_PLACEHOLDER"
  }
}
```

对应 fixture：[查询用户详情](../../fixtures/openapi/user-query.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/xqbea3rp
