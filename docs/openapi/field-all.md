# OpenAPI：获取字段信息

该接口读取指定空间中的字段定义。传入工作项类型时只返回该类型的字段；省略该参数时返回空间范围内的字段定义。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/:project_key/field/all` |
| 请求体 | `application/json` |
| 返回 | 标准 `data`、`err`、`err_code`、`err_msg` 信封 |

`project_key` 可使用空间 ID 或空间 URL 短名。字段应使用 `field_key` 作稳定标识；`field_alias` 是对接标识，`field_name` 仅供显示。

## 认证边界

本接口要求 `X-Plugin-Token`。首次获取插件凭证的端点是接口级例外，不能携带既有 token。主文没有把 `X-User-Key` 定义成此接口的端点级必填字段；下面的插件凭证示例携带用户标识，用户凭证调用则按凭证自身的用户身份鉴权。此接口不在 `x-auth-mode` 的已发布支持清单中，不应添加该请求头并假设它有效。

## 请求体

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `work_item_type_key` | 否 | 只查询该工作项类型的字段；省略时查询空间字段 |

```json
{
  "work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER"
}
```

## 可复制示例

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/field/all" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --header "X-User-Key: USER_KEY_PLACEHOLDER" \
  --data '{
    "work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER"
  }'
```

```typescript
type ApiEnvelope<T> = {
  data: T;
  err: Record<string, unknown>;
  err_code: number;
  err_msg: string;
};

const response = await fetch(
  "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/field/all",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
      "X-User-Key": "USER_KEY_PLACEHOLDER",
    },
    body: JSON.stringify({
      work_item_type_key: "WORK_ITEM_TYPE_KEY_PLACEHOLDER",
    }),
  },
);

const payload = (await response.json()) as ApiEnvelope<unknown[]>;
if (!response.ok || payload.err_code !== 0) {
  throw new Error(payload.err_msg || `HTTP ${response.status}`);
}
```

```python
import httpx


async def list_fields() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
        "X-User-Key": "USER_KEY_PLACEHOLDER",
    }
    body = {"work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER"}
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/field/all",
            headers=headers,
            json=body,
        )
    response.raise_for_status()
    payload = response.json()
    if payload["err_code"] != 0:
        raise RuntimeError(payload["err_msg"])
    return payload
```

## 成功结果

```json
{
  "data": [
    {
      "field_key": "field_summary",
      "field_alias": "summary_alias",
      "field_type_key": "text",
      "field_name": "Summary",
      "is_custom_field": true,
      "work_item_scopes": ["WORK_ITEM_TYPE_KEY_PLACEHOLDER"],
      "relation_id": ""
    }
  ],
  "err": {},
  "err_code": 0,
  "err_msg": ""
}
```

选项字段的 `options`、复合字段的 `compound_fields` 和多人复合字段的 `editable_personnel_scope` 只会在对应字段类型中出现。不要从字段名称推断字段值格式，应以本次返回的 `field_type_key` 和元数据为准。

## 失败结果

当路径空间与 `work_item_type_key` 不匹配时，官方示例返回 `30001 / Data Not Found`。

```json
{
  "err_code": 30001,
  "err_msg": "Data Not Found",
  "err": {
    "code": 30001,
    "msg": "Data not found in project SPACE_ID_PLACEHOLDER with work_item_type WORK_ITEM_TYPE_KEY_PLACEHOLDER",
    "log_id": "LOG_ID_PLACEHOLDER"
  }
}
```

对应 fixture：[获取字段信息](../../fixtures/openapi/field-all.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/3tsposa2
