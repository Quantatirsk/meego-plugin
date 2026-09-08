# 服务端与 OpenAPI 代理

在自建服务端、平台凭证、OpenAPI 调用、事件回调或长任务发生改动时读取。本页给出通用边界；精确 URL、参数、Header、请求与响应必须从 `meego-platform-facts` 选择对应 OpenAPI 页面。

## 调用链

```text
Plugin client -> Plugin backend -> Feishu Project OpenAPI
```

客户端只调用自己的后端，并通过 JSSDK 获取当前点位 context 或一次性授权码。后端验证自己的会话、保存 Plugin Secret 与平台 token、按明确接口调用 OpenAPI，并把经过筛选的结果返回客户端。

- `pluginSecret` 可以存在于本机 `lpm` 配置和服务端密钥配置，但不能被客户端代码读取，也不能提交到 Git。
- `plugin_access_token`、`virtual_plugin_token`、`user_access_token` 和 `refresh_token` 只保存在服务端。
- 用户授权时，客户端调用 `window.JSSDK.utils.getAuthCode()` 并把一次性 `code` 发给后端；后端完成用户凭证交换与刷新。完整流程见“获取访问凭证”。

不要将浏览器请求直接代理为任意 `/open_api/{path}`。每个客户端能力都应对应一个明确的后端路由和一个已选定的 OpenAPI 接口。

## 开发与生产

| 边界 | 本地开发 | 生产 |
| --- | --- | --- |
| 浏览器来源 | 允许受控的 `localhost` 和 `127.0.0.1` 开发端口 | 仅允许部署后的明确 Origin 列表 |
| CORS | 可使用 localhost 正则；携带 cookie 时仍不能使用 `*` Origin | 不使用通配符，缺少 allowlist 直接启动失败 |
| 后端路由 | 可开放当前开发功能所需的少量固定路由 | 每条路由都绑定明确的请求模型、授权和平台接口 |
| OpenAPI 目标 | 固定飞书项目域名；短期允许一组已列出的接口 | 固定域名、接口级 allowlist、请求大小和超时限制 |
| 身份 | 开发会话仍需解析到明确用户 | 验证会话、租户、用户归属和资源访问权限 |
| 凭证与日志 | 本机受控配置；日志同样脱敏 | 密钥管理服务或受控环境注入；结构化脱敏日志与轮换 |

开发模式可以放宽本地 Origin 和暂时开放的接口集合，不能放宽浏览器拿到平台 Secret/token、任意主机代理、任意路径代理或原样记录凭证的边界。

在 FastAPI 中可将 CORS 策略集中到应用装配处：

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def configure_cors(app: FastAPI, environment: str, allowed_origins: list[str]) -> None:
    if environment == "development":
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[],
            allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "X-App-Session"],
        )
        return

    if not allowed_origins:
        raise RuntimeError("Production CORS origins are required")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "X-App-Session"],
    )
```

## FastAPI 代理形状

以下示例固定代理“读取工作项详情”这一项平台能力。它展示路由边界、身份传递、超时与错误映射；请求体和返回字段以[获取工作项详情](../../meego-platform-facts/resources/docs/openapi/api/获取工作项详情.md)为准。

```python
from collections.abc import Awaitable, Callable
from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["work-items"])


class Session(BaseModel):
    user_key: str


class WorkItemQuery(BaseModel):
    work_item_ids: list[int] = Field(min_length=1, max_length=50)
    fields: list[str] | None = None


class ProjectClient:
    def __init__(self, get_plugin_token: Callable[[], Awaitable[str]]) -> None:
        self._get_plugin_token = get_plugin_token

    async def query_work_items(
        self,
        project_key: str,
        work_item_type_key: str,
        session: Session,
        request: WorkItemQuery,
    ) -> dict[str, object]:
        token = await self._get_plugin_token()
        url = (
            "https://project.feishu.cn/open_api/"
            f"{project_key}/work_item/{work_item_type_key}/query"
        )
        headers = {
            "Content-Type": "application/json",
            "X-Plugin-Token": token,
            "X-User-Key": session.user_key,
            "x-auth-mode": "1",
        }
        async with httpx.AsyncClient(timeout=httpx.Timeout(10.0)) as client:
            response = await client.post(url, headers=headers, json=request.model_dump(exclude_none=True))

        if response.status_code >= 500:
            raise HTTPException(status_code=502, detail="Feishu Project is unavailable")
        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail="Feishu Project rejected the request")

        payload = response.json()
        if not isinstance(payload, dict):
            raise HTTPException(status_code=502, detail="Feishu Project returned an invalid response")
        if payload.get("err_code", 0) != 0:
            raise HTTPException(status_code=502, detail="Feishu Project returned an API error")
        return payload


async def require_session() -> Session:
    raise HTTPException(status_code=501, detail="Implement application session validation")


async def get_project_client() -> ProjectClient:
    raise HTTPException(status_code=501, detail="Configure server-side token retrieval")


@router.post("/projects/{project_key}/work-item-types/{work_item_type_key}/query")
async def query_work_items(
    project_key: Annotated[str, Path(min_length=1)],
    work_item_type_key: Annotated[str, Path(min_length=1)],
    request: WorkItemQuery,
    session: Annotated[Session, Depends(require_session)],
    project_client: Annotated[ProjectClient, Depends(get_project_client)],
) -> dict[str, object]:
    return await project_client.query_work_items(
        project_key,
        work_item_type_key,
        session,
        request,
    )
```

`x-auth-mode: 1` 只适用于文档明确支持的严格读取接口；写接口、其他读取接口和用户凭证调用不能照抄。代理应将上游 token、`log_id`、完整响应和密钥保留在服务端日志边界，客户端只获得它需要的业务错误与结果。

## 长任务、回调与运行配置

长任务需分别保存本地关联 ID 与平台任务 ID，提供查询、重试、取消和过期清理；客户端轮询不能成为唯一状态机。上传、批量写入和 webhook 需要幂等键、输入上限和失败恢复策略。

FastAPI 工程使用 Pydantic 输入模型、异步 HTTP 客户端、显式超时、集中式异常处理和健康检查。部署版本、数据库、外部服务、镜像和拓扑由目标工程决定，不从其他插件案例复制。
