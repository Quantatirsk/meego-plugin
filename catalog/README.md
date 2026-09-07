# 能力目录

`source-index.json` 保存可再生成的能力事实：稳定 ID、类型、标题、官方 URL、状态、频次和标签。它不保存正文路径，避免与规范文档树形成第二套导航。

`document-sources.json` 记录完整文档树的逐页来源映射：来源相对路径、唯一目标文档、官方 URL 与内容哈希。七个没有独立官方页面的导航或覆盖页使用 `source_silent`。

`build-registry.mjs` 将能力事实映射到唯一的 `docPath` 和 `docAnchor`，并为已核对的高频能力补充 fixture 与类型化契约。`sync-document-metadata.mjs` 将同一数据渲染到每个规范页面顶部，校验器会拒绝过期标记。

```sh
npm run catalog:build
npm run docs:sync
```

状态含义如下：

- `verified`：有来源核对、结构化契约和 fixture。
- `needs_runtime_validation`：上游资料给出静态调用、配置或事件约定，仍需要真实运行环境验证。
- `source_silent`：上游资料没有给出可移植的运行时契约或失败形状，且条目会保存具体证据。
- `deprecated`：资料明确说明能力已经退役。

`usageFrequency` 的 `local-static-heuristic` 只用于阅读优先级，不代表真实调用遥测。每个可调用能力都会标为高、中或低；没有直接调用动作的页面不设置低频，而是显示“无直接调用频次”。
