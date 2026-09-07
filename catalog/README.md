# 能力目录

`source-index.json` 仅保存可再生成的能力元数据：稳定 ID、类型、标题、官方 URL、状态、启发式频次和标签。其 `generatedAt` 是明确维护的资料版本日期，保证重复生成不会因执行日期产生差异。它不保存来源正文、快照或媒体资源。

`build-registry.mjs` 只读取该仓库内的清洁索引，为已精修的能力页和 fixture 补充类型化契约，并生成 `registry.json`。

```sh
npm run catalog:build
```

状态含义如下：

- `verified`：有经过来源核对的本地能力页、结构化契约和 fixture。
- `needs_runtime_validation`：上游已给出静态调用、配置或事件约定，仍需要真实运行环境验证。
- `source_silent`：上游资料明确没有给出可移植的运行时契约或失败形状。不能因为尚未形成精修能力页而使用该状态；`source-index.json` 中还必须附带 `sourceSilenceEvidence`。
- `deprecated`：资料明确说明能力已经退役。

`usageFrequency` 的 `local-static-heuristic` 只用于阅读优先级，不代表真实调用遥测。它以本地插件源码中可达的调用点为依据：没有证据的能力默认低频，当前高频能力必须同时是 `verified`，并具有独立能力页、契约和 fixture。尚未形成精修能力页的条目统一导航到[文档入口](../docs/README.md)，不能据此推断请求结构。
