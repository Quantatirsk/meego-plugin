# Corpus Maintenance

本仓库维护飞书项目插件的平台资料，不承载产品业务语义、租户数据或外部系统集成说明。

运行时资料只存在于 `skills/meego/meego-platform-facts/resources/`。其中 `docs/` 是唯一规范正文树，`catalog/capabilities.json` 是唯一能力索引，`fixtures/` 是可验证的脱敏示例。不要在根目录、其他 skill 或维护资料中复制平台契约。

修改资料时，先更新对应规范页面和能力索引；只有有明确证据时才提升状态或补充结构化 contract。`high`、`medium` 与 `low` 表示本地调用频次推断，不表示官方稳定性或推荐程度。业务字段、流程和文案必须由用户或目标工程提供。

`maintainer/` 只服务于源码维护：provenance、schema、文档元数据同步和完整性校验不属于已安装 skill 的运行时路径。修改后运行：

```sh
npm run docs:sync
npm test
npm run verify
```

不要为验证示例执行真实 OpenAPI 请求或记录凭据。远端插件生命周期与托管配置操作由 `meego-plugin-operations` 处理。
