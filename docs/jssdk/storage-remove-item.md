# JSSDK：storage.removeItem

`window.JSSDK.storage.removeItem(key)` 删除当前登录用户与当前插件隔离的本地存储项。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

`key` 是必填字符串。方法返回 `Promise<void>`。只需要删除一个键时应使用此方法，而不是 `clear()`，以免移除同一插件中其他功能保存的值。

存储只保存字符串，按当前用户和插件隔离，并会在账号切换后清空。来源没有定义删除不存在键时的特殊结果或错误对象。

## 调用示例

```ts
await window.JSSDK.storage.removeItem("ui-preferences");
```

调用方应处理 Promise 拒绝。

## 未定义项

官方资料没有定义失败时的统一错误对象、跨设备同步或并发删除的行为。

对应 fixture：[storage.removeItem](../../fixtures/jssdk/storage-remove-item.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/arvsjvf3
