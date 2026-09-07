# JSSDK：storage.setItem

`window.JSSDK.storage.setItem(key, value?)` 在当前登录用户与当前插件隔离的本地存储中写入字符串。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

`key` 是必填字符串，`value` 是可选字符串。方法返回 `Promise<void>`。平台资料说明 value 为空会清除该键，但没有区分省略参数、空字符串和其他空值的全部边界；需要删除时使用 `removeItem`。

每个开发者在一个插件中最多写入 5 MB；超过限额会产生 `OutOfLimitError`。值只能是字符串，结构化数据需要调用方自行序列化。

## 调用示例

```ts
const value = JSON.stringify({ density: "compact" });

try {
  await window.JSSDK.storage.setItem("ui-preferences", value);
} catch (error: unknown) {
  handleStorageError(error);
}
```

`handleStorageError` 是插件实现。

## 未定义项

官方资料没有定义超额错误以外的统一错误对象，也没有定义跨设备同步、并发覆盖规则或 value 省略的精确序列化行为。

对应 fixture：[storage.setItem](../../fixtures/jssdk/storage-set-item.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/arvsjvf3
