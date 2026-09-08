# 日期选择器 / DatePicker

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.component.date-picker"></a>
- **日期选择器 / DatePicker** ｜ `jssdk.component.date-picker` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`DatePicker` 选择单个日期或日期时间，`DatePicker.RangePicker` 选择范围。`showTime` 控制是否显示时间选择；`format` 控制输入框展示格式，不应据此推断服务端字段格式或时区。

<a id="e634f2d7"></a>

## 支持与接入

| 组件 | 网页端 | 移动端 |
| --- | --- | --- |
| `DatePicker` | 组件库版本不低于 `0.7.0` | 不支持 |
| `DatePicker.RangePicker` | 组件库版本不低于 `0.7.0` | 不支持 |

<a id="8a4f91da"></a>

从 `@lark-project/ui-kit-plugin` 导入；共享模块注入和加载顺序见[客户端组件库接入](<客户端组件库接入.md>)。

<a id="aa2a661c"></a>

## 交互示意

![选择单个日期](<../assets/108175911df6b0deab874825.gif>)

![选择日期范围](<../assets/0074f511a0178c34890d196a.gif>)

<a id="9b048eda"></a>
<a id="082c1f71"></a>

## 单日期用法

基本模式只展示日期；添加 `showTime` 展示时间选择。以下修正原示例直接返回两个同级 JSX 元素的问题。

```tsx
import { DatePicker } from '@lark-project/ui-kit-plugin';

export default function DateExamples() {
  return (
    <>
      <DatePicker />
      <DatePicker showTime />
    </>
  );
}
```

<a id="89503c98"></a>

### 禁用部分日期

`disabledDate` 返回 `true` 时禁用日期。下面保留原例的“禁选周末”规则。

```tsx
import { DatePicker } from '@lark-project/ui-kit-plugin';

export default function WeekdayPicker() {
  return (
    <DatePicker disabledDate={date => date.getDay() === 0 || date.getDay() === 6} />
  );
}
```

<a id="931bc7f8"></a>

### 快捷日期与受控值

`presets` 为单日期提供 `start`。本例仍提供今天、明天两个快捷项，按本地日历递增日期；它不定义后端的时区解释。

```tsx
import { useState } from 'react';
import { DatePicker } from '@lark-project/ui-kit-plugin';

export default function PresetDatePicker() {
  const [value, setValue] = useState<Date | undefined>();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <DatePicker
      value={value}
      onChange={date => setValue(date)}
      presets={[
        { text: 'Today', start: today },
        { text: 'Tomorrow', start: tomorrow },
      ]}
    />
  );
}
```

传入 `value` 后配合 `onChange` 更新状态。单日期回调的日期和格式化字符串都可能为 `undefined`，不能直接调用 `date.getTime()` 而不检查空值。

<a id="b66ae70c"></a>
<a id="b32b6b82"></a>
<a id="075faf06"></a>

## 日期范围用法

范围组件使用数组形式的日期值；`showTime` 同样开启时间选择。

```tsx
import { DatePicker } from '@lark-project/ui-kit-plugin';

export default function RangeExamples() {
  return (
    <>
      <DatePicker.RangePicker />
      <DatePicker.RangePicker showTime />
    </>
  );
}
```

<a id="ecb357c3"></a>

### 分别限制开始和结束日期

范围组件的第二个参数提供当前焦点和已选范围。当前类型包把 `options` 声明为可选，因此先判断焦点；未指向任一输入框时，本例不额外禁用日期。

```tsx
import { DatePicker } from '@lark-project/ui-kit-plugin';
import type { IRangePickerProps } from '@lark-project/ui-kit-plugin';

const disabledDate: NonNullable<IRangePickerProps['disabledDate']> = (date, options) => {
  if (options?.rangeInputFocus === 'rangeStart') {
    return date.getDay() === 0;
  }
  if (options?.rangeInputFocus === 'rangeEnd') {
    return date.getDay() === 6;
  }
  return false;
};

export default function RestrictedRangePicker() {
  return <DatePicker.RangePicker disabledDate={disabledDate} />;
}
```

该例保留开始日期禁选周日、结束日期禁选周六的业务规则；原例把所有非开始状态都当作结束状态，已按实际焦点类型修正。

<a id="e43fcc76"></a>

### 快捷范围

范围快捷项同时提供 `start` 与 `end`。下面仍分别选择今天或明天，端点使用同一天的当前时刻；它不等于自动生成全天的起止时间。

```tsx
import { DatePicker } from '@lark-project/ui-kit-plugin';

export default function PresetRangePicker() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <DatePicker.RangePicker
      presets={[
        { text: 'Today', start: today, end: today },
        { text: 'Tomorrow', start: tomorrow, end: tomorrow },
      ]}
    />
  );
}
```

<a id="67429f98"></a>
<a id="c4e697c9"></a>

## 属性定义

### 两个组件共有的属性

空缺默认值表示原文未声明，不推断为 `false` 或空字符串。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `className` | `string` | 未声明 | 自定义类名 |
| `style` | `CSSProperties` | 未声明 | 自定义样式 |
| `disabled` | `boolean` | 未声明 | 禁用组件 |
| `inputReadOnly` | `boolean` | 未声明 | 输入框只读 |
| `showClear` | `boolean` | `true` | 展示清除按钮 |
| `onClear` | `() => void` | 未声明 | 点击清除按钮时触发 |
| `weekStartsOn` | `number` | `0` | 每周第一天，`0` 为周日、`1` 为周一，直到 `6`；范围外整数置为 `0` |
| `onBlur` | `() => void` | 未声明 | 失焦回调 |
| `onFocus` | `() => void` | 未声明 | 聚焦回调 |
| `showTime` | `boolean` | 未声明 | 开启时间选择 |
| `presets` | `PresetItem[]` | 未声明 | 日期时间快捷项 |
| `onPresetClick` | `(item: PresetItem) => void` | 未声明 | 点击快捷项回调 |

### DatePicker 差异属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `format` | `string` | `yyyy-MM-dd` | 输入框日期字符串格式 |
| `placeholder` | `string` | 请选择日期(及时间) | 未选择时的提示文案 |
| `defaultValue` | `string \| number \| Date` | 未声明 | 默认值 |
| `value` | `string \| number \| Date \| undefined` | 未声明 | 受控值 |
| `onChange` | `(date: Date \| undefined, dateString: string \| undefined) => void` | 未声明 | 值变化回调，含清空状态 |
| `disabledDate` | `(date: Date) => boolean` | 未声明 | 返回 `true` 时禁用 |

<a id="57f6bb10"></a>

### RangePicker 差异属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `format` | `string` | `yyyy-MM-dd HH:mm:ss` | 原页给出的范围输入格式 |
| `placeholder` | `string[]` | 开始日期、结束日期 | 两个输入框的提示文案 |
| `defaultValue` | `Date[] \| string[] \| number[]` | 未声明 | 默认范围；数组内保持同一值类型 |
| `value` | `Date[] \| string[] \| number[]` | 未声明 | 受控范围 |
| `onChange` | `(date: Date[], dateString: string[]) => void` | 未声明 | 日期数组与格式化字符串数组 |
| `disabledDate` | `(date: Date, options?: DisabledDateOptions) => boolean` | 未声明 | 可结合范围值和焦点禁用日期 |
| `rangeSeparator` | `string` | `~` | 输入框中的范围分隔符 |

原页没有定义数字日期的单位、字符串解析规则、时区或范围清空时的数组长度。需要这些语义时，应显式选择并验证业务转换规则，不把展示值直接当作服务端 OpenAPI 的日期字段值。

<a id="366c1b42"></a>

### PresetItem

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | 否 | 快捷项标题 |
| `start` | `Date` | 否 | 开始日期，也是单日期组件的选中值 |
| `end` | `Date` | 否 | 范围结束日期 |

类型允许缺省不代表缺少端点的快捷项具有明确业务意义；单日期示例给出 `start`，范围示例给出两端。

<a id="f67d1e23"></a>

### DisabledDateOptions

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `rangeStart` | `string` | 否 | 当前开始日期 |
| `rangeEnd` | `string` | 否 | 当前结束日期 |
| `rangeInputFocus` | `rangeStart`、`rangeEnd`、`false` | 否 | 当前焦点；`false` 表示未聚焦相应输入框 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/9wxgrizq
