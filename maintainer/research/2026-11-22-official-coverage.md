# 2026-11-22 官方文档复核

以[飞书项目开发者手册的公开目录和 API 列表](https://project.feishu.cn/b/helpcenter/1p8d7djs/wlcwhshe)为基线。抓取当日可公开读取的页面版本。目录日期使用北京时间 `publish_at`。目录匹配只能证明本地有对应资料。接口匹配使用 HTTP 方法和路径，去除查询参数。接口可用性取决于目标租户的权限和配置。

## 本次纳入

- 四个计划表接口。配置列、基线列表、基线详情、实例被引用的父行信息。每个接口有独立文档、能力条目和脱敏静态示例。基线详情页的概述误写为获取用户详情，具体权限项以目标插件控制台为准。 [配置列](https://project.feishu.cn/b/helpcenter/1p8d7djs/0tfjtyns) · [基线列表](https://project.feishu.cn/b/helpcenter/1p8d7djs/w7ozv537) · [基线详情](https://project.feishu.cn/b/helpcenter/1p8d7djs/0yolifo8) · [父行](https://project.feishu.cn/b/helpcenter/1p8d7djs/bd8ibynh)
- 计划表草稿依赖覆盖、草稿和实例的引用行信息、已发布计划表的聚合列返回、工作项产品关系。列响应样例和参数表的差异留在正文中。 [更新草稿](https://project.feishu.cn/b/helpcenter/1p8d7djs/co7nfs59) · [草稿行](https://project.feishu.cn/b/helpcenter/1p8d7djs/fltmxkzs) · [实例行](https://project.feishu.cn/b/helpcenter/1p8d7djs/c6m0yamn) · [查询工作项](https://project.feishu.cn/b/helpcenter/1p8d7djs/r9jxqxnd) · [创建工作项](https://project.feishu.cn/b/helpcenter/1p8d7djs/6c8et3fg) · [更新工作项](https://project.feishu.cn/b/helpcenter/1p8d7djs/3e73r2k5)
- 旧 WBS 工作流查询的官方状态改为不再维护。两条草稿进度路径以独立接口页的 `/query` 为准，覆盖检查保留官方总表的 `/quer` 原文。 [旧工作流查询](https://project.feishu.cn/b/helpcenter/1p8d7djs/1t3boa28) · [创建进度](https://project.feishu.cn/b/helpcenter/1p8d7djs/3fjx6q4w) · [重置进度](https://project.feishu.cn/b/helpcenter/1p8d7djs/31yzphbx)
- 增加 15 篇开发导读，覆盖插件体系 MCP、插件案例、AI 节点、AI 字段和 AI 操作等目录缺口。导读通过官方链接定位完整契约。 [插件与客户端文档](../../skills/meego-plugin/docs/plugin/README.md)

## 复跑

```sh
python3 maintainer/check-official-coverage.py . /tmp/meego-official-coverage --since 2026-09-08
npm run docs:sync
npm test
npm run verify
```

使用 `--since` 指定复核起始日期。输出包括公开目录、API 总表的逐条比对、待复核页面的正文 JSON。正文以临时目录保存。脚本依赖帮助中心 HTML 中内嵌的文档数据，官网更换页面结构时会报错。

本次检查的核心目录范围为开发插件、开发 AI 应用、集成客户端 API 和组件、接入 Open API、开发工具 CLI。其他章节在完整清单中作为补充范围。静态校验使用脱敏数据。已重发页面的剩余细节仍需按实际接入场景逐项核对。
