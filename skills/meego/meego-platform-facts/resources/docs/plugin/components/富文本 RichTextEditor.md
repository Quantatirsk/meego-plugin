# 富文本 / RichTextEditor

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.component.rich-text-editor"></a>
- **富文本 / RichTextEditor** ｜ `jssdk.component.rich-text-editor` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`RichTextEditor` 支持只读预览、内联编辑和弹层编辑。组件接收客户端富文本结构 `doc`，提交时返回完整 `RichTextEditorContent`；业务代码负责保存结果，组件本身不自动把内容写回工作项。

<a id="00470324"></a>

## 支持与接入

| 能力 | 网页端 | 移动端 |
| --- | --- | --- |
| `RichTextEditor` 组件 | 支持 | 不支持 |
| `editType`、`editPopoverProps` | 组件库 `0.6.0` 起 | 不支持 |
| `editInlineProps` | 组件库 `1.0.4` 起 | 不支持 |

<a id="86a598f9"></a>

从 `@lark-project/ui-kit-plugin` 导入，初始化见[客户端组件库接入](<客户端组件库接入.md>)。另有官方 [window.JSSDK.richTextEditor.show](<../jssdk/richTextEditor.md#402eb084>) 可打开模态编辑器；其移动端支持不能套用到本组件。

<a id="a423a33f"></a>

## 三种展示方式

| 配置 | 行为 | 提交时机 |
| --- | --- | --- |
| `editable={false}` | 内联只读预览 | 不编辑 |
| `editable={true}`、`editType="inline"` | 内联编辑，两个属性均为默认值 | 退出编辑、点击外部或失焦时 |
| `editable={true}`、`editType="popover"` | 触发浮层编辑 | 弹层触发 `onClickOutSide` 时 |

![内联预览](<../assets/0faeed38bba099f1a8c6aa6b.png>)

![内联编辑](<../assets/31decd9519eca794b7a86f8c.gif>)

![浮层编辑](<../assets/7b4e086b73ab9f5aa259c487.gif>)

<a id="33690807"></a>
<a id="e98b5370"></a>
<a id="4f5b3ca6"></a>

## 只读预览与高度控制

`editable` 默认是 `true`，只读必须显式设置 `false`。原页给出的默认预览尺寸为 200 px × 80 px；有外层容器时跟随容器布局：不定高容器由内容撑起，定高容器内超出内容滚动。

以下组件通过 `fixedHeight` 展示两种布局。`spaceId` 和 `doc` 由业务提供，避免原示例依赖未定义的外部变量。

```tsx
import { RichTextEditor } from '@lark-project/ui-kit-plugin';

type Props = {
  spaceId: string;
  doc?: string;
  fixedHeight?: boolean;
};

export default function RichTextPreview({ spaceId, doc, fixedHeight = false }: Props) {
  return (
    <div style={{ border: '1px dashed gray', padding: 8, height: fixedHeight ? 200 : undefined }}>
      <RichTextEditor spaceId={spaceId} editable={false} defaultValue={{ doc }} />
    </div>
  );
}
```

预览会随 `defaultValue` 变化更新，这是本组件明确说明的行为。不要仅凭属性名把它当作 React 原生输入框的一次性初始值；原文没有给出编辑过程中外部更新与未提交内容之间的完整合并规则。

<a id="bdb60f5a"></a>

## 内联编辑

内联编辑宽高跟随父元素，`editInlineProps.maxHeight` 限制编辑区域最大高度，超出后滚动。样式放在外部容器；`editInlineProps` 没有 `style` 属性。

```tsx
import type { RichTextEditorContent } from '@lark-project/js-sdk';
import { RichTextEditor } from '@lark-project/ui-kit-plugin';

type Props = {
  spaceId: string;
  value?: RichTextEditorContent;
  onSubmit: (value: RichTextEditorContent) => void;
};

export default function InlineEditor({ spaceId, value, onSubmit }: Props) {
  return (
    <div style={{ width: 400, height: 100 }}>
      <RichTextEditor
        spaceId={spaceId}
        defaultValue={{ doc: value?.doc }}
        editable
        editType="inline"
        editInlineProps={{ placeholder: 'Write something', maxHeight: 400 }}
        onSubmit={onSubmit}
      />
    </div>
  );
}
```

提交处理器可以更新业务状态或发起保存；具体保存错误与重试由调用方处理。不要把回调触发等同于数据已经持久化成功。

<a id="0ee86eaa"></a>

## 弹层编辑与自定义触发器

`editType="popover"` 默认使用只读富文本作为触发器，点击打开编辑层。通过 `editPopoverProps.children` 可替换触发器；真实 DOM 元素或透传 ref / 属性的组件要求与 [Popover](<气泡卡片 Popover.md#7f0e1880>)一致。

下面使用按钮触发。删除 `children` 即恢复内置富文本触发器；`style`、`className` 用于内置触发器盒子。

```tsx
import type { RichTextEditorContent } from '@lark-project/js-sdk';
import { RichTextEditor } from '@lark-project/ui-kit-plugin';

type Props = {
  spaceId: string;
  value?: RichTextEditorContent;
  onSubmit: (value: RichTextEditorContent) => void;
};

export default function PopoverEditor({ spaceId, value, onSubmit }: Props) {
  return (
    <RichTextEditor
      spaceId={spaceId}
      defaultValue={{ doc: value?.doc }}
      editType="popover"
      editPopoverProps={{
        children: <button type="button">Edit content</button>,
        trigger: 'click',
        style: { cursor: 'pointer' },
      }}
      onSubmit={onSubmit}
    />
  );
}
```

<a id="e14a24e6"></a>

## 自定义图床

图床配置统一放在组件顶层的 `imageUpload`，适用于编辑模式。它与官方 [RichTextEditorOptionsImageUpload](<../jssdk/richTextEditor.md#e82812eb>) 使用同一协议，不能嵌入 `editPopoverProps`。

| 配置 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 必填，HTTPS 图片上传服务地址 |
| `token` | `string` | 可选，通过请求头 `x-plugin-custom-token` 发送 |
| `onUploadComplete` | 上传结果回调 | 上传成功且响应包含 `data.full_url` 才视为正常结果 |

上传请求使用 `POST`、`multipart/form-data`，服务返回 `application/json; charset=utf-8`。完整请求和响应字段以[图床协议](<../jssdk/richTextEditor.md#a09f7e63>)为准；图片上传服务与客户端组件是不同实现部分。

```tsx
import { RichTextEditor } from '@lark-project/ui-kit-plugin';

type Props = {
  spaceId: string;
  doc?: string;
  uploadUrl: string;
  uploadToken?: string;
};

export default function EditorWithImageUpload({ spaceId, doc, uploadUrl, uploadToken }: Props) {
  return (
    <RichTextEditor
      spaceId={spaceId}
      defaultValue={{ doc }}
      editType="popover"
      imageUpload={{
        url: uploadUrl,
        token: uploadToken,
        onUploadComplete: result => {
          if (result.code !== 0) {
            void window.JSSDK.toast.error(result.errMsg);
          }
        },
      }}
    />
  );
}
```

回调包含 `code`、`errMsg` 和 `responseData`；非零 `code` 表示异常。`responseData` 是图床响应，不在业务中假设它有未经验证的任意字段。

## 图片预览排查

原页指出：内联预览图片失败、弹层编辑器却能正常显示时，可以检查浏览器第三方 Cookie 策略是否阻止了图片所需的访问。应先核对当前站点的策略与请求失败信息，原页旧版浏览器设置地址不作为稳定操作入口。

![原页第三方 Cookie 设置示意](<../assets/a8d3538591a5aafc35a1d97c.png>)

<a id="eac71622"></a>

## RichTextEditor 属性

| 属性 | 类型 | 默认值 / 版本 | 说明 |
| --- | --- | --- | --- |
| `spaceId` | `string` | 必填 | 空间 ID，用于富文本转换、图片和用户提及等能力 |
| `defaultValue` | `Pick<RichTextEditorContent, 'doc' \| 'doc_html'>` | 未声明 | `doc` 是结构化内容；可提供内容一致的 `doc_html` 加快显示 |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `editType` | `inline`、`popover` | `inline`；`0.6.0` 起 | 编辑方式 |
| `onSubmit` | `(value: RichTextEditorContent) => void` | 未声明 | 两种模式的提交回调，时机见顶部模式表 |
| `editInlineProps` | `IEditInlineProps` | `1.0.4` 起 | 仅内联编辑生效 |
| `editPopoverProps` | `IEditPopoverProps` | `0.6.0` 起 | 仅弹层编辑生效 |
| `imageUpload` | 图床配置 | 未声明 | 组件顶层统一配置图片上传 |

`doc_html` 仅用于快速显示，不应与 `doc` 表达不同内容。`RichTextEditorContent` 还包含可选 `doc_text` 和必填 `is_empty`，见官方[完整类型](<../jssdk/richTextEditor.md#954d4798>)。不要把普通 HTML 或 Markdown 字符串直接冒充 `doc`。

<a id="20e3d501"></a>

### IEditInlineProps

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placeholder` | `string` | 未声明 | 编辑框占位文案 |
| `maxHeight` | `number` | `400` | 编辑区域最大高度，单位 px；超出滚动 |

当前公开 `RichTextEditor` 仅透出这两个内联属性。类型包内部接口中的其他属性，不等于此组件可接受的 `editInlineProps`。

<a id="412dcb89"></a>

### IEditPopoverProps

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ref` | `ForwardedRef<IEditor \| undefined>` | 未声明 | 编辑器句柄 |
| `className` | `string` | 未声明 | 内置触发器盒子类名 |
| `style` | `CSSProperties` | 未声明 | 内置触发器盒子样式 |
| `children` | `ReactElement` | 内置只读富文本 | 自定义触发器 |
| `position` | [Popover 定位枚举](<气泡卡片 Popover.md#7f0e1880>) | 未声明 | 12 个浮层方向 |
| `disabled` | `boolean` | 未声明 | 禁止展开编辑弹层 |
| `trigger` | `hover`、`click`、`custom` | `click` | 触发方式 |
| `visible` | `boolean` | 未声明 | 弹层显示状态，受控方式见 Popover |
| `autoFocus` | `boolean` | `false` | 自动聚焦 |
| `onVisibleChange` | `(visible: boolean) => void` | 未声明 | 显示状态变化回调 |
| `onClickOutSide` | `() => void` | 未声明 | 点击触发器与浮层外部，仅 `custom`、`click` 有效 |
| `contentWidth` | `CSSProperties['width']` | 未声明 | 弹层宽度 |

提交回调统一使用顶层 `onSubmit`。当前类型包仍保留但已弃用的 `editPopoverProps.onSubmit` 不作为新代码写法；`imageUpload` 按类型契约移至顶层。

<a id="fd262ef9"></a>

### IEditor

| 方法 | 类型 | 说明 |
| --- | --- | --- |
| `setValue` | `(value: Pick<RichTextEditorContent, 'doc'>) => void` | 写入编辑器当前内容 |

句柄在编辑器尚未建立时可能是 `undefined`，调用前需检查。`setValue` 更新编辑器内容，不表示业务数据已保存。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/t5w5ov8p
