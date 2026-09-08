# 客户端 API 简介

<!-- capability-metadata:start -->
## 平台能力标记

> 调用频次：无直接调用频次。本页用于平台说明、格式、目录或支持信息。

<!-- capability-metadata:end -->

飞书项目插件通过 `window.JSSDK` 调用客户端能力，读取平台或点位上下文、打开平台页面与弹窗，以及获取空间和工作项数据。平台已在插件运行环境中提供该入口，无需另行配置 SDK 实例。

本文说明 API 的分类与阅读入口。具体方法的参数、权限条件和 Web/移动端支持范围，应以对应方法文档为准。

<a id="761b1582"></a>
<a id="0031b5bb"></a>

## 客户端 API 分类

| 分类 | 提供的能力 | 阅读入口 |
| --- | --- | --- |
| 上下文 | 获取当前平台环境，以及插件功能所在的空间、工作项等点位信息 | [Context](<Context.md>)；各点位通过对应的 `getContext()` 获取运行场景 |
| 通用能力 | 获取当前登录用户授权码、页面导航、打开模态框等 | [containerModal](<containerModal.md>)、[navigation](<navigation.md>)、[utils](<utils.md>) |
| 数据模型 | 获取空间基础信息、工作项类型及实例数据 | [Space](<Space.md>)、[WorkObject](<WorkObject.md>)、[WorkItem](<WorkItem.md>)、[Field](<Field.md>) |

用户、字段类型和枚举等共用结构见[通用类型定义](<通用类型定义.md>)。运行效果可通过官方[客户端示例插件](<../client/客户端官方示例插件.md>)查看。

## 从上下文开始

下面读取平台级上下文中的语言、色彩偏好和登录用户。空间、工作项和节点等信息属于点位上下文，需继续使用当前点位的 API 获取，不能假设都在 `Context` 中。

```typescript
const context = await window.JSSDK.Context.load();

console.log(context.language);
console.log(context.colorScheme);
console.log(context.loginUser);
```

## 相关文档

- [Context](<Context.md>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/x4l57qtx
