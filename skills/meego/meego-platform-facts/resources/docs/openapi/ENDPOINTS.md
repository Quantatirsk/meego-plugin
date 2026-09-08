# 飞书项目 OpenAPI 接口速查

<!-- capability-metadata:start -->
## 平台能力标记

> 调用频次：无直接调用频次。本页用于平台说明、格式、目录或支持信息。

<!-- capability-metadata:end -->

来源链接：source_silent

[阅读入口](README.md) · [完整目录](INDEX.md)

## 接入与鉴权

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/authen/plugin_token` | [获取访问凭证](guides/获取访问凭证.md) |
| `POST` | `/open_api/authen/user_plugin_token` | [获取访问凭证](guides/获取访问凭证.md) |
| `POST` | `/open_api/authen/refresh_token` | [获取访问凭证](guides/获取访问凭证.md) |

## 事件与回调

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/intercept/project_intercept_config/create` | [按空间设置拦截事件配置](events/按空间设置拦截事件配置.md) |
| `GET` | `/open_api/intercept/project_intercept_config/list` | [查询拦截事件配置](events/查询拦截事件配置.md) |

## AI 应用

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/ai_node/edit` | [修改 AI 节点数据](ai/修改AI节点数据.md) |
| `POST` | `/open_api/ai_node/confirm` | [完成 AI 节点](ai/完成AI节点.md) |
| `POST` | `/open_api/ai_node/query` | [获取 AI 节点信息](ai/获取AI节点信息.md) |
| `PUT` | `/open_api/ai_application_field/update` | [更新 AI 字段](ai/更新AI字段.md) |
| `PUT` | `/open_api/ai_entity/update` | [更新 AI 操作的运行状态](ai/更新AI操作运行状态.md) |

## 用户

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/user/query` | [获取用户详情](api/获取用户详情.md) |
| `POST` | `/open_api/user/search` | [搜索租户内的用户列表](api/搜索租户内的用户列表.md) |
| `GET` | `/open_api/:project_key/teams/all` | [获取空间下团队人员](api/获取空间下团队人员.md) |
| `POST` | `/open_api/:project_key/user_groups/members/page` | [查询用户组成员](api/查询用户组成员.md) |
| `POST` | `/open_api/:project_key/user_group` | [创建自定义用户组](api/创建自定义用户组.md) |
| `PATCH` | `/open_api/:project_key/user_group/members` | [更新用户组成员](api/更新用户组成员.md) |

## 空间

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/projects` | [获取空间列表](api/获取空间列表.md) |
| `POST` | `/open_api/projects/detail` | [获取空间详情](api/获取空间详情.md) |

## 工作项

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/:project_key/work_item/filter` | [获取指定的工作项列表（单空间）](api/获取指定的工作项列表（单空间）.md) |
| `POST` | `/open_api/work_items/filter_across_project` | [获取指定的工作项列表（跨空间）](api/获取指定的工作项列表（跨空间）.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/search/params` | [获取指定的工作项列表（单空间-复杂传参）](api/获取指定的工作项列表（单空间-复杂传参）.md) |
| `POST` | `/open_api/compositive_search` | [获取指定的工作项列表（全局搜索）](api/获取指定的工作项列表（全局搜索）.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/search_by_relation` | [获取指定的关联工作项列表（单空间）](api/获取指定的关联工作项列表（单空间）.md) |
| `POST` | `/open_api/view_search/universal_search` | [获取指定的工作项列表（全量搜索）](api/获取指定的工作项列表（全量搜索）.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/query` | [获取工作项详情](api/获取工作项详情.md) |
| `GET` | `/open_api/:project_key/work_item/:work_item_type_key/meta` | [获取创建工作项元数据](api/获取创建工作项元数据.md) |
| `POST` | `/open_api/:project_key/work_item/create` | [创建工作项](api/创建工作项.md) |
| `PUT` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id` | [更新工作项](api/更新工作项.md) |
| `POST` | `/open_api/work_item/batch_update` | [批量更新工作项字段值](api/批量更新工作项字段值.md) |
| `GET` | `/open_api/task_result` | [获取批量更新处理进度](api/获取批量更新处理进度.md) |
| `POST` | `/open_api/work_item/deliverable/batch_query` | [交付物信息批量查询（WBS）](api/交付物信息批量查询（WBS）.md) |
| `DELETE` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id` | [删除工作项](api/删除工作项.md) |
| `PUT` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/abort` | [终止/恢复工作项](api/终止与恢复工作项.md) |
| `PUT` | `/open_api/work_item/freeze` | [冻结/解冻工作项](api/冻结与解冻工作项.md) |
| `POST` | `/open_api/op_record/work_item/list` | [获取工作项操作记录](api/获取工作项操作记录.md) |
| `POST` | `/open_api/work_item/man_hour/records` | [获取工作项的工时登记记录列表](api/获取工作项的工时登记记录列表.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/work_hour_record` | [新增工时登记记录](api/新增工时登记记录.md) |
| `PUT` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/work_hour_record` | [更新工时登记记录](api/更新工时登记记录.md) |
| `DELETE` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/work_hour_record` | [删除工时登记记录](api/删除工时登记记录.md) |
| `POST` | `/open_api/work_item/field_value/update_compound_field` | [按组更新复合字段值](api/按组更新复合字段值.md) |
| `POST` | `/open_api/work_item/resource/create_work_item` | [创建工作项资源库](api/创建工作项资源库.md) |
| `POST` | `/open_api/work_item/resource/search/params` | [获取指定的工作项资源库实例列表（复杂传参）](api/获取指定的工作项资源库实例列表（复杂传参）.md) |
| `POST` | `/open_api/work_item/resource/query` | [获取工作项资源实例详情](api/获取工作项资源实例详情.md) |
| `POST` | `/open_api/work_item/resource/update` | [更新工作项资源实例](api/更新工作项资源实例.md) |
| `POST` | `/open_api/work_item/resource/:project_key/:work_item_id/create_instance` | [通过资源创建实例](api/通过资源创建实例.md) |
| `POST` | `/open_api/work_item/field/options` | [获取工作项指定字段可选选项](api/获取工作项指定字段可选选项.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/query` | [获取工作流详情](api/获取工作流详情.md) |
| `GET` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/wbs_view` | [获取工作流详情（WBS）](api/获取工作流详情（WBS）.md) |
| `PUT` | `/open_api/:project_key/workflow/:work_item_type_key/:work_item_id/node/:node_id` | [更新节点/排期](api/更新节点与排期.md) |
| `POST` | `/open_api/:project_key/workflow/:work_item_type_key/:work_item_id/node/:node_id/operate` | [节点完成/回滚](api/节点完成与回滚.md) |
| `POST` | `/open_api/:project_key/workflow/:work_item_type_key/:work_item_id/node/state_change` | [状态流转](api/状态流转.md) |
| `POST` | `/open_api/work_item/transition_required_info/get` | [获取指定节点/状态流转所需必填信息](api/获取指定节点与状态流转所需必填信息.md) |
| `POST` | `/open_api/work_item/finished/batch_query` | [批量查询评审意见、评审结论](api/批量查询评审意见、评审结论.md) |
| `POST` | `/open_api/work_item/finished/update` | [修改评审结论和评审意见](api/修改评审结论和评审意见.md) |
| `POST` | `/open_api/work_item/finished/query_conclusion_option` | [评审结论标签值查询](api/评审结论标签值查询.md) |
| `POST` | `/open_api/work_item/subtask/search` | [获取指定的子任务列表（跨空间）](api/获取指定的子任务列表（跨空间）.md) |
| `GET` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/task` | [获取子任务详情](api/获取子任务详情.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/task` | [创建子任务](api/创建子任务.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/:node_id/task/:task_id` | [更新子任务](api/更新子任务.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/subtask/modify` | [子任务完成/回滚](api/子任务完成与回滚.md) |
| `DELETE` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/task/:task_id` | [删除子任务](api/删除子任务.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/file/upload` | [添加附件](api/添加附件.md) |
| `POST` | `/open_api/:project_key/file/upload` | [上传文件或富文本图片](api/上传文件或富文本图片.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/file/download` | [下载附件](api/下载附件.md) |
| `POST` | `/open_api/file/delete` | [删除附件](api/删除附件.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_id/bot_join_chat` | [拉机器人入群](api/拉机器人入群.md) |
| `POST` | `/open_api/:project_key/relation/rules` | [获取空间关联规则列表](api/获取空间关联规则列表.md) |
| `POST` | `/open_api/:project_key/relation/:work_item_type_key/:work_item_id/work_item_list` | [获取空间关联下的关联工作项实例列表](api/获取空间关联下的关联工作项实例列表.md) |
| `POST` | `/open_api/:project_key/relation/:work_item_type_key/:work_item_id/batch_bind` | [绑定空间关联的关联工作项实例](api/绑定空间关联的关联工作项实例.md) |
| `DELETE` | `/open_api/:project_key/relation/:work_item_type_key/:work_item_id` | [解绑空间关联的关联工作项实例](api/解绑空间关联的关联工作项实例.md) |

## 计划表

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/work_item/wbs_draft/create` | [创建计划表草稿](api/创建计划表草稿.md) |
| `POST` | `/open_api/work_item/wbs_draft_create/progress/query` | [创建计划表草稿进度查询](api/创建计划表草稿进度查询.md) |
| `POST` | `/open_api/work_item/wbs_draft/patch/update` | [更新计划表草稿](api/更新计划表草稿.md) |
| `POST` | `/open_api/work_item/wbs_draft_patch/progress/query` | [更新计划表草稿查询进度](api/更新计划表草稿查询进度.md) |
| `POST` | `/open_api/work_item/wbs_draft/publish` | [发布计划表草稿](api/发布计划表草稿.md) |
| `POST` | `/open_api/work_item/wbs_draft_publish/progress/query` | [计划表草稿发布进度查询](api/计划表草稿发布进度查询.md) |
| `POST` | `/open_api/work_item/wbs_draft/reset` | [重置计划表草稿](api/重置计划表草稿.md) |
| `POST` | `/open_api/work_item/wbs_draft_reset/progress/query` | [重置计划表草稿进度查询](api/重置计划表草稿进度查询.md) |
| `POST` | `/open_api/work_item/wbs_draft/structure/query` | [查询全量计划表草稿骨架](api/查询全量计划表草稿骨架.md) |
| `POST` | `/open_api/work_item/wbs_draft/detail/query` | [查询计划表草稿数据行详细信息](api/查询计划表草稿数据行详细信息.md) |
| `POST` | `/open_api/work_item/wbs_view/structure/query` | [查询全量计划表骨架](api/查询全量计划表骨架.md) |
| `POST` | `/open_api/work_item/wbs_view/detail/query` | [查询计划表行详细信息](api/查询计划表行详细信息.md) |
| `POST` | `/open_api/work_item/wbs_instance/expand/query` | [查询计划表扩展信息](api/查询计划表扩展信息.md) |
| `POST` | `/open_api/work_item/wbs_draft/task_conf/query` | [查询计划表草稿行配置信息](api/查询计划表草稿行配置信息.md) |

## 文件

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/:project_key/file/stream/resource/:resource_type/upload_form` | [上传文件](api/上传文件.md) |
| `GET` | `/open_api/:project_key/file/stream/download/:file_token` | [下载文件](api/下载文件.md) |
| `POST` | `/open_api/:project_key/file/resource/:resource_type/upload/preprocess` | [分片初始化](api/分片初始化.md) |
| `POST` | `/open_api/:project_key/file/stream/upload/multipart/:resource_id/:part_number` | [上传分片](api/上传分片.md) |
| `POST` | `/open_api/:project_key/file/upload/multipart/finish/:resource_id` | [完成分片上传](api/完成分片上传.md) |
| `POST` | `/open_api/:project_key/file/upload/multipart/abort/:resource_id` | [终止分片上传](api/终止分片上传.md) |

## 配置

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `GET` | `/open_api/:project_key/work_item/all-types` | [获取空间下工作项类型](api/获取空间下工作项类型.md) |
| `GET` | `/open_api/:project_key/business/all` | [获取空间下业务线详情](api/获取空间下业务线详情.md) |
| `GET` | `/open_api/:project_key/work_item/type/:work_item_type_key` | [获取工作项基础信息配置](api/获取工作项基础信息配置.md) |
| `PUT` | `/open_api/:project_key/work_item/type/:work_item_type_key` | [更新工作项基础信息配置](api/更新工作项基础信息配置.md) |
| `POST` | `/open_api/:project_key/field/all` | [获取字段信息](api/获取字段信息.md) |
| `POST` | `/open_api/:project_key/field/:work_item_type_key/create` | [创建自定义字段](api/创建自定义字段.md) |
| `PUT` | `/open_api/:project_key/field/:work_item_type_key` | [更新自定义字段](api/更新自定义字段.md) |
| `GET` | `/open_api/:project_key/work_item/relation` | [获取工作项关系列表](api/获取工作项关系列表.md) |
| `POST` | `/open_api/work_item/relation/create` | [新增工作项关系](api/新增工作项关系.md) |
| `POST` | `/open_api/work_item/relation/update` | [更新工作项关系](api/更新工作项关系.md) |
| `DELETE` | `/open_api/work_item/relation/delete` | [删除工作项关系](api/删除工作项关系.md) |
| `GET` | `/open_api/:project_key/template_list/:work_item_type_key` | [获取工作项下的流程模板列表](api/获取工作项下的流程模板列表.md) |
| `GET` | `/open_api/:project_key/template_detail/:template_id` | [获取流程模板配置详情](api/获取流程模板配置详情.md) |
| `POST` | `/open_api/template/v2/create_template` | [新增流程模板](api/新增流程模板.md) |
| `PUT` | `/open_api/template/v2/update_template` | [更新流程模板](api/更新流程模板.md) |
| `DELETE` | `/open_api/template/v2/delete_template/:project_key/:template_id` | [删除流程模板](api/删除流程模板.md) |
| `POST` | `/open_api/:project_key/flow_roles/:work_item_type_key/create_role` | [创建流程角色配置](api/创建流程角色配置.md) |
| `POST` | `/open_api/:project_key/flow_roles/:work_item_type_key/update_role` | [更新流程角色配置](api/更新流程角色配置.md) |
| `POST` | `/open_api/:project_key/flow_roles/:work_item_type_key/delete_role` | [删除流程角色配置](api/删除流程角色配置.md) |
| `GET` | `/open_api/:project_key/flow_roles/:work_item_type_key` | [获取流程角色配置详情](api/获取流程角色配置详情.md) |

## 评论

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/comment/query` | [查询评论](api/查询评论.md) |
| `POST` | `/open_api/comment/create` | [添加评论](api/添加评论.md) |
| `POST` | `/open_api/comment/update` | [更新评论](api/更新评论.md) |
| `POST` | `/open_api/comment/delete` | [删除评论](api/删除评论.md) |
| `GET` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comments` | [查询评论（不再维护）](api/查询评论（不再维护）.md) |
| `POST` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comment/create` | [添加评论（不再维护）](api/添加评论（不再维护）.md) |
| `PUT` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comment/:comment_id` | [更新评论（不再维护）](api/更新评论（不再维护）.md) |
| `DELETE` | `/open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comment/:comment_id` | [删除评论（不再维护）](api/删除评论（不再维护）.md) |

## 视图&度量

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `POST` | `/open_api/:project_key/view_conf/list` | [获取视图列表及配置信息](api/获取视图列表及配置信息.md) |
| `GET` | `/open_api/:project_key/fix_view/:view_id` | [获取视图下工作项列表（非全景视图）](api/获取视图下工作项列表（非全景视图）.md) |
| `POST` | `/open_api/:project_key/view/:view_id` | [获取视图下工作项列表（全景视图）](api/获取视图下工作项列表（全景视图）.md) |
| `POST` | `/open_api/:project_key/:work_item_type_key/fix_view` | [创建固定视图](api/创建固定视图.md) |
| `POST` | `/open_api/:project_key/:work_item_type_key/fix_view/:view_id` | [更新固定视图](api/更新固定视图.md) |
| `POST` | `/open_api/view/v1/create_condition_view` | [创建条件视图](api/创建条件视图.md) |
| `POST` | `/open_api/view/v1/update_condition_view` | [更新条件视图](api/更新条件视图.md) |
| `DELETE` | `/open_api/:project_key/fix_view/:view_id` | [删除视图](api/删除视图.md) |
| `GET` | `/open_api/:project_key/measure/:chart_id` | [获取度量图表明细数据](api/获取度量图表明细数据.md) |
| `POST` | `/open_api/measure/charts` | [通过视图ID查询所有图表](api/通过视图ID查询所有图表.md) |

## 租户

| 方法 | 路径 | 文档 |
| --- | --- | --- |
| `GET` | `/open_api/commercial/tenant` | [获取租户信息](api/获取租户信息.md) |
| `POST` | `/open_api/tenant/projects/install/list` | [获取租户安装空间列表](api/获取租户安装空间列表.md) |
| `GET` | `/open_api/commercial/product/tenant_entitlement` | [查询买方租户权益信息](api/查询买方租户权益信息.md) |

更新时间：2026-09-07
官方 URL：source_silent
