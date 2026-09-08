# AI 操作事件说明

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-ai.operation.event"></a>
- **AI 操作事件** ｜ `ai.operation.event` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

AI 操作应用配置 Webhook 后，平台默认订阅 `8201–8207` 七种事件。回调携带操作人、工作项和 AI 实体上下文，用于启动计算、感知输入变化，以及处理工作项状态和生命周期变化。

**启动计算须同时满足** `data.event_type == 8201` 和 `data.change_ai_info.after.status == "running"`。`8202–8207` 的快照同样可能带有 `running`，不能仅凭 `data.ai_entity.status` 启动任务。

<a id="e83ccdeb"></a>

## 接收与启动判断

每个请求含 `signature`，用配置的回调 token 按[事件验签规则](../events/事件兼容性与验签.md)校验。重试同一事件时 `data.idempotent_key` 保持不变，可用于去重。

确认启动后，从 `data.ai_entity.props` 读取当前输入，执行 AI 逻辑，并通过 OpenAPI 回传结果。状态回写见[更新 AI 操作运行状态](更新AI操作运行状态.md)，数据访问边界见 [AI 操作权限说明](AI操作权限说明.md)。本页原文没有单独规定响应时限和重试间隔，不能把其他 AI 事件页的参数视为本页已明确的契约。

<a id="6942a63e"></a>

## 公共事件结构

### 请求外层

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `log_id` | string | 请求日志 ID |
| `source_plugin_version` | string | 触发事件的应用版本 |
| `request_time` | int64 | 毫秒时间戳 |
| `signature` | string | 请求签名 |
| `source` | string | 事件来源，原文常见值为 `normal` |
| `source_plugin_id` | string | 触发事件的应用 ID |
| `source_plugin_name` | string | 触发事件的应用名称 |
| `data` | object | 核心业务对象 |

### data 公共字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `event_type` | int | 事件类型编号 |
| `idempotent_key` | string | 同一事件重试时不变的幂等键 |
| `tenant_id` | string | 租户标识 |
| `project_key` | string | 空间 key |
| `project_name` | string | 空间名称 |
| `flow_type` | int64 | `0` 普通流程，`1` 状态流 |
| `work_item_type_key` | string | 工作项类型 key |
| `link_work_item_type_key` | string | 关联工作项类型 key，可能为空 |
| `user_info` | object | 触发用户信息 |
| `work_item_info` | array | 工作项基础快照 |

示例中 `user_info` 含 `user_key/name_cn/name_en/email`；`work_item_info[]` 含 `work_item_id/work_item_name/work_item_type_key`。这些子字段在原文中没有独立必填或类型表，保留示例所示结构。

### AI 实体快照与变化信息

| 对象 | 字段与用途 |
| --- | --- |
| `data.ai_entity` | 当前实体，含 `entity_id/app_identity/status/state_key/props` |
| `app_identity` | `app_key` 应用标识、`point_key` AI 操作点位标识 |
| `props[]` | 属性，含 `prop_key/prop_type/prop_value` |
| `data.change_ai_info.before/after` | 变更前后实体标识和状态，含 `entity_id/app_identity/status`，不含 `props` |

`ai_entity.status` 是 AI 实体运行状态，`ai_entity.state_key` 是关联流程状态 key。本页未列完整 AI 状态枚举，示例中使用 `idle/running`；不要把 `IN_PROGRESS/RESOLVED` 等工作项状态混入 AI 运行状态。

属性示例包含三类输入：

| prop_type | prop_value 内容 | 子字段 |
| --- | --- | --- |
| `["field"]` | `field[]` | `field_value/field_key/field_type/field_name` |
| `["role"]` | `role_info`，按角色 key 分组 | 每个角色对应人员数组，元素含 `user_key/name` |
| `null` | `custom_property` | 小写 `value/type`，示例类型为 `text` |

AI 节点事件里的自定义属性使用大写 `Value/Type`，本页使用小写，不跨场景改名。示例为每个属性使用独立 key。

<a id="f4ae73da"></a>

## 七种事件速查

| 编号 | 触发场景 | 来源事件 | 特有数据 |
| --- | --- | --- | --- |
| `8201` | AI 实体创建为运行态，或 AI 实体状态变化 | `AIEntityCreated/AIEntityStatusChanged` | `ai_entity/change_ai_info` |
| `8202` | 运行期间引用字段、角色或自定义输入变化 | `AIEntityPropsChanged/AIEntityPropFieldChanged` | 最新 `ai_entity.props`，及 `change_ai_info` |
| `8203` | 运行期间关联状态流工作项变更状态 | `WorkItemUpdateStatusNew` | `ai_entity/change_status` |
| `8204` | 运行期间关联状态流实例被删除 | `WorkItemDeletedNew` | `ai_entity` |
| `8205` | 运行期间关联状态流实例被终止 | `WorkItemAbortedNew` | `ai_entity/reason` |
| `8206` | 运行期间关联状态流实例从终止恢复 | `WorkItemRestoreNew` | `ai_entity` |
| `8207` | 运行期间关联状态流模板升级 | `WorkItemTemplateUpdateNew` | `ai_entity/change_template` |

以下保留七种事件各自的数据结构。中文字符串使用等价 JSON Unicode 转义，掩码签名与占位 ID 不可用于真实请求。状态流场景统一使用 `flow_type: 1`，与公共字段定义一致。

<a id="6c265ec7"></a>

## 8201：AI 操作状态变更

包括状态到达触发计算、手动计算、停止、完成等变化。创建出的实体已是 `running` 时，平台补发 `idle → running` 的 `8201`；其他 AI 状态变化透传为同一事件编号。

`ai_entity` 含当前输入属性，`change_ai_info` 只记录前后标识及状态，不含属性。

```json
{
  "log_id": "20260628201908xxxxxxxxxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1782649149896,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "source": "normal",
  "source_plugin_id": "MII_xxxxxxxxxxxxxxxx",
  "source_plugin_name": "AI \u64cd\u4f5c\u5e94\u7528",
  "data": {
    "event_type": 8201,
    "tenant_id": "tenant_key",
    "project_key": "project_key",
    "project_name": "\u9879\u76ee\u540d\u79f0",
    "flow_type": 1,
    "idempotent_key": "xxxxxxxxxxxxxxxx",
    "work_item_type_key": "issue",
    "link_work_item_type_key": "",
    "user_info": {
      "user_key": "operator_user_key",
      "name_cn": "\u4e2d\u6587\u540d",
      "name_en": "\u82f1\u6587\u540d",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 123456789,
        "work_item_name": "\u5de5\u4f5c\u9879\u6807\u9898",
        "work_item_type_key": "issue"
      }
    ],
    "ai_entity": {
      "entity_id": "entity_id",
      "app_identity": {
        "app_key": "MII_xxxxxxxxxxxxxxxx",
        "point_key": "ai_operation_xxx"
      },
      "status": "running",
      "state_key": "IN_PROGRESS",
      "props": [
        {
          "prop_key": "prop_key1",
          "prop_type": [
            "field"
          ],
          "prop_value": {
            "field": [
              {
                "field_value": "field_value",
                "field_key": "priority",
                "field_type": "select",
                "field_name": "\u4f18\u5148\u7ea7"
              }
            ]
          }
        },
        {
          "prop_key": "prop_key2",
          "prop_type": [
            "role"
          ],
          "prop_value": {
            "role_info": {
              "role_xxx": [
                {
                  "user_key": "user_key",
                  "name": "\u7528\u6237\u540d\u79f0"
                }
              ]
            }
          }
        },
        {
          "prop_key": "prop_key3",
          "prop_type": null,
          "prop_value": {
            "custom_property": {
              "value": "\u81ea\u5b9a\u4e49\u8f93\u5165\u5185\u5bb9",
              "type": "text"
            }
          }
        }
      ]
    },
    "change_ai_info": {
      "before": {
        "entity_id": "entity_id",
        "app_identity": {
          "app_key": "MII_xxxxxxxxxxxxxxxx",
          "point_key": "ai_operation_xxx"
        },
        "status": "idle"
      },
      "after": {
        "entity_id": "entity_id",
        "app_identity": {
          "app_key": "MII_xxxxxxxxxxxxxxxx",
          "point_key": "ai_operation_xxx"
        },
        "status": "running"
      }
    }
  }
}
```

<a id="70329611"></a>

## 8202：AI 操作配置内容变更

只在 AI 操作运行期间推送。`ai_entity.props` 是最新输入，`change_ai_info` 中的状态通常不变；本例前后均为 `running`，不是新的启动信号。

```json
{
  "log_id": "20260628201908xxxxxxxxxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1782649149896,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "source": "normal",
  "source_plugin_id": "MII_xxxxxxxxxxxxxxxx",
  "source_plugin_name": "AI \u64cd\u4f5c\u5e94\u7528",
  "data": {
    "event_type": 8202,
    "tenant_id": "tenant_key",
    "project_key": "project_key",
    "project_name": "\u9879\u76ee\u540d\u79f0",
    "flow_type": 1,
    "idempotent_key": "xxxxxxxxxxxxxxxx",
    "work_item_type_key": "issue",
    "link_work_item_type_key": "",
    "user_info": {
      "user_key": "operator_user_key",
      "name_cn": "\u4e2d\u6587\u540d",
      "name_en": "\u82f1\u6587\u540d",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 123456789,
        "work_item_name": "\u5de5\u4f5c\u9879\u6807\u9898",
        "work_item_type_key": "issue"
      }
    ],
    "ai_entity": {
      "entity_id": "entity_id",
      "app_identity": {
        "app_key": "MII_xxxxxxxxxxxxxxxx",
        "point_key": "ai_operation_xxx"
      },
      "status": "running",
      "state_key": "IN_PROGRESS",
      "props": [
        {
          "prop_key": "prop_key1",
          "prop_type": [
            "field"
          ],
          "prop_value": {
            "field": [
              {
                "field_value": "field_value",
                "field_key": "priority",
                "field_type": "select",
                "field_name": "\u4f18\u5148\u7ea7"
              }
            ]
          }
        },
        {
          "prop_key": "prop_key2",
          "prop_type": [
            "role"
          ],
          "prop_value": {
            "role_info": {
              "role_xxx": [
                {
                  "user_key": "user_key",
                  "name": "\u7528\u6237\u540d\u79f0"
                }
              ]
            }
          }
        },
        {
          "prop_key": "prop_key3",
          "prop_type": null,
          "prop_value": {
            "custom_property": {
              "value": "\u81ea\u5b9a\u4e49\u8f93\u5165\u5185\u5bb9",
              "type": "text"
            }
          }
        }
      ]
    },
    "change_ai_info": {
      "before": {
        "entity_id": "entity_id",
        "app_identity": {
          "app_key": "MII_xxxxxxxxxxxxxxxx",
          "point_key": "ai_operation_xxx"
        },
        "status": "running"
      },
      "after": {
        "entity_id": "entity_id",
        "app_identity": {
          "app_key": "MII_xxxxxxxxxxxxxxxx",
          "point_key": "ai_operation_xxx"
        },
        "status": "running"
      }
    }
  }
}
```

<a id="78d21f61"></a>

## 8203：状态流工作项状态变更

`change_status.before` 取历史状态中 `updated_at` 最近的一条，`after` 是当前状态。下面是 **data 内的差异片段**，完整事件还包含公共字段与 `ai_entity`。

```json
{
  "change_status": {
    "before": {
      "state_key": "IN_PROGRESS",
      "is_archived_state": false,
      "is_init_state": false,
      "updated_at": 1782649148594,
      "updated_by": "user_key",
      "terminated_at": 1782649603023,
      "terminated_by": "user_key"
    },
    "after": {
      "state_key": "RESOLVED",
      "updated_at": 1782649603023,
      "updated_by": "user_key"
    }
  }
}
```

片段保留 `state_key/is_archived_state/is_init_state/updated_at/updated_by/terminated_at/terminated_by`。原文没有为这些差异字段单独规定必填性，不能由 `before` 推导 `after` 一定返回相同字段。

<a id="28b1172f"></a>

## 8204：关联实例删除

在运行期间关联的状态流工作项被删除时推送，仍提供当前 `ai_entity` 及其属性。

角色数据按同页其余事件共同使用的人员数组结构统一，避免删除事件的旧示例出现不同形状。

```json
{
  "log_id": "20260628201908xxxxxxxxxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1782649149896,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "source": "normal",
  "source_plugin_id": "MII_xxxxxxxxxxxxxxxx",
  "source_plugin_name": "AI \u64cd\u4f5c\u5e94\u7528",
  "data": {
    "event_type": 8204,
    "tenant_id": "tenant_key",
    "project_key": "project_key",
    "project_name": "\u9879\u76ee\u540d\u79f0",
    "flow_type": 1,
    "idempotent_key": "xxxxxxxxxxxxxxxx",
    "work_item_type_key": "issue",
    "link_work_item_type_key": "",
    "user_info": {
      "user_key": "operator_user_key",
      "name_cn": "\u4e2d\u6587\u540d",
      "name_en": "\u82f1\u6587\u540d",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 123456789,
        "work_item_name": "\u5de5\u4f5c\u9879\u6807\u9898",
        "work_item_type_key": "issue"
      }
    ],
    "ai_entity": {
      "entity_id": "entity_id",
      "app_identity": {
        "app_key": "MII_xxxxxxxxxxxxxxxx",
        "point_key": "ai_operation_xxx"
      },
      "status": "running",
      "state_key": "IN_PROGRESS",
      "props": [
        {
          "prop_key": "prop_key1",
          "prop_type": [
            "field"
          ],
          "prop_value": {
            "field": [
              {
                "field_value": "field_value",
                "field_key": "priority",
                "field_type": "select",
                "field_name": "\u4f18\u5148\u7ea7"
              }
            ]
          }
        },
        {
          "prop_key": "prop_key2",
          "prop_type": [
            "role"
          ],
          "prop_value": {
            "role_info": {
              "role_xxx": [
                {
                  "user_key": "user_key",
                  "name": "\u7528\u6237\u540d\u79f0"
                }
              ]
            }
          }
        },
        {
          "prop_key": "prop_key3",
          "prop_type": null,
          "prop_value": {
            "custom_property": {
              "value": "\u81ea\u5b9a\u4e49\u8f93\u5165\u5185\u5bb9",
              "type": "text"
            }
          }
        }
      ]
    }
  }
}
```

<a id="d3dba38a"></a>

## 8205：关联实例终止

在运行期间被终止时推送，`data.reason` 为终止原因，可能为空。

```json
{
  "log_id": "20260628201908xxxxxxxxxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1782649149896,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "source": "normal",
  "source_plugin_id": "MII_xxxxxxxxxxxxxxxx",
  "source_plugin_name": "AI \u64cd\u4f5c\u5e94\u7528",
  "data": {
    "event_type": 8205,
    "tenant_id": "tenant_key",
    "project_key": "project_key",
    "project_name": "\u9879\u76ee\u540d\u79f0",
    "flow_type": 1,
    "idempotent_key": "xxxxxxxxxxxxxxxx",
    "work_item_type_key": "issue",
    "link_work_item_type_key": "",
    "reason": "\u53d6\u6d88\uff0c\u73b0\u5728\u5148\u4e0d\u505a\u4e86",
    "user_info": {
      "user_key": "operator_user_key",
      "name_cn": "\u4e2d\u6587\u540d",
      "name_en": "\u82f1\u6587\u540d",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 123456789,
        "work_item_name": "\u5de5\u4f5c\u9879\u6807\u9898",
        "work_item_type_key": "issue"
      }
    ],
    "ai_entity": {
      "entity_id": "entity_id",
      "app_identity": {
        "app_key": "MII_xxxxxxxxxxxxxxxx",
        "point_key": "ai_operation_xxx"
      },
      "status": "running",
      "state_key": "IN_PROGRESS",
      "props": [
        {
          "prop_key": "prop_key1",
          "prop_type": [
            "field"
          ],
          "prop_value": {
            "field": [
              {
                "field_value": "field_value",
                "field_key": "priority",
                "field_type": "select",
                "field_name": "\u4f18\u5148\u7ea7"
              }
            ]
          }
        },
        {
          "prop_key": "prop_key2",
          "prop_type": [
            "role"
          ],
          "prop_value": {
            "role_info": {
              "role_xxx": [
                {
                  "user_key": "user_key",
                  "name": "\u7528\u6237\u540d\u79f0"
                }
              ]
            }
          }
        },
        {
          "prop_key": "prop_key3",
          "prop_type": null,
          "prop_value": {
            "custom_property": {
              "value": "\u81ea\u5b9a\u4e49\u8f93\u5165\u5185\u5bb9",
              "type": "text"
            }
          }
        }
      ]
    }
  }
}
```

<a id="7977ee54"></a>

## 8206：关联实例恢复

关联的状态流工作项从终止状态恢复时推送，原文仍限定 AI 操作运行期间。恢复实例并不等于收到 AI 实体的启动事件，应继续按 `8201` 的启动条件判断。

```json
{
  "log_id": "20260628201908xxxxxxxxxxxx",
  "source_plugin_version": "0.0.1",
  "request_time": 1782649149896,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "source": "normal",
  "source_plugin_id": "MII_xxxxxxxxxxxxxxxx",
  "source_plugin_name": "AI \u64cd\u4f5c\u5e94\u7528",
  "data": {
    "event_type": 8206,
    "tenant_id": "tenant_key",
    "project_key": "project_key",
    "project_name": "\u9879\u76ee\u540d\u79f0",
    "flow_type": 1,
    "idempotent_key": "xxxxxxxxxxxxxxxx",
    "work_item_type_key": "issue",
    "link_work_item_type_key": "",
    "user_info": {
      "user_key": "operator_user_key",
      "name_cn": "\u4e2d\u6587\u540d",
      "name_en": "\u82f1\u6587\u540d",
      "email": "user@example.com"
    },
    "work_item_info": [
      {
        "work_item_id": 123456789,
        "work_item_name": "\u5de5\u4f5c\u9879\u6807\u9898",
        "work_item_type_key": "issue"
      }
    ],
    "ai_entity": {
      "entity_id": "entity_id",
      "app_identity": {
        "app_key": "MII_xxxxxxxxxxxxxxxx",
        "point_key": "ai_operation_xxx"
      },
      "status": "running",
      "state_key": "IN_PROGRESS",
      "props": [
        {
          "prop_key": "prop_key1",
          "prop_type": [
            "field"
          ],
          "prop_value": {
            "field": [
              {
                "field_value": "field_value",
                "field_key": "priority",
                "field_type": "select",
                "field_name": "\u4f18\u5148\u7ea7"
              }
            ]
          }
        },
        {
          "prop_key": "prop_key2",
          "prop_type": [
            "role"
          ],
          "prop_value": {
            "role_info": {
              "role_xxx": [
                {
                  "user_key": "user_key",
                  "name": "\u7528\u6237\u540d\u79f0"
                }
              ]
            }
          }
        },
        {
          "prop_key": "prop_key3",
          "prop_type": null,
          "prop_value": {
            "custom_property": {
              "value": "\u81ea\u5b9a\u4e49\u8f93\u5165\u5185\u5bb9",
              "type": "text"
            }
          }
        }
      ]
    }
  }
}
```

<a id="d33a2bbb"></a>

## 8207：状态流模板升级

`data.change_template` 包含升级前后的模板快照。以下是 data 内的差异片段，完整事件还包含公共字段与 `ai_entity`。

```json
{
  "change_template": {
    "before": {
      "id": 450782,
      "state_flow_key": "STATE_FLOW_xxx",
      "state_flow_version": 18,
      "is_latest_version": false,
      "workflow_key": "WORKFLOW_xxx",
      "workflow_version": 1,
      "linked_resource_info": null,
      "is_resource": false
    },
    "after": {
      "id": 450782,
      "state_flow_key": "STATE_FLOW_xxx",
      "state_flow_version": 19,
      "is_latest_version": true,
      "workflow_key": "WORKFLOW_xxx",
      "workflow_version": 2,
      "linked_resource_info": null,
      "is_resource": false
    }
  }
}
```

快照字段包括模板 `id`、状态流 `state_flow_key/state_flow_version`、`is_latest_version`、工作流 `workflow_key/workflow_version`、`linked_resource_info` 和 `is_resource`。本例状态流版本 `18 → 19`、工作流版本 `1 → 2`，模板 ID 不变；这仅描述示例，不推导所有升级的版本变化方式。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/bfxx3ljy
