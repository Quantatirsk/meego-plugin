# 控件 / Control

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-event-contract.control-create-callback"></a>
- **Control 新建成功回调** ｜ `event-contract.control-create-callback` ｜ 频次：中 ｜ 状态：待运行时验证 ｜ 示例：[`event-contract.control-create-callback.fixture`](<../../../fixtures/events/control-create-callback.json>)
<a id="capability-plugin-point.control"></a>
- **控件 / Control** ｜ `plugin-point.control` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`plugin-point.control.fixture`](<../../../fixtures/plugin/control.json>)

<!-- capability-metadata:end -->

控件是插件提供的自定义表单组件，可放入详情页、节点表单或表格列，用于评分、进度展示、地址输入等平台字段无法满足的场景。开发者负责界面与业务数据；**飞书项目不存储插件控件值**。

本文介绍后台配置与运行机制。客户端方法的参数、返回值和监听清理见 [Control JSSDK](<../jssdk/Control.md>)。

| 位置 | 网页端 | 移动端 | 渲染方式 |
| --- | --- | --- | --- |
| 详情页表单、节点表单 | 支持 | V7.36.0+ | 加载插件代码，自定义渲染 |
| 表格列 | 支持 | 不支持 | 布局配置与服务端数据驱动 |

详情页表单位置：

![网页端详情页表单控件](<../assets/9010c2e94e89ffaffbdfb48f.gif>)

![移动端详情页表单控件](<../assets/7f7e59d67b9c7f0577829015.gif>)

节点表单位置：

![网页端节点表单控件](<../assets/4ece4c7ae17cce5d0c7b5303.gif>)

![移动端节点表单控件](<../assets/82e4c9833f0d0c6997796c7c.gif>)

![表格列控件](<../assets/1ca55c61dc0beae1a29f34fb.gif>)

<a id="42aeb363"></a>

## 安装与页面配置

1. 管理员在“插件管理 > 添加插件”搜索插件，或通过分享链接安装。安装后控件进入当前空间资源库。
2. 表格列场景中，用户或管理员通过“添加列”选择插件控件；适用位置包括普通视图、全景视图、工作台和视图控件。
3. 详情页与节点表单由空间管理员进入“空间配置 > 工作项管理”，选择工作项类型并打开“页面布局”，从左侧资源库的控件分类拖入基本信息或其他标签页。
4. 不需要出现在新建表单时，选中控件并取消“新建页可见”。

双端控件共用这套布局配置。移动端没有独立管理配置入口，因此开发移动端控件时也必须实现网页端控件，并由管理员先完成布局。

<a id="486cbd84"></a>

## 开发准备

完整流程见 [开发并发布第一个插件](<../guides/开发并发布第一个插件.md>)：准备 Node.js 与开发者工具、创建插件、添加构成并初始化工程、调试和实现功能、发布、安装。一个插件可以提供多个控件，每个控件独立配置。

<a id="a954aa64"></a>

## 开发者后台配置

添加“控件”构成后，填写以下配置。

| 配置项 | 说明 |
| --- | --- |
| 控件名称 | 在资源库和布局中显示的名称，例如“进度条” |
| 描述 | 控件用途，例如按百分制展示当前需求进度 |
| Key | 系统生成的点位唯一标识，不可修改 |
| 工作项类型 | 全部、需求、缺陷、版本、迭代、其他工作项；限制可见范围 |
| 新建页可见 | 启用后需要配置新建成功 Webhook 与 Token |
| Webhook 回调地址 | 新建表单渲染过控件后，接收创建成功的工作项信息 |
| Webhook 回调地址 Token | 用于识别、校验回调来源 |
| 适用端 | 网页端、移动端；工程分别维护两端代码 |
| resourceId | 自定义代码资源唯一标识，平台加载对应端产物时使用 |
| 网页端控件位置 | 表格列、表单页、节点表单 |
| 移动端控件位置 | 表单页、节点表单 |

`resourceId` 可分别设置为 `control_resource_web` 和 `control_resource_mobile`，应与工程入口对应。

表格列还需要配置“展示态布局”“展示态数据接口”及该接口的 Token。展示态直接使用布局与数据；当返回 `editable: true` 且控件实现了表单场景时，用户双击单元格可打开模态框，加载控件代码进行编辑。

<a id="6174450a"></a>

## 表单控件运行机制

<a id="765214f5"></a>

### 网页端加载时机

网页端表单控件使用自定义渲染。当详情页或节点表单中的控件滚动到屏幕内时，平台才加载并展示对应 `resourceId` 的代码产物。不要假设页面打开时所有控件已执行初始化。

<a id="f3b5a977"></a>

### 识别运行场景

调用 [control.getContext()](<../jssdk/Control.md#48bab499>) 读取空间、工作项和节点信息。

| 场景 | 判断依据 | 数据关联方式 |
| --- | --- | --- |
| 节点表单 | `nodeId` 有值 | 工作项 ID 与节点 ID |
| 详情页普通表单 | `workItemId` 有值，且不是节点表单 | 工作项 ID |
| 新建页表单 | `workItemId` 为空 | 临时 `UUID`，创建成功后绑定工作项 ID |

节点表单也有工作项 ID，因此识别具体位置时先检查节点信息。新建页的 `workObjectId` 按 JSSDK 参数表约定为空，不应依赖它完成业务关联。

<a id="5f7e4e41"></a>

### 新建页数据存储

![控件 UUID 与新建工作项绑定流程](<../assets/72f2b4f283fbf6282aac3d09.png>)

1. 控件出现在新建表单可视区域时，平台生成临时 `UUID`。通过 `getContext()` 读取它。
2. 控件值变化时，将 `UUID` 和控件值保存到插件服务器。
3. 工作项创建成功后，平台向后台配置的 Webhook 发送新工作项 ID 和控件 `UUID`。
4. 服务器按 `UUID` 找到暂存值，再将值与工作项 ID 关联。后续详情页按工作项 ID 读取。

该机制不支持连续创建和草稿箱。控件没有出现在屏幕上时不会创建 UUID，相应代码也不会运行；详情页即使能读到 UUID，也不应将其作为查询控件值的依据。

联动其他新建表单项时，使用 [getCreateWorkItemFormItemValues()](<../jssdk/Control.md#38027601>) 读取当前值，使用 [onWorkItemFormValueChanged()](<../jssdk/Control.md#37fca1ea>) 监听变化。监听方法名称以这份 API 契约为准。

<a id="50384474"></a>

### 新建成功回调协议

| 项目 | 约定 |
| --- | --- |
| 请求方法 | POST |
| 请求头 | `Content-Type: application/json` |
| 成功响应 | HTTP 200，响应体为空 |
| 签名 | 参见 [兼容性与验签说明](https://project.feishu.cn/b/helpcenter/1p8d7djs/kztn7qno) |

回调字段按层级整理如下。原文只给出示例，未声明下表所有字段的必填性；不要从示例推导额外必填要求。

| 顶层字段 | 示例值类型 | 含义 |
| --- | --- | --- |
| `request_time` | number | 请求时间；原示例为 13 位时间戳 |
| `signature` | string | 回调签名 |
| `source` | string | 来源，原示例为 `normal` |
| `source_plugin_id` | string | 来源插件 ID |
| `source_plugin_name` | string | 来源插件名称 |
| `data` | object | 工作项与控件信息 |

| `data` 字段 | 示例值类型 | 含义 |
| --- | --- | --- |
| `idempotent_key` | string | 幂等标识；原示例为空，生成规则未在本页说明 |
| `project_key` | string | 空间 ID |
| `work_item_type_key` | string | 工作项类型 ID |
| `event_type` | number | 原示例为 `0`，本页未列出其他枚举 |
| `user_info` | object | 用户信息，含 `user_key`、`name_cn`、`name_en`、`email` |
| `work_item_info` | object[] | 新建实例，包含 `work_item_id`、`work_item_name`、`work_item_type_key` |
| `is_batch_check` | boolean | 原示例为 `false`，本页未说明其他适用条件 |
| `field_info` | object[] | 控件变更信息 |

| `field_info[]` 字段 | 示例值类型 | 含义 |
| --- | --- | --- |
| `field_key` | string | 控件字段标识，示例形式为插件 ID 与控件 Key 拼接 |
| `alias` | string | 别名，示例为空 |
| `field_type` | string | 原示例为 `<UNSET>` |
| `before_field_value` | string | 创建前的值，示例为空 |
| `after_field_value` | string | JSON 字符串，其中 `__system_control_uuid` 是待关联的 UUID |

下例保留协议结构，使用英文演示名称。签名仅展示字段位置，不能用于验签。

```json
{
  "request_time": 1728363799655,
  "signature": "5685778b94a512130197bdccceb50dd4db1fdf373db5398a4116b36763726977",
  "source": "normal",
  "source_plugin_id": "MII_67049A4F90CE0012",
  "source_plugin_name": "Control Demo",
  "data": {
    "idempotent_key": "",
    "project_key": "65d6f07495003561c0490cdd",
    "work_item_type_key": "66bc8188f5550c9dd07cc845",
    "event_type": 0,
    "user_info": {
      "user_key": "",
      "name_cn": "",
      "name_en": "",
      "email": ""
    },
    "work_item_info": [
      {
        "work_item_id": 5159639921,
        "work_item_name": "Rescheduled meeting",
        "work_item_type_key": "66bc8188f5550c9dd07cc845"
      }
    ],
    "is_batch_check": false,
    "field_info": [
      {
        "field_key": "MII_67049A4F90CE0012/feishu_approval_control",
        "alias": "",
        "field_type": "<UNSET>",
        "before_field_value": "",
        "after_field_value": "{\"__system_control_uuid\":\"06583aa767b001d202f9e5a12763a096\"}"
      }
    ]
  }
}
```

`after_field_value` 需要作为 JSON 字符串解析，再取内部 UUID；不要把整个字符串当作 UUID。

<a id="f21780f2"></a>
<a id="f8d72fc9"></a>

### 移动端展示状态

移动端详情是全屏页面，可按移动网页实现。未配置概览时，表单显示“查看详情”，点击后加载代码并打开详情。

原文将概览标为“待上线 / 支持中”，其当前开放状态待核实。后台具备这项能力时，概览尺寸为小 80 px、中 160 px、大 240 px；滚动进入可视区域即加载概览。概览区域不支持滚动，应通过 [getDisplayInfo()](<../jssdk/Control.md#51e2a8c0>) 读取实际高度并安排内容。

配置概览后默认没有进入全屏详情的入口。如需允许进入详情，由控件调用 [openFullScreenPlugin()](<../jssdk/Control.md#cd97c0a9>)。

<a id="459e2395"></a>

## 网页端表格列

表格列展示态不能执行自定义客户端脚本，也不能在单元格内调用控件 JSSDK。平台根据预置布局渲染数据；当新的工作项进入可视区域时，向展示态数据接口请求相关单元格的数据。

![关联缺陷状态分布条](<../assets/ea8947c1c88c7bd21725d0d4.png>)

实现顺序为定义渲染变量、编写布局模板、提供返回这些变量的数据接口。可编辑单元格的弹窗是单独加载的表单控件产物。

<a id="5b84c2ee"></a>

### 布局结构

| 配置 | 说明 |
| --- | --- |
| `definitions` | 全局声明：自定义数据、颜色与多语言词条 |
| `definitions.data` | 自定义数据变量定义 |
| `definitions.$colorTokens` | 自定义亮色与暗色模式色值声明 |
| `definitions.$i18n` | 多语言词条声明 |
| `template` | 由物料组合的布局树 |
| `template.type` | 物料类型：`view`、`popover`、`text`、`image` |
| `template.props` | 物料配置，包括样式、隐藏及受支持的事件 |
| `template.children` | 子物料列表，仅容器类支持 |

原文结构概览未列出 `popover`，但物料专节明确支持，因此此处按物料专节补全。下文的 JSON 均标明是完整结构还是局部配置，不包含省略号和伪 JSON 注释。

<a id="a818f0d5"></a>

### 表达式

模板使用 `{{expression}}` 插值，支持引用自定义变量和平台变量。

<a id="e9d571f4"></a>

#### 平台变量

| 变量 | 类型或用途 |
| --- | --- |
| `$container.width` | number，当前单元格宽度 |
| `$container.height` | number，当前单元格高度 |
| 自定义色值引用 | 根据当前色彩模式解析声明的颜色；引用名称待核实，见下文 |
| `$i18n.<key>` | 读取当前语言的自定义词条 |

<a id="843ff8c8"></a>

#### 支持的运算

| 操作符 | 含义 |
| --- | --- |
| `()` | 分组 |
| `x.y`、`a[i]` | 属性与数组元素访问 |
| `+`、`-`、`*`、`/`、`%` | 算术运算 |
| `==`、`!=`、`>=`、`<=`、`>`、`<` | 比较 |
| `x ? y : z` | 条件表达式 |

<a id="0fa362e7"></a>

#### 表达式示例

第一行得到容器高度的一半；第二行演示数组访问和条件表达式，前提是表达式上下文已有 `list = [{ status: 1 }]`。该语法示例不表示数据接口支持返回任意数组变量。

```text
{{$container.height * 0.5}}
{{list[0].status == 1 ? true : false}}
```

<a id="27df284c"></a>

### 全局变量声明

<a id="f0dc9292"></a>

#### 自定义数据

`definitions.data` 为每个变量声明类型和展示名称。只支持 string、number，原文说明默认类型为 string。数据接口返回的变量名和类型必须与声明一致，否则可能渲染异常。

| 变量定义项 | 说明 |
| --- | --- |
| `type` | `string` 或 `number` |
| `name` | 在配置或调试中显示的变量名称 |
| 调试模拟值 | 仅用于预览；原文对配置键名的约定不一致，待以搭建工具导出结果核实 |

分布条示例使用 `openRate`、`closedRate` 两个 number 变量，演示值分别为 `0.3`、`0.7`。以下是 `template` 对象的局部配置，使用前需在搭建工具中声明这两个变量：

```json
{
  "type": "view",
  "props": {
    "style": {
      "width": "{{$container.width}}",
      "height": "{{$container.height}}"
    }
  },
  "children": [
    {
      "type": "text",
      "props": { "content": "Open: {{openRate * 100}}%" }
    },
    {
      "type": "text",
      "props": { "content": "Closed: {{closedRate * 100}}%" }
    }
  ]
}
```

<a id="694b48ac"></a>

#### 自定义色值

在 `definitions.$colorTokens` 下声明色值标识，为亮色和暗色模式分别指定颜色。例如 `font_color` 在亮色模式用黑色 `rgba(0, 0, 0, 1)`，暗色模式用白色 `rgba(255, 255, 255, 1)`。

亮暗字段名称及表达式中的色值引用名称在原文中不一致，当前证据不足以确认可用拼写。应以 [表格列搭建工具](https://project.feishu.cn/openapp/plugin/dsl/builder) 当前导出配置核实；本页不提供未经确认的颜色配置代码。文本颜色对应的物料样式属性为 `style.color`。

<a id="8cbbc5e3"></a>

#### 多语言词条

`definitions.$i18n` 支持 `zh_CN`、`en_US`、`ja_JP`，通过 `$i18n.<key>` 读取。以下是 `definitions` 的局部配置；Unicode 转义分别表示中文“开始 / 结束”和日文“開始 / 終了”，JSON 解析后的值仍为对应语言文本。

```json
{
  "$i18n": {
    "open": {
      "zh_CN": "\u5f00\u59cb",
      "en_US": "Open",
      "ja_JP": "\u958b\u59cb"
    },
    "closed": {
      "zh_CN": "\u7ed3\u675f",
      "en_US": "Closed",
      "ja_JP": "\u7d42\u4e86"
    }
  }
}
```

在前述模板的两个 text 物料中，将 `content` 分别替换为以下值即可组合多语言文案与比例：

```text
{{$i18n.open}}: {{openRate * 100}}%
{{$i18n.closed}}: {{closedRate * 100}}%
```

<a id="c1f37be7"></a>

### 布局物料

<a id="a448f9a5"></a>

#### 通用属性

每个物料由 `type`、`props` 和可选的 `children` 组成。所有物料均支持 `hidden`（默认 false）及以下 `style` 属性；下表描述静态类型，支持表达式的位置也可使用模板插值。

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `width`、`height` | number | 盒子宽高 |
| `marginLeft`、`marginRight`、`marginTop`、`marginBottom` | number | 外边距 |
| `paddingLeft`、`paddingRight`、`paddingTop`、`paddingBottom` | number | 内边距 |
| `borderWidth` | number | 边框宽度 |
| `borderColor` | string | 边框颜色 |
| `borderRadius` | object | 圆角，含 number 类型的 `topLeft`、`topRight`、`bottomRight`、`bottomLeft` |
| `cursor` | string | `default`、`none`、`pointer`、`wait`、`help`、`auto` |

<a id="table-content-1"></a>

#### view 容器

支持嵌套 `children`，仅支持 flex 布局。除通用属性外，支持 `onClick`、`onDoubleClick` 和以下样式：

| 样式 | 值 |
| --- | --- |
| `flexDirection` | `row`、`column` |
| `justifyContent` | `flex-start`、`flex-end`、`center`、`space-between`、`space-around` |
| `alignItems` | `stretch`、`flex-start`、`flex-end`、`center` |
| `backgroundColor` | string |

<a id="table-content-2"></a>

#### popover 容器

支持嵌套；样式作用于其触发弹层的子元素。

| props 属性 | 类型 | 说明 |
| --- | --- | --- |
| `entry` | string | 必填，打包产物中的入口函数，提供弹层内容 |
| `width` | number | 可选，省略时根据产物内容自适应 |
| `height` | number | 可选，省略时根据产物内容自适应 |

<a id="table-content-3"></a>

#### text 文本

| props 属性 | 类型 | 说明 |
| --- | --- | --- |
| `content` | string 或 number | 文本内容 |
| `style.color` | string | 字体颜色 |
| `style.fontSize` | number | 字号 |
| `style.fontWeight` | number | 字重 |
| `onClick`、`onDoubleClick` | 事件配置 | 点击、双击动作 |

文本溢出默认使用 `ellipsis`。

<a id="table-content-4"></a>

#### image 图片

| props 属性 | 类型 | 说明 |
| --- | --- | --- |
| `src` | string | 图片地址，支持 png、jpeg、svg，不支持 gif |
| `style.width`、`style.height` | number | 必须设置，否则图片不可见 |
| `onClick`、`onDoubleClick` | 事件配置 | 点击、双击动作 |

<a id="8681bc2e"></a>

### 事件处理

`view`、`text`、`image` 支持 `onClick` 和 `onDoubleClick`。两个事件使用同一种配置结构。

<a id="table-content-5"></a>

| 事件配置项 | 说明 |
| --- | --- |
| `eventParams.stopPropagation` | boolean，是否阻止冒泡，默认 false |
| `action` | 动作名称 |
| `params` | 对应动作的参数 |

以下是完整的简单布局示例，点击文本后在新标签页打开链接：

```json
{
  "template": {
    "type": "text",
    "props": {
      "content": "Open Feishu Project",
      "onClick": {
        "eventParams": { "stopPropagation": false },
        "action": "openLink",
        "params": { "url": "https://project.feishu.cn" }
      }
    }
  }
}
```

以下六种动作可以放入支持事件的物料。各代码块是一个事件配置对象。

#### 打开网页

`openLink` 使用 `params.url` 指定目标，在新标签页打开。

```json
{
  "action": "openLink",
  "params": { "url": "https://project.feishu.cn" }
}
```

#### 打开新建工作项页面

`spaceSimpleName` 是空间标识，`workObjectId` 是工作项类型，`supportedWorkObjectIds` 是支持的工作项类型列表。

```json
{
  "action": "openWorkItemCreatePage",
  "params": {
    "spaceSimpleName": "apiname",
    "workObjectId": "story",
    "supportedWorkObjectIds": ["story"]
  }
}
```

#### 打开工作项详情

```json
{
  "action": "openWorkItemDetailPage",
  "params": {
    "spaceSimpleName": "apiname",
    "workObjectId": "story",
    "workItemId": 12345
  }
}
```

#### 写入剪贴板

`writeTextToClipboard` 将 `params.content` 指定的字符串写入剪贴板。

```json
{
  "action": "writeTextToClipboard",
  "params": { "content": "Text to copy" }
}
```

#### 发起网络请求

`httpRequest` 支持 GET、POST、PUT、DELETE；通过 `headers`、`params`、`body` 分别设置请求头、查询参数和请求体。请求收到响应后，当前单元格重新拉取渲染数据以刷新状态。

请求不携带浏览器 Cookies，服务端应结合展示态数据接口建立自己的身份校验。示例中的 `workItemId` 应由布局声明及数据接口提供，不应假设存在未声明的全局变量。

```json
{
  "action": "httpRequest",
  "params": {
    "method": "POST",
    "url": "https://app-server.com/reject",
    "headers": { "X-CUSTOM-HEADER": "xyz" },
    "params": { "work_item_id": "{{workItemId}}" },
    "body": { "change_to": 0 }
  }
}
```

#### 打开自定义弹窗

| `params` 属性 | 类型 | 说明 |
| --- | --- | --- |
| `entry` | string | 打包产物导出的入口函数名，函数返回弹窗入口组件 |
| `width` | number | 弹窗宽度，最大 100vw |
| `height` | number | 弹窗高度，最大 100vh |
| `fullScreen` | boolean | 是否全屏，默认 false |
| `maskClosable` | boolean | 点击遮罩是否关闭，默认 true |

```json
{
  "action": "openModal",
  "params": {
    "entry": "customModalEntry",
    "width": 800,
    "height": 500,
    "fullScreen": false,
    "maskClosable": true
  }
}
```

<a id="e8094573"></a>

## 分布条实现与数据接口

<a id="3ff30d55"></a>

### 创建布局

打开 [表格列搭建工具](https://project.feishu.cn/openapp/plugin/dsl/builder)，在模板资源库选择“分布条”，查看并调整布局和变量，然后导出配置。操作说明见 [表格列搭建工具](<../client/表格列搭建工具.md>)。

<a id="1d031431"></a>

### 实现展示态数据接口

接口返回与布局声明一致的自定义变量。平台按进入可视区域的工作项批量请求，一次最多 20 个工作项。

<a id="8191feb8"></a>

#### 请求协议

使用 POST，`Content-Type: application/json`。请求字段如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `request_time` | number | 请求时间，原示例是 10 位时间戳，与新建回调示例位数不同 |
| `signature` | string | 请求签名，算法见 [验签说明](https://project.feishu.cn/b/helpcenter/1p8d7djs/kztn7qno) |
| `project_key` | string | 空间 ID |
| `user_language` | string | 当前语言偏好：`zh-cn`、`en-us`、`ja-jp` |
| `plugin_info` | object | 插件和点位信息 |
| `user_info` | object | 当前访问用户 |
| `work_item_infos` | object[] | 最多 20 个工作项标识 |

两种回调的时间戳单位没有在本页形成统一契约；实现签名时应保留收到的原值，不应凭示例位数自行转换。

| 对象 | 字段 | 类型与说明 |
| --- | --- | --- |
| `plugin_info` | `plugin_key` | string，插件 ID |
| `plugin_info` | `plugin_version` | string，插件版本 |
| `plugin_info` | `point_type` | string，本点位为 `control` |
| `plugin_info` | `point_key` | string，控件 Key |
| `user_info` | `user_key` | string，用户标识 |
| `user_info` | `name_cn`、`name_en` | string，中文名、英文名 |
| `user_info` | `email` | string，邮箱 |
| `work_item_infos[]` | `work_item_id` | number，工作项实例 ID |
| `work_item_infos[]` | `work_item_type_key` | string，工作项类型 ID |

请求示例的中文名使用等义 Unicode 转义；其他标识和签名均为演示值。

```json
{
  "request_time": 1733381298,
  "signature": "206fe3fcbb390027b5a813ba276ae2f5a82e43da069c71d6e2d1cc8ec6869e1e",
  "project_key": "65797a8a7f0113ef6e105250",
  "user_language": "zh-cn",
  "plugin_info": {
    "plugin_key": "MII_66C336234846402C",
    "plugin_version": "0.0.8",
    "point_type": "control",
    "point_key": "control_cbg16c"
  },
  "user_info": {
    "user_key": "7311891981507100711",
    "name_cn": "\u5f20\u4e09",
    "name_en": "San Zhang",
    "email": "zhangsan@example.com"
  },
  "work_item_infos": [
    { "work_item_id": 5165731777, "work_item_type_key": "story" },
    { "work_item_id": 5165166704, "work_item_type_key": "story" }
  ]
}
```

#### 响应协议

HTTP 状态为 200，响应体为 JSON。`code` 表示整体处理结果，各行的 `result` 表示单个工作项数据是否有效。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | number | 0 成功，非 0 异常 |
| `msg` | string | 整体结果说明 |
| `data.work_item_datas` | object[] | 对应工作项的控件数据 |

| `work_item_datas[]` 字段 | 类型 | 说明 |
| --- | --- | --- |
| `work_item_id` | number | 必须对应请求中的工作项 ID |
| `result` | boolean | true 成功；false 时平台丢弃该工作项的数据 |
| `err_msg` | string | 异常说明，会显示在界面上 |
| `editable` | boolean | true 且控件实现表单场景时，双击可打开编辑弹窗 |
| `work_item_data` | object | 变量名到值的映射，值仅支持 string、number |

下例保留逐行失败与成功的两种处理语义；成功行返回前文分布条使用的两个变量，ID 与请求配对。

```json
{
  "code": 0,
  "data": {
    "work_item_datas": [
      {
        "work_item_id": 5165731777,
        "result": false,
        "err_msg": "Request failed",
        "editable": false,
        "work_item_data": {}
      },
      {
        "work_item_id": 5165166704,
        "result": true,
        "err_msg": "",
        "editable": true,
        "work_item_data": { "openRate": 0.3, "closedRate": 0.7 }
      }
    ]
  },
  "msg": ""
}
```

<a id="bc99dff6"></a>

#### 性能约束

- 单次请求响应时间小于 3 秒。
- 单次响应体体积小于 100 kB。

<a id="79786481"></a>

## 使用边界

<a id="fe46c8d4"></a>

控件值由开发者定义并自行存储，平台不直接支持对它们筛选、排序、分组或度量。需要这些能力时，可通过 OpenAPI 将相应数据写入平台字段，再对平台字段操作。

移动端控件需要网页端实现及管理员的布局配置；不能只交付移动端代码。

## 验证样例

[Control 点位](<../../../fixtures/plugin/control.json>)包含详情表单与新建表单的结构化上下文；新建页的 `UUID` 仅在验签后的回调关联前作为临时键使用。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/kui20z6a
