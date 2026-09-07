# OpenAPI：获取工作项类型配置

该接口读取一个工作项类型的基础配置，例如流程模式、导航入口、整体排期、工时开关和资源库设置。它返回配置事实，不替代创建或更新工作项所需的字段元数据。

## 调用契约

| 项目 | 值 |
| --- | --- |
| 方法 | `GET` |
| 路径 | `/open_api/:project_key/work_item/type/:work_item_type_key` |
| 请求体 | 无 |
| 返回 | 标准 `data`、`err`、`err_code`、`err_msg` 信封 |

`project_key` 可使用空间 ID 或空间 URL 短名。`work_item_type_key` 必须来自目标空间的工作项类型列表，不能用展示名称替代。

## 认证边界

本端点主文只复用通用 Header 规则，未单独给出 `X-User-Key` 的必填性。以下示例展示插件凭证代表用户读取时的请求头；用户凭证调用仍按凭证对应用户鉴权。该端点不在 `x-auth-mode` 的已发布支持清单中，不能借由该请求头改变读取权限。

## 可复制示例

```sh
curl --request GET \
  --url "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/type/WORK_ITEM_TYPE_KEY_PLACEHOLDER" \
  --header "X-Plugin-Token: PLUGIN_ACCESS_TOKEN_PLACEHOLDER" \
  --header "X-User-Key: USER_KEY_PLACEHOLDER"
```

```typescript
type ApiEnvelope<T> = {
  data: T;
  err: Record<string, unknown>;
  err_code: number;
  err_msg: string;
};

const response = await fetch(
  "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/type/WORK_ITEM_TYPE_KEY_PLACEHOLDER",
  {
    method: "GET",
    headers: {
      "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
      "X-User-Key": "USER_KEY_PLACEHOLDER",
    },
  },
);

const payload = (await response.json()) as ApiEnvelope<Record<string, unknown>>;
if (!response.ok || payload.err_code !== 0) {
  throw new Error(payload.err_msg || `HTTP ${response.status}`);
}
```

```python
import httpx


async def get_work_item_type_config() -> dict[str, object]:
    headers = {
        "X-Plugin-Token": "PLUGIN_ACCESS_TOKEN_PLACEHOLDER",
        "X-User-Key": "USER_KEY_PLACEHOLDER",
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://project.feishu.cn/open_api/SPACE_ID_PLACEHOLDER/work_item/type/WORK_ITEM_TYPE_KEY_PLACEHOLDER",
            headers=headers,
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
  "data": {
    "type_key": "WORK_ITEM_TYPE_KEY_PLACEHOLDER",
    "name": "Example Type",
    "api_name": "example_type",
    "flow_mode": "workflow",
    "description": "",
    "is_disabled": false,
    "is_pinned": false,
    "enable_schedule": true,
    "schedule_field_key": "field_schedule",
    "schedule_field_name": "Schedule",
    "actual_work_time_switch": false,
    "enable_model_resource_lib": false,
    "belong_roles": [],
    "resource_lib_setting": {
      "enable_roles": [],
      "enable_fields": []
    }
  },
  "err": {},
  "err_msg": "",
  "err_code": 0
}
```

`flow_mode` 的已发布值为 `stateflow` 和 `workflow`。`schedule_field_key` 与 `schedule_field_name` 仅在 `enable_schedule` 为 `true` 时生效。不要把示例中空的估分或工时字段推断为平台固定默认值。

## 失败结果

找不到路径中的工作项类型时，官方示例返回 `30014 / WorkItem Type Not Found`。

```json
{
  "err_code": 30014,
  "err_msg": "WorkItem Type Not Found",
  "err": {
    "code": 30014,
    "msg": "Work item not found",
    "log_id": "LOG_ID_PLACEHOLDER"
  }
}
```

对应 fixture：[获取工作项类型配置](../../fixtures/openapi/work-item-type-config.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/1g7mtrm9
