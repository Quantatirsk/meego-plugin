# 详情标签页 / Tab

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.tab"></a>
- **详情标签页 / Tab** ｜ `plugin-point.tab` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`plugin-point.tab.fixture`](<../../../fixtures/plugin/tab.json>)

<!-- capability-metadata:end -->

详情标签页位于工作项实例的 Tab 区域。开发者可配置标签名称，自定义标签下独立页面的内容和样式，适合承载项目进展记录、用例执行记录、需求合码情况等与具体实例关联的功能。

本文说明点位接入和字段分类示例。上下文、表单值监听及取消监听的完整契约见 [Tab JSSDK](<../jssdk/Tab.md>)。

<a id="136f2b48"></a>

## 位置与支持范围

点位支持网页端与移动端。`tab.getContext()` 在移动端的最低版本为 V7.35.0+，表单值变化监听仅支持网页端；开发双端页面时分别检查所调用 API 的支持范围。

![标签页在插件开发流程中的位置](<../assets/29763dc90bbe16d6f952932c.png>)

![网页端详情标签页入口](<../assets/6a9bfad3e5641bf5153258ab.gif>)

![移动端详情标签页入口](<../assets/b7543a5e89e2d26e54c9d9e9.gif>)

完整开发、测试和发布流程见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。下面聚焦添加 Tab 构成、接入客户端及验证页面。

<a id="f8da1547"></a>

## 点位接入

<a id="b3fcaf92"></a>

### 添加详情标签页构成

1. 在开发者后台 [创建插件](<../guides/创建插件.md>)。
2. 按 [添加插件构成](<../guides/添加插件功能.md#e3ac4ff2>) 的流程选择“详情标签页 / Tab”，配置名称、适用工作项类型与对应端资源。

<a id="1372412c"></a>

### 接入客户端入口

尚无客户端工程时，参照 [开发调试客户端](<../client/开发调试客户端.md>) 初始化。也可从官方 [字段分类示例工程](https://github.com/larksuite/lark-project-template/tree/feat/help-doc-demo/project/doc-demos/field-category-config) 开始，在工程目录安装依赖：

```shell
lpm install
```

已有工程按以下步骤接入：

1. 检查 `plugin.config.json`，为示例添加 `id` 为 `tab_web_demo` 的入口，参见 [配置文件说明](<../client/初始化插件工程.md#db160213>)。
2. 在配置的 `entry` 文件实现入口，参考官方 [入口文件](https://github.com/larksuite/lark-project-template/blob/feat/help-doc-demo/project/doc-demos/field-category-config/src/features/tab_web_demo/index.tsx)。
3. 入口加载 `App.tsx`。先使用下列最小组件确认资源能正常渲染。

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

<a id="fedff2bb"></a>

### 验证加载与热更新

1. 在开发者后台插件详情页左下角开启“插件本地调试”。
2. 如果飞书项目页面已经打开，开启调试后刷新页面。
3. 进入空间，选择 Tab 构成对应的工作项类型并打开一个实例，在详情 Tab 中找到配置的标签名称。
4. 确认页面显示 `Hello world`，再修改组件内容，检查热更新。

这些步骤验证入口配置与加载，不代表字段分类业务已经实现。实例页面可通过 `getContext()` 获取工作项 ID；工作项配置侧该 ID 为空，加载实例数据前需检查运行上下文。

<a id="b9146cd6"></a>

## 字段分类开发示例

官方 [字段分类示例工程](https://github.com/larksuite/lark-project-template/tree/feat/help-doc-demo/project/doc-demos/field-category-config) 展示两项业务：按所选字段类型分栏展示字段；依据插件配置页设置的字段分类授权决定展示范围。

![字段分类页面效果](<../assets/e22b3feeff2678dded9ace26.png>)

权限展示需配合 [插件配置 / Configuration](<插件配置 Configuration.md>) 页面完成。以下代码描述页面接入与组件边界，依赖示例工程中的数据模型、选项和业务渲染模块，不能作为独立工程直接运行。

<a id="9e18d1e7"></a>

### 所用 JSSDK

| 用途 | 方法 | 文档 |
| --- | --- | --- |
| 获取标签页上下文 | `window.JSSDK.tab.getContext()` | [Tab](<../jssdk/Tab.md#4b976faa>) |
| 加载工作项类型配置 | `window.JSSDK.WorkObject.load()` | [WorkObject](<../jssdk/WorkObject.md>) |
| 加载工作项实例 | `window.JSSDK.WorkItem.load()` | [WorkItem](<../jssdk/WorkItem.md>) |
| 读取本地缓存 | `window.JSSDK.storage.getItem()` | [storage](<../jssdk/storage.md>) |

如需随详情表单变化刷新展示，可在支持的网页端调用 [onWorkItemFormValueChanged()](<../jssdk/Tab.md#2476d065>)，每次最多监听 10 个字段，组件卸载时取消监听。该方法不用于移动端。

<a id="c03c6976"></a>

### 页面组织

| 模块 | 职责 |
| --- | --- |
| `App.tsx` | 标签页入口，接入授权展示逻辑并渲染业务页面 |
| `FieldManagementPage.tsx` | 字段类型选择器与分栏预览布局 |
| `useModel` | 提供当前筛选值、设置方法、字段分组、值映射和加载状态 |
| `optionList` | 可选字段类型 |
| `ColumnPreview.tsx` | 按字段分组绘制字段及其值 |
| `Renderers` | 链接、文本、人员等类型的具体展示 |

<a id="50f07c1b"></a>

#### 入口与筛选布局

`App.tsx` 的渲染部分如下。原文将授权处理省略；实际项目应在进入字段分类页面前接入配置页提供的授权规则。

```tsx
import { FieldManagementPage } from "../../pages";

export default function App() {
  return <FieldManagementPage />;
}
```

`FieldManagementPage.tsx` 从示例工程的数据模型读取状态。下面保留筛选和预览的结构，统一使用 Semi UI，并对选择值做字符串检查。

```tsx
import { Select } from "@douyinfe/semi-ui";
import { useModel } from "./useModel";
import { optionList } from "./const";
import { ColumnPreview } from "./ColumnPreview";
import "./FieldManagementPage.less";

export function FieldManagementPage() {
  const {
    selectFieldType,
    setSelectFieldType,
    groupFieldList,
    currentFieldsMap,
    loading,
  } = useModel();

  return (
    <div className="wrapper">
      <Select
        optionList={optionList}
        style={{ width: 320, maxWidth: "100%" }}
        placeholder="Select a field type"
        value={selectFieldType}
        onChange={(value) => {
          if (typeof value === "string") setSelectFieldType(value);
        }}
      />
      <ColumnPreview
        spinning={loading}
        groupFieldList={groupFieldList}
        currentFieldsMap={currentFieldsMap}
      />
    </div>
  );
}
```

此调用使用示例工程自己的 `ColumnPreview`，其中包含具体字段渲染逻辑；下面单独提取它的分栏布局，以便理解数据与渲染的边界。

<a id="0a26a5c5"></a>

#### 字段预览与类型渲染

原文 `ColumnPreview` 使用 SDK 的 `BriefField`、`FieldType` 和工程内的 `switchKey`、`LinkRenderer`、`TextRenderer`、`UserRenderer` 分派字段展示，但没有给出完整业务分支。应在字段类型确定后读取并校验对应值，不能将所有字段值视为同一种类型。

以下是可复用的布局组件片段：`renderField` 由业务层提供，承担上述类型分派；字段值映射使用 `unknown`，要求具体渲染器先收窄类型。两列分别使用 12 栅格与 10 栅格，第二列偏移 1 栅格，与原示例布局一致。

```tsx
import type { ReactNode } from "react";
import type { BriefField } from "@lark-project/js-sdk";
import { Col, Form, Row, Spin } from "@douyinfe/semi-ui";

interface FieldColumnsProps {
  spinning: boolean;
  currentFieldsMap: Map<string, unknown>;
  groupFieldList: BriefField[][];
  renderField: (
    field: BriefField,
    values: ReadonlyMap<string, unknown>,
  ) => ReactNode;
}

export function FieldColumns({
  spinning,
  currentFieldsMap,
  groupFieldList,
  renderField,
}: FieldColumnsProps) {
  const renderGroup = (fields: BriefField[] = []) =>
    fields.map((field) => (
      <Form.Slot label={field.name} key={field.id}>
        {renderField(field, currentFieldsMap)}
      </Form.Slot>
    ));

  return (
    <Spin spinning={spinning}>
      <Form labelPosition="left">
        <Row>
          <Col span={12}>{renderGroup(groupFieldList[0])}</Col>
          <Col span={10} offset={1}>
            {renderGroup(groupFieldList[1])}
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
```

## 验证样例

[Tab 点位](<../../../fixtures/plugin/tab.json>)包含工作项详情标签页的上下文输入与返回，并记录移动端表单监听拒绝值未定义的边界。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/e7darc0m
