# GitHub Actions Raycast Extension - Project Plan

## 1. 项目定位

这是一个 **面向个人/小团队高频工作流的 GitHub Actions Raycast 工具**。

目标不是做成 GitHub Actions 的全功能控制台，而是把最常用、最影响效率的操作压缩到 Raycast 里，让用户少开网页、少点几层菜单、少等几次加载。

当前更适合的产品方向是：

- 优先服务作者自己的高频工作流
- 优先做“快、准、常用”的操作
- 优先减少上下文切换
- 不追求 GitHub Web UI 的完整替代

一句话版本：**把 GitHub Actions 里最常做的 20% 操作，做成 Raycast 里的快刀。**

## 2. 当前已完成范围

MVP 已经完成两条主线：

### 2.1 Actions Hub

- 查看近期 workflow runs
- 展示 repository、workflow、branch、status、event、actor、started time / duration
- 支持 rerun workflow
- 支持 rerun failed jobs
- 支持 cancel run
- 支持 open in browser / copy URL
- 支持轻量 run details

### 2.2 Dispatch Workflow

- 选择 repository
- 选择支持 `workflow_dispatch` 的 workflow
- 输入 ref
- 动态渲染 workflow inputs
- 提交 dispatch

### 2.3 基础能力

- GitHub PAT 认证
- 权限失败与常见 API 错误映射
- Recent repositories / workflow targets 本地持久化
- GitHub Actions 相关类型定义与 API client 分层

## 3. 已明确的边界

当前阶段**不应该**主动扩展到以下方向：

- secrets / variables 管理
- organization / enterprise 控制面
- permissions / policy 管理
- self-hosted runners / runner groups
- billing / usage dashboards
- 完整日志平台或制品管理后台

这些方向不是没价值，而是会把产品从“高频效率工具”拉向“平台型控制台”，范围会迅速失控。

## 4. 产品判断

### 4.1 谁是用户

当前核心用户就是：

- 经常看 CI/CD 状态的开发者
- 经常 rerun / cancel / dispatch workflow 的人
- 同时维护多个仓库，但不想反复切到 GitHub 网页的人

### 4.2 用户真正要完成的事

用户不是想“管理 GitHub Actions”。

用户真正想做的是：

1. **我现在有哪些 run 出问题了？**
2. **我能不能立刻重跑、取消、或者重新触发一个 workflow？**
3. **我不用打开网页，能不能就把这个动作做完？**

所以路线图要围绕“更快定位、更多高频动作、更少网页跳转”展开。

## 5. 下一阶段总策略

下一阶段不建议横向加很多功能。

建议做三件事：

1. **把 Actions Hub 变成更强的工作台**
2. **把 workflow target 选择变得更快**
3. **补上完成一次操作闭环时最缺的反馈能力**

这比去做新的大模块更值。

## 6. 推荐优先级

## P0 - 立刻推进

### P0.1 Actions Hub 过滤与搜索

这是最该先做的。

建议能力：

- 按 branch 过滤 runs
- 按 workflow name 过滤 runs
- 按 repository 过滤 runs
- 按 status / conclusion 过滤 runs

为什么优先：

- 它直接增强现有主命令，而不是再开一条新命令线
- 很符合“个人高频工具”的定位
- 技术上复用现在的 Actions Hub 和 GitHub client，风险低
- 用户价值直接，打开命令后更快找到目标 run

**结论：这是下一步最推荐的功能。**

### P0.2 Recent Targets / Favorites 强化

在现有 recent persistence 基础上，升级成更强的目标访问能力：

- pin 常用 repository
- pin 常用 workflow
- dispatch 时优先展示 favorites + recents
- Actions Hub 支持一键切换到最近/收藏仓库

为什么优先：

- 很适合个人效率工具
- 能显著减少每次查找目标的时间
- 和当前 storage 结构天然衔接

### P0.3 Run 完成反馈

补上“动作发出后，结果怎么知道”的最后一公里。

建议先做轻量版本：

- dispatch 成功后可跳转查看新 run
- rerun / cancel 后刷新当前列表
- 支持手动 refresh 明确反馈
- 为后续通知能力预留结构

## P1 - 下一阶段

### P1.1 Workflows 视图

增加一个围绕 repository 的 workflows 列表视图：

- 查看仓库有哪些 workflows
- 展示是否支持 dispatch
- 展示基础状态与最近运行信息
- 从 workflow 直接进入 dispatch 或查看最近 runs

价值：

- 从“run 中心”扩展到“workflow 中心”
- 更适合当仓库 workflow 数量很多时使用

### P1.2 Run Detail 增强

当前 detail 已经够轻量，但还不够支持判断。

下一步可以补：

- 展示 job conclusion 更清晰的分组
- 展示失败 job 的重点信息
- 展示 step 粒度摘要，而不是完整日志

注意：

不要直接滑向“完整日志查看器”。
那会迅速变重。

### P1.3 Artifact 快捷访问

如果你的日常 workflow 经常产出构建物，这会很值：

- 查看 run artifacts
- 快速打开 artifact 链接
- 必要时支持下载

这是一个很好的“高频但不扩面过头”的功能。

## P2 - 有明确需求再做

### P2.1 Run 监控 / 通知

适合以下场景：

- dispatch 后等结果
- rerun 后不想一直手动刷新
- 构建时间长，但只关心成功/失败

可以做成：

- watch 当前 run
- 完成时 toast 通知
- 失败时给快捷动作

这个功能很有吸引力，但建议在过滤、favorites、workflow 视图更扎实之后再做。

### P2.2 Script Command / 外部集成

如果后面你想把它进一步嵌入自己的日常工具链，可以考虑：

- 输出某个 repo 的 CI 状态
- 触发常用 workflow 的快捷入口
- 给别的脚本或 Raycast command 复用

这个方向对个人效率工具很自然，但不是当下第一优先。

## 7. 暂不建议推进的功能

下面这些不是不能做，而是现在做会稀释产品：

### 7.1 完整日志查看器

原因：

- 实现成本高
- UI 复杂
- 很容易变成“在 Raycast 里重做 GitHub 页面”

更合理的做法是先做“定位失败 job / step 的轻量摘要”，真的要深看时跳 GitHub。

### 7.2 平台型管理能力

比如：

- runner 管理
- org 级权限管理
- secrets / variables 批量管理

这类功能更像平台后台，不像个人高频工具。

## 8. 建议的 Roadmap

### Phase 1 - 把现有 MVP 做锋利

目标：更快找到目标，更快完成动作。

- [ ] Actions Hub 过滤与搜索
- [ ] Favorites / pinned targets
- [ ] 动作后的列表刷新与更清晰反馈

### Phase 2 - 扩展到 workflow 视角

目标：从“处理 run”升级为“围绕 workflow 工作”。

- [ ] Workflows 视图
- [ ] 从 workflow 直接 dispatch / 看最近 runs
- [ ] Run detail 增强

### Phase 3 - 补通知与闭环能力

目标：用户发出动作后，不用一直盯着页面。

- [ ] Watch run / 状态通知
- [ ] Artifact 快捷访问
- [ ] 更好的失败后续动作

## 9. 一个明确建议

如果只选一个功能现在继续做，建议是：

## **先做 Actions Hub 过滤与搜索**

原因很简单：

- 它提升的是主入口
- 它每天都能被用到
- 它几乎不改变产品边界
- 它最符合“个人效率工具”的定位
- 它能让后面的 workflow 视图和通知功能更有基础

换句话说，这不是“看起来更强”的功能。

这是**真的更常用**的功能。

## 10. 后续工作建议

建议接下来按这个顺序推进：

1. 为 `Actions Hub 过滤与搜索` 写一份新的 OpenSpec proposal
2. 明确过滤维度的优先级，branch / workflow / repository / status 哪些先做
3. 实现最小可用版本
4. 在真实日常工作流里用一周
5. 再决定是继续做 favorites，还是转做 workflows 视图

别急着把功能铺满。

先把主命令做成真正顺手的工具。这个阶段最值钱的不是“更多页面”，是“更少摩擦”。
