# View

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.view.get-context"></a>
- **View.getContext** ｜ `jssdk.view.get-context` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

`window.JSSDK.view` 提供视图模式点位当前所在的空间、工作项类型和视图标识。添加构成、调试入口及实例管理示例见 [视图模式 / View](<../points/视图模式 View.md>)。

<a id="dade6195"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| `getContext()` | 支持 | V7.35.0+ |

<a id="cd3b77ca"></a>

## getContext()

在视图插件页面中读取当前运行上下文，无输入参数。

<a id="dafea455"></a>

### 返回值

返回 `Promise<ViewFeatureContext>`，对象包含以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spaceId` | string | 当前空间 ID |
| `workObjectId` | string | 当前工作项类型 ID |
| `viewId` | string | 当前视图 ID |

这三个值描述视图本身，不是工作项详情上下文。接口不返回单个实例 ID、选中项或完整工作项列表；需要展示实例数据时，应以这些标识调用对应的数据能力。视图批量按钮的选中项来自 [Button 上下文](<Button.md#273b40d7>)。

<a id="60ccf7d1"></a>

### 示例

```typescript
const viewContext = await window.JSSDK.view.getContext();

console.log(viewContext.spaceId);
console.log(viewContext.workObjectId);
console.log(viewContext.viewId);
```

返回结构示例，标识为演示值：

```json
{
  "spaceId": "68382b399de4b0ec6c5a0001",
  "workObjectId": "story",
  "viewId": "BN5_200001"
}
```

## 页面初始化与变化处理

在加载视图业务数据前先取得上下文。需要使用注入的客户端 UI 组件时，按 [shared](<shared.md#d7f829f2>) 完成共享模块初始化后再加载业务组件；用户名、语言及色彩方案通过 [Context](<Context.md>) 获取。

`view.getContext()` 是一次读取，本页没有声明视图切换、筛选变化或工作项表单变化的订阅接口。不能把 [Context.watch()](<Context.md#cec0cd73>) 当作视图筛选监听器；它监听的是平台上下文的受支持变化。若页面使用该平台订阅，组件卸载时应取消。

官方点位示例中的实例列表使用模拟数据，需替换成真实工作项后才能打开有效详情；成功获取 `viewId` 本身并不会把模拟数据转换为真实实例。

## 相关文档

- [视图模式 / View](<../points/视图模式 View.md>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/27zrsrd9
