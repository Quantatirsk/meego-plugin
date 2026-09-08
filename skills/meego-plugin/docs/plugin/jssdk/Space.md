# Space

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.space.load"></a>
- **Space.load** ｜ `jssdk.space.load` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.Space` 用于读取项目空间及其工作项类型清单。它返回的是客户端运行时模型，不能替代服务端 OpenAPI 的空间查询接口。

**阅读导航**：[支持范围](#2087ae73) · [加载空间](#da8445aa) · [返回模型](#a58ccdff) · [使用示例](#d13e0beb)

<a id="2087ae73"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `Space.load()` | 支持 | 飞书项目移动端 V7.35.0+ |

该 API 只能在飞书项目插件容器中调用。运行入口及跨端限制见[客户端开发限制](<../client/客户端开发限制.md>)。

<a id="da8445aa"></a>

## load()

```ts
const space = await window.JSSDK.Space.load(spaceId);
```

`spaceId` 是空间 ID，类型为 `string`。通常来自 [Context](<Context.md>) 或当前页面的点位上下文；不要把 OpenAPI 的 `project_key` 直接当作 `spaceId`，两者的映射关系见[客户端术语](<../client/客户端术语.md>)。

<a id="cfc306e0"></a>

### 输入参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 要读取的空间 ID |

<a id="a58ccdff"></a>

## 返回模型

`load()` 返回 `Promise<Space>`。模型属性如下：

| 属性或方法 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 空间 ID |
| `name` | `string` | 空间名称 |
| `simpleName` | `string` | 空间域名 |
| `allWorkObjectList` | [`BriefWorkObject[]`](通用类型定义.md#f0d535ad) | 全部工作项类型 |
| `enabledWorkObjectList` | [`BriefWorkObject[]`](通用类型定义.md#f0d535ad) | 已启用工作项类型 |
| `disabledWorkObjectList` | [`BriefWorkObject[]`](通用类型定义.md#f0d535ad) | 已禁用工作项类型 |
| `getBizLineList()` | `Promise<BizLine[] \| undefined>` | 读取空间业务线；没有可返回的业务线时为 `undefined` |

`enabledWorkObjectList` 与 `disabledWorkObjectList` 是状态分组，不要用数组位置推断工作项类型的稳定顺序。

<a id="d13e0beb"></a>

## 使用示例

```ts
const space = await window.JSSDK.Space.load(spaceId);

const enabledWorkObjects = space.enabledWorkObjectList.map(workObject => ({
  id: workObject.id,
  name: workObject.name,
}));

const bizLines = await space.getBizLineList();
if (bizLines) {
  console.log(bizLines.map(bizLine => bizLine.name));
}
```

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/7fn34lb6
