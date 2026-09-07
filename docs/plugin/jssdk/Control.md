# Control

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.control.get-context"></a>
- **Control.getContext** ｜ `jssdk.control.get-context` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.control.get-context.fixture`](<../../../fixtures/jssdk/control-get-context.json>)
<a id="capability-jssdk.control.get-create-work-item-form-item-values"></a>
- **Control.getCreateWorkItemFormItemValues** ｜ `jssdk.control.get-create-work-item-form-item-values` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.control.get-display-info"></a>
- **Control.getDisplayInfo** ｜ `jssdk.control.get-display-info` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.control.on-work-item-form-value-changed"></a>
- **Control.onWorkItemFormValueChanged** ｜ `jssdk.control.on-work-item-form-value-changed` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.control.open-full-screen-plugin"></a>
- **Control.openFullScreenPlugin** ｜ `jssdk.control.open-full-screen-plugin` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.control` 提供表单控件和节点表单控件的运行上下文、表单值读取与变化监听。表格列展示态使用服务端数据接口和布局配置，不支持在单元格内调用本组客户端 API。

控件安装、后台配置、数据存储及新建回调见 [控件 / Control](<../points/控件 Control.md>)。

<a id="12cef518"></a>

## 支持范围

| 方法 | 网页端 | 移动端 | 使用范围 |
| --- | --- | --- | --- |
| `getContext()` | 支持 | V7.35.0+ | 表单、节点表单 |
| `getCreateWorkItemFormItemValues()` | 支持 | V7.35.0+ | 新建页表单控件 |
| `onWorkItemFormValueChanged()` | 支持 | V7.35.0+ | 表单（含新建页）、节点表单 |
| `getDisplayInfo()` | 不支持 | V7.35.0+ | 移动端控件展示区域 |
| `openFullScreenPlugin()` | 不支持 | V7.35.0+ | 移动端控件全屏详情 |

此表是 API 标注的最低版本；控件点位文档对移动端表单和节点表单的支持标注为 V7.36.0+。交付移动端控件时，应同时满足点位与 API 的条件。

<a id="48bab499"></a>

## getContext()

读取当前控件所在页面的上下文，无输入参数。

<a id="85631531"></a>

### 返回值与页面阶段

返回一个 Promise，解析后的对象包含下列信息。表中的“为空”描述可用性，官方没有统一约定这些情况下是省略属性、`undefined` 还是其他空值。

| 字段 | 有值时的类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `workObjectId` | string | 当前工作项类型 ID；参数表约定新建页为空 |
| `workItemId` | number | 当前工作项实例 ID；新建页为空 |
| `UUID` | string | 新建页控件临时标识，用于关联新建成功回调；详情页可能为空 |
| `nodeId` | string | 仅节点流工作项的节点表单控件有值 |

详情页应以工作项实例 ID 关联业务数据；新建页尚无实例 ID，先按 `UUID` 暂存数据，创建成功后再通过服务端回调绑定实例。不要把 `UUID` 当作详情页持续可用的主键。

<a id="7e15a514"></a>

### 示例

```typescript
const context = await window.JSSDK.control.getContext();
console.log(context.spaceId, context.workItemId, context.nodeId);
```

以下均为结构示例，标识和数值是演示数据。新建页仅展示可依赖的上下文字段。

详情页：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001
}
```

新建页：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "UUID": "06583aa767b001d202f9e5a12763a096"
}
```

节点表单：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001,
  "nodeId": "start"
}
```

<a id="38027601"></a>

## getCreateWorkItemFormItemValues(keys)

读取新建页中指定字段或工作项属性的当前值。此方法仅用于新建页表单控件。

<a id="b43f63e1"></a>

### 输入参数

| 参数 | 类型 | 约束 |
| --- | --- | --- |
| `keys` | Keys[] | 需要读取的字段或属性，一次最多 10 个 |

<a id="46ee4c15"></a>
<a id="eadd81e6"></a>

### Keys

以下结构同时用于读取参数 `keys` 和监听参数 `options.watchKeys`。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | string 或 AttributeType | 字段 ID（`field_key`），或工作项属性 `name`、`template` |
| `type` | FieldType 的受支持子集 | 对应字段或属性的类型 |

字段 ID 可在“空间配置 > 工作项管理 > 字段管理”查看。属性与类型的固定对应关系如下：

| `key` | `type` |
| --- | --- |
| `name` | `FieldType.text` |
| `template` | `FieldType.number` |
| `role_owners` | `FieldType.control` |

不支持的类型为 `FieldType.richText`、`FieldType.singleSignal`、`FieldType.multiSignal`、`FieldType.singleVoting`、`FieldType.multiVoting`、`FieldType.simpleVoting`。其他类型及值结构见 [通用类型](<通用类型定义.md>)。

<a id="7fbd1377"></a>

### 返回值

Promise 解析为以字段 ID 或属性名为键、当前值为值的对象。使用值前应按字段类型检查，可按 `Record<string, unknown>` 处理。

<a id="6f58883d"></a>

### 示例

```typescript
import { FieldType } from "@lark-project/js-sdk";

const values = await window.JSSDK.control.getCreateWorkItemFormItemValues([
  { key: "name", type: FieldType.text },
]);
console.log(values);
```

```json
{
  "name": "New requirement"
}
```

<a id="37fca1ea"></a>

## onWorkItemFormValueChanged(options, callback)

监听表单项的值变化，可用于新建页表单、详情页表单及节点表单控件。

<a id="1ddda00d"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ watchKeys: Keys[] }` | 监听目标，一次最多 10 个 key |
| `callback` | `(changedValue: Record<string, unknown>) => void` | 接收发生变化的值映射 |

<a id="b6e4954d"></a>
<a id="b7015671"></a>

`watchKeys` 的字段与类型限制与 [Keys](#46ee4c15) 相同。回调参数是对象，例如 `{ name: "Updated requirement" }`，不是单个字段值字符串。

<a id="54d09513"></a>

### 返回值与取消监听

返回 `Promise<() => void>`，解析得到取消监听函数。控件卸载时调用该函数；如果组件已卸载而订阅才完成，也应立即取消，避免遗留监听。

<a id="8d65e112"></a>

### 示例

下例适用于 React 控件，包含订阅失败处理及异步订阅期间的卸载处理。

```tsx
import { useEffect } from "react";
import { FieldType } from "@lark-project/js-sdk";

export function NameObserver() {
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void window.JSSDK.control
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

<a id="51e2a8c0"></a>

## getDisplayInfo()

仅移动端可用，无输入参数。用于根据控件实际展示高度安排内容；移动端概览区域不支持滚动。

<a id="f347c07b"></a>

### 返回值

| 返回字段 | 类型 | 说明 |
| --- | --- | --- |
| `display_height` | number | 当前控件实际展示高度 |

方法返回包含该对象的 Promise。

<a id="28c3b6f4"></a>

### 示例

```typescript
const displayInfo = await window.JSSDK.control.getDisplayInfo();
console.log(displayInfo.display_height);
```

<a id="cd97c0a9"></a>

## openFullScreenPlugin()

仅移动端可用，无输入参数。由概览内容主动打开插件的全屏详情。

<a id="36250e87"></a>

### 返回值

返回 `void`，不提供用于等待页面关闭或读取结果的 Promise。

<a id="1b561119"></a>

### 示例

```typescript
window.JSSDK.control.openFullScreenPlugin();
```

<a id="a9b5e7a8"></a>

## 验证样例

[`control.getContext()`](<../../../fixtures/jssdk/control-get-context.json>)包含节点表单与新建表单的调用输入和返回上下文；新建表单的 `UUID` 只能作为创建完成前的临时关联键。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/x4isqv2u
