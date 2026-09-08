# Release Note

<!-- capability-metadata:start -->
## 平台能力标记

> 调用频次：无直接调用频次。本页用于平台说明、格式、目录或支持信息。

<!-- capability-metadata:end -->

本篇保留官方开放平台从 2024-10 至 2026-07 的发布记录，来源页面发布于 2026-07-08，采集于 2026-09-07。各月份中的数量、支持范围和流程表示当时发布内容；当前接口契约以链接的专门文档为准，不能用历史记录代替版本兼容性说明。

<a id="3d97b255"></a>

## 2026-07

<a id="aa0ac979"></a>

### 功能优化

- 工作流详情新增 `need_sub_workitem_detail`，用于读取节点关联子工作项详情，见[获取工作流详情](<../../openapi/api/获取工作流详情.md>)。
- 更新节点和排期支持 `add_sub_workitems`，为节点新增子工作项关联，见[更新节点与排期](<../../openapi/api/更新节点与排期.md>)。
- 富文本读写增加 Markdown 表达，发布说明覆盖涉及富文本的 OpenAPI 与自动化、拦截、监听事件；具体字段和限制见官方 [Markdown 格式说明](https://project.feishu.cn/b/helpcenter/1p8d7djs/i10jbjk4)。这不表示任意字符串字段都能直接接收 Markdown。

原始附件：[开发者手册 7 月 ZIP](https://p9-arcosite.byteimg.com/obj/tos-cn-i-goo7wpa0wc/f3aa92e38bd74ab29b19123481f1603b)。

<a id="1b48563f"></a>

## 2026-06

<a id="3b2921e5"></a>

### 功能优化

- 业务 MCP 增加 IPD 场景工具，包括新建、修改、发布 WBS 计划表，当月记录工具总数为 47，见官方 [MCP Server](https://project.feishu.cn/b/helpcenter/1p8d7djs/jdmql9oj)。
- CLI 增加 AI 字段、AI 节点应用的创建管理能力，见[CLI 开发实践](<../cli/飞书项目开发工具 CLI 开发实践.md>)。

原始附件：[开发者手册 6 月 ZIP](https://p9-arcosite.byteimg.com/obj/tos-cn-i-goo7wpa0wc/50a9c9d26bc74a4ba0cf108c27b42245)。

<a id="23a7b84c"></a>

## 2026-05

<a id="f567557e"></a>

### 新功能

- 发布面向 AI IDE 的开发工具 CLI，支持以自然语言协调工程创建、配置、代码开发和发布，见[CLI 开发实践](<../cli/飞书项目开发工具 CLI 开发实践.md>)。
- ISV 服务支持上架 AI 字段、AI 节点应用，见官方[上架一个 AI 应用](https://project.feishu.cn/b/helpcenter/1p8d7djs/4iith1b7)。

<a id="6b6afc4d"></a>

### 功能优化

- 创建工作项增加 `role_mode`，处理角色可见条件和未传角色值时的默认值，见[创建工作项](<../../openapi/api/创建工作项.md>)。参数名按接口修正，具体生效条件不由本条发布摘要定义。
- 更新节点增加 `node_custom_fields`，用于更新节点自定义字段，见[更新节点与排期](<../../openapi/api/更新节点与排期.md>)。

原始附件：[开发者手册 5 月 ZIP](https://p9-arcosite.byteimg.com/obj/tos-cn-i-goo7wpa0wc/8f58c24c17f5435090ebbdae8ee612bf)。

<a id="7d29b280"></a>

## 2026-04

<a id="76c958f1"></a>

### 新功能

- AI 字段：将 AI 处理能力接入工作项字段，见官方[能力介绍](https://project.feishu.cn/b/helpcenter/1p8d7djs/dc5dgqwa)与[开发使用](https://project.feishu.cn/b/helpcenter/1p8d7djs/prw01fij)。
- AAMP：基于 SMTP 邮件体系的 Agent 异步消息协议，面向 Agent 之间及平台与 Agent 的通信，见官方 [AAMP 协议](https://project.feishu.cn/b/helpcenter/1p8d7djs/1ah9bfkw)。

<a id="b67dd74b"></a>

### 功能优化

业务 MCP 增加工作项资源库、评审管理等工具，当月记录工具总数为 39，见官方 [MCP Server](https://project.feishu.cn/b/helpcenter/1p8d7djs/jdmql9oj)。

原始附件：[开发者手册 2026 年 4 月 ZIP](https://p9-arcosite.byteimg.com/obj/tos-cn-i-goo7wpa0wc/4f66116559af455f80acf98162a7ebac)。

<a id="7bdc2ead"></a>

## 2026-03

<a id="6cd20385"></a>

### 功能优化

- 业务 MCP 增加空间与人员、工作项实例、流程与节点、视图与度量、评论工具，当月记录工具总数为 32，见官方 [MCP Server](https://project.feishu.cn/b/helpcenter/1p8d7djs/jdmql9oj)。
- 轻应用组件支持数据订阅，当月开放 8 种属性、每组件最多配置 20 个属性，见官方[需求分类轻应用组件教程](https://project.feishu.cn/b/helpcenter/1p8d7djs/czmot1t3)。这是历史容量说明，不替代后续组件契约。

<a id="e29946c6"></a>

## 2026-02

<a id="6e914d2b"></a>

### 新功能

- AI 节点：把外部 AI 能力作为可配置行动单元接入项目流程，见官方[AI 节点介绍](https://project.feishu.cn/b/helpcenter/1p8d7djs/3v8lklx9)及[开发使用](https://project.feishu.cn/b/helpcenter/1p8d7djs/6ezzkzro)。
- 文档检索 MCP：为开发者和 AI 开发工具提供官方文档检索，见[通过文档检索 MCP 开发插件](https://project.feishu.cn/b/helpcenter/1p8d7djs/y5y1ko4o)。它与操作业务数据的 MCP 是不同服务。

<a id="67060323"></a>

### 功能优化

业务 MCP 增加 `search_by_mql`，用于通过更细的查询条件操作工作项实例。查询语法见官方 [MQL 语法说明](https://project.feishu.cn/b/helpcenter/1p8d7djs/tsl2uj3i)；原摘要中混用的 `MOQL` 不作为另一个已确认的语言名称。

<a id="2c0728b4"></a>

## 2026-01

<a id="9d9fe8b8"></a>

### 新功能

支持按空间配置拦截事件范围，例如节点负责人变更或使用指定模板创建工作项。入口为[按空间设置拦截事件配置](<../../openapi/events/按空间设置拦截事件配置.md>)和[查询拦截事件配置](<../../openapi/events/查询拦截事件配置.md>)。

<a id="19a75116"></a>

### 功能优化

创建工作项增加 `required_mode` 控制必填项校验，见[创建工作项](<../../openapi/api/创建工作项.md>)。

<a id="3a4ed445"></a>

## 2025-12

<a id="b80528eb"></a>

### 功能优化

OpenAPI 支持查询节点自定义字段，见[获取工作流详情](<../../openapi/api/获取工作流详情.md>)。

<a id="464eec4a"></a>

### 新功能

新增 `x-auth-mode`，与插件访问凭证配合控制部分读接口的鉴权行为。具体头部值、适用接口及凭证关系见 [x-auth-mode 鉴权模式](<../../openapi/guides/x-auth-mode鉴权模式.md>)。

<a id="4085ba33"></a>

## 2025-11

<a id="eeb612fd"></a>

### 新功能

- 增加[修改排期联动子项拦截事件 2008](<../../openapi/events/拦截事件.md#45ad905b>)。
- 记录[按钮脚本模式](<../client/脚本模式.md>)，点击后立即执行逻辑。
- 增加官方[通过资源创建实例](https://project.feishu.cn/b/helpcenter/1p8d7djs/2cqg3j9p)及[通过视图 ID 查询所有图表](https://project.feishu.cn/b/helpcenter/1p8d7djs/nr49t4o9)接口。

脚本模式和通过资源创建实例在上一月也有记录；原页未说明重复列出的原因，本篇保留月份归属，不据此推断二次上线或版本回退。

<a id="62dfbe25"></a>

## 2025-10

<a id="088ac50b"></a>

### 新功能

- 插件可以为[轻应用](https://project.feishu.cn/1ykiuvvj/us21tuni)扩展第三方组件，使用属性配置和通信能力与平台组件联动，见官方[组件构成](<../points/轻应用组件 LiteAppComponent.md>)与[客户端 LiteAppComponent](<../jssdk/LiteAppComponent.md>)。
- 记录[按钮脚本模式](<../client/脚本模式.md>)和官方[通过资源创建实例](https://project.feishu.cn/b/helpcenter/1p8d7djs/2cqg3j9p)接口。
- ISV 认证租户可查看[插件运营数据](https://project.feishu.cn/b/helpcenter/1p8d7djs/zu8ikatc)，包括安装、功能活跃和连接器使用情况。
- ISV 认证租户可查看[插件质量监控](https://project.feishu.cn/b/helpcenter/1p8d7djs/8l0mcvy0)，分析服务端和客户端接口调用数据。

<a id="da9a1ae1"></a>

## 2025-09

<a id="be4acfdf"></a>

### 新功能

推出 ISV 服务，供独立软件供应商上架插件、方案和模板。官方入口包括 [ISV 服务介绍](https://project.feishu.cn/b/helpcenter/1p8d7djs/zr2oqv4c)、[认证租户](https://project.feishu.cn/b/helpcenter/1p8d7djs/1txl351i)、[市场插件开发发布](https://project.feishu.cn/b/helpcenter/1p8d7djs/qn9dbdzw)、[模板管理](https://project.feishu.cn/b/helpcenter/1p8d7djs/ed72ora1)、[解决方案管理](https://project.feishu.cn/b/helpcenter/1p8d7djs/4ef2pjw6)。

<a id="9b7aea86"></a>

## 2025-08

<a id="203c054b"></a>

### 新功能

- 推出基于插件体系的业务 [MCP Server](https://project.feishu.cn/b/helpcenter/1p8d7djs/jdmql9oj)，面向 Agent 的业务操作。
- 新增角色配置接口：官方[创建流程角色配置](https://project.feishu.cn/b/helpcenter/1p8d7djs/y7wmiq1z)、[更新流程角色配置](https://project.feishu.cn/b/helpcenter/1p8d7djs/vqkz8qts)、[删除流程角色配置](https://project.feishu.cn/b/helpcenter/1p8d7djs/jm2zmhh5)、[获取流程角色配置详情](https://project.feishu.cn/b/helpcenter/1p8d7djs/2s90fy0i)，作用于指定工作项类型。
- 新增[按组更新复合字段值](https://project.feishu.cn/b/helpcenter/1p8d7djs/ig302a5x)，支持对指定实例的复合字段按组增加、删除或更新。

<a id="e5843b7c"></a>

### 功能优化

自定义字段配置支持复合字段：通过 `parent_field_key` 为已有复合字段添加子字段，通过子字段 `field_key` 更新配置，见官方[创建自定义字段](https://project.feishu.cn/b/helpcenter/1p8d7djs/3ywaejjy)和[更新自定义字段](https://project.feishu.cn/b/helpcenter/1p8d7djs/tcu33puw)。

<a id="14a728d3"></a>

## 2025-07

<a id="c3f4ba28"></a>

### 新功能

- 新增[日志检索](<日志检索.md>)，供插件管理员和协作者查看服务端 API 调用及已推送事件日志。
- 新增资源库管理接口，按空间 `project_key` 与类型 `work_item_type_key` 定位资源库：官方[创建资源库](https://project.feishu.cn/b/helpcenter/1p8d7djs/ph8311e5)前需在工作项高级配置启用资源库；[复杂条件查询列表](https://project.feishu.cn/b/helpcenter/1p8d7djs/1443tpcg)使用 `search_group` 与分页参数；[获取资源实例详情](https://project.feishu.cn/b/helpcenter/1p8d7djs/lrr9osj6)和[更新资源实例](https://project.feishu.cn/b/helpcenter/1p8d7djs/1y9308dj)按接口定义传入实例及更新字段。

<a id="43669bb3"></a>

### 功能优化

[更新自定义字段](https://project.feishu.cn/b/helpcenter/1p8d7djs/tcu33puw)增加数字字段配置，覆盖百分比、精度和数字符号。

<a id="88830516"></a>

## 2025-06

<a id="8f216643"></a>

### 新功能

- 新增[日期选择器 DatePicker](<../components/日期选择器 DatePicker.md>)，用于单日期或范围选择。
- 新增[获取指定节点或状态流转所需必填信息](https://project.feishu.cn/b/helpcenter/1p8d7djs/acce3p44)，返回表单项、节点字段、子任务及交付物等流转前要求；参数按节点或状态场景区分。

<a id="fb253e2d"></a>

### 功能优化

[富文本组件](<../components/富文本 RichTextEditor.md>)增加 Popover 弹层编辑模式。

<a id="fd02761d"></a>

## 2025-05

<a id="e7092193"></a>

### 新功能

- 新增[自定义字段类型构成](<../points/扩展字段-字段类型 CustomField.md>)，自定义前端交互与值逻辑，并参与视图筛选、度量和配置条件等能力。
- 新增[客户端官方示例插件](<../client/客户端官方示例插件.md>)，用于体验客户端 API 和组件。

<a id="a9b58ba5"></a>

## 2025-04

<a id="c0e8e578"></a>

### 新功能

- 新增[节点排期扩展](<../points/扩展字段-节点排期 Schedule.md>)，支持自定义排期交互，例如联动请假信息。
- 新增视图批量操作按钮，当月说明不含全景视图。当前插件 2.0 入口见 [Button](<../points/按钮 Button.md>)；原记录链接的[历史按钮资料](https://project.feishu.cn/b/helpcenter/1p8d7djs/5oaa0pbc)仅用于追溯。

<a id="ccd5cdbe"></a>

## 2025-03

<a id="d1e62ec3"></a>

### 新功能

WBS 计划表单元格的“更多”菜单新增插件按钮，可自定义点击行为及对应页面，用于修改节点属性等场景。当前点位见 [Button](<../points/按钮 Button.md>)，[历史资料](https://project.feishu.cn/b/helpcenter/1p8d7djs/5oaa0pbc)保留用于追溯。

<a id="59bfa7ac"></a>

### 功能优化

插件市场调整分类并增加推荐区；导航、视图、详情标签页、控件、按钮和自动化增加安装入口；插件介绍支持轮播图，当月说明 ISV 场景必填。

<a id="184d52ca"></a>

## 2025-02

<a id="9e1103e0"></a>

### 功能优化

接口权限按数据对象与执行动作重新分组，并调整开放平台展示，见[权限管理](<../../openapi/guides/权限管理.md>)。

![权限分组调整](<../assets/c89d1f9f7afc2bc04fd26cca.png>)

<a id="61d5e6b8"></a>

## 2025-01

<a id="c377477a"></a>

### 新功能

自 2025-01-02 22:00（UTC+8）之后新建的插件采用 2.0 框架；原记录明确不包括已有插件仅发布新版本的情况。同时调整开发者后台并提供新框架示例。

历史对比见[插件 2.0 与 1.0](https://project.feishu.cn/b/helpcenter/1p8d7djs/thbm2kxy)，迁移资料见[历史插件升级](https://project.feishu.cn/b/helpcenter/1p8d7djs/2x9disol)。这两篇属于历史框架资料，不混作新工程配置。

<a id="1e4fe6e7"></a>

## 2024-12

<a id="6ddc70de"></a>

### 新功能

- 增加[监听事件](<../../openapi/events/监听事件.md>)，安装插件后监听空间实例变化和人员变化。
- 增加官方[插件装卸监听](https://project.feishu.cn/b/helpcenter/1p8d7djs/lswla3b5)，感知安装、升级和卸载操作。

<a id="a79e4621"></a>

## 2024-10

<a id="5137b7c7"></a>

### 新功能

自动化触发器和操作上线，安装后可在规则中使用插件连接器，见[连接器开发](<../points/自动化连接器 Connector.md>)及官方[自动化连接器使用说明](https://project.feishu.cn/1ykiuvvj/ef835n76)。

<a id="7a2a8bf0"></a>

### 功能优化

| 范围 | 当月补充内容 | 官方接口入口 |
| --- | --- | --- |
| 流程模板 | 工作项类型、里程碑、实际工时、节点表单、子工作项、子任务配置 | [获取流程模板配置详情](https://project.feishu.cn/b/helpcenter/1p8d7djs/2vyv76g6) |
| 工作流 | 模板 ID、版本、节点名称、子任务负责人分配模式与详情、配置侧角色 | [获取工作流详情](<../../openapi/api/获取工作流详情.md>) |
| 子任务 | 原摘要同样列出模板、节点、负责人分配和角色相关补充，实际字段以详情接口为准 | [获取子任务详情](https://project.feishu.cn/b/helpcenter/1p8d7djs/3ymu8uej) |
| 排期与估分 | 可表达是否按排期自动填入估分 | [Schedule 结构](https://project.feishu.cn/b/helpcenter/1p8d7djs/1x1d372l#8b67e4ee) |
| 工作项详情 | 状态流实例使用 `expand.need_workflow` 时不再报错，返回空结果 | [获取工作项详情](https://project.feishu.cn/b/helpcenter/1p8d7djs/r9jxqxnd) |
| 附件 | 删除工作项指定字段中的若干附件 | [删除附件](https://project.feishu.cn/b/helpcenter/1p8d7djs/lhvqwtl0) |
| 授权码 | 申请新码不使未使用的旧码提前失效；旧码仍受有效期和单次使用规则约束 | [用户访问凭证](<../../openapi/guides/获取访问凭证.md#user-token>) |
| 条件视图 | 日期字段可用于条件并支持时区表达 | [创建条件视图](https://project.feishu.cn/b/helpcenter/1p8d7djs/nvvyv2uy) |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/qcw96ljx
