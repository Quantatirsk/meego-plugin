# 扩展字段-节点排期 / Schedule

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-plugin-point.schedule"></a>
- **扩展字段-节点排期 / Schedule** ｜ `plugin-point.schedule` ｜ 频次：中 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

节点排期扩展用插件界面替换平台的基础排期组件。开发者可结合工作项、节点和负责人信息决定交互方式，并通过专用提交方法将符合规范的日期范围保存到平台。

运行时方法见 [Schedule JSSDK](<../jssdk/Schedule.md>)，开发实践见 [排期扩展组件](https://project.feishu.cn/b/helpcenter/1p8d7djs/g41e0dfm)。

<a id="ef751005"></a>

## 覆盖位置与限制

本点位仅支持网页端的工作项节点排期和 WBS 计划表排期，移动端不支持。覆盖的是**日期范围编辑**，里程碑等单日期选择不生效。

| 场景 | 具体位置 |
| --- | --- |
| 实例详情 | 节点和子任务排期，节点流转自定义按钮弹窗中的排期 |
| 视图 | “需求节点排期”等排期控件、“进行中节点”弹窗中的排期 |
| 人员排期 | 待排期节点弹窗中的排期 |
| WBS 计划表 | 实例计划表中的节点和子任务排期；具体节点身份可能来自关联工作项 |

<a id="0cdb12d1"></a>

## 安装与覆盖优先级

1. 管理员在“插件管理 > 添加插件”搜索包含该能力的插件，或通过分享链接安装。
2. 安装后，排期组件在开发者配置的当前空间、工作项类型和场景生效。

同一空间、同一工作项类型、同一场景只生效最早安装的插件排期组件。安装两个覆盖场景重合的排期插件时，平台会提示当前插件与已有插件存在交叉覆盖，可能不会生效。不能通过重复安装多个相同场景组件实现并行展示。

<a id="486cbd84"></a>

## 开发流程

准备 Node.js 和开发者工具，创建插件、添加构成并初始化工程，完成调试与实现后发布，再由空间安装使用。完整步骤见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)。

这是自定义组件的客户端界面，不采用 [脚本模式](<../client/脚本模式.md>) 的短任务入口。若使用依赖注入的 UI 资源，按 [shared](<../jssdk/shared.md>) 的顺序等待初始化后加载组件。

<a id="a954aa64"></a>

## 开发者后台配置

添加“扩展字段-节点排期”构成。

| 配置项 | 说明 | 示例 |
| --- | --- | --- |
| Key | 系统生成的点位唯一标识，不可修改 | 系统分配 |
| 工作项类型 | 全部、需求、其他工作项 | 需求 |
| 自定义工作项类型 Key | 勾选“其他工作项”后出现；不填写时对全部其他工作项生效 | 实际类型 Key |
| 适用端 | 仅网页端 | 网页端 |
| 网页端 resourceId | 对应代码资源唯一标识，与工程入口匹配 | `schedule_resource_web` |
| 网页端替换位置 | 全部、节点排期、计划表排期 | 计划表排期 |

这里的“全部”是配置覆盖范围。运行时的节点排期、计划表排期分别使用 `scene: 1`、`scene: 2` 判断，不应因后台选择“全部”就假设每次运行都返回 `scene: 0`。

<a id="765214f5"></a>

## 运行时数据与保存

通过 `window.JSSDK.customComponent.schedule` 访问能力，具体字段与返回类型按 [Schedule API](<../jssdk/Schedule.md>) 和 SDK 2.1.8 使用。

```typescript
const context = await window.JSSDK.customComponent.schedule.getContext();
console.log(context.scene);
console.log(context.spaceId, context.workObjectId, context.workItemId);
console.log(context.identity?.type, context.identity?.nodeId, context.identity?.taskId);
```

| 需要的信息或操作 | API 与约束 |
| --- | --- |
| 当前运行场景 | `getContext()`；`scene: 1` 节点排期，`scene: 2` 计划表排期 |
| 实际编辑目标 | `context.identity`；跨空间子工作项或子流程可能与外层上下文不同 |
| 当前日期范围和禁用状态 | `getProps()`，读取 `value`、`disabled` |
| 平台传入值变化 | `watch()` 同步返回取消函数，组件卸载时调用 |
| 调整面板 | `resizeContainer()`；初始 568 px × 346 px，宽高各不超过 800 px |
| 节点负责人 | 可选方法 `getOwnersInfo()`，返回负责人数组 |
| WBS 状态 | 可选方法 `getWbsStatus()`，仅计划表生效 |
| 保存日期范围 | `handleSubmit(value)`；等待结果，`code: 200` 才表示成功 |
| 放弃编辑 | `handleCancel()`；关闭面板，不保存 |

编辑器应响应平台的受控值和禁用状态；提交非空范围时使用两个有效的 `YYYY-MM-DD` 字符串，开始日期早于结束日期。清空使用 `[]`，其他校验细节与错误码见 [handleSubmit](<../jssdk/Schedule.md#b0d648da>)。

<a id="79786481"></a>

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/zmyxzvfb
