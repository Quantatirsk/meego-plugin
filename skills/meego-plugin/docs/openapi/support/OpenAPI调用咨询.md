# Open API 调用咨询

本页按调用场景整理常见问题，参数和示例以对应接口及字段定义校正。错误的旧写法已移除。

<a id="a97931de"></a>

## 问题索引

| 场景 | 内容 |
| --- | --- |
| [用户与空间](#8742dd41) | 人员查询、空间空列表、团队可见范围、system 操作者、插件信息 |
| [关联工作项](#32841d2a) | 需求下缺陷、关联字段候选项 |
| [自定义字段](#db265f17) | 级联选项增删改、关联类型、系统外信号 |
| [工作项实例](#3fc52507) | 全局查找、类型与链接、角色覆盖、节点状态、创建人、关联展开、预览、语言 |
| [工作项列表](#55bad358) | 终止数据、业务线 label、模糊搜索、expand |
| [控件](#32220fed) | 延期筛选、控件数据 |
| [字段结构](#9e4750c4) | FieldConf、SimpleField、级联选项 |
| [子任务](#3e8f110e) | 配置映射、自定义字段值 |
| [群组](#3b2fa3e6) | 绑定群、获取绑定群 ID |
| [富文本](#52b5c3e2) | 完整 DOC 操作与编辑区结构 |
| [私有化](#5a851a76) | 获取 token 时域名错误 |

<a id="8742dd41"></a>

## 用户与空间

<a id="0ad98e9b"></a>

### 根据 user_key 或邮箱查询人员

使用[获取用户详情](../api/获取用户详情.md)，可查询对应人员及 user key。适用插件类型限制以该接口文档为准。

<a id="1db9224a"></a>

### 能否把操作记录中的操作者指定为 system

不支持。OpenAPI 修改字段后，若命中条件或自动化规则，后续系统行为可能记录为 `system`；这不表示调用方能直接指定该身份。

<a id="7fb86e4f"></a>

### 空间列表为什么为空

返回范围是请求体 `user_key` 有访问权限、且安装了插件的空间。依次检查用户能否访问目标空间、插件是否安装在同一空间、安装版本是否包含最新权限。插件管理出现“升级”按钮时，检查当前版本实际生效的 API 权限。

<a id="6dcb0f5f"></a>

### 空间下团队人员为什么为空

[获取空间下团队人员](../api/获取空间下团队人员.md)只返回“我的团队”中可见范围设为“在指定空间内被搜索”，且可见空间包含该 `project_key` 的团队。没有团队同时满足两个条件时，结果为空。

<a id="8647e285"></a>

### 能否通过 API 获取插件信息

此 FAQ 的答复为不支持。本问题针对插件信息查询，不等同于接口不能返回调用插件相关的上下文字段。

<a id="32841d2a"></a>

## 关联工作项

<a id="b40fefb8"></a>

### 查询需求下的缺陷列表

使用[获取指定的关联工作项列表（单空间）](../api/获取指定的关联工作项列表（单空间）.md)，按实际关系和工作项类型查询。

<a id="14c97cac"></a>

### 获取关联字段候选项

关联字段候选项来自其关联关系的工作项列表。由空间管理员在「空间配置 → 工作项配置 → 字段管理」确认数据范围。

| 数据可见范围 | 查询方法 |
| --- | --- |
| 默认全部可见 | 用[获取工作项关系列表](../api/获取工作项关系列表.md)确认关系对应空间与类型，再通过[单空间工作项列表](../api/获取指定的工作项列表（单空间）.md)查询候选实例 |
| 条件可见 | 用[复杂传参列表](../api/获取指定的工作项列表（单空间-复杂传参）.md)，在 `search_group` 中传入相应筛选条件 |

关系配置接口返回关系定义，实例列表接口返回候选工作项，二者用途不同。原 FAQ 的字段类型通配写法为 `work_item_related_**`；实际类型 key 应从字段定义读取。

<a id="db265f17"></a>

## 自定义字段

<a id="d36265f9"></a>

### 级联选项更新失败

[更新自定义字段](../api/更新自定义字段.md)的级联数据按拍平形式传入，用 `parent_value` 指定父项，不需传 `children`。原文要求只传需更新的数据项。

| action | 操作 |
| --- | --- |
| `0` | 新增 |
| `1` | 修改 |
| `2` | 删除 |

以下示例按更新接口的要求整理。中文 label 使用等价 Unicode 转义；`field_key`、`value` 和 `parent_value` 均须替换为目标空间中的实际标识。修改子选项时必须传入其父选项的 `value`，第一例中的 `PARENT_OPTION_VALUE` 是占位符。

**修改已有选项：**

```json
{
  "field_key": "field_1dfb18",
  "field_value": [
    {
      "label": "\u4e8c\u7ea7\u9009\u98792-1",
      "value": "qjvisnqf8",
      "parent_value": "PARENT_OPTION_VALUE",
      "action": 1
    }
  ]
}
```

**删除已有选项：**

```json
{
  "field_key": "field_1dfb18",
  "field_value": [
    {
      "label": "\u4e09\u7ea7\u9009\u98791-1-3",
      "value": "xzx4bremf",
      "action": 2
    }
  ]
}
```

**在已有选项下新增子项：**

```json
{
  "field_key": "field_1dfb18",
  "field_value": [
    {
      "label": "\u4e09\u7ea7\u9009\u98792-2--3",
      "value": "qjvi11snqf8",
      "parent_value": "qjvisnqf8",
      "action": 0
    }
  ]
}
```

**新增根选项及其子项：**根项不传 `parent_value`，其余项引用真实父选项 value；所有项拍平，并显式指定新增操作。以下按更新接口规则修正了原嵌套示例。

```json
{
  "field_key": "field_1dfb18",
  "field_value": [
    {
      "label": "Root option",
      "value": "qj11snssqf8",
      "action": 0
    },
    {
      "label": "Child option",
      "value": "a23333",
      "parent_value": "qj11snssqf8",
      "action": 0
    },
    {
      "label": "Grandchild option",
      "value": "a2333sss3",
      "parent_value": "a23333",
      "action": 0
    },
    {
      "label": "Second child",
      "value": "a235663",
      "parent_value": "qj11snssqf8",
      "action": 0
    }
  ]
}
```

<a id="6bbbc4e0"></a>

### 创建关联字段报 Unsupported Field Type

创建字段时 `field_type_key` 应为 `workitem_related_select`，不能填[工作项关系列表](../api/获取工作项关系列表.md)返回的关系 ID。字段类型与关系 ID 是不同参数，完整入参见[创建自定义字段](../api/创建自定义字段.md)。

<a id="22070025"></a>

### 更新系统外信号字段

参见[字段与属性解析格式](../formats/字段与属性解析格式.md)中的 `signal`。原三个示例都缺少逗号，现已补齐。

| 状态 | field_value |
| --- | --- |
| 进行中 | JSON 空值 `null` |
| 已通过 | 布尔值 `true` |
| 未通过 | 布尔值 `false` |

按[信号字段定义](../formats/字段与属性解析格式.md)，类型为可空布尔值；处理中使用 JSON `null`。

```json
{
  "field_key": "field_id6666",
  "field_value": null
}
```

```json
{
  "field_key": "field_id6666",
  "field_value": true
}
```

```json
{
  "field_key": "field_id6666",
  "field_value": false
}
```

<a id="3fc52507"></a>

## 工作项实例

<a id="9d17243a"></a>

### 只有工作项 ID，如何取得空间和类型

需要先[完成鉴权](../guides/获取访问凭证.md)，再通过[全局搜索](../api/获取指定的工作项列表（全局搜索）.md)在授权范围内查询。只有 ID 不代表能绕过空间或插件的数据权限。

<a id="f39bb535"></a>

### 如何识别自定义工作项类型

系统需求通常为 `story`，缺陷为 `issue`，自定义类型使用生成的 key。实现时以空间实际工作项类型配置为准，不根据字符串外观硬编码分类。

<a id="3fec1060"></a>

### 更新角色人员要传全量吗

通过工作项角色字段更新时是**覆盖更新**，需要传最新的全部角色人员数据。不要将局部角色片段误作自动合并，详见[更新工作项](../api/更新工作项.md)。

<a id="821a7c72"></a>

### 如何拼接工作项链接

通过[工作项详情](../api/获取工作项详情.md)等接口取得实例标识，并结合空间短名构造：

```text
<platform_origin>/<simple_name>/<work_item_type_key>/detail/<work_item_id>
```

其中 `platform_origin` 包含协议和域名；`simple_name` 是空间 URL 短名，不是 `project_key`。原文示意中的空间域名、类型与 ID 都是待替换值。

<a id="a2bab930"></a>

### 30 亿开头的工作项 ID 是否正常

FAQ 说明实例 ID 自增从 30 亿开始，属于预期现象。这已超出有符号 32 位整数范围，集成时应按接口定义的 ID 类型保存，不能用 int32 截断。

<a id="93dc7abe"></a>

### 状态查询漏掉已终止实例

将终止状态 `closed` 与其他状态拆成两次请求，单独查询已终止实例，不将它与其他状态混合筛选。

<a id="c6e7a49f"></a>

### 能否直接设置当前负责人

不能直接为“当前负责人”指定字段值。它由当前节点负责人或当前状态授权角色计算得出，属于系统计算字段。

<a id="4fd8b232"></a>

### 获取进行中节点

使用[获取工作流详情](../api/获取工作流详情.md)。`current_nodes` 仅节点流有值，包含节点 ID、名称、负责人 user key 列表。下面把原字段片段包入对象，便于作为合法 JSON 阅读。

```json
{
  "current_nodes": [
    {
      "id": "state_1",
      "name": "node1",
      "owners": [
        "7012514555133820947"
      ]
    }
  ]
}
```

<a id="148368b2"></a>

### 获取多人确认的完成状态与时间

使用[获取工作流详情](../api/获取工作流详情.md)中的 `sub_status[]`：每项 `owner` 为人员 user key，`status` 为 `0` 未确认、`1` 已确认，`checked_time` 为完成时间。结构见[SubStatus](../formats/数据结构汇总.md)；时间单位在该结构中未说明，接入前需核实。

<a id="b7127b51"></a>

### 获取当前状态与历史流转

[工作项详情](../api/获取工作项详情.md)中的 `work_item_status.state_key` 标识当前状态，`work_item_status.history` 包含历史状态。该接口没有 `expand.work_item_status` 开关，不要添加未定义的展开参数。

<a id="80acc7ab"></a>

### 创建工作项时指定创建人

不能通过 `field_value_pairs` 指定创建人。使用插件凭证调用时，创建人取 `X-USER-KEY` 对应用户，仍须满足该用户权限；使用用户凭证时，身份来自 token 中的授权用户，不能靠更换 Header 切换身份。

<a id="3fe3c2ef"></a>

### 展开关联工作项详细信息

调用[工作项详情](../api/获取工作项详情.md)，设置以下请求片段。原片段缺外层对象且有尾随逗号，现已修正。

```json
{
  "expand": {
    "relation_fields_detail": true
  }
}
```

<a id="715f0542"></a>

### 上传文件不能预览

检查文件 MIME 类型。DOCX 的 MIME 类型为 `application/vnd.openxmlformats-officedocument.wordprocessingml.document`。

上传采用 multipart 时，整个请求保留 multipart 类型及 boundary，并为文件分段设置 DOCX MIME 类型。官方 [SDK 的 FormData](https://github.com/larksuite/project-oapi-sdk-golang/blob/v1.0.28/core/reqtranslator.go)分别设置文件分段类型与整个请求类型，二者不能混用。

<a id="82383172"></a>

### 获取英文名称

按原 FAQ，在 Header 中设置 `x-content-language: en`。字段是否提供英文值及回退规则应按相应接口说明处理。

<a id="55bad358"></a>

## 工作项列表

<a id="e9d267fd"></a>

### 查询已终止需求

[单空间工作项列表](../api/获取指定的工作项列表（单空间）.md)支持 `sub_stages` 中的 `closed`。单独传入该状态查询终止需求；其他状态另发请求。

<a id="d6744a1b"></a>

### 为业务线 value 映射 label

列表的 `business` 只返回 `value`；通过[获取空间下业务线详情](../api/获取空间下业务线详情.md)建立 value 到 label 的映射。

<a id="93cd69bc"></a>

### work_item_name 是否支持模糊搜索

[复杂传参列表](../api/获取指定的工作项列表（单空间-复杂传参）.md)支持。筛选条件格式与操作符见其接口定义及[搜索参数格式](../formats/搜索参数格式及常用示例.md)。

<a id="a331c85d"></a>

### 复杂传参列表是否支持 expand

支持。具体展开项以[该接口](../api/获取指定的工作项列表（单空间-复杂传参）.md)的请求定义为准。

<a id="32220fed"></a>

## 控件

<a id="e215b2a2"></a>
<a id="22d9c1d5"></a>

### 能否按延期标识筛选

此 FAQ 说明 OpenAPI 暂不支持，可在空间表格视图筛选。延期标识由进行中节点的排期与当前时间比较计算得出。

原问题索引链接使用了不存在的 `22d9c1d5`，正文锚点是 `e215b2a2`；本地保留两者指向同一节，修复原导航问题。

<a id="9d2d5fd2"></a>

### 能否取得控件数据

FAQ 说明 API 不返回控件数据，但会包含拉群方式选择、角色与人员等信息。不要把控件展示状态当作独立字段必然返回。

<a id="9e4750c4"></a>

## 字段结构

<a id="7a8f04a0"></a>

### 复合字段的两种元数据结构

`compound_field` 的子字段定义均在 `compound_fields`，但创建元数据与字段信息接口返回不同外围属性，不能混用。

**创建元数据中的 FieldConf：**包含必填、有效、可见配置以及 `default_value.default_appear`。示例包含人员和关联工作项多选两个子字段，所有原始标志值保留。

```json
{
  "field_alias": "",
  "field_type_key": "compound_field",
  "default_value": {
    "default_appear": 2
  },
  "compound_fields": [
    {
      "is_required": 2,
      "field_name": "\u6d4b\u8bd5\u590d\u54081",
      "field_key": "field_1e9d67",
      "is_validity": 1,
      "is_visibility": 1,
      "field_alias": "",
      "field_type_key": "multi_user"
    },
    {
      "is_validity": 1,
      "is_visibility": 1,
      "field_name": "\u6d4b\u8bd5\u590d\u54082",
      "field_type_key": "work_item_related_multi_select",
      "is_required": 2,
      "field_key": "field_82727e",
      "field_alias": ""
    }
  ],
  "label": "",
  "field_name": "\u6d4b\u8bd5\u590d\u5408\u5b57\u6bb5",
  "is_visibility": 2,
  "field_key": "field_8aa6b6",
  "is_validity": 1,
  "is_required": 2
}
```

**字段信息中的 SimpleField：**包含 `value_generate_mode/is_custom_field/options` 等。示例 `options[].value` 是 JSON 数组的序列化字符串，未改成直接数组；`Default` 大小写保持不变。

```json
{
  "field_type_key": "compound_field",
  "field_name": "\u6d4b\u8bd5\u590d\u5408\u5b57\u6bb5",
  "value_generate_mode": "Default",
  "is_custom_field": true,
  "field_key": "field_8aa6b6",
  "options": [
    {
      "value": "[\"658b9f05809f644bebd6613a:story:field_1e9d67\",\"658b9f05809f644bebd6613a:story:field_82727e\"]",
      "label": "sub_compound"
    }
  ],
  "compound_fields": [
    {
      "field_key": "field_1e9d67",
      "field_name": "\u6d4b\u8bd5\u590d\u54081",
      "is_custom_field": true,
      "value_generate_mode": "Default",
      "field_type_key": "multi_user",
      "field_alias": ""
    },
    {
      "field_type_key": "work_item_related_multi_select",
      "field_name": "\u6d4b\u8bd5\u590d\u54082",
      "is_custom_field": true,
      "value_generate_mode": "Default",
      "field_key": "field_82727e",
      "field_alias": ""
    }
  ],
  "field_alias": ""
}
```

两例原末尾的对象外逗号已去除。完整解析见[字段与属性解析格式](../formats/字段与属性解析格式.md)。

<a id="4ca50d90"></a>

### 级联单选、多选的 options

读取候选项时用 `children` 表达嵌套层级，与前述更新接口拍平写入不同。原示例缺少末尾对象括号，现已补齐，所有选项与层级保留。

```json
{
  "options": [
    {
      "label": "option_1",
      "value": "om0akph4a",
      "children": [
        {
          "label": "option_om0akph4a1",
          "value": "odptyj4py"
        },
        {
          "label": "option_om0akph4a2",
          "value": "v0x59y9ke",
          "children": [
            {
              "label": "option_v0x59y9ke1",
              "value": "l3rn3gyw0"
            }
          ]
        },
        {
          "value": "fk1v2uprv",
          "label": "option_om0akph4a3"
        },
        {
          "label": "option_om0akph4a4",
          "value": "62ewqskam"
        }
      ]
    },
    {
      "label": "option_3",
      "value": "nhaqo_mf_"
    }
  ]
}
```

<a id="3e8f110e"></a>

## 子任务

<a id="a1b8daac"></a>

### 读取自定义字段配置与映射

调用[获取字段信息](../api/获取字段信息.md)，请求体传 `work_item_type_key: sub_task`。这一用法由字段接口的类型筛选参数与下方官方 FAQ 截图共同印证：截图返回的是字段定义结构，包括 `field_key/field_type_key/is_custom_field/value_generate_mode`。

<a id="0c7a40e2"></a>

### 读取子任务自定义字段值

调用[工作项详情](../api/获取工作项详情.md)，将 `work_item_type_key` 设为 `sub_task`，`work_item_ids` 填子任务 ID。子任务 ID 可通过[工作流详情](../api/获取工作流详情.md)取得。

<a id="3b2fa3e6"></a>

## 群组

<a id="04b0b4a7"></a>

### 绑定指定群

先创建群聊并加入飞书项目机器人。原文展示了在工作项“基本信息”中绑定群的位置，也给出了[更新工作项](../api/更新工作项.md)的 API 写法；两种方式均需有可绑定的群。

`group_id` 必须配合 `group_type: bind` 使用：

```json
{
  "update_fields": [
    {
      "field_key": "group_type",
      "field_value": "bind"
    },
    {
      "field_key": "group_id",
      "field_value": "*****"
    }
  ]
}
```

<a id="b28354e9"></a>

### 获取需求绑定的群

通过[工作项详情](../api/获取工作项详情.md)读取绑定群 ID。`oc_` 开头是飞书开放平台新格式，纯数字形式是历史格式，不要按外观擅自转换。

<a id="52b5c3e2"></a>
<a id="7166bf79"></a>

## 富文本 DOC 完整示例

`doc` 描述一系列编辑动作，`ops` 为操作序列；`zoneId` 用于关联编辑区。`0` 是入口，其他 ID 原文说明为随机生成的唯一 ID，但相互引用必须一致。

先按下表理解结构，再查完整示例。原代码注释已移入说明，字符串使用等价 Unicode 转义；对象数据、编辑区和操作顺序均保留。

| 结构或属性 | 原注释说明 |
| --- | --- |
| `zoneType: Z`、`zoneId` | 普通编辑区；`doc[zoneId]` 对应编辑区对象 |
| `lmkr: "1"` 与 `insert: "*"` | 插入行标记，会换行 |
| `insert: "\n"` | 插入换行 |
| 普通 `insert` 字符串 | 插入文本 |
| `dataMetaBlockProps` | 用户 mention 元数据；`blockId` 唯一、`blockType=AT_USER_BLOCK` 固定，`props.data.user` 可按需修改，其他保持原结构 |
| `hyperlink` | 普通超链接的 JSON 字符串，含 href、linkId |
| `linkPreviewId/url/isUrl/tempPreviewEntity/removeLink` | 可预览超链接属性 |
| `type: codeblock` | 代码块，含语言、子编辑区 zoneId、parentZoneId、wrap |
| `aceTable` | 行编辑区 ID 与列编辑区 ID，空格分隔 |
| `text-indent`、`list: indent2` | 行首缩进再叠加两级缩进，共三级 |
| `blockquote` | Markdown 或工具栏引用 |
| `list: check1` | 工具栏任务列表，check 加序号 |
| `list: bullet1` | 无序列表，bullet 加序号 |
| `list: number1/start/ol-id/origin-start` | 有序列表序号、分组 ID 与起始序号 |
| `align` | left、center、right 对齐 |
| `underline/italic/bold/strikethrough` | 下划线、斜体、粗体、删除线 |
| `backgroundcolor/fontcolor` | 文字背景色与字体色 |
| `heading: h1/h2/h3` | Markdown 标题 |
| `fontsize: 26px/22px/20px/18px/16px` | 工具栏 1–5 级标题样例 |
| `image/uuid/src/width` | 图片及其唯一 ID、地址、宽度 |
| 代码区首尾 | 第一行须插入行标记，最后一行须插入换行 |
| `clientside-highlight` | 代码高亮样式，可按实际渲染结果指定 |
| `fontfamily` | 字体定制 |
| `zoneType: R/C` | 表格行、列编辑区，`insert.id` 为行或列 ID |
| 单元格编辑区 ID | 按 `x + 行ID + x + 列ID` 组合，类型为 Z |
| 表格布局属性 | `backgroundColor/valign/padding/border/colWidth` 均保留原示例值 |

示例中的图片 URL 是原文掩码占位地址，不能用于实际加载；用户和链接数据也应替换为实际内容。

```javascript
export const doc = {
  "0": {
    "zoneId": "0",
    "zoneType": "Z",
    "ops": [
      {
        "attributes": {
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\n"
      },
      {
        "insert": "at\u7528\u6237 "
      },
      {
        "attributes": {
          "dataMetaBlockProps": "{\"blockId\":\"f2258544-5e13-444d-8d53-9e26ed2ee3a2\",\"blockType\":\"AT_USER_BLOCK\",\"props\":{\"data\":{\"user\":{\"avatar_url\":\"\",\"type\":0,\"id\":\"lark_user_id_7097030071810097180\",\"cn_name\":\"\u59dc\u6765\",\"en_name\":\"\u59dc\u6765\",\"email\":\"jianglai.futurer@bytedance.com\"}},\"displayMode\":\"inline\"},\"initData\":\"%7B%7D\"}"
        },
        "insert": " "
      },
      {
        "attributes": {
          "hyperlink": "{\"href\":\"https://project.feishu.cn/b/helpcenter/1p8d7djs/1btl061e\",\"linkId\":\"HanWAweZ-7wSf-TGeI-byfM-iPa6yCnU5gZr\"}"
        },
        "insert": "https://project.feishu.cn/b/helpcenter/1p8d7djs/1btl061e"
      },
      {
        "attributes": {
          "linkPreviewId": "OhWoLpGR-GNXg-xmTQ-5iXN-U1TkW6nuCdbA",
          "url": "https://project.feishu.cn/openapp/MII_xxxx#versions",
          "isUrl": "true",
          "tempPreviewEntity": "clear",
          "removeLink": "true"
        },
        "insert": "https://project.feishu.cn/openapp/MII_xxxx#versions"
      },
      {
        "attributes": {
          "type": "codeblock",
          "language": "TypeScript",
          "zoneId": "t18qqm7hbo",
          "wrap": "true",
          "parentZoneId": "0"
        },
        "insert": " "
      },
      {
        "attributes": {
          "aceTable": "rsi35onyo8rp7f9m4c46ay8lnhz1s6a7br csm5ibflyllolmgnebn1n0ykewcd8tfmi1"
        },
        "insert": "*"
      },
      {
        "attributes": {
          "text-indent": "true",
          "lmkr": "1",
          "list": "indent2"
        },
        "insert": "*"
      },
      {
        "attributes": {
          "blockquote": "true",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u5f15\u7528\n"
      },
      {
        "attributes": {
          "list": "check1",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u4efb\u52a1\u5217\u8868\n"
      },
      {
        "attributes": {
          "list": "bullet1",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u65e0\u5e8f\u5217\u88681\n"
      },
      {
        "attributes": {
          "lmkr": "1",
          "list": "bullet1"
        },
        "insert": "*"
      },
      {
        "insert": "\u65e0\u5e8f\u5217\u88682\n"
      },
      {
        "attributes": {
          "start": "1",
          "list": "number1",
          "ol-id": "z1eCpGRt",
          "origin-start": "1",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u6709\u5e8f\u5217\u88681\n"
      },
      {
        "attributes": {
          "start": "2",
          "lmkr": "1",
          "list": "number1",
          "ol-id": "z1eCpGRt"
        },
        "insert": "*"
      },
      {
        "insert": "\u6709\u5e8f\u5217\u88682\n"
      },
      {
        "attributes": {
          "align": "left",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u5de6\u5bf9\u9f50\n"
      },
      {
        "attributes": {
          "align": "center",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u4e2d\u5bf9\u9f50\n"
      },
      {
        "attributes": {
          "align": "right",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u53f3\u5bf9\u9f50\n"
      },
      {
        "attributes": {
          "underline": "true",
          "italic": "true",
          "bold": "true",
          "strikethrough": "true",
          "backgroundcolor": "rgb(149, 229, 153)",
          "fontcolor": "rgb(192, 42, 38)"
        },
        "insert": "\u6587\u5b57\u6837\u5f0f"
      },
      {
        "attributes": {
          "lmkr": "1",
          "heading": "h1"
        },
        "insert": "*"
      },
      {
        "insert": "\u6807\u98981\n"
      },
      {
        "attributes": {
          "heading": "h2",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u6807\u98982\n"
      },
      {
        "attributes": {
          "heading": "h3",
          "lmkr": "1"
        },
        "insert": "*"
      },
      {
        "insert": "\u6807\u98983\n"
      },
      {
        "attributes": {
          "fontsize": "26px"
        },
        "insert": "\u6807\u98981"
      },
      {
        "attributes": {
          "fontsize": "22px"
        },
        "insert": "\u6807\u98982"
      },
      {
        "attributes": {
          "fontsize": "20px"
        },
        "insert": "\u6807\u98983"
      },
      {
        "attributes": {
          "fontsize": "18px"
        },
        "insert": "\u6807\u98984"
      },
      {
        "attributes": {
          "fontsize": "16px"
        },
        "insert": "\u6807\u98985"
      },
      {
        "attributes": {
          "image": "true",
          "uuid": "F48484D6-AFD8-4FB0-BA08-383CDB932CE9",
          "src": "https://project.feishu.cn/goapi/v1/tos/file/xxxx.jpg",
          "width": 238
        },
        "insert": " "
      }
    ]
  },
  "t18qqm7hbo": {
    "zoneId": "t18qqm7hbo",
    "zoneType": "Z",
    "ops": [
      {
        "attributes": {
          "lmkr": "1",
          "lineHeight": "18px"
        },
        "insert": "*"
      },
      {
        "attributes": {
          "clientside-highlight": "code-hljs-variable language_",
          "fontfamily": "Menlo, Monaco, \"Courier New\", monospace"
        },
        "insert": "window"
      },
      {
        "attributes": {
          "fontfamily": "Menlo, Monaco, \"Courier New\", monospace"
        },
        "insert": "."
      },
      {
        "attributes": {
          "clientside-highlight": "code-hljs-property",
          "fontfamily": "Menlo, Monaco, \"Courier New\", monospace"
        },
        "insert": "JSSDK"
      },
      {
        "insert": "\n"
      }
    ]
  },
  "rsi35onyo8rp7f9m4c46ay8lnhz1s6a7br": {
    "zoneId": "rsi35onyo8rp7f9m4c46ay8lnhz1s6a7br",
    "zoneType": "R",
    "ops": [
      {
        "attributes": {
          "backgroundColor": "{}",
          "valign": "{}",
          "padding": "{}",
          "border": "{}",
          "colWidth": "100"
        },
        "insert": {
          "id": "r1lkr58j3gtjh2pncvbsqiwav36c7sz35w"
        }
      }
    ]
  },
  "csm5ibflyllolmgnebn1n0ykewcd8tfmi1": {
    "zoneId": "csm5ibflyllolmgnebn1n0ykewcd8tfmi1",
    "zoneType": "C",
    "ops": [
      {
        "attributes": {
          "colWidth": "100",
          "backgroundColor": "{}",
          "valign": "{}",
          "padding": "{}",
          "border": "{}"
        },
        "insert": {
          "id": "c19np7of78wa797gi7lm3z3cvgttwld58b"
        }
      }
    ]
  },
  "xr1lkr58j3gtjh2pncvbsqiwav36c7sz35wxc19np7of78wa797gi7lm3z3cvgttwld58b": {
    "zoneId": "xr1lkr58j3gtjh2pncvbsqiwav36c7sz35wxc19np7of78wa797gi7lm3z3cvgttwld58b",
    "zoneType": "Z",
    "ops": [
      {
        "insert": "1\u884c1\u5217\n"
      }
    ]
  }
};
```

<a id="5a851a76"></a>
<a id="123729c7"></a>

## 私有化环境：获取 token 报 wrong plugin id

先检查请求域名是否为该私有化环境的域名。私有化环境通常不使用 `project.feishu.cn`；将公有云地址与私有化插件 ID 混用会导致此类问题。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/z2ox1bjb
