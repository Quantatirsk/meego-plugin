# 用户选择器 / UserSelect

`UserSelect` 用于表单等人员选择场景，支持单选、多选、候选人员限定和已选标签折叠。无论是否多选，当前值 `userIds` 都是字符串数组；这与[通用 Select](<选择器 Select.md>)的单选字符串值不同。

<a id="3bdaeaa3"></a>

## 支持与接入

| 组件 | 网页端 | 移动端 |
| --- | --- | --- |
| `UserSelect` | 支持 | 不支持 |

<a id="f6281f85"></a>

从 `@lark-project/ui-kit-plugin` 导入。官方当前 `/mobile` 入口没有导出 `UserSelect`，不能通过改导入路径获得移动端实现。初始化要求见[客户端组件库接入](<客户端组件库接入.md>)。

<a id="298a85c4"></a>

## 展示效果

![人员搜索与选择](<../assets/5b97bb0d0e154f05b7036c95.png>)

<a id="509d6e80"></a>
<a id="77278cac"></a>
<a id="24df4c22"></a>

## 受控选择与标签数量

`spaceId` 由当前点位上下文提供，见 [Control](<../jssdk/Control.md>)、[Tab](<../jssdk/Tab.md>)、[Button](<../jssdk/Button.md>)。下面通过组件参数接收它，不在示例中使用未声明变量。

```tsx
import { useState } from 'react';
import { UserSelect } from '@lark-project/ui-kit-plugin';

type Props = { spaceId: string };

export default function AssigneeSelect({ spaceId }: Props) {
  const [userIds, setUserIds] = useState<string[]>([]);

  return (
    <UserSelect
      spaceId={spaceId}
      userIds={userIds}
      multiple
      maxTagCount={2}
      onChange={setUserIds}
    />
  );
}
```

省略 `multiple` 即使用单选，状态仍保持 `string[]`。`maxTagCount={2}` 仅表示直接显示两个已选标签，其余折叠为 `+N`，不是最多只能选两人。

`onChange` 还提供第二个参数 `users: User[]`。业务只需要 ID 时可像上例一样只消费第一个参数；需要用户信息时按 [User 类型](<../jssdk/通用类型定义.md#ca46701a>)读取，不能假设回调返回服务端 OpenAPI 用户结构。

<a id="263fc342"></a>

## 限制可选人员

`optionIds` 限定可选 ID 范围。以下保留原例仅允许选择当前登录用户的语义，等待上下文成功加载后才渲染选择器。

```tsx
import { useEffect, useState } from 'react';
import { UserSelect } from '@lark-project/ui-kit-plugin';

type Props = { spaceId: string };

export default function CurrentUserOnlySelect({ spaceId }: Props) {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>();

  useEffect(() => {
    let active = true;
    void window.JSSDK.Context.load()
      .then(context => {
        if (active) setCurrentUserId(context.loginUser.id);
      })
      .catch(error => console.error('Failed to load user context', error));
    return () => {
      active = false;
    };
  }, []);

  if (!currentUserId) return null;

  return (
    <UserSelect
      spaceId={spaceId}
      userIds={userIds}
      multiple
      optionIds={[currentUserId]}
      onChange={setUserIds}
    />
  );
}
```

`disabledIds` 与 `optionIds` 的含义不同：前者锁定列表中相应人员的选中状态，既不能选中，也不能反选；后者规定候选范围。原文未定义空 `optionIds` 是否等同于未设置，也未定义候选列表变更后已有选中值如何处理，这些边界需按目标宿主验证。

## spaceId 如何影响搜索和推荐

### 搜索范围

| 租户类型 | spaceId 情况 | 搜索范围 |
| --- | --- | --- |
| 非企业互联租户 | 提供或不提供 | 全租户 |
| 企业互联租户 | 提供开放空间 ID | 当前登录租户 + 协作租户开放名单 |
| 企业互联租户 | 提供非开放空间 ID | 当前登录租户 |
| 企业互联租户 | 不提供 | 当前登录租户 |

传入 `spaceId` 不等于“仅搜索该空间已有成员”。需要限制具体候选人时使用 `optionIds`；该属性是 UI 选择范围，不替代后端权限校验。

### 默认推荐人员

| spaceId 情况 | 推荐列表 |
| --- | --- |
| 提供 | 不同空间的默认推荐列表有区别 |
| 不提供 | 默认推荐列表不按空间区分 |

<a id="a90f292e"></a>

## 属性

全部属性在当前类型声明中均可选；原文未给出默认值。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `userIds` | `string[]` | 当前选中用户，单选与多选均为数组 |
| `onChange` | `(userIds: string[], users: User[]) => void` | 人员选择变化回调 |
| `spaceId` | `string` | 影响搜索范围和推荐列表，规则见上节 |
| `optionIds` | `string[]` | 限定可选用户范围 |
| `disabledIds` | `string[]` | 禁止指定人员改变选中状态 |
| `className` | `string` | 自定义类名 |
| `style` | `CSSProperties` | 自定义行内样式 |
| `multiple` | `boolean` | 开启多选 |
| `placeholder` | `string` | 未选择时的提示文字 |
| `disabled` | `boolean` | 禁用整个选择器，不能编辑 |
| `userCardDisabled` | `boolean` | 禁止鼠标移入时弹出用户卡片 |
| `maxTagCount` | `number` | 多选时直接显示的标签数量上限 |
| `showClear` | `boolean` | 显示清除按钮 |

只展示用户信息而不提供选择交互时，见[用户标签 UserTag](<用户标签 UserTag.md>)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/p1h1pvdr
