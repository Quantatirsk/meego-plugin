# Schedule

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.schedule.get-context"></a>
- **Schedule.getContext** ｜ `jssdk.schedule.get-context` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.get-owners-info"></a>
- **Schedule.getOwnersInfo** ｜ `jssdk.schedule.get-owners-info` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.get-props"></a>
- **Schedule.getProps** ｜ `jssdk.schedule.get-props` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.get-wbs-status"></a>
- **Schedule.getWbsStatus** ｜ `jssdk.schedule.get-wbs-status` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.handle-cancel"></a>
- **Schedule.handleCancel** ｜ `jssdk.schedule.handle-cancel` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.handle-submit"></a>
- **Schedule.handleSubmit** ｜ `jssdk.schedule.handle-submit` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.resize-container"></a>
- **Schedule.resizeContainer** ｜ `jssdk.schedule.resize-container` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.schedule.watch"></a>
- **Schedule.watch** ｜ `jssdk.schedule.watch` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.customComponent.schedule` 是节点排期扩展组件的运行时入口。组件读取平台传入的排期与禁用状态，监听变化，最后提交日期范围或取消编辑。后台配置与覆盖位置见 [扩展字段-节点排期 / Schedule](<../points/扩展字段-节点排期 Schedule.md>)。

<a id="12cef518"></a>

## 支持范围

以下方法均仅支持网页端，移动端不支持。

| 方法 | 用途 | 额外限制 |
| --- | --- | --- |
| `getProps()` | 读取受控值和禁用状态 | 排期组件内 |
| `watch()` | 监听 props 变化 | 同步返回取消函数 |
| `getContext()` | 读取所在场景与节点身份 | 实际目标可能与外层工作项不同 |
| `resizeContainer()` | 调整面板尺寸 | 宽高分别不超过 800 px |
| `getWbsStatus()` | 读取 WBS 状态 | 仅计划表生效，SDK 声明为可选方法 |
| `getOwnersInfo()` | 读取节点负责人 | SDK 声明为可选方法 |
| `handleSubmit()` | 校验并保存排期 | 检查结果 `code` |
| `handleCancel()` | 放弃保存并关闭面板 | 不提交当前编辑值 |

<a id="c53a2c8e"></a>

## getProps()

无参数，返回当前组件的受控属性 Promise。

<a id="bde7bb05"></a>
<a id="bbb6cff5"></a>

### CompScheduleProps

| 字段 | SDK 类型 | 含义 |
| --- | --- | --- |
| `value` | string[] | 空日期范围，或开始、结束两个 `YYYY-MM-DD` 日期字符串 |
| `disabled` | boolean，可选 | 是否禁用；不可把未给值等同于服务端允许任意写入 |

<a id="85b4a6d0"></a>

### 示例

```typescript
const props = await window.JSSDK.customComponent.schedule.getProps();
console.log(props.value, props.disabled);
```

```json
{
  "value": ["2025-01-01", "2025-01-02"],
  "disabled": false
}
```

<a id="4bf801c3"></a>

## watch(callback, watchKeys?)

监听 `getProps()` 所定义的属性变化。

<a id="b43f63e1"></a>

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | `(next: CompScheduleProps) => void` | 接收最新 props |
| `watchKeys` | WatchableKeysOfSchedule[]，可选 | 仅这些属性变化时回调；省略时监听全部可监听属性 |

<a id="8372e702"></a>

可监听的键为 `value`、`disabled`，不能传方法名。

<a id="1a35226b"></a>

### 返回值与清理

**同步**返回 `() => void`。组件卸载时调用取消函数；它与 CustomField 等异步订阅方法的返回形式不同。

```tsx
import { useEffect } from "react";

export function ScheduleObserver() {
  useEffect(() => {
    const off = window.JSSDK.customComponent.schedule.watch(
      (props) => console.log(props.value, props.disabled),
      ["value", "disabled"],
    );
    return off;
  }, []);

  return null;
}
```

<a id="669d6bf5"></a>

## getContext()

无参数，返回当前组件上下文的 Promise。

<a id="7919024a"></a>

### 外层上下文

| 字段 | SDK 类型 | 含义 |
| --- | --- | --- |
| `scene` | ComponentScheduleScene | 当前排期场景 |
| `spaceId` | string | 当前界面所属空间 |
| `workObjectId` | string | 当前界面所属工作项类型 |
| `workItemId` | number，可选 | 当前界面所属工作项实例 |
| `identity` | ComponentScheduleIdentity，可选 | 排期实际所属节点或子任务的身份 |

`identity` 内的空间、类型、实例可能与外层不同，特别是计划表中的跨空间子工作项和子流程。应以实际目标身份操作该节点，不能直接用外层标识替代。

<a id="6455a41b"></a>
<a id="table-content-1"></a>

### ComponentScheduleScene

| 编码 | 枚举成员 | 含义 |
| --- | --- | --- |
| 0 | `ALL` | SDK 中的全部场景配置值；原运行示例未说明会返回此值 |
| 1 | `workItemNode` | 节点、子任务排期 |
| 2 | `scheduleTable` | 计划表排期 |

<a id="97fd1c61"></a>

### 节点身份

| 字段 | 有值时类型 | 含义 |
| --- | --- | --- |
| `spaceId` | string | 实际节点所属空间 |
| `workObjectId` | string | 实际节点所属工作项类型 |
| `workItemId` | number | 实际节点所属工作项实例 |
| `type` | WorkItemNodeType | 节点种类 |
| `nodeId` | string | 当前节点 ID |
| `taskId` | string | 子任务 ID，仅子任务排期场景有业务含义 |

SDK 将 `nodeId`、`taskId` 声明为 string，但官方示例及场景说明没有保证每种节点都提供两者。使用时应按节点类型判断，不能把非子任务场景的 `taskId` 当成有效目标。

<a id="e7d7919c"></a>
<a id="2061c008"></a>
<a id="table-content-2"></a>

### WorkItemNodeType

| 值 | 枚举成员 | 含义 |
| --- | --- | --- |
| `node` | `Node` | 节点 |
| `sub_task` | `SubTask` | 子任务 |
| `sub_workitem` | `SubWorkItem` | 子流程或资源子流程，仅计划表 |
| `sub_instance` | `SubInstance` | 子工作项，仅计划表 |

<a id="76886bc5"></a>

### 场景示例

```typescript
const context = await window.JSSDK.customComponent.schedule.getContext();
console.log(context.scene, context.spaceId, context.workObjectId, context.workItemId);
console.log(context.identity?.type, context.identity?.nodeId, context.identity?.taskId);
```

以下 JSON 展示有效业务字段，ID 为演示值；未给出的空标识不表示所有宿主都以省略属性表达空值。

表单或视图中的节点排期：

```json
{
  "scene": 1,
  "spaceId": "space_a",
  "workObjectId": "story",
  "workItemId": 111580001,
  "identity": {
    "spaceId": "space_a", "workObjectId": "story", "workItemId": 111580001,
    "type": "node", "nodeId": "doing"
  }
}
```

表单或视图中的子任务排期：

```json
{
  "scene": 1,
  "spaceId": "space_a",
  "workObjectId": "story",
  "workItemId": 111580001,
  "identity": {
    "spaceId": "space_a", "workObjectId": "story", "workItemId": 111580001,
    "type": "sub_task", "nodeId": "doing", "taskId": "111580002"
  }
}
```

计划表节点排期：

```json
{
  "scene": 2,
  "spaceId": "space_a",
  "workObjectId": "story",
  "workItemId": 111580001,
  "identity": {
    "spaceId": "space_a", "workObjectId": "story", "workItemId": 111580001,
    "type": "node", "nodeId": "doing"
  }
}
```

计划表子任务排期：

```json
{
  "scene": 2,
  "spaceId": "space_a",
  "workObjectId": "story",
  "workItemId": 111580001,
  "identity": {
    "spaceId": "space_a", "workObjectId": "story", "workItemId": 111580001,
    "type": "sub_task", "nodeId": "doing", "taskId": "111580002"
  }
}
```

计划表中跨空间、跨工作项类型的子流程节点：

```json
{
  "scene": 2,
  "spaceId": "space_a",
  "workObjectId": "story",
  "workItemId": 105470001,
  "identity": {
    "spaceId": "space_b", "workObjectId": "sub_flow", "workItemId": 105470002,
    "type": "sub_workitem", "nodeId": "sub_flow_node"
  }
}
```

<a id="930232da"></a>

## resizeContainer(width?, height?)

排期弹窗初始大小为 **568 px × 346 px**。

<a id="9d26be3f"></a>

| 参数 | 类型 | 约束 |
| --- | --- | --- |
| `width` | number，可选 | 最大 800 px；省略时宽度不变 |
| `height` | number，可选 | 最大 800 px；省略时高度不变 |

<a id="c91c2a97"></a>

返回 `Promise<undefined>`，不携带业务值。

<a id="de7ea5fd"></a>

```typescript
await window.JSSDK.customComponent.schedule.resizeContainer(300, 400);
```

<a id="93953630"></a>

## getWbsStatus()

仅计划表场景生效，无参数。SDK 将方法声明为可选，应先判断是否存在。

<a id="d0461de5"></a>

返回 Promise，结果的 `wbsStatus: string` 为节点所属 WBS 状态；官方说明还允许没有结果，读取时需判空。可选状态在“工作项管理 > 字段管理 > 状态（`work_item_status`）> 配置选项”查看，或通过 OpenAPI 查询工作项字段配置。

<a id="4e6ad3d5"></a>

```typescript
const schedule = window.JSSDK.customComponent.schedule;
const context = await schedule.getContext();
if (context.scene === 2 && schedule.getWbsStatus) {
  const status = await schedule.getWbsStatus();
  console.log(status?.wbsStatus);
}
```

```json
{ "wbsStatus": "start" }
```

<a id="4f1aa61b"></a>

## getOwnersInfo()

读取实际节点负责人，无参数，SDK 将方法声明为可选。

<a id="a074faea"></a>
<a id="7a203531"></a>

返回 `Promise<UserInfo[]>`，每项的 `userKey: string` 为用户标识。返回值直接是数组，不是包含 `userList` 的对象。

<a id="d821ff0b"></a>

```typescript
const schedule = window.JSSDK.customComponent.schedule;
if (schedule.getOwnersInfo) {
  const owners = await schedule.getOwnersInfo();
  console.log(owners.map((owner) => owner.userKey).join("/"));
}
```

```json
[{ "userKey": "liming" }, { "userKey": "hanmeimei" }]
```

<a id="b0d648da"></a>

## handleSubmit(value)

将排期范围提交给平台，经过校验后保存到工作项实例。

<a id="f34b330b"></a>

### 参数与校验

SDK 参数为必传 `string[]`。非空值必须是两个有效的 `YYYY-MM-DD` 日期字符串，且开始日期早于结束日期；例如 `2011-13-13` 不是合法日期。

清空时使用 `[]`，符合当前 SDK 类型和官方空范围规则。原校验说明还列出 `undefined`、`null` 及两端均为空的值，但当前 TypeScript 方法没有声明这些参数类型，因此示例统一使用空数组。

<a id="b493cc08"></a>

### 返回值

返回 `Promise<ScheduleCompValidateMsg>`，包含 number 类型 `code` 和 string 类型 `msg`。`code: 200` 才表示保存成功，不能只根据 Promise fulfilled 判断成功。

| code | msg | 含义 |
| --- | --- | --- |
| 200 | `save success` | 保存成功 |
| 401 | `value should be an array, which describes date range` | 不是空值或合法范围数组 |
| 402 | `date range needs both start time and end time` | 非空范围缺少一端日期 |
| 403 | `start value should be valid date string in format YYYY-MM-DD` | 开始日期无效 |
| 404 | `end value should be valid date string in format YYYY-MM-DD` | 结束日期无效 |
| 405 | `start time should be before end time` | 开始日期须早于结束日期 |
| 406 | 未固定 | 未知错误或执行异常 |

<a id="cc9a9293"></a>

### 示例

```typescript
const result = await window.JSSDK.customComponent.schedule.handleSubmit([
  "2025-01-01",
  "2025-01-02",
]);
if (result.code !== 200) {
  console.error(result.code, result.msg);
}
```

```json
{ "code": 200, "msg": "save success" }
```

<a id="37fec1dd"></a>

## handleCancel()

不保存当前编辑值，直接关闭排期面板，无参数。

<a id="4d4976fe"></a>

返回 `Promise<void>`。

<a id="bfbf746b"></a>

```typescript
await window.JSSDK.customComponent.schedule.handleCancel();
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/145ygv1u
