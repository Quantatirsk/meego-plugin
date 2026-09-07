# richTextEditor

`window.JSSDK.richTextEditor.show()` 打开宿主提供的富文本编辑器。它编辑并返回 `RichTextEditorContent`，可由[富文本组件](<../components/富文本 RichTextEditor.md>)展示；它不是普通浏览器弹窗，也不能脱离飞书项目容器运行。

![富文本编辑器](<../assets/3598f26523bbcfdb61e29db3.png>)

**阅读导航**：[支持范围](#b0bac185) · [show](#402eb084) · [配置](#a09f7e63) · [图床协议](#e82812eb) · [返回结果](#abfd9049) · [示例](#66c73476)

<a id="b0bac185"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `show()` | 支持 | 飞书项目移动端 V7.35.0+ |

自定义图床的 `onUploadComplete` 回调要求移动端不低于 V7.37.0。API 支持不等于所有插件点位都能打开编辑器，仍需确认点位的容器与端支持。

<a id="402eb084"></a>

## show()

```ts
await window.JSSDK.richTextEditor.show(options, callback);
```

`show()` 返回 `Promise<void>`。关闭编辑器时调用 `callback`；应以 `confirmed` 和 `nextValue` 判断是否取得新内容，不能在调用后同步读取结果。

<a id="0e2bfc58"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options` | [`RichTextEditorOptions`](#a09f7e63) | 编辑器配置 |
| `callback` | `(result: IRichTextEditorResult) => void` | 编辑器关闭时调用 |

<a id="a09f7e63"></a>

### RichTextEditorOptions

| 属性 | 必填性 | 类型 | 说明 |
| --- | --- | --- | --- |
| `title` | 可选 | `string` | 编辑器标题，仅用于展示 |
| `defaultValue` | 可选 | `string` | 初始结构化富文本，取 [`RichTextEditorContent.doc`](#954d4798) |
| `autoFocus` | 可选 | `boolean` | 打开后是否自动聚焦；来源页未列出，SDK `2.1.8` 已声明 |
| `context` | 必填 | [`RichTextEditorOptionsContext`](#f66b6ca3) | 编辑器上下文 |
| `imageUpload` | 可选 | [`RichTextEditorOptionsImageUpload`](#e82812eb) | 自定义图床配置 |

<a id="f66b6ca3"></a>

### RichTextEditorOptionsContext

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | `string` | 空间 ID；用于人员推荐和附件上传的空间权限控制 |

<a id="e82812eb"></a>

### RichTextEditorOptionsImageUpload

| 属性 | 必填性 | 类型 | 说明 |
| --- | --- | --- | --- |
| `url` | 必填 | `string` | 自定义图片上传服务地址，应提供 HTTPS |
| `token` | 可选 | `string` | 作为请求头 `x-plugin-custom-token` 发送 |
| `onUploadComplete` | 可选 | `(info) => void` | 上传完成回调；移动端 V7.37.0+ |

图床请求为 `POST multipart/form-data`，响应应为 `application/json; charset=utf-8`。上传服务须返回下文规定的 `full_url`；应由服务端校验来源和访问权限，不能把 `token` 作为唯一身份依据。

<a id="65d3c87e"></a>

### RichTextEditorImageUploadRequestPayload

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `space_id` | `string` | 空间标识 |
| `work_item_id` | `string` | 来源页字段名；原说明称其为工作项类型标识，但 SDK 未导出此请求体类型，不能据此确认其实际语义 |
| `file` | `File \| undefined` | 上传文件；与 `file_url` 互斥 |
| `file_url` | `string \| undefined` | 已上传图片的地址；与 `file` 互斥 |

收到请求后必须校验 `file` 与 `file_url` 恰有一个有效值。来源页没有定义空值、文件大小、重试和超时契约，不应自行假定。

<a id="412875b1"></a>

### RichTextEditorImageUploadResponseData

```json
{
  "data": {
    "full_url": "https://example.com/uploaded-image.png"
  }
}
```

`full_url` 是图片地址。接口没有给出其他响应字段的稳定定义。

<a id="abfd9049"></a>

### IRichTextEditorResult

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `confirmed` | `boolean` | 是否确认保存 |
| `canceled` | `boolean` | 是否取消 |
| `nextValue` | [`RichTextEditorContent`](#954d4798)，可选 | 确认时的最新内容；取消时可缺失 |

来源页将 `nextValue` 写成 `string`，但其示例和 SDK `2.1.8` 都使用完整的 `RichTextEditorContent` 对象，本页据此更正。

<a id="954d4798"></a>

### RichTextEditorContent

| 属性 | 必填性 | 类型 | 说明 |
| --- | --- | --- | --- |
| `doc` | 可选 | `string` | 结构化富文本 |
| `doc_html` | 可选 | `string` | HTML 版本 |
| `doc_text` | 可选 | `string` | 纯文本概要 |
| `is_empty` | 必填 | `boolean` | 是否为空 |

`defaultValue` 接收 `doc`，而编辑结果需要整体保存或按业务需要选择其中的表示形式。不要把未经清洗的 `doc_html` 直接插入页面。

<a id="39478af4"></a>

### IRichTextEditorImageUploadComplete

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `number` | 错误码；非 `0` 表示异常 |
| `errMsg` | `string` | 错误信息 |
| `responseData` | 未细化 | 图床接口的原始响应数据 |

<a id="05a58774"></a>

## 返回值

`show()` 的返回类型为 `Promise<void>`；编辑后的内容只通过关闭回调提供。

<a id="66c73476"></a>

## 使用示例

```ts
import type { RichTextEditorContent } from '@lark-project/js-sdk';

type EditorState = {
  value?: RichTextEditorContent;
};

async function editRichText(
  spaceId: string,
  state: EditorState,
  setState: (next: EditorState) => void,
) {
  await window.JSSDK.richTextEditor.show(
    {
      title: 'Edit description',
      defaultValue: state.value?.doc,
      context: { spaceId },
    },
    result => {
      if (result.confirmed && result.nextValue) {
        setState({ value: result.nextValue });
      }
    },
  );
}
```

![编辑器结果](<../assets/9e3abfb3156605fd9ee830aa.gif>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/1btl061e
