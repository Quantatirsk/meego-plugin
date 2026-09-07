# utils

`window.JSSDK.utils` 提供获取当前用户授权码、重置 Semi UI 主题两个工具方法。授权码用于用户身份授权；主题方法用于网页端组件样式适配。

<a id="c6704313"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| [getAuthCode](#21b31584) | 支持 | V7.35.0+ |
| [overwriteThemeForSemiUI](#0102c204) | 支持 | 不支持 |

本篇原文未按点位进一步限制。获取用户授权码需要插件具有客户端构成，流程见[获取访问凭证](<../../openapi/guides/获取访问凭证.md>)。

<a id="21b31584"></a>

## getAuthCode：获取当前用户授权码

无参数，获取当前登录用户的授权码，用于交换 `user_access_token`。

<a id="db6da64a"></a>

### 返回值

返回 `Promise<{ code: string }>`。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | string | 当前登录用户的授权码；不是用户访问凭证 |

### 授权码使用规则

依据[获取访问凭证](<../../openapi/guides/获取访问凭证.md>)中的用户凭证流程：

1. 客户端调用 `getAuthCode()`，取得 `code`。
2. 将 `code` 发给自己的插件服务端。
3. 服务端调用用户凭证交换接口，取得 `user_access_token`。

**每个授权码只能使用一次，有效期为 5 分钟**；需要时可以重新获取。不能直接在前端插件中调用 OpenAPI 完成凭证交换，也不能把 `code` 当作 `user_access_token` 传入后续业务 API。

<a id="7f8a9905"></a>

### 客户端示例

下面仅展示 SDK 调用和返回值读取。调用方随后应通过项目已有的客户端请求层，把返回值交给自有服务端；本篇不虚构后端路由或响应协议。

```javascript
export async function acquireUserAuthorizationCode() {
  const { code } = await window.JSSDK.utils.getAuthCode();
  return code;
}
```

调用方需处理 Promise 失败。本篇原文没有定义具体失败类型、错误码或自动重试规则。

<a id="0102c204"></a>

## overwriteThemeForSemiUI：适配 Semi UI 主题

无参数，重置 [`@douyinfe/semi-ui`](https://www.npmjs.com/package/@douyinfe/semi-ui) 的组件库主题，使其贴近飞书项目整体设计风格。**仅网页端支持**。

<a id="6bcb30de"></a>

### 返回值

返回 `Promise<void>`。原文说明调用即生效；使用 `await` 可等待该异步调用完成。

<a id="8dff6529"></a>

### 网页端示例

```javascript
await window.JSSDK.utils.overwriteThemeForSemiUI();
```

原文没有说明主题恢复接口、重复调用语义或支持的 Semi UI 版本范围。主题重置也不替代[共享模块初始化](<shared.md>)，需要注入客户端组件库时仍应遵循资源加载顺序。

## 相关文档

- [获取访问凭证](<../../openapi/guides/获取访问凭证.md>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/hcok4x6h
