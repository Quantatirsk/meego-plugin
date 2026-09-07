# JSSDK：Button.getContext

`window.JSSDK.button.getContext()` 在按钮唤起的插件弹窗内读取当前按钮场景。该方法无参数，返回解析为场景上下文的 Promise。

## 平台事实

| 端 | 支持 |
| --- | --- |
| 网页端 | 支持 |
| 移动端 | V7.35.0+ |

返回字段取决于按钮位置。来源没有规定不可用字段使用 `undefined`、`null` 还是省略属性，因此调用方应先做存在性检查。

| 场景 | 返回字段 |
| --- | --- |
| 工作项“更多” | `spaceId`、`workObjectId`、number 类型 `workItemId` |
| 节点“更多”或节点流转 | 工作项字段加 `nodeId` |
| 新建工作项 | `spaceId`；位于视图时可有 `workObjectId`、`viewId` |
| 视图批量操作 | `spaceId`、`workObjectId`、可选 `viewId`、按空间和工作项类型分组的 `selectedWorkItems` |
| WBS 计划表“更多” | 工作项字段加 `scheduleUnitCtx` |

批量场景中每个 `selectedWorkItems` 元素包含 `spaceId`、`workObjectId` 和 number 数组 `selectedWorkItemIds`。WBS 单元的 `parentUUID` 在没有父单元时的具体空值形式未定义。

## 调用示例

```ts
const context = await window.JSSDK.button.getContext();

if (typeof context.workItemId === "number") {
  await loadForWorkItem(context.spaceId, context.workItemId);
}
```

`loadForWorkItem` 是插件实现，不是 JSSDK 方法。

## 未定义项

官方资料没有定义 Promise 拒绝值的统一结构，也没有把各场景合并为固定的对象 schema。调用失败时捕获错误，但不要依赖未记录的错误码或字段。

对应 fixture：[Button.getContext](../../fixtures/jssdk/button-get-context.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/ytcawthh
