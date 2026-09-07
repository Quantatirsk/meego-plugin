# Tab

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.tab.get-context"></a>
- **Tab.getContext** ｜ `jssdk.tab.get-context` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.tab.get-context.fixture`](<../../../fixtures/jssdk/tab-get-context.json>)
<a id="capability-jssdk.tab.on-work-item-form-value-changed"></a>
- **Tab.onWorkItemFormValueChanged** ｜ `jssdk.tab.on-work-item-form-value-changed` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.tab` 用于读取详情标签页的运行上下文，并在网页端监听工作项表单值变化。标签页的后台配置、页面接入及字段分类示例见 [详情标签页 / Tab](<../points/详情标签页 Tab.md>)。

<a id="8ea1aa2e"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `getContext()` | 支持 | V7.35.0+ |
| `onWorkItemFormValueChanged()` | 支持 | 不支持 |

<a id="4b976faa"></a>

## getContext()

读取当前标签页的空间、工作项类型及工作项实例信息，无输入参数。

<a id="2cea278b"></a>

### 返回值

返回一个 Promise，解析后的对象包含以下字段：

| 字段 | 有值时的类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `workObjectId` | string | 当前工作项类型 ID |
| `workItemId` | number | 工作项实例 ID；仅实例场景有值，工作项配置侧为空 |

在配置侧运行时，不要直接用空的 `workItemId` 加载实例。官方未统一定义“为空”对应的具体值，应先判断上下文是否包含有效实例 ID。

<a id="e0d1ca88"></a>

### 示例

```typescript
const context = await window.JSSDK.tab.getContext();
console.log(context.spaceId, context.workObjectId);

if (typeof context.workItemId === "number") {
  console.log(context.workItemId);
}
```

实例场景的返回结构示例，标识均为演示数据：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001
}
```

<a id="2476d065"></a>

## onWorkItemFormValueChanged(options, callback)

在网页端详情页监听指定表单项的值变化。移动端不支持该方法。

<a id="2956506e"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ watchKeys: WatchKey[] }` | 要监听的工作项属性或字段，一次最多 10 个 key |
| `callback` | `(changedValue: Record<string, unknown>) => void` | 接收发生变化的字段值映射 |

<a id="55332e7d"></a>

### WatchKey

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | string 或 AttributeType | 字段 ID（`field_key`），或工作项属性 `name`、`template` |
| `type` | FieldType 的受支持子集 | 字段或属性对应的类型 |

字段 ID 在“空间配置 > 工作项管理 > 字段管理”查看。`name` 对应 `FieldType.text`，`template` 对应 `FieldType.number`，`role_owners` 对应 `FieldType.control`。

不支持 `FieldType.richText`、`FieldType.singleSignal`、`FieldType.multiSignal`、`FieldType.singleVoting`、`FieldType.multiVoting`、`FieldType.simpleVoting`。类型定义见 [通用类型](<通用类型定义.md>)。

回调参数是以字段名为键的对象，例如 `{ name: "Updated requirement" }`。业务代码应根据各字段类型检查值，不能将整个回调参数当作名称字符串。

<a id="2ab32b51"></a>

### 返回值与生命周期

返回 `Promise<() => void>`，解析结果为取消监听函数。标签页组件卸载时调用它；若异步订阅在组件卸载之后才完成，应立即取消该订阅。

<a id="4defda5e"></a>

### 示例

以下 React 组件只在支持该 API 的网页端详情页中使用。

```tsx
import { useEffect } from "react";
import { FieldType } from "@lark-project/js-sdk";

export function TabNameObserver() {
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void window.JSSDK.tab
      .onWorkItemFormValueChanged(
        { watchKeys: [{ key: "name", type: FieldType.text }] },
        (changedValue: Record<string, unknown>) => {
          if (!disposed) console.log(changedValue);
        },
      )
      .then((stop: () => void) => {
        if (disposed) stop();
        else unsubscribe = stop;
      })
      .catch((error: unknown) => console.error("Subscription failed", error));

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  return null;
}
```

<a id="208ee281"></a>

## 验证样例

[`tab.getContext()`](<../../../fixtures/jssdk/tab-get-context.json>)包含详情标签页的无参数调用与工作项实例返回，并记录非实例场景中 `workItemId` 空值形式未定义的边界。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/z1gnwa6r
