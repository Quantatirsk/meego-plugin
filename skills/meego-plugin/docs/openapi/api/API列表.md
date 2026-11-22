# API 列表

按业务对象查找接口：用户与空间、工作项及流程、文件与附件、配置、视图、评论、度量和计划表。每个接口名称链接到完整参数定义。

本页保留官方《API 列表》的分组范围，官方目录并未同步列出全部独立文档。需要检索本地已采集的全部接口时，请使用[完整目录](../INDEX.md)或[请求方法与路径索引](../ENDPOINTS.md)。

## 如何选择接口

- 查工作项：已有实例 ID 时使用详情查询；按字段条件选用单空间、跨空间或复杂条件搜索；只有关联实例入口时使用关联工作项查询。
- 改工作项：创建前获取元数据，字段值格式参照对应接口；节点流用节点操作接口，状态流用状态流转接口。
- 处理文件：通用文件上传与工作项附件字段操作属于不同接口组，不能仅凭“上传”名称互换。
- 改计划表：创建、更新、发布和重置草稿均有配套进度查询，提交操作之后还需读取处理结果。
- 评论：优先查阅当前维护的 `/open_api/comment/*` 接口。标注“不再维护”的旧接口保留供识别已有调用。

<a id="129d17e2"></a>

## 用户

| 使用场景         | API名称                                                                                 | 解释                                 |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| 获取用户信息详情 | `POST /open_api/user/query`<br>[获取用户详情](获取用户详情.md)                              | 获取指定用户的详细信息               |
|                  | `POST /open_api/user/search`<br>[搜索租户内的用户列表](搜索租户内的用户列表.md)                     | 模糊搜索租户内的用户并返回其详细信息 |
|                  | `POST /open_api/:project_key/user_group`<br>[创建自定义用户组](创建自定义用户组.md)             | 创建自定义用户组                     |
|                  | `PATCH /open_api/:project_key/user_group/members`<br>[更新用户组成员](更新用户组成员.md)      | 更新用户组成员                       |
|                  | `POST /open_api/:project_key/user_groups/members/page`<br>[查询用户组成员](查询用户组成员.md) | 查询用户组成员                       |

<a id="7306d4c3"></a>

## 空间

| API名称                                                         | 解释                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| `POST /open_api/projects`<br>[获取空间列表](获取空间列表.md)        | 获取指定用户有权限访问空间和插件安装的空间的交集             |
| `POST /open_api/projects/detail`<br>[获取空间详情](获取空间详情.md) | 获取查询空间和插件安装空间交集的空间详情信息，包括管理员信息 |

<a id="f8b0f28c"></a>

## 工作项

<a id="dda824e4"></a>

### 工作项实例搜索

| API名称                                                                                                                                           | 解释                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `POST /open_api/:project_key/work_item/filter`<br>[获取指定的工作项列表（单空间）](获取指定的工作项列表（单空间）.md)                                                   | 在指定一个空间，搜索符合请求参数中传入条件的工作项实例列表 |
| `POST /open_api/work_items/filter_across_project`<br>[获取指定的工作项列表（跨空间）](获取指定的工作项列表（跨空间）.md)                                                | 跨多个空间，搜索符合请求参数中传入条件的工作项实例列表     |
| `POST /open_api/:project_key/work_item/:work_item_type_key/search/params`<br>[获取指定的工作项列表（单空间-复杂传参）](获取指定的工作项列表（单空间-复杂传参）.md)               | 在指定一个空间，搜索符合“复杂筛选条件”的工作项实例列表     |
| `POST /open_api/compositive_search`<br>[获取指定的工作项列表（全局搜索）](获取指定的工作项列表（全局搜索）.md)                                                            | 获取跨空间和工作项类型搜索符合条件的工作项实例列表         |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/search_by_relation`<br>[获取指定的关联工作项列表（单空间）](获取指定的关联工作项列表（单空间）.md) | 获取与指定工作项实例存在工作项关联的工作项实例列表         |

<a id="c5cb8001"></a>

### 工作项实例读写

| API名称                                                                                                                         | 解释                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /open_api/:project_key/work_item/:work_item_type_key/query`<br>[获取工作项详情](获取工作项详情.md)                              | 获取指定空间和工作项类型下的一个工作项实例的详细信息                                                                                                                                 |
| `GET /open_api/:project_key/work_item/:work_item_type_key/meta`<br>[获取创建工作项元数据](获取创建工作项元数据.md)                          | 获取指定工作项类型的“元数据”，它是创建一个工作项实例的最小数据单元                                                                                                                   |
| `POST /open_api/:project_key/work_item/create`<br>[创建工作项](创建工作项.md)                                                     | 在指定空间和工作项类型下新增一个“工作项实例”，实例可以是一个需求或者缺陷等。 [详细说明](#field-note-1)                                                                               |
| `PUT /open_api/:project_key/work_item/:work_item_type_key/:work_item_id`<br>[更新工作项](更新工作项.md)                           | 修改指定空间和工作项类型下的一个“工作项实例”，可修改字段可以从[获取创建工作项元数据](获取创建工作项元数据.md) 接口中获取                                                                         |
| `DELETE /open_api/:project_key/work_item/:work_item_type_key/:work_item_id`<br>[删除工作项](删除工作项.md)                        | 删除指定空间和工作项类型下的一个“工作项实例”                                                                                                                                         |
| `PUT /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/abort`<br>[终止/恢复工作项](终止与恢复工作项.md)                | 用于终止或者恢复指定空间和工作项类型下的一个“工作项实例”                                                                                                                             |
| `POST /open_api/op_record/work_item/list`<br>[获取工作项操作记录](获取工作项操作记录.md)                                                  | 用于获取指定空间下的多个工作项实例的操作记录，包括一个工作项实例（如一个需求）的操作记录                                                                                             |
| `POST /open_api/work_item/finished/batch_query`<br>[批量查询评审意见、评审结论](批量查询评审意见、评审结论.md)                                    | 用于批量查询节点的评审意见和结论                                                                                                                                                     |
| `POST /open_api/work_item/finished/update`<br>[修改评审结论和评审意见](修改评审结论和评审意见.md)                                             | 用于更新节点评审意见和结论，或执行置空操作                                                                                                                                           |
| `POST /open_api/work_item/finished/query_conclusion_option`<br>[评审结论标签值查询](评审结论标签值查询.md)                                | 用于查询节点下配置的评审结论标签                                                                                                                                                     |
| `POST /open_api/work_item/man_hour/records`<br>[获取工作项的工时登记记录列表](获取工作项的工时登记记录列表.md)                                      | 仅在安装使用官方插件-[工时登记](https://bytedance.larkoffice.com/docx/TecJdQQl1osoPWxDjSwchV7knWf)时有效，用于获取指定空间和工作项类型下的指定工作项实例的工时记录详细信息           |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/work_hour_record`<br>[新增工时登记记录](新增工时登记记录.md)   | 仅在安装使用官方插件-[工时登记](https://bytedance.larkoffice.com/docx/TecJdQQl1osoPWxDjSwchV7knWf)时有效，用于指定空间和工作项类型下的指定工作项实例下添加工时记录信息               |
| `PUT /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/work_hour_record`<br>[更新工时登记记录](更新工时登记记录.md)    | 仅在安装使用官方插件-[工时登记](https://bytedance.larkoffice.com/docx/TecJdQQl1osoPWxDjSwchV7knWf)时有效，用于更新指定空间和工作项类型下的指定工作项实例的某个操作者的多个工时记录   |
| `DELETE /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/work_hour_record`<br>[删除工时登记记录](删除工时登记记录.md) | 仅在安装并使用官方插件-[工时登记](https://bytedance.larkoffice.com/docx/TecJdQQl1osoPWxDjSwchV7knWf)时有效，用于删除指定空间和工作项类型下的指定工作项实例的某个操作者的多个工时记录 |
| `PUT /open_api/work_item/freeze`<br>[冻结/解冻工作项](冻结与解冻工作项.md)                                                              | 接口用于冻结/解冻工作项实例                                                                                                                                                          |
| `POST /open_api/work_item/deliverable/batch_query`<br>[交付物信息批量查询（WBS）](交付物信息批量查询（WBS）.md)                                  | 用于查询交付物详情信息，目前支持查询工作项交付物（节点交付物待建设）                                                                                                                 |
| `POST /open_api/work_item/field/options`<br>[获取工作项指定字段可选选项](获取工作项指定字段可选选项.md)                                           | 用于获取当前用户在指定实例的指定字段下的可选选项，不返回已禁用或不满足选项可见性的选项。                                                                                             |

<a id="field-note-1"></a>

**POST /open_api/:project_key/work_item/create`<br>[创建工作项](创建工作项.md)**

在指定空间和工作项类型下新增一个“工作项实例”，实例可以是一个需求或者缺陷等。

可初始化赋值的字段，可以从[获取创建工作项元数据](获取创建工作项元数据.md) 接口中获取

<a id="4885319a"></a>

### 流程与节点

| API名称                                                                                                                        | 解释                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/query`<br>[获取工作流详情](获取工作流详情.md)      | 用于获取指定空间和工作项类型下的一个工作项实例的工作流信息，包括节点的状态、负责人、估分以及表单、子任务等。对应的平台功能介绍，如节点流类型以需求实例举例，可参考[流程图](https://project.feishu.cn/1ykiuvvj/69kaicie#%E6%B5%81%E7%A8%8B%E5%9B%BE)，如状态流类型以缺陷举例，可参考[新建缺陷](https://project.feishu.cn/1ykiuvvj/5ci97x50) |
| `GET /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/wbs_view`<br>[获取工作流详情（WBS，不再维护）](获取工作流详情（WBS）.md)      | 用于获取行业专版中一个节点流工作项实例的WBS工作流信息                                                                                                                                                                                                                                                                                      |
| `PUT /open_api/:project_key/workflow/:work_item_type_key/:work_item_id/node/:node_id`<br>[更新节点/排期](更新节点与排期.md)          | 用于更新一个工作项实例的指定节点信息（节点流），包括节点负责人、排期和表单信息等                                                                                                                                                                                                                                                           |
| `POST /open_api/:project_key/workflow/:work_item_type_key/:work_item_id/node/:node_id/operate`<br>[节点完成/回滚](节点完成与回滚.md) | 用于完成或者回滚一个工作项实例的指定节点（节点流），同时更新节点信息，包括节点负责人、排期和表单信息等                                                                                                                                                                                                                                     |
| `POST /open_api/:project_key/workflow/:work_item_type_key/:work_item_id/node/state_change`<br>[状态流转](状态流转.md)          | 用于流转一个工作项实例到指定状态（状态流），同时更新节点信息，包括人员角色和表单信息等                                                                                                                                                                                                                                                     |
| `POST /open_api/work_item/transition_required_info/get`<br>[获取指定节点/状态流转所需必填信息](获取指定节点与状态流转所需必填信息.md)                    | 用于获取一个工作项实例指定节点流转所需的必填信息，返回包括必填表单项、必填节点字段、必填子任务、必填交付物在内的必填信息                                                                                                                                                                                                                   |

<a id="6e38ea57"></a>

### 子任务

| API名称                                                                                                                                  | 解释                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /open_api/work_item/subtask/search`<br>[获取指定的子任务列表（跨空间）](获取指定的子任务列表（跨空间）.md)                                               | 用于跨空间搜索符合传入条件的子任务，对应平台的功能，如实例侧操作可参考[任务管理](https://project.feishu.cn/1ykiuvvj/40gyakm8)，如流程节点上默认的子任务配置可参考[完成任务](https://project.feishu.cn/1ykiuvvj/3bv61iew#%E5%AE%8C%E6%88%90%E4%BB%BB%E5%8A%A1) |
| `GET /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/task?node_id=:node_id`<br>[获取子任务详情](获取子任务详情.md) | 获取指定工作项实例上的子任务详细信息                                                                                                                                                                                                                          |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/task`<br>[创建子任务](创建子任务.md)                     | 在一个工作项实例的指定节点上创建一个子任务                                                                                                                                                                                                                    |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/workflow/:node_id/task/:task_id`<br>[更新子任务](更新子任务.md)   | 更新工作项实例指定节点上的一个子任务详细信息                                                                                                                                                                                                                  |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/subtask/modify`<br>[子任务完成/回滚](子任务完成与回滚.md)               | 用于完成或者回滚工作项实例指定节点上的一个子任务                                                                                                                                                                                                              |
| `DELETE /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/task/:task_id`<br>[删除子任务](删除子任务.md)                   | 用于删除指定工作项实例中的一个子任务                                                                                                                                                                                                                          |

<a id="d754e01f"></a>

### 文件

| API名称                                                                                                         | 解释                                                 |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `POST /open_api/:project_key/file/stream/resource/:resource_type/upload_form`<br>[上传文件](上传文件.md)        | 用于上传一个小于20M的文件，如果超过20M请使用分片接口 |
| `GET /open_api/:project_key/file/stream/download/:file_token`<br>[下载文件](下载文件.md)                        | 该接口用于下载一个附件                               |
| `POST /open_api/:project_key/file/resource/:resource_type/upload/preprocess`<br>[分片初始化](分片初始化.md)       | 该接口用于初始化一个分片上传任务，文件需要大于5M     |
| `POST /open_api/:project_key/file/stream/upload/multipart/:resource_id/:part_number`<br>[上传分片](上传分片.md) | 该接口用于上传一个分片                               |
| `POST /open_api/:project_key/file/upload/multipart/finish/:resource_id`<br>[完成分片上传](完成分片上传.md)          | 该接口用于完成一个分片上传任务                       |
| `POST /open_api/:project_key/file/upload/multipart/abort/:resource_id`<br>[终止分片上传](终止分片上传.md)           | 该接口用于终止一个分片上传任务                       |

<a id="7d6e4e7d"></a>

### 附件

| API名称                                                                                                            | 解释                                                                 |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/file/upload`<br>[添加附件](添加附件.md)   | 用于在指定工作项的一个“附件类型”字段中添加附件                       |
| `POST /open_api/:project_key/file/upload`<br>[上传文件或富文本图片](上传文件或富文本图片.md)                                   | 通用的文件上传接口，会返回上传后的资源路径，主要用于富文本中上传图片 |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/file/download`<br>[下载附件](下载附件.md) | 用于下载一个工作项下的指定附件                                       |
| `POST /open_api/file/delete`<br>[删除附件](删除附件.md)                                                            | 用于在指定工作项的一个“附件类型”字段中删除附件                       |

<a id="8d67e1dc"></a>

### 空间关联

| API名称                                                                                                                                      | 解释                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `POST /open_api/:project_key/relation/rules`<br>[获取空间关联规则列表](获取空间关联规则列表.md)                                                          | 获取指定空间下配置的空间关联规则列表                       |
| `POST /open_api/:project_key/relation/:work_item_type_key/:work_item_id/work_item_list`<br>[获取空间关联下的关联工作项实例列表](获取空间关联下的关联工作项实例列表.md) | 获取与指定工作项实例有空间关联的工作项实例列表             |
| `POST /open_api/:project_key/relation/:work_item_type_key/:work_item_id/batch_bind`<br>[绑定空间关联的关联工作项实例](绑定空间关联的关联工作项实例.md)           | 将指定工作项实例和传入的工作项实例列表建立空间关联绑定关系 |
| `DELETE /open_api/:project_key/relation/:work_item_type_key/:work_item_id`<br>[解绑空间关联的关联工作项实例](解绑空间关联的关联工作项实例.md)                    | 将指定工作项实例和传入的工作项实例解除空间关联绑定关系     |

<a id="b3573e0d"></a>

### 群组

| API名称                                                                                            | 解释                                   |
| -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `POST /open_api/:project_key/work_item/:work_item_id/bot_join_chat`<br>[拉机器人入群](拉机器人入群.md) | 用于将指定的飞书机器人拉入工作项关联群 |

<a id="3164e511"></a>

## 配置

<a id="0f548a1c"></a>

### 空间配置

| API名称                                                                                 | 解释                                             |
| --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `GET /open_api/:project_key/business/all`<br>[获取空间下业务线详情](获取空间下业务线详情.md)        | 获取查询空间的业务线信息                         |
| `GET /open_api/:project_key/work_item/all-types`<br>[获取空间下工作项类型](获取空间下工作项类型.md) | 获取空间下所有的工作项类型                       |
| `GET /open_api/:project_key/teams/all`<br>[获取空间下团队人员](获取空间下团队人员.md)             | 获取团队详情信息，包括团队人员列表、管理员列表等 |

<a id="c25a95f3"></a>

### 工作项配置

| API名称                                                                                                  | 解释                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /open_api/:project_key/work_item/type/:work_item_type_key`<br>[获取工作项基础信息配置](获取工作项基础信息配置.md) | 获取指定工作项类型的基础信息配置                                                                                                                       |
| `PUT /open_api/:project_key/work_item/type/:work_item_type_key`<br>[更新工作项基础信息配置](更新工作项基础信息配置.md) | 更新指定工作项类型的基础信息配置                                                                                                                       |
| `POST /open_api/:project_key/field/all`<br>[获取字段信息](获取字段信息.md)                                   | 获取指定空间或一个工作项类型下所有字段的基础信息，对应的平台功能介绍详见[字段配置](https://project.feishu.cn/1ykiuvvj/17mi85qv)                        |
| `POST /open_api/:project_key/field/:work_item_type_key/create`<br>[创建自定义字段](创建自定义字段.md)          | 在指定工作项类型下创建一个新的自定义字段                                                                                                               |
| `PUT /open_api/:project_key/field/:work_item_type_key`<br>[更新自定义字段](更新自定义字段.md)                  | 更新指定自定义字段的配置信息                                                                                                                           |
| `GET /open_api/:project_key/work_item/relation`<br>[获取工作项关系列表](获取工作项关系列表.md)                     | 获取指定空间下的工作项关联关系列表，对应的平台功能介绍详见[关系管理](https://project.feishu.cn/1ykiuvvj/se3xal6e#%E5%85%B3%E7%B3%BB%E7%AE%A1%E7%90%86) |
| `POST /open_api/work_item/relation/create`<br>[新增工作项关系](新增工作项关系.md)                              | 在指定空间下新增一个工作项关联关系                                                                                                                     |
| `POST /open_api/work_item/relation/update`<br>[更新工作项关系](更新工作项关系.md)                              | 更新指定工作项关联关系的配置信息                                                                                                                       |
| `DELETE /open_api/work_item/relation/delete`<br>[删除工作项关系](删除工作项关系.md)                            | 删除指定空间下的工作项关联关系                                                                                                                         |

<a id="edacda2f"></a>

### 流程模板配置

| API名称                                                                                                     | 解释                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /open_api/:project_key/template_list/:work_item_type_key`<br>[获取工作项下的流程模板列表](获取工作项下的流程模板列表.md) | 用于获取指定工作项类型下所有“流程模板”列表，对应的平台功能介绍详见[节点流程规则配置](https://project.feishu.cn/1ykiuvvj/3bv61iew)或[状态流程配置](https://project.feishu.cn/1ykiuvvj/2lgf2cd8) |
| `GET /open_api/:project_key/template_detail/:template_id`<br>[获取流程模板配置详情](获取流程模板配置详情.md)            | 用于获取指定流程模板的配置信息详情，包括节点信息配置和节点流转配置，节点事件配置暂不支持                                                                                                       |
| `POST /open_api/template/v2/create_template`<br>[新增流程模板](新增流程模板.md)                                 | 该接口用于在指定工作项类型下创建一个新的“流程模板”                                                                                                                                             |
| `PUT /open_api/template/v2/update_template`<br>[更新流程模板](更新流程模板.md)                                  | 用于更新指定流程模板的配置信息                                                                                                                                                                 |
| `DELETE /open_api/template/v2/delete_template/:project_key/:template_id`<br>[删除流程模板](删除流程模板.md)     | 用于删除指定的流程模板                                                                                                                                                                         |

<a id="5ff4c97d"></a>

### 流程角色配置

| API名称                                                                                            | 解释                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `GET /open_api/:project_key/flow_roles/:work_item_type_key`<br>[获取流程角色配置详情](获取流程角色配置详情.md) | 用于获取指定工作项类型下所有“角色与人员”的相关配置信息 |

<a id="c6cfd80d"></a>

## 视图

| API名称                                                                                                                                     | 解释                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `POST /open_api/:project_key/view_conf/list`<br>[获取视图列表及配置信息](获取视图列表及配置信息.md)                                                       | 用于在指定空间，搜索符合请求参数中传入条件的视图列表及相关配置信息 [详细说明](#field-note-2) |
| `GET /open_api/:project_key/fix_view/:view_id?page_size=:page_size&page_num=:page_num`<br>[获取视图下工作项列表（非全景视图）](获取视图下工作项列表（非全景视图）.md) | 用于获取指定视图中的所有工作项实例列表                                                       |
| `POST /open_api/:project_key/view/:view_id`<br>[获取视图下工作项列表（全景视图）](获取视图下工作项列表（全景视图）.md)                                              | 该接口用于获取指定全景视图中的所有工作项实例列表和详情信息                                   |
| `POST /open_api/:project_key/:work_item_type_key/fix_view`<br>[创建固定视图](创建固定视图.md)                                                   | 该接口用于在指定空间和工作项类型下新增一个固定视图                                           |
| `POST /open_api/:project_key/:work_item_type_key/fix_view/:view_id`<br>[更新固定视图](更新固定视图.md)                                          | 该接口用于对一个指定固定视图增/删其中的工作项实例                                            |
| `POST /open_api/view/v1/create_condition_view`<br>[创建条件视图](创建条件视图.md)                                                               | 用于在指定空间和工作项类型下新增一个条件视图                                                 |
| `POST /open_api/view/v1/update_condition_view`<br>[更新条件视图](更新条件视图.md)                                                               | 用于对一个指定条件视图更新其筛选条件和协作者信息                                             |
| `DELETE /open_api/:project_key/fix_view/:view_id`<br>[删除视图](删除视图.md)                                                                | 用于删除指定空间的一个视图，支持条件、固定以及全景视图                                       |

<a id="field-note-2"></a>

**POST /open_api/:project_key/view_conf/list`<br>[获取视图列表及配置信息](获取视图列表及配置信息.md)**

用于在指定空间，搜索符合请求参数中传入条件的视图列表及相关配置信息

对应的平台功能介绍详见[视图介绍](https://project.feishu.cn/1ykiuvvj/4w2iz8d8)

<a id="17a85660"></a>

## 评论

| API名称                                                                                                                                | 解释                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `POST /open_api/comment/query`<br>[查询评论](查询评论.md)                                                                              | 用于获取指定工作项下的所有评论信息，按照创建时间升序返回                                                       |
| `POST /open_api/comment/create`<br>[添加评论](添加评论.md)                                                                             | 用于在指定工作项下添加一条评论，添加的评论内容会出现在工作项详情页——评论/备注tab页中，并会显示该评论由插件添加 |
| `POST /open_api/comment/update`<br>[更新评论](更新评论.md)                                                                             | 用于对指定评论更新其内容，被更新的评论会显示该评论由插件添加                                                   |
| `POST /open_api/comment/delete`<br>[删除评论](删除评论.md)                                                                             | 用于删除工作项下一条指定的评论信息                                                                             |
| `POST /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comment/create`<br>[添加评论（不再维护）](添加评论（不再维护）.md)        | 用于在指定工作项下添加一条评论，添加的评论内容会出现在工作项详情页——评论/备注tab页中，并会显示该评论由插件添加 |
| `GET /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comments`<br>[查询评论（不再维护）](查询评论（不再维护）.md)               | 用于获取指定工作项下的所有评论信息                                                                             |
| `PUT /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comment/:comment_id`<br>[更新评论（不再维护）](更新评论（不再维护）.md)    | 用于对指定评论更新其内容，被更新的评论会显示该评论由插件添加                                                   |
| `DELETE /open_api/:project_key/work_item/:work_item_type_key/:work_item_id/comment/:comment_id`<br>[删除评论（不再维护）](删除评论（不再维护）.md) | 用于删除工作项下一条指定的评论信息                                                                             |

<a id="1fbf5edf"></a>

## 度量

| API名称                                                                               | 解释                               |
| ------------------------------------------------------------------------------------- | ---------------------------------- |
| `GET /open_api/:project_key/measure/:chart_id`<br>[获取度量图表明细数据](获取度量图表明细数据.md) | 用于获取一个指定度量图表的明细数据 |

<a id="e57e1295"></a>

## 计划表

官方总表中的创建和重置草稿进度路径有 `quer` 拼写差异。本表采用各接口独立文档的 `/query` 路径。

| API名称                                                                                              | 解释                             |
| ---------------------------------------------------------------------------------------------------- | -------------------------------- |
| `POST /open_api/work_item/wbs_draft/create`<br>[创建计划表草稿](创建计划表草稿.md)                         | 用于在工作项实例下创建计划表草稿 |
| `POST /open_api/work_item/wbs_draft_create/progress/query`<br>[创建计划表草稿进度查询](创建计划表草稿进度查询.md)  | 查询创建草稿的异步处理进度       |
| `POST /open_api/work_item/wbs_draft/patch/update`<br>[更新计划表草稿](更新计划表草稿.md)                   | 用于更新计划表草稿               |
| `POST /open_api/work_item/wbs_draft_patch/progress/query`<br>[更新计划表草稿查询进度](更新计划表草稿查询进度.md)   | 用于更新计划表草稿查询进度       |
| `POST /open_api/work_item/wbs_draft/publish`<br>[发布计划表草稿](发布计划表草稿.md)                        | 用于发布计划表草稿               |
| `POST /open_api/work_item/wbs_draft_publish/progress/query`<br>[计划表草稿发布进度查询](计划表草稿发布进度查询.md) | 用于计划表草稿发布进度查询       |
| `POST /open_api/work_item/wbs_draft/reset`<br>[重置计划表草稿](重置计划表草稿.md)                          | 用于重置计划表草稿               |
| `POST /open_api/work_item/wbs_draft_reset/progress/query`<br>[重置计划表草稿进度查询](重置计划表草稿进度查询.md)   | 查询重置草稿的异步处理进度       |
| `POST /open_api/work_item/wbs_draft/structure/query`<br>[查询全量计划表草稿骨架](查询全量计划表草稿骨架.md)        | 用于查询全量计划表草稿骨架       |
| `POST /open_api/work_item/wbs_draft/detail/query`<br>[查询计划表草稿数据行详细信息](查询计划表草稿数据行详细信息.md)     | 用于查询计划表草稿数据行详细信息 |
| `POST /open_api/work_item/wbs_view/structure/query`<br>[查询全量计划表骨架](查询全量计划表骨架.md)             | 用于查询全量计划表骨架           |
| `POST /open_api/work_item/wbs_view/detail/query`<br>[查询计划表行详细信息](查询计划表行详细信息.md)              | 用于查询计划表行详细信息         |
| `POST /open_api/work_item/wbs_instance/expand/query`<br>[查询计划表扩展信息](查询计划表扩展信息.md)            | 用于查询计划表扩展信息           |
| `POST /open_api/work_item/wbs_draft/task_conf/query`<br>[查询计划表草稿行配置信息](查询计划表草稿行配置信息.md)      | 用于查询计划表草稿行配置信息     |
| `POST /open_api/work_item/wbs_view/column_config/query`<br>[查询计划表配置列](查询计划表配置列.md) | 读取预置列与自定义聚合列 |
| `GET /open_api/:project_key/work_item_baseline/:work_item_id/list`<br>[获取计划表基线列表](获取计划表基线列表.md) | 查询已完成的历史基线 |
| `POST /open_api/:project_key/work_item_baseline/:work_item_id/query`<br>[获取基线详情](获取基线详情.md) | 读取历史基线行和排期字段 |
| `POST /open_api/work_item/wbs_ref/source/list`<br>[查询实例被引用的父行信息](查询实例被引用的父行信息.md) | 从源工作项反查引用方计划表和挂载父行 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/wlcwhshe
