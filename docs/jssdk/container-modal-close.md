# JSSDK：containerModal.close

`window.JSSDK.containerModal.close()` 在当前插件弹窗内部关闭该弹窗。它不是用于打开弹窗的 API。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

方法无参数，返回 `Promise<void>`。它可在以下已定义来源打开的当前弹窗内调用：`window.JSSDK.modal.open`、Button、Control 编辑和 Intercept 事件。

每个弹窗来源仍受自己的端支持范围限制。例如，`modal.open` 的支持范围不会因 `containerModal.close()` 的移动端标记而改变。

## 调用示例

```ts
await persistChanges();
await window.JSSDK.containerModal.close();
```

`persistChanges` 是插件实现。`close()` 解析完成不表示应用层数据已经保存，应该由调用方先确定保存结果。

## 未定义项

官方资料没有定义不在弹窗内调用时的错误形状，也没有说明编程关闭是否触发关闭确认。不要依赖未记录的拒绝值或确认流程。

对应 fixture：[containerModal.close](../../fixtures/jssdk/container-modal-close.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/cxj9ivdg
