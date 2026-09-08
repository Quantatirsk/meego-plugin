# 自动化连接器 / Connector

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.connector"></a>
- **自动化连接器 / Connector** ｜ `plugin-point.connector` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

自动化连接器扩展平台的触发器和操作。空间管理员可以把插件触发器、插件操作与平台内置节点连接，配置跨系统的数据集成规则；开发者负责参数定义、规则订阅处理及服务端业务。

连接器通过 HTTP 接口和 Webhook 与自动化交互，不是运行在客户端的 [脚本模式](<../client/脚本模式.md>)。本页没有定义 Connector JSSDK 上下文或客户端页面入口，不应套用 Page、Button 的初始化流程。

<a id="7cb3ac86"></a>

## 能力与配置更新

| 能力 | 开发者提供 | 平台和管理员负责 |
| --- | --- | --- |
| 插件触发器 | 调用平台触发接口，提交自定义输出字段 | 根据规则启动后续条件和操作 |
| 条件 | 定义触发器输出字段名称和类型 | 管理员选字段配置条件，平台计算、筛选 |
| 插件操作 | 定义输入字段和接收业务的 Webhook | 在规则中映射平台或上游字段，执行时传入具体值 |
| 规则表单 | 触发器输入、输出与操作输入的字段定义 | 平台生成表单，管理员配置值和字段映射 |

触发器规则表单的定义与配置：

操作规则表单的定义与配置：

连接器的表单规则和接收 Webhook 地址支持热更新，无需发布新插件版本；新增、删除功能点位仍需发版。已安装空间无需更新插件即可使用这些配置变化；已有自动化规则需要调整时，规则列表会提示管理员更新配置。

<a id="4c18128b"></a>

## 配置界面

<a id="3dadf376"></a>

### 插件触发器

<a id="cf60d839"></a>

### 使用触发器输出配置条件

<a id="2e8b45e9"></a>

### 插件操作

<a id="f103ec9e"></a>

## 两种集成流程

### 群消息触发自动化

1. 开发者定义触发器输入、输出和 Webhook，发布插件版本。
2. 管理员配置规则后，平台向插件推送 [规则订阅事件](#94cdb9b6)。插件保存规则和触发器配置。
3. 开发者另外为飞书机器人订阅“接收消息”事件，并在自己的服务中处理消息。
4. 消息到达后，插件根据业务逻辑筛选匹配规则，再调用 [触发器接口](#af7adcf7) 提交数据，由平台继续执行自动化。

### 创建需求后新建飞书日程

开发者配置并发布“创建飞书日程”操作；管理员使用内置“需求创建”触发器，将工作项信息和参与人员映射到操作输入。规则触发后，平台调用插件 Webhook，由插件创建日程。

<a id="c83f5087"></a>

## 职责分工

<a id="37be6f23"></a>

### 插件开发者

开发者定义三方字段、执行三方业务，并将适合平台处理的数据更新或状态同步交给内置操作。字段映射由规则表单承接，避免把每个空间的映射规则硬编码在插件中；能否减少 OpenAPI 调用，取决于实际采用的内置操作。

<a id="befe6321"></a>

### 空间管理员

管理员在自动化中统一配置平台内与跨平台规则，使用平台字段和插件参数组合触发条件、字段映射及操作。

<a id="84fc5551"></a>

## 安装与使用

1. 按业务需求由开发者完成连接器构成和服务端，参见下文开发流程。
2. 在“插件管理 > 添加插件”搜索并安装。
3. 安装后，在自动化触发器或操作列表中选择插件功能，配置规则。

<a id="dba501a4"></a>

## 开发自动化触发器

<a id="1223b253"></a>
<a id="24fbd473"></a>

### 后台配置

添加“自动化触发器”构成。一个插件可配置多个触发器，各自独立生效。

| 配置 | 说明 |
| --- | --- |
| 触发器名称 | 具体功能名称，例如“飞书消息连接器示例” |
| 触发器描述 | 触发条件，例如“当飞书群消息到达时触发” |
| 触发器 Key | 系统生成，不可修改 |
| Webhook 推送地址 | 接收规则订阅事件，支持 HTTP、HTTPS，地址可热更新 |
| Token | 配置后，平台推送携带相应 Token 信息 |
| 触发器入参 | 管理员配置触发条件的表单字段 |
| 触发器出参 | 向后续条件和操作提供的字段，使用相同字段定义结构 |

### 规则表单定义

触发器输入、触发器输出与操作输入采用同一结构：顶层键为唯一字段 Key，不能重复；值定义字段类型、表单表现和可选的选项来源。

| 配置路径 | 说明 |
| --- | --- |
| `field_type` | 字段类型，适用范围见 [字段类型表](#7b181259) |
| `form_config.label.origin` | 字段名称 |
| `form_config.placeholder.origin` | 字段提示文案 |
| `form_config.validate.required.value` | boolean，是否必填 |
| `field_attr.option` | 选项定义，仅 `select`、`radio`、`multi_select` 生效 |
| `field_attr.option.type` | `enum` 静态选项或 `remote` 动态选项 |

必填的检查阶段不同：触发器入参由管理员配置规则时填写；触发器出参由开发者调用触发器 API 时提供，缺失则不满足触发条件；操作入参由规则配置者指定值。原文操作模板对触发器入参的旁注不适用于触发器自身定义，此处按触发器专节更正。

静态选项使用 `enum` 数组，选项标签结构为 `{ "origin": "..." }`。下例是一个必填的单选输入字段：

```json
{
  "priority": {
    "field_type": "select",
    "form_config": {
      "label": { "origin": "Priority" },
      "placeholder": { "origin": "Select a priority" },
      "validate": { "required": { "value": true } }
    },
    "field_attr": {
      "option": {
        "type": "enum",
        "enum": [
          { "label": { "origin": "High" }, "value": "high" },
          { "label": { "origin": "Normal" }, "value": "normal" }
        ]
      }
    }
  }
}
```

动态选项以 `remote.url` 指定可公网访问的 POST 接口。以下是 `field_attr.option` 的替换配置，不与静态选项同时配置：

```json
{
  "type": "remote",
  "remote": { "url": "https://example.com/connector/options" }
}
```

该接口响应体为数组；与静态配置不同，动态响应的 `label` 是字符串：

```json
[
  { "label": "High", "value": "high" },
  { "label": "Normal", "value": "normal" }
]
```

原文没有定义动态选项请求体、鉴权或分页格式，不能自行把其他 Webhook 的请求结构套用到这里。

<a id="d6a8214a"></a>

### 触发器业务流程

<a id="94557d16"></a>
<a id="94cdb9b6"></a>

### 规则订阅事件

规则配置者填写触发器入参并保存规则后，平台向触发器 Webhook 发送 `RuleSubscribeEvent`。自动化操作章节中的同名规则事件采用相同结构，以下统一说明。

| 字段 | 说明 |
| --- | --- |
| `header.operator` | 操作者 User Key |
| `header.event_type` | 固定为 `RuleSubscribeEvent` |
| `header.token` | 配置的 Token |
| `header.uuid` | 推送标识；原规则订阅示例为空，生成与去重约定未在本页说明 |
| `payload.project_key` | 空间唯一标识 |
| `payload.rule_name` | 规则名称 |
| `payload.rule_group_id` | 规则 ID |
| `payload.trigger_at` | 触发时间，秒级时间戳 |
| `payload.rule_list` | 触发器分支列表 |

| `rule_list[]` 字段 | 说明 |
| --- | --- |
| `rule_id` | 触发器分支唯一标识 |
| `trigger_type` | 数字类型编码，连接器触发为 32 |
| `node_list` | 该分支的触发器节点列表 |

| `node_list[]` 字段 | 说明 |
| --- | --- |
| `node_id` | 触发器节点 ID |
| `created_at` | 规则创建时间戳 |
| `updated_at` | 时间戳；原文未明确其更新时机，不能据此认定规则已执行业务 |
| `operate_type` | `subscribe` 新建订阅；`unsubscribe` 取消订阅；`update` 更新信息 |
| `field_item` | 当前规则配置的输入字段列表 |
| `field_item[].field_key` | 触发器输入字段 Key |
| `field_item[].field_value` | 字段值，按声明的字段类型解析 |

以下 ID 为演示值，保留官方 JSON 的整数形式。规则、分支和节点 ID 可能超过 JavaScript 安全整数范围；服务端应使用能保留整数精度的解析方式，不应先经 JavaScript `Number` 再转字符串，也不要未经协议确认擅自改变 JSON 字段类型。

```json
{
  "header": {
    "operator": "7426311932258287635",
    "event_type": "RuleSubscribeEvent",
    "token": "",
    "uuid": ""
  },
  "payload": {
    "project_key": "6718b726ef5f002325d2edac",
    "rule_name": "Message rule",
    "rule_group_id": 7449641097674474387,
    "trigger_at": 1734504731,
    "rule_list": [
      {
        "rule_id": 7449641097673834531,
        "trigger_type": 32,
        "node_list": [
          {
            "node_id": 7449641097711599635,
            "created_at": 1734504732,
            "updated_at": 1734504732,
            "operate_type": "subscribe",
            "field_item": [
              {
                "field_key": "chat_id",
                "field_value": "oc_5b2720153b1d5f43494338c87f90ae8e"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

<a id="af7adcf7"></a>

### 开发者推送触发事件

管理员保存规则后，开发者可调用下列平台接口提交触发器输出，驱动符合配置的自动化规则。

```http
POST /webhook-api/auto/trigger/data
```

| 位置 | 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| query | `project_key` | 是 | string | 空间 Key |
| query | `plugin_key` | 是 | string | 插件 Key |
| query | `trigger_key` | 是 | string | 触发器 Key |
| header | `X-ITEM-UUID` | 否 | string | 幂等 Key |
| header | `X-TOKEN` | 否 | string | 开发者后台提示的 Token 签名 |

请求体顶层为字段 Key，每个字段对象含 `value`，可带用于规则配置的 `label`。`value` 的类型必须匹配触发器输出定义。特殊字段 `work_item_ids` 不需要预先声明，供内置操作使用，其 `value` 固定为工作项 ID 数组。

```json
{
  "chat_id": {
    "value": "oc_d6d66b40c0000006340bbdb8005a48"
  },
  "content": {
    "value": "Trigger payload example"
  },
  "work_item_ids": {
    "label": "",
    "value": [124235, 23523]
  }
}
```

调用方需在后台声明 `chat_id`、`content` 为受支持的输出类型，例如 `text`。不要把订阅事件中的 `field_item[].field_value` 结构直接用作此接口请求体。

成功响应：

```json
{
  "code": 0
}
```

| `code` | 含义 |
| --- | --- |
| 0 | 成功 |
| 1001 | QPS 限制 |
| 1002 | 数据大小超限 |
| 1003 | 幂等检查命中 |
| 1004 | 签名错误 |
| 1005 | 黑名单限制 |
| 2001 | 参数异常 |
| 2002 | 缺少必填参数 |
| 5001 | 系统错误 |

本页没有给出具体 QPS、大小阈值、幂等有效期或 `X-TOKEN` 算法；这些值需按后台提示和相应协议核实。

<a id="d0183270"></a>

## 开发自动化操作

<a id="23736ded"></a>

### 后台配置

添加“自动化操作”构成。一个插件可配置多个操作，各自独立生效。

| 配置 | 说明 |
| --- | --- |
| 操作名称 | 例如“创建飞书日程” |
| 操作描述 | 例如“创建日程并添加参与人” |
| 操作 Key | 系统生成，不可修改 |
| 适用触发器类型 | 限制哪些触发器可调用；不选时默认所有自动化触发器 |
| Webhook 推送地址 | 接收操作事件，支持 HTTP、HTTPS，可热更新 |
| Token | 配置后，推送携带对应 Token 信息 |
| 操作入参 | 管理员配置和映射的操作参数，采用前文规则表单结构 |

操作字段的必填规则作用于管理员配置：标为必填的字段需要指定值。可用字段类型比触发器输入、输出有所不同，见 [字段适用范围](#7b181259)。

<a id="2826e0c6"></a>

### 操作业务流程

<a id="8c8aec4a"></a>

### 接收事件

平台规则订阅事件使用前文的 [RuleSubscribeEvent](#94cdb9b6)。规则实际运行时，向操作 Webhook 推送与触发来源对应的业务事件。

| 来源 | `header.event_type` |
| --- | --- |
| 创建工作项 | `WorkitemCreateEvent` |
| 字段值修改 | `WorkitemUpdateEvent` |
| 终止工作项 | `WorkitemAbortedEvent` |
| 恢复工作项 | `WorkitemRestoreEvent` |
| 工作项状态修改 | `WorkitemStatusEvent` |
| 任务状态修改 | `TaskStatusEvent` |
| 任务修改 | `TaskUpdateEvent` |
| 角色操作 | `WorkitemPersonAssignedEvent` |
| 节点状态修改 | `WorkFlowNodeStatusEvent` |
| 节点排期操作 | `WorkFlowNodeScheduleEvent` |
| 评论操作 | `WorkitemCommentEvent` |
| 工作项完成或归档 | `WorkitemFinishEvent` |
| 删除工作项 | `WorkitemDeleteEvent` |
| 定时循环 | `TimedTriggerEvent` |
| 动态时间任务 | `DynamicTimeTriggerEvent` |

这些字符串与后文数字触发器类型不是同一种字段，不可互换。本页未枚举创建任务、删除任务对应的事件字符串，不按名称推测补造。

| 字段 | 说明 |
| --- | --- |
| `header.operator` | 操作者 User Key |
| `header.event_type` | 业务事件字符串 |
| `header.token` | 后台配置的 Token |
| `header.uuid` | 幂等串，用于避免重复处理 |
| `data` | 本次规则执行解析后的操作输入，每个字段为 `{ "value": ... }` |
| `payload` | 对应事件的业务载荷；不同事件结构不同 |

下面保留创建日程示例的字段结构。日期字段是毫秒时间戳，时间选择值 `"8"`、`"14"` 仍是字符串，不能因为内容为数字就改变字段类型。

```json
{
  "header": {
    "operator": "7426311932258287635",
    "event_type": "WorkitemCreateEvent",
    "token": "",
    "uuid": "8af39a3ddc19617f750338d9b7356922"
  },
  "data": {
    "description": { "value": "Personal study" },
    "end_date": { "value": 1734451200000 },
    "end_time": { "value": "14" },
    "mentions": { "value": ["heguiyan", "7426311932258287635"] },
    "start_date": { "value": 1734451200000 },
    "start_time": { "value": "8" },
    "title": { "value": "12131231231231" }
  },
  "payload": {
    "id": "102470819",
    "project_key": "6718b726ef5f002325d2edac"
  }
}
```

本页没有完整展开每种事件的 `payload`，因此不能把上面的 `id` 和 `project_key` 两项视为所有事件的共同完整结构。

<a id="03e66ba3"></a>

### 响应与重试

收到平台 HTTP POST 后，在 **60 秒内**返回 HTTP 200，响应体为：

```json
{
  "code": 0
}
```

未满足这些条件时，平台认为推送失败，间隔 **6 秒**再次推送。原文只说“最多推送 3 次”，未明确是否包含首次，具体计数待核实；不能按“首次加 3 次重试”写死。操作处理应使用 `header.uuid` 做幂等，避免重复创建三方资源。

这里的 60 秒是服务端自动化推送响应期限，与客户端 Script 的最大执行时长、拦截事件的 1000 ms 判定期限分别适用。

<a id="7b181259"></a>

## 字段类型与适用范围

| `field_type` | 值结构 | 含义 | 触发器入参 | 触发器出参 | 操作入参 |
| --- | --- | --- | --- | --- | --- |
| `text` | string | 单行文本 | 支持 | 支持 | 支持 |
| `multi_text` | string | 多行文本 | 支持 | 支持 | 支持 |
| `date` | number | 毫秒时间戳 | 支持 | 支持 | 支持 |
| `schedule` | `{ start: number, end: number }` | 开始、结束时间戳 | 不支持 | 不支持 | 支持 |
| `boolean` | boolean 或 null | 开关；原文值说明包含 null | 不支持 | 支持 | 支持 |
| `user` | string | User Key | 支持 | 不支持 | 支持 |
| `multi_user` | string[] | User Key 数组 | 支持 | 支持 | 支持 |
| `number` | number | 数字 | 支持 | 支持 | 支持 |
| `link` | string | URL | 不支持 | 支持 | 支持 |
| `select` | string | 单选选项 ID | 支持 | 不支持 | 支持 |
| `radio` | string | 单选按钮选项 ID | 支持 | 不支持 | 支持 |
| `multi_select` | string[] | 多选选项 ID 数组 | 支持 | 不支持 | 支持 |

这是自动化参数的类型集合，开关使用 `boolean`，不要套用其他平台接口中 `bool` 等不同枚举。下列是字段值对象示例，业务文本与用户标识采用英文演示值。

<a id="table-content-1"></a>

### 单行文本

```json
{ "value": "Single-line text" }
```

<a id="table-content-2"></a>

### 多行文本

```json
{ "value": "First line\nSecond line" }
```

<a id="table-content-3"></a>

### 日期

```json
{ "value": 1727091486000 }
```

<a id="table-content-4"></a>
<a id="table-content-5"></a>

### 日期区间

值对象有 `start`、`end` 两个 number 属性，示例使用毫秒时间戳：

```json
{ "value": { "start": 1727091486000, "end": 1727091486000 } }
```

<a id="table-content-6"></a>

### 开关

```json
{ "value": true }
```

<a id="table-content-7"></a>

### 人员

```json
{ "value": "example_user_key" }
```

<a id="table-content-8"></a>

### 多选人员

```json
{ "value": ["example_user_key"] }
```

<a id="table-content-9"></a>

### 数字

```json
{ "value": 123.1 }
```

<a id="table-content-10"></a>

### 链接

```json
{ "value": "https://bytedance.larkoffice.com" }
```

<a id="table-content-11"></a>

### 单选与单选按钮

```json
{ "value": "example_option_id" }
```

<a id="table-content-12"></a>

### 多选

```json
{ "value": ["example_option_id"] }
```

<a id="eefc06a6"></a>

## 触发器类型编码

用于规则订阅中的 `trigger_type`，不等于 `header.event_type`。

| 编码 | 触发器 |
| --- | --- |
| 1 | 创建工作项 |
| 2 | 完成工作项 |
| 3 | 删除工作项 |
| 4 | 终止或恢复工作项 |
| 5 | 工作项状态修改 |
| 6 | 字段值修改 |
| 7 | 评论操作 |
| 9 | 工作项节点流转 |
| 10 | 排期操作 |
| 11 | 人员分配 |
| 14 | 任务修改 |
| 15 | 任务状态修改 |
| 18 | 定时任务 |
| 19 | 动态时间任务 |
| 30 | 任务创建 |
| 31 | 任务删除 |
| 32 | 连接器触发 |

<a id="4b17fa55"></a>

## 与平台内置节点组合

<a id="241ffd4a"></a>

### 插件触发器连接内置操作

| 内置操作 | 支持情况与引用限制 |
| --- | --- |
| 飞书通知 | 支持 |
| Webhook | 支持 |
| 字段操作 | 支持 |
| 节点操作 | 支持触发，不支持引用插件触发器字段 |
| 群组操作 | 支持，仅可引用人员或多选人员字段 |
| 人员分配 | 支持，仅可引用人员或多选人员字段 |
| 状态流转 | 支持触发，不支持引用插件触发器字段 |
| 创建工作项 | 支持 |
| 通知中心 | 支持 |
| 邮件 | 支持 |

字段能否从某个插件触发器输出，还需同时满足前文类型适用范围；例如 `user` 未列为触发器输出类型，而 `multi_user` 支持输出。

<a id="a3029e2f"></a>

### 内置触发器连接插件操作

| 内置触发器 | 支持情况 |
| --- | --- |
| 定时循环 | 支持，但插件操作字段不支持引用触发器字段 |
| 动态时间任务 | 支持，但插件操作字段不支持引用触发器字段 |
| 创建工作项、完成工作项 | 支持 |
| 终止或恢复工作项、删除工作项 | 支持 |
| 工作项状态修改、工作项节点流转 | 支持 |
| 字段值修改、排期操作 | 支持 |
| 人员分配、评论操作 | 支持 |
| 任务修改、任务状态修改 | 支持 |
| 创建任务、删除任务 | 支持 |

<a id="58be357c"></a>

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/2cnupe2z
