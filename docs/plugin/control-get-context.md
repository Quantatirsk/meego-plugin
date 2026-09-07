# JSSDK：Control.getContext

`window.JSSDK.control.getContext()` 读取表单控件或节点表单控件所在位置的运行上下文。它无参数，返回解析为上下文对象的 Promise。

## 支持范围

| 端 | API 最低版本 | 点位交付注意事项 |
| --- | --- | --- |
| 网页端 | 支持 | 仅表单和节点表单使用该 API |
| 移动端 | V7.35.0+ | Control 点位本身还要求满足其移动端支持条件 |

表格列展示态由服务端接口和布局配置驱动，不在单元格内调用此 API。

## 返回字段

| 字段 | 有值时类型 | 含义 |
| --- | --- | --- |
| `spaceId` | `string` | 当前空间 ID |
| `workObjectId` | `string` | 当前工作项类型 ID；新建页可能为空 |
| `workItemId` | `number` | 当前工作项实例 ID；新建页为空 |
| `UUID` | `string` | 新建页临时标识，用于创建成功回调关联 |
| `nodeId` | `string` | 节点表单中的节点 ID |

官方参数表描述的是字段可用性，未为所有空值场景规定统一的序列化形式。调用方应进行存在性检查，而不是假设属性始终存在或始终为 `null`。

## 场景判断

先判断 `nodeId`，因为节点表单通常也带有 `workItemId`。其余场景可按下列顺序处理：

1. `nodeId` 有值：按工作项与节点关联数据。
2. `workItemId` 有值：按工作项实例关联数据。
3. `workItemId` 为空且 `UUID` 有值：暂存新建页数据，等待创建成功回调完成关联。
4. 其他情况：不要推测运行位置；记录不足的上下文并停止依赖该场景的数据操作。

## 最小调用示例

```typescript
type ControlContext = {
  spaceId?: string;
  workObjectId?: string;
  workItemId?: number;
  UUID?: string;
  nodeId?: string;
};

export async function loadControlContext(): Promise<ControlContext> {
  return window.JSSDK.control.getContext();
}
```

新建页的 `UUID` 只能用于临时关联，不能替代创建后的 `workItemId`。需要读取同一表单中其他值时，使用 `getCreateWorkItemFormItemValues()`；需要订阅表单变化时，使用 `onWorkItemFormValueChanged()` 并在卸载时取消订阅。

对应 fixture：[Control.getContext](../../fixtures/jssdk/control-get-context.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/x4isqv2u
