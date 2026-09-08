# Intercept

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.intercept.get-context"></a>
- **Intercept.getContext** ｜ `jssdk.intercept.get-context` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.intercept.getContext()` 用于在拦截事件自定义弹窗内读取本次拦截的提示、事件类型、工作项变更明细，以及服务端透传的业务数据。它读取已经发生的拦截上下文；是否拦截由插件服务端的响应决定。

点位配置与调用顺序见 [拦截事件 / Intercept](<../points/拦截事件 Intercept.md>)。

<a id="6b348370"></a>

## 支持说明

| 能力 | 网页端 | 移动端 | 适用位置 |
| --- | --- | --- | --- |
| `intercept.getContext()` | 支持 | V7.35.0+ | 拦截事件自定义弹窗 |

官方页面将移动端下限标为 V7.35.0+，SDK 2.1.8 的方法注释标为 7.22.0。本文采用页面更保守的 V7.35.0+；现有资料不能确认 7.22.0 至 7.34.x 的完整支持范围。

<a id="910857e8"></a>

## getContext：读取当前拦截上下文

无运行时参数，返回 `Promise<InterceptFeatureContext<T>>`。泛型 `T` 仅描述 `customData`，不会改变 `workItems` 的类型，也不会校验或转换宿主实际返回的数据。

SDK 2.1.8 的 `getContext` 泛型默认值为 `any`。业务未建立并校验透传数据契约时，应显式调用 `getContext<unknown>()`，在读取其属性前完成类型收窄。

<a id="cff9ed66"></a>

### 返回值

| 属性 | 类型 | 含义 |
| --- | --- | --- |
| `message` | `string` | 当前拦截的提示信息 |
| `eventType` | [InterceptEvent](<通用类型定义.md#8717ee48>) | 当前触发拦截的事件类型 |
| `workItems` | 工作项数组 | 每项包含 `BriefWorkItem` 的关键属性及可选的 `changedValue`，详见下节 |
| `customData` | `T` | 插件服务端返回并透传给客户端的自定义数据 |

`eventType` 的 SDK 枚举与服务端完整事件列表需分别查阅。SDK 2.1.8 声明的枚举不能用来断言服务端只存在这些事件；事件编码与业务含义见 [服务端事件列表](<../../openapi/events/拦截事件.md#e514bf06>)。

<a id="table-content-1"></a>

### workItems：工作项与变更明细

SDK 中每项的类型为 `BriefWorkItem` 与包含可选 `changedValue` 的对象的交叉类型。原稿中缺失的工作项基础类型已按 SDK 2.1.8 补全。

| 属性 | 类型 | 必有 | 含义 |
| --- | --- | --- | --- |
| `id` | `number` | 是 | 工作项实例 ID |
| `name` | `string` | 是 | 工作项实例名称 |
| `spaceId` | `string` | 是 | 所属空间标识 |
| `workObjectId` | `string` | 是 | 工作项类型标识 |
| `changedValue` | 对象 | 否 | 当前事件的变更明细，内容随事件类型变化 |

`changedValue` 使用客户端 camelCase 属性名。以下成员均可缺省，不能假定每次调用都有字段、节点、子任务和状态变更。

| `changedValue` 属性 | 结构 | 含义与使用边界 |
| --- | --- | --- |
| `fieldInfo` | 字段变更对象数组 | 工作项字段变更，元素结构见下表 |
| `nodeInfo` | SDK 未细化内部结构 | 节点相关信息；读取前按实际事件校验 |
| `subTaskInfo` | SDK 未细化内部结构 | 子任务相关信息；读取前按实际事件校验 |
| `transitionInfo` | SDK 未细化内部结构 | 状态变更相关信息；读取前按实际事件校验 |

SDK 将后三个成员声明为 `any`，并未提供可直接采用的客户端字段契约。接入代码应先将它们作为 `unknown` 处理，再根据已验证的数据结构收窄；不要从服务端样例推导其全部嵌套属性。

`fieldInfo` 的每个元素如下：

| 属性 | 类型 | 必有 | 含义 |
| --- | --- | --- | --- |
| `fieldKey` | `string` | 是 | 字段 key |
| `fieldType` | `string` | 否 | 字段类型 |
| `alias` | `string` | 否 | 字段对接标识 |
| `beforeFieldValue` | `unknown` | 否 | 变更前的字段值 |
| `afterFieldValue` | `unknown` | 否 | 触发当前变更时的字段值 |

字段值需按实际类型判断；不能因为存在 `fieldType`，就把值直接断言为字符串、数字或某种对象。属性缺省与显式返回 `null` 也应按业务需要区分。

### 与服务端拦截事件的边界

服务端 Webhook 接收 [拦截事件 payload](<../../openapi/events/拦截事件.md#6415c40d>)，客户端则接收 SDK 整理后的 `InterceptFeatureContext<T>`。两者有关联，但结构不相同。

| 数据用途 | 服务端协议 | 客户端上下文 |
| --- | --- | --- |
| 事件类型 | `data.event_type` | `eventType` |
| 工作项及变更 | `data.work_item_info` 及对应事件的变更字段 | `workItems` 与每项的 `changedValue` |
| 字段变更属性 | `field_key`、`before_field_value`、`after_field_value` 等 | `fieldKey`、`beforeFieldValue`、`afterFieldValue` 等已声明属性 |
| 拦截提示 | 响应中的 `msg` 多语言对象 | `message` 字符串 |
| 透传业务数据 | 响应中的 `custom_data` | `customData` |

服务端还定义了请求签名、幂等标识、操作者信息，以及 `need_intercept`、`intercept_options` 等响应字段；这些不属于本方法声明的顶层返回属性。服务端的 `field_info` 与子任务 `field_infos` 等差异，也不能通过递归改名直接转换成客户端结构。

`customData` 的业务结构由服务端与客户端约定。泛型不会自动执行 JSON 解析；若业务约定透传 JSON 字符串，应验证它确为字符串，再显式解析并校验内容。不要将服务端完整响应强制断言为客户端上下文。

<a id="e32654dd"></a>

## 示例：读取提示与字段变更

以下代码在拦截事件自定义弹窗中调用，保留 `customData` 为 `unknown`。原文示例的提示为“无权限操作，请先发起审批”，事件编码为 `1001`；实际内容取决于触发事件和服务端响应，不能将这两个值硬编码为每次调用的预期结果。

```typescript
import type { InterceptFeatureContext } from '@lark-project/js-sdk';

async function readInterceptContext(): Promise<void> {
  try {
    const context: InterceptFeatureContext<unknown> =
      await window.JSSDK.intercept.getContext<unknown>();

    console.log(context.message);
    console.log(context.eventType);
    console.log(context.customData);

    for (const workItem of context.workItems) {
      console.log(workItem.id, workItem.name);

      for (const change of workItem.changedValue?.fieldInfo ?? []) {
        console.log(change.fieldKey, change.fieldType, change.alias);
        console.log(change.beforeFieldValue, change.afterFieldValue);
      }
    }
  } catch (error: unknown) {
    console.error('Unable to read intercept context', error);
  }
}

await readInterceptContext();
```

官方页面和 SDK 声明没有列出本方法专属的错误码或错误类型。示例捕获读取失败，但不把 Promise 拒绝解释为服务端放行，也不在客户端修改拦截结论。关闭弹窗与重新执行业务操作是不同动作，后续处理见 [拦截点位流程](<../points/拦截事件 Intercept.md#18d969a2>)。

## 相关资料与校订记录

- [通用类型定义：InterceptEvent](<通用类型定义.md#8717ee48>)：SDK 声明的事件枚举与类型范围。
- [Context](<Context.md>)：平台级上下文；其自定义弹窗上下文接口与本页的拦截上下文接口用途不同。
- [服务端拦截事件](<../../openapi/events/拦截事件.md>)：完整事件、拦截响应与验签要求。
- 依据 `@lark-project/js-sdk` 2.1.8 的 `InterceptFeatureContext<T>`、`BriefWorkItem` 与 `Intercept.getContext` 声明补全工作项结构，移除原稿损坏的类型片段和不受约束的泛型示例，保留全部原锚点。
- 移动端以官方页面的 V7.35.0+ 为接入下限；SDK 注释中的较早版本、未细化的变更对象结构及专属错误行为仍需宿主环境验证，本文不补造协议。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/282nm7ww
