# OpenAPI：下载工作项附件

该接口下载指定工作项中的一个附件或富文本文件。路径定位工作项，请求体以 `uuid` 定位目标文件；成功响应是二进制流，不能按 JSON 解码。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/file/download` |
| 请求体 | `application/json` |
| 成功响应 | 目标文件的二进制内容 |
| 失败响应 | JSON 错误信封 |

`uuid` 从工作项详情返回的富文本或附件字段中取得。官方资料说明当前最大文件大小为 100M；不要把字段中出现的其他标识当作该请求的 `uuid`。

## 认证边界

本端点主文复用通用 Header 规则，未单独列出 `X-User-Key` 的必填性。下面的插件凭证示例携带用户身份；用户凭证调用按凭证对应用户鉴权。下载得到的文件内容可能包含敏感数据，写盘或转发前应遵循目标系统的访问控制。

## 请求体

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `uuid` | 是 | 文件标识 |

```json
{
  "uuid": "FILE_UUID_PLACEHOLDER"
}
```

## 可复制示例

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/WORK_ITEM_ID_PLACEHOLDER/file/download" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --header "X-User-Key: USER_KEY_PLACEHOLDER" \
  --data '{
    "uuid": "FILE_UUID_PLACEHOLDER"
  }' \
  --output "downloaded-file.bin"
```

```typescript
const response = await fetch(
  "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/WORK_ITEM_ID_PLACEHOLDER/file/download",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
      "X-User-Key": "USER_KEY_PLACEHOLDER",
    },
    body: JSON.stringify({ uuid: "FILE_UUID_PLACEHOLDER" }),
  },
);

const contentType = response.headers.get("content-type") ?? "";
if (!response.ok || contentType.includes("application/json")) {
  const errorBody = (await response.json()) as Record<string, unknown>;
  throw new Error(JSON.stringify(errorBody));
}

const file = await response.blob();
```

```python
import httpx


async def download_work_item_file() -> bytes:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
        "X-User-Key": "USER_KEY_PLACEHOLDER",
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/WORK_ITEM_ID_PLACEHOLDER/file/download",
            headers=headers,
            json={"uuid": "FILE_UUID_PLACEHOLDER"},
        )
    if response.headers.get("content-type", "").startswith("application/json"):
        payload = response.json()
        if payload.get("err_code", 0) != 0:
            raise RuntimeError(str(payload))
    response.raise_for_status()
    return response.content
```

## 成功结果

成功时响应体是文件字节，不存在可安全展示的 JSON 结果。fixture 用 `binary` 标记表达这一结果，不会伪造文件内容。

## 失败结果

请求的 `uuid` 不存在时，官方示例返回 `30019 / file not found`。官方未公布该 JSON 错误体的 HTTP 状态码，fixture 因此不编造状态码。

```json
{
  "err_code": 30019,
  "err_msg": "file not found",
  "err": {
    "code": 30019,
    "msg": "uuid not found"
  }
}
```

对应 fixture：[下载工作项附件](../../fixtures/openapi/work-item-file-download.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/4bimiqjg
