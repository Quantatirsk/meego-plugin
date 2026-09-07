# 拦截事件 / Intercept

拦截事件在用户操作执行前调用插件服务端，由插件决定是否阻止本次操作；需要后续交互时，再加载插件客户端弹窗。例如在某个项目阶段禁止直接修改字段，并引导用户发起审批。

| 服务端结论 | 平台行为 |
| --- | --- |
| `need_intercept: true` | 阻止本次操作，并将提示与自定义数据交给客户端 |
| `need_intercept: false` | 放行本次操作 |
| 1000 ms 内没有返回有效结论 | 按不拦截处理，放行本次操作 |

响应期限以 [服务端拦截事件协议](<../../openapi/events/拦截事件.md#67f9ea56>) 的 1000 ms 为准。插件拦截后，平台不会继续执行原操作的后续逻辑；插件应说明原因并提供适当的后续入口。关闭弹窗本身不等于恢复被拦截的操作。

点位支持网页端和移动端，客户端 `intercept.getContext()` 在移动端要求 V7.35.0+。服务端协议和客户端上下文分别见 [拦截事件](<../../openapi/events/拦截事件.md>) 与 [Intercept JSSDK](<../jssdk/Intercept.md>)。

![网页端拦截交互](<../assets/6f48a3218b2ca55d28b16990.gif>)

![移动端拦截交互](<../assets/c39e6c31506a98ab3b61e162.gif>)

<a id="cc2ff96e"></a>

## 管理员安装与生效顺序

1. 在“插件管理 > 添加插件”搜索插件，或通过分享链接安装。
2. 安装后，用户在对应页面执行已订阅操作时，插件拦截逻辑生效。

一个空间安装多个包含相同拦截点位的插件时，按插件安装先后顺序生效。原文没有进一步定义多插件结论如何组合，不应据此推导所有回调并行执行或每次都会执行全部插件。

<a id="ea8d2f1f"></a>

## 开发流程

<a id="18d969a2"></a>

### 服务端判断与客户端衔接

![拦截事件业务交互流程](<../assets/763424f3199f455a9f001d61.png>)

1. 配置并发布拦截点位，目标空间安装对应插件版本。
2. 用户操作命中事件后，平台向插件 Webhook 推送事件与工作项信息。
3. 服务端在 1000 ms 内判断，返回拦截结论、提示和需要透传的数据。
4. 若拦截且允许展示插件界面，平台加载对应端的资源；客户端读取拦截上下文，展示说明或衔接审批等业务。

这里只同步完成拦截判断。需要用户输入或耗时业务时，应由后续界面与业务服务承接，不能让同步判定等待完整审批流程。

<a id="1455e40d"></a>

### 开发者后台配置

添加“拦截事件”构成。一个插件可订阅多个拦截事件。

| 配置项 | 说明 | 示例 |
| --- | --- | --- |
| 拦截事件名称 | 对应功能点名称 | 拦截新建动作 |
| 描述 | 拦截条件与用途 | 未完成培训时不允许新建需求 |
| 工作项类型 | 全部、需求、缺陷、版本、迭代、其他工作项 | 全部 |
| 触发事件类型 | 选择订阅的操作事件 | 创建工作项 |
| 回调接口 | 接收实例信息与事件内容的 Webhook | `https://webhook.site/` |
| 回调 Token | 用于校验推送来源，按事件验签协议处理 | 自定义 Token |
| 适用端 | 网页端、移动端；分别实现客户端界面 | 网页端 |
| resourceId | 对应端代码资源的唯一标识，双端分别定义 | `intercept_resource_web` |

Webhook 需要支持公网访问，按 [事件兼容性与验签](<../../openapi/events/事件兼容性与验签.md>) 验证请求。配置变更应通过发布版本和安装相应版本生效，不能套用自动化连接器的配置热更新规则。

<a id="c28111ef"></a>

### 事件类型

以下保留本点位原文的枚举成员与编码。服务端的请求字段及变更明细见 [事件列表](<../../openapi/events/拦截事件.md#e514bf06>)。

| 分类 | 枚举成员 | 编码 | 事件 |
| --- | --- | --- | --- |
| 工作项 | `CreateWorkItem` | 1001 | 创建工作项 |
| 工作项 | `DeleteWorkItem` | 1002 | 删除工作项 |
| 工作项 | `BatchDeleteWorkItem` | 1003 | 批量删除工作项 |
| 工作项 | `RecoveryWorkItem` | 1004 | 恢复工作项 |
| 工作项 | `AbortWorkItem` | 1005 | 终止工作项 |
| 工作项 | `UpgradeTemplate` | 1006 | 模板升级 |
| 工作项 | `BatchUpgradeTemplate` | 1007 | 批量模板升级 |
| 工作项 | `ExportWorkItem` | 1008 | 导出工作项 |
| 工作项 | `EditField` | 1009 | 修改字段 |
| 工作项 | `BatchEditField` | 1010 | 批量修改字段 |
| 计划表 | `PublishDraft` | 1011 | 发布草稿 |
| 计划表 | `CreateDraft` | 1012 | 创建草稿 |
| 节点 | `FinishNode` | 2001 | 完成节点 |
| 节点 | `DeleteNode` | 2002 | 删除节点 |
| 节点 | `RecoveryNode` | 2003 | 恢复节点 |
| 节点 | `RollBackNode` | 2004 | 回滚节点 |
| 节点 | `EditSchedule` | 2005 | 填写排期与估分 |
| 节点 | `EditNodeOwner` | 2006 | 修改节点负责人 |
| 状态 | `UpdateState` | 3001 | 变更状态 |
| 子任务 | `NewSubTask` | 4001 | 新增子任务 |
| 子任务 | `DeleteSubTask` | 4002 | 删除子任务 |
| 子任务 | `FinishSubTask` | 4003 | 完成子任务 |
| 子任务 | `UnFinishSubTask` | 4004 | 取消完成子任务 |
| 子任务 | `EditSubTaskOwner` | 4005 | 修改子任务负责人 |
| 子任务 | `EditSubTaskEstimate` | 4006 | 修改子任务估分 |
| 子任务 | `EditSubTaskSchedule` | 4007 | 修改子任务排期 |
| 子任务 | `EditSubTaskActualWorkload` | 4008 | 修改子任务实际工时 |

服务端文档另外定义了 [2008：修改排期联动子项](<../../openapi/events/拦截事件.md#45ad905b>)。本点位的旧枚举没有该项，不能把上表当成服务端全部事件的封闭列表；具体 SDK 成员名应查当前 [通用类型定义](<../jssdk/通用类型定义.md#8717ee48>)。

<a id="eadcdf10"></a>

### 拦截结论与弹窗开关

`need_intercept` 决定是否阻止操作；`intercept_options.disable_show_plugin` 只控制是否展示插件拦截弹窗。这两个字段各自生效，隐藏弹窗不会放行已被拦截的操作。

| 响应字段 | 含义 |
| --- | --- |
| `need_intercept` | boolean，true 拦截、false 放行 |
| `msg` | 以 `zh`、`en`、`ja` 提供各语言提示 |
| `custom_data` | 向插件客户端透传的业务数据 |
| `intercept_options.disable_show_plugin` | true 时不唤起插件拦截弹窗 |

以下示例阻止操作并关闭插件弹窗，保留原示例的空提示与空自定义数据；业务中应按实际情况提供提示。

```json
{
  "need_intercept": true,
  "msg": { "zh": "", "en": "", "ja": "" },
  "custom_data": "",
  "intercept_options": { "disable_show_plugin": true }
}
```

完整请求与响应契约见 [事件结构](<../../openapi/events/拦截事件.md#6415c40d>)。

<a id="98f8c853"></a>

## 客户端上下文

仅在拦截事件自定义弹窗中调用 [intercept.getContext()](<../jssdk/Intercept.md#910857e8>)。客户端通过 `message`、`eventType`、`workItems`、`customData` 接收提示、事件类型、受影响实例及透传业务数据；它们与服务端字段存在命名转换，不能直接将服务端响应对象当作 JSSDK 上下文。

```typescript
const context = await window.JSSDK.intercept.getContext<unknown>();
console.log(context.eventType);
console.log(context.message);
console.log(context.workItems);
console.log(context.customData);
```

`customData` 的实际结构由业务双方约定，使用前校验。原例的事件类型为 `1001`；不同事件对应不同的变更明细，应按事件类型读取。插件弹窗如依赖注入 UI 组件，需要按 [shared](<../jssdk/shared.md>) 初始化；这与 [脚本模式](<../client/脚本模式.md>) 的短任务容器不同。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/1s5ly1az
