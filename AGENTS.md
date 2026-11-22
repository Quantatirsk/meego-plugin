# Corpus Maintenance

本仓库维护飞书项目插件的平台资料，不承载产品业务语义、租户数据或外部系统集成说明。

运行时资料只存在于 `skills/meego-plugin/`。其中 `docs/` 是唯一规范正文树，`catalog/capabilities.json` 是唯一能力索引，`fixtures/` 是可验证的脱敏示例。不要在根目录、其他资料或维护文件中复制平台契约。

修改资料时，先更新对应规范页面和能力索引；只有有明确证据时才提升状态或补充结构化 contract。`high`、`medium` 与 `low` 表示本地调用频次推断，不表示官方稳定性或推荐程度。业务字段、流程和文案必须由用户或目标工程提供。

`maintainer/` 只服务于源码维护：provenance、schema、文档元数据同步和完整性校验不属于已安装 skill 的运行时路径。修改后运行：

```sh
npm run docs:sync
npm test
npm run verify
```

检查官方文档覆盖时，从仓库根目录运行 `python3 maintainer/check-official-coverage.py . /tmp/meego-official-coverage --since YYYY-MM-DD`。日期使用上次复核日。脚本读取公开开发者手册，输出目录匹配、接口路径匹配和待复核原页。按独立接口页确认契约差异，再更新本地正文、索引和示例。将输出目录保留在工作树外。详见 `maintainer/research/2026-11-22-official-coverage.md`。

不要为验证示例执行真实 OpenAPI 请求或记录凭据。远端插件生命周期与托管配置操作遵循 `skills/meego-plugin/references/lpm-lifecycle.md`。
