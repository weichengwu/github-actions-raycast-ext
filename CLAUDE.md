# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 重要约束

**全程必须使用中文与用户进行交互。** 所有回复、说明、问题和讨论都应使用中文。

## 项目概述

这是一个用于管理跨仓库 GitHub Actions 的 Raycast 扩展。专注于高频开发者工作流：查看最近的工作流运行（支持快速操作：重新运行、取消）以及触发 `workflow_dispatch` 工作流。

## 命令

所有命令在 `github-actions/` 目录下运行：

```bash
npm run dev          # 启动 Raycast 开发模式
npm run lint         # 使用 @raycast/eslint-config 进行代码检查
npm run fix-lint     # 自动修复代码检查问题
npm run build        # 构建扩展
npm run publish      # 发布到 Raycast Store
```

本项目没有测试套件。

## 架构

扩展在 `package.json` 中定义了两个 Raycast 命令：

- **Actions Hub** (`src/actions-hub.tsx`) — 列出最近的工作流运行，支持仓库选择器、最近目标和快速操作（重新运行、取消、在浏览器中打开）
- **Dispatch Workflow** (`src/dispatch-workflow.tsx`) — 渲染 `DispatchWorkflowForm` 组件的薄包装器

### 核心层

- **`src/services/github-client.ts`** — `GitHubClient` 类，封装 GitHub REST API。所有 API 调用通过私有 `request<T>()` 方法处理认证头和错误映射（401/403/404/422）。工作流调度输入通过获取并解析仓库内容 API 中的 YAML 工作流文件来发现。
- **`src/types/github.ts`** — 所有领域类型（`GitHubWorkflowRun`、`GitHubRepository`、`DispatchableWorkflow`、`WorkflowDispatchInput` 等）
- **`src/lib/storage.ts`** — 通过 Raycast `LocalStorage` 持久化最近的仓库和最近的工作流目标（每项最多 8 个）
- **`src/lib/errors.ts`** — `GitHubRequestError` 类和 `getErrorMessage()` 辅助函数
- **`src/lib/preferences.ts`** — 从 Raycast 扩展偏好设置中读取 GitHub PAT
- **`src/lib/format.ts`** — `formatRelativeDateTime()` 和 `formatDuration()` 工具函数
- **`src/components/dispatch-workflow-form.tsx`** — 完整的调度表单，支持动态工作流输入渲染（支持 string、choice、boolean、environment 输入类型）
- **`src/components/run-detail.tsx`** — 基于 Markdown 的轻量级运行详情视图，显示作业信息

### 数据获取模式

全程使用 `@raycast/utils` 中的 `useCachedPromise`。数据通过返回的 `revalidate` 函数进行缓存和重新验证。变更操作（重新运行、取消、调度）显示动画 toast，调用 API，然后重新验证受影响的数据。

### 认证

需要在 Raycast 扩展偏好设置中配置 GitHub 个人访问令牌。支持细粒度和经典 PAT。令牌通过 `getGitHubToken()` 读取并传递给 `GitHubClient` 构造函数。

### 关键依赖

- `@raycast/api` 和 `@raycast/utils` — Raycast SDK 和钩子（`useCachedPromise` 等）
- `yaml` — 解析工作流 YAML 文件以发现 `workflow_dispatch` 输入

### 规范驱动开发

`openspec/` 目录包含功能的设计提案和规范。添加新功能时，请检查 `openspec/specs/` 中的现有规范和 `openspec/changes/` 中的进行中或已归档的变更提案。
