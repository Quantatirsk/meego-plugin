# 获取工作流详情（WBS）

[Official source](https://project.feishu.cn/b/helpcenter/1p8d7djs/1t3boa28) | [Local index](../INDEX.md)

> 接入 Open API / 工作项 / 流程与节点 / 获取工作流详情（WBS）
>
> Published: 2026-08-27T10:38:15.312Z; captured: 2026-09-07T01:03:15.810Z

读取行业专版中一个节点流工作项的 WBS 视图，包括递归子项、排期、交付物、父项和可选的 WBS 链路信息。目标实例必须是 WBS 工作项或其子工作项，否则返回 `20089`。

## 理解 WBS 树与扩展数据

`related_sub_work_items` 是树的入口，按每个元素的 `type` 识别 `node`（节点）、`sub_workitem`（子工作项）和 `sub_task`（子任务）。`sub_work_item` 继续保存下一层，原定义仅在 `node` 或 `sub_workitem` 下有值；读取时不能假定所有节点都有 `work_item_id`。

| 数据                       | 用途与启用条件                                               |
| -------------------------- | ------------------------------------------------------------ |
| `schedule` / `schedules`   | 非差异化排期 / 按人员拆分的差异化排期                        |
| `deliverable`              | 字段形式的交付物                                             |
| `union_deliverable`        | 合并字段交付物与实例交付物，需 `need_union_deliverable=true` |
| `field_values`             | 计划表自定义列聚合字段，对应 `need_schedule_table_agg`       |
| `relation_chain_path`      | 模板层级信息，需 `need_wbs_relation_chain_path=true`         |
| `relation_chain_entity`    | 具体实例链路，需 `need_wbs_relation_chain_entity=true`       |
| `related_parent_work_item` | 关联父工作项及其模板信息                                     |

两套 `type` 枚举并不相同：WBS 树使用 `sub_workitem`、`sub_task`，链路实例使用 `subWorkItem`、`subTask`，解析时要按所在结构保留大小写。`relation_chain_path.level` 从 `1` 开始。

本接口是 GET。根级 Query 支持 `need_union_deliverable` 和 `need_schedule_table_agg`。`expand` 的 URL 编码方式及与根级同名开关的优先级待核实，本文不提供 GET 请求体示例。

`need_workflow` 只支持节点流，状态流返回空结构。共享结构中的 `Schedule.is_auto`、`update_mode` 是写接口语义，本查询不会修改排期或交付物。

WBS 能力见[WBS 流程配置](https://project.feishu.cn/1ykiuvvj/2t3b7cg7)。权限位于**权限管理 > 工作项实例**，见[权限管理](../guides/权限管理.md)。

<a id="请求说明"></a>

## 请求说明

**请求方式**：`GET`

**请求地址**：`/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/wbs_view`

<a id="请求参数"></a>

## 请求参数

<a id="header"></a>

### 请求头

接口调用的 Header 配置详见 [Header](../guides/OpenAPI概述.md#a8e43b86)。

<a id="Path"></a>

### 路径参数

| 参数                 | 类型     | 是否必须 | 说明                                                                            |
| -------------------- | -------- | -------- | ------------------------------------------------------------------------------- |
| `project_key`        | `string` | 必须     | 空间 ID（project_key），或者空间域名（simple_name）。 [详细说明](#field-note-1) |
| `work_item_type_key` | `string` | 必须     | 工作项类型，系统自动生成，可以从[获取空间下工作项类型](获取空间下工作项类型.md)接口获取。   |
| `work_item_id`       | `string` | 必须     | 工作项实例 ID，在工作项实例详情右上角展开 **···**，单击 ID 信息即可获取。       |

<a id="field-note-1"></a>

**project_key**

空间 ID（project_key），或者空间域名（simple_name）。

- 空间 ID（project_key），在飞书项目空间双击空间名称获取。
- 空间域名（simple_name），`simple_name` 一般在飞书项目空间 URL 中获取。例如空间 URL 为 “https://project.feishu.cn/doc/overview”，则 `simple_name`为 “doc”。

<a id="Query"></a>

### 查询参数

| 参数                      | 类型      | 是否必须 | 说明                                                                                      |
| ------------------------- | --------- | -------- | ----------------------------------------------------------------------------------------- |
| `expand`                  | `object`  | 可选     | 支持以下选项： [详细说明](#field-note-2)                                                  |
| `need_union_deliverable`  | `boolean` | 可选     | 是否融合需要交付物，与请求体参数中的 `need_union_deliverable`含义相同，在查询参数中冗余。 |
| `need_schedule_table_agg` | `boolean` | 可选     | 扩展查询，是否需要计划表自定义列聚合字段。                                                |

<a id="field-note-2"></a>

**expand**

支持以下选项：

- need_workflow：是否需要工作流信息（目前只支持节点流，状态流会返回空结构）
- need_multi_text：是否需要富文本详细信息
- relation_fields_detail：是否需要关联字段详细信息
- need_union_deliverable：是否融合需要交付物
- need_wbs_relation_chain_entity：是否需要 WBS 链路实例
- need_wbs_relation_chain_path:：是否需要 WBS 链路层级

<a id="返回参数"></a>

## 返回参数

| 参数       | 类型     | 说明                                                                 |
| ---------- | -------- | -------------------------------------------------------------------- |
| `data`     | `object` | 遵循[WbsViewResponse](../formats/数据结构汇总.md#eca9aa28)数据结构规范。 |
| `err`      | `object` | 请求成功时返回空值，请求失败时返回实际错误信息。                     |
| `err_msg`  | `string` | 请求成功时返回空值，请求失败时返回实际错误信息。                     |
| `err_code` | `int32`  | 请求成功时0，请求失败返回实际错误码。                                |

### `data`

| 参数                       | 类型           | 说明                                                                                                                                   |
| -------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `template_key`             | `string`       | 模板 key                                                                                                                               |
| `related_sub_work_items`   | `list<object>` | 子工作项数组，遵循[WBSWorkItem](../formats/数据结构汇总.md#ed0d98c3)结构规范。                                                             |
| `relation_chain_path`      | `object`       | WBS链路层级，参见[WBSRelationChainPath](../formats/数据结构汇总.md#5028cbab)结构规范，`need_wbs_relation_chain_path` 为 `true` 时返回。    |
| `relation_chain_entity`    | `object`       | WBS 链路实例，参见[WBSRelationChainEntity](../formats/数据结构汇总.md#9aca7e72)结构规范，`need_wbs_relation_chain_entity` 为 `true` 时返回 |
| `connections`              | `list<object>` | 节点间连接，参见[Connection](../formats/数据结构汇总.md#99f7187e)结构规范。                                                                |
| `related_parent_work_item` | `object`       | 关联父工作项                                                                                                                           |

### `data.related_sub_work_items`

| 参数                | 类型           | 说明                                                                                                                                     |
| ------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `node_uuid`         | `string`       | 子节点ID                                                                                                                                 |
| `work_item_id`      | `int64`        | 子工作项ID, [详细说明](#field-note-3)                                                                                                    |
| `type`              | `string`       | 子工作项的类型，用于标识子工作项的具体类别。支持的取值如下所示。 [详细说明](#field-note-4)                                               |
| `wbs_status`        | `string`       | 子工作项所属状态, 就是泳道图中的状态                                                                                                     |
| `sub_work_item`     | `list<object>` | 子工作项数组，当且仅当 `type` 为 `node` 或 `sub_workitem`时该字段有值，遵循[WBSWorkItem](../formats/数据结构汇总.md#ed0d98c3)结构规范。      |
| `name`              | `string`       | 子工作项名称                                                                                                                             |
| `deliverable`       | `list<object>` | 交付物，遵循结构体[FieldValuePair](../formats/数据结构汇总.md#10c42182)格式与规范                                                            |
| `wbs_status_map`    | `map`          | WBS 状态映射 &lt;status_key,status_name&gt;                                                                                              |
| `schedule`          | `object`       | 非差异化排期，遵循[Schedule](../formats/数据结构汇总.md#8b67e4ee)结构规范。                                                                  |
| `schedules`         | `list<object>` | 差异化排期，遵循[Schedule](../formats/数据结构汇总.md#8b67e4ee)结构规范。                                                                    |
| `points`            | `double`       | 估分                                                                                                                                     |
| `role_owners`       | `list<object>` | 角色信息，遵循[RoleOwner](../formats/数据结构汇总.md#3209a8ce)结构规范                                                                       |
| `union_deliverable` | `object`       | 工作项下全部字段+实例交付物，参见[UnionDeliverable](../formats/数据结构汇总.md#9ac9b34a)。参数 `need_union_deliverable` 需要 `true` 时返回。 |
| `start_time`        | `int64`        | 实际开始时间                                                                                                                             |
| `finish_time`       | `int64`        | 实际结束时间                                                                                                                             |
| `state_key`         | `string`       | 节点 StateKey                                                                                                                            |
| `field_values`      | `list<object>` | 计划表自定义列聚合字段，参见数据结构[FieldValuePair](../formats/数据结构汇总.md#10c42182)。                                                  |

<a id="field-note-3"></a>

**work_item_id**

子工作项ID,

不是子工作项 - 该字段不返回

<a id="field-note-4"></a>

**type**

子工作项的类型，用于标识子工作项的具体类别。支持的取值如下所示。

- `node`：节点；
- `sub_workitem`：子工作项；
- `sub_task`：子任务。

### `data.related_sub_work_items.deliverable`

| 参数                   | 类型     | 说明                                                                                                                             |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `field_key`            | `string` | 待更新的子字段 ID                                                                                                                |
| `field_alias`          | `string` | 待更新字段的别名                                                                                                                 |
| `field_value`          | `object` | 字段值，可参考[字段与属性解析格式](../formats/字段与属性解析格式.md)                                                                       |
| `target_state`         | `object` | 指代流转至该目标状态需要填写对应字段，状态流使用                                                                                 |
| `field_type_key`       | `string` | 字段类型                                                                                                                         |
| `field_name`           | `string` | 字段名称                                                                                                                         |
| `field_value_markdown` | `object` | 富文本内容 Markdown 格式，遵循 [Markdown 格式说明](../formats/Markdown%20格式说明.md)结构规范，和`field_value` 二选一，仅富文本格式字段生效 |

### `data.related_sub_work_items.deliverable.target_state`

| 参数            | 类型     | 说明                      |
| --------------- | -------- | ------------------------- |
| `state_key`     | `string` | 状态 key                  |
| `transition_id` | `int64`  | 状态流转 ID，仅状态流返回 |

### `data.related_sub_work_items.deliverable.field_value_markdown`

| 参数                | 类型           | 说明                      |
| ------------------- | -------------- | ------------------------- |
| `markdown`          | `string`       | 富文本内容 Markdown 格式  |
| `mention_user_keys` | `list<object>` | 富文本中 @ 提到的人员信息 |

### `data.related_sub_work_items.deliverable.field_value_markdown.mention_user_keys`

| 参数       | 类型     | 说明                  |
| ---------- | -------- | --------------------- |
| `id`       | `string` | 富文本中对应的人员 id |
| `user_key` | `string` | 对应的人员的 user_key |

### `data.related_sub_work_items.schedule`

| 参数                  | 类型           | 说明                                                                                           |
| --------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `owners`              | `list<string>` | 负责人 user_key 数组，作为请求参数且动态汇总排期时必填，其余接口填了不识别。子任务不支持此参数 |
| `estimate_start_date` | `int64`        | 排期开始时间戳，精度毫秒                                                                       |
| `estimate_end_date`   | `int64`        | 排期结束时间戳，精度毫秒                                                                       |
| `points`              | `double`       | 估分                                                                                           |
| `is_auto`             | `boolean`      | 排期与估分更新模式，不传表示为 true [详细说明](#field-note-5)                                  |
| `actual_work_time`    | `double`       | 实际工时，精确到小数点后一位。该节点有填写实际工时才会返回，子任务不支持此参数                 |

<a id="field-note-5"></a>

**is_auto**

排期与估分更新模式，不传表示为 true

true：

- 若只填写了排期，则自动将估分补充为排期之间的差值
- 若只填写了估分，则会将排期清空
- 若排期、估分均填写，会按所填值落库
- 若排期、估分均未填写，则会将估分置为0、排期清空

false：

- 若只填写了排期，不会将估分补充为排期之间的差值
- 若只填写了估分，不会将排期清空
- 若排期、估分均填写，会按所填值落库
- 若排期、估分均未填写，则视为不做改动，而非清空

### `data.related_sub_work_items.schedules`

| 参数                  | 类型           | 说明                                                                                           |
| --------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `owners`              | `list<string>` | 负责人 user_key 数组，作为请求参数且动态汇总排期时必填，其余接口填了不识别。子任务不支持此参数 |
| `estimate_start_date` | `int64`        | 排期开始时间戳，精度毫秒                                                                       |
| `estimate_end_date`   | `int64`        | 排期结束时间戳，精度毫秒                                                                       |
| `points`              | `double`       | 估分                                                                                           |
| `is_auto`             | `boolean`      | 排期与估分更新模式，不传表示为 true [详细说明](#field-note-6)                                  |
| `actual_work_time`    | `double`       | 实际工时，精确到小数点后一位。该节点有填写实际工时才会返回，子任务不支持此参数                 |

<a id="field-note-6"></a>

**is_auto**

排期与估分更新模式，不传表示为 true

true：

- 若只填写了排期，则自动将估分补充为排期之间的差值
- 若只填写了估分，则会将排期清空
- 若排期、估分均填写，会按所填值落库
- 若排期、估分均未填写，则会将估分置为0、排期清空

false：

- 若只填写了排期，不会将估分补充为排期之间的差值
- 若只填写了估分，不会将排期清空
- 若排期、估分均填写，会按所填值落库
- 若排期、估分均未填写，则视为不做改动，而非清空

### `data.related_sub_work_items.role_owners`

| 参数     | 类型           | 说明                       |
| -------- | -------------- | -------------------------- |
| `name`   | `string`       | 名称，作为请求参数非必填。 |
| `role`   | `string`       | 角色 ID                    |
| `owners` | `list<string>` | 负责人 user_key 数组       |

### `data.related_sub_work_items.union_deliverable`

| 参数                    | 类型           | 说明                                                                               |
| ----------------------- | -------------- | ---------------------------------------------------------------------------------- |
| `field_deliverables`    | `list<object>` | 字段交付物，参见[FieldDeliverableItem](../formats/数据结构汇总.md#77f236d1)数据结构    |
| `instance_deliverables` | `list<object>` | 实例交付物，参见[InstanceDeliverableItem](../formats/数据结构汇总.md#bd9557f3)数据结构 |

### `data.related_sub_work_items.union_deliverable.field_deliverables`

| 参数          | 类型     | 说明                                                                            |
| ------------- | -------- | ------------------------------------------------------------------------------- |
| `field_info`  | `object` | 字段信息，遵循结构体[FieldValuePair](../formats/数据结构汇总.md#10c42182)格式与规范 |
| `placeholder` | `string` | 占位文本                                                                        |
| `remark`      | `string` | 备注                                                                            |
| `status`      | `int64`  | 1: 未提交，2: 已提交                                                            |

### `data.related_sub_work_items.union_deliverable.field_deliverables.field_info`

| 参数                   | 类型     | 说明                                                                                                                             |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `field_key`            | `string` | 待更新的子字段 ID                                                                                                                |
| `field_alias`          | `string` | 待更新子字段的别名                                                                                                               |
| `field_value`          | `object` | 字段值，可参考[字段与属性解析格式](../formats/字段与属性解析格式.md)                                                                       |
| `update_mode`          | `int32`  | 字段的更新模式，用于控制字段值的更新方式。支持的取值如下所示。 [详细说明](#field-note-7)                                         |
| `field_type_key`       | `string` | 字段类型                                                                                                                         |
| `field_name`           | `string` | 字段名称                                                                                                                         |
| `field_value_markdown` | `object` | 富文本内容 Markdown 格式，遵循 [Markdown 格式说明](../formats/Markdown%20格式说明.md)结构规范，和`field_value` 二选一，仅富文本格式字段生效 |

<a id="field-note-7"></a>

**update_mode**

字段的更新模式，用于控制字段值的更新方式。支持的取值如下所示。

- `0`：替换模式，提交的字段值将完全替换原有值；
- `1`：更新模式，仅更新提交的字段值，不影响其他字段。

默认值：`0`（替换模式）

### `data.related_sub_work_items.union_deliverable.field_deliverables.field_info.field_value_markdown`

| 参数                | 类型           | 说明                      |
| ------------------- | -------------- | ------------------------- |
| `markdown`          | `string`       | 富文本内容 Markdown 格式  |
| `mention_user_keys` | `list<object>` | 富文本中 @ 提到的人员信息 |

### `data.related_sub_work_items.union_deliverable.field_deliverables.field_info.field_value_markdown.mention_user_keys`

| 参数       | 类型     | 说明                  |
| ---------- | -------- | --------------------- |
| `id`       | `string` | 富文本中对应的人员 id |
| `user_key` | `string` | 对应的人员的 user_key |

### `data.related_sub_work_items.union_deliverable.instance_deliverables`

| 参数            | 类型           | 说明                  |
| --------------- | -------------- | --------------------- |
| `name`          | `string`       | 交付物工作项名称      |
| `work_item_id`  | `int64`        | 交付物工作项ID        |
| `deletable`     | `boolean`      | 是否可删除            |
| `must_complete` | `boolean`      | 是否完成拦截          |
| `state_key`     | `string`       | 状态key               |
| `state_name`    | `string`       | 状态名                |
| `owners`        | `list<string>` | 负责人, user_key list |
| `remark`        | `string`       | 备注                  |

### `data.related_sub_work_items.field_values`

| 参数                   | 类型     | 说明                                                                                                                             |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `field_key`            | `string` | 待更新的子字段 ID                                                                                                                |
| `field_alias`          | `string` | 待更新子字段的别名                                                                                                               |
| `field_value`          | `object` | 字段值，可参考[字段与属性解析格式](../formats/字段与属性解析格式.md)                                                                       |
| `update_mode`          | `int32`  | 本接口不涉及                                                                                                                     |
| `target_state`         | `object` | 指代流转至该目标状态需要填写对应字段，状态流使用                                                                                 |
| `field_type_key`       | `string` | 字段类型                                                                                                                         |
| `field_name`           | `string` | 字段名称                                                                                                                         |
| `field_value_markdown` | `object` | 富文本内容 Markdown 格式，遵循 [Markdown 格式说明](../formats/Markdown%20格式说明.md)结构规范，和`field_value` 二选一，仅富文本格式字段生效 |

### `data.related_sub_work_items.field_values.target_state`

| 参数            | 类型     | 说明                      |
| --------------- | -------- | ------------------------- |
| `state_key`     | `string` | 状态 key                  |
| `transition_id` | `int64`  | 状态流转 ID，仅状态流返回 |

### `data.related_sub_work_items.field_values.field_value_markdown`

| 参数                | 类型           | 说明                      |
| ------------------- | -------------- | ------------------------- |
| `markdown`          | `string`       | 富文本内容 Markdown 格式  |
| `mention_user_keys` | `list<object>` | 富文本中 @ 提到的人员信息 |

### `data.related_sub_work_items.field_values.field_value_markdown.mention_user_keys`

| 参数       | 类型     | 说明                  |
| ---------- | -------- | --------------------- |
| `id`       | `string` | 富文本中对应的人员 id |
| `user_key` | `string` | 对应的人员的 user_key |

### `data.relation_chain_path`

| 参数                      | 类型           | 说明                                                                                       |
| ------------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `wbs_relation_chain_path` | `list<object>` | WBS链路层级数组，参见[WBSRelationChainPathItem](../formats/数据结构汇总.md#dc1d30cc)结构规范。 |
| `work_item_id`            | `int64`        | 工作项 ID                                                                                  |

### `data.relation_chain_path.wbs_relation_chain_path`

| 参数                 | 类型     | 说明                                                                           |
| -------------------- | -------- | ------------------------------------------------------------------------------ |
| `project_key`        | `string` | 空间 key                                                                       |
| `name`               | `string` | 表示 WBS 链路层级中节点的模板名称，当节点类型为 `rootWorkItem`时会返回该字段。 |
| `level`              | `int32`  | 节点所属层级，下标从1开始                                                      |
| `node_name`          | `string` | 表示 WBS 链路层级中节点的名称，当节点类型为 `subWorkItem`时返回该字段。        |
| `type`               | `string` | 表示 WBS 链路层级中节点的类型。支持的取值如下所示。 [详细说明](#field-note-8)  |
| `work_item_type_key` | `string` | 工作项类型                                                                     |

<a id="field-note-8"></a>

**type**

表示 WBS 链路层级中节点的类型。支持的取值如下所示。

- `rootWorkItem`：根工作项；
- `subWorkItem`：非根节点工作项

### `data.relation_chain_entity`

| 参数                        | 类型           | 说明                                                                                       |
| --------------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `wbs_relation_chain_entity` | `list<object>` | WBS链路实例数组，参见[WBSRelationChainEntityItem](../formats/数据结构汇总.md#fd7d77ef)结构规范 |
| `work_item_id`              | `int64`        | 表示 WBS 链路实例中关联的工作项 ID。                                                       |

### `data.relation_chain_entity.wbs_relation_chain_entity`

| 参数                 | 类型     | 说明                                                                          |
| -------------------- | -------- | ----------------------------------------------------------------------------- |
| `project_key`        | `string` | 空间key                                                                       |
| `type`               | `string` | 表示 WBS 链路实例中节点的类型。支持的取值如下所示。 [详细说明](#field-note-9) |
| `state_key`          | `string` | 当节点类型为 `node`时返回该字段。                                             |
| `node_name`          | `string` | 当节点类型为 `node`时返回该字段。                                             |
| `sub_task_name`      | `string` | 当节点类型为 `subTask`时返回该字段。                                          |
| `sub_task_id`        | `int64`  | 当节点类型为 `subTask`时返回该字段。                                          |
| `level`              | `int32`  | 工作项所属层级                                                                |
| `work_item_id`       | `int64`  | 工作项id                                                                      |
| `work_item_name`     | `string` | 工作项名称                                                                    |
| `work_item_type_key` | `string` | 工作项类型                                                                    |

<a id="field-note-9"></a>

**type**

表示 WBS 链路实例中节点的类型。支持的取值如下所示。

- `rootWorkItem`：根工作项；
- `subWorkItem`：子流程工作项；
- `node`：节点；
- `subTask`：子任务。

### `data.connections`

| 参数               | 类型     | 说明                            |
| ------------------ | -------- | ------------------------------- |
| `transition_id`    | `int64`  | 状态流转 ID，仅状态流工作项返回 |
| `source_state_key` | `string` | 开始节点 ID                     |
| `target_state_key` | `string` | 目标节点标识                    |

### `data.related_parent_work_item`

| 参数                 | 类型      | 说明                                                     |
| -------------------- | --------- | -------------------------------------------------------- |
| `name`               | `string`  | 关联父工作项的名称                                       |
| `is_top`             | `boolean` | 关联的父工作项是否为顶级工作项                           |
| `template_id`        | `string`  | 关联父工作项所使用的模板 ID                              |
| `template_key`       | `string`  | 关联父工作项所使用的模板 key，用于标识父工作项对应的模板 |
| `work_item_id`       | `int64`   | 关联父工作项的 ID                                        |
| `template_name`      | `string`  | 关联父工作项所使用的模板名称                             |
| `template_version`   | `int64`   | 关联父工作项所使用的模板版本号                           |
| `work_item_type_key` | `string`  | 关联父工作项的类型                                       |

### `err`

| 参数     | 类型     | 说明                                                                                 |
| -------- | -------- | ------------------------------------------------------------------------------------ |
| `code`   | `int32`  | 部分场景下，透出更详细错误对应的错误码。                                             |
| `msg`    | `string` | 部分场景下，透出更详细的错误描述。                                                   |
| `log_id` | `string` | 报错场景下的调用链标识符，用于追踪错误发生时的完整调用链路，便于日志记录和问题排查。 |

<a id="请求示例"></a>

## 请求示例

### 查看节点流工作项详情

查询节点流工作项详情，并查看 `need_union_deliverable` 和 `need_schedule_table_agg`。

```http
GET /open_api/66c2fb3e0ab52f52c92*****/work_item/story/5566778/wbs_view?need_union_deliverable=true&need_schedule_table_agg=true
```

<a id="返回示例"></a>

## 返回示例

### 查看节点流工作项详情

```json
{
  "err_code": 0,
  "data": {
    "template_key": "123123123",
    "related_sub_work_items": [
      {
        "node_uuid": "1",
        "type": "node",
        "name": "\u5f00\u59cb",
        "wbs_status_map": {
          "status_key": "not_started",
          "status_name": "\u672a\u5f00\u59cb"
        },
        "sub_work_item": [
          {
            "deliverable": [
              {
                "field_key": "field_b46006",
                "field_value": [
                  [
                    {
                      "field_key": "field_cf394a",
                      "field_value": "2323"
                    },
                    {
                      "field_key": "field_db2cd2",
                      "field_value": "4545"
                    },
                    {
                      "field_key": "field_ec3f89",
                      "field_value": "rd"
                    }
                  ]
                ]
              }
            ],
            "name": "\u4efb\u52a11",
            "node_uuid": "3",
            "type": "sub_task",
            "role_owners": [
              {
                "role": "DA",
                "name": "DA",
                "owners": [
                  "70439708518xxxxxx06",
                  "70970434698xxxxxx04"
                ]
              },
              {
                "role": "PM",
                "name": "PM"
              }
            ],
            "wbs_status_map": {
              "status_key": "not_started",
              "status_name": "\u672a\u5f00\u59cb"
            },
            "sub_work_item": []
          }
        ],
        "union_deliverable": {
          "field_deliverables": [
            {
              "field_info": {
                "field_key": "name",
                "field_value": "\u540d\u79f0",
                "field_type_key": "name"
              },
              "placeholder": "\u5360\u4f4d\u7b26",
              "remark": "\u6807\u8bb0",
              "status": 1
            }
          ],
          "instance_deliverables": [
            {
              "name": "\u4ea4\u4ed8\u7269\u5de5\u4f5c\u9879\u540d\u79f0",
              "work_item_id": 112333,
              "associated_deliverables_template": 1123111,
              "template_resources": false,
              "deletable": true,
              "must_complete": false,
              "state_key": "started",
              "state_name": "\u5f00\u59cb",
              "owners": [
                "username"
              ],
              "remark": "\u6807\u8bb0"
            }
          ]
        }
      }
    ],
    "related_parent_work_item": {
      "is_top": false,
      "work_item_id": 123456,
      "name": "test",
      "template_key": "637deb0exxxxxxxxxxxxxxx:story:template_123456789",
      "template_version": 1,
      "work_item_type_key": "story",
      "template_id": "1234",
      "template_name": "\u5b50\u6d41\u7a0b"
    },
    "connections": [
      {
        "source_state_key": "state_0",
        "target_state_key": "state_1"
      }
    ]
  },
  "err_msg": ""
}
```

<a id="错误码"></a>

## 错误码

以下列出了该接口相关的错误码信息，若需查看更多通用错误码说明，参见 [Open API 错误码](../formats/Open%20API%20错误码.md)。

| err_code | err_msg                                     | err.code | err.msg                                     | 说明                                             |
| -------- | ------------------------------------------- | -------- | ------------------------------------------- | ------------------------------------------------ |
| 30005    | WorkItem Not Found                          | 30005    | WorkItem Not Found                          | 工作项未找到，即 `work_item_id` 不正确。         |
| 20089    | Current WorkItem Is Not Wbs Or Wbs Children | 20089    | Current WorkItem Is Not Wbs Or Wbs Children | 当前工作项不是 WBS 工作项或者不是 WBS 子工作项。 |
| 20014    | Project And WorkItem Not Match              | 20014    | Project And WorkItem Not Match              | 空间和工作项不匹配。                             |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/1t3boa28
