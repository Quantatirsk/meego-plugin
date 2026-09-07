# Button

`window.JSSDK.button` 提供按钮点击后打开的插件弹窗上下文，以及网页端详情页场景的表单变化监听。按钮位置、后台配置、脚本与弹窗模式见 [按钮 / Button](<../points/按钮 Button.md>)。

<a id="1db61b74"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `getContext()` | 支持 | V7.35.0+ |
| `onWorkItemFormValueChanged()` | 支持，仅详情页按钮 | 不支持 |

API 支持移动端不代表所有按钮位置都支持移动端；位置范围以 [按钮点位配置](<../points/按钮 Button.md#768d5925>) 为准。

<a id="78d2b05c"></a>

## getContext()

在按钮点击后唤起的弹窗内调用，无输入参数，返回当前运行场景的上下文 Promise。

<a id="6ec5ef32"></a>

### 返回值总览

返回对象按按钮位置变化。不要将不同场景的字段合并为一份处处可用的上下文。表中的“为空”仅表示不可用，官方没有统一定义其具体空值形式。

<a id="89c81396"></a>

### 工作项详情

适用于工作项实例“更多”、节点“更多”和节点流转按钮。

| 字段 | 有值时的类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `workObjectId` | string | 当前工作项类型 ID |
| `workItemId` | number | 当前工作项实例 ID |
| `nodeId` | string | 仅节点“更多”和节点流转按钮有值，其他位置为空 |

<a id="f7fedf8e"></a>

### 新建工作项

适用于新建菜单中的插件按钮。此时还没有新建成功的工作项实例 ID。

| 字段 | 有值时的类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `workObjectId` | string | 仅新建按钮位于视图页面时有值，其他场景为空 |
| `viewId` | string | 仅新建按钮位于视图页面时有值，其他场景为空 |

<a id="273b40d7"></a>

### 视图批量操作

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 视图所属空间 ID |
| `workObjectId` | string | 视图所属工作项类型 ID |
| `viewId` | string \| undefined | 视图 ID；通用视图、工作项首页和仪表盘场景可能提供，读取前需判空 |
| `selectedWorkItems` | ISelectedWorkItems[] | 当前选中的工作项，按空间和工作项类型组织 |

<a id="58ba0ae2"></a>

#### ISelectedWorkItems

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 选中实例所属空间 ID |
| `workObjectId` | string | 选中实例的工作项类型 ID |
| `selectedWorkItemIds` | number[] | 选中的工作项实例 ID 数组 |

<a id="d2100bdc"></a>

### WBS 计划表

适用于计划表节点“更多”按钮。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `workObjectId` | string | 当前工作项类型 ID |
| `workItemId` | number | 当前工作项实例 ID |
| `scheduleUnitCtx` | ScheduleUnitCtxType | 当前计划表单元上下文 |

<a id="998cb804"></a>

#### ScheduleUnitCtxType

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `draftId` | string | 当前计划表编辑草稿 ID |
| `parentUUID` | string | 当前计划表单元的父节点 ID |
| `uuid` | string | 当前计划表单元 ID |
| `type` | string | 单元类型，枚举见下表 |
| `value` | Record<string, string \| number> | 与单元类型对应的值 |

<a id="table-content-1"></a>

| `type` | 含义 | `value` 的结构 |
| --- | --- | --- |
| `node` | 节点 | `{ "state_key": "started" }` |
| `sub_task` | 子任务 | `{ "work_item_id": 123, "work_item_type": "task" }` |
| `sub_workitem` | 子流程或资源子流程 | `{ "work_item_id": 123, "work_item_type": "story" }` |
| `sub_instance` | 子工作项 | `{ "work_item_id": 123, "work_item_type": "story" }` |

这里的字符串和 ID 是结构示例；`parentUUID` 在无父单元时的具体空值约定，官方未说明。

<a id="c84d3ff6"></a>

### 调用与返回示例

```typescript
const context = await window.JSSDK.button.getContext();
console.log(context);
```

以下分别展示各场景，演示 ID 不用于真实请求。

视图页面的新建按钮：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "viewId": "fN5l2A0001"
}
```

工作项实例“更多”按钮：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001
}
```

节点“更多”或节点流转按钮：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "workItemId": 6125420001,
  "nodeId": "start"
}
```

视图批量操作按钮：

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

WBS 计划表“更多”按钮：

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

<a id="20682361"></a>

## onWorkItemFormValueChanged(options, callback)

仅用于网页端详情页内的按钮，例如工作项实例“更多”、节点“更多”和节点流转按钮。新建工作项、WBS 计划表、视图批量操作等非详情页场景不可用。

<a id="fc20d431"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `{ watchKeys: Keys[] }` | 指定监听字段或工作项属性，一次最多 10 个 key |
| `callback` | `(changedValue: Record<string, unknown>) => void` | 接收发生变化的字段值映射 |

<a id="7fcc4ce0"></a>

### Keys

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | string 或 AttributeType | 字段 ID（`field_key`），或工作项属性 `name`、`template` |
| `type` | FieldType 的受支持子集 | 字段或属性对应的类型 |

字段 ID 在“空间配置 > 工作项管理 > 字段管理”查看。`name` 使用 `FieldType.text`，`template` 使用 `FieldType.number`，`role_owners` 使用 `FieldType.control`。

不支持 `FieldType.richText`、`FieldType.singleSignal`、`FieldType.multiSignal`、`FieldType.singleVoting`、`FieldType.multiVoting`、`FieldType.simpleVoting`。其他类型见 [通用类型](<通用类型定义.md>)。

<a id="39e72083"></a>

### 返回值与生命周期

返回 `Promise<() => void>`，解析后的函数用于取消监听。弹窗组件卸载时必须清理订阅，包括订阅尚未完成就关闭弹窗的情况。

<a id="02016fd9"></a>

### 示例

下例用于支持监听的网页端详情页按钮弹窗。

```tsx
import { useEffect } from "react";
import { FieldType } from "@lark-project/js-sdk";

export function ButtonNameObserver() {
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void window.JSSDK.button
      .onWorkItemFormValueChanged(
        { watchKeys: [{ key: "name", type: FieldType.text }] },
        (changedValue: Record<string, unknown>) => {
          if (!disposed) console.log(changedValue);
        },
      )
      .then((stop: () => void) => {
        if (disposed) stop();
        else unsubscribe = stop;
      })
      .catch((error: unknown) => console.error("Subscription failed", error));

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  return null;
}
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/ytcawthh
