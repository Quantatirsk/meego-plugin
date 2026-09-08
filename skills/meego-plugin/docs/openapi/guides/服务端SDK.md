# 服务端 SDK

飞书项目提供 Go 和 Java 服务端 SDK。SDK 将 OpenAPI 请求、响应封装为结构化对象，并管理插件访问凭证的生命周期。插件权限、空间授权与接口业务限制仍需按对应文档配置。

本篇记录该官方页面列出的 SDK 版本和安装方法，不将页面版本表述为当前仓库的最新发布版本。

<a id="4220c2f3"></a>

## SDK 与运行环境

| 语言 | 官方仓库 | 快照标注版本 | 最低运行环境 |
| --- | --- | --- | --- |
| Go | [project-oapi-sdk-golang](https://github.com/larksuite/project-oapi-sdk-golang) | `v1.0.28` | Go `1.15` |
| Java | [project-oapi-sdk-java](https://github.com/larksuite/project-oapi-sdk-java) | `1.0.30` | Java `1.8` |

以上两个版本不共享版本号。本文原始页面只列出一条 Java `1.0.22` 的更新记录，不能据此还原后续版本的全部变更；其他版本说明需查阅对应官方仓库。

<a id="145f4d48"></a>
<a id="348da8e8"></a>

## 安装 Go SDK

原文提供的安装命令是：

```bash
go get -u github.com/larksuite/project-oapi-sdk-golang
```

该命令没有固定版本。若要按本地文档快照复现，可显式指定表中版本：

```bash
go get github.com/larksuite/project-oapi-sdk-golang@v1.0.28
```

实际项目应按自身依赖策略选择版本；上面的固定版本命令是依据快照补充的写法，本文没有执行依赖安装或验证远端包可用性。

<a id="8b566745"></a>

## 安装 Java SDK

Java SDK 通过 Maven 引入，需要先让 Maven 能访问官方制品仓库，再在项目中声明依赖。

### 配置制品仓库

将下面的 profile 合并到现有 `settings.xml` 的 `profiles` 中。示例给出完整外层结构用于说明位置；已有配置不应直接被整段替换。

```xml
<settings>
  <profiles>
    <profile>
      <id>lark-project</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <repositories>
        <repository>
          <id>lark-project</id>
          <url>https://artifacts-cn-beijing.volces.com/repository/meego/</url>
          <releases>
            <enabled>true</enabled>
          </releases>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
        </repository>
      </repositories>
    </profile>
  </profiles>
</settings>
```

这里保留原文的 profile ID、默认激活方式，以及 release、snapshot 仓库开关。

### 声明项目依赖

在项目 `pom.xml` 的 `dependencies` 中加入：

```xml
<dependency>
  <groupId>com.larksuite.project</groupId>
  <artifactId>oapi-sdk</artifactId>
  <version>1.0.30</version>
</dependency>
```

原文使用 `{version}` 占位符；这里填入该页版本表中的 `1.0.30`。升级时应同时核对 SDK 发布记录和项目兼容性。

<a id="6ff11065"></a>

## 原文收录的更新记录

### Java SDK 1.0.22

这一版本增强了工作项与 WBS 能力：

| 变更 | 具体内容 |
| --- | --- |
| 复合字段按组更新 | 新增 `updateCompoundFieldValue`，支持增加、删除或修改复合字段的组数据 |
| WBS 查询参数 | 增加 `need_union_deliverable`、`need_schedule_table_agg` 和 `expand` |
| WBS 响应 | `WbsViewResponse` 增加关系链实体、路径等字段，返回更完整的 WBS 信息 |

## 相关文档

- [OpenAPI 概述](OpenAPI概述.md)：请求约定、接入流程和限流。
- [获取访问凭证](获取访问凭证.md)：核对 SDK 所管理的凭证类型及用户授权流程。
- [权限管理](权限管理.md)：确认开发和正式环境的访问条件。
- [完整目录](../INDEX.md)：查找 SDK 所调用接口的业务定义。

更新时间：2026-09-07
官方 URL：https://project.feishu.cn/b/helpcenter/1p8d7djs/3ajzsqlv
