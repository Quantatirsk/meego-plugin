# 交付物信息批量查询（WBS）

批量读取 WBS 工作项交付物的详情及挂载关系。当前仅支持工作项交付物，原文将节点交付物标为待建设。接口授权位于“工作项实例”分类，参见[获取权限](https://project.feishu.cn/b/helpcenter/1p8d7djs/5bkub0oc#d097cb6f)。

## 选择交付物并理解挂载关系

`work_item_ids` 最多 10 个，填写的是交付物工作项自身 ID，不是挂载它的普通工作项 ID。参数表虽然标为可选，但省略会得到空查询结果；传入非交付物实例返回 `1000053287`。

| 返回关系                                    | 含义                                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| `root_work_item`                            | 交付物挂载链路的根工作项                               |
| `source_work_item`                          | 直接挂载交付物的工作项                                 |
| `instance_linked_virtual_resource_workitem` | 交付物来源工作项 ID                                    |
| `template_resources`                        | 是否为交付物模板资源；原文注明模板资源不关联来源工作项 |

共享返回结构保留 `field_deliverable` 枚举，不代表本查询已支持尚未开放的节点交付物。

<a id="请求说明"></a>

## 请求说明

**请求方式**：`POST`

**请求地址**：`/open_api/work_item/deliverable/batch_query`

<a id="请求参数"></a>

## 请求参数

<a id="header"></a>

### 请求头

接口调用的 Header 配置详见 [Header](../guides/OpenAPI概述.md#a8e43b86)。

<a id="Body"></a>

### 请求体

| 参数            | 类型          | 是否必须 | 说明                                                                                             |
| --------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `project_key`   | `string`      | 必须     | 空间 ID（project_key），在飞书项目空间双击空间双击空间名称获取。                                 |
| `work_item_ids` | `list<int64>` | 可选     | 交付物工作项 ID 列表，限制10个，当查询**工作项交付物**使用此字段查询；**不传入**则查询结果为空。 |

<a id="返回参数"></a>

## 返回参数

| 参数       | 类型           | 说明                                                       |
| ---------- | -------------- | ---------------------------------------------------------- |
| `data`     | `list<object>` | 遵循[Deliverable](../formats/数据结构汇总.md#871e29be)结构规范 |
| `err`      | `object`       | 请求成功时返回空值，请求失败时返回实际错误信息。           |
| `err_msg`  | `string`       | 请求成功时返回空值，请求失败时返回实际错误信息。           |
| `err_code` | `int32`        | 成功为 `0`，失败返回错误码。 |

### `data`

| 参数               | 类型     | 说明                                                                   |
| ------------------ | -------- | ---------------------------------------------------------------------- |
| `deliverable_info` | `object` | 交付物信息，遵循[DeliverableInfo](../formats/数据结构汇总.md#6bc1f508)规范 |
| `deliverable_type` | `string` | 交付物类型。 [详细说明](#field-note-1)                                 |
| `deliverable_uuid` | `string` | 交付物唯一标识                                                         |

<a id="field-note-1"></a>

**deliverable_type**

交付物类型。

- 工作项交付物为 `work_item_deliverable`
- 字段交付物为 `field_deliverable`

### `data.deliverable_info`

| 参数                                        | 类型      | 说明                                                                                 |
| ------------------------------------------- | --------- | ------------------------------------------------------------------------------------ |
| `name`                                      | `string`  | 交付物工作项名称                                                                     |
| `deleted`                                   | `boolean` | 是否删除                                                                             |
| `work_item_id`                              | `int64`   | 交付物工作项 ID                                                                      |
| `template_type`                             | `string`  | 交付物类型                                                                           |
| `template_resources`                        | `boolean` | 是否是交付物模板资源                                                                 |
| `delivery_related_info`                     | `object`  | 交付物关联挂载工作项信息，参见[DeliveryRelatedInfo](../formats/数据结构汇总.md#7a876aa7) |
| `instance_linked_virtual_resource_workitem` | `int64`   | 交付物来源工作项 ID                                                                  |

### `data.deliverable_info.delivery_related_info`

| 参数               | 类型     | 说明                                                                                                   |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------ |
| `root_work_item`   | `object` | 交付物关联挂载工作项的根工作项，参见[DeliveryRelatedInfoItem](../formats/数据结构汇总.md#46187fc0)结构规范 |
| `source_work_item` | `object` | 交付物关联直接挂载工作项，参见[DeliveryRelatedInfoItem](../formats/数据结构汇总.md#46187fc0)结构规范       |

### `data.deliverable_info.delivery_related_info.root_work_item`

| 参数                 | 类型     | 说明       |
| -------------------- | -------- | ---------- |
| `project_key`        | `string` | 空间 key   |
| `work_item_id`       | `int64`  | 工作项 ID  |
| `work_item_type_key` | `string` | 工作项类型 |
| `name`               | `string` | 工作项名称 |

### `data.deliverable_info.delivery_related_info.source_work_item`

| 参数                 | 类型     | 说明       |
| -------------------- | -------- | ---------- |
| `project_key`        | `string` | 空间 key   |
| `work_item_id`       | `int64`  | 工作项 ID  |
| `work_item_type_key` | `string` | 工作项类型 |
| `name`               | `string` | 工作项名称 |

### `err`

| 参数     | 类型     | 说明                                                                                 |
| -------- | -------- | ------------------------------------------------------------------------------------ |
| `code`   | `int32`  | 部分场景下，透出更详细错误对应的错误码。                                             |
| `msg`    | `string` | 部分场景下，透出更详细的错误描述。                                                   |
| `log_id` | `string` | 报错场景下的调用链标识符，用于追踪错误发生时的完整调用链路，便于日志记录和问题排查。 |

<a id="请求示例"></a>

## 请求示例

```text
{
    "project_key": "64fe8d784adf35b81ee6****",
    "work_item_ids": [
        434483****
    ]
}
```

<a id="返回示例"></a>

## 返回示例

请求示例含脱敏数值 `434483****`，属于结构示意；实际调用时应替换成完整整数。成功响应保留原数值与挂载关系。

### 请求成功示例

```json
{
  "err_code": 0,
  "err_msg": "",
  "err": {},
  "data": [
    {
      "deliverable_uuid": "80317000",
      "deliverable_type": "work_item_deliverable",
      "deliverable_info": {
        "name": "f5-a-\u4ea4\u4ed81",
        "work_item_id": 80317000,
        "instance_linked_virtual_resource_workitem": 80082946,
        "template_resources": false,
        "template_type": "662a39ded9e35a2a810199e0_template_1716791427582200564",
        "deleted": false,
        "delivery_related_info": {
          "root_work_item": {
            "project_key": "662a39ded9e35a2a8101xxxx",
            "work_item_id": 80316997,
            "work_item_type_key": "6693cea148a00c27960dxxxx",
            "name": "f5-a"
          },
          "source_work_item": {
            "project_key": "662a39ded9e35a2a8101xxxx",
            "work_item_id": 80316999,
            "work_item_type_key": "6693cea148a00c27960dxxxx",
            "name": "sub"
          }
        }
      }
    }
  ]
}
```

### 错误返回示例

以下错误原因为传入的工作项实例不是交付物类型，请传入交付物类型的工作项实例。

```json
{
  "err_code": 1000053287,
  "err_msg": "\u4f20\u5165\u7684\u5de5\u4f5c\u9879\u5b9e\u4f8b\u4e0d\u662f\u4ea4\u4ed8\u7269\u7c7b\u578b\uff0c\u8bf7\u4f20\u5165\u4ea4\u4ed8\u7269\u7c7b\u578b\u7684\u5de5\u4f5c\u9879\u5b9e\u4f8b",
  "err": {
    "code": 1000053287,
    "msg": "\u4f20\u5165\u7684\u5de5\u4f5c\u9879\u5b9e\u4f8b\u4e0d\u662f\u4ea4\u4ed8\u7269\u7c7b\u578b\uff0c\u8bf7\u4f20\u5165\u4ea4\u4ed8\u7269\u7c7b\u578b\u7684\u5de5\u4f5c\u9879\u5b9e\u4f8b, please refer to https://project.feishu.cn/b/helpcenter/1p8d7djs/5aueo3jr",
    "log_id": "20251031181212238801FF7EE1EA70xxxx"
  }
}
```

<a id="错误码"></a>

## 错误码

以下列出了该接口相关的错误码信息，若需查看更多通用错误码说明，参见 [Open API 错误码](../formats/Open%20API%20错误码.md)。

| err_code   | err_msg                                                      | err.code   | err.msg                                                      | 说明             |
| ---------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ | ---------------- |
| 1000053287 | 传入的工作项实例不是交付物类型，请传入交付物类型的工作项实例 | 1000053287 | 传入的工作项实例不是交付物类型，请传入交付物类型的工作项实例 | 实例非交付物类型 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/xe2145vg
