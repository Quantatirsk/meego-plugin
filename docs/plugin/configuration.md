# Configuration 点位

Configuration 为空间管理员提供插件配置页面。平台提供入口和当前空间上下文；页面内容、配置数据结构和保存流程由插件实现。

## 平台事实

配置页面只支持网页端开发。配置产生的效果可以被移动端插件使用，但这不表示平台提供独立的移动端配置管理入口。

运行时调用 [`window.JSSDK.configuration.getContext()`](../jssdk/configuration-get-context.md) 获取当前配置页所属的 `spaceId`。该方法不返回工作项、视图或已保存的插件规则。

使用宿主注入的 UI 组件前，先完成 [`shared.setSharedModules()`](../jssdk/shared-set-shared-modules.md) 的初始化并等待其 Promise 完成；消费注入组件的模块应在初始化后加载。

## 实施建议

- 将 `spaceId` 作为空间级配置的作用域，而不是把它等同于配置值本身。
- 平台资料没有定义面向所有用户的共享配置存储。需要跨用户或跨设备生效时，由插件自己的受控数据层保存，并在读写时执行授权校验。
- `window.JSSDK.storage` 只适合当前用户与插件隔离的字符串缓存，不能替代共享规则的保存边界。
- 配置资源只声明实际实现的网页端入口。

这些建议不构成平台存储或权限 wire schema。

对应 fixture：[Configuration 点位](../../fixtures/plugin/configuration.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/2vwtbynb
