# 飞书项目插件与客户端文档

## 从零开始

1. [快速开始](guides/快速开始.md)：环境、控制台凭证、插件构成与 `lpm init`。
2. [添加插件功能](guides/添加插件功能.md)：选择点位并配置 ResourceId。
3. [初始化插件工程](client/初始化插件工程.md)：将控制台构成同步到本地入口。
4. [开发调试客户端](client/开发调试客户端.md)：使用 `lpm start` 联调网页端和移动端。

## 客户端开发

| 目标 | 入口 |
| --- | --- |
| 选择资源点与支持端 | [插件点位](points/) |
| 读取宿主上下文、导航、弹窗、存储和提示 | [JSSDK](<jssdk/客户端 API 概述.md>) |
| 使用官方客户端组件 | [组件](components/) |
| 处理构建、上传和发布 | [客户端工程](client/) 与 [插件发布](guides/发布插件.md) |
| 调用服务端平台接口 | [OpenAPI 文档](<../openapi/README.md>) |

资源点决定可用的 JSSDK namespace 和 Web/Mobile 支持范围。`plugin.config.json` 的 `resources[].id` 必须与控制台 ResourceId 对应，`entry` 指向本地代码入口；新增构成后先执行 `lpm update`，再实现对应入口。

JSSDK 类型按 `@lark-project/js-sdk` `2.1.8` 快照校订；实际工程仍应以安装版本和目标页面的支持范围为准。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/nh4exbsn
