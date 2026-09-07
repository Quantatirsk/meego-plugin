# clipboard

`window.JSSDK.clipboard` 提供向用户剪贴板写入字符串的能力。本页及 SDK 2.1.8 仅定义写入方法，没有读取剪贴板的方法。

<a id="43f8470c"></a>

## 支持范围

| 方法 | 网页端 | 移动端 |
| --- | --- | --- |
| [writeText](#c0850036) | 支持 | V7.35.0+ |

端与最低版本来自官方支持表。原文没有额外列出点位限制；SDK 类型存在不代表低于该版本的宿主也支持。

<a id="c0850036"></a>

## writeText：写入文本

<a id="6a16a73e"></a>

调用形式为 `writeText(text)`。

| 参数 | 类型 | 必填 | 限制 |
| --- | --- | --- | --- |
| `text` | string | 是 | 长度不超过 1000 个字符 |

原文没有说明字符数量按 Unicode 码点、UTF-16 单元还是其他方式计算；不应自行把该限制改写为字节数。

<a id="5e46371f"></a>

### 返回与失败

返回 `Promise<boolean>`。

| 结果 | 含义 |
| --- | --- |
| 解析为 `true` | 写入成功 |
| 解析为 `false` | 未成功写入；原文未细分原因 |
| Promise rejected | 调用失败；原文明确超出 1000 字符会产生 `OutOfLimitError` |

应同时检查布尔结果与捕获异常，不能仅因 `await` 没有抛错就显示复制成功。其他系统权限或环境错误的具体映射未在本页定义。

<a id="e069e6ff"></a>

## 示例

```javascript
try {
  const success = await window.JSSDK.clipboard.writeText("lark project");
  if (success) {
    console.log("Text copied");
  } else {
    console.warn("Text was not copied");
  }
} catch (error) {
  if (error?.name === "OutOfLimitError") {
    console.error(error.originMessage ?? error.message);
  } else {
    console.error(error);
  }
}
```

按错误名称判断不依赖原示例中未导入的 `OutOfLimitError` 标识。`originMessage` 是原文使用的底层错误信息；其他异常直接记录错误对象。

## 相关文档

- [toast](<toast.md>)

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/nqztnm4h
