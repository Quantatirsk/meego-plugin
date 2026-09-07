# 拦截事件响应

拦截事件在操作执行前同步询问插件是否放行。它和监听事件共用回调与验签概念，但响应语义不同：接收端必须在 1000ms 内返回明确的拦截决定，超时按不拦截处理。

## 请求边界

拦截事件使用 HTTP POST。callback token 为可选配置；配置后按[事件回调验签](webhook-signature.md)验证 `signature`。来源资料将拦截事件样例中的 `request_time` 定义为秒级 Unix 时间戳，因此不能复用监听事件的毫秒假设。

## 同步响应

`need_intercept: true` 会阻止当前操作；`false` 放行。官方展示的响应是一个完整结构，包含 `msg`、`custom_data` 和 `intercept_options`。来源没有定义在 `false` 时这些字段能否省略；在完成运行时验证前，本地实现应保留完整结构。

```json
{
  "need_intercept": true,
  "msg": {
    "zh": "ACTION_IS_NOT_ALLOWED",
    "en": "ACTION_IS_NOT_ALLOWED",
    "ja": "ACTION_IS_NOT_ALLOWED"
  },
  "custom_data": "",
  "intercept_options": {
    "disable_show_plugin": true
  }
}
```

不能先返回 HTTP `200` 再异步决定是否拦截。耗时校验应在回调时限内完成，或在超时情况下接受平台按不拦截处理。

## 实现边界

- 预创建事件中的 `work_item_id` 可能为 `0`，不能将其作为已存在实例查询。
- `data.idempotent_key` 可以重复出现在同一对象的多次操作中；缓存拦截结论时必须结合当前状态和有效期。
- 监听事件的重试和快速确认规则不适用于此处的同步拦截决定。

对应 fixture：[拦截事件响应](../../fixtures/events/intercept.json)。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/5cojktgi
