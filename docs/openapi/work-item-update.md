# OpenAPI：更新工作项

该接口更新一个已存在工作项的指定字段。可编辑字段、字段类型和选项值应先通过创建元数据确认。模板和投票字段不支持修改，已终止工作项也不能直接更新。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `PUT` |
| 路径 | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id` |
| 身份 | `X-Plugin-Token` 必填；使用插件凭证时按接口要求提供 `X-User-Key` |
| 权限 | 在开放平台的“工作项”权限分类中确认目标接口覆盖范围 |

更新会修改平台业务数据。资料和 fixture 定义插件服务端的运行时接口形状；agent 只有在用户明确要求具体目标、字段和值时才可发送真实请求。`lpm` 用于插件生命周期、scope 和平台托管配置，不操作工作项业务数据。

## 请求体

`update_fields` 必填。每项使用 `field_key` 或 `field_alias` 标识目标字段，并携带字段值。

| 字段项属性 | 必填 | 说明 |
| --- | --- | --- |
| `field_key` 或 `field_alias` | 是 | 二者必须且只能提供一个 |
| `field_value` | 条件必填 | 非富文本字段必须提供；富文本字段与 `field_value_markdown` 二选一 |
| `field_value_markdown` | 条件必填 | 仅富文本字段可用；选择它时必须省略 `field_value` |
| `update_mode` | 否 | `0` 替换；`1` 仅更新提交的数据；默认 `0` |
| `field_type_key`、`field_name` | 否 | 辅助字段信息 |

每个字段项都必须有一个值：非富文本字段只传 `field_value`；富文本字段必须且只能传 `field_value` 或 `field_value_markdown` 之一。替换模式会覆盖该字段的原值。更新角色负责人或多人复合字段时，若要保留未变化的数据，应先读取完整当前值；只在平台定义支持的场景下使用 `update_mode: 1`。

## 通用请求示例

```json
{
  "update_fields": [
    {
      "field_key": "field_summary",
      "field_value": "Updated value",
      "update_mode": 0
    }
  ]
}
```

## 可复制示例

以下示例描述插件服务端的运行时请求形状。它们不授权 agent 自行发起真实请求；`lpm` 不操作工作项业务数据。

```sh
curl --request PUT \
  --url "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/WORK_ITEM_ID_PLACEHOLDER" \
  --header "Content-Type: application/json" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --header "X-User-Key: USER_KEY_PLACEHOLDER" \
  --header "X-Idem-UUID: REQUEST_ID_PLACEHOLDER" \
  --data '{
    "update_fields": [
      {
        "field_key": "field_summary",
        "field_value": "Updated value",
        "update_mode": 0
      }
    ]
  }'
```

```typescript
type UpdateWorkItemEnvelope = {
  err: { log_id?: string };
  err_code: number;
  err_msg: string;
};

const response = await fetch(
  "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/WORK_ITEM_ID_PLACEHOLDER",
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
      "X-User-Key": "USER_KEY_PLACEHOLDER",
      "X-Idem-UUID": "REQUEST_ID_PLACEHOLDER",
    },
    body: JSON.stringify({
      update_fields: [
        {
          field_key: "field_summary",
          field_value: "Updated value",
          update_mode: 0,
        },
      ],
    }),
  },
);

const payload = (await response.json()) as UpdateWorkItemEnvelope;
if (!response.ok || payload.err_code !== 0) {
  const message = payload.err_msg || `HTTP ${response.status}`;
  const logId = payload.err.log_id;
  throw new Error(logId ? `${message} (log_id: ${logId})` : message);
}
```

```python
import httpx


async def update_work_item() -> dict[str, object]:
    headers = {
        "Content-Type": "application/json",
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
        "X-User-Key": "USER_KEY_PLACEHOLDER",
        "X-Idem-UUID": "REQUEST_ID_PLACEHOLDER",
    }
    body = {
        "update_fields": [
            {
                "field_key": "field_summary",
                "field_value": "Updated value",
                "update_mode": 0,
            }
        ]
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.put(
            "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/WORK_ITEM_TYPE_KEY_PLACEHOLDER/WORK_ITEM_ID_PLACEHOLDER",
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

## 返回与失败处理

成功时返回 `err_code: 0`。字段找不到时，官方示例返回 `30009 / Field Not Found`，错误对象包含可用于日志排查的 `log_id`。

字段权限、计算字段、无效选项或错误的字段值都可能使更新被拒绝。不要根据客户端显示状态推测服务端授权；服务端仍应按调用身份、空间和字段权限执行校验。

调用前先完成[凭证与权限](credentials-permissions.md)检查。

对应 fixture：[更新工作项](../../fixtures/openapi/work-item-update.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/3e73r2k5
