# Configuration

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.configuration.get-context"></a>
- **Configuration.getContext** ｜ `jssdk.configuration.get-context` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.configuration.get-context.fixture`](<../../../fixtures/jssdk/configuration-get-context.json>)

<!-- capability-metadata:end -->

`window.JSSDK.configuration` 用于在插件配置点位读取当前空间 ID。配置页面的添加、管理员入口和字段分类示例见 [插件配置 / Configuration](<../points/插件配置 Configuration.md>)。

<a id="ffdf3cc4"></a>

## 支持范围

| 方法 | 网页端 | 移动端 API 标记 |
| --- | --- | --- |
| `getContext()` | 支持 | V7.35.0+ |

API 支持表描述客户端方法的可用性。配置点位文档明确：**管理员配置页面仅支持网页端开发，配置效果在移动端使用插件时同样生效**。不能由 API 的移动端标记推断存在移动端独立配置入口。

<a id="e634a268"></a>

## getContext()

在插件配置页面运行期间调用，读取当前配置所属的空间，无输入参数。

<a id="6fec692f"></a>

### 返回值

返回 `Promise<ConfigurationFeatureContext>`，解析结果如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |

该方法不返回工作项类型、实例或视图 ID，也不返回已保存的插件规则。空间标识可用于业务层定位配置；配置的读取、校验和保存需要由插件实现。

<a id="b3464699"></a>

### 示例

```typescript
const configurationContext = await window.JSSDK.configuration.getContext();
console.log(configurationContext.spaceId);
```

返回结构示例，空间 ID 为演示值：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001"
}
```

## 页面阶段与配套能力

管理员安装插件后，在网页端“空间配置 > 插件管理”找到插件并打开“配置”。配置页面据此取得所属空间，再加载该空间的业务规则。字段分类示例的规则消费方是 [详情标签页](<../points/详情标签页 Tab.md>)；配置页面与业务页面各自使用所属点位的上下文 API。

| 需求 | 对应能力 |
| --- | --- |
| 读取当前配置所属空间 | `configuration.getContext()` |
| 读取登录用户、语言、色彩方案 | [Context.load()](<Context.md#f511e728>) |
| 使用依赖注入的 UI 组件 | [shared.setSharedModules()](<shared.md#0b5624f3>)，等待初始化后加载组件 |
| 读写客户端本地字符串缓存 | [storage](<storage.md>)，按其实际存储范围使用 |

本页没有定义配置变更监听或自动保存方法。需要监听语言、色彩等平台上下文时，按 [Context.watch()](<Context.md#cec0cd73>) 的契约订阅，并在配置页组件卸载时取消。业务规则是否已保存、是否对其他用户生效，应由实际存储与业务流程决定。

## 相关文档

- [插件配置 / Configuration](<../points/插件配置 Configuration.md>)

## 验证样例

[`configuration.getContext()`](<../../../fixtures/jssdk/configuration-get-context.json>)包含配置页的无参数调用与 `spaceId` 返回值，并记录失败拒绝值未定义的边界。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/o8q4bptu
