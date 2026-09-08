# 通过视图ID查询所有图表

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-openapi.post.open-api-measure-charts"></a>
- **通过视图ID查询所有图表** ｜ `openapi.post.open-api-measure-charts` ｜ 频次：低 ｜ 状态：待运行时验证

<!-- capability-metadata:end -->

分页查询空间视图下的度量图表，返回图表 ID 和名称。取得 `chart_id` 后，可继续调用[获取度量图表明细数据](获取度量图表明细数据.md)读取每张图表的数据。

## 使用前确认

页码从 1 开始，默认每页 50 条，最大 200 条。列表位于 `data.chart_list`，分页信息位于 `data.chart_page`；需要全部图表时，应按分页总数继续读取。

该接口用于查询得到该空间视图下的所有度量图表。对应的权限申请在**权限管理-度量&视图**分类下，相关功能介绍详见[权限管理](../guides/权限管理.md)。

<a id="请求说明"></a>

## 请求说明

- 请求方式：POST

- 请求地址：/open_api/measure/charts

<a id="请求参数"></a>

## 请求参数

<a id="header"></a>

### Header

接口调用的 Header 配置详见 [Header](../guides/OpenAPI概述.md#a8e43b86)。

<a id="Body"></a>

### Body

| 参数 | 类型 | 是否必须 | 说明 |
| --- | --- | --- | --- |
| `project_key` | string | 必须 | [说明](#parameter-note-1) |
| `view_id` | string | 必须 | 视图 ID，一般在视图页面 URL 中获取。例如视图 URL 为 `https://project.feishu.cn/<simple name>/storyView/RHCFGTzDa`，则视图 ID 为 `RHCFGTzDa`。 |
| `page_num` | int32 | 可选 | 分页页码，从1开始，默认为1 |
| `page_size` | int32 | 可选 | 分页大小，默认值是 50，最大值为 200。 |

<a id="parameter-note-1"></a>

**project_key：说明**

空间 ID（project_key），或者空间域名（simple_name）。
- 空间 ID（project_key），在飞书项目空间双击空间名称获取。
- 空间域名（simple_name），`simple_name` 一般在飞书项目空间 URL 中获取。例如空间 URL 为 “https://project.feishu.cn/doc/overview”，则 `simple_name`为 “doc”。

<a id="返回参数"></a>

## 返回参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `data` | object | 查询结果。 |
| `err` | object | 请求成功时返回空值，请求失败时返回实际错误信息。 |
| `err_msg` | string | 请求成功时返回空值，请求失败时返回实际错误信息。 |
| `err_code` | int32 | 请求成功时0，请求失败返回实际错误码。 |

### `data` 的字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `chart_list` | `list<object>` | 图表数据 |
| `chart_page` | object | 分页信息 |

### `data.chart_list` 的字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `chart_id` | string | 图表ID |
| `chart_name` | string | 图表名称 |

### `data.chart_page` 的字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `total` | int32 | 总数量 |
| `page_num` | int32 | 分页页码 |
| `page_size` | int32 | 分页大小 |

### `err` 的字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | int32 | 部分场景下，透出更详细错误对应的错误码。 |
| `msg` | string | 部分场景下，透出更详细的错误描述。 |
| `log_id` | string | 报错场景下的调用链标识符，用于追踪错误发生时的完整调用链路，便于日志记录和问题排查。 |

<a id="请求示例"></a>

## 请求示例

```json
{
  "project_key": "680df032eaf703f19c63xxxx",
  "view_id": "8wXISu-Hg",
  "page_num": 1,
  "page_size": 4
}
```

<a id="返回示例"></a>

## 返回示例

### 请求成功返回

```json
{
  "data": {
    "chart_list": [
      {
        "chart_id": "7506782519828xxxx",
        "chart_name": "\u56fe\u88681"
      },
      {
        "chart_id": "75067827197963xxxx",
        "chart_name": "\u56fe\u88682"
      }
    ],
    "chart_page": {
      "total": 6,
      "page_num": 1,
      "page_size": 4
    }
  },
  "err": {},
  "err_code": 0,
  "err_msg": ""
}
```

### 错误返回示例

```json
{
  "err_code": 1000052062,
  "err_msg": "Project Key Is Wrong",
  "err": {
    "code": 1000052062,
    "msg": "not found simple name: 662e********34ae1874213",
    "log_id": "20251120163625A78707D**********F"
  }
}
```

<a id="错误码"></a>

## 错误码

以下列出了该接口相关的错误码信息，若需查看更多通用错误码说明，参见 [Open API 错误码](../formats/Open%20API%20错误码.md)。

| `err_code` | err_msg | err.code | err.msg | 说明 |
| --- | --- | --- | --- | --- |
| `1000051401` | ErrnoInvalidParameter | 1000051401 | Invalid parameter | 参数异常，输入参数中存在不合理参数，请检查。 |

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/nr49t4o9
