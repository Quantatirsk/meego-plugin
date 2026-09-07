# 扩展字段-字段类型 / CustomField

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.custom-field"></a>
- **扩展字段-字段类型 / CustomField** ｜ `plugin-point.custom-field` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

<a id="fe0bbf6c"></a>

## 用途与数据归属

CustomField 以平台复合字段为数据基础，由插件实现字段的展示和交互。管理员可用同一种插件字段类型创建多个独立字段；数据存储在飞书项目，参与字段权限、条件和视图等平台能力。运行时读写接口见 [CustomField API](<../jssdk/CustomField.md>)。

| 能力 | CustomField | [Control](<控件 Control.md>) |
| --- | --- | --- |
| 一个工作项中的使用 | 同一插件字段类型可创建多个独立字段 | 同一控件的多次引用是重复呈现，不产生独立字段 |
| 数据存储 | 平台字段值 | 控件自身不提供平台字段存储 |
| 字段配置 | 有效性、授权角色、权限及插件自定义配置 | 没有原生字段配置能力 |
| 布局 | 基础信息、新建页可见性及必填等字段配置 | 可以配置控件位置和新建页可见性；不等同于原生字段布局配置 |
| 条件配置 | 按复合字段能力参与节点流转等条件 | 控件本身不是条件字段 |
| 视图、全景视图、工作台 | 筛选、自定义列、视图资源库预置列 | 可添加为自定义列 |
| OpenAPI | 可读取；仅定义该字段类型的插件可写入 | 控件没有可按此字段协议读写的值 |

OpenAPI 读取仍受相应权限和数据访问约束，“任意插件可读取”不代表绕过权限。其他插件不能写入该字段类型，避免引入不符合插件结构的数据。官方将度量能力标为待上线，本文不将其列入已确认能力。

<a id="26a96d13"></a>

## 页面入口

管理员在「空间配置 > 工作项 > 字段配置」选择插件提供的字段类型，例如企业名片，然后创建字段。

![字段配置中选择插件字段类型](<../assets/d95cac7cde209b57eec9f831.png>)

创建后可在流程配置中拖拽、安排字段位置。布局配置中的插件效果预览属于原文规划，不能据此认定已经可用。

![流程布局中配置插件字段](<../assets/ade1a6272530a8338c3efe48.png>)

<a id="14f50061"></a>

## 支持端与场景

该点位**必须同时实现网页端和移动端**，避免新建页必填字段在移动端无法填写。

| 端 | 场景 |
| --- | --- |
| 网页端 | 新建页、详情页、节点表单、视图表格列及编辑弹窗 |
| 移动端 7.42.0+ | 新建页、详情页、节点表单 |

移动端展示态信息和全屏打开方法要求 7.43.0+，`bizScene` 要求 7.57+，详见 API 支持表。网页端和移动端使用各自资源产物。

<a id="f69ee76c"></a>
<a id="aea47c4a"></a>

## 开发准备

准备 Node.js 和开发者工具，创建插件、添加字段类型构成并初始化工程，完成实现、调试、发布和安装。通用流程见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。下文仅列出此点位的额外配置与运行机制。

<a id="0f593a5d"></a>

## 开发者后台配置

一个插件可定义多个字段类型，每个类型独立配置。子字段决定平台可感知的数据结构，也影响用户日后的筛选和条件配置，应先确定子字段语义再实现交互。例如企业名片可包含名称、地址、联系电话、邮箱和联系人。

| 配置项 | 说明 |
| --- | --- |
| Key | 系统生成、不可修改的点位唯一标识 |
| 字段类型 | 管理员看到的类型名称，例如企业名片 |
| 描述 | 字段类型用途 |
| 子字段 | 最多 20 个，定义名称、类型和系统生成的不可修改 key |
| 提供扩展字段配置 | 开启后，字段管理中提供插件配置入口，内容由开发者实现 |
| 适用端 | 同时实现网页端和移动端 |
| 网页端 resourceId | 网页资源标识；原例为 `company_card_schedule_resource_web` |
| 网页端表格页展示态布局 | 使用 DSL 实现表格列展示；当前要求实现 |
| 网页端表格页展示态数据接口 | 配合展示态 DSL 使用的数据服务 |
| 网页端表格页展示态数据接口 Token | 对应数据接口的 Token 配置 |
| 移动端 resourceId | 移动资源标识；原例为 `company_card_resource_mobile` |
| 移动端概览 | 选择“不展示”以外的选项时，平台加载移动端概览态实现 |

子字段支持多行文本、级联多选、日期与时间、数字、多选人员五种类型。名称会用于筛选、配置等位置；实际值必须遵循 [字段结构与校验](<../jssdk/CustomField.md#58feaf1c>)。

![子字段结构配置](<../assets/1cbbbab4225e1f88a3456f81.png>)

![管理员打开插件字段配置](<../assets/eece99a0c780ca318fe62728.png>)

![表格页展示态 DSL 配置](<../assets/ec1ccceb3ae9d4cfe31b7718.png>)

表格 DSL 与数据接口的公共机制见 [Control 表格页开发](<控件 Control.md#459e2395>)。原文提到未来可不实现 DSL、由平台显示“查看”按钮，这属于规划，不作为当前省略展示产物的依据。

<a id="96f8c5ba"></a>
<a id="6a708684"></a>

## 产物入口与运行上下文

网页端同一产物通过不同导出标识区分表单、表格编辑和字段配置三个入口；移动端仅使用默认表单入口。每个入口加载自己的界面和数据，不共享表单订阅状态。

<a id="table-content-1"></a>
<a id="table-content-2"></a>
<a id="table-content-3"></a>

下面展示三个准确的导出名称和可解析的渲染骨架。页面需提供 `root` 挂载节点；实际字段交互由项目组件实现，这些文字占位不是完整字段实现。

```tsx
import { createRoot } from "react-dom/client";

function renderEntry(label: string): void {
  const container = document.getElementById("root");
  if (!container) throw new Error("Missing root element");
  createRoot(container).render(<div>{label}</div>);
}

export default async function main(): Promise<void> {
  renderEntry("Field form");
}

export async function FEATURE_CUSTOMFIELD_TABLE_EDIT(): Promise<void> {
  renderEntry("Field table editor");
}

export async function FEATURE_CUSTOMFIELD_CONFIG(): Promise<void> {
  renderEntry("Field configuration");
}
```

<a id="03ad5690"></a>
<a id="e7f88860"></a>

### 上下文

[getContext()](<../jssdk/CustomField.md#08d5b82c>) 返回空间、工作项类型以及场景中存在的实例和节点标识。新建页尚无实例，字段配置侧也没有实例字段值；不要拿空标识执行详情页查询。

```typescript
const context = await window.JSSDK.customField.getContext();
console.log(context.spaceId, context.workObjectId, context.workItemId, context.nodeId);
```

<a id="a4061eaa"></a>

### 读取、写入与监听

| 场景 | 读取 | 写入 | 外部变化监听 |
| --- | --- | --- | --- |
| 网页、移动表单 | `getProps()`、`getFieldConfig()` | `saveFieldValue()` | `watch()` |
| 网页表格编辑弹窗 | `getTableCellInitProps()`、`getFieldConfig()` | `saveFieldValue()` | 不支持 |
| 网页字段配置弹窗 | `getFieldConfig()` | 没有实例字段值可保存 | 不支持 |

`getProps()` 与表格初始 props 均包含值和 `disabled`。`saveFieldValue()` 在 SDK 2.1.8 返回结构化成功结果，校验和权限错误抛出异常，详见 [保存接口](<../jssdk/CustomField.md#ee1e5fad>)。表单的 `watch()` 异步返回取消函数，组件卸载时需要释放；可用于节点表单与详情表单值同步，不能迁移到独立弹窗中监听外部更新。

<a id="8df0184b"></a>
<a id="cdc8d373"></a>

## 表格展示 DSL

除 [Control 平台变量](<控件 Control.md#e9d571f4>) 外，此点位还提供 `$fieldValue`。它是**以开发者子字段 key 为键的对象数组**，每个对象对应一行；不同于 JSSDK 保存接口中每个元素都含 `field_key` 的二维数组。

![开发者后台中的子字段 key](<../assets/6f97097134b326fe4e61e05b.png>)

<a id="47252c81"></a>

### 表格列实例值类型

| 子字段类型 | DSL 中的值 |
| --- | --- |
| 数字 | number |
| 文本 | string |
| 日期与时间 | number 时间戳 |
| 多选人员 | `{ name: string; userKey: string }[]` |
| 级联多选 | `{ label: string; value: string }[]` |

人员和选项已包含展示名称；不能把这些对象直接作为 API 要求的用户或选项标识数组保存。

下面三个 JSON 为独立文本组件。子字段 key 是结构示例，需替换为后台实际 key。第一例对空值显式判断，以保留数字 `0`；后两例只显示首个选项或人员，业务需要完整列表时应另行组织展示。

```json
{
  "type": "text",
  "props": {
    "content": "{{($fieldValue && $fieldValue[0] && $fieldValue[0].sub_field_text != null) ? $fieldValue[0].sub_field_text : 'Empty'}}",
    "style": { "fontSize": 14 }
  }
}
```

```json
{
  "type": "text",
  "props": {
    "content": "{{($fieldValue && $fieldValue[0] && $fieldValue[0].sub_field_options && $fieldValue[0].sub_field_options[0]) ? $fieldValue[0].sub_field_options[0].label : 'Empty'}}",
    "style": { "fontSize": 14 }
  }
}
```

```json
{
  "type": "text",
  "props": {
    "content": "{{($fieldValue && $fieldValue[0] && $fieldValue[0].sub_field_users && $fieldValue[0].sub_field_users[0]) ? $fieldValue[0].sub_field_users[0].name : 'Empty'}}",
    "style": { "fontSize": 14 }
  }
}
```

<a id="ce6be8cc"></a>

## 权限、卸载与子字段限制

<a id="69c742f9"></a>

### 仅指定角色可编辑时

平台执行角色和权限校验，阻止无权限用户通过插件、OpenAPI 或手动操作修改字段。插件前端仍需呈现禁用状态、处理保存失败和提示原因；不能仅凭隐藏编辑按钮替代权限校验。

<a id="aa1464dc"></a>

### 插件卸载后

已创建字段的样式和功能回退为复合字段，重新安装后恢复插件实现。卸载不等同于删除这些字段及其平台数据。

<a id="89bda754"></a>

### 子字段约束

子字段沿用复合字段限制，包括多行文本最大字数、级联多选最大选项数等；本页没有具体阈值，不能由此推定无限制。级联多选采用“父子独立”并允许用户自行添加，以便维护选项结构、覆盖普通多选需求。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/l6963wv2
