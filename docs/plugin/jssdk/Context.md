# Context

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.context.get-custom-context"></a>
- **Context.getCustomContext** ｜ `jssdk.context.get-custom-context` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.context.load"></a>
- **Context.load** ｜ `jssdk.context.load` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.context.load.fixture`](<../../../fixtures/jssdk/context-load.json>)
<a id="capability-jssdk.context.watch"></a>
- **Context.watch** ｜ `jssdk.context.watch` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`Context` 提供平台级上下文：登录用户、语言偏好和色彩方案。先调用 `window.JSSDK.Context.load()` 得到上下文实例，再读取属性、监听变化或获取自定义弹窗传入的数据。

空间、工作项、节点等信息来自对应点位的上下文，不应假设都包含在 `Context` 中。客户端用户信息可用于界面展示和业务判断，但不能代替服务端接口本身的权限校验。

**阅读导航**：[端支持](#672d368b) · [加载上下文](#f511e728) · [返回数据](#context-data) · [监听与取消](#cec0cd73) · [弹窗上下文](#ddab42c2) · [点位上下文](#feature-context)

<a id="672d368b"></a>

## 端支持

| 能力 | 网页端 | 移动端 |
| --- | --- | --- |
| `Context.load()` | 支持 | `V7.35.0+` |
| `language`、`colorScheme`、`loginUser` | 支持 | `V7.35.0+` |
| `context.watch()` | 支持 | `V7.35.0+` |
| `context.getCustomContext()` | 支持，仅限对应自定义弹窗场景 | 不支持 |

`loginUser` 内的 `tenantId` 另有移动端 `7.37` 的最低版本要求，且为可选属性，详见 [User](<通用类型定义.md#ca46701a>)。

<a id="f511e728"></a>

## load：加载平台上下文

调用形式为 `window.JSSDK.Context.load()`，无入参，返回 `Promise<Context>`。后续 `watch()` 和 `getCustomContext()` 都在解析得到的实例上调用。

<a id="4ef2d6c2"></a>

### 示例

```typescript
const context = await window.JSSDK.Context.load();

console.log(context.language);
console.log(context.colorScheme);
console.log(context.loginUser);
```

原文展示的语言与色彩示例分别为 `en_US`、`dark`，实际值取决于当前用户。

<a id="54b911c3"></a>
<a id="42a8b77b"></a>
<a id="context-data"></a>

### 返回数据与实例方法

| 属性或方法 | 类型 | 含义 |
| --- | --- | --- |
| `language` | `"zh_CN"`、`"en_US"`、`"ja_JP"` | 当前用户语言偏好 |
| `colorScheme` | `"light"`、`"dark"` | 当前用户色彩方案 |
| `loginUser` | [User](<通用类型定义.md#ca46701a>) | 当前登录用户信息 |
| `watch` | 接收回调并返回取消函数 | [监听平台上下文变化](#cec0cd73) |
| `getCustomContext` | 泛型方法，返回 `Promise<T>` | [读取自定义弹窗上下文](#ddab42c2) |

<a id="cec0cd73"></a>

## watch：监听上下文变化

调用形式为 `context.watch(callback)`。当平台上下文发生该方法所支持的变化时，执行回调；它不是任意工作项字段的监听器。需要监听表单字段变化时，应使用对应点位 API。

官方页面未逐项列出所有属性的触发条件，不能仅凭字段出现在 `Context` 对象中，就认定该字段变化必然触发回调。

<a id="89bf6ebf"></a>

### 参数

| 参数 | 类型 | 含义 |
| --- | --- | --- |
| `callback` | `(nextContext: Context) => void` | 接收变化后的上下文 |

<a id="3d75072e"></a>
<a id="a674499d"></a>

### 返回值：Unwatch

直接返回取消监听函数，形状为 `() => void`，不是 Promise。页面或组件不再需要该订阅时调用此函数，避免继续处理变化。

不要与 Tab、Control 等点位的异步表单监听方法混用返回类型；那些方法的取消函数需按各自契约获取。

<a id="de6fab31"></a>

### 订阅示例

以下封装先加载 Context，再把取消函数返回给调用方。调用方等待 `subscribePlatformContext` 完成后，保存返回函数，并在视图销毁时调用。

```typescript
import type { Context } from '@lark-project/js-sdk';

export async function subscribePlatformContext(
  onChange: (nextContext: Context) => void,
): Promise<() => void> {
  const context = await window.JSSDK.Context.load();
  return context.watch(onChange);
}
```

<a id="ddab42c2"></a>
<a id="67da8c94"></a>

## getCustomContext：读取弹窗上下文

`context.getCustomContext<T>()` 无入参，返回 `Promise<T>`。它仅用于网页端由 [modal.open](<modal.md#8ab02bbb>) 打开的自定义弹窗，读取打开弹窗时传入的 `options.context`。

这里的 `T` 是业务数据类型，不是平台 `Context` 类型。泛型只帮助 TypeScript 检查调用代码，不执行运行时数据校验；传入数据与读取数据应使用一致的结构。

<a id="51713148"></a>

### 传入与读取示例

下面保留原示例的 `{ a: 1, b: 2 }` 数据。根据 `modal.open` 的定义补齐 `entry`：它必须对应插件入口文件中已经导出的弹窗渲染入口；示例名 `FeatureModal` 需按工程配置替换。这里只展示上下文传递，不包含弹窗页面的完整渲染代码。

在打开弹窗的一侧：

```typescript
type ExampleModalContext = { a: number; b: number };

await window.JSSDK.modal.open<ExampleModalContext>({
  entry: 'FeatureModal',
  context: { a: 1, b: 2 },
});
```

在 `FeatureModal` 对应的弹窗页面内：

```typescript
type ExampleModalContext = { a: number; b: number };

const context = await window.JSSDK.Context.load();
const props = await context.getCustomContext<ExampleModalContext>();

console.log(props);
```

按 [modal.open](<modal.md#def9b6b7>) 的约束，传入上下文应为静态数据，不支持 React 节点或函数。弹窗内部的确认与关闭另见 [containerModal](<containerModal.md>)，不要把获取上下文与提交结果混为一次操作。

<a id="feature-context"></a>

## 获取点位上下文

原文列出的点位 API 如下；各点位的方法返回其自身场景中的空间、工作项等信息，字段是否存在仍取决于具体场景。

| 点位 | 官方 API |
| --- | --- |
| 导航功能页 | [Page](<Page.md>) |
| 详情标签页 | [Tab](<Tab.md>) |
| 控件 | [Control](<Control.md>) |
| 按钮 | [Button](<Button.md>) |
| 视图模式 | [View](<View.md>) |
| 插件配置 | [Configuration](<Configuration.md>) |
| 拦截事件 | [Intercept](<Intercept.md>) |
| 排期扩展 | [Schedule](<Schedule.md>) |
| 字段类型扩展 | [CustomField](<CustomField.md>) |

## 验证样例

[`Context.load()`](<../../../fixtures/jssdk/context-load.json>)包含无参数加载时的语言与色彩方案返回，并记录 `Context.watch()` 完整触发字段集合未定义的边界。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/zq8fg6bl
