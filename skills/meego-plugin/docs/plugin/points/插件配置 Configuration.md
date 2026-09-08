# 插件配置 / Configuration

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.configuration"></a>
- **插件配置 / Configuration** ｜ `plugin-point.configuration` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`plugin-point.configuration.fixture`](<../../../fixtures/plugin/configuration.json>)

<!-- capability-metadata:end -->

插件配置点位为管理员提供自定义配置页面，用于维护字段同步映射、审批规则或功能可见范围。空间管理员安装插件后，可在插件列表中打开“配置”；页面的样式与业务逻辑由开发者实现。

<a id="dc85737f"></a>

## 页面入口与支持范围

配置页面支持网页端开发，配置规则可作用于移动端插件。`configuration.getContext()` 虽标注移动端 V7.35.0+，但这不表示有独立的移动端管理配置入口，详见 [Configuration JSSDK](<../jssdk/Configuration.md>)。

完整开发与发布流程见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。本文聚焦配置页接入及其与详情标签页的配合。

<a id="0d2ec679"></a>

## 接入步骤

<a id="62ccf5f9"></a>

### 添加配置页面构成

在开发者后台 [创建插件](<../guides/创建插件.md>)，再按 [添加插件构成](<../guides/添加插件功能.md#e3ac4ff2>) 的流程选择“配置页面”。

<a id="01761f81"></a>

### 配置客户端入口

没有工程时，按 [开发调试客户端](<../client/开发调试客户端.md>) 初始化；也可使用官方 [字段分类示例工程](https://github.com/larksuite/lark-project-template/tree/feat/help-doc-demo/project/doc-demos/field-category-config)。在示例工程目录安装依赖：

```shell
lpm install
```

已有工程接入步骤：

1. 检查 `plugin.config.json`，添加 ID 为 `config_web_demo` 的入口。
2. 在 `entry` 对应位置实现入口，参考官方 [入口文件](https://github.com/larksuite/lark-project-template/blob/feat/help-doc-demo/project/doc-demos/field-category-config/src/features/config_web_demo/index.tsx)。
3. 在入口加载的 `App.tsx` 中先放入最小组件，验证渲染。

```tsx
import type { ReactElement } from "react";

export default function App(): ReactElement {
  return <div>Hello world</div>;
}
```

启动本地服务：

```shell
lpm start
```

配置页使用注入的人员选择器等 UI 资源时，先按 [shared](<../jssdk/shared.md#d7f829f2>) 完成共享模块初始化，再加载相应业务组件。

<a id="16345fcc"></a>

### 管理员调试入口

1. 在开发者后台插件详情页左下角开启本地调试。已打开的飞书项目页面需要刷新。
2. 进入自己具有空间管理员权限的空间，打开“空间配置 > 插件管理”。
3. 鼠标悬停在调试插件上，点击出现的“配置”按钮。
4. 确认初始页面显示，再修改工程内容检查热更新。

<a id="726d8953"></a>

## 字段分类授权示例

配置页面展示字段分类的授权人员选择器；[详情标签页](<详情标签页 Tab.md>) 根据规则决定是否展示字段分类页面。示例涉及配置编辑、持久化、读取和当前用户判断四个环节。

平台 [storage](<../jssdk/storage.md>) 按登录用户与插件隔离，且只保存字符串。管理员写入自己的本地缓存不会自动为其他用户创建同一份授权配置。需要跨用户、跨设备生效的空间规则，应由插件服务端存储并按空间提供读取与管理接口；本地缓存只用于辅助展示。

<a id="9999cf66"></a>

### 对应 API

| 用途 | API |
| --- | --- |
| 获取配置页所属空间 | [configuration.getContext()](<../jssdk/Configuration.md#e634a268>) |
| 获取详情标签页所属空间 | [tab.getContext()](<../jssdk/Tab.md#4b976faa>) |
| 获取当前登录用户 | [Context.load()](<../jssdk/Context.md#f511e728>)，读取 `loginUser.id` |
| 本地缓存 | [storage.getItem()、setItem()](<../jssdk/storage.md>) |

`configuration.getContext()` 返回当前 `spaceId`，不是 Tab 上下文，也不负责保存配置。原示例中 `../../utils/storage` 是工程封装，不能把它可能提供的自动序列化能力当作平台 storage 的原生行为。

<a id="d4f1e7cd"></a>

## 页面实现

<a id="42e5b9f5"></a>

### 入口与人员选择

`App.tsx` 渲染配置业务页面：

```tsx
import { ConfigPage } from "../../pages";

export default function App() {
  return <ConfigPage />;
}
```

业务 `ConfigPage` 先取得有效的 `spaceId`，加载已保存的人员列表，再渲染编辑器。以下只展示原页面的布局与受控输入，`onChange` 由业务层接入保存逻辑；不是完整的数据持久化实现。

```tsx
import type { ComponentProps } from "react";
import { Form } from "@douyinfe/semi-ui";
import { UserSelect } from "@lark-project/ui-kit-plugin";

type UserSelectProps = ComponentProps<typeof UserSelect>;

interface ConfigEditorProps {
  spaceId: string;
  userIds: string[];
  onChange: UserSelectProps["onChange"];
}

export function ConfigEditor({ spaceId, userIds, onChange }: ConfigEditorProps) {
  return (
    <div style={{ paddingLeft: 12 }}>
      <Form labelPosition="left">
        <Form.Slot label="Field categories">
          <UserSelect
            multiple
            spaceId={spaceId}
            style={{ width: 400, maxWidth: "100%" }}
            placeholder="Select authorized users"
            maxTagCount={3}
            userIds={userIds}
            onChange={onChange}
          />
        </Form.Slot>
      </Form>
    </div>
  );
}
```

这里直接使用 `Form.Slot` 与 `UserSelect`，避免原片段中没有定义的 `UserSelectField` 包装。示例工程中的 `AUTH_USERS` 是业务配置键，应在读写两侧保持一致；它不是平台预定义的权限字段。

### 标签页按当前用户决定展示

授权判断必须匹配当前用户标识。以下片段先读取标签页空间和登录用户，再通过调用方提供的服务读取授权名单；名单未加载、格式错误或请求失败时均不展示业务页面。

授权名单中的用户标识应与 `loginUser.id` 使用同一标识体系。`loadAuthorizedUserIds` 是插件服务接口的业务封装，原文未提供其实现，不能替换为管理员自己账户下的本地缓存。

```tsx
import { useEffect, useState, type ReactNode } from "react";
import { Empty, Spin } from "@douyinfe/semi-ui";

type AccessState = "loading" | "allowed" | "denied";

interface FieldCategoryGateProps {
  loadAuthorizedUserIds: (spaceId: string) => Promise<unknown>;
  children: ReactNode;
}

function includesUser(value: unknown, userId: string): boolean {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === "string") &&
    value.includes(userId)
  );
}

export function FieldCategoryGate({
  loadAuthorizedUserIds,
  children,
}: FieldCategoryGateProps) {
  const [access, setAccess] = useState<AccessState>("loading");

  useEffect(() => {
    let disposed = false;
    setAccess("loading");

    void (async () => {
      const [tabContext, context] = await Promise.all([
        window.JSSDK.tab.getContext(),
        window.JSSDK.Context.load(),
      ]);
      const userIds = await loadAuthorizedUserIds(tabContext.spaceId);
      if (!disposed) {
        setAccess(includesUser(userIds, context.loginUser.id) ? "allowed" : "denied");
      }
    })().catch((error: unknown) => {
      console.error("Access check failed", error);
      if (!disposed) setAccess("denied");
    });

    return () => {
      disposed = true;
    };
  }, [loadAuthorizedUserIds]);

  if (access === "loading") return <Spin />;
  if (access === "denied") {
    return <Empty title="No access" description="Contact the space administrator" />;
  }
  return <>{children}</>;
}
```

调用方将字段分类页面作为 `children` 传入，并保持服务读取函数引用稳定。该片段控制客户端可见性；配置修改和业务数据访问仍应由服务端按身份与空间权限校验，不能依靠隐藏页面阻止未授权请求。

## 验证样例

[Configuration 点位](<../../../fixtures/plugin/configuration.json>)包含网页端配置页面的上下文输入与返回，并记录平台未定义共享配置存储和授权 payload 的边界。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/2vwtbynb
