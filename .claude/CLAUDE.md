# 钦会 (Dium) - AI Native事务管理系统 - CLAUDE.md

# 一、项目定位

项目名称：钦会 (Dium)

本项目是一个：

# AI Native 自然语言事务管理系统

核心理念：

传统APP：
用户适应软件

AI Native APP：
软件理解用户

用户通过：
- 自然语言输入
- 语音输入（后期）

即可自动完成：
- AI记账
- AI日程
- AI提醒
- AI查询
- AI事务管理

本项目目标不是聊天机器人。

而是：

# 自然语言 → 结构化事务操作

---

# 二、项目阶段

当前阶段：

# MVP（最小可行产品）

优先实现：

1. 自然语言输入
2. AI事务解析
3. JSON结构化输出
4. SQLite存储
5. 基础事务展示
6. Web原型验证

后期扩展：
- 语音输入
- 移动端APP
- AI统计分析
- 上下文记忆
- 多事务协同处理

暂不追求：
- 真正多Agent
- 微服务
- 分布式系统
- 企业级架构
- 超复杂UI
- 复杂状态管理

---

# 三、核心开发原则

## 1. AI Native First

优先思考：

“如何让用户一句话完成操作”

而不是：
- 表单
- 多层点击
- 复杂菜单

---

## 2. Prompt Engineering First

本项目核心竞争力：

不是模型本身。

而是：
- Prompt设计
- Workflow设计
- JSON稳定性
- 时间解析能力
- 结构化输出能力

---

## 3. MVP First

永远优先：
- 可运行
- 可演示
- 可测试
- 可迭代

避免：
- 过度设计
- 提前优化
- 无意义抽象

---

## 4. 工程可控优先

优先：
- 简单清晰
- 可维护
- 易调试

避免：
- 黑盒框架
- 复杂Agent编排
- 过度封装

---

## 5. 学习导向

本项目同时是：
- AI工程学习项目
- 软件工程实践项目
- GitHub作品集项目

因此：

每次开发：
- 必须理解原理
- 必须记录设计原因
- 必须解释关键决策
- 必须总结潜在优化方向

---

# 四、技术栈规范

## 前端

当前：
- React
- TypeScript
- Vite
- TailwindCSS

后期：
- Next.js
- uni-app（移动端）

---

## 后端

当前核心：
- Python
- Flask

后期可升级：
- FastAPI

---

## AI层

本地开发：
- Ollama
- qwen2.5:7b

线上阶段：
- DeepSeek API
- 通义千问 API

---

## 数据库

当前：
- SQLite

后期：
- PostgreSQL

---

# 五、推荐项目架构

项目采用：

# 分层架构（Layered Architecture）

推荐结构：

src/

├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── prompts/
├── utils/
├── types/
├── config/
├── tests/

---

# 六、模块职责

## controllers

负责：
- 接收请求
- 参数校验
- 返回响应

禁止：
- 编写核心业务逻辑

---

## services

负责：
- 核心业务逻辑
- Prompt Workflow调度
- AI事务解析

---

## repositories

负责：
- 数据库操作
- 数据持久化

---

## prompts

负责：
- Prompt模板管理
- Prompt版本管理
- JSON Schema定义

---

## utils

负责：
- 时间解析
- JSON处理
- 通用工具函数

---

# 七、AI工程规范

## 1. Prompt必须模块化

禁止：
- 巨型Prompt直接写在代码里

必须：
- 单独Prompt文件
- 单一职责
- 可复用
- 可版本管理

---

## 2. 所有AI输出必须结构化

优先：
- JSON
- 类型安全

禁止：
- 自然语言直接驱动数据库

---

## 3. 所有AI输出必须校验

必须：
- JSON解析
- Schema验证
- 错误处理
- 默认值补全

禁止：
- 直接相信模型输出

---

## 4. Prompt设计规范

所有Prompt必须：
- 明确角色
- 明确任务
- 明确输出格式
- 明确JSON Schema
- 禁止开放式回答

---

## 5. 温度控制

事务类AI：

默认：

temperature = 0

优先保证：
- 稳定性
- 可预测性
- JSON可靠性

---

# 八、UI / UX规范

本项目采用：

# AI Native UI

核心原则：

- 浅色模式优先
- 沉浸式首页
- 减少按钮
- 减少导航层级
- 语音优先
- ChatGPT式输入体验

---

## 首页设计

首页核心：

# AI核心球（AI Orb）

特性：
- 呼吸动画
- 状态反馈
- 语音交互入口

---

## 导航规范

采用：
- 侧边抽屉菜单

避免：
- 传统底部Tab栏主导

低频页面：
- 统计
- 记录
- 设置

通过菜单进入。

---

# 九、TypeScript规范

必须开启：

```json
{
  "strict": true
}