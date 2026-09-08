# storage

<!-- capability-metadata:start -->
## 平台能力标记

<a id="capability-jssdk.storage.clear"></a>
- **storage.clear** ｜ `jssdk.storage.clear` ｜ 频次：低 ｜ 状态：待运行时验证
<a id="capability-jssdk.storage.get-item"></a>
- **storage.getItem** ｜ `jssdk.storage.get-item` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.storage.get-item.fixture`](<../../../fixtures/jssdk/storage-get-item.json>)
<a id="capability-jssdk.storage.remove-item"></a>
- **storage.removeItem** ｜ `jssdk.storage.remove-item` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.storage.remove-item.fixture`](<../../../fixtures/jssdk/storage-remove-item.json>)
<a id="capability-jssdk.storage.set-item"></a>
- **storage.setItem** ｜ `jssdk.storage.set-item` ｜ 频次：高 ｜ 状态：已验证 ｜ 示例：[`jssdk.storage.set-item.fixture`](<../../../fixtures/jssdk/storage-set-item.json>)

<!-- capability-metadata:end -->

`window.JSSDK.storage` 读写平台提供的本地存储，按**当前登录用户和插件**隔离。其他插件无法读取当前插件的数据，适合保存可丢失的偏好、搜索历史等本地状态。

## 存储边界

- 原文规定每个开发者在一个插件中最多写入 **5 MB**；超额会产生 `OutOfLimitError`。按用户和插件隔离使用，不应将该限额理解为每个 key 的额度。
- **切换账号会清空原账号的本地存储**，不要将关键信息的唯一副本存放在这里。
- 值仅支持字符串；对象与数组需自行序列化、解析及校验。
- 方法均返回 Promise。读取、写入和删除都可能失败，调用方应处理 rejection。
- 原文没有说明跨设备同步、有效期或并发更新保证，也没有按点位列出额外限制。

<a id="87f94d22"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| [setItem](#760636ed) | 支持 | V7.35.0+ |
| [getItem](#d41b012e) | 支持 | V7.35.0+ |
| [removeItem](#34a7b298) | 支持 | V7.35.0+ |
| [clear](#9beaee03) | 支持 | V7.35.0+ |

<a id="760636ed"></a>

## setItem：写入一个键

<a id="e77abded"></a>

调用形式为 `setItem(key, value?)`。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `key` | string | 是 | 要写入的键 |
| `value` | string | 否 | 字符串内容；原文称“为空时”清除该键，但未区分省略参数与空字符串的具体边界 |

需要明确删除时使用 [removeItem](#34a7b298)，避免依赖未明确的空值行为。

<a id="ed1f5201"></a>

返回 `Promise<void>`：写入成功时 fulfilled，失败时 rejected 并提供错误消息。

<a id="96889c65"></a>

### 写入 JSON 并处理超额

```javascript
try {
  const preferences = { displayMode: "compact" };
  await window.JSSDK.storage.setItem(
    "preferences",
    JSON.stringify(preferences),
  );
} catch (error) {
  if (error?.name === "OutOfLimitError") {
    console.error(error.originMessage ?? error.message);
  } else {
    console.error(error);
  }
}
```

原文错误示例使用 `name` 识别限额错误、用 `originMessage` 读取底层消息。本例直接比较错误名称，避免依赖未导入的 `OutOfLimitError` 类。

<a id="d41b012e"></a>

## getItem：读取一个键

<a id="c9a32c58"></a>

调用形式为 `getItem(key)`，必填参数 `key` 为 string。

<a id="49fda501"></a>

返回 `Promise<string | undefined>`：存在时解析为存入的字符串，不存在时解析为 `undefined`；读取失败时 rejected。存储不会自动将 JSON 字符串还原成对象。

<a id="cbd8d332"></a>

```javascript
try {
  const value = await window.JSSDK.storage.getItem("preferences");
  if (value !== undefined) {
    const preferences = JSON.parse(value);
    console.log(preferences);
  }
} catch (error) {
  console.error(error);
}
```

本例同时捕获读取和 JSON 解析异常。业务使用解析结果前，仍应校验是否符合预期结构。

<a id="34a7b298"></a>

## removeItem：删除一个键

<a id="edff8bfb"></a>

调用形式为 `removeItem(key)`，必填参数 `key` 为 string。

<a id="a164a931"></a>

返回 `Promise<void>`：删除成功时 fulfilled，失败时 rejected。

<a id="0c40b612"></a>

```javascript
try {
  await window.JSSDK.storage.removeItem("preferences");
} catch (error) {
  console.error(error);
}
```

<a id="9beaee03"></a>

## clear：清空当前插件存储

无参数，清空当前登录用户下当前插件的所有本地存储。只需删除某项时应使用 `removeItem`，避免连带清除其他功能保存的状态。

<a id="49e4e5a7"></a>

返回 `Promise<void>`：清空成功时 fulfilled，失败时 rejected。

<a id="4724c72b"></a>

```javascript
try {
  await window.JSSDK.storage.clear();
} catch (error) {
  console.error(error);
}
```

## 相关文档

- [shared](<shared.md>)

## 验证样例

- [`storage.setItem()`](<../../../fixtures/jssdk/storage-set-item.json>)：字符串写入与空值边界未定义的记录。
- [`storage.getItem()`](<../../../fixtures/jssdk/storage-get-item.json>)：字符串读取与拒绝值未定义的记录。
- [`storage.removeItem()`](<../../../fixtures/jssdk/storage-remove-item.json>)：单键删除与缺失键语义未定义的记录。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/arvsjvf3
