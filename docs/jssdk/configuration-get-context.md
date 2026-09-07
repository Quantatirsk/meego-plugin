# JSSDK：Configuration.getContext

`window.JSSDK.configuration.getContext()` 在插件配置页面中读取所属空间。该方法无参数，返回 Promise。

## 平台事实

| 端 | API 标记 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

API 的移动端标记不表示平台存在独立的移动端配置管理入口；Configuration 点位的管理页面只支持网页端开发。

调用结果包含唯一已定义字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | `string` | 当前配置页面所属空间 ID |

该方法不返回工作项、视图或已保存的插件规则。

## 调用示例

```ts
const { spaceId } = await window.JSSDK.configuration.getContext();
await loadConfiguration(spaceId);
```

`loadConfiguration` 是插件实现，不是 JSSDK 方法。

## 未定义项

官方资料没有定义配置值的读取、保存、共享范围或失败时的 Promise 拒绝形状。不要把 `spaceId` 以外的业务数据添加到返回对象约定中。

对应 fixture：[Configuration.getContext](../../fixtures/jssdk/configuration-get-context.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/o8q4bptu
