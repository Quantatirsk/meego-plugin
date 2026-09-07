# toast

`window.JSSDK.toast` 显示普通、警告、错误或成功提示。**同一插件同时只展示一个提示**，新提示替代此前的提示；四种类型共享这一限制。

<a id="d7d2db85"></a>

## 方法与端支持

| 方法 | 用途 | 网页端 | 移动端 |
| --- | --- | --- | --- |
| [info](#cd989296) | 普通信息 | 支持 | V7.35.0+ |
| [warning](#76cbcc9a) | 警告 | 支持 | V7.35.0+ |
| [error](#0234f5c2) | 错误 | 支持 | V7.35.0+ |
| [success](#c3a0fd93) | 成功 | 支持 | 最低版本待核实，原文支持表漏列 |
| [close](#db4c1b1f) | 手动关闭 | 支持 | V7.35.0+ |

SDK 2.1.8 定义全部五个方法；原文支持表重复列出 `warning`，因此本篇恢复完整方法列表，但不据此补造 `success` 的移动端版本。

## 四种提示共用的参数

调用形式为 `info(options)`、`warning(options)`、`error(options)` 或 `success(options)`，均接受字符串或 `ToastOptions` 对象。

| 参数 | 类型 | 必填 | SDK 2.1.8 定义 |
| --- | --- | --- | --- |
| `content` | string | 对象形式必填 | 文案不超过 40 个字符，超出截断并以 `...` 替代 |
| `duration` | number | 否 | 单位秒，默认 5 秒，最长 10 秒；官方正文规定最短 3 秒 |

字符串形式直接指定文案。SDK 的 `content` 注释虽描述默认空字符串，但类型要求对象必须带该字段，不应传入缺少 `content` 的对象。

长度和默认时长采用当前 SDK 注释，时长范围保留官方正文的 3–10 秒。超出范围时的错误处理、字符计数方式未明确；不能把 `0` 当作永久显示开关。

四种方法都返回 `Promise<string>`，解析值是用于手动关闭的 toast ID。调用失败需处理 rejection；获得 ID 不表示业务操作已经成功，应先由业务逻辑决定显示哪一类提示。

<a id="cd989296"></a>

## info：普通提示

<a id="657b2020"></a>
<a id="0998e61f"></a>

使用上面的共用参数，返回 `Promise<string>`。

<a id="95a3ea01"></a>

下列两种形式分别调用，效果相同；不要为了比较形式同时触发两个提示。

```typescript
const toastId = await window.JSSDK.toast.info("tips~");
```

```typescript
const toastId = await window.JSSDK.toast.info({
  content: "tips~",
  duration: 5,
});
```

![普通提示](<../assets/2eada03976de2bd3b66b223a.gif>)

<a id="76cbcc9a"></a>

## warning：警告提示

<a id="95e41640"></a>
<a id="876086f1"></a>

共用参数与返回规则不变。文案沿用原例含义，使用英文标点。

<a id="f2a1505f"></a>

```typescript
const toastId = await window.JSSDK.toast.warning("warning!");
```

```typescript
const toastId = await window.JSSDK.toast.warning({
  content: "warning!",
  duration: 5,
});
```

![警告提示](<../assets/5658c2c3629d042b0402a85a.gif>)

<a id="0234f5c2"></a>

## error：错误提示

<a id="b539cdd3"></a>
<a id="6ce4e2e2"></a>

共用参数与返回规则不变。

<a id="291c4e3c"></a>

```typescript
const toastId = await window.JSSDK.toast.error("error!");
```

```typescript
const toastId = await window.JSSDK.toast.error({
  content: "error!",
  duration: 5,
});
```

![错误提示](<../assets/3e0eedfdfd59d1ad34470ac4.gif>)

<a id="c3a0fd93"></a>

## success：成功提示

<a id="a8a4a560"></a>
<a id="a65ba663"></a>

共用参数与返回规则不变。

<a id="4e40a48c"></a>

```typescript
const toastId = await window.JSSDK.toast.success("success!");
```

```typescript
const toastId = await window.JSSDK.toast.success({
  content: "success!",
  duration: 5,
});
```

![成功提示](<../assets/f6c5bb977f61f58131584902.gif>)

<a id="db4c1b1f"></a>

## close：手动关闭

<a id="bb18cf3e"></a>

必填参数 `id: string` 是四种显示方法解析得到的 toast ID。

<a id="95451311"></a>

SDK 2.1.8 定义 `close(id: string): void`，不提供异步关闭完成信号。已过期或被新提示替代的 ID 如何处理，原文没有说明。

<a id="e3f9e45f"></a>

本例显式设置 10 秒自动关闭，再于 5 秒后手动关闭，避免把已自动消失的提示当作有效演示。

```typescript
try {
  const toastId = await window.JSSDK.toast.info({
    content: "tips~",
    duration: 10,
  });
  setTimeout(() => {
    window.JSSDK.toast.close(toastId);
  }, 5000);
} catch (error) {
  console.error(error);
}
```

前面各单项示例同样应由调用方捕获失败；本页未定义具体错误码及系统权限错误的映射。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/7330ys5f
