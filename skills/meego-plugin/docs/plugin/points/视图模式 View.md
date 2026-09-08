# 视图模式 / View

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.view"></a>
- **视图模式 / View** ｜ `plugin-point.view` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

视图模式点位在工作项视图中提供插件自定义展示方式，可实现筛选、实例列表和业务操作。本文介绍接入与实例管理示例；空间、工作项类型和视图 ID 的完整契约见 [View JSSDK](<../jssdk/View.md>)。

<a id="00f16d13"></a>

## 位置与运行范围

本篇 `view_web_demo` 为网页端示例。`view.getContext()` 支持网页端与移动端 V7.35.0+；示例使用的网页端 UI 组件及布局不会因上下文 API 支持移动端而自动具备双端兼容性。

开发、服务端接入、测试与发布的完整流程见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。

<a id="c70cf321"></a>

## 接入步骤

<a id="d10f170b"></a>

### 添加视图构成

在开发者后台 [创建插件](<../guides/创建插件.md>)，再按 [添加插件构成](<../guides/添加插件功能.md#e3ac4ff2>) 的流程选择“视图”，关联对应工作项类型和代码资源。

<a id="b4c30d48"></a>

### 配置客户端入口

尚无工程时，按 [开发调试客户端](<../client/开发调试客户端.md>) 初始化；也可使用官方 [实例管理示例工程](https://github.com/larksuite/lark-project-template/tree/feat/help-doc-demo/project/doc-demos/instance-manager)。在示例工程目录安装依赖：

```shell
lpm install
```

已有工程按以下顺序接入：

1. 检查 `plugin.config.json`，添加 ID 为 `view_web_demo` 的入口，参见 [配置文件说明](<../client/初始化插件工程.md#db160213>)。
2. 在 `entry` 对应文件编写入口，参考官方 [入口文件](https://github.com/larksuite/lark-project-template/blob/feat/help-doc-demo/project/doc-demos/instance-manager/src/features/view_web_demo/index.tsx)。
3. 在入口引用的 `App.tsx` 中放入最小组件，先确认渲染。

```tsx
import type { ReactElement } from "react";

export default function App(): ReactElement {
  return <div>Hello world</div>;
}
```

启动开发服务：

```shell
lpm start
```

使用 `@lark-project/ui-kit-plugin` 的模块应在 [共享资源初始化](<../jssdk/shared.md#d7f829f2>) 完成后加载。实例管理页面中的 `WorkItemFinder` 属于这类依赖。

<a id="762cea3c"></a>
<a id="e1e3672b"></a>

### 查看渲染结果

1. 在开放平台的插件详情“插件功能”页左下角开启本地调试。
2. 进入飞书项目空间，选择视图构成对应的工作项类型，打开“视图列表”并进入一个视图。
3. 在视图右上角下拉列表中选择对应插件，确认显示 `Hello world`。
4. 修改页面内容，检查热更新。

<a id="fd1db56b"></a>

## 实例管理示例

官方示例通过筛选器设置条件，将当前视图的实例信息展示为表格，并允许点击实例名称打开详情。

示例工程的需求数据是模拟数据，直接打开详情会提示不存在对应工作项。实际使用时，应从真实接口加载实例数据；不能仅替换展示名称而继续使用模拟 ID。

<a id="0de27ace"></a>

### 所用客户端能力

| 用途 | API |
| --- | --- |
| 读取视图上下文 | [view.getContext()](<../jssdk/View.md#cd3b77ca>) |
| 加载空间与工作项类型信息 | [Space.load()](<../jssdk/Space.md>) |
| 打开实例详情 | [navigation.openWorkItemDetailPage()](<../jssdk/navigation.md#51bb3507>) |
| 本地缓存 | [storage.getItem()、setItem()](<../jssdk/storage.md>) |

`view.getContext()` 返回 `spaceId`、`workObjectId`、`viewId`，不返回完整实例列表，也不监听筛选条件。示例工程中的 `loginAuth`、`queryWorkItemsByViewId` 是业务层封装，不是 JSSDK 新增方法。

<a id="37b2134e"></a>

### 页面组织

<a id="a40e4874"></a>

#### 入口与筛选区

`App.tsx` 渲染实例管理页面：

```tsx
import { InstanceManagementPage } from "../../pages";

export default function App() {
  return <InstanceManagementPage />;
}
```

业务页面先读取上下文、完成业务身份处理，再加载类型映射和实例数据；筛选器提交后重新查询列表。原文没有提供上述数据加载的完整实现，下面仅提取已有数据下的页面布局，调用方负责提供有效属性。

```tsx
import type { ComponentProps } from "react";
import type { BriefWorkObject, ViewFeatureContext } from "@lark-project/js-sdk";
import { WorkItemFinder } from "@lark-project/ui-kit-plugin";
import { InstanceTable, type InstanceRow } from "./InstanceTable";

type FinderProps = ComponentProps<typeof WorkItemFinder>;

interface InstanceManagementBodyProps {
  context: ViewFeatureContext;
  searchId: FinderProps["searchId"];
  onSubmit: FinderProps["onSubmit"];
  allowWorkObjectMap: Map<string, BriefWorkObject>;
  rows: InstanceRow[];
}

export function InstanceManagementBody({
  context,
  searchId,
  onSubmit,
  allowWorkObjectMap,
  rows,
}: InstanceManagementBodyProps) {
  return (
    <div>
      <WorkItemFinder
        spaceId={context.spaceId}
        workObjectId={context.workObjectId}
        searchId={searchId}
        onSubmit={onSubmit}
      />
      <InstanceTable
        spaceId={context.spaceId}
        allowWorkObjectMap={allowWorkObjectMap}
        dataSource={rows}
      />
    </div>
  );
}
```

筛选器类型通过组件本身推导，避免为未在本页定义的 `searchId` 和提交结果另造协议。组件参数始终使用 `spaceId`，大小写与上下文保持一致。

<a id="04bb90fc"></a>

#### 实例表格与详情跳转

表格显示工作项 ID、名称和类型。下面的 `InstanceRow` 是页面展示模型，业务层应把真实接口结果映射到此结构，它不是对 OpenAPI 原始响应字段的重新定义。

```tsx
import { Table, Typography } from "@douyinfe/semi-ui";
import type { BriefWorkObject } from "@lark-project/js-sdk";

export interface InstanceRow {
  workItemId: number;
  name: string;
  workObjectId: string;
}

interface InstanceTableProps {
  spaceId: string;
  allowWorkObjectMap: Map<string, BriefWorkObject>;
  dataSource: InstanceRow[];
}

export function InstanceTable({
  spaceId,
  allowWorkObjectMap,
  dataSource,
}: InstanceTableProps) {
  return (
    <Table
      bordered
      rowKey="workItemId"
      dataSource={dataSource}
      columns={[
        { title: "Work item ID", dataIndex: "workItemId" },
        {
          title: "Name",
          dataIndex: "name",
          render: (_value: unknown, row: InstanceRow) => (
            <Typography.Text
              link
              onClick={() => {
                window.JSSDK.navigation.openWorkItemDetailPage({
                  spaceId,
                  workObjectId: row.workObjectId,
                  workItemId: row.workItemId,
                });
              }}
            >
              {row.name}
            </Typography.Text>
          ),
        },
        {
          title: "Work item type",
          dataIndex: "workObjectId",
          render: (_value: unknown, row: InstanceRow) =>
            allowWorkObjectMap.get(row.workObjectId)?.name ?? row.workObjectId,
        },
      ]}
    />
  );
}
```

这些代码片段需要示例工程的入口、共享资源初始化和数据层。切换页面或组件卸载后，不应继续向旧页面写入异步查询结果；如接入平台上下文订阅，也应按 [Context](<../jssdk/Context.md#cec0cd73>) 清理监听。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/3i2084ts
