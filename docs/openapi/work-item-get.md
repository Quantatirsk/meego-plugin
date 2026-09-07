# OpenAPI：获取工作项

该接口批量读取同一空间、同一工作项类型下的工作项详情。一次请求最多包含 50 个 `work_item_ids`。当需要按条件查找实例时，应先使用对应的工作项列表查询接口；本接口适合已知实例 ID 后加载详情。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/:project_key/work_item/:work_item_type_key/query` |
| 身份 | `X-Plugin-Token` 必填；使用插件凭证时按接口要求提供 `X-User-Key` |
| 权限 | 在开放平台的“工作项”权限分类中确认目标接口覆盖范围 |

`project_key` 可以是空间 ID 或空间域名。`work_item_type_key` 必须和请求的实例类型一致。

## `x-auth-mode` 读取边界

本接口在已发布的 `x-auth-mode` 支持清单中。该请求头只对 `plugin_access_token` 或 `virtual_plugin_token` 生效：`1` 要求返回结果严格符合 `X-User-Key` 对应用户的读取权限；`0` 或省略为兼容模式，平台可能返回该用户本身无权读取的内容。`user_access_token` 始终按凭证对应用户严格鉴权，传入该请求头不会改变行为。

代表具体用户展示工作项时，传入 `X-User-Key` 和 `x-auth-mode: 1`。下方示例采用这一严格模式。

## 请求参数

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `work_item_ids` | 是 | 实例 ID 数组，最多 50 个 |
| `fields` | 否 | 指定返回字段；可使用包含模式或以 `-` 开头的排除模式，二者不能混用 |
| `expand` | 否 | 控制用户详情、工作流、富文本、关联信息、子任务父级和复合字段组标识等扩展数据 |

`fields` 省略时默认返回可返回字段。字段没有配置到新建页且从未修改时，可能完全不出现在返回的 `fields` 数组中；判空逻辑必须同时覆盖“字段缺失”和“字段值为空”。

## 通用请求示例

```json
{
  "work_item_ids": [1000000000000001],
  "fields": ["field_summary", "field_status"],
  "expand": {
    "need_workflow": true,
    "need_multi_text": true
  }
}
```

## 可复制示例

以下示例描述插件服务端的运行时请求形状。它们不授权 agent 自行发起真实请求；创建插件、变更 scope 和平台托管配置仍应遵循 `lpm` 工作流。

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/query" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --header "X-User-Key: USER_KEY_PLACEHOLDER" \
  --header "x-auth-mode: 1" \
  --data '{
    "work_item_ids": [1000000000000001],
    "fields": ["field_summary"],
    "expand": {
      "need_workflow": true,
      "need_multi_text": true
    }
  }'
```

```typescript
type ApiEnvelope<T> = {
  data?: T;
  err: { log_id?: string };
  err_code: number;
  err_msg: string;
};

const response = await fetch(
  "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/query",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
      "X-User-Key": "USER_KEY_PLACEHOLDER",
      "x-auth-mode": "1",
    },
    body: JSON.stringify({
      work_item_ids: [1000000000000001],
      fields: ["field_summary"],
      expand: {
        need_workflow: true,
        need_multi_text: true,
      },
    }),
  },
);

const payload = (await response.json()) as ApiEnvelope<unknown[]>;
if (!response.ok || payload.err_code !== 0) {
  const message = payload.err_msg || `HTTP ${response.status}`;
  const logId = payload.err.log_id;
  throw new Error(logId ? `${message} (log_id: ${logId})` : message);
}
```

```python
import httpx


async def get_work_item() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
        "X-User-Key": "USER_KEY_PLACEHOLDER",
        "x-auth-mode": "1",
    }
    body = {
        "work_item_ids": [1000000000000001],
        "fields": ["field_summary"],
        "expand": {
            "need_workflow": True,
            "need_multi_text": True,
        },
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/query",
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

## 返回重点

成功时 `err_code` 为 `0`，`data` 是工作项数组。每个对象包含实例 ID、名称、空间、工作项类型、字段和工作流相关信息。`need_workflow` 仅适用于节点流工作项；状态流会返回空结构。

请求中实例 ID 无效时，官方给出 `30005 / WorkItem Not Found`，通用错误码资料将其映射为 HTTP `404`。超过 50 个 ID 时为 `20028`，工作项类型不匹配时为 `30014`。完整错误对象应保留 `log_id` 供平台日志排查。

调用前先完成[凭证与权限](credentials-permissions.md)检查。该文和 fixture 描述运行时接口契约；agent 只有在用户明确要求具体远端操作时才可使用实际凭证发送请求。

对应 fixture：[获取工作项](../../fixtures/openapi/work-item-get.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/r9jxqxnd
