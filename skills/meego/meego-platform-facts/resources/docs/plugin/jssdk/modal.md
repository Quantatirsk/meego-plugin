# modal

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.modal.confirm"></a>
- **modal.confirm** ｜ `jssdk.modal.confirm` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.modal.open"></a>
- **modal.open** ｜ `jssdk.modal.open` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.modal` 用于显示确认框，或从已导出的资源模块打开自定义弹窗。确认框结果通过回调获得；自定义弹窗的内部操作使用 [containerModal](<containerModal.md>)。

<a id="9f495507"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| [confirm](#77fa264a) | 支持 | V7.35.0+ |
| [open](#8ab02bbb) | 支持 | 不支持 |

以下签名按 `@lark-project/js-sdk` 2.1.8 对齐，端与模式限制同时参考官方正文；类型定义不替代宿主版本要求。

<a id="77fa264a"></a>

## confirm：显示确认框

<a id="a07038ec"></a>

调用形式为 `confirm(options, callback)`，两个参数均必填。

| 参数 | 类型 | 含义 |
| --- | --- | --- |
| `options` | `string \| ModalConfirmOptions` | 字符串直接作为内容，或传完整配置对象 |
| `callback` | `(result: { confirmed: boolean; canceled: boolean }) => void` | 用户确认或取消后的结果回调 |

<a id="80210c9a"></a>

### ModalConfirmOptions

| 属性 | 类型 | 必填 | 默认值与约束 |
| --- | --- | --- | --- |
| `title` | string | 否 | 标题；与 `content` 不能同时为空 |
| `content` | string | 否 | 内容；与 `title` 不能同时为空 |
| `confirmText` | string | 否 | 确认按钮文字，默认 `ok` |
| `cancelText` | string | 否 | 取消按钮文字，默认 `cancel` |
| `showCancel` | boolean | 否 | 是否显示取消按钮，默认 `true` |

<a id="135dd0a8"></a>

### 回调结果

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `confirmed` | boolean | 是否点击确认 |
| `canceled` | boolean | 是否点击取消 |

<a id="c199ee69"></a>

SDK 2.1.8 返回 `Promise<void>`。用户选择仍从 `callback` 获取，不能写成 `const confirmed = await confirm(...)` 并按布尔值判断；Promise 失败也需处理。原文未定义 Promise 完成与用户点击之间的精确时序。

<a id="b4e011d6"></a>

### 两种调用形式

字符串形式：

```typescript
await window.JSSDK.modal.confirm("Continue with this action?", (result) => {
  console.log(result.confirmed, result.canceled);
});
```

配置对象形式：

```typescript
await window.JSSDK.modal.confirm(
  {
    title: "Confirmation",
    content: "Continue with this action?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    showCancel: true,
  },
  (result) => {
    console.log(result.confirmed, result.canceled);
  },
);
```

文案分别对应原文的内容、标题、确认和取消展示文字，不是固定协议值。

![确认框效果](<../assets/1607c09d16631ea9a8d6cd16.gif>)

<a id="8ab02bbb"></a>

## open：打开自定义弹窗

自定义弹窗运行在独立 iframe 中，需要自带代码与样式。`entry` 指向资源入口文件导出的模块名，与 `plugin.config.json` 中的文件路径或 ResourceId 不同。

脚本模式下如果已经有打开的弹窗，本次打开会被忽略并报错。官方没有规定其他模式的并发弹窗规则，不将此限制泛化为所有场景。

<a id="c5a9de93"></a>

调用形式为 `open<Context>(options)`。SDK 2.1.8 要求配置对象 `ModalOpenOptions<Context>`。

<a id="def9b6b7"></a>

### ModalOpenOptions

| 属性 | 类型 | 必填 | 默认值或适用条件 |
| --- | --- | --- | --- |
| `entry` | string | 是 | 入口文件导出的弹窗模块名 |
| `width` | number | 否 | 默认 `448` |
| `height` | number | 否 | 原文无默认值 |
| `fullScreen` | boolean | 否 | 默认 `false`，仅 UI 模式；启用后覆盖宽高 |
| `maskClosable` | boolean | 否 | 默认 `true`，仅 UI 模式；是否允许点击遮罩关闭 |
| `context` | 泛型 Context | 否 | 向弹窗传入静态上下文数据 |
| `onSubmit` | `(params: unknown) => void` | 否 | 仅 UI 模式，响应弹窗内 `containerModal.submit` |
| `afterClose` | `() => void` | 否 | 仅 UI 模式，关闭后触发 |
| `title` | string | 否 | 仅脚本模式，默认插件名称 |

`context` 不支持 ReactNode 或函数；弹窗内使用 [Context.getCustomContext](<Context.md#ddab42c2>) 读取。宽高在 SDK 2.1.8 中为数字；本文示例不使用 CSS 字符串或类型断言绕过该约束。旧正文提及的字符串尺寸是否被特定宿主兼容，需另行验证。

<a id="7d260c6d"></a>

### 返回与模式差异

返回 `Promise<{ close: () => void } | void>`：UI 模式解析为可关闭弹窗的引用，脚本模式没有该引用。只有获得引用后才能调用其 `close()`。

`onSubmit` 触发不等于弹窗自动关闭。官方示例由打开方在回调中主动关闭；异步回调的等待和错误传播规则未在原文定义。

![自定义弹窗](<../assets/f3e99da660d046ad49daff5b.png>)

<a id="02b00283"></a>

## UI 模式完整示例

以下四步连接资源配置、导出入口、打开方与弹窗内部。示例依赖 React、支持 `createRoot` 的 ReactDOM 及 TSX 构建环境。

### 1. 配置资源

将以下 `resources` 配置合入已有 `plugin.config.json`，其他插件身份配置保持实际值。`page_web` 需对应后台资源标识。

```json
{
  "resources": [
    {
      "id": "page_web",
      "entry": "./src/index.tsx"
    }
  ]
}
```

### 2. 导出主入口与弹窗入口

不消费宿主注入组件库时，可在 `src/index.tsx` 使用普通入口：

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./Main";
import FeatureModalInner from "./FeatureModalInner";

const container = document.createElement("div");
container.id = "app";
document.body.appendChild(container);
const root = createRoot(container);

export default function main() {
  root.render(<Main />);
}

export function FeatureModal() {
  root.render(<FeatureModalInner />);
}
```

消费[客户端组件库](<../components/客户端组件库接入.md>)时，用以下写法替换普通入口，先等待共享模块初始化，再加载对应组件。两种入口是替代关系，不同时放在同一文件中。

```tsx
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

const Main = lazy(() => import("./Main"));
const FeatureModalInner = lazy(() => import("./FeatureModalInner"));

async function initShared() {
  await window.JSSDK.shared.setSharedModules({ React, ReactDOM });
}

const container = document.createElement("div");
container.id = "app";
document.body.appendChild(container);
const root = createRoot(container);

export default async function main() {
  await initShared();
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <Main />
    </Suspense>,
  );
}

export async function FeatureModal() {
  await initShared();
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <FeatureModalInner />
    </Suspense>,
  );
}
```

独立 iframe 会分别执行自己的资源入口，不能依赖打开方已有的 React 根节点或本地变量。初始化顺序详见 [shared](<shared.md>)。

### 3. 打开方 Main.tsx

原例的随窗口变化高度改为数字 `600`，适配 SDK 当前宽高类型；宽度、遮罩行为和上下文数据保留。

```tsx
import React from "react";

export default function Main() {
  const openModal = async () => {
    let modal: { close: () => void } | void;
    try {
      modal = await window.JSSDK.modal.open({
        entry: "FeatureModal",
        width: 800,
        height: 600,
        maskClosable: false,
        context: { data: { a: 2 } },
        onSubmit: (params) => {
          console.log(params);
          if (modal) modal.close();
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button type="button" onClick={openModal}>
      Open modal
    </button>
  );
}
```

### 4. 弹窗内部 FeatureModalInner.tsx

读取上下文后展示 JSON，点击提交时向打开方发送 `{ confirm: true }`。`confirm` 是本例约定的业务字段，不是 SDK 固定属性。

```tsx
import React, { useEffect, useState } from "react";

interface ModalContext {
  data: { a: number };
}

export default function FeatureModalInner() {
  const [data, setData] = useState("");

  useEffect(() => {
    let active = true;
    const loadContext = async () => {
      const context = await window.JSSDK.Context.load();
      const customContext = await context.getCustomContext<ModalContext>();
      if (active) setData(JSON.stringify(customContext));
    };
    void loadContext().catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const submit = async () => {
    try {
      const containerModal = window.JSSDK.containerModal;
      if (!containerModal.submit) {
        throw new Error("Submit is unavailable in this container");
      }
      await containerModal.submit({ confirm: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <pre>{data}</pre>
      <button type="button" onClick={submit}>
        Submit
      </button>
    </div>
  );
}
```

SDK 2.1.8 将 `containerModal.submit` 定义为可选方法，示例先确认当前容器提供该方法再调用；这与它仅在 `modal.open` 容器中使用的范围一致。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/jj1uma7o
