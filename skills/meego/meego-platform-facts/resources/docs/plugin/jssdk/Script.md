# Script

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.script.end"></a>
- **Script.end** ｜ `jssdk.script.end` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.script.get-context"></a>
- **Script.getContext** ｜ `jssdk.script.get-context` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.script` 用于按钮的脚本模式：读取脚本启动时的点位上下文，并在任务结束后主动停止脚本。入口配置见 [按钮 / Button](<../points/按钮 Button.md#768d5925>)，运行规范见 [脚本模式](<../client/脚本模式.md>)。

<a id="5068361e"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `getContext()` | 支持 | 不支持 |
| `end()` | 支持 | 不支持 |

当前只支持按钮点位的脚本模式。脚本在客户端执行轻量任务，不是可无限运行的服务端进程。

<a id="2d62241f"></a>

## getContext()

获取执行脚本那一刻的上下文，无输入参数。脚本中使用 `script.getContext()`；按钮弹窗中的对应入口是 `button.getContext()`。

<a id="67521d01"></a>

### 返回值与场景

返回 `Promise<ScriptFeatureContext>`。当前 SDK 中 `ScriptFeatureContext` 就是 `ButtonFeatureContext`，由按钮所在位置决定具体结构。

| 场景 | 上下文 |
| --- | --- |
| 所有按钮场景 | `spaceId: string` |
| 工作项详情“更多” | `workObjectId: string`、`workItemId: number` |
| 节点“更多”、节点流转 | 工作项详情上下文，加 `nodeId` |
| 新建按钮 | 视图页面中有 `workObjectId`、`viewId`；其他新建入口不能依赖这两项 |
| 批量操作 | `workObjectId`、可选 `viewId`，以及 `selectedWorkItems` |
| WBS 计划表“更多” | 工作项详情上下文，加 `scheduleUnitCtx` |

`selectedWorkItems` 是数组，每项包含 `spaceId`、`workObjectId`、`selectedWorkItemIds: number[]`。批量上下文中的 `viewId` 按仓库 SDK 类型为可选，处理普通视图、工作项主页或工作台视图组件时，不应无条件依赖它。

`scheduleUnitCtx` 包含 `draftId`、`parentUUID`、`uuid`、`type` 和 `value`。节点类型 `node` 的值包含 `state_key`；`sub_task`、`sub_workitem`、`sub_instance` 的值包含 `work_item_id`、`work_item_type`。完整字段含义与各位置限制见 [Button 上下文](<Button.md#6ec5ef32>)。

<a id="6c8e1492"></a>

### 调用示例

以下代码片段只展示读取和类型收窄；完整入口还必须按下文调用 `end()`。

```typescript
const context = await window.JSSDK.script.getContext();
console.log(context.spaceId);

if ("selectedWorkItems" in context) {
  for (const group of context.selectedWorkItems) {
    console.log(group.spaceId, group.workObjectId, group.selectedWorkItemIds);
  }
}

if ("scheduleUnitCtx" in context) {
  console.log(context.scheduleUnitCtx);
}
```

### 返回结构示例

下列示例按场景分别展示，标识和 ID 是演示值。

视图页面的新建按钮：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "viewId": "fN5l2A0001"
}
```

工作项详情“更多”：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001
}
```

节点“更多”或节点流转：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001,
  "nodeId": "start"
}
```

视图批量操作：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "viewId": "fN5l2A0001",
  "selectedWorkItems": [
    {
      "spaceId": "68382b399de4b0ec6c5a0001",
      "workObjectId": "story",
      "selectedWorkItemIds": [6122540001, 6125420001, 6125420002]
    }
  ]
}
```

WBS 计划表“更多”：

```json
{
  "spaceId": "61cc0c750368e3a252b80001",
  "workObjectId": "63229f846b5c3724758c0001",
  "workItemId": 6734200001,
  "scheduleUnitCtx": {
    "draftId": "7529858472571020001",
    "parentUUID": "root_6734200001",
    "uuid": "node_started_6734200001",
    "type": "node",
    "value": { "state_key": "started" }
  }
}
```

<a id="c328a5d2"></a>

## end()

主动结束脚本，无输入参数。业务逻辑执行完并不等于脚本容器结束；不调用此方法，脚本会一直保持运行状态，直至达到最大执行时间。

调用后会立即停止脚本并卸载执行容器。网络请求、数据写入和其他需要完成的异步工作，必须在调用前等待完成；不要在 `end()` 后安排依赖容器继续运行的逻辑。

<a id="61ab20af"></a>

### 返回值

本套资料采用的 `@lark-project/js-sdk` 2.1.8 声明为 `Promise<void>`，不携带业务结果。结束调用应当作为最后一步；Promise 的类型声明不意味着容器卸载后仍保证执行后续语句。

<a id="b2952d44"></a>

### 完整入口示例

将业务操作放入 `try`，需要完成的异步操作逐一 `await`，在 `finally` 主动结束。下例以读取并打印上下文作为最小任务，同时覆盖读取失败的路径。

```typescript
export default async function main(): Promise<void> {
  try {
    const context = await window.JSSDK.script.getContext();
    console.log(context);
  } catch (error: unknown) {
    console.error("Script failed", error);
  } finally {
    await window.JSSDK.script.end();
  }
}
```

## 运行限制与可用 API

按照 [脚本模式](<../client/脚本模式.md#b59ff70e>) 的约束：单个脚本最长执行 60 秒；相同脚本不能同时执行；不同脚本最多同时执行 3 个。

脚本主入口只允许下列客户端 API。出现某个类名并不表示该类全部实例方法都可用。

| 分类 | 允许的方法 |
| --- | --- |
| 平台上下文 | [Context.load()](<Context.md#f511e728>) |
| 脚本上下文与结束 | `script.getContext()`、`script.end()` |
| 当前地址 | [navigation.getHostname()、getHref()](<navigation.md>) |
| 本地存储 | [storage.setItem()、getItem()、removeItem()、clear()](<storage.md>) |
| 剪贴板 | [clipboard.writeText()](<clipboard.md#c0850036>) |
| 自定义弹窗 | [modal.open()](<modal.md#8ab02bbb>) |
| 提示 | [toast.info()、warning()、error()、success()、close()](<toast.md>) |
| 授权 | [utils.getAuthCode()](<utils.md#21b31584>) |
| 空间数据 | [Space.load()](<Space.md#da8445aa>) |
| 工作项类型数据 | [WorkObject.load()](<WorkObject.md#d7653a20>) |
| 工作项实例数据 | [WorkItem.load()](<WorkItem.md#d92cb7a6>) |
| 字段数据 | [Field.load()](<Field.md#5de03037>) |

脚本可以按条件调用 `modal.open()` 打开自定义弹窗；弹窗入口和上下文传递使用 modal 的契约。脚本主入口的白名单没有 `shared.setSharedModules()`、平台上下文监听或表单值监听，不要把普通页面入口的初始化和订阅代码直接放入脚本。需要共享 UI 资源的弹窗页面按其自身运行环境接入 [shared](<shared.md>)。

## 相关文档

- [脚本模式](<../client/脚本模式.md>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/dff7a89n
