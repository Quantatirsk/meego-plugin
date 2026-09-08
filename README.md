# meego-plugin

`meego-plugin` 是私有的飞书项目插件开发 skill 集。安装后，Agent 可以从创建插件、配置点位、初始化工程开始，逐步完成客户端 JSSDK、自建服务端 OpenAPI、调试、构建与发布。

## 安装

本仓库直接由 `skills` CLI 从 GitHub 安装，不发布 npm 包。推荐使用：

```sh
npx skills@latest add Quantatirsk/meego-plugin
```

安装时选择全部四个 skill。`meego-plugin` 是开发入口，`meego-platform-facts` 提供本地 OpenAPI、JSSDK 和点位资料。

## Skills

| Skill | 调用方式 | 责任 |
| --- | --- | --- |
| `meego-plugin` | 新建或继续开发插件 | 从控制台配置到本地调试的主路径。 |
| `meego-platform-facts` | 查点位、JSSDK、OpenAPI、事件或权限 | 从本地细粒度文档定位准确契约。 |
| `meego-plugin-development` | 实现、修改、测试或排查代码 | 沉淀通用的客户端、服务端和验证实践。 |
| `meego-plugin-operations` | 托管配置、scope、构建、预览或发布 | 通过 `lpm` 操作平台生命周期。 |

## 开发起点

安装后直接让 Agent 使用 `meego-plugin`。它会先区分新建工程、已有工程、接口查阅和远端发布四种情况；新建插件时会引导到插件凭证、插件构成、`lpm init` 和相应的点位资料。

本包只沉淀飞书项目平台能力与通用工程实践。业务系统、组织流程、私有基础设施和具体产品字段不属于默认实现。
