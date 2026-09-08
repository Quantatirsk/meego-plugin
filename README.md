# meego-plugin

`meego-plugin` 是私有的飞书项目插件开发 skill 集。安装后，Agent 可以从创建插件、配置点位、初始化工程开始，逐步完成客户端 JSSDK、自建服务端 OpenAPI、调试、构建与发布。

## 安装

本仓库直接由 `skills` CLI 从 GitHub 安装，不发布 npm 包。推荐使用：

```sh
npx skills@latest add Quantatirsk/meego-plugin
```

安装时选择 `meego-plugin`。它是唯一的可安装 skill，随附本地 OpenAPI、JSSDK、点位、事件、示例与检索 CLI。

## 使用方式

安装后直接让 Agent 使用 `meego-plugin`。入口按需读取初始化、客户端、服务端、验证或 `lpm` 生命周期资料；精确查找点位、JSSDK、OpenAPI、事件、权限、请求或响应时，使用随附的 `meego guide`、`meego resolve` 和 `meego show` 命令定位单页资料与示例。

本包只沉淀飞书项目平台能力与通用工程实践。业务系统、组织流程、私有基础设施和具体产品字段不属于默认实现。
