# JSSDK：toast.success

`window.JSSDK.toast.success()` 显示成功提示。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | `source_silent` |

来源的支持表没有列出 `success` 的移动端最低版本。SDK 声明中包含该方法，但不能据此把移动端版本写成确定兼容承诺。

方法接受字符串，或包含 `content` 和可选 `duration` 的对象。对象形式的 `content` 必填；`duration` 以秒为单位，默认 5 秒，来源定义的范围为 3 至 10 秒。提示内容最多 40 个字符，超出时会被截断。

该方法返回 `Promise<string>`，解析值是 toast ID。一个插件同时只显示一个提示；新提示替代之前的提示。

## 调用示例

```ts
const toastId = await window.JSSDK.toast.success({
  content: "Saved",
  duration: 5,
});

rememberToastId(toastId);
```

`rememberToastId` 是插件实现。toast ID 可用于 `toast.close(id)`，但它不是业务操作的结果。

## 未定义项

除移动端最低版本外，官方资料没有定义失败时 Promise 拒绝值、超出时长范围时的处理或已替换 toast ID 的行为。

对应 fixture：[toast.success](../../fixtures/jssdk/toast-success.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/7330ys5f
