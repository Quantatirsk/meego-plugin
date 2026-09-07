# JSSDK：shared.setSharedModules

`window.JSSDK.shared.setSharedModules()` 向插件沙箱注册 React、ReactDOM 等共享模块，使依赖这些模块的宿主注入资源可以加载。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.36.0+ |

官方示例传入 `React` 和 `ReactDOM`，二者分别是 `react` 和 `react-dom` 的默认导出；属性名区分大小写。方法返回 `Promise<void>`，必须等待完成后才加载消费注入资源的模块。

共享模块不是数据存储。平台资料未提供 React 或 ReactDOM 的完整版本兼容矩阵，也没有说明省略某个模块时的所有行为。

## 调用示例

```ts
await window.JSSDK.shared.setSharedModules({
  React,
  ReactDOM,
});

const appModule = await loadPluginModule();
```

其中 `React` 和 `ReactDOM` 分别是对应包的默认导出，`loadPluginModule` 是插件实现。延迟加载消费注入资源的模块是实现建议：它避免入口过早加载这类依赖。

## Fixture 表达

JSON 不能承载 JavaScript 模块导出，因此 fixture 使用模块名表示输入位置，不能作为实际调用参数的序列化格式。

对应 fixture：[shared.setSharedModules](../../fixtures/jssdk/shared-set-shared-modules.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/yrdbq8to
