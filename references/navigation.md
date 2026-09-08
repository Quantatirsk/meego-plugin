# 技能导航

`MEEGO_PLUGIN_ROOT` 始终表示安装后的仓库根目录。先按 [skill 入口](../SKILL.md) 中的目录探测步骤设置它；全局安装由 `skills` CLI 放在 `$HOME/.agents/skills/meego-plugin`，项目级安装位于目标项目的 `.agents/skills/meego-plugin`。

## 平台能力发现

用户询问“能否实现”“该用哪个 API、点位、事件或 JSSDK 方法”时，先做一次精确解析：

```sh
node "$MEEGO_PLUGIN_ROOT/cli/meego.mjs" resolve "button context"
```

只阅读结果给出的 `docPath#docAnchor`、相关 schema、fixture 和状态。需要覆盖多个独立能力时，分别解析；不要批量浏览文档树。解析不到事实时，收窄查询一至两次。仍无结果时，不依赖该事实继续实现。

## 本地开发与调试

用户要求实现、修改、调试或测试插件时，先完成能力解析，然后阅读[开发工作流](development-workflow.md)。本地代码、配置草案和验证可以在用户请求范围内直接进行；平台托管配置不属于本地修改。

## 远端操作

任何 `lpm` 调用都先阅读[远端操作](remote-operations.md)，包括只读的 `lpm ai docs`。本地解析始终优先于远端资料；远端资料只能作为可核验的补充证据。

`lpm` 的创建、配置、scope、上传和发布操作会触及飞书项目平台。变更前必须先取得完整远端基线、展示实际影响，并在执行前获得用户的明确确认。构建或上传不构成发布授权。

## 文档维护

平台资料只在以下唯一正文树维护：

- `docs/openapi/`：OpenAPI、事件、凭证、权限、格式和 AI 能力。
- `docs/plugin/`：插件点位、客户端 JSSDK、组件、CLI、调试和发布。

来源映射在 `catalog/document-sources.json`，能力目录在 `catalog/source-index.json`，频次、页面元数据和覆盖报告由脚本生成。修改资料时保持每页底部的更新时间和官方 URL，并从仓库根目录运行：

```sh
npm run catalog:build
npm run docs:sync
npm run docs:render
npm test
npm run verify
```

这些维护命令依赖源码 checkout 的开发依赖；通过 `skills add` 安装的副本用于能力解析和导航，不承担资料再生成职责。

不要新建平行的摘要树、`reference/` 副本或按频次拆分的资料目录。高、中、低频标记属于同一篇规范页面的能力元数据，所有平台资料都必须保留在这套正文中。
