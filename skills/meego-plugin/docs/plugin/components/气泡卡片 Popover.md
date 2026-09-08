# 气泡卡片 / Popover

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.component.popover"></a>
- **气泡卡片 / Popover** ｜ `jssdk.component.popover` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`Popover` 在触发元素附近显示临时浮层，用于补充说明或承载交互。简单文本通过 `content` 提供；自定义界面通过 `entry` 指定插件导出的入口，并用 `context`、`ref.popup` 建立通信。

<a id="0a76db71"></a>

## 支持与接入

| 组件 | 网页端 | 移动端 |
| --- | --- | --- |
| `Popover` | 支持 | 不支持 |
| `Popover.PopoverContent` | 支持 | 不支持 |

<a id="1e5172f1"></a>

从 `@lark-project/ui-kit-plugin` 导入。组件必须在共享模块注入完成后动态加载，见[客户端组件库接入](<客户端组件库接入.md>)和 [shared](<../jssdk/shared.md>)。本文组件代码均放在动态加载的模块中。

<a id="1bf196f3"></a>

## 使用场景

<a id="18a9d7f4"></a>

### 文本浮层

默认悬停触发，也可用点击触发，见[基础用法](#9b048eda)。

<a id="5f77db42"></a>

### 自定义浮层

自定义入口可以渲染独立界面，也可以构建选择器等交互，见[自定义入口](#6035ecb0)。

更多交互可在[客户端官方示例插件](<../client/客户端官方示例插件.md>)体验。浮层宽、高均支持自适应，见[容器机制](<../client/客户端容器自适应机制.md#7befeb5b>)。

<a id="46c2d732"></a>
<a id="9b048eda"></a>
<a id="7ca08636"></a>

## 基础用法

`children` 是触发元素，`content` 只接受字符串，不能传入 JSX。下面使用真实 DOM 元素作为触发器：

```tsx
import { Popover } from '@lark-project/ui-kit-plugin';

export default function TextPopover() {
  return (
    <Popover content="Additional details" trigger="hover">
      <span>Details</span>
    </Popover>
  );
}
```

自定义触发组件必须把 DOM 事件相关属性及 `ref` 传给真实节点，否则事件监听和浮层定位可能失效。需要完全受控时，将 `trigger` 设为 `custom`，并自行维护 `visible`；`onVisibleChange` 是回调，不替代受控状态更新。

<a id="6035ecb0"></a>

## 自定义入口与双向通信

数据流分为三个部分：触发组件用 `context` 向入口传递数据和异步方法；入口通过 `PopoverContent` 读取它们；入口用 `useImperativeHandle` 注册异步方法，触发组件从 `ref.current.popup` 调用。

`entry` 是入口模块导出的函数名，不是文件路径。`content` 与 `entry` 二选一；同时提供时，`content` 优先，`entry` 被忽略。

### 1. 定义通信类型

以下保存为 `popoverTypes.ts`，由两个组件通过 `import type` 共享。

```typescript
export type PopupContext = {
  content: string;
  popoverFunc: () => Promise<void>;
};

export type PopupMethods = {
  entryFunc: () => Promise<void>;
};
```

### 2. 触发组件

`PopoverDemo.tsx` 将数据和方法传给 `customEntry`。`popup` 在浮层建立前可能不存在，调用时保留可选判断。

```tsx
import { useRef } from 'react';
import { Popover } from '@lark-project/ui-kit-plugin';
import type { PopupContext, PopupMethods } from './popoverTypes';

export default function PopoverDemo() {
  const contentRef = useRef<{ popup?: PopupMethods }>({});
  const context: PopupContext = {
    content: 'Custom entry content',
    popoverFunc: async () => {
      console.info('Trigger method called');
    },
  };

  return (
    <Popover ref={contentRef} entry="customEntry" context={context}>
      <button
        type="button"
        onClick={async () => {
          await contentRef.current.popup?.entryFunc();
        }}
      >
        Open details
      </button>
    </Popover>
  );
}
```

### 3. 自定义入口中的界面

`CustomPopoverEntry.tsx` 在最外层放置一个 Provider。局部类型明确限制回传方法，避免将类型包中的宽泛类型扩散到业务代码。

```tsx
import { useImperativeHandle } from 'react';
import type { MutableRefObject } from 'react';
import { Popover } from '@lark-project/ui-kit-plugin';
import type { PopupContext, PopupMethods } from './popoverTypes';

function PopupBody() {
  const { context, ref } = Popover.PopoverContent.useContext<PopupContext>();
  const methodRef: MutableRefObject<PopupMethods> = ref;

  useImperativeHandle(methodRef, () => ({
    entryFunc: async () => {
      console.info('Entry method called');
    },
  }), []);

  return (
    <button type="button" onClick={async () => context.popoverFunc()}>
      {context.content}
    </button>
  );
}

export default function CustomPopoverEntry() {
  return (
    <Popover.PopoverContent.Provider>
      <PopupBody />
    </Popover.PopoverContent.Provider>
  );
}
```

### 4. 导出入口

在配置的入口文件中导出 `customEntry`。原页的 `initShared` 未给出定义，下面直接使用已记录的共享模块 API，保证组件模块在注入之后才被加载。

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

export async function customEntry(): Promise<void> {
  await window.JSSDK.shared.setSharedModules({ React, ReactDOM });
  const { default: CustomPopoverEntry } = await import('./CustomPopoverEntry');
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);
  createRoot(container).render(<CustomPopoverEntry />);
}
```

以上定义自定义入口；主界面仍需按工程自身入口加载 `PopoverDemo`。

<a id="45f88adc"></a>
<a id="7f0e1880"></a>

## Popover 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `children` | `ReactElement` | 未声明 | 触发元素，需满足前述 DOM 属性和 ref 透传要求 |
| `style` | `CSSProperties` | 未声明 | 自定义行内样式 |
| `content` | `string` | 未声明 | 纯文本内容；优先于 `entry` |
| `entry` | `string` | 未声明 | 自定义渲染入口的导出名称 |
| `context` | `T` | 未声明 | 传入入口的数据和异步方法，见下节约束 |
| `ref` | `MutableRefObject<{ popup?: F }>` | 未声明 | 通过 `popup` 获取入口注册的方法 |
| `position` | 定位枚举 | `bottom` | 浮层方向 |
| `trigger` | `hover`、`click`、`custom` | `hover` | 触发方式 |
| `visible` | `boolean` | 未声明 | 与 `trigger="custom"` 配合控制显示 |
| `onVisibleChange` | `(isVisible: boolean) => void` | 未声明 | 显示状态变化回调 |
| `onClickOutSide` | `() => void` | 未声明 | 浮层显示时，点击触发器和浮层之外的回调；仅 `custom`、`click` 有效 |

`position` 的完整枚举：`left`、`top`、`bottom`、`right`、`topLeft`、`topRight`、`leftTop`、`leftBottom`、`rightTop`、`rightBottom`、`bottomLeft`、`bottomRight`。

<a id="add33ab2"></a>

### IPopoverContentType 与通信约束

| 成员 | 概念类型 | 用途 |
| --- | --- | --- |
| `context` | `T` | 触发器和入口约定相同的数据结构 |
| `ref` | `MutableRefObject<F>` | 入口注册的方法集合，与触发器的 `popup` 对应 |

这里的 `T`、`F` 描述两端约定，不表示组件类型包提供两个可直接传入的泛型参数；当前公开 `useContext` 仅接收上下文类型参数。

- `context` 顶层可传数据和方法；方法必须是异步方法。
- 作为字段值传递的对象或数组不能再嵌入函数。
- 传入和注册的方法不能以函数作为参数，也不能返回函数。
- `ref` 只注册异步方法，不作为任意数据存储使用。

当前官方页面明确支持上述异步通信。类型包 `1.0.4` 的 `context` 注释仍写有“不支持函数”，且其宽泛类型无法验证这些运行时约束；本文以专门组件页面的明确协议为依据，不能仅凭类型通过就绕开协议。

<a id="b66ae70c"></a>
<a id="caba246f"></a>

## PopoverContent.Provider

Provider 给入口子树提供 `context` 和注册方法的 `ref`。原文要求按单例使用，在入口组件最外层包裹一次即可。

<a id="5c28755c"></a>

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 是 | 自定义 UI；类型包允许 ReactNode，原表写 ReactElement |

<a id="8f9a8f00"></a>

## PopoverContent.useContext

函数组件中调用 `Popover.PopoverContent.useContext<T>()` 获取上下文，并通过 `useImperativeHandle` 注册方法。完整示例见[自定义入口](#6035ecb0)。

<a id="203a56d6"></a>

返回值包含 `context` 和 `ref`，遵循 [IPopoverContentType](#add33ab2) 的通信约束。

<a id="4cc41d0e"></a>

## PopoverContent.Consumer

类组件或使用 render prop 的组件可在 Provider 内通过 `Popover.PopoverContent.Consumer` 消费相同上下文。回调得到 `context`、`ref`；注册方法仍仅限异步方法，且不能接收或返回函数。函数组件优先使用上一节 Hook，避免复制原页不完整的类组件片段。

<a id="46ee3359"></a>

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `children` | `(data: IPopoverContentType) => ReactNode` | 是 | 渲染函数，接收上下文和方法注册 ref；当前类型包使用 React Consumer 的返回类型 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/cq5cwaw6
