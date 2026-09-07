# WorkObject

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.work-object.load"></a>
- **WorkObject.load** ｜ `jssdk.work-object.load` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.WorkObject` 读取某个空间内工作项类型的配置模型，包括流程模式、字段、模板和角色。`workObjectId` 对应客户端工作项类型 ID，不等于某个工作项实例 ID。

**阅读导航**：[支持范围](#0e7bd27e) · [加载类型](#d7653a20) · [输入结构](#18912fb3) · [返回模型](#885e4c93) · [使用示例](#8d4321f6)

<a id="0e7bd27e"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `WorkObject.load()` | 支持 | 飞书项目移动端 V7.35.0+ |

<a id="d7653a20"></a>

## load()

```ts
const workObject = await window.JSSDK.WorkObject.load({
  spaceId,
  workObjectId,
});
```

参数必须属于同一个空间。服务端 OpenAPI 中同类标识通常写作 `work_item_type_key`，转换关系见[客户端术语](<../client/客户端术语.md>)。

<a id="ecbb9da6"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `identity` | [`WorkObjectIdentity`](#18912fb3) | 空间和工作项类型的组合标识 |

<a id="18912fb3"></a>

### WorkObjectIdentity

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | `string` | 空间 ID |
| `workObjectId` | `string` | 工作项类型 ID |

<a id="885e4c93"></a>

## 返回模型

`load()` 返回 `Promise<WorkObject>`。

| 属性或方法 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 工作项类型 ID |
| `apiName` | `string` | 系统对接标识 |
| `spaceId` | `string` | 所属空间 ID |
| `name` | `string` | 显示名称 |
| `description` | `string` | 描述 |
| `flowMode` | [`FlowMode`](<通用类型定义.md#2aa9b03d>) | 流程类型 |
| `fieldList` | [`BriefField[]`](通用类型定义.md#6fa9fc9d) | 字段概要列表 |
| `getTemplateList()` | `Promise<BriefTemplate[]>` | 读取流程模板 |
| `getRoleList()` | `Promise<Role[]>` | 读取角色定义 |

`fieldList` 仅提供字段概要。需要判断系统字段、公式字段等属性时，再调用 [Field.load](<Field.md>)。

<a id="8d4321f6"></a>

## 使用示例

```ts
const workObject = await window.JSSDK.WorkObject.load({
  spaceId,
  workObjectId,
});

const [templates, roles] = await Promise.all([
  workObject.getTemplateList(),
  workObject.getRoleList(),
]);

console.log(workObject.flowMode, templates.length, roles.length);
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/573t1k6j
