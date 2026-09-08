# 选择器 / Select

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.component.select"></a>
- **选择器 / Select** ｜ `jssdk.component.select` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`Select` 从给定选项中选择一个或多个值。`optionList` 定义候选项，`value` / `onChange` 用于受控选择；需要自定义下拉项时，通过独立 `entry` 渲染 `Select.SelectOptions`。

<a id="135688a1"></a>

## 支持与接入

| 组件 | 网页端 | 移动端 |
| --- | --- | --- |
| `Select` | 支持 | 不支持 |
| `Select.SelectOptions` | 支持 | 不支持 |

<a id="208ce6b9"></a>

从 `@lark-project/ui-kit-plugin` 导入，先完成[组件库接入](<客户端组件库接入.md>)要求的共享模块注入和动态加载。下拉层宽度不自适应、高度自适应，见[容器机制](<../client/客户端容器自适应机制.md#7befeb5b>)。

<a id="f62cc9b1"></a>

## 使用场景

<a id="9b048eda"></a>
<a id="ca49ddb4"></a>

## 定义选项

每个选项必须有字符串 `label` 和 `value`；`disabled` 禁用单项，额外业务信息放在可选 `data` 中。以下 `options.ts` 供后续示例复用；原示例的展示文案改为英文，保留四个国家值和额外数据的含义。

```typescript
import type { ISelectOption } from '@lark-project/ui-kit-plugin';

export type CountryData = {
  code: string;
  description: string;
  color: string;
};

export const optionList: ISelectOption<CountryData>[] = [
  { label: 'China', value: 'china', data: { code: 'CN', description: 'China', color: 'red' } },
  { label: 'USA', value: 'usa', data: { code: 'US', description: 'USA', color: 'grey' } },
  { label: 'Japan', value: 'japan', disabled: true, data: { code: 'JP', description: 'Japan', color: 'wheat' } },
  { label: 'Korea', value: 'korea', data: { code: 'KR', description: 'Korea', color: 'white' } },
];
```

基本选择器只需传入 `optionList`：

```tsx
import { Select } from '@lark-project/ui-kit-plugin';
import { optionList } from './options';

export default function CountrySelect() {
  return <Select style={{ width: 350 }} optionList={optionList} />;
}
```

<a id="89503c98"></a>
<a id="931bc7f8"></a>

## 多选与受控值

`multiple` 开启多选；`maxTagCount` 只控制最多直接显示几个已选标签，超出部分显示为 `+N`，并不限制选中数量。传入 `value` 后，显示结果由该值决定，必须在 `onChange` 中更新。

| 模式 | 非空值 | 清空 |
| --- | --- | --- |
| 单选 | `string` | 类型允许 `undefined` |
| 多选 | `string[]` | 回调类型仍包含 `undefined`，业务应处理空状态 |

当前类型包没有按 `multiple` 自动收窄回调签名，不能把处理器参数直接标为 `string`。下面明确检查单选值，并开启清除按钮。

```tsx
import { useState } from 'react';
import { Select } from '@lark-project/ui-kit-plugin';
import { optionList } from './options';

export default function ControlledCountrySelect() {
  const [value, setValue] = useState<string | undefined>('china');

  return (
    <Select
      optionList={optionList}
      value={value}
      showClear
      onChange={next => setValue(typeof next === 'string' ? next : undefined)}
    />
  );
}
```

多选用数组维护值。本例恢复所有候选项可选，保留原多选示例中四项均可选、最多显示三个标签的行为。

```tsx
import { useState } from 'react';
import { Select } from '@lark-project/ui-kit-plugin';
import { optionList } from './options';

export default function MultipleCountrySelect() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Select
      optionList={optionList.map(option => ({ ...option, disabled: false }))}
      multiple
      maxTagCount={3}
      showClear
      value={value}
      onChange={next => setValue(Array.isArray(next) ? next : [])}
    />
  );
}
```

<a id="67429f98"></a>

## 自定义渲染

三个入口各自负责不同区域：`Select.renderSelectedItem` 渲染已选标签；`SelectOptions.emptyContent` 渲染空结果；`SelectOptions.renderOptionItem` 渲染候选项。

### 触发组件

`entry` 与入口文件导出的函数同名。`data` 在类型中可选，渲染器不能未经检查直接访问。

```tsx
import { Select } from '@lark-project/ui-kit-plugin';
import { optionList } from './options';

export default function CustomCountrySelect() {
  return (
    <Select
      entry="customEntry"
      optionList={optionList}
      renderSelectedItem={option => (
        <span style={{ backgroundColor: option.data?.color }}>
          {option.data?.description ?? option.label}
        </span>
      )}
    />
  );
}
```

### 下拉列表模块

保存为 `SelectOptionsEntry.tsx`。列表由 `Select.SelectOptions` 接收宿主传来的选项，不需要另行复制 `optionList`。

```tsx
import { Select } from '@lark-project/ui-kit-plugin';
import type { CountryData } from './options';

export default function SelectOptionsEntry() {
  return (
    <Select.SelectOptions<CountryData>
      emptyContent={<div>No results</div>}
      renderOptionItem={option => (
        <div>
          <span>{option.data?.code}</span>{' '}
          {option.data?.description ?? option.label}
        </div>
      )}
    />
  );
}
```

### 导出自定义入口

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

export async function customEntry(): Promise<void> {
  await window.JSSDK.shared.setSharedModules({ React, ReactDOM });
  const { default: SelectOptionsEntry } = await import('./SelectOptionsEntry');
  const container = document.createElement('div');
  document.body.appendChild(container);
  createRoot(container).render(<SelectOptionsEntry />);
}
```

入口初始化依据 [shared](<../jssdk/shared.md>)，组件模块始终在注入之后加载。

<a id="45f88adc"></a>
<a id="c4e697c9"></a>

## Select 属性

原页没有给出这些属性的默认值，以下不补猜测值。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `entry` | `string` | `Select.SelectOptions` 的自定义导出入口名 |
| `className` | `string` | 触发器类名 |
| `style` | `CSSProperties` | 触发器样式 |
| `disabled` | `boolean` | 禁用选择器 |
| `multiple` | `boolean` | 开启多选 |
| `optionList` | `ISelectOption<T>[]` | 必填，完整候选项列表 |
| `placeholder` | `string` | 未选择时的提示文字 |
| `maxTagCount` | `number` | 多选时直接显示的标签数量上限 |
| `renderSelectedItem` | 已选项渲染函数 | 见下节完整签名 |
| `showClear` | `boolean` | 显示清除按钮 |
| `filter` | `boolean` | 开启搜索 |
| `value` | `string \| string[] \| undefined` | 受控值 |
| `onChange` | 选择变化回调 | 同时提供值和选项；单选、多选、清空均需处理 |
| `onClear` | `() => void` | 清除按钮回调 |
| `onSearch` | `(value: string) => void` | 输入框文本变化回调 |

### 回调签名

以下按当前官方类型包校订。原表把 `onChange` 限定为单个字符串，遗漏多选和清空；已选项渲染返回值使用类型包实际接受的 `ReactElement`。

```typescript
import type { ReactElement } from 'react';
import type { ISelectOption } from '@lark-project/ui-kit-plugin';

export type SelectionChange<T extends Record<string, unknown>> = (
  value: string | string[] | undefined,
  selectedOptions: ISelectOption<T> | ISelectOption<T>[] | undefined,
) => void;

export type SelectedItemRenderer<T extends Record<string, unknown>> = (
  option: ISelectOption<T>,
) => ReactElement | { isRenderInTag: boolean; content: ReactElement };
```

单选可返回元素；多选可返回对象，通过 `isRenderInTag` 决定内容是否放入标签容器。原页未说明搜索匹配规则、远程请求或去抖机制，不应将 `filter/onSearch` 视为自动完成远程搜索。

<a id="ade11a10"></a>

### ISelectOption<T>

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | 是 | 选项值 |
| `label` | `string` | 是 | 选项文本 |
| `disabled` | `boolean` | 否 | 禁用该选项 |
| `data` | `T` | 否 | 自定义附加数据 |

<a id="b66ae70c"></a>

## Select.SelectOptions 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `className` | `string` | 下拉列表类名 |
| `style` | `CSSProperties` | 下拉列表样式 |
| `emptyContent` | `string \| ReactElement` | 无结果时的内容，按当前类型包收窄 |
| `renderOptionItem` | `(option: ISelectOption<T>) => ReactNode` | 候选项渲染函数 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/six0xskc
