# WorkItem

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.work-item.load"></a>
- **WorkItem.load** ｜ `jssdk.work-item.load` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.WorkItem` 读取一个工作项实例的基础模型和字段值。它是客户端读取接口，不能据此假设服务端 OpenAPI 的字段值结构相同。

**阅读导航**：[支持范围](#a7ae0576) · [加载实例](#d92cb7a6) · [输入结构](#428cfb33) · [返回模型](#274e4a32) · [使用示例](#a1e44e9a)

<a id="a7ae0576"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `WorkItem.load()` | 支持 | 飞书项目移动端 V7.35.0+ |

<a id="d92cb7a6"></a>

## load()

```ts
const workItem = await window.JSSDK.WorkItem.load({
  spaceId,
  workObjectId,
  workItemId,
});
```

`workItemId` 是 `number`。上下文、按钮或点位若未提供该字段，不能凭名称反查后直接调用；应先确认当前运行场景支持工作项实例。

<a id="ae0c02b5"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `identity` | [`WorkItemIdentity`](#428cfb33) | 空间、工作项类型和实例的组合标识 |

<a id="428cfb33"></a>

### WorkItemIdentity

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | `string` | 空间 ID |
| `workObjectId` | `string` | 工作项类型 ID |
| `workItemId` | `number` | 工作项实例 ID |

<a id="274e4a32"></a>

## 返回模型

`load()` 返回 `Promise<WorkItem>`。

| 属性或方法 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `number` | 工作项实例 ID |
| `name` | `string` | 工作项名称 |
| `spaceId` | `string` | 所属空间 ID |
| `workObjectId` | `string` | 所属工作项类型 ID |
| `templateId` | `number` | 使用的模板 ID |
| `isAborted` | `boolean` | 是否已终止 |
| `isDeleted` | `boolean` | 是否已删除 |
| `roleOwnersList` | [`RoleOwners[]`](通用类型定义.md#580c95c3) | 角色与负责人 |
| `getFieldValue(fieldId)` | `FieldValue` | 返回指定字段当前客户端值 |

它是同步读取方法，**不返回 Promise**。最新 SDK `2.1.8` 声明的 `FieldValue` 只包含 `string`、`string[]` 和 `number`；官方字段值表还列出布尔值和复合结构，两者不能组成完整的穷尽类型。因此，请依据字段类型收窄值再使用；已知值形状见[FieldValue](<通用类型定义.md#ebc3167f>)。

<a id="a1e44e9a"></a>

## 使用示例

```ts
const workItem = await window.JSSDK.WorkItem.load({
  spaceId,
  workObjectId,
  workItemId,
});

const value = workItem.getFieldValue(fieldId);
if (typeof value === 'string') {
  console.log(value);
}
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/gvuo2oip
