# 用户标签 / UserTag

`UserTag` 展示用户头像和姓名，鼠标移入时弹出用户卡片。它负责展示已有用户；需要选择或调整人员时使用[用户选择器 UserSelect](<用户选择器 UserSelect.md>)。

<a id="d75d8bb9"></a>

## 支持与接入

| 组件 | 网页端 | 移动端 |
| --- | --- | --- |
| `UserTag` | 支持 | 不支持 |

<a id="fadf2d85"></a>

从 `@lark-project/ui-kit-plugin` 导入，遵守[组件库接入](<客户端组件库接入.md>)中的共享模块注入与动态加载顺序。

<a id="a2800b09"></a>

## 展示效果

![用户标签与用户卡片](<../assets/ee469ca44c1a2a1267122baa.png>)

<a id="6ece8baa"></a>

## 展示当前登录用户

通过 `window.JSSDK.Context.load()` 获取登录用户，以 `loginUser.id` 作为 `userId`。该值是客户端用户 ID，不要擅自替换为其他平台的 `open_id` 或邮箱。

```tsx
import { useEffect, useState } from 'react';
import type { User } from '@lark-project/js-sdk';
import { UserTag } from '@lark-project/ui-kit-plugin';

export default function CurrentUserTag() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    let active = true;
    void window.JSSDK.Context.load()
      .then(context => {
        if (active) setUser(context.loginUser);
      })
      .catch(error => console.error('Failed to load user context', error));

    return () => {
      active = false;
    };
  }, []);

  return user ? <UserTag userId={user.id} /> : null;
}
```

上下文加载的完整返回值见 [Context.load](<../jssdk/Context.md#f511e728>) 与 [User](<../jssdk/通用类型定义.md>)。原示例缺少 Hook 导入，本文补齐，并在组件卸载后停止更新状态。

## 批量展示与关闭行为

同时提供 `name` 和 `avatar` 时，组件优先使用这两个值展示，跳过按 `userId` 获取用户信息的流程。仅提供其中一个时如何合并数据，原文未定义；不要据此假设查询一定被跳过。

```tsx
import { UserTag } from '@lark-project/ui-kit-plugin';

type Props = {
  userId: string;
  name: string;
  avatar: string;
  onRemove: () => void;
};

export default function RemovableUserTag({ userId, name, avatar, onRemove }: Props) {
  return (
    <UserTag
      userId={userId}
      name={name}
      avatar={avatar}
      closable
      onClose={onRemove}
    />
  );
}
```

`closable` 显示右侧关闭按钮，点击后组件被设为 `display: none`，并触发 `onClose`。若需要从人员列表中移除该用户，应由业务回调更新对应状态；隐藏标签本身不是删除用户或修改工作项成员的操作。

<a id="4ac93326"></a>

## 属性

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `userId` | `string` | 按官方用法提供 | 用户 ID；用于身份关联和用户信息获取 |
| `disabled` | `boolean` | 否 | 禁止鼠标移入时弹出用户卡片 |
| `closable` | `boolean` | 否 | 显示关闭按钮；关闭后标签隐藏 |
| `onClose` | `() => void` | 否 | 点击关闭按钮回调 |
| `className` | `string` | 否 | 自定义类名 |
| `style` | `CSSProperties` | 否 | 自定义行内样式 |
| `name` | `string` | 否 | 已知用户姓名，须与 `avatar` 一起提供才满足跳过查询条件 |
| `avatar` | `string` | 否 | 已知用户头像，和 `name` 配套使用 |

原页将 `userId` 标为必填，而当前公开类型将其声明为可选；这不能证明省略 ID 后用户卡片仍能正确关联。本文示例统一提供真实 `userId`，缺省 ID 的运行行为待核实。其他属性的默认值原文没有声明。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/6v3a3hml
