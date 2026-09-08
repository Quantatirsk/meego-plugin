# 飞书项目插件开发文档

从零创建插件时，先阅读[快速开始](plugin/guides/快速开始.md)。已有插件工程时，按当前问题进入下列资料。

| 需要解决的问题 | 入口 |
| --- | --- |
| 创建插件、取得 Plugin ID/Secret、添加构成、初始化工程 | [插件与客户端](plugin/README.md) |
| 选择点位、读取 JSSDK context、使用宿主组件 | [插件点位与 JSSDK](plugin/README.md#客户端开发) |
| 通过服务端调用平台接口、处理凭证与权限 | [OpenAPI](openapi/README.md) |
| 用接口名称、HTTP 路径或 JSSDK 方法精确查找 | `node "$SKILL_DIR/cli/meego.mjs" resolve <query>` |

接口和点位页面标有高、中、低频，表示本地项目中的查阅优先级。每篇接口页都保留参数、请求、响应、错误处理和相关链接；应以目标页面的协议为准，不跨接口复制请求头或字段。

更新时间：2026-09-08
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/nh4exbsn
