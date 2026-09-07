# event

`window.JSSDK.event` 订阅平台提供的客户端事件。SDK 2.1.8 当前仅定义 `clickOutside`，用于接收**插件容器外**的点击通知，适合收起插件内自定义浮层或下拉菜单。

这不是服务端 Webhook 订阅；平台数据变化与回调投递应查[监听事件](<../../openapi/events/监听事件.md>)。

<a id="f7215af3"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| [onMessage](#7fbc7682) | 支持 | 不支持 |

<a id="7fbc7682"></a>

## onMessage：订阅官方客户端事件

<a id="50966196"></a>

调用形式为 `onMessage(eventType, callback)`。

| 参数 | 类型 | 必填 | 含义 |
| --- | --- | --- | --- |
| `eventType` | EventType | 是 | 事件类型枚举 |
| `callback` | `(payload: EventPayloadMap[T]) => void` | 是 | SDK 按事件类型推导对应 payload |

SDK 2.1.8 使用泛型映射约束回调，不将任意键值对象视为所有事件的合法载荷。

<a id="c86ae136"></a>

### EventType 与载荷

| 成员 | 值 | 载荷 | 含义 |
| --- | --- | --- | --- |
| `EventType.clickOutside` | `clickOutside` | `{ timestamp: number }` | 容器外的点击事件 |

原例将 `timestamp` 与 `Date.now()` 比较，按毫秒时间戳使用；SDK 类型本身只注明 `number`，未定义时钟偏差或顺序保证。载荷没有 DOM target 或点击坐标，不能据此判断点击了宿主页面的哪一个元素。

容器内部点击是否落在某个下拉框外，需要插件自己的 DOM 交互逻辑；它与平台“容器外点击”不是同一范围。

<a id="fe1fc585"></a>

### 返回与清理

同步返回 `Off`，即 `() => void`，用于取消本次监听。它不是 Promise；组件卸载或不再需要监听时调用该函数。

原文未定义监听注册失败的具体错误、重复注册去重、回调异常传播或取消函数重复调用行为。每次注册应保存自己的取消函数，不假定注册会自动替换已有监听。

<a id="d0fd8a0d"></a>

## React 示例：容器外点击收起菜单

以下组件保留原例“容器外点击后收起自定义下拉框”的目的，改用本地状态管理展开状态，避免依赖未提供的 `Select` 组件和 `close()` 引用。

本例沿用 500 毫秒阈值，只接受 `0 <= Date.now() - timestamp <= 500` 的通知。这是示例选择的新鲜度策略，不是 SDK 的可信验证或安全保证；网络延迟或时钟差异可能导致通知被忽略。

```tsx
import React, { useEffect, useState } from "react";
import { EventType } from "@lark-project/js-sdk";

export default function App() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const off = window.JSSDK.event.onMessage(
      EventType.clickOutside,
      ({ timestamp }) => {
        const ageMs = Date.now() - timestamp;
        if (ageMs >= 0 && ageMs <= 500) {
          setOpen(false);
        }
      },
    );
    return off;
  }, []);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Actions
      </button>
      {open && (
        <div>
          <button type="button" onClick={() => setOpen(false)}>
            Close menu
          </button>
        </div>
      )}
    </div>
  );
}
```

对于不需要过滤通知时间的组件，可以直接在回调中收起菜单；是否丢弃延迟事件应由交互需求决定。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/jx1tl8aj
