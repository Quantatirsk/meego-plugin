# 飞书项目开发工具 CLI 开发实践

飞书项目开发工具 CLI（`lpm`）用于管理插件客户端工程的初始化、配置同步、本地调试和产物上传。本篇只说明通用插件生命周期；服务端部署、OpenAPI 业务实现和发布范围配置仍需分别处理。

命令选项以已安装版本的 `lpm --help` 为准。本篇列出的命令来自平台文档中的稳定生命周期，不把未说明参数拼成可直接执行的发布脚本。

## 安装和登录

```sh
npm install --global @lark-project/cli@latest
lpm --version
lpm login --site-domain https://project.feishu.cn
```

浏览器完成授权后，在已经创建插件并添加构成的前提下，从“插件功能”页复制初始化命令。私有化或其他站点应把 `--site-domain` 替换为实际站点地址。

## CLI 生命周期

| 阶段 | 操作 | 结果 |
| --- | --- | --- |
| 初始化 | 复制平台生成的 `lpm init` 命令并执行 | 创建关联当前 Plugin ID 的工程和初始资源配置 |
| 查看/修改工程身份 | `lpm config get <key>`、`lpm config set <key> <value>` | 读取或更新 `pluginId`、`pluginSecret`、`siteDomain` 等配置 |
| 同步新增构成 | `lpm update` | 将后台新增构成同步到 `plugin.config.json` 和对应入口 |
| 本地调试 | `lpm start` | 启动本地客户端开发服务，供平台调试态加载 |
| 构建上传 | `lpm release` | 按 `resources` 构建客户端资源并上传，得到产物版本 |

初始化命令、配置 key 和资源映射见[初始化插件工程](<../client/初始化插件工程.md>)。`lpm update` 之前先查看本地修改；平台文档没有承诺它会如何合并已有自定义入口代码。构建上传后的产物版本不等于插件发布版本，仍要在开放平台创建并发布插件版本。

## 日常开发顺序

1. 在开放平台完成插件创建和功能构成配置。
2. 用平台生成的 `lpm init` 命令初始化工程，核对 `plugin.config.json` 的 `resources[].id` 与后台 ResourceId。
3. 完成客户端入口和点位实现；需要新增构成时，先在平台配置，再执行 `lpm update`。
4. 运行 `lpm start`，在测试空间和目标端验证实际宿主加载效果。
5. 运行 `lpm release` 上传客户端产物，在开放平台选择该产物创建发布版本。

客户端调试与常见故障见[开发调试客户端](<../client/开发调试客户端.md>)；构建结果和上传失败排查见[发布插件产物](<../client/发布插件产物.md>)。

## 配置和安全边界

`plugin.config.json` 连接后台构成和本地客户端入口。ResourceId 不匹配、入口不存在或网页/移动端资源缺失都会导致调试或构建失败。

Plugin Secret 是敏感值。CLI 初始化或配置操作需要它时，避免将命令历史、配置文件或构建日志提交到仓库或共享给无关人员；更不能把它复制到客户端源代码、浏览器存储或接口响应。调用 OpenAPI、交换用户授权码和保存平台访问凭证应由自有服务端完成，详见[获取访问凭证](<../../openapi/guides/获取访问凭证.md>)。

CLI 不部署自有服务端，不替代服务端的请求鉴权、CORS、密钥存储、超时和日志脱敏。插件发布的完整规则见[开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/rjuw0vvx
