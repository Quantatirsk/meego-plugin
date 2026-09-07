# Page

`window.JSSDK.page` 为导航功能页（内嵌页面）提供所在空间的上下文。点位位置和后台配置见 [导航功能页 / Page](<../points/导航功能页 Page.md>)。

<a id="819a3234"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `getContext()` | 支持 | V7.35.0+ |

<a id="c30c0bf9"></a>

## getContext()

在 Page 点位运行期间调用，读取当前空间信息，无输入参数。

<a id="e1038098"></a>

### 返回值

返回 `Promise<PageFeatureContext>`，解析结果如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |

这是空间级点位上下文，不包含当前工作项实例、节点或视图 ID。用户、语言和色彩方案来自 [Context](<Context.md>)，需要时单独调用 `window.JSSDK.Context.load()`。

<a id="f6c263fd"></a>

### 示例

```typescript
const pageContext = await window.JSSDK.page.getContext();
console.log(pageContext.spaceId);
```

返回结构示例，空间 ID 为演示值：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001"
}
```

## 页面初始化与监听边界

页面需要依赖注入的客户端 UI 资源时，按 [shared](<shared.md#d7f829f2>) 的顺序注册共享模块并等待完成，再加载消费这些资源的组件。该初始化过程与读取 `spaceId` 是不同职责。

Page 本页只定义 `getContext()`，没有定义点位变化订阅或工作项表单监听。需要监听平台上下文时，使用 [Context.watch()](<Context.md#cec0cd73>)，并在页面组件卸载时取消该订阅。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/2m5pu0j9
