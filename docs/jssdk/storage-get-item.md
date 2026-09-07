# JSSDK：storage.getItem

`window.JSSDK.storage.getItem(key)` 读取当前登录用户与当前插件隔离的本地字符串值。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

`key` 必须是字符串。方法返回 `Promise<string | undefined>`：键存在时解析为保存的字符串，键不存在时解析为 `undefined`。平台不会自动把 JSON 字符串还原为对象。

存储按当前用户和插件隔离；切换账号会清空原账号的本地存储。来源没有定义跨设备同步、有效期或并发更新保证。

## 调用示例

```ts
const value = await window.JSSDK.storage.getItem("ui-preferences");

if (value !== undefined) {
  const preferences: unknown = JSON.parse(value);
  validatePreferences(preferences);
}
```

`validatePreferences` 是插件实现。应同时处理 Promise 拒绝和 JSON 解析失败。

## 未定义项

官方资料没有定义读取失败时的统一错误对象。不要将本地缓存作为共享配置或唯一持久化副本。

对应 fixture：[storage.getItem](../../fixtures/jssdk/storage-get-item.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/arvsjvf3
