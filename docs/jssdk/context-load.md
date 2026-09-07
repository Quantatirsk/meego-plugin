# JSSDK：Context.load

`window.JSSDK.Context.load()` 加载平台级上下文。它不替代各插件点位的上下文 API，因此不应用它推断空间、工作项或节点。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

方法无参数，返回 `Promise<Context>`。解析的 Context 提供以下已定义信息：

| 属性或方法 | 值或类型 |
| --- | --- |
| `language` | `"zh_CN"`、`"en_US"` 或 `"ja_JP"` |
| `colorScheme` | `"light"` 或 `"dark"` |
| `loginUser` | 当前登录用户信息 |
| `watch` | 监听平台上下文并返回取消函数 |
| `getCustomContext<T>()` | 仅网页端、仅在由 `modal.open` 打开的自定义弹窗内读取打开方传入的 `options.context` |

## 调用示例

```ts
const context = await window.JSSDK.Context.load();

applyColorScheme(context.colorScheme);
applyLanguage(context.language);
```

`applyColorScheme` 和 `applyLanguage` 是插件实现，不是 JSSDK 方法。

## 未定义项

来源没有逐项规定 `watch` 的所有触发条件，也没有将 `loginUser` 的完整字段集合声明为跨版本固定协议。不要把点位上下文或业务权限结论附加到 `Context.load()` 的返回值上。

对应 fixture：[Context.load](../../fixtures/jssdk/context-load.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/zq8fg6bl
