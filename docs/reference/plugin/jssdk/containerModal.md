# containerModal

`window.JSSDK.containerModal` 用于**弹窗内部**配置关闭确认、关闭当前弹窗，以及把提交数据传给打开方。弹窗代码运行在新的 iframe 环境中；打开弹窗使用 [modal.open](<modal.md#8ab02bbb>)，本模块管理已经打开的当前弹窗。

<a id="bcbe468e"></a>

## 支持范围

| 方法 | 网页端 | 移动端 | 使用边界 |
| --- | --- | --- | --- |
| [configure](#5a208d34) | 支持 | 不支持 | 在当前弹窗内配置点击关闭时的二次确认 |
| [close](#df6fe78e) | 支持 | V7.35.0+ | 支持的弹窗来源见下文 |
| [submit](#f4e08d62) | 支持 | 不支持 | 仅限 `modal.open` 打开的弹窗；`onSubmit` 仅 UI 模式支持 |

不能因为按钮或控件弹窗支持 `close()`，就推导出它们也支持 `submit()`。三个方法的适用场景不同。

<a id="5a208d34"></a>

## configure：设置关闭确认

在当前弹窗点击关闭时展示二次确认。应在弹窗初始化时尽早配置，确保用户点击关闭前已经生效。

<a id="36f58007"></a>

### 参数

调用形式为 `configure(options)`，`options` 为关闭确认配置对象。

<a id="401657ca"></a>

### ContainerModalConfigureOptions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `confirmBeforeClose` | object | 关闭二次确认配置 |
| `confirmBeforeClose.title` | string | 二次确认弹窗标题 |
| `confirmBeforeClose.content` | string | 二次确认弹窗内容 |

原文未标注这些字段可省略，也未定义通过省略、空值或重复调用撤销配置的行为。按上述完整对象传入。

<a id="d3898fb0"></a>

返回 `Promise<void>`。

<a id="d7d0da36"></a>

### 网页端弹窗初始化示例

原示例标题“提示”、内容“确认退出吗？”在代码中使用对应的英文展示文案。

```javascript
await window.JSSDK.containerModal.configure({
  confirmBeforeClose: {
    title: "Notice",
    content: "Are you sure you want to exit?",
  },
});
```

原文只明确“点击关闭”时的确认，未说明 `close()` 编程关闭是否也触发确认；需要该行为时应在目标宿主环境验证，不能假定它可拦截所有关闭途径。

<a id="df6fe78e"></a>

## close：关闭当前弹窗

无参数，可在以下弹窗内部调用：

- `window.JSSDK.modal.open` 打开的弹窗。
- 通过按钮打开的弹窗。
- 控件编辑时打开的弹窗。
- 拦截事件打开的弹窗。

移动端仍受各弹窗来源自身的支持范围限制，例如 `modal.open` 本身仅支持网页端。

<a id="788e804d"></a>

返回 `Promise<void>`。来源页标注移动端 V7.35.0+，而 SDK `2.1.8` 声明注释为 V7.22.0+；本页保留来源页更保守的支持下限，不将注释视为运行时兼容承诺。

<a id="875968d9"></a>

```javascript
await window.JSSDK.containerModal.close();
```

仓库计划同步与批量签章的按钮点位使用该方法关闭当前弹窗。

<a id="f4e08d62"></a>

## submit：调用打开方的提交回调

调用形式为 `submit<Params>(params: Params)`。参数 `params` 是传给打开方 `onSubmit` 的业务数据，字段由插件双方约定，本方法没有固定的业务参数结构。SDK `2.1.8` 将 `submit` 声明为可选方法，调用前应进行能力判断。

此方法**仅用于 `window.JSSDK.modal.open` 打开的弹窗**。根据 [ModalOpenOptions](<modal.md#def9b6b7>)，`onSubmit` 仅在 UI 模式下支持，不能将下面的流程用于脚本模式。

<a id="166e5c82"></a>

返回 `Promise<void>`。原文未定义回调的业务结果会作为返回值透传，也未约定提交后自动关闭弹窗。官方示例由打开方在 `onSubmit` 中显式调用弹窗引用的 `close()`。

<a id="8e1feab9"></a>

### UI 模式下的提交配合

以下是调用关系示例。`FeatureModal` 必须是插件资源入口已导出的弹窗模块名，具体资源配置与渲染入口见 [modal.open 完整示例](<modal.md#02b00283>)。`confirm` 沿用官方示例的业务字段，不是平台固定字段。

打开方：

```javascript
const modal = await window.JSSDK.modal.open({
  entry: "FeatureModal",
  width: 800,
  onSubmit: (params) => {
    console.log(params);
    modal.close();
  },
});
```

弹窗内部：

```javascript
const containerModal = window.JSSDK.containerModal;
if (!containerModal.submit) {
  throw new Error('Submit is unavailable in this container');
}
await containerModal.submit({ confirm: true });
```

如果打开方需要保存数据，再根据保存结果决定何时关闭；不能把 `submit()` 的完成直接当作业务保存成功。SDK 原文未规定异步 `onSubmit` 的等待或异常传播语义。

## 相关文档

- [modal 官方正文](<modal.md#def9b6b7>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/cxj9ivdg
