# CustomField

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.custom-field.get-context"></a>
- **CustomField.getContext** ｜ `jssdk.custom-field.get-context` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.get-create-work-item-form-item-values"></a>
- **CustomField.getCreateWorkItemFormItemValues** ｜ `jssdk.custom-field.get-create-work-item-form-item-values` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.get-display-info"></a>
- **CustomField.getDisplayInfo** ｜ `jssdk.custom-field.get-display-info` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.get-field-config"></a>
- **CustomField.getFieldConfig** ｜ `jssdk.custom-field.get-field-config` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.get-props"></a>
- **CustomField.getProps** ｜ `jssdk.custom-field.get-props` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.get-table-cell-init-props"></a>
- **CustomField.getTableCellInitProps** ｜ `jssdk.custom-field.get-table-cell-init-props` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.on-work-item-form-value-changed"></a>
- **CustomField.onWorkItemFormValueChanged** ｜ `jssdk.custom-field.on-work-item-form-value-changed` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.open-full-screen-plugin"></a>
- **CustomField.openFullScreenPlugin** ｜ `jssdk.custom-field.open-full-screen-plugin` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.save-field-value"></a>
- **CustomField.saveFieldValue** ｜ `jssdk.custom-field.save-field-value` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.custom-field.watch"></a>
- **CustomField.watch** ｜ `jssdk.custom-field.watch` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.customField` 负责扩展字段的上下文、字段结构、取值、保存和表单监听。字段类型如何配置、三个网页端入口如何拆分，见 [扩展字段-字段类型 / CustomField](<../points/扩展字段-字段类型 CustomField.md>)。本页按 `@lark-project/js-sdk` 2.1.8 核对签名。

<a id="b1eaad9c"></a>

## 支持范围

| 方法 | 网页端 | 移动端 | 场景 |
| --- | --- | --- | --- |
| `getContext()` | 支持 | 7.42.0+ | 各场景上下文 |
| `getFieldConfig()` | 支持 | 7.42.0+ | 字段结构，包括配置弹窗 |
| `getProps()` | 支持 | 7.42.0+ | 表单当前值与禁用状态 |
| `watch()` | 支持 | 7.42.0+ | 表单 props 变化 |
| `getCreateWorkItemFormItemValues()` | 支持 | 7.42.0+ | 新建工作项表单 |
| `onWorkItemFormValueChanged()` | 支持 | 7.42.0+ | 表单，包括节点表单 |
| `getTableCellInitProps()` | 支持 | 不支持 | 表格编辑弹窗的初始值 |
| `saveFieldValue()` | 支持 | 7.42.0+ | 表单、表格编辑弹窗 |
| `getDisplayInfo()` | 不支持 | 7.43.0+ | 移动端展示态 |
| `openFullScreenPlugin()` | 不支持 | 7.43.0+ | 从移动端展示态打开全屏插件 |

移动端版本采用官方点位支持表；SDK 中部分方法沿用更早版本的注释，不作为该点位已开放的依据。整个字段类型必须同时实现网页端和移动端。

<a id="0b6d61d5"></a>
<a id="49bc12e9"></a>

## getProps()

在表单中读取当前字段受控属性，无参数。

<a id="c5d52718"></a>

### 返回值

返回 `Promise<CustomFieldProps>`。

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `value` | CustomFieldValueType | 当前复合字段值 |
| `disabled` | boolean，可选 | 是否禁止编辑；保存仍受平台权限校验 |

<a id="58feaf1c"></a>

### CustomFieldValue

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `field_key` | string | 当前父字段 key，必须匹配字段配置 |
| `field_value` | 子字段值[][] | 第一维为行，每行是一组子字段；空数组表示清空 |

<a id="a75197e4"></a>

### 子字段值

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `field_key` | string | 子字段 key |
| `value` | 对应子字段类型，可选 | 未赋值时可省略，非空值必须匹配结构配置 |

<a id="68a13c1a"></a>
<a id="c9fdfcd2"></a>
<a id="d5e4cafa"></a>
<a id="8d33e197"></a>
<a id="380289f6"></a>
<a id="f18c866e"></a>

| 子字段 | 配置 `type` | 值类型 | 约束 |
| --- | --- | --- | --- |
| 数字 | `number` | number | 对应 FieldNumberValue |
| 多行文本 | `text` | string | 对应 FieldMultiTextValue；字段模型以 `multi=true` 区分单行文本 |
| 级联多选 | `tree_multi_select` | string[] | 选项标识；不存在的选项可能报错 |
| 日期与时间 | `date` | string 或 number | SDK 为 FieldDatePreciseValue；精确到秒 |
| 多选人员 | `multi_user` | string[] | 用户标识；不存在的人员可能报错 |

官方文档只说明日期的数字时间戳形式；SDK 额外接受 string，但未明确字符串格式和时区约定，需核实后再自行构造。`text` 不等于富文本 `multi_text`；配置枚举使用下划线。

<a id="ac0aed38"></a>

### 示例

```typescript
const props = await window.JSSDK.customField.getProps();
console.log(props.value, props.disabled);
```

以下为数据结构示例，key 应替换为 `getFieldConfig()` 返回的实际值。

```json
{
  "value": {
    "field_key": "field_company",
    "field_value": [
      [
        { "field_key": "field_company_name", "value": "Example Ltd" },
        { "field_key": "field_employee_count", "value": 123 }
      ]
    ]
  },
  "disabled": false
}
```

<a id="2d2fac64"></a>

## watch(callback, watchKeys?)

仅表单可用，用于监听自身字段值或禁用状态的变化。

<a id="592f4925"></a>
<a id="5348f6c6"></a>

### 参数

| 参数 | 类型 | 含义 |
| --- | --- | --- |
| `callback` | `(next) => void` | 最新 CustomFieldProps；SDK 也允许空对象 |
| `watchKeys` | `("value" \| "disabled")[]`，可选 | 省略时监听所有可监听属性 |

<a id="90c7073e"></a>

### 返回值

返回 `Promise<() => void>`。与同步返回取消函数的 Schedule.watch 不同，应等待订阅建立，并在组件卸载时取消。表格编辑弹窗、字段配置弹窗均是独立上下文，不支持监听外部更新。

<a id="a55982b0"></a>

### 示例

下面处理了组件已卸载、订阅 Promise 才完成的情况。

```tsx
import { useEffect } from "react";

export function CustomFieldObserver() {
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void window.JSSDK.customField.watch((next) => {
      if (!disposed && next.value) {
        console.log(next.value, next.disabled);
      }
    }, ["value", "disabled"]).then((off) => {
      if (disposed) off();
      else unsubscribe = off;
    }).catch((error: unknown) => console.error(error));

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  return null;
}
```

<a id="08d5b82c"></a>

## getContext()

无参数，返回所在场景的上下文 Promise。通用上下文与模型查询见 [Context](<Context.md>) 和 [共享 API](<shared.md>)。

<a id="ae739dbf"></a>

### 返回值

| 字段 | SDK 类型 | 场景限制 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 |
| `workObjectId` | string | 当前工作项类型；官方说明新建页可能为空，不应无条件用于模型查询 |
| `workItemId` | number，可选 | 新建表单和字段配置侧没有实例 ID |
| `nodeId` | string，可选 | 节点流详情中的节点表单可用，不包括交付物 |
| `bizScene` | 场景字符串，可选 | 仅移动端 7.57+，见下表 |

| `bizScene` | 场景 |
| --- | --- |
| `workItemDetail` | 工作项详情 |
| `createWorkItem` | 新建工作项 |
| `nodeForm` | 节点表单 |
| `stateForm` | 状态表单 |
| `nodeDeliverable` | 节点交付物 |
| `taskDeliverable` | 任务交付物 |

<a id="9194a4ed"></a>

### 示例

```typescript
const context = await window.JSSDK.customField.getContext();
console.log(context.spaceId, context.workObjectId, context.workItemId, context.nodeId);
```

节点表单示例；表格、详情、状态表单和交付物展开表单没有下例的 `nodeId`。空间配置侧只有空间和工作项类型，不附带 `workItemId`。

```json
{
  "spaceId": "space_example",
  "workObjectId": "story",
  "workItemId": 11048001,
  "nodeId": "doing"
}
```

<a id="66349221"></a>

## getFieldConfig()

无参数，返回 `Promise<CustomFieldConfig>`，包含父字段与子字段结构。字段配置弹窗可以读取结构，但没有工作项字段值。

<a id="19023121"></a>
<a id="ebd691b5"></a>

### CustomFieldConfig

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `key` | string | 平台字段 key，读写字段值时使用 |
| `mappingKey` | string | SDK 声明的映射标识；官方本页未说明映射方向，不应据此替换 `key` |
| `type` | 字段类型枚举 | `compound_field`、`text`、`date`、`multi_user`、`tree_multi_select`、`number` |
| `name` | string | 字段名称 |
| `children` | CustomFieldConfig[]，可选 | 仅复合字段有子字段 |

<a id="b301c181"></a>

### 示例

```typescript
const config = await window.JSSDK.customField.getFieldConfig();
console.log(config.key, config.name, config.type);
for (const child of config.children ?? []) {
  console.log(child.key, child.name, child.type);
}
```

返回值是对象，不应在空值分支替换成数组。保存使用实例字段 `key`，表格 DSL 中的开发者子字段 key 用途见对应点位文档。

<a id="ee1e5fad"></a>
<a id="19cb0f2d"></a>

## saveFieldValue(value)

在表单或表格编辑弹窗保存本字段。平台执行结构、类型和权限校验。

<a id="f0bf984f"></a>

### 参数与校验

`value` 是 [CustomFieldValue](#58feaf1c) 对象，不是 JSON 字符串。

1. 父 `field_key` 必须等于当前 `getFieldConfig().key`。
2. 清空时传 `field_value: []`。原接口说明也接受 undefined，但当前 SDK 要求该属性为数组，因此采用空数组写法。
3. 非空值必须为二维数组；每行的子字段 key 必须存在于配置中，且同一行不能重复。
4. 每个子字段值必须匹配对应类型；前端应根据 `disabled` 禁用编辑，并处理保存时的权限错误。

<a id="487eaf82"></a>

### 返回值

当前 SDK 返回 `Promise<CustomFieldValidateMsg>`。成功结果为 `code: 200` 和 `msg`；校验错误通过 InvalidParamsError 的 `errCode`、`errMsg` 抛出，其余执行异常为 InternalError。旧版文档的成功字符串返回类型已经移除。

```json
{ "code": 200, "msg": "save success" }
```

<a id="95335c90"></a>

### 错误码

| `errCode` | 含义 | 检查方向 |
| --- | --- | --- |
| 401 | 不符合字段值结构 | 父 key 与二维 `field_value` |
| 402 | 子字段值类型不匹配 | 错误信息中的 row、col、field_key 和期望类型 |
| 403 | 未知字段 key | 父字段或子字段是否存在 |
| 404 | 同一行子字段 key 重复 | 一行中每个 key 只能出现一次 |
| 405 | 无编辑权限 | `disabled` 与平台授权配置 |
| 406 | 未知错误 | 记录错误上下文 |

官方错误消息模板如下；其中 401 消息沿用 “json string” 措辞，不能据此把对象 stringify 后传入。

```text
401: value should be valid json string, in {field_key: -, field_value:{field_key:-, value: -}[][]} format
402: child field value type not match, error in (row: -, col: -, field_key: -), it should be type -}
403: Unknown field key
404: error in (row: -, col: -, field_key: -), duplicated child field key
405: no edit permission
```

<a id="c51f9b8e"></a>

### 示例

以下函数保存调用方按配置构造的值，不硬编码未知字段 key；成功处理与异常处理均使用当前契约。

```typescript
type CustomFieldValue = Parameters<typeof window.JSSDK.customField.saveFieldValue>[0];

async function saveCustomField(value: CustomFieldValue): Promise<void> {
  try {
    const result = await window.JSSDK.customField.saveFieldValue(value);
    console.log(result.code, result.msg);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null &&
        "errCode" in error && "errMsg" in error) {
      console.error(error.errCode, error.errMsg);
    } else {
      console.error(error);
    }
    throw error;
  }
}
```

<a id="e88907c5"></a>
<a id="1baaff79"></a>

## getTableCellInitProps()

仅网页端表格编辑弹窗可用，读取弹窗打开时的初始值。该弹窗是独立上下文，不支持外部变化监听。

<a id="b4edc92f"></a>

### 返回值

无参数，返回 `Promise<CustomFieldProps>`；`value` 和可选的 `disabled` 与 [getProps()](#0b6d61d5) 相同。这是初始快照，不是订阅。

<a id="8a4c4111"></a>

### 示例

```typescript
const initialProps = await window.JSSDK.customField.getTableCellInitProps();
console.log(initialProps.value, initialProps.disabled);
```

<a id="8118db6f"></a>

## getCreateWorkItemFormItemValues(keys)

仅新建工作项表单可用，读取尚未创建实例的表单项。

<a id="2cd1d561"></a>
<a id="c60d410d"></a>

### Keys

一次最多 10 个 key。每个元素包含以下字段，表单变更监听复用此结构。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | string 或 AttributeType | 工作项属性名或字段 key；字段 key 可在空间配置的工作项字段管理中查询 |
| `type` | FieldType 的支持子集 | `name` 使用 `FieldType.text`，`template` 使用 `FieldType.number`；其他字段匹配实际类型 |

不支持 `richText`、`singleSignal`、`multiSignal`、`singleVoting`、`multiVoting`、`simpleVoting`。旧说明将 `role_owners` 映射到 `FieldType.control`，但 2.1.8 没有该枚举成员，该控件的类型参数尚待核实，不提供伪造枚举的调用。

<a id="6c63c580"></a>

### 返回值

Promise 解析为按属性名或字段 key 索引的值对象。业务侧按 `Record<string, unknown>` 接收，并按字段类型收窄。

<a id="5f6818d7"></a>

### 示例

```typescript
import { FieldType } from "@lark-project/js-sdk";

const values: Record<string, unknown> =
  await window.JSSDK.customField.getCreateWorkItemFormItemValues([
    { key: "name", type: FieldType.text },
  ]);
console.log(values.name);
```

```json
{ "name": "New request" }
```

<a id="c8d8c256"></a>

## onWorkItemFormValueChanged(options, callback)

监听表单、节点表单中其他工作项字段的变化。

<a id="4a6fef8b"></a>
<a id="057b9a17"></a>

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options.watchKeys` | Keys[] | [同上](#c60d410d)，最多 10 个 |
| `callback` | `(changedValue: Record<string, unknown>) => void` | 变化字段的键值对象 |

<a id="4f780972"></a>

### 返回值

返回 `Promise<() => void>`。调用方需保存并在卸载时调用取消函数；异步建立订阅时的清理方式与 [watch 示例](#a55982b0) 相同。

<a id="800bb0fb"></a>

### 示例

此函数返回取消函数，交给调用方生命周期管理，避免原示例中取消函数超出变量作用域的问题。

```typescript
import { FieldType } from "@lark-project/js-sdk";

async function subscribeToName(): Promise<() => void> {
  return window.JSSDK.customField.onWorkItemFormValueChanged(
    { watchKeys: [{ key: "name", type: FieldType.text }] },
    (changedValue) => console.log(changedValue.name),
  );
}
```

<a id="68ac4c98"></a>

## getDisplayInfo()

移动端 7.43.0+ 展示态读取插件展示信息，无参数。

<a id="ed88db67"></a>

### 返回值

返回 `Promise<{ display_height: number }>`，`display_height` 为展示高度。源文没有明确单位，不额外假定为 CSS px。

<a id="8e1a08f3"></a>

### 示例

```typescript
const displayInfo = await window.JSSDK.customField.getDisplayInfo();
console.log(displayInfo.display_height);
```

```json
{ "display_height": 400 }
```

<a id="94931ad9"></a>

## openFullScreenPlugin()

移动端 7.43.0+ 展示态打开全屏插件。

<a id="082d728b"></a>

### 返回值

无参数，返回 `void`，不是 Promise；调用返回不能视为全屏页面完成加载的确认。

<a id="5df30762"></a>

### 示例

```typescript
window.JSSDK.customField.openFullScreenPlugin();
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/dx9dznmo
