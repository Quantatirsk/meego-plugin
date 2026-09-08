# AI 节点事件

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-ai.node.event"></a>
- **AI 节点事件** ｜ `ai.node.event` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

AI 节点应用通过 Webhook 接收启动、属性变更以及完成、回滚、删除、冻结通知。创建应用并配置回调地址后，平台默认订阅本页的 6 种事件，无需手动逐个订阅。

**启动计算的条件是两个条件同时成立：** `data.event_type == 8001`，且 `data.change_ai_node_info.after.status == "running"`。不能只检查任意快照中的 `running`，否则属性通知或失效通知也可能重复启动计算。

<a id="0d6d62d0"></a>
<a id="5dceebd5"></a>

## 接收流程

1. 按[事件验签规则](../events/事件兼容性与验签.md)，使用预先配置的回调 token 校验 `signature`。
2. 在 **1000 ms** 内返回 HTTP **200**，响应结构不限。原文说明未响应会重发 **4 次**，本页未列重试间隔。
3. 用 `data.idempotent_key` 识别重复事件；确认启动条件后读取输入、执行 AI 逻辑。
4. 使用[修改 AI 节点数据](修改AI节点数据.md)回传结果。需要提交节点表单并完成节点时，另见[完成 AI 节点](完成AI节点.md)及其状态前置条件。

`8001/8002` 与 AI 实体数据变化有关；`8003–8006` 是节点失效类操作，例如人工完成正在运行 AI 实体的节点。消费端应据此处理正在执行的任务，而不是把所有回调都视为启动信号。

<a id="7ce1ae04"></a>

## 公共结构

### 请求外层

| 字段 | 原文类型 | 含义 |
| --- | --- | --- |
| `log_id` | String | 推送日志 ID，用于排查 |
| `source_plugin_version` | String | AI 节点应用版本 |
| `request_time` | Number | 请求生成的毫秒级时间戳 |
| `signature` | String | 请求签名 |
| `source` | String | 事件来源，见下表 |
| `source_plugin_id` | String | 触发事件的 AI 应用 ID |
| `source_plugin_name` | String | 触发事件的 AI 应用名称 |
| `data` | Object | 业务上下文，含 `event_type` 与 `idempotent_key` |

| source | 来源 |
| --- | --- |
| `normal` | 普通用户操作 |
| `openapi` | OpenAPI 调用 |
| `system` | 系统内部行为 |
| `automation` | 自动化规则 |

### data 业务上下文

以下字段按完整示例及注释整理；原文没有逐字段定义必填性，未列出的类型与枚举不作推测。

| 字段或对象 | 含义 |
| --- | --- |
| `event_type` | 本页 6 种事件编号 |
| `idempotent_key` | 事件唯一标识，供消费端幂等处理 |
| `project_key/project_name/tenant_id` | 空间与租户上下文 |
| `flow_type` | 流程类型，示例为 `0`；本页未给枚举 |
| `work_item_type_key/link_work_item_type_key` | 工作项类型与关联类型上下文，后者示例可为空 |
| `user_info` | 操作人，含 `user_key/name_cn/name_en/email` |
| `work_item_info[]` | 工作项快照，含 `work_item_id/work_item_type_key`，部分示例另有 `work_item_name` |
| `change_ai_node_info.before/after` | 变更前后 AI 实体，含 `entity_id/app_identity/status` |
| `node_info` | 完成、回滚、删除、冻结相关的节点操作信息 |
| `ai_node_info` | 当前 AI 节点快照 |

### AI 实体、属性与字段

`entity_id` 是 AI 实体唯一 ID，原注释称节点 UUID；`app_identity.app_key/point_key` 分别标识应用与 AI 点位。

| ai_node_info 字段 | 含义 |
| --- | --- |
| `state_key` | 节点 key |
| `node_state` | 流程节点状态，示例出现 `REACHED/UNREACH`，不同于 AI 实体的状态 |
| `ai_info.status` | AI 运行状态，枚举见事件速查 |
| `ai_info.app_identity` | 应用及点位标识 |
| `ai_info.props[]` | 属性列表，每项含 `prop_key/prop_type/prop_value` |
| `node_fields[]` | 节点字段，含系统字段 |
| `conform_fields[]` | 节点表单字段；保留原键名 `conform` |
| `sub_tasks/sub_work_items` | 原示例为 `null` 且标注 TODO，本页未给有效结构 |

`prop_value` 根据属性来源选择 `field`、`node_field` 或 `custom_property`。`field` 是字段列表；`node_field` 与 `node_fields` 中的元素结构相同；字段元素包含 `field_key/field_type/field_value`。富文本的 `field_value` 在原例中是序列化 JSON **字符串**，未改成对象。

自定义属性使用大小写敏感的 `Value/Type`，与 AI 操作事件中的小写形式不同：

| Type | Value 的原注释含义 |
| --- | --- |
| `multiSelect` | 多选值，示例是包含 JSON 数组的字符串 `"[\"e5f6g7h8\",\"c1d2e3f4\"]"` |
| `select` | 单选值，如 `7anbl6yw3` |
| `text` | 文本，原注释示例“测试文本” |
| `number` | 数字内容，原例仍以字符串 `"123456"` 表示 |

示例按属性类型只填对应来源的数据，字段属性不同时填自定义输入。更多结构见 [AI 节点数据结构](AI节点数据结构.md)。

### node_info 节点操作信息

| 字段 | 说明 |
| --- | --- |
| `update_nodes` | 更新的节点 key 列表 |
| `del_nodes` | 删除的节点列表 |
| `recover_nodes` | 恢复节点信息，示例为 `null` |
| `reason` | 操作原因，回滚示例为 `testAI` |
| `owner_in_charge` | 示例为 `null`，本页未定义有效结构 |
| `schedule_info` | 示例为 `null`，本页未定义有效结构 |

<a id="2aa1f24d"></a>

## 事件速查

| 编号 | 事件 | 处理重点 |
| --- | --- | --- |
| `8001` | AI 节点状态变更 | 仅 `after.status=running` 时启动计算 |
| `8002` | AI 节点属性变更 | 更新属性上下文，不单独作为启动条件 |
| `8003` | AI 节点完成 | 读取 `node_info`，处理节点失效 |
| `8004` | AI 节点回滚 | 读取回滚的节点与原因 |
| `8005` | AI 节点删除 | 只保留应用、点位等基础信息，不再提供完整属性 |
| `8006` | AI 节点冻结 | 冻结操作信息位于 `node_info` |

AI `status` 枚举为 `idle`（等待）、`running`（运行）、`done`（完成）、`stopped`（停止）。

以下保留每个事件的完整示例。中文字符串用等价 Unicode 转义表示，JSON 中的类型不变。原例 `14885xxxx` 不是合法数字，已替换为同页使用的示例 ID `148851027`；掩码签名和 ID 仍是示例值，不能用于真实验签。

<a id="1b56adb1"></a>

## 8001：AI 节点状态变更

手动启动或通过 OpenAPI 修改状态等操作会触发。完整启动路径为 `data.change_ai_node_info.after.status`。

```json
{
  "log_id": "20260108194005A1CBDA420C125FDDxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1767872405616,
  "signature": "981233408d2780d175f83cf01268384b8413d20030780963e72d5cdd0c79xxxx",
  "source": "normal",
  "source_plugin_id": "MII_695A22EC3600xxxx",
  "source_plugin_name": "AI\u8282\u70b9AAA",
  "data": {
    "project_name": "\u7a7a\u95f4AAA",
    "tenant_id": "DeepCollaboration",
    "flow_type": 0,
    "idempotent_key": "df2b112fb079a66049941f287b8eb421450fd851045cc670edbf2aa96835xxxx",
    "project_key": "6870dbd3468e1a8a937axxxx",
    "work_item_type_key": "695b66e42aeb2e807c09xxxx",
    "link_work_item_type_key": "",
    "event_type": 8001,
    "user_info": {
      "user_key": "709678364142603xxxx",
      "name_cn": "xxx",
      "name_en": "xxx",
      "email": "123@test.com"
    },
    "work_item_info": [
      {
        "work_item_id": 148851027,
        "work_item_type_key": "695b66e42aeb2e807c09xxxx"
      }
    ],
    "change_ai_node_info": {
      "before": {
        "entity_id": "node_state_2_14885xxxx",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83xxxx"
        },
        "status": "stopped"
      },
      "after": {
        "entity_id": "node_state_2_14885xxxx",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83xxxx"
        },
        "status": "running"
      }
    },
    "ai_node_info": {
      "state_key": "state_2",
      "node_state": "REACHED",
      "ai_info": {
        "status": "running",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "props": [
          {
            "prop_key": "nxpirx",
            "prop_type": [
              "field"
            ],
            "prop_value": {
              "field": [
                {
                  "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u5bcc\u6587\u672c\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u5bcc\u6587\u672c\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u5bcc\u6587\u672c\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
                  "field_key": "field_ec09da",
                  "field_type": "multi-text"
                }
              ],
              "node_field": null
            }
          }
        ]
      },
      "node_fields": [
        {
          "field_value": "514",
          "field_key": "status",
          "field_type": "workitem_related_select"
        }
      ],
      "conform_fields": [
        {
          "field_value": "test10",
          "field_key": "name",
          "field_type": "_name"
        },
        {
          "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u8ba1\u7b97\u5b57\u6bb5\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u8ba1\u7b97\u5b57\u6bb5\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u8ba1\u7b97\u5b57\u6bb5\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
          "field_key": "description",
          "field_type": "multi-text"
        }
      ],
      "sub_tasks": null,
      "sub_work_items": null
    }
  }
}
```

<a id="5b8efeee"></a>
<a id="b43f540c"></a>

## 8002：AI 节点属性变更

例如用户修改节点属性。以下示例的 AI 状态前后均为 `running`，表示属性变化而非新启动；状态值已按这一场景校正。

```json
{
  "log_id": "20260108194005A1CBDA420C125FDDxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1767872405616,
  "signature": "981233408d2780d175f83cf01268384b8413d20030780963e72d5cdd0c7xxxx",
  "source": "normal",
  "source_plugin_id": "MII_695A22EC3600xxxx",
  "source_plugin_name": "AI\u8282\u70b9AAA",
  "data": {
    "project_name": "\u7a7a\u95f4AAA",
    "tenant_id": "DeepCollaboration",
    "flow_type": 0,
    "idempotent_key": "df2b112fb079a66049941f287b8eb421450fd851045cc670edbf2aa96835xxxx",
    "project_key": "6870dbd3468e1a8a937axxxx",
    "work_item_type_key": "695b66e42aeb2e807c09xxxx",
    "link_work_item_type_key": "",
    "event_type": 8002,
    "user_info": {
      "user_key": "709678364142603xxxx",
      "name_cn": "xxx",
      "name_en": "xxx",
      "email": "123@test.com"
    },
    "work_item_info": [
      {
        "work_item_id": 148851027,
        "work_item_type_key": "695b66e42aeb2e807c09xxxx"
      }
    ],
    "change_ai_node_info": {
      "before": {
        "entity_id": "node_state_2_14885xxxx",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "status": "running"
      },
      "after": {
        "entity_id": "node_state_2_14885xxxx",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "status": "running"
      }
    },
    "ai_node_info": {
      "state_key": "state_2",
      "node_state": "REACHED",
      "ai_info": {
        "status": "running",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "props": [
          {
            "prop_key": "nxpirx",
            "prop_type": [
              "field"
            ],
            "prop_value": {
              "field": [
                {
                  "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u5bcc\u6587\u672c\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u5bcc\u6587\u672c\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u5bcc\u6587\u672c\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
                  "field_key": "field_ec09da",
                  "field_type": "multi-text"
                }
              ],
              "node_field": null
            }
          }
        ]
      },
      "node_fields": [
        {
          "field_value": "514",
          "field_key": "status",
          "field_type": "workitem_related_select"
        }
      ],
      "conform_fields": [
        {
          "field_value": "test10",
          "field_key": "name",
          "field_type": "_name"
        },
        {
          "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u8ba1\u7b97\u5b57\u6bb5\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u8ba1\u7b97\u5b57\u6bb5\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u8ba1\u7b97\u5b57\u6bb5\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
          "field_key": "description",
          "field_type": "multi-text"
        }
      ],
      "sub_tasks": null,
      "sub_work_items": null
    }
  }
}
```

<a id="132f8c52"></a>

## 8003：AI 节点完成

相比状态变更示例，增加 `node_info`。原样例中的 AI 状态仍为 `running`，因此不能只靠快照状态判断是否启动；原代码块误标 SQL，现按 JSON 排版。

```json
{
  "log_id": "20260108194005A1CBDA420C125FDDxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1767872405616,
  "signature": "981233408d2780d175f83cf01268384b8413d20030780963e72d5cdd0c79xxxx",
  "source": "normal",
  "source_plugin_id": "MII_695A22EC3600xxxx",
  "source_plugin_name": "AI\u8282\u70b9AAA",
  "data": {
    "project_name": "\u7a7a\u95f4AAA",
    "tenant_id": "DeepCollaboration",
    "flow_type": 0,
    "idempotent_key": "df2b112fb079a66049941f287b8eb421450fd851045cc670edbf2aa96835xxxx",
    "project_key": "6870dbd3468e1a8a937axxxx",
    "work_item_type_key": "695b66e42aeb2e807c09xxxx",
    "link_work_item_type_key": "",
    "event_type": 8003,
    "user_info": {
      "user_key": "709678364142603xxxx",
      "name_cn": "xxx",
      "name_en": "xxx",
      "email": "user@example.com"
    },
    "node_info": {
      "update_nodes": [
        "state_2"
      ],
      "del_nodes": null,
      "recover_nodes": null,
      "reason": "",
      "owner_in_charge": null,
      "schedule_info": null
    },
    "work_item_info": [
      {
        "work_item_id": 148851027,
        "work_item_name": "test10",
        "work_item_type_key": "695b66e42aeb2e807c09xxxx"
      }
    ],
    "change_ai_node_info": {
      "before": {
        "entity_id": "node_state_2_148851027",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "status": "stopped"
      },
      "after": {
        "entity_id": "node_state_2_148851027",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "status": "running"
      }
    },
    "ai_node_info": {
      "state_key": "state_2",
      "node_state": "REACHED",
      "ai_info": {
        "status": "running",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "props": [
          {
            "prop_key": "nxpirx",
            "prop_type": [
              "field"
            ],
            "prop_value": {
              "field": [
                {
                  "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u5bcc\u6587\u672c\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u5bcc\u6587\u672c\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u5bcc\u6587\u672c\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
                  "field_key": "field_ec09da",
                  "field_type": "multi-text"
                }
              ],
              "node_field": null
            }
          }
        ]
      },
      "node_fields": [
        {
          "field_value": "514",
          "field_key": "status",
          "field_type": "workitem_related_select"
        }
      ],
      "conform_fields": [
        {
          "field_value": "test10",
          "field_key": "name",
          "field_type": "_name"
        },
        {
          "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u8ba1\u7b97\u5b57\u6bb5\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u8ba1\u7b97\u5b57\u6bb5\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u8ba1\u7b97\u5b57\u6bb5\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
          "field_key": "description",
          "field_type": "multi-text"
        }
      ],
      "sub_tasks": null,
      "sub_work_items": null
    }
  }
}
```

<a id="3f889d52"></a>

## 8004：AI 节点回滚

回滚信息在 `node_info`。原样例误写 `event_type: 8001`，这里按本节定义改为 `8004`，其他字段保持原语义。

```json
{
  "log_id": "20260108194005A1CBDA420C125FDDxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1767872405616,
  "signature": "981233408d2780d175f83cf01268384b8413d20030780963e72d5cdd0c79xxxx",
  "source": "normal",
  "source_plugin_id": "MII_695A22EC3600xxxx",
  "source_plugin_name": "AI\u8282\u70b9AAA",
  "data": {
    "project_name": "\u7a7a\u95f4AAA",
    "tenant_id": "DeepCollaboration",
    "flow_type": 0,
    "idempotent_key": "df2b112fb079a66049941f287b8eb421450fd851045cc670edbf2aa96835xxxx",
    "project_key": "6870dbd3468e1a8a937axxxx",
    "work_item_type_key": "695b66e42aeb2e807c09xxxx",
    "link_work_item_type_key": "",
    "event_type": 8004,
    "user_info": {
      "user_key": "709678364142603xxxx",
      "name_cn": "xxx",
      "name_en": "xxx",
      "email": "user@example.com"
    },
    "node_info": {
      "update_nodes": [
        "state_2"
      ],
      "del_nodes": null,
      "recover_nodes": null,
      "reason": "testAI",
      "owner_in_charge": null,
      "schedule_info": null
    },
    "work_item_info": [
      {
        "work_item_id": 148851027,
        "work_item_type_key": "695b66e42aeb2e807c09xxxx"
      }
    ],
    "ai_node_info": {
      "state_key": "state_2",
      "node_state": "REACHED",
      "ai_info": {
        "status": "running",
        "app_identity": {
          "app_key": "MII_695A22EC3600xxxx",
          "point_key": "ai_node_83hw36"
        },
        "props": [
          {
            "prop_key": "nxpirx",
            "prop_type": [
              "field"
            ],
            "prop_value": {
              "field": [
                {
                  "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u5bcc\u6587\u672c\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u5bcc\u6587\u672c\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u5bcc\u6587\u672c\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
                  "field_key": "field_ec09da",
                  "field_type": "multi-text"
                }
              ],
              "node_field": null
            }
          }
        ]
      },
      "node_fields": [
        {
          "field_value": "514",
          "field_key": "status",
          "field_type": "workitem_related_select"
        }
      ],
      "conform_fields": [
        {
          "field_value": "test10",
          "field_key": "name",
          "field_type": "_name"
        },
        {
          "field_value": "{\"doc\":\"{\\\"0\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"\u8ba1\u7b97\u5b57\u6bb5\\\\n\\\"}],\\\"zoneId\\\":\\\"0\\\",\\\"zoneType\\\":\\\"Z\\\"}}\",\"doc_text\":\"\u8ba1\u7b97\u5b57\u6bb5\",\"doc_img\":null,\"doc_html\":\"\\u003cdiv class=\\\"ace-line\\\" data-node=\\\"true\\\" dir=\\\"auto\\\"\\u003e\\u003cspan data-string=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\u8ba1\u7b97\u5b57\u6bb5\\u003c/span\\u003e\\u003cspan data-string=\\\"true\\\" data-enter=\\\"true\\\" data-leaf=\\\"true\\\"\\u003e\\u003c/span\\u003e\\u003c/div\\u003e\",\"is_empty\":false,\"notify_user_list\":[],\"notify_user_type\":\"\",\"external_storage_key\":\"\",\"is_trunc\":false}",
          "field_key": "description",
          "field_type": "multi-text"
        }
      ],
      "sub_tasks": null,
      "sub_work_items": null
    }
  }
}
```

<a id="d22080f5"></a>

## 8005：AI 节点删除

被删除节点只提供应用 key、点位等基础信息；属性、节点字段和表单等在示例中均为空。

```json
{
  "log_id": "20260113190028D4F03A6A4B8D2AD8xxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1768302031049,
  "signature": "d4490b77c54991ca5724bc69c08dd0f12041a2b920daf1dffadb61274c8axxxx",
  "source": "normal",
  "source_plugin_id": "MII_694B55BEC1C0xxxx",
  "source_plugin_name": "AI\u8282\u70b9",
  "data": {
    "project_name": "\u6d4b\u8bd5 AI \u8282\u70b91111",
    "tenant_id": "DeepCollaboration",
    "flow_type": 0,
    "idempotent_key": "8931113bec8a9d4318184572df4ed7ac0f6092ce2bdb378108a9e5cff16axxxx",
    "project_key": "6890a9f5610c48aef7c7xxxx",
    "work_item_type_key": "story",
    "link_work_item_type_key": "",
    "event_type": 8005,
    "user_info": {
      "user_key": "700765935773956xxxx",
      "name_cn": "\u7528\u62371",
      "name_en": "\u7528\u62371",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 150443271,
        "work_item_name": "\u6d4b\u8bd5\u53ef\u5220\u9664\u8282\u70b9",
        "work_item_type_key": "story"
      }
    ],
    "node_info": {
      "update_nodes": null,
      "del_nodes": [
        "state_1"
      ],
      "recover_nodes": null,
      "reason": "",
      "owner_in_charge": null,
      "schedule_info": null
    },
    "ai_node_info": {
      "state_key": "state_1",
      "node_state": "UNREACH",
      "ai_info": {
        "status": "idle",
        "app_identity": {
          "app_key": "MII_694B55BEC1C0xxxx",
          "point_key": "ai_node_q2xxxx"
        },
        "props": null
      },
      "node_fields": null,
      "conform_fields": null,
      "sub_tasks": null,
      "sub_work_items": null
    }
  }
}
```

<a id="85ad7623"></a>

## 8006：AI 节点冻结

冻结信息在 `node_info`。以下示例统一使用 `state_1`，使操作节点与节点快照一致；这是经校正的演示载荷。

```json
{
  "log_id": "20260113190028D4F03A6A4B8D2AD8xxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1768302031049,
  "signature": "d4490b77c54991ca5724bc69c08dd0f12041a2b920daf1dffadb61274c8axxxx",
  "source": "normal",
  "source_plugin_id": "MII_694B55BEC1C0xxxx",
  "source_plugin_name": "AI\u8282\u70b9",
  "data": {
    "project_name": "\u6d4b\u8bd5 AI \u8282\u70b91111",
    "tenant_id": "DeepCollaboration",
    "flow_type": 0,
    "idempotent_key": "8931113bec8a9d4318184572df4ed7ac0f6092ce2bdb378108a9e5cff16axxxx",
    "project_key": "6890a9f5610c48aef7c7xxxx",
    "work_item_type_key": "story",
    "link_work_item_type_key": "",
    "event_type": 8006,
    "user_info": {
      "user_key": "700765935773956xxxx",
      "name_cn": "\u7528\u62371",
      "name_en": "\u7528\u62371",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 150443271,
        "work_item_name": "\u6d4b\u8bd5\u53ef\u5220\u9664\u8282\u70b9",
        "work_item_type_key": "story"
      }
    ],
    "node_info": {
      "update_nodes": [
        "state_1"
      ],
      "del_nodes": null,
      "recover_nodes": null,
      "reason": "",
      "owner_in_charge": null,
      "schedule_info": null
    },
    "ai_node_info": {
      "state_key": "state_1",
      "node_state": "UNREACH",
      "ai_info": {
        "status": "idle",
        "app_identity": {
          "app_key": "MII_694B55BEC1C0xxxx",
          "point_key": "ai_node_q2xxxx"
        },
        "props": null
      },
      "node_fields": null,
      "conform_fields": null,
      "sub_tasks": null,
      "sub_work_items": null
    }
  }
}
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/dl7cjf41
