# 工作项筛选器 / WorkItemFinder

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.component.work-item-finder"></a>
- **工作项筛选器 / WorkItemFinder** ｜ `jssdk.component.work-item-finder` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`WorkItemFinder` 打开筛选规则配置面板，保存后返回 `searchId`。它返回筛选条件标识，不直接返回符合条件的工作项列表；列表查询需要使用相应服务端接口。

<a id="9aae91c8"></a>

## 端支持与导入

| 能力 | 网页端 | 移动端 |
| --- | --- | --- |
| `WorkItemFinder` | 支持 | 飞书客户端 `7.36.0` 起 |
| `position` | 支持 | 不支持 |
| `forceCreateNewSearchId` | 支持 | 当前移动端公开属性类型不提供 |

<a id="c33d1d8c"></a>

网页端使用 `@lark-project/ui-kit-plugin`，移动端使用 `@lark-project/ui-kit-plugin/mobile`。两者必须按实际端分别导入，加载顺序见[客户端组件库接入](<客户端组件库接入.md>)。

<a id="70cd9267"></a>

## 配置面板

![网页端筛选面板](<../assets/d614f8fd4a3be1683f9cf265.gif>)

![移动端筛选面板](<../assets/2e2bdc204e7ebbcf685e4253.gif>)

<a id="b31c1207"></a>

## 保存与复用筛选条件

`spaceId`、`workObjectId` 从实际点位上下文取得，见 [Control](<../jssdk/Control.md>)、[Tab](<../jssdk/Tab.md>)、[Button](<../jssdk/Button.md>)。这里的 `workObjectId` 表示工作项类型，不是某个工作项实例 ID。

```tsx
import { useState } from 'react';
import { WorkItemFinder } from '@lark-project/ui-kit-plugin';

type Props = {
  spaceId: string;
  workObjectId: string;
};

export default function SavedFilter({ spaceId, workObjectId }: Props) {
  const [searchId, setSearchId] = useState<string>();

  return (
    <WorkItemFinder
      spaceId={spaceId}
      workObjectId={workObjectId}
      searchId={searchId}
      onSubmit={result => setSearchId(result.searchId)}
      onValidateError={error => console.warn('Filter validation failed', error.c, error.m)}
      onError={error => console.error('Filter operation failed', error.c, error.m)}
    />
  );
}
```

移动端使用同样的公共属性示例，将组件导入改为：

```typescript
import { WorkItemFinder } from '@lark-project/ui-kit-plugin/mobile';
```

上例保存的是当前组件状态。需要跨会话复用时，由业务保存 `searchId` 及对应的 `spaceId`、`workObjectId`。切换空间或类型后，不能继续复用不匹配的旧标识。

## searchId 生命周期

| 配置或操作 | 行为 |
| --- | --- |
| 未提供 `searchId` | 创建新的筛选条件标识 |
| 提供已有 `searchId` | 保存时覆写对应条件 |
| `backfill={true}` | 将已有标识的条件回填到筛选器，默认行为 |
| `backfill={false}` | 不回填条件；不等同于强制创建新标识 |
| 网页端 `forceCreateNewSearchId={true}` | 强制创建新的标识 |
| `searchId` 与空间或工作项类型不匹配 | 触发校验异常 |

参与人员、参与角色、节点时间、节点排期等控件信息与 `searchId` 绑定。官方明确警告：开启 `forceCreateNewSearchId` 会导致这些控件能力不可用，因此不能把它当作无影响的复制开关。

组件 `onSubmit` 返回的 `searchId` 可用于[获取指定的工作项列表（单空间）](<../../openapi/api/获取指定的工作项列表（单空间）.md#field-note-4>)，请求体字段名为 `search_id`。该接口规定 `search_id` 与其他筛选请求参数互斥，传入后其他参数失效；认证、路径和请求规则继续按接口文档处理。

`onChange.total` 是当前筛选条件数量，不是查询命中的工作项数量。保存结果以 `onSubmit` 为准，不应仅凭配置变化或面板关闭就认定筛选条件已经持久化。

<a id="43755f65"></a>

## 属性

| 属性 | 类型 | 默认值 / 端 | 说明 |
| --- | --- | --- | --- |
| `spaceId` | `string` | 必填 | 空间标识 |
| `workObjectId` | `string` | 必填 | 工作项类型标识 |
| `searchId` | `string` | 未声明 | 已保存筛选条件标识，见生命周期规则 |
| `backfill` | `boolean` | `true` | 是否回填已有筛选条件 |
| `forceCreateNewSearchId` | `boolean` | `false`；仅 Web 类型提供 | 强制新建标识，会影响绑定控件能力 |
| `onChange` | `(info: IChangedInfo) => void` | 未声明 | 筛选配置变化回调 |
| `onSubmit` | `(result: ISubmitResult) => void` | 未声明 | 保存提交的结果回调 |
| `onValidateError` | `(error: IError) => void` | 未声明 | 非阻塞校验异常 |
| `onError` | `(error: IError) => void` | 未声明 | 阻塞异常，例如保存失败 |
| `className` | `string` | 未声明 | 自定义类名 |
| `style` | `CSSProperties` | 未声明 | 自定义行内样式 |
| `disabled` | `boolean` | 未声明 | 禁止打开配置界面 |
| `children` | `ReactElement` | 内置触发器 | 自定义触发器，DOM 要求见下节 |
| `position` | 定位枚举 | `bottom`；仅 Web | 面板弹出方向 |

`position` 完整枚举为 `left`、`top`、`bottom`、`right`、`topLeft`、`topRight`、`leftTop`、`leftBottom`、`rightTop`、`rightBottom`、`bottomLeft`、`bottomRight`。

### 自定义触发器的 DOM 要求

平台需要把事件监听器绑定到触发器，并获取真实节点计算位置。真实 `span`、`div`、`button` 等 DOM 元素可直接使用；自定义函数组件需要通过 `forwardRef` 向真实节点透传 ref 和属性。原页也允许透传属性的类组件，不强制为类组件绑定 ref。

自定义按钮不需要自行打开另一个筛选器弹窗，组件会绑定自身的触发事件。

<a id="8cfb97b7"></a>

### IChangedInfo

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `total` | `number` | 当前筛选条件数量 |

<a id="618d36ce"></a>

### ISubmitResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `searchId` | `string` | 当前保存的筛选条件标识 |

当前 Web 类型还声明了可选 `searchGroup`，但没有公开稳定结构或用途，移动端声明也未提供该字段。本文只消费已有明确契约的 `searchId`，不提供依赖 `searchGroup` 的示例。

<a id="5892c99b"></a>

### IError

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `c` | `number` | 错误码，一般非零表示错误 |
| `m` | `string` | 错误描述 |

文档明确列出的非阻塞校验错误为：

```json
{
  "c": 1,
  "m": "searchId not match spaceId or workObjectId"
}
```

“非阻塞”只描述组件错误分类，不表示不匹配的标识可以继续作为正确条件使用。`onError` 覆盖保存失败等阻塞错误；原文未给出完整错误码枚举。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/7dpe5r3v
