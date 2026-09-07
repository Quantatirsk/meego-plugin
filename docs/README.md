# 飞书项目插件能力资料

本目录收录可复用的飞书项目平台能力。每篇只描述平台提供的点位、客户端契约、服务端接口或回调规则；业务字段、页面内容、存储策略与访问规则由使用方自行定义。

## 阅读顺序

1. 需要在宿主界面中增加入口时，先选择对应的[插件点位](plugin/control.md)。
2. 需要读取宿主运行信息时，查阅[JSSDK 控件上下文](plugin/control-get-context.md)。
3. 需要由服务端读取或写入平台数据时，先阅读[凭证与权限](openapi/credentials-permissions.md)，再阅读精确的工作项接口。
4. 需要接收平台回调时，先实现[事件验签](events/webhook-signature.md)，再扩展到具体事件类型。

## 高频能力

高频能力来自本地插件源码中的可达静态调用，不代表线上遥测。它们都具有独立能力页、类型化契约和可机器读取的 fixture；其余能力通过 `meego resolve` 返回状态和官方 URL，不能因此被当作已经验证。

| 分类 | 能力 |
| --- | --- |
| 插件点位 | [Control](plugin/control.md)、[Tab](plugin/tab.md)、[Configuration](plugin/configuration.md)、[Button](plugin/button.md) |
| JSSDK 上下文 | [Control](plugin/control-get-context.md)、[Tab](jssdk/tab-get-context.md)、[Button](jssdk/button-get-context.md)、[Configuration](jssdk/configuration-get-context.md)、[Context.load](jssdk/context-load.md) |
| JSSDK 运行时 | [shared.setSharedModules](jssdk/shared-set-shared-modules.md)、[storage.getItem](jssdk/storage-get-item.md)、[storage.setItem](jssdk/storage-set-item.md)、[storage.removeItem](jssdk/storage-remove-item.md)、[containerModal.close](jssdk/container-modal-close.md) |
| JSSDK 提示 | [toast.error](jssdk/toast-error.md)、[toast.success](jssdk/toast-success.md)、[toast.warning](jssdk/toast-warning.md)、[toast.info](jssdk/toast-info.md) |
| OpenAPI 凭证 | [插件凭证](openapi/plugin-token.md)、[用户凭证](openapi/user-plugin-token.md)、[刷新凭证](openapi/refresh-token.md)、[凭证与权限](openapi/credentials-permissions.md) |
| OpenAPI 数据 | [字段信息](openapi/field-all.md)、[用户详情](openapi/user-query.md)、[工作项类型](openapi/work-item-type-config.md)、[获取工作项](openapi/work-item-get.md)、[创建工作项](openapi/work-item-create.md)、[更新工作项](openapi/work-item-update.md)、[下载附件](openapi/work-item-file-download.md) |
| 事件 | [回调验签](events/webhook-signature.md)、[监听事件](events/listener-delivery.md)、[拦截事件](events/intercept-response.md)、[Control 新建回调](events/control-create-callback.md) |

fixture 用于理解契约和本地验证，不携带可用凭证，也不构成任何远程调用授权。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/nh4exbsn
