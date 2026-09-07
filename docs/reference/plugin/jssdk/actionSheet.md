# actionSheet

`window.JSSDK.actionSheet` 在移动端打开动作菜单，让用户从给定列表中选择操作。

<a id="2355880b"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `show` | 不支持 | V7.35.0+ |

SDK 2.1.8 将 `ActionSheet` 标注为移动端能力。原文没有列出额外点位限制；在网页端声明可见不表示可以调用。

<a id="6a508d97"></a>

## show：打开菜单

<a id="bcf19470"></a>

调用形式为 `show(options, callback)`，两个参数均必填。

| 参数 | 类型 | 含义 |
| --- | --- | --- |
| `options` | ActionSheetOptions | 菜单配置 |
| `callback` | `(result: { tapIndex: number }) => void` | 用户选择后的回调，`tapIndex` 为选中项在 `itemList` 中的数组下标 |

<a id="58b57c10"></a>

### ActionSheetOptions

| 属性 | 类型 | 必填 | 限制 |
| --- | --- | --- | --- |
| `itemList` | string[] | 是 | 菜单项文案，数量为 1–6 个 |

SDK 2.1.8 的公开类型名为 `ActionSheetOptions`。原文没有规定单项文案长度、空文案、重复文案或取消按钮的配置方式。

<a id="efb1bc5e"></a>

### 返回与失败

返回 `Promise<void>`。选择结果通过回调取得，不是 Promise 的解析值。原文没有定义取消时是否触发回调、取消值、Promise 完成时机或超出数量限制时的错误类型。

<a id="5c4314a9"></a>

## 移动端示例

保留原例三个操作名称 `moveTo`、`delete`、`copy`。示例读取正确的 `tapIndex`，只有下标能对应菜单项时才处理选择；实际业务动作由调用方实现。

```typescript
const itemList = ["moveTo", "delete", "copy"];

try {
  await window.JSSDK.actionSheet.show({ itemList }, ({ tapIndex }) => {
    const selectedAction = itemList[tapIndex];
    if (selectedAction === undefined) return;
    console.log(selectedAction);
  });
} catch (error) {
  console.error(error);
}
```

## 相关文档

- [modal.confirm](<modal.md#77fa264a>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/9haq6j0j
