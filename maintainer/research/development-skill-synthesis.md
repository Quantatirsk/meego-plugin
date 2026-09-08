# Development Skill 调研记录

研究日期：2026-09-08

本记录说明 `meego-plugin` 工程规则来自何处。它是维护者追溯材料，不是已安装 skill 的运行时平台契约；平台 API、点位、权限和凭证事实仍以[唯一运行时资料树](../../skills/meego-plugin/docs/README.md)为准。

## 范围与方法

- 审阅 `sanxia-monorepo` 于 `3e6fe88` 的 81 个插件配置、221 个唯一前端入口、共享组件与构建脚本。静态统计得到 223 个资源：`control_web` 78、`control_mobile` 77、`config_web` 62、`dashboard_web` 3、`button_web` 2、`board_web` 1。
- 审阅 `meego-plugins` 于 `105e8d5` 的三个 React 前端、FastAPI 服务、Docker/Compose 和依赖配置。
- 搜索两个工程的受版本控制测试与 CI 配置。两者都没有可作为完整自动化测试基线的应用级测试目录或 CI 工作流。
- 只吸收跨项目结构、运行时边界和可验证行为；不吸收审计、文件库、OA、签章、AI 业务、企业网络或实际凭据。

## 已确认的规则

| 结论 | 一手证据 | 对 skill 的影响 |
| --- | --- | --- |
| 资源声明先于 UI 实现。ResourceId 到入口的映射是宿主契约，且不同资源可有意复用入口。 | 平台资料：[初始化插件工程](../../skills/meego-plugin/docs/plugin/client/初始化插件工程.md#table-content-1)。本地案例：`sanxia-monorepo/apps/shenji/audit_work_plan/plugin.config.json:5-19`、`sanxia-monorepo/apps/shenji/audit_review/plugin.config.json:11-24`。 | 开发入口要求先读取映射；`resources` 为空时不臆造前端。 |
| 点位决定 JSSDK namespace 和上下文。 | `sanxia-monorepo/packages/utils/src/tools/useContext.ts:7-21`，以及 `control`、`configuration`、`button`、`tab`、`page` 入口的实际调用；`meego-plugins/frontend/workitem_import/src/features/WorkItemImport/index.tsx:7-29`。 | 客户端参考要求按已选点位读取 context，并在边界校验所需 key。 |
| React 入口需要先完成共享模块初始化，再延迟加载依赖注入资源的应用代码。 | [shared](../../skills/meego-plugin/docs/plugin/jssdk/shared.md#资源注入顺序)、`sanxia-monorepo/apps/intelligent_retrieval/src/features/board_web_5_fmrf/index.tsx:1-25`。 | 作为当前 React/JSSDK 工程的运行时规则，不宣称 React 是平台唯一技术栈。 |
| 平台 credential 是服务端边界，现有项目的浏览器换 token 代码不能继承。 | [获取访问凭证](../../skills/meego-plugin/docs/openapi/guides/获取访问凭证.md#获取插件凭证) 明确规定 `plugin_secret`、平台 token 与 refresh token 的服务端边界；反例：`meego-plugins/frontend/audit_classification/src/utils/login.ts:64-96`。 | skill 禁止密钥或平台凭证进入浏览器、日志、fixture、产物和上传脚本。 |
| 写入字段前必须读取实际 metadata；label 与 key/value 含义不同。 | `meego-plugins/frontend/workitem_import/src/features/WorkItemImport/Footer.tsx:84-181`。 | 客户端参考禁止硬编码字段、选项和工作项类型。 |
| 长任务需要终止条件、清理和服务端关联状态。 | `meego-plugins/frontend/meeting_minutes/src/api/meetingMinutes.ts:144-177`、`meego-plugins/backend/app/routers/plugins/meeting.py:56-205`；反例：`sanxia-monorepo/packages/components/src/Signature/SignatureView/index.tsx:43-114` 的无限重连。 | 客户端与服务端参考分别要求超时、取消/清理、重试预算和本地/远端任务关联。 |
| FastAPI 可以提供清晰的生产服务边界，但现有代理不能整体复制。 | `meego-plugins/backend/app/__init__.py:30-91`、`config.py:34-84`、`routers/proxy/feishu.py:26-135`、`Dockerfile:18-23`。 | 保留 Pydantic、异步超时、CORS allowlist、健康检查和脱敏；拒绝任意路径透明代理、静态内网配置、SQLite 多 worker 与固定部署拓扑。 |
| 本地构建、上传、预览、发布和安装验证不同。 | [开发调试客户端](../../skills/meego-plugin/docs/plugin/client/开发调试客户端.md)、[发布插件产物](../../skills/meego-plugin/docs/plugin/client/发布插件产物.md)。 | 验证参考分层；生命周期命令统一由本 skill 的生命周期参考处理。 |

## 明确排除

- `sanxia-monorepo/scripts/load.env.js:61-80` 会将 `REACT_APP_*` 注入前端，`scripts/build.js:117-177` 会将凭据写入上传 shell。这是凭据管理反例，不能作为构建模板。
- `meego-plugins` 三个前端的 `build:dev`/`build:prod` 脚本会用 `sed` 改写源文件；该做法不可复现、会污染工作树，不能继承。
- 两个工程中的领域字段、企业域名、内部 API、Seafile、OA、电子签章、SQLite 表结构、AI provider、Docker registry、worker 数量和响应 envelope 都不属于飞书项目平台语义。
- `source_type` 只在配置中出现，当前代码不足以证明它是一个开发架构决策，故不纳入路由规则。

## 研究限制

项目代码提供的是实践样本，不是平台事实来源。没有发现可作为基线的应用级自动化测试或 CI，因此新增 skill 要求边界测试和宿主验证，但不声称这些仓库已经具备完整生产测试体系。所有检查过的凭据值均未记录、复制或输出。
