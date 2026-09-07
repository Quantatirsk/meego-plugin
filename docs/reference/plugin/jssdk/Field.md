# Field

`window.JSSDK.Field` 用于读取空间内指定字段的定义。它提供字段元数据，不提供某个工作项上的字段当前值；实例值应通过 [WorkItem.getFieldValue](<WorkItem.md>) 读取。

**阅读导航**：[支持范围](#82193b08) · [加载字段](#5de03037) · [输入结构](#37eb4194) · [返回模型](#af7c6a61) · [使用示例](#64e5244b)

<a id="82193b08"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `Field.load()` | 支持 | 飞书项目移动端 V7.35.0+ |

<a id="5de03037"></a>

## load()

```ts
const field = await window.JSSDK.Field.load({
  spaceId,
  workObjectId,
  fieldId,
});
```

字段 ID 隶属于工作项类型，调用时需要同时提供它所在的 `spaceId` 和 `workObjectId`。

<a id="206be844"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `identity` | [`FieldIdentity`](#37eb4194) | 字段所属空间、工作项类型和字段的组合标识 |

<a id="37eb4194"></a>

### FieldIdentity

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | `string` | 空间 ID |
| `workObjectId` | `string` | 工作项类型 ID |
| `fieldId` | `string` | 字段 ID |

<a id="af7c6a61"></a>

## 返回模型

`load()` 返回 `Promise<Field>`。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 字段 ID |
| `name` | `string` | 字段名称 |
| `type` | [`FieldType`](<通用类型定义.md#597e7001>) | 字段类型 |
| `isSystemField` | `boolean` | 是否为可编辑的系统字段 |
| `isSystemCalculateField` | `boolean` | 是否为系统计算字段；该值由平台计算，用户不可编辑 |
| `isFormulaField` | `boolean` | 是否为公式字段 |

以上三个布尔值描述不同维度，不能用其中一个推导另两个。写入字段、格式转换和服务端字段值协议见 OpenAPI [字段与属性解析格式](<../../openapi/formats/字段与属性解析格式.md>)。

<a id="64e5244b"></a>

## 使用示例

```ts
const field = await window.JSSDK.Field.load({
  spaceId,
  workObjectId,
  fieldId,
});

if (field.isSystemCalculateField || field.isFormulaField) {
  console.log(`${field.name} is not a user-editable value`);
}
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/bsj55m0d
