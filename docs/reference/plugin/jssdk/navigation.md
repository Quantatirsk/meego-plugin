# navigation

`window.JSSDK.navigation` 用于读取平台地址、打开网页，以及打开工作项的新建页或详情页。这里读取的是宿主平台地址，适用于需要从插件跳转到平台页面的场景。原文未按插件点位进一步限制，端与版本要求如下。

<a id="3a0c550e"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| [getHostname](#ad4e6303) | 支持 | V7.41.0+ |
| [getHref](#e8e51eec) | 支持 | 不支持 |
| [open](#733550af) | 支持 | V7.35.0+ |
| [openWorkItemCreatePage](#3413fb44) | 支持 | V7.35.0+，不支持完成及取消回调 |
| [openWorkItemDetailPage](#51bb3507) | 支持 | V7.35.0+ |

<a id="ad4e6303"></a>

## getHostname：读取平台域名

无参数，读取当前平台域名。

<a id="96185899"></a>

返回 `Promise<string>`，例如 `project.feishu.cn`。

<a id="0401ccce"></a>

```javascript
const hostname = await window.JSSDK.navigation.getHostname();
console.log(hostname);
```

<a id="e8e51eec"></a>

## getHref：读取平台完整 URL

无参数，仅网页端支持。结果包含页面地址中的查询参数和片段。

<a id="92e2047f"></a>

返回 `Promise<string>`，例如 `https://project.feishu.cn?a=1#hash`。

<a id="0749a3f1"></a>

```javascript
const href = await window.JSSDK.navigation.getHref();
console.log(href);
```

<a id="733550af"></a>

## open：在新标签页打开资源

<a id="9ba3467c"></a>

调用形式为 `open(url, target?)`。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | HTML 页面、图片等浏览器支持的资源 URL |
| `target` | string | 否 | 新标签页名称，默认 `_blank`；不能包含空格，不支持 `_parent`、`_self`、`_top` |

新标签页默认使用 `noopener, noreferrer`。即使两次 `target` 相同，也不能复用同一标签页；目标站点不能通过 `opener` 访问平台。

<a id="6d5ffea7"></a>

无返回值，不能将它当作原生 `window.open` 返回的窗口对象使用。

<a id="54788803"></a>

```javascript
window.JSSDK.navigation.open("https://feishu.cn");
```

<a id="3413fb44"></a>

## openWorkItemCreatePage：打开新建表单

<a id="7ac6488e"></a>

调用形式为 `openWorkItemCreatePage(options, callback?, onCancel?)`。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `options` | OpenWorkItemCreatePageOptions | 是 | 空间、工作项类型与表单配置 |
| `callback` | `(err: Error \| undefined, result: { workItemId: number }) => void` | 否 | 仅网页端；新建完成后调用，`err === undefined` 表示成功 |
| `onCancel` | `() => void` | 否 | 仅网页端；用户取消新建时调用 |

成功后的实例 ID 从 `result.workItemId` 读取，不从方法返回值获取。

<a id="2cb4dd42"></a>

### OpenWorkItemCreatePageOptions

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `spaceId` | string | 是 | 空间唯一 ID |
| `workObjectId` | string | 是 | 工作项配置唯一 ID；官方示例使用 `story` |
| `mode` | `"default" \| "modal"` | 否 | 默认 `default`，行为见下表 |
| `supportedWorkObjectIds` | string[] | 否 | 可切换的工作项类型列表；不适用于 `modal` 模式 |
| `formPreset` | WorkItemCreateFormPreset | 否 | [新建表单预填值](<通用类型定义.md#afc5bc76>) |

| 模式 | 打开表单时 | 创建成功后 |
| --- | --- | --- |
| `default` | 当前页面路由改变 | 跳转到新工作项详情页 |
| `modal` | 当前路由不变，以模态框打开 | 不跳转到新工作项详情页 |

`supportedWorkObjectIds` 默认空列表，表单顶部展示全部工作项类型；非空时仍默认包含 `workObjectId` 指定的类型。该参数不能在 `modal` 模式下使用。

`formPreset.attribute` 仅支持名称 `name`。`formPreset.field` 按字段 ID 映射到 `fieldType`、`fieldValue`；不支持投票、附件、系统外信号、多值系统外信号、复合字段及未知类型。完整类型与值格式见[通用类型定义](<通用类型定义.md#597e7001>)。

<a id="a993f4b7"></a>

无返回值。

<a id="2de1f128"></a>

### 网页端示例

将空间与 `field_id` 替换为实际 ID。本例限定为 `story`，为数字字段预填 `1`；代码使用 JavaScript，`"number"` 是官方 FieldType 的数字类型值。

```javascript
window.JSSDK.navigation.openWorkItemCreatePage(
  {
    spaceId: "68382b399de4b0ec6c5a_example",
    workObjectId: "story",
    supportedWorkObjectIds: ["story"],
    formPreset: {
      field: {
        field_id: {
          fieldType: "number",
          fieldValue: 1,
        },
      },
    },
  },
  (err, result) => {
    if (err !== undefined) {
      console.error(err);
      return;
    }
    console.log(result.workItemId);
  },
);
```

![新建工作项效果](<../assets/3fa5ac135779c3dd8a99299b.gif>)

<a id="51bb3507"></a>

## openWorkItemDetailPage：打开实例详情

<a id="a00d0f52"></a>

调用形式为 `openWorkItemDetailPage(options)`，`options` 必填。

<a id="bfdf3c37"></a>

### OpenWorkItemDetailPageOptions

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `spaceId` | string | 是 | 空间唯一 ID |
| `workObjectId` | string | 是 | 工作项配置唯一 ID |
| `workItemId` | number | 是 | 工作项实例唯一 ID |

<a id="66e67df6"></a>

无返回值。

<a id="9e60a12b"></a>

```javascript
window.JSSDK.navigation.openWorkItemDetailPage({
  spaceId: "68382b399de4b0ec6c5a_example",
  workObjectId: "story",
  workItemId: 1234,
});
```

![打开工作项详情效果](<../assets/027d8af5c12b825b61f51b31.gif>)

## 相关文档

- [通用类型定义](<通用类型定义.md#597e7001>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/eya1z1nb
