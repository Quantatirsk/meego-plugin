# JSSDK：Tab.getContext

`window.JSSDK.tab.getContext()` 读取详情标签页的空间、工作项类型和工作项实例上下文。该方法无参数，返回 Promise。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

| 字段 | 有值时类型 | 说明 |
| --- | --- | --- |
| `spaceId` | `string` | 当前空间 ID |
| `workObjectId` | `string` | 当前工作项类型 ID |
| `workItemId` | `number` | 工作项实例 ID；仅实例场景有值 |

平台没有规定配置侧或其他非实例场景中 `workItemId` 的统一空值形式。

## 调用示例

```ts
const context = await window.JSSDK.tab.getContext();

if (typeof context.workItemId !== "number") {
  throw new Error("A work item instance is required");
}

await loadTabData(context.spaceId, context.workItemId);
```

`loadTabData` 是插件实现，不是 JSSDK 方法。

## 未定义项

官方资料没有定义失败时 Promise 拒绝值的统一结构。不要把非实例场景的空值形态或运行时错误对象写成固定协议。

对应 fixture：[Tab.getContext](../../fixtures/jssdk/tab-get-context.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/z1gnwa6r
