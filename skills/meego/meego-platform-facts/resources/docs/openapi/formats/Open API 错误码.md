# Open API 错误码

<!-- capability-metadata:start -->
## 平台能力标记

> 调用频次：无直接调用频次。本页用于平台说明、格式、目录或支持信息。

<!-- capability-metadata:end -->

排查失败请求时，应同时记录 HTTP 状态码、外层 `err_code` 与 `err_msg`，再对照调用接口的参数和限制。本表按问题类型整理官方错误条目；同一错误码可能覆盖多个场景，例如 `50006` 有两条不同的错误信息。

## 限流口径与版本差异

- **10429 限流**：按租户、插件与接口统计请求，部分接口有专门阈值；更换 token 不会改变这几个统计维度。以[通用限流规则](../guides/OpenAPI概述.md#rate-limits)、[特殊接口限流说明](../support/OpenAPI限流调整公告-2025-05-12.md)及目标接口的限制为准。
- **20002 评论分页**：原表的 200 条上限适用于旧查询评论接口；[新版查询评论](../api/查询评论.md)的 `page_size` 上限为 50。迁移时需要同步调整分页参数。
- **20011 视图类型**：原表将删除操作限定为固定视图；现行[删除视图](../api/删除视图.md)文档支持更多视图类型。不要把旧错误说明当作所有版本的能力限制。
- **20090 请求被拦截**：按错误信息 `Your request has been intercepted.` 排查插件拦截行为。计算字段的支持范围应查看目标接口和字段文档，不能仅据此错误码归类。
- **20024、20028、20055 等数字上限**：它们描述触发对应错误的场景。上传文件、批量获取与搜索接口可能各有专门规则，应在目标接口文档中确认，不能从错误码表推导全局上限。

## 鉴权与操作权限

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 403 | `10001` | No Permission | 操作人或插件没有本次操作的权限。按下方「10001 的操作场景」逐项检查。 |
| 403 | `10002` | Illegal Operation | 当前节点或状态不能流转到指定目标。核对流程配置中允许的流转路径。 |
| 403 | `10004` | Operation Failed | 操作会使流程图不再包含任何节点；流程图至少必须保留一个节点。 |
| 401 | `10021` | Token Not Exist | 请求头缺少 `plugin_token`。 |
| 401 | `10022` | Check Token Failed | `plugin_token` 校验失败。 |
| 403 | `10210` | code invalid | 获取用户访问凭证时传入的 `code` 授权码无效。 |
| 403 | `10211` | Token Info Is Invalid | 插件 token 无效或无法解析；使用插件级 token 时，还应检查是否缺少 `X-USER-KEY`。 |
| 401 | `10301` | Check Token Perm Failed | token 的接口权限校验未通过。检查权限申请、版本发布、插件安装更新，以及空间与操作人的访问权限，详见下方。 |
| 401 | `10302` | Check User Error, User Is Resigned | 当前操作用户已离职。 |
| 403 | `10404` | No Project Permission | 当前操作用户没有对应空间的访问权限。 |
| 400 | `20039` | Plugin Token Must Have User Key, But X-USER-KEY Is Not Set In Request Header | 使用应用 token 时，请求头必须提供 `X-USER-KEY`。 |
| 400 | `20042` | X-User-Key Is Wrong, Please Check First | 没有填写 `X-User-Key`，或传入的 `user_key` 不正确。 |
| 400 | `20049` | TenantGroupID Is Wrong | 渠道用户传入的 `TenantGroupId` 不正确。 |

## 限流、幂等与用量

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 429 | `10429` | API Request Frequency Limit | 请求触发限流；按租户、插件、接口及其专门阈值排查，详见本篇限流说明。 |
| 429 | `10430` | API Request Idempotent Limit | 请求触发幂等限制。检查请求头 `X-IDEM-UUID` 是否与另一请求冲突。 |
| 400 | `1000051942` | commercial usage exceeded | 商业化用量已超限。 |

## 参数格式与数量限制

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 400 | `20001` | Param Request Limit | 获取空间详情时，传入的空间 ID 数量超过 100。 |
| 400 | `20002` | Page Size Limit | 旧查询评论接口的 `page_size` 超过 200；新版查询评论接口上限为 50，见版本差异说明。 |
| 400 | `20003` | Wrong WorkItemType Param | 获取指定工作项列表时缺少 `work_item_type_keys`；或目标为状态流工作项，却在详情或列表请求的 `expand` 中设置了 `need_workflow: true`。 |
| 400 | `20004` | Search User Limit | 获取指定工作项列表时，`user_keys` 数量超过 10；获取用户详情时，一次查询用户数超过 100。 |
| 400 | `20005` | Missing Param | 缺少必填请求参数。 |
| 400 | `20006` | Invalid Param | 参数格式不合法，应对照[字段与属性解析格式](字段与属性解析格式.md)。创建子任务遇到节点负责人已绑定角色的报错时，应通过 `role_assignee` 指定负责人。 |
| 400 | `20009` | Abort Or Restore WorkItem No Reason | 终止或恢复工作项时没有填写原因。 |
| 400 | `20013` | Invalid Time Interval | 时间参数不是接口要求的毫秒时间戳；原表将该格式表述为 13 位数字。 |
| 400 | `20015` | Field Mix With '-' And Without '-' | 同一字段同时出现在返回列表与排除列表中，即同时使用不带 `-` 和带 `-` 的写法。 |
| 400 | `20019` | Invite Bot Limit 5 | 邀请入群的机器人数量超过 5。 |
| 400 | `20020` | Bot App_ids Empty | 没有填写邀请入群的机器人 App ID。 |
| 400 | `20024` | Uploaded File Size Limit 100M | 上传文件触发大小限制，原错误信息标示为 100M；具体上传入口仍以其接口文档为准。 |
| 400 | `20025` | Field_key/Field_alias Missing | 字段 `key` 和对接标识 `alias` 均未填写。 |
| 400 | `20028` | Workitem Ids Limit 50 | 传入的工作项 ID 数量超过 50。 |
| 400 | `20040` | Request Form Is Null | 上传附件的表单为空；检查 `Content-Type` 是否为 `multipart/form-data`。 |
| 400 | `20043` | View Ids Limit 10 | 查询视图列表时，传入的视图 ID 数量超过 10。 |
| 400 | `9999` | Invalid Param | 请求数据结构不匹配；对照接口参数对象检查层级和字段类型。 |

## 流程、节点与子任务

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 400 | `20007` | WorkItem Is Already Aborted | 工作项已经终止，不能重复终止。 |
| 400 | `20008` | WorkItem Is Already Restored | 工作项已经恢复，不能重复恢复。 |
| 400 | `20016` | Node Is Not Arrived, Could Not Be operated | 节点尚未到达，不能执行节点流转。 |
| 400 | `20017` | Node Is Completed, Could Not Be Completed | 节点已经完成，不能再次完成。 |
| 400 | `20018` | Node ID Not Exist In Workflow | 节点 ID 不存在于当前工作项的节点流配置中；检查实际工作项配置。 |
| 400 | `20026` | FlowType Is Error, Please Convert To Status FlowType | 流程类型不符合接口要求，该错误要求使用状态流工作项。 |
| 400 | `20027` | FlowType Is Error, Please Convert To Node FlowType | 流程类型不符合接口要求，该错误要求使用节点流工作项。 |
| 400 | `20032` | DifferentSchedule Set Owner Invalid | 差异化排期没有指定更新排期的用户，或一次指定了超过一个用户。 |
| 400 | `20037` | Node Is not completed, Could Not Be Rollback | 节点尚未完成，不能回滚。 |
| 400 | `20038` | Required Field Is Not Set | 节点完成或状态流转时，缺少必填字段。 |
| 400 | `20044` | WorkItem Has Been Disabled | 工作项已禁用，无法查询其元数据。 |
| 400 | `20046` | Task ID Not Exist In Workflow | 子任务 ID 不存在于工作流中。 |
| 400 | `20047` | Role_Assignee and Assignee Can't Be Set Together | 创建或更新子任务时，`role_assignee` 与 `assignee` 不能同时传入。 |
| 400 | `20048` | Role_Assignee's Role Is Not Match | `role_assignee` 中的 `role` 与节点绑定的角色不一致。 |
| 400 | `20056` | Only WorkFlow Mode Can Be Aborted Or Restored | 只有工作流模式支持终止和恢复。 |
| 400 | `20082` | Action is not supported | 子任务状态更新仅支持回滚和确认操作。 |

## 工作项、字段与关系

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 400 | `20014` | Project And WorkItem Not Match | 工作项所属空间与请求中的空间不一致。 |
| 400 | `20021` | ChatID Not Belong WorkItem | 群 ID 不属于请求指定的工作项。 |
| 400 | `20029` | Unsupported Field Type | 指定字段类型不支持更新；相关字段 key 会在 `msg` 中返回。 |
| 400 | `20033` | Update Field Invalid | 指定字段不能更新。 |
| 400 | `20041` | Field RoleOwner Must Be Set In FieldValuePairs | 创建工作项缺少 `role_owners` 字段。 |
| 400 | `20050` | 「field_key」Field Option Value Is Wrong | 创建或更新工作项时，字段选项值不正确；检查错误信息中指出的字段 key。 |
| 400 | `20051` | FieldLinkedStory Value Is Wrong | `field_linked_story` 的值不正确。 |
| 400 | `20052` | IssueOperator Value Is Wrong | 缺陷的 `operator` 角色负责人不正确；可与工作项详情返回的 `role_owners` 对照。 |
| 400 | `20053` | IssueReporter Value Is Wrong | 缺陷的 `reporter` 角色负责人不正确；可与工作项详情返回的 `role_owners` 对照。 |
| 400 | `20060` | WorkItemTypeKey Or RelationWorkItemTypeKey Is Not Match In Field Configuration | 工作项类型或关联工作项类型与关联关系配置不匹配。 |
| 400 | `20061` | RelationKey Type Is Not Relation In Configuration | 指定关联关系字段的实际类型不是关联类型。 |
| 400 | `20062` | RelationType Error | `RelationType` 仅支持 `0`（字段 key）与 `1`（字段 alias）。 |
| 400 | `20070` | Field is InValid | 上传附件时指定的字段已失效。 |
| 400 | `20083` | Duplication Field Exist, FieldKey : | 创建工作项时重复传入了同一字段。 |
| 400 | `20090` | Your request has been intercepted. | 请求或操作被插件拦截。结合拦截插件配置及错误信息排查。 |

## 视图与评论

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 400 | `20010` | WorkItemType Is Not Same | 创建或更新视图时，传入的工作项 ID 列表包含不同工作项类型。 |
| 400 | `20011` | Input View Is Not Fix View | 向要求固定视图的接口传入了其他类型视图。原表关于「只支持删除固定视图」的说法属于旧接口口径，见版本差异说明。 |
| 400 | `20012` | View Is Not In The Input Project | 视图所属空间与请求中的空间不一致。 |
| 400 | `20045` | Comment And WorkItem Not Match | 评论不属于指定工作项。 |

## 搜索条件

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 400 | `20055` | Search Result Bigger Than 2000, Please Check Your Search Params | 本次查询结果超过 2000 条，应缩小筛选范围；不要将该阈值套用于所有搜索接口。 |
| 400 | `20057` | Search ProjectKeys And SimpleNames Limit 10 | 搜索时，`ProjectKeys` 与 `SimpleNames` 的并集超过 10 项。 |
| 400 | `20058` | SearchUser.Role And SearchUser.FieldKey Can't appear together | `SearchUser` 中的 `Role` 与 `FieldKey` 不能同时出现。 |
| 400 | `20059` | SearchUser.FieldKey Or SearchUser.Role Can't Appear Alone，SearchUser.UserKeys Must Appear | 传入 `SearchUser.Role` 或 `SearchUser.FieldKey` 时，必须同时提供非空的 `SearchUser.UserKeys`。 |
| 400 | `20063` | Search Operator Error, | 字段不支持指定搜索操作符；不同参数可用的操作符不同。 |
| 400 | `20064` | Search Option Size Too Large | 搜索选项值超过 50 个。 |
| 400 | `20065` | Search Param Key Not Support StateFlow : Param Key is | 指定参数不支持状态流筛选。 |
| 400 | `20066` | Search Signal Only Support len=1 When Operator Is 「=」 or 「!=」 | 搜索系统外信号时，使用 `=` 或 `!=` 操作符的数组长度必须为 1。 |
| 400 | `20067` | Search Signal Not Support Value : | 系统外信号的取值不支持筛选。 |
| 400 | `20068` | Search Param Is Not Support, | 指定参数不支持筛选。 |
| 400 | `20069` | Search Param Value Error, | 搜索参数的值不正确。 |
| 400 | `20071` | Search People Not Support Issue | 使用 `people` 搜索参数时，不支持缺陷工作项。 |
| 400 | `20072` | Conjunction Value Only Support 「AND」、「OR」 | `Conjunction` 仅支持 `AND` 与 `OR`。 |
| 400 | `20080` | Query length must be larger than 0,smaller than 200 | 综合搜索的 `query` 必填，且长度必须大于 0、小于 200。 |
| 400 | `20081` | Query type is not supported | 综合搜索仅支持查询工作项和视图。 |

## 资源不存在

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 404 | `13001` | View not exist | 指定视图不存在。 |
| 404 | `30005` | WorkItem Not Found | 工作项不存在，可能已删除、ID 不正确，或工作项类型与 ID 不匹配。 |
| 404 | `30006` | User Not Found | 未找到用户。检查请求头的 `user_key`，并核对虚拟 token 与 ISV 插件限制，详见下方。 |
| 404 | `30007` | Workflow Not Found | 工作项中没有找到节点流。 |
| 404 | `30008` | Business Not Found | 空间中没有找到对应业务线。 |
| 404 | `30009` | Field Not Found | 字段不存在于字段配置中，无法用于创建或更新。 |
| 404 | `30010` | Stateflow Not Found | 工作项中没有找到状态流。 |
| 404 | `30011` | Node Not Found In Workflow | 节点不存在于工作项的节点流配置中。 |
| 404 | `30012` | State Not Found In Stateflow | 状态不存在于工作项的状态流配置中。 |
| 404 | `30015` | Record Not Found | 更新评论时找不到评论 ID；检查请求参数中的评论 ID。 |

## 服务端错误

| HTTP | err_code | err_msg（外层） | 含义与排查 |
| --- | --- | --- | --- |
| 500 | `50006` | RPC Call Error  This type does not support | 原表将其列为未知错误，建议联系技术支持。 |
| 500 | `50006` | openapi system err, please try again later | 服务瞬时超载，可尝试重试恢复。 |

## 多原因错误的排查顺序

### 10001：按具体操作检查权限

原文列出的触发场景包括：

- 更新评论：当前操作人不是评论创建人。
- 更新或删除视图：操作人没有编辑视图的权限。
- 创建子任务：子任务所在空间与请求路径中的空间不一致。
- 完成节点或流转状态：操作人没有完成权限。
- 获取指定工作项列表：对应空间没有安装插件。
- 修改工作项配置：操作人没有工作项配置权限。

### 10301：检查权限是否实际生效

依次核对接口权限是否已申请、包含该权限的插件版本是否已发布、目标空间是否已安装或更新到对应版本。原文还将空间 ID 不存在、操作人没有空间权限列为可能原因；权限发布正确并不能排除这两种情况。

### 20006：节点负责人绑定角色

创建子任务出现下列错误片段时，节点负责人已与角色绑定，应使用 `role_assignee` 指定负责人：

```text
target node with role owner config, not support specify 'assignee'
```

这与 `20047` 的互斥规则配套：不要同时传入 `role_assignee` 和 `assignee`。

### 30006：用户不存在或 token 范围不匹配

先核对请求头中的 `user_key` 及用户详情请求里的目标用户是否存在。使用虚拟 token 查询用户详情时，只能查询插件协作者相关信息。原文还明确说明：已共享到插件市场的 ISV 插件不支持调用「获取用户详情」API，应先确认插件类型。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/5aueo3jr
