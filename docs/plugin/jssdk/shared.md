# shared

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.shared.set-shared-modules"></a>
- **shared.setSharedModules** ｜ `jssdk.shared.set-shared-modules` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.shared.set-shared-modules.fixture`](<../../../fixtures/jssdk/shared-set-shared-modules.json>)

<!-- capability-metadata:end -->

`window.JSSDK.shared` 向插件沙箱配置 React、ReactDOM 等共享模块。沙箱根据共享依赖和当前运行环境加载可注入资源，例如客户端原生 UI 组件库。共享通用库有助于减少插件包体积，并保持与宿主环境兼容。

共享模块是运行时依赖，不是业务数据存储；保存本地字符串数据使用 [storage](<storage.md>)。相关概念见[客户端术语](<../client/客户端术语.md>)。

<a id="2b1e897a"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `setSharedModules` | 支持 | V7.36.0+ |

原文没有按点位限制该方法。只有在当前端提供、且共享依赖满足时，对应注入资源才会加载；不能由方法可用推导出全部资源跨端可用。

<a id="0b5624f3"></a>

## setSharedModules：注册共享模块

<a id="c61c1030"></a>

方法接受一个模块对象。按官方示例传入以下属性；原文未定义省略属性时的完整行为。

| 属性 | 值 | 说明 |
| --- | --- | --- |
| `React` | `react` 包的默认导出 | 提供 React 能力 |
| `ReactDOM` | `react-dom` 包的默认导出 | 提供 ReactDOM 能力；属性名区分大小写 |

<a id="5c91af94"></a>

返回 `Promise<void>`。必须等待该 Promise 完成，再消费依赖这些模块的注入资源。

<a id="5e930bb1"></a>

### 单独初始化共享模块

```javascript
import React from "react";
import ReactDOM from "react-dom";

export function initShared() {
  return window.JSSDK.shared.setSharedModules({
    React,
    ReactDOM,
  });
}
```

调用方应 `await initShared()`。初始化函数将原 Promise 返回，不会提前报告资源已就绪。

<a id="75cd4339"></a>

## 可注入资源

| 资源 | 共享依赖 | 可用端 |
| --- | --- | --- |
| `@lark-project/ui-kit-plugin` | React、ReactDOM | 网页端 |
| `@lark-project/ui-kit-plugin/mobile` | React、ReactDOM | 移动端 |

组件使用方式见[客户端组件库接入](<../components/客户端组件库接入.md>)。原文没有在本篇规定 React、ReactDOM 的版本矩阵，不应据此假定任意版本均兼容。

<a id="d7f829f2"></a>

## 资源注入顺序

1. 提供注入资源依赖的共享模块。缺少依赖时，对应资源不会加载。
2. 等待 `setSharedModules` 完成；资源包含网络加载过程。
3. 再加载和渲染消费这些资源的组件，包括通过 `import` 引用资源的模块。

仅把组件渲染推迟到初始化之后还不够：入口中的静态 `import` 会先加载依赖模块。应将消费注入资源的代码放在延迟加载的 `App` 及其依赖中。

<a id="ebeabbc9"></a>

## 完整入口示例

以下写法与典型插件入口一致。`./App` 为业务组件，其依赖的注入资源在共享模块就绪后才会被加载。

```jsx
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

const App = lazy(() => import("./App"));

export default async function main() {
  await window.JSSDK.shared.setSharedModules({
    React,
    ReactDOM,
  });

  const container = document.createElement("div");
  container.id = "app";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>,
  );
}
```

该示例依赖支持 `createRoot` 的 ReactDOM 版本以及项目的 JSX 构建环境。它展示官方推荐的加载顺序，不单独规定 SDK 支持的 React 版本。

## 验证样例

[`shared.setSharedModules()`](<../../../fixtures/jssdk/shared-set-shared-modules.json>)以模块名表示默认导出的位置；JSON 不能序列化实际模块对象，且完整版本兼容矩阵仍是 `source_silent`。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/yrdbq8to
