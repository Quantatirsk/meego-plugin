# 能力覆盖状态

生成日期：2026-09-07

## 汇总

- 能力总数：237
- 已验证：28
- 官方未定义：0
- 待运行时验证：205
- 已废弃：4

## 能力目录

| ID | 类型 | 使用频次 | 状态 | 文档 |
| --- | --- | --- | --- | --- |
| ai.field.event | ai_capability | low | needs_runtime_validation | [AI 字段事件](../docs/README.md) |
| ai.node.data | ai_capability | low | needs_runtime_validation | [AI 节点数据结构](../docs/README.md) |
| ai.node.event | ai_capability | low | needs_runtime_validation | [AI 节点事件](../docs/README.md) |
| ai.node.link-options | ai_capability | low | needs_runtime_validation | [AI 节点链接选项](../docs/README.md) |
| ai.node.permissions | ai_capability | low | needs_runtime_validation | [AI 节点权限](../docs/README.md) |
| ai.operation.event | ai_capability | low | needs_runtime_validation | [AI 操作事件](../docs/README.md) |
| ai.operation.link-options | ai_capability | low | needs_runtime_validation | [AI 操作链接选项](../docs/README.md) |
| ai.operation.permissions | ai_capability | low | needs_runtime_validation | [AI 操作权限](../docs/README.md) |
| event-contract.control-create-callback | event_contract | medium | needs_runtime_validation | [Control 新建成功回调](../docs/events/control-create-callback.md) |
| event-contract.intercept | event_contract | medium | needs_runtime_validation | [拦截事件](../docs/events/intercept-response.md) |
| event-contract.listen | event_contract | medium | needs_runtime_validation | [监听事件](../docs/events/listener-delivery.md) |
| event-contract.plugin-lifecycle | event_contract | low | needs_runtime_validation | [插件装卸监听](../docs/README.md) |
| event-contract.webhook-signature | event_contract | medium | needs_runtime_validation | [Webhook 验签](../docs/events/webhook-signature.md) |
| jssdk.action-sheet.show | jssdk_api | low | needs_runtime_validation | [actionSheet.show](../docs/README.md) |
| jssdk.button.get-context | jssdk_api | high | verified | [Button.getContext](../docs/jssdk/button-get-context.md) |
| jssdk.button.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [Button.onWorkItemFormValueChanged](../docs/README.md) |
| jssdk.clipboard.write-text | jssdk_api | medium | needs_runtime_validation | [clipboard.writeText](../docs/README.md) |
| jssdk.component.date-picker | jssdk_api | low | needs_runtime_validation | [日期选择器 / DatePicker](../docs/README.md) |
| jssdk.component.library | jssdk_api | low | needs_runtime_validation | [客户端组件库接入](../docs/README.md) |
| jssdk.component.popover | jssdk_api | low | needs_runtime_validation | [气泡卡片 / Popover](../docs/README.md) |
| jssdk.component.rich-text-editor | jssdk_api | low | needs_runtime_validation | [富文本 / RichTextEditor](../docs/README.md) |
| jssdk.component.select | jssdk_api | low | needs_runtime_validation | [选择器 / Select](../docs/README.md) |
| jssdk.component.user-select | jssdk_api | low | needs_runtime_validation | [用户选择器 / UserSelect](../docs/README.md) |
| jssdk.component.user-tag | jssdk_api | low | needs_runtime_validation | [用户标签 / UserTag](../docs/README.md) |
| jssdk.component.work-item-finder | jssdk_api | low | needs_runtime_validation | [工作项筛选器 / WorkItemFinder](../docs/README.md) |
| jssdk.configuration.get-context | jssdk_api | high | verified | [Configuration.getContext](../docs/jssdk/configuration-get-context.md) |
| jssdk.container-modal.close | jssdk_api | high | verified | [containerModal.close](../docs/jssdk/container-modal-close.md) |
| jssdk.container-modal.configure | jssdk_api | low | needs_runtime_validation | [containerModal.configure](../docs/README.md) |
| jssdk.container-modal.submit | jssdk_api | low | needs_runtime_validation | [containerModal.submit](../docs/README.md) |
| jssdk.context.get-custom-context | jssdk_api | low | needs_runtime_validation | [Context.getCustomContext](../docs/README.md) |
| jssdk.context.load | jssdk_api | high | verified | [Context.load](../docs/jssdk/context-load.md) |
| jssdk.context.watch | jssdk_api | low | needs_runtime_validation | [Context.watch](../docs/README.md) |
| jssdk.control.get-context | jssdk_api | high | verified | [Control.getContext](../docs/plugin/control-get-context.md) |
| jssdk.control.get-create-work-item-form-item-values | jssdk_api | low | needs_runtime_validation | [Control.getCreateWorkItemFormItemValues](../docs/README.md) |
| jssdk.control.get-display-info | jssdk_api | low | needs_runtime_validation | [Control.getDisplayInfo](../docs/README.md) |
| jssdk.control.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [Control.onWorkItemFormValueChanged](../docs/README.md) |
| jssdk.control.open-full-screen-plugin | jssdk_api | low | needs_runtime_validation | [Control.openFullScreenPlugin](../docs/README.md) |
| jssdk.custom-field.get-context | jssdk_api | low | needs_runtime_validation | [CustomField.getContext](../docs/README.md) |
| jssdk.custom-field.get-create-work-item-form-item-values | jssdk_api | low | needs_runtime_validation | [CustomField.getCreateWorkItemFormItemValues](../docs/README.md) |
| jssdk.custom-field.get-display-info | jssdk_api | low | needs_runtime_validation | [CustomField.getDisplayInfo](../docs/README.md) |
| jssdk.custom-field.get-field-config | jssdk_api | low | needs_runtime_validation | [CustomField.getFieldConfig](../docs/README.md) |
| jssdk.custom-field.get-props | jssdk_api | low | needs_runtime_validation | [CustomField.getProps](../docs/README.md) |
| jssdk.custom-field.get-table-cell-init-props | jssdk_api | low | needs_runtime_validation | [CustomField.getTableCellInitProps](../docs/README.md) |
| jssdk.custom-field.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [CustomField.onWorkItemFormValueChanged](../docs/README.md) |
| jssdk.custom-field.open-full-screen-plugin | jssdk_api | low | needs_runtime_validation | [CustomField.openFullScreenPlugin](../docs/README.md) |
| jssdk.custom-field.save-field-value | jssdk_api | low | needs_runtime_validation | [CustomField.saveFieldValue](../docs/README.md) |
| jssdk.custom-field.watch | jssdk_api | low | needs_runtime_validation | [CustomField.watch](../docs/README.md) |
| jssdk.event.on-message | jssdk_api | low | needs_runtime_validation | [event.onMessage](../docs/README.md) |
| jssdk.field.load | jssdk_api | low | needs_runtime_validation | [Field.load](../docs/README.md) |
| jssdk.intercept.get-context | jssdk_api | low | needs_runtime_validation | [Intercept.getContext](../docs/README.md) |
| jssdk.lite-app-component.get-config | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getConfig](../docs/README.md) |
| jssdk.lite-app-component.get-context | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getContext](../docs/README.md) |
| jssdk.lite-app-component.get-data-source-result | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getDataSourceResult](../docs/README.md) |
| jssdk.lite-app-component.get-preset | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getPreset](../docs/README.md) |
| jssdk.lite-app-component.get-prop-full-config | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getPropFullConfig](../docs/README.md) |
| jssdk.lite-app-component.get-props | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getProps](../docs/README.md) |
| jssdk.lite-app-component.notify | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.notify](../docs/README.md) |
| jssdk.lite-app-component.watch | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.watch](../docs/README.md) |
| jssdk.modal.confirm | jssdk_api | low | needs_runtime_validation | [modal.confirm](../docs/README.md) |
| jssdk.modal.open | jssdk_api | low | needs_runtime_validation | [modal.open](../docs/README.md) |
| jssdk.navigation.get-hostname | jssdk_api | low | needs_runtime_validation | [navigation.getHostname](../docs/README.md) |
| jssdk.navigation.get-href | jssdk_api | low | needs_runtime_validation | [navigation.getHref](../docs/README.md) |
| jssdk.navigation.open | jssdk_api | medium | needs_runtime_validation | [navigation.open](../docs/README.md) |
| jssdk.navigation.open-work-item-create-page | jssdk_api | low | needs_runtime_validation | [navigation.openWorkItemCreatePage](../docs/README.md) |
| jssdk.navigation.open-work-item-detail-page | jssdk_api | low | needs_runtime_validation | [navigation.openWorkItemDetailPage](../docs/README.md) |
| jssdk.page.get-context | jssdk_api | low | needs_runtime_validation | [Page.getContext](../docs/README.md) |
| jssdk.rich-text-editor.show | jssdk_api | low | needs_runtime_validation | [richTextEditor.show](../docs/README.md) |
| jssdk.schedule.get-context | jssdk_api | low | needs_runtime_validation | [Schedule.getContext](../docs/README.md) |
| jssdk.schedule.get-owners-info | jssdk_api | low | needs_runtime_validation | [Schedule.getOwnersInfo](../docs/README.md) |
| jssdk.schedule.get-props | jssdk_api | low | needs_runtime_validation | [Schedule.getProps](../docs/README.md) |
| jssdk.schedule.get-wbs-status | jssdk_api | low | needs_runtime_validation | [Schedule.getWbsStatus](../docs/README.md) |
| jssdk.schedule.handle-cancel | jssdk_api | low | needs_runtime_validation | [Schedule.handleCancel](../docs/README.md) |
| jssdk.schedule.handle-submit | jssdk_api | low | needs_runtime_validation | [Schedule.handleSubmit](../docs/README.md) |
| jssdk.schedule.resize-container | jssdk_api | low | needs_runtime_validation | [Schedule.resizeContainer](../docs/README.md) |
| jssdk.schedule.watch | jssdk_api | low | needs_runtime_validation | [Schedule.watch](../docs/README.md) |
| jssdk.script.end | jssdk_api | low | needs_runtime_validation | [Script.end](../docs/README.md) |
| jssdk.script.get-context | jssdk_api | low | needs_runtime_validation | [Script.getContext](../docs/README.md) |
| jssdk.shared.set-shared-modules | jssdk_api | high | verified | [shared.setSharedModules](../docs/jssdk/shared-set-shared-modules.md) |
| jssdk.space.load | jssdk_api | medium | needs_runtime_validation | [Space.load](../docs/README.md) |
| jssdk.storage.clear | jssdk_api | low | needs_runtime_validation | [storage.clear](../docs/README.md) |
| jssdk.storage.get-item | jssdk_api | high | verified | [storage.getItem](../docs/jssdk/storage-get-item.md) |
| jssdk.storage.remove-item | jssdk_api | high | verified | [storage.removeItem](../docs/jssdk/storage-remove-item.md) |
| jssdk.storage.set-item | jssdk_api | high | verified | [storage.setItem](../docs/jssdk/storage-set-item.md) |
| jssdk.tab.get-context | jssdk_api | high | verified | [Tab.getContext](../docs/jssdk/tab-get-context.md) |
| jssdk.tab.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [Tab.onWorkItemFormValueChanged](../docs/README.md) |
| jssdk.toast.close | jssdk_api | low | needs_runtime_validation | [toast.close](../docs/README.md) |
| jssdk.toast.error | jssdk_api | high | verified | [toast.error](../docs/jssdk/toast-error.md) |
| jssdk.toast.info | jssdk_api | high | verified | [toast.info](../docs/jssdk/toast-info.md) |
| jssdk.toast.success | jssdk_api | high | verified | [toast.success](../docs/jssdk/toast-success.md) |
| jssdk.toast.warning | jssdk_api | high | verified | [toast.warning](../docs/jssdk/toast-warning.md) |
| jssdk.utils.get-auth-code | jssdk_api | low | needs_runtime_validation | [utils.getAuthCode](../docs/README.md) |
| jssdk.utils.overwrite-theme-for-semi-ui | jssdk_api | medium | needs_runtime_validation | [utils.overwriteThemeForSemiUI](../docs/README.md) |
| jssdk.view.get-context | jssdk_api | low | needs_runtime_validation | [View.getContext](../docs/README.md) |
| jssdk.work-item.load | jssdk_api | medium | needs_runtime_validation | [WorkItem.load](../docs/README.md) |
| jssdk.work-object.load | jssdk_api | medium | needs_runtime_validation | [WorkObject.load](../docs/README.md) |
| openapi.delete.open-api-project-key-fix-view-view-id | http_api | low | needs_runtime_validation | [删除视图](../docs/README.md) |
| openapi.delete.open-api-project-key-relation-work-item-type-key-work-item-id | http_api | low | needs_runtime_validation | [解绑空间关联的关联工作项实例](../docs/README.md) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id | http_api | low | needs_runtime_validation | [删除工作项](../docs/README.md) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-comment-id | http_api | low | deprecated | [删除评论（不再维护）](../docs/README.md) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-task-task-id | http_api | low | needs_runtime_validation | [删除子任务](../docs/README.md) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record | http_api | low | needs_runtime_validation | [删除工时登记记录](../docs/README.md) |
| openapi.delete.open-api-template-v2-delete-template-project-key-template-id | http_api | low | needs_runtime_validation | [删除流程模板](../docs/README.md) |
| openapi.delete.open-api-work-item-relation-delete | http_api | low | needs_runtime_validation | [删除工作项关系](../docs/README.md) |
| openapi.get.open-api-commercial-product-tenant-entitlement | http_api | low | needs_runtime_validation | [查询买方租户权益信息](../docs/README.md) |
| openapi.get.open-api-commercial-tenant | http_api | low | needs_runtime_validation | [获取租户信息](../docs/README.md) |
| openapi.get.open-api-intercept-project-intercept-config-list | http_api | low | needs_runtime_validation | [查询拦截事件配置](../docs/README.md) |
| openapi.get.open-api-project-key-business-all | http_api | low | needs_runtime_validation | [获取空间下业务线详情](../docs/README.md) |
| openapi.get.open-api-project-key-file-stream-download-file-token | http_api | low | needs_runtime_validation | [下载文件](../docs/README.md) |
| openapi.get.open-api-project-key-fix-view-view-id | http_api | low | needs_runtime_validation | [获取视图下工作项列表（非全景视图）](../docs/README.md) |
| openapi.get.open-api-project-key-flow-roles-work-item-type-key | http_api | low | needs_runtime_validation | [获取流程角色配置详情](../docs/README.md) |
| openapi.get.open-api-project-key-measure-chart-id | http_api | low | needs_runtime_validation | [获取度量图表明细数据](../docs/README.md) |
| openapi.get.open-api-project-key-teams-all | http_api | low | needs_runtime_validation | [获取空间下团队人员](../docs/README.md) |
| openapi.get.open-api-project-key-template-detail-template-id | http_api | low | needs_runtime_validation | [获取流程模板配置详情](../docs/README.md) |
| openapi.get.open-api-project-key-template-list-work-item-type-key | http_api | low | needs_runtime_validation | [获取工作项下的流程模板列表](../docs/README.md) |
| openapi.get.open-api-project-key-work-item-all-types | http_api | low | needs_runtime_validation | [获取空间下工作项类型](../docs/README.md) |
| openapi.get.open-api-project-key-work-item-relation | http_api | low | needs_runtime_validation | [获取工作项关系列表](../docs/README.md) |
| openapi.get.open-api-project-key-work-item-type-work-item-type-key | http_api | high | verified | [获取工作项基础信息配置](../docs/openapi/work-item-type-config.md) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-meta | http_api | low | needs_runtime_validation | [获取创建工作项元数据](../docs/README.md) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-comments | http_api | low | deprecated | [查询评论（不再维护）](../docs/README.md) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-wbs-view | http_api | low | needs_runtime_validation | [获取工作流详情（WBS）](../docs/README.md) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-task | http_api | low | needs_runtime_validation | [获取子任务详情](../docs/README.md) |
| openapi.get.open-api-task-result | http_api | low | needs_runtime_validation | [获取批量更新处理进度](../docs/README.md) |
| openapi.patch.open-api-project-key-user-group-members | http_api | low | needs_runtime_validation | [更新用户组成员](../docs/README.md) |
| openapi.post.open-api-ai-node-confirm | http_api | low | needs_runtime_validation | [完成 AI 节点](../docs/README.md) |
| openapi.post.open-api-ai-node-edit | http_api | low | needs_runtime_validation | [修改 AI 节点数据](../docs/README.md) |
| openapi.post.open-api-ai-node-query | http_api | low | needs_runtime_validation | [获取 AI 节点信息](../docs/README.md) |
| openapi.post.open-api-authen-plugin-token | http_api | high | verified | [获取访问凭证](../docs/openapi/plugin-token.md) |
| openapi.post.open-api-authen-refresh-token | http_api | high | verified | [获取访问凭证](../docs/openapi/refresh-token.md) |
| openapi.post.open-api-authen-user-plugin-token | http_api | high | verified | [获取访问凭证](../docs/openapi/user-plugin-token.md) |
| openapi.post.open-api-comment-create | http_api | low | needs_runtime_validation | [添加评论](../docs/README.md) |
| openapi.post.open-api-comment-delete | http_api | low | needs_runtime_validation | [删除评论](../docs/README.md) |
| openapi.post.open-api-comment-query | http_api | low | needs_runtime_validation | [查询评论](../docs/README.md) |
| openapi.post.open-api-comment-update | http_api | low | needs_runtime_validation | [更新评论](../docs/README.md) |
| openapi.post.open-api-compositive-search | http_api | low | needs_runtime_validation | [获取指定的工作项列表（全局搜索）](../docs/README.md) |
| openapi.post.open-api-file-delete | http_api | low | needs_runtime_validation | [删除附件](../docs/README.md) |
| openapi.post.open-api-intercept-project-intercept-config-create | http_api | low | needs_runtime_validation | [按空间设置拦截事件配置](../docs/README.md) |
| openapi.post.open-api-measure-charts | http_api | low | needs_runtime_validation | [通过视图ID查询所有图表](../docs/README.md) |
| openapi.post.open-api-op-record-work-item-list | http_api | low | needs_runtime_validation | [获取工作项操作记录](../docs/README.md) |
| openapi.post.open-api-project-key-field-all | http_api | high | verified | [获取字段信息](../docs/openapi/field-all.md) |
| openapi.post.open-api-project-key-field-work-item-type-key-create | http_api | low | needs_runtime_validation | [创建自定义字段](../docs/README.md) |
| openapi.post.open-api-project-key-file-resource-resource-type-upload-preprocess | http_api | low | needs_runtime_validation | [分片初始化](../docs/README.md) |
| openapi.post.open-api-project-key-file-stream-resource-resource-type-upload-form | http_api | low | needs_runtime_validation | [上传文件](../docs/README.md) |
| openapi.post.open-api-project-key-file-stream-upload-multipart-resource-id-part-number | http_api | low | needs_runtime_validation | [上传分片](../docs/README.md) |
| openapi.post.open-api-project-key-file-upload | http_api | low | needs_runtime_validation | [上传文件或富文本图片](../docs/README.md) |
| openapi.post.open-api-project-key-file-upload-multipart-abort-resource-id | http_api | low | needs_runtime_validation | [终止分片上传](../docs/README.md) |
| openapi.post.open-api-project-key-file-upload-multipart-finish-resource-id | http_api | low | needs_runtime_validation | [完成分片上传](../docs/README.md) |
| openapi.post.open-api-project-key-flow-roles-work-item-type-key-create-role | http_api | low | needs_runtime_validation | [创建流程角色配置](../docs/README.md) |
| openapi.post.open-api-project-key-flow-roles-work-item-type-key-delete-role | http_api | low | needs_runtime_validation | [删除流程角色配置](../docs/README.md) |
| openapi.post.open-api-project-key-flow-roles-work-item-type-key-update-role | http_api | low | needs_runtime_validation | [更新流程角色配置](../docs/README.md) |
| openapi.post.open-api-project-key-relation-rules | http_api | low | needs_runtime_validation | [获取空间关联规则列表](../docs/README.md) |
| openapi.post.open-api-project-key-relation-work-item-type-key-work-item-id-batch-bind | http_api | low | needs_runtime_validation | [绑定空间关联的关联工作项实例](../docs/README.md) |
| openapi.post.open-api-project-key-relation-work-item-type-key-work-item-id-work-item-list | http_api | low | needs_runtime_validation | [获取空间关联下的关联工作项实例列表](../docs/README.md) |
| openapi.post.open-api-project-key-user-group | http_api | low | needs_runtime_validation | [创建自定义用户组](../docs/README.md) |
| openapi.post.open-api-project-key-user-groups-members-page | http_api | low | needs_runtime_validation | [查询用户组成员](../docs/README.md) |
| openapi.post.open-api-project-key-view-conf-list | http_api | low | needs_runtime_validation | [获取视图列表及配置信息](../docs/README.md) |
| openapi.post.open-api-project-key-view-view-id | http_api | low | needs_runtime_validation | [获取视图下工作项列表（全景视图）](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-filter | http_api | low | needs_runtime_validation | [获取指定的工作项列表（单空间）](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-type-key-fix-view | http_api | low | needs_runtime_validation | [创建固定视图](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-type-key-fix-view-view-id | http_api | low | needs_runtime_validation | [更新固定视图](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-id-bot-join-chat | http_api | low | needs_runtime_validation | [拉机器人入群](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-search-params | http_api | low | needs_runtime_validation | [获取指定的工作项列表（单空间-复杂传参）](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-create | http_api | low | deprecated | [添加评论（不再维护）](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-download | http_api | high | verified | [下载附件](../docs/openapi/work-item-file-download.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-upload | http_api | low | needs_runtime_validation | [添加附件](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-search-by-relation | http_api | low | needs_runtime_validation | [获取指定的关联工作项列表（单空间）](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-subtask-modify | http_api | low | needs_runtime_validation | [子任务完成/回滚](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record | http_api | low | needs_runtime_validation | [新增工时登记记录](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-node-id-task-task-id | http_api | low | needs_runtime_validation | [更新子任务](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-query | http_api | low | needs_runtime_validation | [获取工作流详情](../docs/README.md) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-task | http_api | low | needs_runtime_validation | [创建子任务](../docs/README.md) |
| openapi.post.open-api-project-key-workflow-work-item-type-key-work-item-id-node-node-id-operate | http_api | low | needs_runtime_validation | [节点完成/回滚](../docs/README.md) |
| openapi.post.open-api-project-key-workflow-work-item-type-key-work-item-id-node-state-change | http_api | low | needs_runtime_validation | [状态流转](../docs/README.md) |
| openapi.post.open-api-projects | http_api | low | needs_runtime_validation | [获取空间列表](../docs/README.md) |
| openapi.post.open-api-projects-detail | http_api | low | needs_runtime_validation | [获取空间详情](../docs/README.md) |
| openapi.post.open-api-template-v2-create-template | http_api | low | needs_runtime_validation | [新增流程模板](../docs/README.md) |
| openapi.post.open-api-tenant-projects-install-list | http_api | low | needs_runtime_validation | [获取租户安装空间列表](../docs/README.md) |
| openapi.post.open-api-user-query | http_api | high | verified | [获取用户详情](../docs/openapi/user-query.md) |
| openapi.post.open-api-user-search | http_api | low | needs_runtime_validation | [搜索租户内的用户列表](../docs/README.md) |
| openapi.post.open-api-view-search-universal-search | http_api | low | needs_runtime_validation | [获取指定的工作项列表（全量搜索）](../docs/README.md) |
| openapi.post.open-api-view-v1-create-condition-view | http_api | low | needs_runtime_validation | [创建条件视图](../docs/README.md) |
| openapi.post.open-api-view-v1-update-condition-view | http_api | low | needs_runtime_validation | [更新条件视图](../docs/README.md) |
| openapi.post.open-api-work-item-batch-update | http_api | low | needs_runtime_validation | [批量更新工作项字段值](../docs/README.md) |
| openapi.post.open-api-work-item-deliverable-batch-query | http_api | low | needs_runtime_validation | [交付物信息批量查询（WBS）](../docs/README.md) |
| openapi.post.open-api-work-item-field-options | http_api | low | needs_runtime_validation | [获取工作项指定字段可选选项](../docs/README.md) |
| openapi.post.open-api-work-item-field-value-update-compound-field | http_api | low | needs_runtime_validation | [按组更新复合字段值](../docs/README.md) |
| openapi.post.open-api-work-item-finished-batch-query | http_api | low | needs_runtime_validation | [批量查询评审意见、评审结论](../docs/README.md) |
| openapi.post.open-api-work-item-finished-query-conclusion-option | http_api | low | needs_runtime_validation | [评审结论标签值查询](../docs/README.md) |
| openapi.post.open-api-work-item-finished-update | http_api | low | needs_runtime_validation | [修改评审结论和评审意见](../docs/README.md) |
| openapi.post.open-api-work-item-man-hour-records | http_api | low | needs_runtime_validation | [获取工作项的工时登记记录列表](../docs/README.md) |
| openapi.post.open-api-work-item-relation-create | http_api | low | needs_runtime_validation | [新增工作项关系](../docs/README.md) |
| openapi.post.open-api-work-item-relation-update | http_api | low | needs_runtime_validation | [更新工作项关系](../docs/README.md) |
| openapi.post.open-api-work-item-resource-create-work-item | http_api | low | needs_runtime_validation | [创建工作项资源库](../docs/README.md) |
| openapi.post.open-api-work-item-resource-project-key-work-item-id-create-instance | http_api | low | needs_runtime_validation | [通过资源创建实例](../docs/README.md) |
| openapi.post.open-api-work-item-resource-query | http_api | low | needs_runtime_validation | [获取工作项资源实例详情](../docs/README.md) |
| openapi.post.open-api-work-item-resource-search-params | http_api | low | needs_runtime_validation | [获取指定的工作项资源库实例列表（复杂传参）](../docs/README.md) |
| openapi.post.open-api-work-item-resource-update | http_api | low | needs_runtime_validation | [更新工作项资源实例](../docs/README.md) |
| openapi.post.open-api-work-item-subtask-search | http_api | low | needs_runtime_validation | [获取指定的子任务列表（跨空间）](../docs/README.md) |
| openapi.post.open-api-work-item-transition-required-info-get | http_api | low | needs_runtime_validation | [获取指定节点/状态流转所需必填信息](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-create | http_api | low | needs_runtime_validation | [创建计划表草稿](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-create-progress-query | http_api | low | needs_runtime_validation | [创建计划表草稿进度查询](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-detail-query | http_api | low | needs_runtime_validation | [查询计划表草稿数据行详细信息](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-patch-progress-query | http_api | low | needs_runtime_validation | [更新计划表草稿查询进度](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-patch-update | http_api | low | needs_runtime_validation | [更新计划表草稿](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-publish | http_api | low | needs_runtime_validation | [发布计划表草稿](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-publish-progress-query | http_api | low | needs_runtime_validation | [计划表草稿发布进度查询](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-reset | http_api | low | needs_runtime_validation | [重置计划表草稿](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-reset-progress-query | http_api | low | needs_runtime_validation | [重置计划表草稿进度查询](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-structure-query | http_api | low | needs_runtime_validation | [查询全量计划表草稿骨架](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-draft-task-conf-query | http_api | low | needs_runtime_validation | [查询计划表草稿行配置信息](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-instance-expand-query | http_api | low | needs_runtime_validation | [查询计划表扩展信息](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-view-detail-query | http_api | low | needs_runtime_validation | [查询计划表行详细信息](../docs/README.md) |
| openapi.post.open-api-work-item-wbs-view-structure-query | http_api | low | needs_runtime_validation | [查询全量计划表骨架](../docs/README.md) |
| openapi.post.open-api-work-items-filter-across-project | http_api | low | needs_runtime_validation | [获取指定的工作项列表（跨空间）](../docs/README.md) |
| openapi.put.open-api-ai-application-field-update | http_api | low | needs_runtime_validation | [更新 AI 字段](../docs/README.md) |
| openapi.put.open-api-ai-entity-update | http_api | low | needs_runtime_validation | [更新 AI 操作的运行状态](../docs/README.md) |
| openapi.put.open-api-project-key-field-work-item-type-key | http_api | low | needs_runtime_validation | [更新自定义字段](../docs/README.md) |
| openapi.put.open-api-project-key-work-item-type-work-item-type-key | http_api | low | needs_runtime_validation | [更新工作项基础信息配置](../docs/README.md) |
| openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-abort | http_api | low | needs_runtime_validation | [终止/恢复工作项](../docs/README.md) |
| openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-comment-id | http_api | low | deprecated | [更新评论（不再维护）](../docs/README.md) |
| openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record | http_api | low | needs_runtime_validation | [更新工时登记记录](../docs/README.md) |
| openapi.put.open-api-project-key-workflow-work-item-type-key-work-item-id-node-node-id | http_api | low | needs_runtime_validation | [更新节点/排期](../docs/README.md) |
| openapi.put.open-api-template-v2-update-template | http_api | low | needs_runtime_validation | [更新流程模板](../docs/README.md) |
| openapi.put.open-api-work-item-freeze | http_api | low | needs_runtime_validation | [冻结/解冻工作项](../docs/README.md) |
| openapi.work-item.create | http_api | high | verified | [创建工作项](../docs/openapi/work-item-create.md) |
| openapi.work-item.get | http_api | high | verified | [获取工作项详情](../docs/openapi/work-item-get.md) |
| openapi.work-item.update | http_api | high | verified | [更新工作项](../docs/openapi/work-item-update.md) |
| plugin-point.button | plugin_point | high | verified | [按钮 / Button](../docs/plugin/button.md) |
| plugin-point.configuration | plugin_point | high | verified | [插件配置 / Configuration](../docs/plugin/configuration.md) |
| plugin-point.connector | plugin_point | low | needs_runtime_validation | [自动化连接器 / Connector](../docs/README.md) |
| plugin-point.control | plugin_point | high | verified | [控件 / Control](../docs/plugin/control.md) |
| plugin-point.custom-field | plugin_point | medium | needs_runtime_validation | [扩展字段-字段类型 / CustomField](../docs/README.md) |
| plugin-point.intercept | plugin_point | low | needs_runtime_validation | [拦截事件 / Intercept](../docs/README.md) |
| plugin-point.lite-app-component | plugin_point | medium | needs_runtime_validation | [轻应用组件 / LiteAppComponent](../docs/README.md) |
| plugin-point.page | plugin_point | medium | needs_runtime_validation | [导航功能页 / Page](../docs/README.md) |
| plugin-point.schedule | plugin_point | medium | needs_runtime_validation | [扩展字段-节点排期 / Schedule](../docs/README.md) |
| plugin-point.tab | plugin_point | high | verified | [详情标签页 / Tab](../docs/plugin/tab.md) |
| plugin-point.view | plugin_point | medium | needs_runtime_validation | [视图模式 / View](../docs/README.md) |
