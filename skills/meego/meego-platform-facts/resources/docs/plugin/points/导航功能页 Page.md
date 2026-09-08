# 导航功能页 / Page

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.page"></a>
- **导航功能页 / Page** ｜ `plugin-point.page` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

导航功能页在飞书项目导航中提供独立入口，打开插件自定义页面，适合工作项管理等空间级功能。页面内容由客户端代码渲染；所在空间通过 [Page JSSDK](<../jssdk/Page.md>) 获取。

<a id="ac63f391"></a>

## 位置与开发范围

本文的 `page_web_demo` 是网页端示例。`page.getContext()` 支持网页端及移动端 V7.35.0+，但新建表单的完成、取消回调仅网页端支持，因此下文依靠完成回调写入本地缓存的流程不能直接照搬到移动端。

完整流程见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。这里聚焦添加构成、接入客户端和工作项管理示例。

<a id="f3d3c4a1"></a>

## 接入步骤

<a id="9e5bd8c7"></a>

### 添加导航页面构成

在开发者后台 [创建插件](<../guides/创建插件.md>)，再 [添加插件构成](<../guides/添加插件功能.md#e3ac4ff2>)，选择“导航页面”。后台的构成资源与工程入口需要对应。

<a id="d25ada95"></a>

### 配置并启动客户端

没有工程时，按 [开发调试客户端](<../client/开发调试客户端.md>) 初始化，也可使用官方 [工作项管理示例工程](https://github.com/larksuite/lark-project-template/tree/feat/help-doc-demo/project/doc-demos/work-item-manager)。在示例工程目录安装依赖：

```shell
lpm install
```

已有工程按以下顺序接入：

1. 检查 `plugin.config.json`，配置 ID 为 `page_web_demo` 的入口，参见 [配置文件说明](<../client/初始化插件工程.md#db160213>)。
2. 在 `entry` 指向的位置实现入口，参考官方 [入口文件](https://github.com/larksuite/lark-project-template/blob/feat/help-doc-demo/project/doc-demos/work-item-manager/src/features/page_web_demo/index.tsx)。
3. 在入口加载的 `App.tsx` 先放入最小组件，验证加载。

```tsx
import type { ReactElement } from "react";

export default function App(): ReactElement {
  return <div>Hello world</div>;
}
```

启动本地开发服务：

```shell
lpm start
```

使用依赖注入的 UI 资源时，应按 [shared](<../jssdk/shared.md#d7f829f2>) 等待共享模块初始化，再加载业务组件；不要在资源就绪前静态导入依赖它的页面。

<a id="574ed9fd"></a>
<a id="d7911bde"></a>

### 验证页面与热更新

1. 在开发者后台插件详情页左下角开启“插件本地调试”。
2. 若飞书项目页面已经打开，开启调试后刷新页面。
3. 在飞书项目导航中找到所配置的插件，确认显示 `Hello world`。
4. 修改组件内容，检查热更新。

<a id="c178577d"></a>

## 工作项管理示例

页面先选择工作项类型，再打开新建表单。创建成功后显示 toast，并将新实例标识保存到本地缓存；随后根据这些标识加载工作项实例及类型详情，展示为表格。点击实例名称或“详情”打开平台详情页，“从缓存删除”仅移除本地记录，不删除平台上的工作项。

本地缓存的数据范围见 [storage](<../jssdk/storage.md>)。它是示例的记录来源，不应被描述成整个空间的共享实例数据库。

<a id="a80113be"></a>

### 所用客户端能力

| 用途 | API |
| --- | --- |
| 读取页面空间 | [page.getContext()](<../jssdk/Page.md#c30c0bf9>) |
| 加载空间及启用的工作项类型 | [Space.load()](<../jssdk/Space.md>) |
| 打开新建表单 | [navigation.openWorkItemCreatePage()](<../jssdk/navigation.md#3413fb44>) |
| 打开实例详情 | [navigation.openWorkItemDetailPage()](<../jssdk/navigation.md#51bb3507>) |
| 成功提示 | [toast.success()](<../jssdk/toast.md>) |
| 读写本地缓存 | [storage.getItem()、setItem()](<../jssdk/storage.md>) |
| 加载表格所需的实例与类型信息 | [WorkItem](<../jssdk/WorkItem.md>)、[WorkObject](<../jssdk/WorkObject.md>) |

<a id="62aa943f"></a>

### 页面与数据组织

`App.tsx` 接入业务页面：

```tsx
import { WorkItemPage } from "../../pages";

export default function App() {
  return <WorkItemPage />;
}
```

官方示例由 `WorkItemPage` 管理已缓存实例列表，`Header` 提供类型选择和新建操作，`WorkItemTable` 展示列表并通知父组件移除缓存。原文省略了缓存读取、模型加载和表格转换代码；完整实现以 [示例工程](https://github.com/larksuite/lark-project-template/tree/feat/help-doc-demo/project/doc-demos/work-item-manager) 为准。以下代码按职责给出组件片段，不是独立工程。

<a id="7de7f831"></a>

### 类型选择与创建回调

类型选择器先获取 Page 上下文，再加载空间的 `enabledWorkObjectList`。选项保留工作项类型的 ID、名称及所属空间；不要把类型名称当作类型 ID。

```tsx
import { useEffect, useState } from "react";
import type { BriefWorkObject } from "@lark-project/js-sdk";
import { Select } from "@douyinfe/semi-ui";

export type WorkObjectChoice = BriefWorkObject & { spaceId: string };

interface WorkObjectSelectProps {
  value?: string;
  onChange: (choice: WorkObjectChoice) => void;
}

export function WorkObjectSelect({ value, onChange }: WorkObjectSelectProps) {
  const [choices, setChoices] = useState<WorkObjectChoice[]>([]);

  useEffect(() => {
    let disposed = false;

    void (async () => {
      const { spaceId } = await window.JSSDK.page.getContext();
      const space = await window.JSSDK.Space.load(spaceId);
      if (!disposed) {
        setChoices(
          space.enabledWorkObjectList.map((item) => ({
            ...item,
            spaceId: space.id,
          })),
        );
      }
    })().catch((error: unknown) => console.error("Loading failed", error));

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <Select
      placeholder="Select a work item type"
      value={value}
      optionList={choices.map((item) => ({ label: item.name, value: item.id }))}
      onChange={(nextValue) => {
        const choice = choices.find((item) => item.id === nextValue);
        if (choice) onChange(choice);
      }}
    />
  );
}
```

`Header` 保存选中的 `WorkObjectChoice`，没有选中类型时禁用创建按钮。点击后调用下面的处理函数。它通过新建完成回调得到实例 ID，再通知 `WorkItemPage` 保存缓存和刷新表格。

```typescript
interface WorkItemReference {
  spaceId: string;
  workObjectId: string;
  workItemId: number;
}

export function createWorkItem(
  choice: { id: string; spaceId: string },
  onWorkItemCreated: (item: WorkItemReference) => void,
): void {
  window.JSSDK.navigation.openWorkItemCreatePage(
    { spaceId: choice.spaceId, workObjectId: choice.id, mode: "modal" },
    (error, result) => {
      if (error !== undefined) {
        console.error("Creation failed", error);
        return;
      }
      window.JSSDK.toast.success("Work item created");
      onWorkItemCreated({
        spaceId: choice.spaceId,
        workObjectId: choice.id,
        workItemId: result.workItemId,
      });
    },
  );
}
```

这里选择 `modal` 模式，使创建完成后保留当前导航页面；该模式不设置 `supportedWorkObjectIds`。方法本身没有返回值，不能通过 `await` 方法返回值获得新实例 ID。

<a id="0b3402e6"></a>

### 表格展示与移除记录

| 列 | 展示与交互 |
| --- | --- |
| 实例名称 | 来自实例详情，点击打开平台详情页 |
| 工作项类型 | 来自对应工作项类型配置 |
| 流程模式 | 展示类型对应的流程模式 |
| 操作 | “详情”打开实例；“从缓存删除”通知父组件移除缓存记录 |

`WorkItemTable` 接收 `workItems` 和 `onRemoveWorkItem`，按实例标识加载 `WorkItem`、`WorkObject` 后组成表格数据。移除缓存后应更新页面状态并写回本地缓存；它不需要、也不应调用删除工作项的 OpenAPI。

打开详情所需的参数如下，调用方传入从真实实例加载的标识：

```typescript
export function openWorkItemDetails(item: {
  spaceId: string;
  workObjectId: string;
  workItemId: number;
}): void {
  window.JSSDK.navigation.openWorkItemDetailPage(item);
}
```

<a id="8f777d0d"></a>

## 后续交付

涉及前后端数据交互时，按 [服务端环境准备](<../guides/环境准备.md#38dff170>) 和 [API 结构介绍](https://project.feishu.cn/b/helpcenter/1p8d7djs/4bsmoql6#56999bc8) 实现并部署服务端。完成开发后按 [发布插件](<../guides/发布插件.md>) 发布，才能供其他用户安装使用。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/cgz5y882
