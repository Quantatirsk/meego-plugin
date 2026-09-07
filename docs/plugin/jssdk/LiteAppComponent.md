# LiteAppComponent

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.lite-app-component.get-config"></a>
- **LiteAppComponent.getConfig** ｜ `jssdk.lite-app-component.get-config` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.get-context"></a>
- **LiteAppComponent.getContext** ｜ `jssdk.lite-app-component.get-context` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.get-data-source-result"></a>
- **LiteAppComponent.getDataSourceResult** ｜ `jssdk.lite-app-component.get-data-source-result` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.get-preset"></a>
- **LiteAppComponent.getPreset** ｜ `jssdk.lite-app-component.get-preset` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.get-prop-full-config"></a>
- **LiteAppComponent.getPropFullConfig** ｜ `jssdk.lite-app-component.get-prop-full-config` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.get-props"></a>
- **LiteAppComponent.getProps** ｜ `jssdk.lite-app-component.get-props` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.notify"></a>
- **LiteAppComponent.notify** ｜ `jssdk.lite-app-component.notify` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.lite-app-component.watch"></a>
- **LiteAppComponent.watch** ｜ `jssdk.lite-app-component.watch` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.liteAppComponent` 提供轻应用组件的上下文、实例入参、属性配置、数据源查询与组件间输出。后台配置、属性数量和搭建侧入口见 [轻应用组件 / LiteAppComponent](<../points/轻应用组件 LiteAppComponent.md>)。签名按 `@lark-project/js-sdk` 2.1.8 核对。

<a id="b1eaad9c"></a>

## 支持范围

本页所有方法仅支持网页端。配置数据和运行时值用途不同：

| 方法 | 用途 | 额外限制 |
| --- | --- | --- |
| `getContext()` | 当前空间、轻应用、页面 | 轻应用组件内 |
| `getProps()` | 当前组件实例及输入属性值 | 所有自定义输入都可能未配置 |
| `getDataSourceResult()` | 查询数据源属性对应的实例列表 | 必须提供分页参数 |
| `watch()` | 监听输入属性变化 | 异步返回取消函数 |
| `notify()` | 更新已声明的输出属性 | 输出值必须符合输出类型 |
| `getConfig()` | 后台定义的属性结构与布局约束 | 与实例当前值不同 |
| `getPropFullConfig()` | 单个属性完整配置 | 单选、多选额外包含选项数组 |
| `getPreset()` | 后台默认布局 | **仅轻应用编辑态** |

<a id="0b6d61d5"></a>

## getContext()

无参数，返回 `Promise<LiteAppComponentFeatureContext>`。该点位是轻应用组件，不使用工作项详情字段的上下文结构。

<a id="ae739dbf"></a>

### 返回值

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `appId` | string | 轻应用 ID |
| `pageId` | string | 轻应用页面 ID |

<a id="9194a4ed"></a>

### 示例

```typescript
const context = await window.JSSDK.liteAppComponent.getContext();
console.log(context.spaceId, context.appId, context.pageId);
```

```json
{
  "spaceId": "space_example",
  "appId": "app-example",
  "pageId": "p_example"
}
```

<a id="66349221"></a>

## getProps()

无参数，返回 `Promise<LiteAppComponentProps>`，读取组件**实例的当前值**。

<a id="7fbb6ffe"></a>

### 返回值

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `instanceId` | string | 当前组件实例 ID |
| `layout` | LiteAppPropLayout，可选 | 当前实例布局 |
| 自定义属性 key | LiteAppCompPropValueType | 后台声明的输入值；管理员配置时全部选填 |

一个组件定义可在页面中多次使用，各实例 `instanceId` 不同。属性是否存在和如何解析，应结合实际配置及 [getConfig()](#f2481f85)，不能仅依赖 SDK 的索引签名把所有 key 当作已赋值。

<a id="aa6b0f33"></a>

### LiteAppPropLayout

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `width` | number | 当前宽度，栅格数 |
| `height` | number | 当前高度，栅格数 |
| `positionX` | number | 当前布局横向坐标 |
| `positionY` | number | 当前布局纵向坐标 |

<a id="eb3cf20a"></a>
<a id="36454109"></a>
<a id="f082a3f5"></a>
<a id="58f66f79"></a>
<a id="3cf4a280"></a>
<a id="c7f07439"></a>
<a id="34e8d6a0"></a>
<a id="c3239093"></a>

### 基础属性值

| `propType` | 类型名称 | 值 |
| --- | --- | --- |
| `text` | LiteAppPropText | string |
| `number` | LiteAppPropNumber | number |
| `select` | LiteAppPropSelect | string，选项 ID |
| `boolean` | LiteAppPropBoolean | boolean |
| `multiSelect` | LiteAppPropMultiSelect | string[]，选项 ID 数组 |
| `dateWithTime` | LiteAppPropDateWithTime | number 时间戳 |
| `dateRange` | LiteAppPropDateRange | `{ start: number; end: number }`，起止时间戳 |

配置侧的数字精度最多两位小数，日期与时间精确到分钟，日期范围精确到天。时间戳示例见下文；接口未进一步说明时区换算规则。

<a id="94ae595c"></a>
<a id="1259a8e2"></a>
<a id="32795e26"></a>
<a id="f9b4ed2b"></a>

### 工作项类型、实例与数据源

| 字段 | 类型 | 工作项类型 | 实例 | 数据源配置 |
| --- | --- | --- | --- | --- |
| `spaceId` | string | 所属空间 | 所属空间 | 所属空间 |
| `workObjectId` | string | 工作项类型 | 实例所属类型 | 数据源所属类型 |
| `workItemId` | number | 无 | 实例 ID | 无 |
| `fieldList` | LiteAppPropField[]，可选 | 启用字段开关时提供 | 启用字段开关时提供 | 启用字段开关时提供 |

以上分别对应 LiteAppPropWorkItemType、LiteAppPropWorkItemInstance、LiteAppPropDataSource。数据源的 props 是配置定位信息，实际实例列表要调用 [getDataSourceResult()](#5d475835)。启用字段开关后的 `propType` 见 [类型清单](#c0e852a5)。

<a id="5109bce4"></a>

### LiteAppPropField

| 字段 | SDK 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 字段所属空间 |
| `workObjectId` | string | 字段所属工作项类型 |
| `fieldClass` | `"field" \| "role"` | 普通字段或角色 |
| `fieldKey` | string | 普通字段标识，适用于 `field` |
| `roleId` | string | 角色标识，适用于 `role` |
| `display` | boolean，可选 | 是否展示 |

SDK 将 `fieldKey` 和 `roleId` 均声明为必填，但官方普通字段样例不含 `roleId`。业务代码应按 `fieldClass` 读取相应标识，不依赖另一分支的标识存在。普通字段可通过 [Field](<Field.md>) 查询配置；角色配置可通过 OpenAPI 查询。

<a id="5bad2a4d"></a>

### LiteAppPropView

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `viewId` | string | 视图 ID |
| `isMultiProject` | boolean | 是否为全景视图 |

可以用 `isMultiProject` 区分普通视图和全景视图。该值并不提供工作项类型，业务需要限定类型时应另外配置工作项类型属性。

SDK 值联合还包含筛选后、排序后的工作项实例数组类型；本页与后台点位配置未声明对应的独立可选输入类型，不能由此自行添加未公布的 `propType`。

<a id="784c72d7"></a>

### 示例

```typescript
const props = await window.JSSDK.liteAppComponent.getProps();
console.log(props.instanceId, props.layout);
```

以下展示各类已配置值。`prop_*` 均为示例属性 key，实际 key 由后台生成；不要求每个实例同时具有这些属性。

```json
{
  "instanceId": "ele_4T85H285",
  "layout": { "width": 6, "height": 4, "positionX": 3, "positionY": 0 },
  "prop_text": "text",
  "prop_number": 12,
  "prop_select": "option_primary",
  "prop_boolean": true,
  "prop_multi_select": ["option_north", "option_south"],
  "prop_date": 1758625268000,
  "prop_date_range": { "start": 1758643200000, "end": 1758902399999 },
  "prop_type": { "spaceId": "space_example", "workObjectId": "story" },
  "prop_instance": {
    "spaceId": "space_example", "workObjectId": "story", "workItemId": 676244001
  },
  "prop_type_fields": {
    "spaceId": "space_example",
    "workObjectId": "story",
    "fieldList": [
      {
        "spaceId": "space_example", "workObjectId": "story",
        "fieldClass": "field", "fieldKey": "business", "display": true
      }
    ]
  },
  "prop_instance_fields": {
    "spaceId": "space_example",
    "workObjectId": "story",
    "workItemId": 676244001,
    "fieldList": [
      {
        "spaceId": "space_example", "workObjectId": "story",
        "fieldClass": "field", "fieldKey": "business", "display": true
      }
    ]
  },
  "prop_view": { "viewId": "view_example", "isMultiProject": true },
  "prop_data_source": { "spaceId": "space_example", "workObjectId": "story" }
}
```

<a id="5d475835"></a>
<a id="61da75b7"></a>

## getDataSourceResult(propKey, pagination)

获取轻应用组件中某个数据源属性对应的工作项实例列表。

<a id="5c7bc6f7"></a>

### 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `propKey` | string | 是 | 已配置的数据源输入属性 key |
| `pagination.pageNum` | number | 是 | 查询页码 |
| `pagination.pageSize` | number | 是 | 每页数量 |

SDK 和官方参数表均要求分页参数。页码基准、默认值和每页上限未公布；不可把省略分页的旧示例视为合法调用。

<a id="0ba153fa"></a>

### 返回值

返回 `Promise<LiteAppComponentDataSourceResult>`。

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `data` | LiteAppWorkItemInstance[] | 本页实例列表 |
| `total` | number | 数据总量 |
| `hasMore` | boolean | 是否还有更多数据 |

<a id="172f9e26"></a>
<a id="260ec9b6"></a>

### LiteAppWorkItemInstance

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `id` | number | 实例 ID |
| `spaceId` | string | 空间 ID |
| `workObjectId` | string | 工作项类型 ID |
| `templateId` | number | 使用的工作项模板 ID |
| `name` | string | 实例名称 |
| `roleOwnersList` | RoleOwners[] | 每项包含 `roleId: string` 和 `owners: string[]` |
| `isAborted` | boolean | 是否已终止 |
| `isDeleted` | boolean | 是否已删除 |
| `fields` | Record<string, WorkItemFieldValue>，可选 | 数据源选中的字段值，按字段 key 索引 |

`fields` 在 2.1.8 中是可选项；WorkItemFieldValue 包含未确定结构，业务侧应按实际字段配置收窄。系统 key 见下表，自定义字段 key 根据实际空间和工作项类型查询，不能照抄其他空间的 key。

<a id="3ee2165c"></a>

### 常见系统字段

| 字段名 | key | 类型 |
| --- | --- | --- |
| 名称 | `name` | `text` |
| 描述 | `description` | `multi_text` |
| 需求文档 | `wiki` | `link` |
| 创建者 | `owner` | `user` |
| 提出时间 | `start_time` | `date` |
| 完成日期 | `finish_time` | `date` |
| 关注人 | `watchers` | `multi_user` |
| 业务线 | `business` | `tree_select` |
| 优先级 | `priority` | `select` |
| 当前负责人 | `current_status_operator` | `multi_user` |
| 归档日期 | `archiving_date` | `date` |
| 工作项类型 | `work_item_type_key` | `select` |
| 所属空间 | `owned_project` | `text` |
| 排期 | `schedule` | `schedule` |
| 工作项 ID | `work_item_id` | `number` |

<a id="39e66b64"></a>

### 示例

此函数要求调用方提供已确认的分页值，不隐含未公布的默认页码。

```typescript
async function loadDataSource(propKey: string, pageNum: number, pageSize: number) {
  const result = await window.JSSDK.liteAppComponent.getDataSourceResult(
    propKey,
    { pageNum, pageSize },
  );
  console.log(result.total, result.hasMore);
  return result.data;
}
```

以下是实例列表的结构示例；排期字段保留原示例的时间戳数组形式，实际解析仍按该空间字段配置处理。

```json
{
  "data": [
    {
      "id": 678142001,
      "spaceId": "space_example",
      "workObjectId": "story",
      "templateId": 27001,
      "name": "Demo",
      "roleOwnersList": [{ "roleId": "tech_owner", "owners": [] }],
      "isAborted": false,
      "isDeleted": false,
      "fields": {
        "name": "Demo",
        "schedule": [1775059200000, 1775145600000]
      }
    }
  ],
  "total": 100,
  "hasMore": true
}
```

<a id="0d8aaa84"></a>

## watch(callback, watchKeys?)

监听 `getProps()` 中属性的变化，回调接收最新全量 props；SDK 也允许空对象。

<a id="5e46cb08"></a>

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | `(next) => void` | 最新 LiteAppComponentProps 或空对象 |
| `watchKeys` | 属性 key 或 key 数组，可选 | 当前 SDK 支持单 key 和数组；省略时监听所有可监听属性 |

只能监听 props 属性，不能传 API 方法名。指定 `layout` 时，仅布局变化触发回调，但回调不只返回 layout。

<a id="dfb80426"></a>

### 返回值

返回 `Promise<() => void>`。组件卸载必须取消；如果订阅尚未建立，建立后立即取消。

<a id="a16cc3c2"></a>

### 示例

```tsx
import { useEffect } from "react";

export function LayoutObserver() {
  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    void window.JSSDK.liteAppComponent.watch((next) => {
      if (!disposed && next.layout) console.log(next.layout);
    }, ["layout"]).then((off) => {
      if (disposed) off();
      else unsubscribe = off;
    }).catch((error: unknown) => console.error(error));

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  return null;
}
```

<a id="ffd941f9"></a>

## notify(key, value)

更新组件已声明的输出属性，使订阅该属性的其他组件接收新值。

<a id="e5f76826"></a>

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `key` | string | 后台声明的输出属性 key |
| `value` | LiteAppSubscribedPropertyValueType | 符合该输出属性类型的值 |

<a id="307fd510"></a>
<a id="5b0c1866"></a>
<a id="6b25f055"></a>
<a id="401e6ca1"></a>
<a id="994fde5d"></a>
<a id="0fa89594"></a>
<a id="2caf47db"></a>
<a id="2192e882"></a>
<a id="904e30e1"></a>

### 输出值类型

| 输出类型 | 类型名称后缀 | 值 |
| --- | --- | --- |
| 文本 | Text | string |
| 数字 | Number | number |
| 日期与时间 | DateWithTime | number 时间戳 |
| 日期范围 | DateRange | `{ start: number; end: number }` |
| 视图 | View | `{ viewId: string }` |
| 实例 | WorkItemInstance | `{ workObjectId: string; workItemId: number }` |
| 工作项类型 | WorkItemType | `{ workObjectId: string }` |
| 数据集 | DataSet | `{ moql: string }` |

类型名称前缀均为 `LiteAppSubscribedProperty`。输入与输出结构不同：视图输出没有 `isMultiProject`，实例及类型输出没有 `spaceId`。数据集输出是查询描述，不是实例对象数组，`moql` 必须以 `` SELECT `work_item_id` `` 开头，语法见 [MQL 说明](https://project.feishu.cn/b/helpcenter/1p8d7djs/tsl2uj3i)。

<a id="4ea4bf1b"></a>

### 返回值

返回 `Promise<void>`。

<a id="07b3b3b8"></a>

### 示例

示例中的输出 key 和查询空间应替换为实际配置；查询文本不能直接拼接不可信输入。

```typescript
await window.JSSDK.liteAppComponent.notify("textKey", "text data");
await window.JSSDK.liteAppComponent.notify("dataSetKey", {
  moql: "SELECT `work_item_id` FROM `space_example`.`story` WHERE `name` like '%text%'",
});
```

<a id="f2481f85"></a>

## getConfig(propKeys?)

读取后台定义的结构配置，不读取实例当前属性值。

<a id="1268a9e0"></a>

### 参数

`propKeys` 为可选的 string 或 string[]；省略时读取全部支持的配置。

<a id="1f93442b"></a>

### 返回值

无参数时，返回的 Promise 对象包含以下内容：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 组件定义 ID，同一定义的不同实例共用 |
| `layout` | LiteAppCompLayoutConfig | 后台布局模式与约束 |
| 自定义属性 key | LiteAppCompPropBriefConfig | 属性名称及类型 |

指定 `propKeys` 后，官方样例只返回选中的属性。虽然 SDK 共用完整配置返回类型，业务代码在此分支不应依赖 `id`、`layout` 仍然存在。

<a id="8daf8bd0"></a>

### LiteAppCompLayoutConfig

| 字段 | 适用模式 | 类型 | 单位与含义 |
| --- | --- | --- | --- |
| `mode` | 全部 | `0 \| 1` | 0 为固定值/定高模式，1 为栅格模式 |
| `staticHeight` | 0 | number | 固定高度，px |
| `staticWidth` | 0 | number | 固定宽度，栅格数 |
| `minWidth` | 1 | number | 最小宽度，栅格数 |
| `maxWidth` | 1 | number | 最大宽度，栅格数 |
| `minHeight` | 1 | number | 最小高度，栅格数 |
| `maxHeight` | 1 | number | 最大高度，栅格数 |

SDK 以 `mode` 区分两个结构，对应模式内字段必填。固定模式的宽高单位不同，不能都按 px 解析；`maxHeight` 是高度上限。

<a id="508924ec"></a>
<a id="5ba56aab"></a>

### 属性概要与多语言名称

LiteAppCompPropBriefConfig 包含 `title: I18nTitleConfig` 和 `propType`。

| `title` 字段 | 类型 | 说明 |
| --- | --- | --- |
| `zh` | string，可选 | 中文名称 |
| `en` | string，可选 | 英文名称 |
| `ja` | string，可选 | 日文名称 |
| `raw` | string，可选 | 原始名称，通常用于选项名 |

<a id="c0e852a5"></a>

### 属性类型清单

| `propType` 字符串 | 含义 | 2.1.8 的 LiteAppPropTemplateType 成员 |
| --- | --- | --- |
| `text` | 文本 | `Text` |
| `number` | 数字 | `Number` |
| `select` | 单选 | `Select` |
| `boolean` | 开关 | `Boolean` |
| `multiSelect` | 多选 | `MultiSelect` |
| `dateWithTime` | 日期与时间 | `DatePrecise` |
| `dateRange` | 日期范围 | `DateRange` |
| `workItemInstance` | 实例 | `WorkItemInstance` |
| `workItemTypeSelect` | 工作项类型 | `WorkItemTypeSelect` |
| `viewSelect` | 视图 | `ViewSelect` |
| `dataSource` | 数据源 | 官方支持；当前输入类型枚举缺项 |
| `workItemInstanceWithField` | 实例，启用字段 | `workItemInstanceWithField` |
| `workItemTypeWithField` | 工作项类型，启用字段 | `workItemTypeWithField` |
| `dataSourceWithField` | 数据源，启用字段 | 官方支持；当前输入类型枚举缺项 |

SDK 2.1.8 已声明 LiteAppPropDataSource 和数据源查询方法，但输入配置枚举缺少两个数据源成员。表中保留官方实际字符串，不提供不存在的枚举成员调用；若对数据源配置做类型判断，应先读取为 unknown，再按实际对象校验，而不是用强制类型断言掩盖差异。

<a id="f4666780"></a>

### 示例

```typescript
const allConfig = await window.JSSDK.liteAppComponent.getConfig();
const viewConfig = await window.JSSDK.liteAppComponent.getConfig("prop_view");
const selectedConfig = await window.JSSDK.liteAppComponent.getConfig([
  "prop_view", "prop_select",
]);
console.log(allConfig.id, viewConfig.prop_view, selectedConfig.prop_select);
```

以下为完整配置中的布局与两个属性示例；筛选调用仅返回被选择的属性项。

```json
{
  "id": "$OPEN_APP.MII_EXAMPLE.builder_comp_example",
  "layout": { "mode": 1, "maxHeight": 24, "minHeight": 1, "maxWidth": 12, "minWidth": 3 },
  "prop_type": {
    "title": { "en": "Work item type" },
    "propType": "workItemTypeSelect"
  },
  "prop_view": {
    "title": { "en": "View" },
    "propType": "viewSelect"
  }
}
```

<a id="ddfb723e"></a>

## getPropFullConfig(propKey)

获取单个属性的完整配置。

<a id="fd2af9bf"></a>

### 参数

`propKey: string` 必填，为后台声明的属性 key。

<a id="4c98e4af"></a>
<a id="a89d8a4a"></a>
<a id="a2552873"></a>

### 返回值

返回 `Promise<LiteAppCompPropFullConfig>`。未特别说明的属性与概要结构一致；`select`、`multiSelect` 额外返回 `options` **数组**。

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `title` | I18nTitleConfig | 属性名称 |
| `propType` | 属性类型 | 完整配置所属类型 |
| `options` | OptionConfig[] | 仅单选、多选的选项列表 |
| `options[].label` | I18nTitleConfig | 选项名 |
| `options[].value` | string | 选项值，与 props 的选项 ID 对应 |

<a id="3bf8bea0"></a>

### 示例

```typescript
const config = await window.JSSDK.liteAppComponent.getPropFullConfig("prop_select");
if ("options" in config) {
  console.log(config.options);
}
```

示例选项名译成英文展示，实际 key 和选项 ID 以后台配置为准。

```json
{
  "title": { "en": "Role" },
  "propType": "select",
  "options": [
    { "value": "b64kpxnbw", "label": { "raw": "Developer", "zh": "", "en": "", "ja": "" } },
    { "value": "bznjzced0", "label": { "raw": "Tester", "zh": "", "en": "", "ja": "" } },
    { "value": "lpcxpfvrg", "label": { "raw": "Designer", "zh": "", "en": "" } },
    { "value": "szz33x7ag", "label": { "raw": "Product", "zh": "" } }
  ]
}
```

<a id="f63b39c0"></a>

## getPreset(propKeys?)

仅轻应用**编辑态**可用，获取后台预设值。它不代表当前实例已被管理员调整后的尺寸。

<a id="1f76b61a"></a>

### 参数

`propKeys` 为可选 string 或 string[]。当前只支持布局预设 `layout`，省略时读取全部支持项。当前统一使用默认预设，不支持多组预设或指定预设 ID。

<a id="3a2cfdba"></a>
<a id="c1ac93ee"></a>

### 返回值

返回 `Promise<LiteAppComponentPreset>`。

| 字段 | SDK 类型 | 说明 |
| --- | --- | --- |
| `layout` | 对象，可选 | 默认布局 |
| `layout.width` | number | 宽度，官方 API 标为栅格数 |
| `layout.height` | number | 高度，官方 API 标为栅格数 |

SDK 在 layout 存在时要求宽高同时存在。官方点位页对固定模式默认尺寸的单位说明不一致；这里仅展示可确认的栅格模式预设，固定模式的 preset 换算需另行核实。

<a id="7ec841cb"></a>

### 示例

以下仅在编辑态执行。

```typescript
const preset = await window.JSSDK.liteAppComponent.getPreset("layout");
console.log(preset.layout);
```

```json
{ "layout": { "width": 3, "height": 2 } }
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/vcu1jxrj
