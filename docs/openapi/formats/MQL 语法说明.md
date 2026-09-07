# MQL 语法说明

<!-- capability-metadata:start -->
## 平台能力标记

> 调用频次：无直接调用频次。本页用于平台说明、格式、目录或支持信息。

<!-- capability-metadata:end -->

MQL（Meego Query Language）是飞书项目的结构化查询语言，采用 SQL 风格语法，并扩展数组、人员、节点、状态和关系查询能力。`search_by_mql` 接收完整查询字符串。

## 使用前确认

**提交约束**：必须包含 `SELECT` 与 `FROM`，不支持 `SELECT *`；WHERE 片段和函数片段仅用于说明语法，不能单独提交。FROM 同时指定空间和工作项类型，字段与表标识用反引号包裹。

本篇 SQL 示例含显式 `${...}` 文档占位符，须按[示例名称与协议值映射](#示例名称与协议值映射)替换后再提交。`${...}` 不是 MQL 变量语法；映射中的固定中文协议值须原样使用。

**阅读导航**：[基础语法](#a72448b8) · [数据类型](#78f18cc3) · [关系查询](#bc26fc11) · [消歧](#ce04d555) · [完整示例](#c5df6cee)

飞书项目 MCP Server 的 `search_by_mql` 工具可接收 MQL 查询，并可用于将自然语言查询转换为结构化查询。

<a id="490c44d5"></a>

## 语法说明

`search_by_mql.mql` 必须是完整 SQL 查询。JSON 对象、单独条件或只有 WHERE 的片段都不接受。以下基础语法中的方括号仅标记可选子句，不是实际查询字符。

<a id="a72448b8"></a>

### 基础语法

MQL 基础使用语法如下：

- 指定查询的字段列表
- 指定数据来源，FROM 必须包含空间和工作项类型
- 查询条件（可选）
- 排序（可选）
- 分页（可选）

```sql
SELECT fieldList
FROM `project_key`.`${WORK_ITEM_TYPE}`
WHERE conditionExpression
[ORDER BY fieldOrderByList [{ASC|DESC}]]
[LIMIT [offset,] row_count]
```

**标识符规则**：

- 不支持 `SELECT *`，必须显式指定字段

- 所有字段名和表名必须使用反引号包裹，如 `` `工作项ID` ``、`` `leopard`.`需求` ``；带 target 修饰符时必须包裹整个字段：`` `name<target:all>` ``

- SELECT/FROM/WHERE/ORDER BY 中既可使用 key 也可使用名称。**优先使用 key**：系统字段 key 为单词（如 `priority`、`status`），自定义字段 key 为 `field_x23bd` 格式，工作项类型 key 如 `story`、`issue`。名称是用户自定义内容（语言不定），仅作为找不到 key 时的兜底

- 字符串用单引号：`'value'`

- 数组用 JSON 格式：`'["a","b"]'`

- 枚举值优先用 label（如 '通过'），不要用 id

<a id="78f18cc3"></a>

## 数据类型

| **数据类型** | **说明** | **对应的工作项字段类型** |
| --- | --- | --- |
| `bool` | 表示真假，取值可以是TRUE、FALSE、1、0 四种。 | bool |
| `bigint` | 整数类型。 | number 类型下的 work_item_id 和 auto_number |
| `double` | 浮点数类型。 | 除 work_item_id/auto_number 外的其他 number |
| `varchar` | 字符串类型 | text、multi-pure-text、multi-text、select、tree-select、radio、user、link、signal、workitem_related_select |
| `date` | 日期类型。日期格式支持`YYYY-MM-DD`或带时区格式`YYYY-MM-DD+TZD`，例如`2025-12-24` 或 `2025-12-24+08:00` 。 | date |
| `datetime` | 日期时间类型。时间日期格式支持ISO8601格式`YYYY-MM-DDThh:mm:ss`或带时区格式`YYYY-MM-DDThh:mm:ssTZD`，比如`2025-12-24T10:48:30`或`2025-12-24T10:48:30+08:00` | schedule、precise_date |
| array(varchar) | 字符串数组 | multi-select、tree-multi-select、multi-user、link_cloud_doc、workitem_related_multi_select、multi-file |
| array(struct) | 结构体数组 | compound_field |
| lambda expression | 返回 `bool` 的函数表达式，写法类似 Presto，见下列示例 | - |

```sql
x -> x > 10
x -> x > 10 and x < 100
x -> x in ('a', 'b')
```

<a id="64161f76"></a>

### 查询条件运算符

| 运算符 | 说明 | 示例 |
| --- | --- | --- |
| = / != | 等于 / 不等于 | [相等与不相等](#table-content-1) |
| \> / \< | 大于 / 小于 | [严格大小比较](#table-content-2) |
| \>= / \<= | 大于等于 / 小于等于 | [包含边界的比较](#table-content-3) |
| IS NULL / IS NOT NULL | 空值判断 | [空值判断](#table-content-4) |
| `AND` | 逻辑与 | [AND 组合](#table-content-5) |
| `OR` | 逻辑或 | [OR 组合](#table-content-6) |
| () | 括号优先级 | [括号优先级](#table-content-7) |
| BETWEEN ... AND ... | 时间区间查询，仅适用于 date 字段类型和 precise_date 字段类型 | [日期区间](#table-content-8) |
| `IN` | 集合查询，适用于 varchar 数据类型 | [字符串集合](#table-content-9) |
| LIKE / NOT LIKE | 模糊匹配，`%` 匹配任意字符 | [模糊匹配](#table-content-10) |

<a id="table-content-1"></a>

### 相等与不相等

- 优先级等于"P0"
- 状态不等于"已关闭"

```sql
WHERE `${PRIORITY}` = 'P0'

WHERE `${STATUS}` != '${CLOSED_LABEL}'
```

<a id="table-content-2"></a>

### 严格大小比较

- 开发周期大于 10
- 开发周期小于 10

```sql
WHERE `${DEVELOPMENT_PERIOD}` > 10

WHERE `${DEVELOPMENT_PERIOD}` < 10
```

<a id="table-content-3"></a>

### 包含边界的比较

- 开发周期大于等于 10
- 开发周期小于等于 10

```sql
WHERE `${DEVELOPMENT_PERIOD}` >= 10

WHERE `${DEVELOPMENT_PERIOD}` <= 10
```

<a id="table-content-4"></a>

### 空值判断

- 邮箱为空
- 邮箱不为空

```sql
WHERE `${EMAIL}` IS NULL

WHERE `${EMAIL}` IS NOT NULL
```

<a id="table-content-5"></a>

### AND 组合

- 优先级等于"P0"且处理时间大于 3

```sql
WHERE `${PRIORITY}` = 'P0' AND `${HANDLING_TIME}` > 3
```

<a id="table-content-6"></a>

### OR 组合

- 优先级不等于"P0"或处理时间小于等于 3

```sql
WHERE `${PRIORITY}` != 'P0' OR `${HANDLING_TIME}` <= 3
```

<a id="table-content-7"></a>

### 括号优先级

```sql
WHERE (`${PRIORITY}` = 'P1' AND `${HANDLING_TIME}` > 5) OR `${PRIORITY}` = 'P0'
```

<a id="table-content-8"></a>

### 日期区间

- 查询开始时间介于 2026 年 1 月 1 日至 1 月 31 日之间

```sql
WHERE `${START_TIME}` BETWEEN '2026-01-01' AND '2026-01-31'
```

<a id="table-content-9"></a>

### 字符串集合

- 查询名称为 "测试1" 或 "测试2" 或 "测试3"

```sql
WHERE `${NAME}` IN ('${TEST_ONE}', '${TEST_TWO}', '${TEST_THREE}')
```

<a id="table-content-10"></a>

### 模糊匹配

- 缺陷名包含"性能问题"
- 缺陷名不包含"后端性能问题"

```sql
WHERE `${ISSUE_NAME}` LIKE '%${PERFORMANCE}%'

WHERE `${ISSUE_NAME}` NOT LIKE '%${BACKEND_PERFORMANCE}%'
```

<a id="3cf85df1"></a>

## 常用函数

<a id="b27bd5db"></a>

### 数组函数

数组列参数记为 `array_col`；`predicate` 是返回 `bool` 的 lambda 表达式。返回布尔值的函数中，`TRUE` 与 `1`、`FALSE` 与 `0` 分别等价。

| 函数签名 | 参数补充 | 返回类型 | 含义 |
| --- | --- | --- | --- |
| `all_match(array_col, predicate)` | 按表达式逐个判断元素 | `bool` | 全部元素满足为真，否则为假 |
| `any_match(array_col, predicate)` | 按表达式逐个判断元素 | `bool` | 至少一个元素满足为真；全部不满足为假 |
| `none_match(array_col, predicate)` | 按表达式逐个判断元素 | `bool` | 全部元素不满足为真；至少一个满足为假 |
| `array_cardinality(array_col)` | 只需数组列 | `bigint` | 数组元素数量 |
| `array_contains(array_col, element)` | `element` 是目标元素 | `bool` | 数组包含该元素为真，否则为假 |
| `array_intersect(array_col, array)` | 第二个参数为用于比较的数组 | `bool` | 判断两数组是否有交集 |
| `array_filter(array_col, predicate)` | 按表达式逐个筛选元素 | `array` | 返回满足条件的元素组成的新数组 |

以下依次保留原文的全部判断例子：每个元素大于 10、每个元素介于 10 与 100；存在用户 A、存在介于 10 与 100 的元素；所有元素均不是用户 A、所有元素均不在 10 与 100 之间。

```sql
all_match(ary_col, x -> x > 10)
all_match(ary_col, x -> x > 10 and x < 100)
any_match(ary_col, x -> x = '${USER_A}')
any_match(ary_col, x -> x > 10 and x < 100)
none_match(ary_col, x -> x = '${USER_A}')
none_match(ary_col, x -> x > 10 and x < 100)
```

下列例子依次返回负责人数量、判断标签是否包含标签 A、判断标签是否与标签 A/B 有交集、过滤出大于 100 的元素。

```sql
array_cardinality(`${OWNER_FIELD}`)
array_contains(`${TAGS_FIELD}`, '${TAG_A}')
array_intersect(`${TAGS_FIELD}`, '["${TAG_A}","${TAG_B}"]')
array_filter(ary_col, x -> x > 100)
```

<a id="585697e4"></a>

### 时间函数

这些函数均返回 `bool`，第一个参数为 date 或 datetime 列，第二个参数为相对时间，第三个可选参数为偏移天数字符串。

| 函数签名 | TRUE 的含义 | FALSE 的含义 |
| --- | --- | --- |
| `RELATIVE_DATETIME_EQ(col_name, date_para[, days])` | 等于对应日期或范围 | 不等于 |
| `RELATIVE_DATETIME_GT(col_name, date_para[, days])` | 大于对应日期或范围 | 不大于 |
| `RELATIVE_DATETIME_GE(col_name, date_para[, days])` | 大于等于对应日期或范围 | 小于 |
| `RELATIVE_DATETIME_LT(col_name, date_para[, days])` | 小于对应日期或范围 | 不小于 |
| `RELATIVE_DATETIME_LE(col_name, date_para[, days])` | 小于等于对应日期或范围 | 大于 |
| `RELATIVE_DATETIME_BETWEEN(col_name, date_para[, days])` | 属于对应日期范围 | 不属于 |

`date_para` 与 `days` 都是字符串。`days` 仅在 `today`、`future`、`past` 三种模式下有意义，例如 `'3d'`、`'-3d'`。所有相对时间都以函数执行时刻为基准。

| `date_para` | 含义 |
| --- | --- |
| `today` | 当天，可偏移指定天数 |
| `tomorrow` | 明天 |
| `yesterday` | 昨天 |
| `current_week` | 本周日期范围 |
| `next_week` | 下周日期范围 |
| `last_week` | 上周日期范围 |
| `current_month` | 本月日期范围 |
| `next_month` | 下月日期范围 |
| `last_month` | 上月日期范围 |
| `future` | 未来日期范围，可指定天数 |
| `past` | 过去日期范围，可指定天数 |

下列调用依次对应今天、今天后 3 天、今天前 3 天、明天、本周、下月、未来 3 天、过去 3 天。

```sql
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'today')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'today', '3d')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'today', '-3d')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'tomorrow')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'current_week')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'next_month')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'future', '3d')
RELATIVE_DATETIME_EQ(`${CREATED_TIME}`, 'past', '3d')
```

<a id="c062cac9"></a>

### 人员与角色函数

| **函数作用** | **函数签名** | **入参说明** | **返回值说明** | **使用示例** |
| --- | --- | --- | --- | --- |
| 表示当前登录用户 | current_login_user() | 无 | 返回 varchar 类型，表示当前登录用户的 userkey。 | `current_login_user()`：如果当前登录用户是用户 A，则返回用户 A 的 userkey； |
| 表示名字为team_name的团队 | team(include_manager, team_name) | [入参说明](#parameter-note-1) | 返回 array(varchar) 类型，表示对应团队包含的成员的 userkey。 | `team(true, '后端开发团队')`：返回后端开发团队的所有人的 userkey，且包括管理者。 |
| 表示所有参与角色 | participate_roles() | 无 | 返回 array(varchar)，表示所有参与角色的 rolekey。 | `participate_roles()`：返回所有参与角色的 rolekey。如果当前有 RD、QA、PM 等三种参与角色，则返回 RD、QA、PM 对应的rolekey。 |
| 表示所有参与人员 | all_participate_persons() | 无 | 返回 array(varchar)，表示所有参与人的 userkey。 | `all_participate_persons()`：返回所有参与人的 userkey。如果当前有用户 A、用户 B 等2个参与人，则返回用户 A、用户 B 对应的 userkey。 |
| 当前工作项参与人 | participate_persons() | 无 | 返回 array(varchar)，表示当前工作项的参与人 userkey。 | [节点参与人上下文](#table-content-11) |

<a id="parameter-note-1"></a>

**表示名字为team_name的团队：入参说明**

- `include_manager`：bool 类型，表示是否包含该团队的管理者。`true` 为包含，`false`为不包含。
- `team_name`：varchar 类型，表示团队的名称

<a id="table-content-11"></a>

#### 节点参与人上下文

`participate_persons()`：返回当前工作项的参与人 userkey 数组

该函数不能单独使用，必须搭配get_node_attribute

- 开始节点负责人

```sql
get_node_attribute('${START_NODE}',participate_persons())
```

<a id="7aa35ba4"></a>

### 节点函数

| **函数作用** | **函数签名** | **入参说明** | **返回值说明** | **使用示例** |
| --- | --- | --- | --- | --- |
| 返回所有流程节点名称数组 | all_nodes_name() | 无 | 返回 array(varchar) 类型。 | [全部节点名称](#table-content-12) |
| 返回当前进行中的节点名称数组 | in_progress_nodes_name() | 无 | 返回 array(varchar) 类型。 | [当前节点名称](#table-content-13) |
| 返回节点延期状态标识数组 | risk_label() | 无 | 返回 array(varchar) 类型。 | [延期与到期标记](#table-content-14) |
| 获取指定节点的属性值 | get_node_attribute(node, attribute) | [入参说明](#parameter-note-2) | - | [节点属性查询](#table-content-15) |

<a id="parameter-note-2"></a>

**获取指定节点的属性值：入参说明**

- `node`：可为节点名、`__ALL`（全部节点）、`__BELONGING`（所属节点，即当前工作项所在的节点）
- `attribute`：可用属性包括排期、估分、节点时间、节点完成结论、节点完成意见、负责人、当前负责人、状态
- 排期子字段：`get_node_attribute('节点名','__排期_开始时间')`、`get_node_attribute('节点名','__排期_结束时间')`
- 节点时间子字段：`get_node_attribute('节点名','__节点时间_开始时间')`、`get_node_attribute('节点名','__节点时间_完成时间')`

<a id="table-content-12"></a>

#### 全部节点名称

- 流程节点包含"开始"

```sql
WHERE array_contains(all_nodes_name(), '${START_NODE}')
```

<a id="table-content-13"></a>

#### 当前节点名称

- 进行中节点不为空

```sql
WHERE in_progress_nodes_name() is not null
```

<a id="table-content-14"></a>

#### 延期与到期标记

- 开始节点已延期且结束节点今日到期

```sql
WHERE risk_label() = '["${DELAYED}/${START_NODE}","${DUE_TODAY}/${END_NODE}"]'
```

<a id="table-content-15"></a>

#### 节点属性查询

- 开始节点排期在过去 30 天内
- 全部节点估分大于 10
- 调研节点负责人等于小李（等于语法也适用于节点属性）
- 所属节点当前负责人（必须使用 __BELONGING）
- 所属节点状态为进行中
- 所属节点排期在未来 7 天内

```sql
WHERE RELATIVE_DATETIME_BETWEEN(get_node_attribute('${START_NODE}','${NODE_SCHEDULE_START}'), 'past','30d')

WHERE get_node_attribute('__ALL','${ESTIMATE_ATTRIBUTE}') > 10

WHERE get_node_attribute('${RESEARCH_NODE}','owner') = '${LI}'

WHERE any_match(get_node_attribute('__BELONGING','${CURRENT_OWNER}'), x -> x in ('${ZHANG_SAN}'))

WHERE any_match(get_node_attribute('__BELONGING','${STATUS}'), x -> x in ('${IN_PROGRESS}'))

WHERE RELATIVE_DATETIME_BETWEEN(get_node_attribute('__BELONGING','${SCHEDULE_ATTRIBUTE}'), 'future','7d')
```

<a id="bc26fc11"></a>

### 关系函数

| **函数作用** | **函数签名** | **入参说明** | **返回值说明** | **使用示例** |
| --- | --- | --- | --- | --- |
| 通过关系名称获取关系 | relation(relation_name) | - `relation_name`：关系名称。 | 返回 varchar 类型。 | [按关系名筛选](#table-content-16) |
| 获取父工作项 ID | parent_work_item(relation(relation_name)) | - `relation_name`：关系名称。 | 返回 bigint 类型。 | [父工作项 ID](#table-content-17) |
| 关联工作项链式查询（最多 3 跳） | relation_field_chain(relation1 \[, relation2 \[, relation3\]\]) | [入参说明](#parameter-note-3) | - | [关系链](#table-content-18) |
| 跨空间关联实例 ID | association() | - |  | [跨空间关联 ID](#table-content-19) |
| 子任务特有，获取来源控件（父工作项 ID） | linked_work_item() | - |  | [子任务来源工作项](#table-content-20) |

<a id="parameter-note-3"></a>

**关联工作项链式查询（最多 3 跳）：入参说明**

- `relation1`：关系 / 字段名称。
一级关系使用 `relation_field_chain('关系1')` 或 `relation_field_chain('字段1')` 即可。**子任务的父工作项必须写作** **`'__父工作项'`（双下划线前缀）**

<a id="table-content-16"></a>

#### 按关系名筛选

```sql
WHERE any_relation_match(relation('${PARENT_CHILD_RELATION}'), x -> x.`${NAME}<target:all>` like '%${REQUEST_TYPE}%')
```

<a id="table-content-17"></a>

#### 父工作项 ID

```sql
WHERE parent_work_item(relation('${PARENT_CHILD_RELATION}')) = 12345
```

<a id="table-content-18"></a>

#### 关系链

- 一级关系
- 多级关系：子任务→父工作项→软件

```sql
WHERE any_relation_match(relation_field_chain('${RELATED_REQUEST}'), x -> x.`${PRIORITY}<target:all>` = 'P0')

WHERE any_relation_match(relation_field_chain('${PARENT_WORK_ITEM_RELATION}','${REQUEST_SOFTWARE_RELATION}'), x -> x.`${NAME}<target:all>` = '${SOFTWARE_NAME}')
```

<a id="table-content-19"></a>

#### 跨空间关联 ID

```sql
WHERE association() = '${INSTANCE_ID}'
```

<a id="table-content-20"></a>

#### 子任务来源工作项

```sql
WHERE linked_work_item() = '12345'
```

<a id="30cc663b"></a>

### 关系判断函数

| **函数作用** | **函数签名** | **入参说明** | **返回值说明** |
| --- | --- | --- | --- |
| 存在一个/一组对端满足条件 | any_relation_match(relation, predicate) | - `relation`：关系。<br>- `predicate`：lambda_expr 类型的表达式，表示判断条件。 | 返回 bool 类型。 |
| 每一个对端都满足条件 | all_relation_match(relation, predicate) | - `relation`：关系。<br>- `predicate`：lambda_expr 类型的表达式，表示判断条件。 | 返回 bool 类型。 |
| 每一个对端都不满足条件 | none_relation_match(relation, predicate) | - `relation`：关系。<br>- `predicate`：lambda_expr 类型的表达式，表示判断条件。 | 返回 bool 类型。 |
| 存在一个/一组对端不满足条件 | not all_relation_match(relation, predicate) | - `relation`：关系。<br>- `predicate`：lambda_expr 类型的表达式，表示判断条件。 | 返回 bool 类型。 |

<a id="dad4074e"></a>

#### 嵌套筛选规则

对关系对端的属性进行进一步筛选时，使用关系函数（如 `relation_field_chain`）获取关系后，外层必须嵌套关系判断函数。

- 示例：子任务其父工作项的当前负责人全部不属于小李
- 示例：多级关系 + 节点属性 — 子任务关联的任务所关联的需求的"开始"节点负责人包含小李

```sql
WHERE all_relation_match(relation_field_chain('${PARENT_WORK_ITEM_RELATION}'), x -> none_match(x.`${CURRENT_OWNER}<target:all>`, y -> y in ('${LI}')))

WHERE all_relation_match(relation_field_chain('${REQUEST_SECONDARY_RELATION}','${SECONDARY_SUBTASK_RELATION}'), x -> any_match(get_node_attribute('${START_NODE}','${OWNER_FIELD}'), y -> y in ('${LI}')))
```

<a id="a719ecb0"></a>

#### 关系参数三种形式

1. **关联字段**：直接传入字段 key 或名称，例如 `` any_relation_match(`关联需求`, x -> x.`优先级<target:all>` = 'P0') ``。

2. **relation 函数**：按关系名引用，例如 `` any_relation_match(relation('父-子'), x -> x.`名称<target:all>` like '%需求%') ``。

3. **relation_field_chain 函数**：例如 `relation_field_chain('关系1','关系2')`，用于多级关系链。

<a id="7c2644af"></a>

#### 多级关系名处理规则

默认按照用户的输入直接进行查询。如果找不到匹配的关系，可让用户二次输入确认。不主动猜测或转换用户输入的关系名。

<a id="111d710b"></a>

#### 子任务 `__父工作项` 规则

- 子任务的父工作项关系名固定为 `'__父工作项'`（双下划线前缀），不是 `'父工作项'`

- 常见报错：`object[父工作项-关联XXX]: relation chain err:relationNode not found, label:父工作项`

- 原因：父工作项写法缺少双下划线前缀

- **修复**：仅将 `'父工作项'`** **改为** `'__父工作项'`，其他部分保持不变

- 修正示例：`relation_field_chain('__父工作项','关联XXX')`

<a id="1107008d"></a>

#### 跨空间/多端字段引用

指定对端空间与工作项类型时使用 `` x.`字段名<target:空间key::工作项类型key>` ``；引用通用字段时使用 `` x.`字段名<target:all>` ``。

<a id="6ed62dfe"></a>

#### 关联工作项通用字段

（查询关联工作项信息时，以下属性必须使用 `<target:all>`）：标题、创建人、创建时间、业务线、优先级、当前负责人、所属工作项、所属空间、工作项ID、工作项类型、状态

- 多选关联字段：对端优先级为 P0（使用 `<target:all>`）
- 多选关联字段全部满足条件（使用指定空间和类型）
- 关联工作项创建时间（通用字段必须用 `<target:all>`）
- 多级关系结合节点属性（__父工作项要指明 target 才可以串起来关系）
- 关联工作项的节点属性：XX 关联的实例，其 AA 节点负责人不包含小李

```sql
WHERE any_relation_match(`${MULTI_RELATED_FIELD}`, x -> x.`${PRIORITY}<target:all>` = 'P0')

WHERE all_relation_match(`${MULTI_RELATED_FIELD}`, x -> x.`${DESCRIPTION_FIELD}<target:${TARGET_PROJECT_KEY}::${TARGET_TYPE_KEY}>` like '%123%')

WHERE any_relation_match(relation_field_chain('${PARENT_WORK_ITEM_RELATION}'), x -> x.`${CREATED_TIME}<target:all>` >= '2026-03-24')

WHERE all_relation_match(relation_field_chain('${PARENT_WORK_ITEM_RELATION}<target:681b228d7401707f87414afa::story>','${RELATED_FIELD_TWO}'), x -> any_match(get_node_attribute('${START_NODE}','${OWNER_FIELD}'), y -> y in ('${LI}')))

WHERE any_relation_match(`${XX_RELATION}`, x -> not array_contains(get_node_attribute('AA', '${OWNER_FIELD}'), '${LI}'))
```

<a id="776fe5b2"></a>

### 状态函数

| **函数作用** | **函数签名** | **入参说明** | **返回值说明** | **使用示例** |
| --- | --- | --- | --- | --- |
| 返回进入指定状态的时间 | status_time(status_name) | - `status_name`：状态名称。 | 返回 date 类型。 | [进入状态时间](#table-content-21) |
| 获取状态的开始/结束时间 | status_time('__状态名__开始时间') / status_time('__状态名__结束时间') | - | 返回 date 类型。 | [状态时间先后比较](#table-content-22) |

<a id="table-content-21"></a>

#### 进入状态时间

- 状态时间在区间内

```sql
WHERE status_time('${START_NODE}') between '2025-03-10' and '2025-04-10'
```

<a id="table-content-22"></a>

#### 状态时间先后比较

直接比较状态结束与开始日期，不依赖未定义的日期相减单位。

```sql
WHERE status_time('${END_STATE_END_TIME}') > status_time('${START_STATE_START_TIME}')
```

<a id="ce04d555"></a>

## 名称消歧（`<id:xxxx>` 语法）

当人名、团队名等存在重复时，MQL 会因无法唯一标识而报错。此时使用 `<id:xxxx>` 语法指定唯一 ID：

- 人名消歧：张三对应多人时，指定 userkey
- 团队名消歧：指定团队唯一 key

```sql
WHERE `${CREATOR}` = '${ZHANG_SAN}<id:1234>'

WHERE any_match(`${OWNER_FIELD}`, x -> x in (team(true, '${PLATFORM_TEAM}<id:3455>')))
```

> **注意**
>
> 遇到 MQL 返回"名称重复"类错误时，需获取对应的唯一 ID 后使用此语法重试。

**枚举值和 userkey 也可使用** **`<id:xxx>`** **格式**：

- 枚举值指定 option id
- userkey 指定

```sql
WHERE `priority` = '<id:option_2>'

WHERE `${OWNER_FIELD}` = '<id:7290442683267497985>'
```

<a id="0801cef9"></a>

## 特殊字段查询规则

<a id="d3045bfa"></a>

### 日期区间类型字段

日期区间类型（如"需求排期"）不能直接查询，必须拆分为子字段，格式：`` `__排期名_开始时间` `` / `` `__排期名_结束时间` ``

- 正确：使用子字段
- 错误：直接查询日期区间字段

```sql
WHERE `${PERIOD_START}` > '2025-01-01' AND `${PERIOD_END}` < '2025-01-31'
WHERE RELATIVE_DATETIME_BETWEEN(`${REQUEST_SCHEDULE_START}`, 'past', '30d')

WHERE RELATIVE_DATETIME_BETWEEN(`${REQUEST_SCHEDULE}`, 'past', '30d')
```

<a id="6684b7f3"></a>

### 角色字段

角色可作为 MQL 属性查询，使用 `__角色名` 格式（加 `__` 前缀以区分普通自定义字段）：

- 查询 RD 包含某人的工作项
- 查询 QA 包含某人的工作项

```sql
WHERE array_contains(`__RD`, '${ZHANG_SAN}')

WHERE array_contains(`__QA`, '${LI_SI}')
```

<a id="c5df6cee"></a>

## 完整查询示例

<a id="78005070"></a>

### 示例 1：查询空间下我参与的 P0 需求

```sql
SELECT `${WORK_ITEM_ID}`, `${REQUEST_NAME}`, `${PRIORITY}`, `${OWNER_FIELD}`, `${STATUS}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE `${PRIORITY}` = 'P0'
  AND array_contains(all_participate_persons(), current_login_user())
```

<a id="b9812f5c"></a>

### 示例 2：查询最近一周创建的缺陷

```sql
SELECT `${WORK_ITEM_ID}`, `${ISSUE_NAME}`, `${CREATOR}`, `${CREATED_TIME}`, `${STATUS}`
FROM `project_key`.`${ISSUE_TYPE}`
WHERE RELATIVE_DATETIME_BETWEEN(`${CREATED_TIME}`, 'past', '7d')
```

<a id="46d109b3"></a>

### 示例 3：查询逾期未完成的任务

```sql
SELECT `${WORK_ITEM_ID}`, `${TASK_NAME}`, `${OWNER_FIELD}`, `${REQUEST_SCHEDULE_END}`, `${STATUS}`
FROM `project_key`.`${TASK_TYPE}`
WHERE RELATIVE_DATETIME_LT(`${REQUEST_SCHEDULE_END}`, 'today')
  AND `${STATUS}` != '${COMPLETED_LABEL}'
```

<a id="a27c315c"></a>

### 示例 4：查询某团队 RD 负责的需求

```sql
SELECT `${WORK_ITEM_ID}`, `${REQUEST_NAME}`, `__RD`, `${STATUS}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE any_match(`__RD`, x -> x in (team(true, '${PLATFORM_TEAM}')))
```

<a id="1a1f87ea"></a>

### 示例 5：查询我创建的进行中的需求（带排序和分页）

```sql
SELECT `${WORK_ITEM_ID}`, `${REQUEST_NAME}`, `${PRIORITY}`, `${STATUS}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE `${CREATOR}` = current_login_user()
  AND `${STATUS}` = '${IN_PROGRESS}'
ORDER BY `${CREATED_TIME}` DESC
LIMIT 20
```

<a id="d228de46"></a>

### 示例 6：查询特定时间段内创建的、有 RD 和 QA 参与的需求

```sql
SELECT `${PRIORITY}`, `${WORK_ITEM_ID}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE RELATIVE_DATETIME_BETWEEN(`${CREATED_TIME}`, 'past', '30d')
  AND array_contains(participate_roles(), 'RD')
  AND array_contains(participate_roles(), 'QA')
  AND `${ESTIMATED_DURATION}` > 30
ORDER BY `${PRIORITY}` DESC
LIMIT 100
```

<a id="b2dfa9a8"></a>

### 示例 7：模糊匹配 + 当前登录用户

```sql
SELECT `${WORK_ITEM_ID}`, `${ISSUE_NAME}`
FROM `project_key`.`${ISSUE_TYPE}`
WHERE `${ISSUE_NAME}` NOT LIKE '%${BACKEND_PERFORMANCE}%'
  AND array_contains(all_participate_persons(), '${LI_SI}')
  AND `${HANDLER}` = current_login_user()
ORDER BY `${CREATED_TIME}` ASC
LIMIT 10
```

<a id="ebae894f"></a>

### 示例 8：节点属性查询（所属节点 + 延期标识）

- 所属节点当前负责人是张三且进行中
- 开始节点已延期

```sql
SELECT `${WORK_ITEM_ID}`, `${NAME}`, `${STATUS}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE any_match(get_node_attribute('__BELONGING','${CURRENT_OWNER}'), x -> x in ('${ZHANG_SAN}'))
  AND any_match(get_node_attribute('__BELONGING','${STATUS}'), x -> x in ('${IN_PROGRESS}'))

SELECT `${WORK_ITEM_ID}`, `${NAME}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE risk_label() = '["${DELAYED}/${START_NODE}"]'
```

<a id="665c4cc9"></a>

### 示例 9：关系查询（关系链 + 跨空间字段）

- 子任务的父工作项名称包含"登录"
- 多级关系：子任务→父工作项→关联软件，软件名称等于某值

```sql
SELECT `${WORK_ITEM_ID}`, `${NAME}`
FROM `project_key`.`${SUBTASK_TYPE}`
WHERE any_relation_match(relation_field_chain('${PARENT_WORK_ITEM_RELATION}'), x -> x.`${TITLE}<target:all>` like '%${LOGIN_TEXT}%')

SELECT `${WORK_ITEM_ID}`, `${NAME}`
FROM `project_key`.`${SUBTASK_TYPE}`
WHERE any_relation_match(relation_field_chain('${PARENT_WORK_ITEM_RELATION}','${REQUEST_SOFTWARE_RELATION}'), x -> x.`${NAME}<target:all>` = '${SOFTWARE_NAME}')
```

<a id="d6655d4e"></a>

### 示例 10：状态时间查询

- "开始"状态时间在 2025-03-10 至 2025-04-10 之间

```sql
SELECT `${WORK_ITEM_ID}`, `${NAME}`, `${STATUS}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE status_time('${START_NODE}') between '2025-03-10' and '2025-04-10'
```

<a id="cc4d2def"></a>

### 示例 11：节点负责人 + 人员综合查询

- 开始节点负责人包含某人
- 处理人属于某团队

```sql
SELECT `${WORK_ITEM_ID}`, `${NAME}`
FROM `project_key`.`${REQUEST_TYPE}`
WHERE array_contains(get_node_attribute('${START_NODE}','owner'), '${ZHANG_SAN}')

SELECT `${WORK_ITEM_ID}`, `${NAME}`, `${HANDLER}`
FROM `project_key`.`${ISSUE_TYPE}`
WHERE any_match(`${HANDLER}`, x -> x in (team(true, '${PLATFORM_TEAM}')))
```

<a id="示例名称与协议值映射"></a>

## 示例名称与协议值映射

代码块使用 `${NAME}` 形式的显式占位符。**这些是文档占位符，不是 MQL 变量语法。** 阅读时按下表还原；实际接入时，用户配置的字段、节点、关系和人员名应换成当前空间真实名称或 key。协议固定的中文属性与 `__父工作项` 必须保留原值，不能译成英文。

| 占位符 | 原示例名称或协议值 |
| --- | --- |
| `${WORK_ITEM_TYPE}` | 工作项类型名 |
| `${WORK_ITEM_ID}` | 工作项ID |
| `${PRIORITY}` | 优先级 |
| `${STATUS}` | 状态 |
| `${CLOSED_LABEL}` | 已关闭 |
| `${DEVELOPMENT_PERIOD}` | 开发周期 |
| `${EMAIL}` | 邮箱 |
| `${HANDLING_TIME}` | 处理时间 |
| `${START_TIME}` | 开始时间 |
| `${NAME}` | 名称 |
| `${TEST_ONE}` | 测试1 |
| `${TEST_TWO}` | 测试2 |
| `${TEST_THREE}` | 测试3 |
| `${ISSUE_NAME}` | 缺陷名 |
| `${BACKEND_PERFORMANCE}` | 后端性能问题 |
| `${PERFORMANCE}` | 性能问题 |
| `${START_NODE}` | 开始 |
| `${DELAYED}` | 延期 |
| `${DUE_TODAY}` | 今日到期 |
| `${END_NODE}` | 结束 |
| `${NODE_SCHEDULE_START}` | __排期_开始时间 |
| `${ESTIMATE_ATTRIBUTE}` | 估分 |
| `${RESEARCH_NODE}` | 调研 |
| `${LI}` | 小李 |
| `${CURRENT_OWNER}` | 当前负责人 |
| `${ZHANG_SAN}` | 张三 |
| `${IN_PROGRESS}` | 进行中 |
| `${SCHEDULE_ATTRIBUTE}` | 排期 |
| `${PARENT_CHILD_RELATION}` | 父-子 |
| `${REQUEST_SECONDARY_RELATION}` | 需求-二级工作项关联 |
| `${SECONDARY_SUBTASK_RELATION}` | 二级工作项-子任务关联 |
| `${RELATED_REQUEST}` | 关联需求 |
| `${PARENT_WORK_ITEM_RELATION}` | __父工作项 |
| `${REQUEST_SOFTWARE_RELATION}` | 需求关联软件 |
| `${SOFTWARE_NAME}` | 某软件 |
| `${INSTANCE_ID}` | 实例ID |
| `${OWNER_FIELD}` | 负责人 |
| `${MULTI_RELATED_FIELD}` | 多选关联字段 |
| `${DESCRIPTION_FIELD}` | 描述 |
| `${TARGET_PROJECT_KEY}` | 空间key |
| `${TARGET_TYPE_KEY}` | 类型key |
| `${CREATED_TIME}` | 创建时间 |
| `${RELATED_FIELD_TWO}` | 关联字段2 |
| `${XX_RELATION}` | XX关联 |
| `${END_STATE_END_TIME}` | __结束状态__结束时间 |
| `${START_STATE_START_TIME}` | __开始状态__开始时间 |
| `${CREATOR}` | 创建人 |
| `${PLATFORM_TEAM}` | 开放平台团队 |
| `${PERIOD_START}` | __开发周期_开始时间 |
| `${PERIOD_END}` | __开发周期_结束时间 |
| `${REQUEST_SCHEDULE_START}` | __需求排期_开始时间 |
| `${REQUEST_SCHEDULE_END}` | __需求排期_结束时间 |
| `${REQUEST_SCHEDULE}` | 需求排期 |
| `${LI_SI}` | 李四 |
| `${REQUEST_NAME}` | 需求名 |
| `${REQUEST_TYPE}` | 需求 |
| `${ISSUE_TYPE}` | 缺陷 |
| `${TASK_NAME}` | 任务名 |
| `${TASK_TYPE}` | 任务 |
| `${COMPLETED_LABEL}` | 已完成 |
| `${ESTIMATED_DURATION}` | 估算耗时 |
| `${HANDLER}` | 处理人 |
| `${SUBTASK_TYPE}` | 子任务 |
| `${TITLE}` | 标题 |
| `${LOGIN_TEXT}` | 登录 |
| `${USER_A}` | 用户 A |
| `${TAGS_FIELD}` | 标签 |
| `${TAG_A}` | 标签A |
| `${TAG_B}` | 标签B |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/tsl2uj3i
