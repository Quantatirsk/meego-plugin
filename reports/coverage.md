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
| ai.field.event | ai_capability | low | needs_runtime_validation | [AI 字段事件](../docs/openapi/ai/AI字段事件说明.md#capability-ai.field.event) |
| ai.node.data | ai_capability | low | needs_runtime_validation | [AI 节点数据结构](../docs/openapi/ai/AI节点数据结构.md#capability-ai.node.data) |
| ai.node.event | ai_capability | low | needs_runtime_validation | [AI 节点事件](../docs/openapi/ai/AI节点事件.md#capability-ai.node.event) |
| ai.node.link-options | ai_capability | low | needs_runtime_validation | [AI 节点链接选项](../docs/openapi/ai/AI节点链接选项.md#capability-ai.node.link-options) |
| ai.node.permissions | ai_capability | low | needs_runtime_validation | [AI 节点权限](../docs/openapi/ai/AI节点权限说明.md#capability-ai.node.permissions) |
| ai.operation.event | ai_capability | low | needs_runtime_validation | [AI 操作事件](../docs/openapi/ai/AI操作事件说明.md#capability-ai.operation.event) |
| ai.operation.link-options | ai_capability | low | needs_runtime_validation | [AI 操作链接选项](../docs/openapi/ai/AI操作链接选项.md#capability-ai.operation.link-options) |
| ai.operation.permissions | ai_capability | low | needs_runtime_validation | [AI 操作权限](../docs/openapi/ai/AI操作权限说明.md#capability-ai.operation.permissions) |
| event-contract.control-create-callback | event_contract | medium | needs_runtime_validation | [Control 新建成功回调](../docs/plugin/points/控件 Control.md#capability-event-contract.control-create-callback) |
| event-contract.intercept | event_contract | medium | needs_runtime_validation | [拦截事件](../docs/openapi/events/拦截事件.md#capability-event-contract.intercept) |
| event-contract.listen | event_contract | medium | needs_runtime_validation | [监听事件](../docs/openapi/events/监听事件.md#capability-event-contract.listen) |
| event-contract.plugin-lifecycle | event_contract | low | needs_runtime_validation | [插件装卸监听](../docs/openapi/events/插件装卸监听.md#capability-event-contract.plugin-lifecycle) |
| event-contract.webhook-signature | event_contract | medium | needs_runtime_validation | [Webhook 验签](../docs/openapi/events/事件兼容性与验签.md#capability-event-contract.webhook-signature) |
| jssdk.action-sheet.show | jssdk_api | low | needs_runtime_validation | [actionSheet.show](../docs/plugin/jssdk/actionSheet.md#capability-jssdk.action-sheet.show) |
| jssdk.button.get-context | jssdk_api | high | verified | [Button.getContext](../docs/plugin/jssdk/Button.md#capability-jssdk.button.get-context) |
| jssdk.button.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [Button.onWorkItemFormValueChanged](../docs/plugin/jssdk/Button.md#capability-jssdk.button.on-work-item-form-value-changed) |
| jssdk.clipboard.write-text | jssdk_api | medium | needs_runtime_validation | [clipboard.writeText](../docs/plugin/jssdk/clipboard.md#capability-jssdk.clipboard.write-text) |
| jssdk.component.date-picker | jssdk_api | low | needs_runtime_validation | [日期选择器 / DatePicker](../docs/plugin/components/日期选择器 DatePicker.md#capability-jssdk.component.date-picker) |
| jssdk.component.library | jssdk_api | low | needs_runtime_validation | [客户端组件库接入](../docs/plugin/components/客户端组件库接入.md#capability-jssdk.component.library) |
| jssdk.component.popover | jssdk_api | low | needs_runtime_validation | [气泡卡片 / Popover](../docs/plugin/components/气泡卡片 Popover.md#capability-jssdk.component.popover) |
| jssdk.component.rich-text-editor | jssdk_api | low | needs_runtime_validation | [富文本 / RichTextEditor](../docs/plugin/components/富文本 RichTextEditor.md#capability-jssdk.component.rich-text-editor) |
| jssdk.component.select | jssdk_api | low | needs_runtime_validation | [选择器 / Select](../docs/plugin/components/选择器 Select.md#capability-jssdk.component.select) |
| jssdk.component.user-select | jssdk_api | low | needs_runtime_validation | [用户选择器 / UserSelect](../docs/plugin/components/用户选择器 UserSelect.md#capability-jssdk.component.user-select) |
| jssdk.component.user-tag | jssdk_api | low | needs_runtime_validation | [用户标签 / UserTag](../docs/plugin/components/用户标签 UserTag.md#capability-jssdk.component.user-tag) |
| jssdk.component.work-item-finder | jssdk_api | low | needs_runtime_validation | [工作项筛选器 / WorkItemFinder](../docs/plugin/components/工作项筛选器 WorkItemFinder.md#capability-jssdk.component.work-item-finder) |
| jssdk.configuration.get-context | jssdk_api | high | verified | [Configuration.getContext](../docs/plugin/jssdk/Configuration.md#capability-jssdk.configuration.get-context) |
| jssdk.container-modal.close | jssdk_api | high | verified | [containerModal.close](../docs/plugin/jssdk/containerModal.md#capability-jssdk.container-modal.close) |
| jssdk.container-modal.configure | jssdk_api | low | needs_runtime_validation | [containerModal.configure](../docs/plugin/jssdk/containerModal.md#capability-jssdk.container-modal.configure) |
| jssdk.container-modal.submit | jssdk_api | low | needs_runtime_validation | [containerModal.submit](../docs/plugin/jssdk/containerModal.md#capability-jssdk.container-modal.submit) |
| jssdk.context.get-custom-context | jssdk_api | low | needs_runtime_validation | [Context.getCustomContext](../docs/plugin/jssdk/Context.md#capability-jssdk.context.get-custom-context) |
| jssdk.context.load | jssdk_api | high | verified | [Context.load](../docs/plugin/jssdk/Context.md#capability-jssdk.context.load) |
| jssdk.context.watch | jssdk_api | low | needs_runtime_validation | [Context.watch](../docs/plugin/jssdk/Context.md#capability-jssdk.context.watch) |
| jssdk.control.get-context | jssdk_api | high | verified | [Control.getContext](../docs/plugin/jssdk/Control.md#capability-jssdk.control.get-context) |
| jssdk.control.get-create-work-item-form-item-values | jssdk_api | low | needs_runtime_validation | [Control.getCreateWorkItemFormItemValues](../docs/plugin/jssdk/Control.md#capability-jssdk.control.get-create-work-item-form-item-values) |
| jssdk.control.get-display-info | jssdk_api | low | needs_runtime_validation | [Control.getDisplayInfo](../docs/plugin/jssdk/Control.md#capability-jssdk.control.get-display-info) |
| jssdk.control.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [Control.onWorkItemFormValueChanged](../docs/plugin/jssdk/Control.md#capability-jssdk.control.on-work-item-form-value-changed) |
| jssdk.control.open-full-screen-plugin | jssdk_api | low | needs_runtime_validation | [Control.openFullScreenPlugin](../docs/plugin/jssdk/Control.md#capability-jssdk.control.open-full-screen-plugin) |
| jssdk.custom-field.get-context | jssdk_api | low | needs_runtime_validation | [CustomField.getContext](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.get-context) |
| jssdk.custom-field.get-create-work-item-form-item-values | jssdk_api | low | needs_runtime_validation | [CustomField.getCreateWorkItemFormItemValues](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.get-create-work-item-form-item-values) |
| jssdk.custom-field.get-display-info | jssdk_api | low | needs_runtime_validation | [CustomField.getDisplayInfo](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.get-display-info) |
| jssdk.custom-field.get-field-config | jssdk_api | low | needs_runtime_validation | [CustomField.getFieldConfig](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.get-field-config) |
| jssdk.custom-field.get-props | jssdk_api | low | needs_runtime_validation | [CustomField.getProps](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.get-props) |
| jssdk.custom-field.get-table-cell-init-props | jssdk_api | low | needs_runtime_validation | [CustomField.getTableCellInitProps](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.get-table-cell-init-props) |
| jssdk.custom-field.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [CustomField.onWorkItemFormValueChanged](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.on-work-item-form-value-changed) |
| jssdk.custom-field.open-full-screen-plugin | jssdk_api | low | needs_runtime_validation | [CustomField.openFullScreenPlugin](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.open-full-screen-plugin) |
| jssdk.custom-field.save-field-value | jssdk_api | low | needs_runtime_validation | [CustomField.saveFieldValue](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.save-field-value) |
| jssdk.custom-field.watch | jssdk_api | low | needs_runtime_validation | [CustomField.watch](../docs/plugin/jssdk/CustomField.md#capability-jssdk.custom-field.watch) |
| jssdk.event.on-message | jssdk_api | low | needs_runtime_validation | [event.onMessage](../docs/plugin/jssdk/event.md#capability-jssdk.event.on-message) |
| jssdk.field.load | jssdk_api | low | needs_runtime_validation | [Field.load](../docs/plugin/jssdk/Field.md#capability-jssdk.field.load) |
| jssdk.intercept.get-context | jssdk_api | low | needs_runtime_validation | [Intercept.getContext](../docs/plugin/jssdk/Intercept.md#capability-jssdk.intercept.get-context) |
| jssdk.lite-app-component.get-config | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getConfig](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.get-config) |
| jssdk.lite-app-component.get-context | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getContext](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.get-context) |
| jssdk.lite-app-component.get-data-source-result | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getDataSourceResult](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.get-data-source-result) |
| jssdk.lite-app-component.get-preset | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getPreset](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.get-preset) |
| jssdk.lite-app-component.get-prop-full-config | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getPropFullConfig](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.get-prop-full-config) |
| jssdk.lite-app-component.get-props | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.getProps](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.get-props) |
| jssdk.lite-app-component.notify | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.notify](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.notify) |
| jssdk.lite-app-component.watch | jssdk_api | low | needs_runtime_validation | [LiteAppComponent.watch](../docs/plugin/jssdk/LiteAppComponent.md#capability-jssdk.lite-app-component.watch) |
| jssdk.modal.confirm | jssdk_api | low | needs_runtime_validation | [modal.confirm](../docs/plugin/jssdk/modal.md#capability-jssdk.modal.confirm) |
| jssdk.modal.open | jssdk_api | low | needs_runtime_validation | [modal.open](../docs/plugin/jssdk/modal.md#capability-jssdk.modal.open) |
| jssdk.navigation.get-hostname | jssdk_api | low | needs_runtime_validation | [navigation.getHostname](../docs/plugin/jssdk/navigation.md#capability-jssdk.navigation.get-hostname) |
| jssdk.navigation.get-href | jssdk_api | low | needs_runtime_validation | [navigation.getHref](../docs/plugin/jssdk/navigation.md#capability-jssdk.navigation.get-href) |
| jssdk.navigation.open | jssdk_api | medium | needs_runtime_validation | [navigation.open](../docs/plugin/jssdk/navigation.md#capability-jssdk.navigation.open) |
| jssdk.navigation.open-work-item-create-page | jssdk_api | low | needs_runtime_validation | [navigation.openWorkItemCreatePage](../docs/plugin/jssdk/navigation.md#capability-jssdk.navigation.open-work-item-create-page) |
| jssdk.navigation.open-work-item-detail-page | jssdk_api | low | needs_runtime_validation | [navigation.openWorkItemDetailPage](../docs/plugin/jssdk/navigation.md#capability-jssdk.navigation.open-work-item-detail-page) |
| jssdk.page.get-context | jssdk_api | low | needs_runtime_validation | [Page.getContext](../docs/plugin/jssdk/Page.md#capability-jssdk.page.get-context) |
| jssdk.rich-text-editor.show | jssdk_api | low | needs_runtime_validation | [richTextEditor.show](../docs/plugin/jssdk/richTextEditor.md#capability-jssdk.rich-text-editor.show) |
| jssdk.schedule.get-context | jssdk_api | low | needs_runtime_validation | [Schedule.getContext](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.get-context) |
| jssdk.schedule.get-owners-info | jssdk_api | low | needs_runtime_validation | [Schedule.getOwnersInfo](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.get-owners-info) |
| jssdk.schedule.get-props | jssdk_api | low | needs_runtime_validation | [Schedule.getProps](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.get-props) |
| jssdk.schedule.get-wbs-status | jssdk_api | low | needs_runtime_validation | [Schedule.getWbsStatus](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.get-wbs-status) |
| jssdk.schedule.handle-cancel | jssdk_api | low | needs_runtime_validation | [Schedule.handleCancel](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.handle-cancel) |
| jssdk.schedule.handle-submit | jssdk_api | low | needs_runtime_validation | [Schedule.handleSubmit](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.handle-submit) |
| jssdk.schedule.resize-container | jssdk_api | low | needs_runtime_validation | [Schedule.resizeContainer](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.resize-container) |
| jssdk.schedule.watch | jssdk_api | low | needs_runtime_validation | [Schedule.watch](../docs/plugin/jssdk/Schedule.md#capability-jssdk.schedule.watch) |
| jssdk.script.end | jssdk_api | low | needs_runtime_validation | [Script.end](../docs/plugin/jssdk/Script.md#capability-jssdk.script.end) |
| jssdk.script.get-context | jssdk_api | low | needs_runtime_validation | [Script.getContext](../docs/plugin/jssdk/Script.md#capability-jssdk.script.get-context) |
| jssdk.shared.set-shared-modules | jssdk_api | high | verified | [shared.setSharedModules](../docs/plugin/jssdk/shared.md#capability-jssdk.shared.set-shared-modules) |
| jssdk.space.load | jssdk_api | medium | needs_runtime_validation | [Space.load](../docs/plugin/jssdk/Space.md#capability-jssdk.space.load) |
| jssdk.storage.clear | jssdk_api | low | needs_runtime_validation | [storage.clear](../docs/plugin/jssdk/storage.md#capability-jssdk.storage.clear) |
| jssdk.storage.get-item | jssdk_api | high | verified | [storage.getItem](../docs/plugin/jssdk/storage.md#capability-jssdk.storage.get-item) |
| jssdk.storage.remove-item | jssdk_api | high | verified | [storage.removeItem](../docs/plugin/jssdk/storage.md#capability-jssdk.storage.remove-item) |
| jssdk.storage.set-item | jssdk_api | high | verified | [storage.setItem](../docs/plugin/jssdk/storage.md#capability-jssdk.storage.set-item) |
| jssdk.tab.get-context | jssdk_api | high | verified | [Tab.getContext](../docs/plugin/jssdk/Tab.md#capability-jssdk.tab.get-context) |
| jssdk.tab.on-work-item-form-value-changed | jssdk_api | low | needs_runtime_validation | [Tab.onWorkItemFormValueChanged](../docs/plugin/jssdk/Tab.md#capability-jssdk.tab.on-work-item-form-value-changed) |
| jssdk.toast.close | jssdk_api | low | needs_runtime_validation | [toast.close](../docs/plugin/jssdk/toast.md#capability-jssdk.toast.close) |
| jssdk.toast.error | jssdk_api | high | verified | [toast.error](../docs/plugin/jssdk/toast.md#capability-jssdk.toast.error) |
| jssdk.toast.info | jssdk_api | high | verified | [toast.info](../docs/plugin/jssdk/toast.md#capability-jssdk.toast.info) |
| jssdk.toast.success | jssdk_api | high | verified | [toast.success](../docs/plugin/jssdk/toast.md#capability-jssdk.toast.success) |
| jssdk.toast.warning | jssdk_api | high | verified | [toast.warning](../docs/plugin/jssdk/toast.md#capability-jssdk.toast.warning) |
| jssdk.utils.get-auth-code | jssdk_api | low | needs_runtime_validation | [utils.getAuthCode](../docs/plugin/jssdk/utils.md#capability-jssdk.utils.get-auth-code) |
| jssdk.utils.overwrite-theme-for-semi-ui | jssdk_api | medium | needs_runtime_validation | [utils.overwriteThemeForSemiUI](../docs/plugin/jssdk/utils.md#capability-jssdk.utils.overwrite-theme-for-semi-ui) |
| jssdk.view.get-context | jssdk_api | low | needs_runtime_validation | [View.getContext](../docs/plugin/jssdk/View.md#capability-jssdk.view.get-context) |
| jssdk.work-item.load | jssdk_api | medium | needs_runtime_validation | [WorkItem.load](../docs/plugin/jssdk/WorkItem.md#capability-jssdk.work-item.load) |
| jssdk.work-object.load | jssdk_api | medium | needs_runtime_validation | [WorkObject.load](../docs/plugin/jssdk/WorkObject.md#capability-jssdk.work-object.load) |
| openapi.delete.open-api-project-key-fix-view-view-id | http_api | low | needs_runtime_validation | [删除视图](../docs/openapi/api/删除视图.md#capability-openapi.delete.open-api-project-key-fix-view-view-id) |
| openapi.delete.open-api-project-key-relation-work-item-type-key-work-item-id | http_api | low | needs_runtime_validation | [解绑空间关联的关联工作项实例](../docs/openapi/api/解绑空间关联的关联工作项实例.md#capability-openapi.delete.open-api-project-key-relation-work-item-type-key-work-item-id) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id | http_api | low | needs_runtime_validation | [删除工作项](../docs/openapi/api/删除工作项.md#capability-openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-comment-id | http_api | low | deprecated | [删除评论（不再维护）](../docs/openapi/api/删除评论（不再维护）.md#capability-openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-comment-id) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-task-task-id | http_api | low | needs_runtime_validation | [删除子任务](../docs/openapi/api/删除子任务.md#capability-openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-task-task-id) |
| openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record | http_api | low | needs_runtime_validation | [删除工时登记记录](../docs/openapi/api/删除工时登记记录.md#capability-openapi.delete.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record) |
| openapi.delete.open-api-template-v2-delete-template-project-key-template-id | http_api | low | needs_runtime_validation | [删除流程模板](../docs/openapi/api/删除流程模板.md#capability-openapi.delete.open-api-template-v2-delete-template-project-key-template-id) |
| openapi.delete.open-api-work-item-relation-delete | http_api | low | needs_runtime_validation | [删除工作项关系](../docs/openapi/api/删除工作项关系.md#capability-openapi.delete.open-api-work-item-relation-delete) |
| openapi.get.open-api-commercial-product-tenant-entitlement | http_api | low | needs_runtime_validation | [查询买方租户权益信息](../docs/openapi/api/查询买方租户权益信息.md#capability-openapi.get.open-api-commercial-product-tenant-entitlement) |
| openapi.get.open-api-commercial-tenant | http_api | low | needs_runtime_validation | [获取租户信息](../docs/openapi/api/获取租户信息.md#capability-openapi.get.open-api-commercial-tenant) |
| openapi.get.open-api-intercept-project-intercept-config-list | http_api | low | needs_runtime_validation | [查询拦截事件配置](../docs/openapi/events/查询拦截事件配置.md#capability-openapi.get.open-api-intercept-project-intercept-config-list) |
| openapi.get.open-api-project-key-business-all | http_api | low | needs_runtime_validation | [获取空间下业务线详情](../docs/openapi/api/获取空间下业务线详情.md#capability-openapi.get.open-api-project-key-business-all) |
| openapi.get.open-api-project-key-file-stream-download-file-token | http_api | low | needs_runtime_validation | [下载文件](../docs/openapi/api/下载文件.md#capability-openapi.get.open-api-project-key-file-stream-download-file-token) |
| openapi.get.open-api-project-key-fix-view-view-id | http_api | low | needs_runtime_validation | [获取视图下工作项列表（非全景视图）](../docs/openapi/api/获取视图下工作项列表（非全景视图）.md#capability-openapi.get.open-api-project-key-fix-view-view-id) |
| openapi.get.open-api-project-key-flow-roles-work-item-type-key | http_api | low | needs_runtime_validation | [获取流程角色配置详情](../docs/openapi/api/获取流程角色配置详情.md#capability-openapi.get.open-api-project-key-flow-roles-work-item-type-key) |
| openapi.get.open-api-project-key-measure-chart-id | http_api | low | needs_runtime_validation | [获取度量图表明细数据](../docs/openapi/api/获取度量图表明细数据.md#capability-openapi.get.open-api-project-key-measure-chart-id) |
| openapi.get.open-api-project-key-teams-all | http_api | low | needs_runtime_validation | [获取空间下团队人员](../docs/openapi/api/获取空间下团队人员.md#capability-openapi.get.open-api-project-key-teams-all) |
| openapi.get.open-api-project-key-template-detail-template-id | http_api | low | needs_runtime_validation | [获取流程模板配置详情](../docs/openapi/api/获取流程模板配置详情.md#capability-openapi.get.open-api-project-key-template-detail-template-id) |
| openapi.get.open-api-project-key-template-list-work-item-type-key | http_api | low | needs_runtime_validation | [获取工作项下的流程模板列表](../docs/openapi/api/获取工作项下的流程模板列表.md#capability-openapi.get.open-api-project-key-template-list-work-item-type-key) |
| openapi.get.open-api-project-key-work-item-all-types | http_api | low | needs_runtime_validation | [获取空间下工作项类型](../docs/openapi/api/获取空间下工作项类型.md#capability-openapi.get.open-api-project-key-work-item-all-types) |
| openapi.get.open-api-project-key-work-item-relation | http_api | low | needs_runtime_validation | [获取工作项关系列表](../docs/openapi/api/获取工作项关系列表.md#capability-openapi.get.open-api-project-key-work-item-relation) |
| openapi.get.open-api-project-key-work-item-type-work-item-type-key | http_api | high | verified | [获取工作项基础信息配置](../docs/openapi/api/获取工作项基础信息配置.md#capability-openapi.get.open-api-project-key-work-item-type-work-item-type-key) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-meta | http_api | low | needs_runtime_validation | [获取创建工作项元数据](../docs/openapi/api/获取创建工作项元数据.md#capability-openapi.get.open-api-project-key-work-item-work-item-type-key-meta) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-comments | http_api | low | deprecated | [查询评论（不再维护）](../docs/openapi/api/查询评论（不再维护）.md#capability-openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-comments) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-wbs-view | http_api | low | needs_runtime_validation | [获取工作流详情（WBS）](../docs/openapi/api/获取工作流详情（WBS）.md#capability-openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-wbs-view) |
| openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-task | http_api | low | needs_runtime_validation | [获取子任务详情](../docs/openapi/api/获取子任务详情.md#capability-openapi.get.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-task) |
| openapi.get.open-api-task-result | http_api | low | needs_runtime_validation | [获取批量更新处理进度](../docs/openapi/api/获取批量更新处理进度.md#capability-openapi.get.open-api-task-result) |
| openapi.patch.open-api-project-key-user-group-members | http_api | low | needs_runtime_validation | [更新用户组成员](../docs/openapi/api/更新用户组成员.md#capability-openapi.patch.open-api-project-key-user-group-members) |
| openapi.post.open-api-ai-node-confirm | http_api | low | needs_runtime_validation | [完成 AI 节点](../docs/openapi/ai/完成AI节点.md#capability-openapi.post.open-api-ai-node-confirm) |
| openapi.post.open-api-ai-node-edit | http_api | low | needs_runtime_validation | [修改 AI 节点数据](../docs/openapi/ai/修改AI节点数据.md#capability-openapi.post.open-api-ai-node-edit) |
| openapi.post.open-api-ai-node-query | http_api | low | needs_runtime_validation | [获取 AI 节点信息](../docs/openapi/ai/获取AI节点信息.md#capability-openapi.post.open-api-ai-node-query) |
| openapi.post.open-api-authen-plugin-token | http_api | high | verified | [获取插件凭证](../docs/openapi/guides/获取访问凭证.md#capability-openapi.post.open-api-authen-plugin-token) |
| openapi.post.open-api-authen-refresh-token | http_api | high | verified | [刷新用户凭证](../docs/openapi/guides/获取访问凭证.md#capability-openapi.post.open-api-authen-refresh-token) |
| openapi.post.open-api-authen-user-plugin-token | http_api | high | verified | [交换用户凭证](../docs/openapi/guides/获取访问凭证.md#capability-openapi.post.open-api-authen-user-plugin-token) |
| openapi.post.open-api-comment-create | http_api | low | needs_runtime_validation | [添加评论](../docs/openapi/api/添加评论.md#capability-openapi.post.open-api-comment-create) |
| openapi.post.open-api-comment-delete | http_api | low | needs_runtime_validation | [删除评论](../docs/openapi/api/删除评论.md#capability-openapi.post.open-api-comment-delete) |
| openapi.post.open-api-comment-query | http_api | low | needs_runtime_validation | [查询评论](../docs/openapi/api/查询评论.md#capability-openapi.post.open-api-comment-query) |
| openapi.post.open-api-comment-update | http_api | low | needs_runtime_validation | [更新评论](../docs/openapi/api/更新评论.md#capability-openapi.post.open-api-comment-update) |
| openapi.post.open-api-compositive-search | http_api | low | needs_runtime_validation | [获取指定的工作项列表（全局搜索）](../docs/openapi/api/获取指定的工作项列表（全局搜索）.md#capability-openapi.post.open-api-compositive-search) |
| openapi.post.open-api-file-delete | http_api | low | needs_runtime_validation | [删除附件](../docs/openapi/api/删除附件.md#capability-openapi.post.open-api-file-delete) |
| openapi.post.open-api-intercept-project-intercept-config-create | http_api | low | needs_runtime_validation | [按空间设置拦截事件配置](../docs/openapi/events/按空间设置拦截事件配置.md#capability-openapi.post.open-api-intercept-project-intercept-config-create) |
| openapi.post.open-api-measure-charts | http_api | low | needs_runtime_validation | [通过视图ID查询所有图表](../docs/openapi/api/通过视图ID查询所有图表.md#capability-openapi.post.open-api-measure-charts) |
| openapi.post.open-api-op-record-work-item-list | http_api | low | needs_runtime_validation | [获取工作项操作记录](../docs/openapi/api/获取工作项操作记录.md#capability-openapi.post.open-api-op-record-work-item-list) |
| openapi.post.open-api-project-key-field-all | http_api | high | verified | [获取字段信息](../docs/openapi/api/获取字段信息.md#capability-openapi.post.open-api-project-key-field-all) |
| openapi.post.open-api-project-key-field-work-item-type-key-create | http_api | low | needs_runtime_validation | [创建自定义字段](../docs/openapi/api/创建自定义字段.md#capability-openapi.post.open-api-project-key-field-work-item-type-key-create) |
| openapi.post.open-api-project-key-file-resource-resource-type-upload-preprocess | http_api | low | needs_runtime_validation | [分片初始化](../docs/openapi/api/分片初始化.md#capability-openapi.post.open-api-project-key-file-resource-resource-type-upload-preprocess) |
| openapi.post.open-api-project-key-file-stream-resource-resource-type-upload-form | http_api | low | needs_runtime_validation | [上传文件](../docs/openapi/api/上传文件.md#capability-openapi.post.open-api-project-key-file-stream-resource-resource-type-upload-form) |
| openapi.post.open-api-project-key-file-stream-upload-multipart-resource-id-part-number | http_api | low | needs_runtime_validation | [上传分片](../docs/openapi/api/上传分片.md#capability-openapi.post.open-api-project-key-file-stream-upload-multipart-resource-id-part-number) |
| openapi.post.open-api-project-key-file-upload | http_api | low | needs_runtime_validation | [上传文件或富文本图片](../docs/openapi/api/上传文件或富文本图片.md#capability-openapi.post.open-api-project-key-file-upload) |
| openapi.post.open-api-project-key-file-upload-multipart-abort-resource-id | http_api | low | needs_runtime_validation | [终止分片上传](../docs/openapi/api/终止分片上传.md#capability-openapi.post.open-api-project-key-file-upload-multipart-abort-resource-id) |
| openapi.post.open-api-project-key-file-upload-multipart-finish-resource-id | http_api | low | needs_runtime_validation | [完成分片上传](../docs/openapi/api/完成分片上传.md#capability-openapi.post.open-api-project-key-file-upload-multipart-finish-resource-id) |
| openapi.post.open-api-project-key-flow-roles-work-item-type-key-create-role | http_api | low | needs_runtime_validation | [创建流程角色配置](../docs/openapi/api/创建流程角色配置.md#capability-openapi.post.open-api-project-key-flow-roles-work-item-type-key-create-role) |
| openapi.post.open-api-project-key-flow-roles-work-item-type-key-delete-role | http_api | low | needs_runtime_validation | [删除流程角色配置](../docs/openapi/api/删除流程角色配置.md#capability-openapi.post.open-api-project-key-flow-roles-work-item-type-key-delete-role) |
| openapi.post.open-api-project-key-flow-roles-work-item-type-key-update-role | http_api | low | needs_runtime_validation | [更新流程角色配置](../docs/openapi/api/更新流程角色配置.md#capability-openapi.post.open-api-project-key-flow-roles-work-item-type-key-update-role) |
| openapi.post.open-api-project-key-relation-rules | http_api | low | needs_runtime_validation | [获取空间关联规则列表](../docs/openapi/api/获取空间关联规则列表.md#capability-openapi.post.open-api-project-key-relation-rules) |
| openapi.post.open-api-project-key-relation-work-item-type-key-work-item-id-batch-bind | http_api | low | needs_runtime_validation | [绑定空间关联的关联工作项实例](../docs/openapi/api/绑定空间关联的关联工作项实例.md#capability-openapi.post.open-api-project-key-relation-work-item-type-key-work-item-id-batch-bind) |
| openapi.post.open-api-project-key-relation-work-item-type-key-work-item-id-work-item-list | http_api | low | needs_runtime_validation | [获取空间关联下的关联工作项实例列表](../docs/openapi/api/获取空间关联下的关联工作项实例列表.md#capability-openapi.post.open-api-project-key-relation-work-item-type-key-work-item-id-work-item-list) |
| openapi.post.open-api-project-key-user-group | http_api | low | needs_runtime_validation | [创建自定义用户组](../docs/openapi/api/创建自定义用户组.md#capability-openapi.post.open-api-project-key-user-group) |
| openapi.post.open-api-project-key-user-groups-members-page | http_api | low | needs_runtime_validation | [查询用户组成员](../docs/openapi/api/查询用户组成员.md#capability-openapi.post.open-api-project-key-user-groups-members-page) |
| openapi.post.open-api-project-key-view-conf-list | http_api | low | needs_runtime_validation | [获取视图列表及配置信息](../docs/openapi/api/获取视图列表及配置信息.md#capability-openapi.post.open-api-project-key-view-conf-list) |
| openapi.post.open-api-project-key-view-view-id | http_api | low | needs_runtime_validation | [获取视图下工作项列表（全景视图）](../docs/openapi/api/获取视图下工作项列表（全景视图）.md#capability-openapi.post.open-api-project-key-view-view-id) |
| openapi.post.open-api-project-key-work-item-filter | http_api | low | needs_runtime_validation | [获取指定的工作项列表（单空间）](../docs/openapi/api/获取指定的工作项列表（单空间）.md#capability-openapi.post.open-api-project-key-work-item-filter) |
| openapi.post.open-api-project-key-work-item-type-key-fix-view | http_api | low | needs_runtime_validation | [创建固定视图](../docs/openapi/api/创建固定视图.md#capability-openapi.post.open-api-project-key-work-item-type-key-fix-view) |
| openapi.post.open-api-project-key-work-item-type-key-fix-view-view-id | http_api | low | needs_runtime_validation | [更新固定视图](../docs/openapi/api/更新固定视图.md#capability-openapi.post.open-api-project-key-work-item-type-key-fix-view-view-id) |
| openapi.post.open-api-project-key-work-item-work-item-id-bot-join-chat | http_api | low | needs_runtime_validation | [拉机器人入群](../docs/openapi/api/拉机器人入群.md#capability-openapi.post.open-api-project-key-work-item-work-item-id-bot-join-chat) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-search-params | http_api | low | needs_runtime_validation | [获取指定的工作项列表（单空间-复杂传参）](../docs/openapi/api/获取指定的工作项列表（单空间-复杂传参）.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-search-params) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-create | http_api | low | deprecated | [添加评论（不再维护）](../docs/openapi/api/添加评论（不再维护）.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-create) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-download | http_api | high | verified | [下载附件](../docs/openapi/api/下载附件.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-download) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-upload | http_api | low | needs_runtime_validation | [添加附件](../docs/openapi/api/添加附件.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-file-upload) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-search-by-relation | http_api | low | needs_runtime_validation | [获取指定的关联工作项列表（单空间）](../docs/openapi/api/获取指定的关联工作项列表（单空间）.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-search-by-relation) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-subtask-modify | http_api | low | needs_runtime_validation | [子任务完成/回滚](../docs/openapi/api/子任务完成与回滚.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-subtask-modify) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record | http_api | low | needs_runtime_validation | [新增工时登记记录](../docs/openapi/api/新增工时登记记录.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-node-id-task-task-id | http_api | low | needs_runtime_validation | [更新子任务](../docs/openapi/api/更新子任务.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-node-id-task-task-id) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-query | http_api | low | needs_runtime_validation | [获取工作流详情](../docs/openapi/api/获取工作流详情.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-query) |
| openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-task | http_api | low | needs_runtime_validation | [创建子任务](../docs/openapi/api/创建子任务.md#capability-openapi.post.open-api-project-key-work-item-work-item-type-key-work-item-id-workflow-task) |
| openapi.post.open-api-project-key-workflow-work-item-type-key-work-item-id-node-node-id-operate | http_api | low | needs_runtime_validation | [节点完成/回滚](../docs/openapi/api/节点完成与回滚.md#capability-openapi.post.open-api-project-key-workflow-work-item-type-key-work-item-id-node-node-id-operate) |
| openapi.post.open-api-project-key-workflow-work-item-type-key-work-item-id-node-state-change | http_api | low | needs_runtime_validation | [状态流转](../docs/openapi/api/状态流转.md#capability-openapi.post.open-api-project-key-workflow-work-item-type-key-work-item-id-node-state-change) |
| openapi.post.open-api-projects | http_api | low | needs_runtime_validation | [获取空间列表](../docs/openapi/api/获取空间列表.md#capability-openapi.post.open-api-projects) |
| openapi.post.open-api-projects-detail | http_api | low | needs_runtime_validation | [获取空间详情](../docs/openapi/api/获取空间详情.md#capability-openapi.post.open-api-projects-detail) |
| openapi.post.open-api-template-v2-create-template | http_api | low | needs_runtime_validation | [新增流程模板](../docs/openapi/api/新增流程模板.md#capability-openapi.post.open-api-template-v2-create-template) |
| openapi.post.open-api-tenant-projects-install-list | http_api | low | needs_runtime_validation | [获取租户安装空间列表](../docs/openapi/api/获取租户安装空间列表.md#capability-openapi.post.open-api-tenant-projects-install-list) |
| openapi.post.open-api-user-query | http_api | high | verified | [获取用户详情](../docs/openapi/api/获取用户详情.md#capability-openapi.post.open-api-user-query) |
| openapi.post.open-api-user-search | http_api | low | needs_runtime_validation | [搜索租户内的用户列表](../docs/openapi/api/搜索租户内的用户列表.md#capability-openapi.post.open-api-user-search) |
| openapi.post.open-api-view-search-universal-search | http_api | low | needs_runtime_validation | [获取指定的工作项列表（全量搜索）](../docs/openapi/api/获取指定的工作项列表（全量搜索）.md#capability-openapi.post.open-api-view-search-universal-search) |
| openapi.post.open-api-view-v1-create-condition-view | http_api | low | needs_runtime_validation | [创建条件视图](../docs/openapi/api/创建条件视图.md#capability-openapi.post.open-api-view-v1-create-condition-view) |
| openapi.post.open-api-view-v1-update-condition-view | http_api | low | needs_runtime_validation | [更新条件视图](../docs/openapi/api/更新条件视图.md#capability-openapi.post.open-api-view-v1-update-condition-view) |
| openapi.post.open-api-work-item-batch-update | http_api | low | needs_runtime_validation | [批量更新工作项字段值](../docs/openapi/api/批量更新工作项字段值.md#capability-openapi.post.open-api-work-item-batch-update) |
| openapi.post.open-api-work-item-deliverable-batch-query | http_api | low | needs_runtime_validation | [交付物信息批量查询（WBS）](../docs/openapi/api/交付物信息批量查询（WBS）.md#capability-openapi.post.open-api-work-item-deliverable-batch-query) |
| openapi.post.open-api-work-item-field-options | http_api | low | needs_runtime_validation | [获取工作项指定字段可选选项](../docs/openapi/api/获取工作项指定字段可选选项.md#capability-openapi.post.open-api-work-item-field-options) |
| openapi.post.open-api-work-item-field-value-update-compound-field | http_api | low | needs_runtime_validation | [按组更新复合字段值](../docs/openapi/api/按组更新复合字段值.md#capability-openapi.post.open-api-work-item-field-value-update-compound-field) |
| openapi.post.open-api-work-item-finished-batch-query | http_api | low | needs_runtime_validation | [批量查询评审意见、评审结论](../docs/openapi/api/批量查询评审意见、评审结论.md#capability-openapi.post.open-api-work-item-finished-batch-query) |
| openapi.post.open-api-work-item-finished-query-conclusion-option | http_api | low | needs_runtime_validation | [评审结论标签值查询](../docs/openapi/api/评审结论标签值查询.md#capability-openapi.post.open-api-work-item-finished-query-conclusion-option) |
| openapi.post.open-api-work-item-finished-update | http_api | low | needs_runtime_validation | [修改评审结论和评审意见](../docs/openapi/api/修改评审结论和评审意见.md#capability-openapi.post.open-api-work-item-finished-update) |
| openapi.post.open-api-work-item-man-hour-records | http_api | low | needs_runtime_validation | [获取工作项的工时登记记录列表](../docs/openapi/api/获取工作项的工时登记记录列表.md#capability-openapi.post.open-api-work-item-man-hour-records) |
| openapi.post.open-api-work-item-relation-create | http_api | low | needs_runtime_validation | [新增工作项关系](../docs/openapi/api/新增工作项关系.md#capability-openapi.post.open-api-work-item-relation-create) |
| openapi.post.open-api-work-item-relation-update | http_api | low | needs_runtime_validation | [更新工作项关系](../docs/openapi/api/更新工作项关系.md#capability-openapi.post.open-api-work-item-relation-update) |
| openapi.post.open-api-work-item-resource-create-work-item | http_api | low | needs_runtime_validation | [创建工作项资源库](../docs/openapi/api/创建工作项资源库.md#capability-openapi.post.open-api-work-item-resource-create-work-item) |
| openapi.post.open-api-work-item-resource-project-key-work-item-id-create-instance | http_api | low | needs_runtime_validation | [通过资源创建实例](../docs/openapi/api/通过资源创建实例.md#capability-openapi.post.open-api-work-item-resource-project-key-work-item-id-create-instance) |
| openapi.post.open-api-work-item-resource-query | http_api | low | needs_runtime_validation | [获取工作项资源实例详情](../docs/openapi/api/获取工作项资源实例详情.md#capability-openapi.post.open-api-work-item-resource-query) |
| openapi.post.open-api-work-item-resource-search-params | http_api | low | needs_runtime_validation | [获取指定的工作项资源库实例列表（复杂传参）](../docs/openapi/api/获取指定的工作项资源库实例列表（复杂传参）.md#capability-openapi.post.open-api-work-item-resource-search-params) |
| openapi.post.open-api-work-item-resource-update | http_api | low | needs_runtime_validation | [更新工作项资源实例](../docs/openapi/api/更新工作项资源实例.md#capability-openapi.post.open-api-work-item-resource-update) |
| openapi.post.open-api-work-item-subtask-search | http_api | low | needs_runtime_validation | [获取指定的子任务列表（跨空间）](../docs/openapi/api/获取指定的子任务列表（跨空间）.md#capability-openapi.post.open-api-work-item-subtask-search) |
| openapi.post.open-api-work-item-transition-required-info-get | http_api | low | needs_runtime_validation | [获取指定节点/状态流转所需必填信息](../docs/openapi/api/获取指定节点与状态流转所需必填信息.md#capability-openapi.post.open-api-work-item-transition-required-info-get) |
| openapi.post.open-api-work-item-wbs-draft-create | http_api | low | needs_runtime_validation | [创建计划表草稿](../docs/openapi/api/创建计划表草稿.md#capability-openapi.post.open-api-work-item-wbs-draft-create) |
| openapi.post.open-api-work-item-wbs-draft-create-progress-query | http_api | low | needs_runtime_validation | [创建计划表草稿进度查询](../docs/openapi/api/创建计划表草稿进度查询.md#capability-openapi.post.open-api-work-item-wbs-draft-create-progress-query) |
| openapi.post.open-api-work-item-wbs-draft-detail-query | http_api | low | needs_runtime_validation | [查询计划表草稿数据行详细信息](../docs/openapi/api/查询计划表草稿数据行详细信息.md#capability-openapi.post.open-api-work-item-wbs-draft-detail-query) |
| openapi.post.open-api-work-item-wbs-draft-patch-progress-query | http_api | low | needs_runtime_validation | [更新计划表草稿查询进度](../docs/openapi/api/更新计划表草稿查询进度.md#capability-openapi.post.open-api-work-item-wbs-draft-patch-progress-query) |
| openapi.post.open-api-work-item-wbs-draft-patch-update | http_api | low | needs_runtime_validation | [更新计划表草稿](../docs/openapi/api/更新计划表草稿.md#capability-openapi.post.open-api-work-item-wbs-draft-patch-update) |
| openapi.post.open-api-work-item-wbs-draft-publish | http_api | low | needs_runtime_validation | [发布计划表草稿](../docs/openapi/api/发布计划表草稿.md#capability-openapi.post.open-api-work-item-wbs-draft-publish) |
| openapi.post.open-api-work-item-wbs-draft-publish-progress-query | http_api | low | needs_runtime_validation | [计划表草稿发布进度查询](../docs/openapi/api/计划表草稿发布进度查询.md#capability-openapi.post.open-api-work-item-wbs-draft-publish-progress-query) |
| openapi.post.open-api-work-item-wbs-draft-reset | http_api | low | needs_runtime_validation | [重置计划表草稿](../docs/openapi/api/重置计划表草稿.md#capability-openapi.post.open-api-work-item-wbs-draft-reset) |
| openapi.post.open-api-work-item-wbs-draft-reset-progress-query | http_api | low | needs_runtime_validation | [重置计划表草稿进度查询](../docs/openapi/api/重置计划表草稿进度查询.md#capability-openapi.post.open-api-work-item-wbs-draft-reset-progress-query) |
| openapi.post.open-api-work-item-wbs-draft-structure-query | http_api | low | needs_runtime_validation | [查询全量计划表草稿骨架](../docs/openapi/api/查询全量计划表草稿骨架.md#capability-openapi.post.open-api-work-item-wbs-draft-structure-query) |
| openapi.post.open-api-work-item-wbs-draft-task-conf-query | http_api | low | needs_runtime_validation | [查询计划表草稿行配置信息](../docs/openapi/api/查询计划表草稿行配置信息.md#capability-openapi.post.open-api-work-item-wbs-draft-task-conf-query) |
| openapi.post.open-api-work-item-wbs-instance-expand-query | http_api | low | needs_runtime_validation | [查询计划表扩展信息](../docs/openapi/api/查询计划表扩展信息.md#capability-openapi.post.open-api-work-item-wbs-instance-expand-query) |
| openapi.post.open-api-work-item-wbs-view-detail-query | http_api | low | needs_runtime_validation | [查询计划表行详细信息](../docs/openapi/api/查询计划表行详细信息.md#capability-openapi.post.open-api-work-item-wbs-view-detail-query) |
| openapi.post.open-api-work-item-wbs-view-structure-query | http_api | low | needs_runtime_validation | [查询全量计划表骨架](../docs/openapi/api/查询全量计划表骨架.md#capability-openapi.post.open-api-work-item-wbs-view-structure-query) |
| openapi.post.open-api-work-items-filter-across-project | http_api | low | needs_runtime_validation | [获取指定的工作项列表（跨空间）](../docs/openapi/api/获取指定的工作项列表（跨空间）.md#capability-openapi.post.open-api-work-items-filter-across-project) |
| openapi.put.open-api-ai-application-field-update | http_api | low | needs_runtime_validation | [更新 AI 字段](../docs/openapi/ai/更新AI字段.md#capability-openapi.put.open-api-ai-application-field-update) |
| openapi.put.open-api-ai-entity-update | http_api | low | needs_runtime_validation | [更新 AI 操作的运行状态](../docs/openapi/ai/更新AI操作运行状态.md#capability-openapi.put.open-api-ai-entity-update) |
| openapi.put.open-api-project-key-field-work-item-type-key | http_api | low | needs_runtime_validation | [更新自定义字段](../docs/openapi/api/更新自定义字段.md#capability-openapi.put.open-api-project-key-field-work-item-type-key) |
| openapi.put.open-api-project-key-work-item-type-work-item-type-key | http_api | low | needs_runtime_validation | [更新工作项基础信息配置](../docs/openapi/api/更新工作项基础信息配置.md#capability-openapi.put.open-api-project-key-work-item-type-work-item-type-key) |
| openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-abort | http_api | low | needs_runtime_validation | [终止/恢复工作项](../docs/openapi/api/终止与恢复工作项.md#capability-openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-abort) |
| openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-comment-id | http_api | low | deprecated | [更新评论（不再维护）](../docs/openapi/api/更新评论（不再维护）.md#capability-openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-comment-comment-id) |
| openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record | http_api | low | needs_runtime_validation | [更新工时登记记录](../docs/openapi/api/更新工时登记记录.md#capability-openapi.put.open-api-project-key-work-item-work-item-type-key-work-item-id-work-hour-record) |
| openapi.put.open-api-project-key-workflow-work-item-type-key-work-item-id-node-node-id | http_api | low | needs_runtime_validation | [更新节点/排期](../docs/openapi/api/更新节点与排期.md#capability-openapi.put.open-api-project-key-workflow-work-item-type-key-work-item-id-node-node-id) |
| openapi.put.open-api-template-v2-update-template | http_api | low | needs_runtime_validation | [更新流程模板](../docs/openapi/api/更新流程模板.md#capability-openapi.put.open-api-template-v2-update-template) |
| openapi.put.open-api-work-item-freeze | http_api | low | needs_runtime_validation | [冻结/解冻工作项](../docs/openapi/api/冻结与解冻工作项.md#capability-openapi.put.open-api-work-item-freeze) |
| openapi.work-item.create | http_api | high | verified | [创建工作项](../docs/openapi/api/创建工作项.md#capability-openapi.work-item.create) |
| openapi.work-item.get | http_api | high | verified | [获取工作项详情](../docs/openapi/api/获取工作项详情.md#capability-openapi.work-item.get) |
| openapi.work-item.update | http_api | high | verified | [更新工作项](../docs/openapi/api/更新工作项.md#capability-openapi.work-item.update) |
| plugin-point.button | plugin_point | high | verified | [按钮 / Button](../docs/plugin/points/按钮 Button.md#capability-plugin-point.button) |
| plugin-point.configuration | plugin_point | high | verified | [插件配置 / Configuration](../docs/plugin/points/插件配置 Configuration.md#capability-plugin-point.configuration) |
| plugin-point.connector | plugin_point | low | needs_runtime_validation | [自动化连接器 / Connector](../docs/plugin/points/自动化连接器 Connector.md#capability-plugin-point.connector) |
| plugin-point.control | plugin_point | high | verified | [控件 / Control](../docs/plugin/points/控件 Control.md#capability-plugin-point.control) |
| plugin-point.custom-field | plugin_point | medium | needs_runtime_validation | [扩展字段-字段类型 / CustomField](../docs/plugin/points/扩展字段-字段类型 CustomField.md#capability-plugin-point.custom-field) |
| plugin-point.intercept | plugin_point | low | needs_runtime_validation | [拦截事件 / Intercept](../docs/plugin/points/拦截事件 Intercept.md#capability-plugin-point.intercept) |
| plugin-point.lite-app-component | plugin_point | medium | needs_runtime_validation | [轻应用组件 / LiteAppComponent](../docs/plugin/points/轻应用组件 LiteAppComponent.md#capability-plugin-point.lite-app-component) |
| plugin-point.page | plugin_point | medium | needs_runtime_validation | [导航功能页 / Page](../docs/plugin/points/导航功能页 Page.md#capability-plugin-point.page) |
| plugin-point.schedule | plugin_point | medium | needs_runtime_validation | [扩展字段-节点排期 / Schedule](../docs/plugin/points/扩展字段-节点排期 Schedule.md#capability-plugin-point.schedule) |
| plugin-point.tab | plugin_point | high | verified | [详情标签页 / Tab](../docs/plugin/points/详情标签页 Tab.md#capability-plugin-point.tab) |
| plugin-point.view | plugin_point | medium | needs_runtime_validation | [视图模式 / View](../docs/plugin/points/视图模式 View.md#capability-plugin-point.view) |
