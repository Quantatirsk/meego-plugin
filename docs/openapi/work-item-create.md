# OpenAPI：创建工作项

该接口在指定空间创建一个工作项，并在成功时返回新实例 ID。创建前必须先取得目标工作项类型和创建元数据，确认字段格式、可选值、层级和流程模板。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `POST` |
| 路径 | `/open_api/:project_key/work_item/create` |
| 身份 | `X-Plugin-Token` 必填；使用插件凭证时按接口要求提供 `X-User-Key` |
| 权限 | 在开放平台的“工作项”权限分类中确认目标接口覆盖范围 |

创建会修改平台业务数据。插件服务端可以按本契约实现运行时调用；agent 只能据此准备代码和本地验证，只有用户明确要求具体目标、字段和值时才可发送真实请求。创建插件、变更 scope 和平台托管配置仍使用 `lpm`。

## 请求体

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `work_item_type_key` | 是 | 目标工作项类型 |
| `field_value_pairs` | 否 | 字段列表；每项以 `field_key` 或 `field_alias` 标识字段 |
| `template_id` | 否 | 流程模板 ID；省略时使用该类型的第一个流程模板 |
| `name` | 否 | 工作项名称 |
| `required_mode` | 否 | `1` 时按新建页必填规则校验；默认 `0` 不校验 |
| `role_mode` | 否 | 由目标空间的角色配置决定其具体行为 |

一个字段项只能使用 `field_key` 或 `field_alias` 之一，并且必须提供值。非富文本字段必须使用 `field_value`；富文本字段必须且只能使用 `field_value` 或 `field_value_markdown` 之一，不能同时传入，也不能两个都省略。选项字段应写元数据中的选项 `value`，不写展示文本。`template_id` 必须置于顶层，不能作为字段项传入。

当顶层 `name` 非空时，`field_value_pairs` 不能再携带 `name` 字段；也不能在字段列表中携带 `template_id`。

## 通用请求示例

```json
{
  "work_item_type_key": "work_item_type_demo",
  "template_id": 1001,
  "name": "Example item",
  "required_mode": 1,
  "field_value_pairs": [
    {
      "field_key": "field_summary",
      "field_value": "Example value"
    }
  ]
}
```

## 可复制示例

以下示例描述插件服务端的运行时请求形状。它们不授权 agent 自行发起真实请求；`lpm` 不操作工作项业务数据。

```sh
curl --request POST \
  --url "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/create" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --header "X-User-Key: USER_KEY_PLACEHOLDER" \
  --header "X-Idem-UUID: REQUEST_ID_PLACEHOLDER" \
  --data '{
    "work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER",
    "template_id": 1001,
    "name": "Example item",
    "required_mode": 1,
    "field_value_pairs": [
      {
        "field_key": "field_summary",
        "field_value": "Example value"
      }
    ]
  }'
```

```typescript
type CreateWorkItemEnvelope = {
  data: number;
  err: Record<string, unknown>;
  err_code: number;
  err_msg: string;
};

const response = await fetch(
  "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/create",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
      "X-User-Key": "USER_KEY_PLACEHOLDER",
      "X-Idem-UUID": "REQUEST_ID_PLACEHOLDER",
    },
    body: JSON.stringify({
      work_item_type_key: "WORK_ITEM_TYPE_KEY_PLACEHOLDER",
      template_id: 1001,
      name: "Example item",
      required_mode: 1,
      field_value_pairs: [
        {
          field_key: "field_summary",
          field_value: "Example value",
        },
      ],
    }),
  },
);

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const payload = (await response.json()) as CreateWorkItemEnvelope;
if (payload.err_code !== 0) {
  throw new Error(payload.err_msg);
}
```

```python
import httpx


async def create_work_item() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
        "X-User-Key": "USER_KEY_PLACEHOLDER",
        "X-Idem-UUID": "REQUEST_ID_PLACEHOLDER",
    }
    body = {
        "work_item_type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER",
        "template_id": 1001,
        "name": "Example item",
        "required_mode": 1,
        "field_value_pairs": [
            {
                "field_key": "field_summary",
                "field_value": "Example value",
            }
        ],
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/create",
            headers=headers,
            json=body,
        )
    response.raise_for_status()
    payload = response.json()
    if payload["err_code"] != 0:
        raise RuntimeError(payload["err_msg"])
    return payload
```

## 返回与失败处理

成功时 `data` 为新工作项 ID，`err_code` 为 `0`。官方列出 `30014 / WorkItem Type Not Found` 作为工作项类型无效的错误，但没有为该场景给出完整错误响应示例。实现应保留平台返回的错误对象与 `log_id`，而不是自行构造错误结构。

写操作建议携带每次请求唯一的 `X-Idem-UUID`，使平台可以识别同一凭证下同一接口的重复请求。该请求头不替代应用侧的业务幂等设计。

调用前先完成[凭证与权限](credentials-permissions.md)检查。

对应 fixture：[创建工作项](../../fixtures/openapi/work-item-create.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/6c8et3fg
