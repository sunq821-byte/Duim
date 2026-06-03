# AI Native 自然语言事务管理系统

> 让软件理解用户，而不是让用户适应软件。
>
> **AI Operating System** — 一个沉浸式 AI 事务助手，不是传统记账工具。

## 项目简介

基于 LLM API 的 AI Native 事务管理系统。用户通过自然语言输入即可完成记账、收入记录、日程创建、查询、修改和删除，无需表单和按钮。

### 设计理念

| 传统 APP | AI Native APP |
|----------|---------------|
| 用户适应软件 | 软件理解用户 |
| 表单 + 点击 + 菜单 | 自然语言 + 语音 |
| 工具菜单系统 | AI Operating System |
| 功能树 | 一句话驱动 |

### 核心能力

| 功能 | 示例输入 | 效果 |
|------|---------|------|
| AI 记账 | `今天午饭35` | 自动识别支出 ¥35，分类"餐饮" |
| AI 收入 | `工资到账15000` | 自动识别收入 ¥15000 |
| AI 日程 | `明天下午3点开会` | 自动创建日程提醒 |
| 同类多事务 | `今天午饭35，晚上打车20` | 同时记录两笔支出 |
| 混合类型多事务 | `午饭35，明天下午3点开会` | 同时记录支出+日程 |
| 查询 | `今天花了多少` | 汇总今日消费 |
| 修改 | `把昨天午饭改成50` | 模糊匹配并更新记录 |
| 删除 | `删除昨天午饭记录` | 模糊匹配并删除记录 |

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 18 + TypeScript + TailwindCSS 3 + Vite 6 |
| 后端 | Flask (Python) |
| AI | DeepSeek API / Ollama（可切换） |
| 存储 | SQLite |
| 设计 | AI-Native UI（浅色模式优先 + AI Purple + 语音优先） |
| 字体 | DM Sans + Noto Sans SC + JetBrains Mono |

## 架构图

```
┌─────────────────────────────────────────────┐
│                  用户输入                      │
│          自然语言 / 语音（后期）                │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│              Frontend (React)                │
│  Vite Dev Server :3000  →  proxy /api :5000 │
├─────────────────────────────────────────────┤
│  AICore.tsx   ChatFlow.tsx   InputArea.tsx  │
│  Pages: HomePage / RecordsPage / StatsPage  │
└─────────────────┬───────────────────────────┘
                  │  HTTP /api/*
                  ▼
┌─────────────────────────────────────────────┐
│              Backend (Flask)                  │
│  Flask Server :5000                          │
├─────────────────────────────────────────────┤
│  server.py  ← 路由层                         │
│  services/  ← 业务逻辑 + LLM Workflow        │
│  prompts/   ← Prompt 模板管理                │
│  repositories/ ← SQLite CRUD                 │
│  utils/     ← JSON解析 / 时间解析            │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│              LLM API                         │
│  DeepSeek / Ollama（通过环境变量切换）        │
└─────────────────────────────────────────────┘
```

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- LLM API Key（DeepSeek 或 Ollama 本地）

### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入你的 API Key
```

### 2. 安装依赖

```bash
# 后端
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 前端
cd frontend
npm install
cd ..
```

### 3. 启动服务

```bash
# 方式一：分别启动（推荐开发时使用）
# 终端 1 — 后端
python backend/server.py     # → http://localhost:5000

# 终端 2 — 前端
cd frontend 
npm run dev   # → http://localhost:3000
npm run dev -- --host

# 方式二：CLI 模式（无需前端）
python backend/main.py
```

浏览器访问 **http://localhost:3000** 即可使用。

### 4. 运行测试

```bash
npm test
# 或
python -m pytest backend/tests/ -v
```

## 项目结构

```
AI_Native/
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── api/index.ts        # API 调用层
│   │   ├── components/         # 通用组件
│   │   │   ├── AICore.tsx      # AI 核心球（3层动画 + 4状态）
│   │   │   ├── ChatFlow.tsx    # 消息流
│   │   │   ├── InputArea.tsx   # ChatGPT 风格输入框
│   │   │   ├── SideMenu.tsx    # 侧边抽屉菜单
│   │   │   ├── ExpenseCard.tsx # 收支记录卡片
│   │   │   ├── ScheduleCard.tsx# 日程记录卡片
│   │   │   ├── StatsChart.tsx  # 统计图表
│   │   │   ├── Toast.tsx       # Toast 通知
│   │   │   ├── MessageBubble.tsx   # 消息气泡
│   │   │   ├── SettingsSheet.tsx   # 设置面板
│   │   │   ├── TimelinePanel.tsx   # 时间线面板
│   │   │   └── TransactionList.tsx # 事务列表
│   │   ├── hooks/useChat.ts    # 聊天状态管理
│   │   ├── pages/              # 页面组件
│   │   │   ├── HomePage.tsx    # 首页（AI核心球 + 聊天）
│   │   │   ├── RecordsPage.tsx # 最近事务
│   │   │   └── StatsPage.tsx   # AI 洞察
│   │   ├── types/index.ts      # TypeScript 类型定义
│   │   ├── index.css           # TailwindCSS + 设计 Token
│   │   └── main.tsx            # React 入口
│   ├── vite.config.ts          # Vite 配置 + /api 代理
│   └── package.json
├── backend/                    # Flask 后端
│   ├── server.py               # Flask API 入口
│   ├── main.py                 # CLI 入口
│   ├── config.py               # 环境配置
│   ├── services/               # 核心业务逻辑
│   │   ├── llm_service.py      # LLM API 调用
│   │   ├── intent_service.py   # 意图识别（7 意图）
│   │   ├── extract_service.py  # 结构化提取（5 解析器）
│   │   ├── splitter_service.py # 文本拆分（规则+AI两阶段）
│   │   ├── query_service.py    # 自然语言查询
│   │   ├── feedback_service.py # 自然语言反馈生成
│   │   ├── modify_service.py   # 修改执行
│   │   └── delete_service.py   # 删除执行
│   ├── prompts/                # Prompt 模板（模块化）
│   │   ├── intent_detection.py  # 意图识别（7 意图 + 边界案例）
│   │   ├── expense_parsing.py   # 支出解析（12 分类 + Few-shot）
│   │   ├── income_parsing.py    # 收入解析（8 分类 + 退款/报销）
│   │   ├── schedule_parsing.py  # 日程解析（8 分类 + 周期/提醒）
│   │   ├── modify_parsing.py    # 修改解析（Canonical + aliases）
│   │   ├── delete_parsing.py    # 删除解析（Canonical Intent Object）
│   │   ├── splitter_prompt.py   # 文本拆分（JSON Mode）
│   │   └── fewshots/            # 边界案例库（JSON 文件）
│   ├── validators/              # 校验与归一化
│   │   ├── schemas.py           # Pydantic Schema 定义
│   │   └── normalizers.py       # 分类归一化映射表（~120 条）
│   ├── repositories/           # 数据持久化层
│   │   └── entry_repository.py # SQLite CRUD
│   ├── database/               # 数据库连接
│   │   └── connection.py       # SQLite 连接管理
│   ├── models/                 # 数据模型
│   │   └── entry.py            # Entry 数据类
│   ├── utils/                  # 工具函数
│   │   ├── json_utils.py       # JSON 提取与校验
│   │   └── time_utils.py       # 时间解析
│   └── tests/                  # 测试（136 个）
│       ├── test_time_utils.py   # 时间解析（25）
│       ├── test_json_utils.py   # JSON 解析（15）
│       ├── test_entry_repository.py # SQLite CRUD（18）
│       ├── test_multi_transaction.py # 集成测试（7）
│       ├── test_splitter_service.py # Splitter 服务（13）
│       └── test_prompts.py      # Prompt Schema + Normalize（47）
├── scripts/                    # 辅助脚本
│   └── fill_docx.py            # 文档自动填充
├── .env.example                # 环境变量模板
├── requirements.txt            # Python 依赖
├── package.json                # 根级统一脚本
└── README.md
```

> **注意：** `data/`（数据库文件）、`docs/`（文档）、`ppt/`（演示文稿）以及 `.claude/`、`.vscode/` 等工具配置目录已加入 `.gitignore`，不会提交到仓库。

## Prompt Workflow (方案 A++)

```
用户输入（自然语言）
  → split_text()              # 拆分器（规则优先 + AI 兜底）
  → detect_intent()           # AI 意图识别（7 意图）
  → parse_xxx()               # AI 结构化提取（DeepSeek JSON Mode）
  → Pydantic Schema 校验       # 类型安全 + 字段完整性
  → Normalize Layer           # 分类归一化（LLM输出→标准分类）
  → execute_xxx() / add_entries()  # canonical + aliases 双维度匹配
  → format_feedback()         # 自然语言反馈
  → 返回 JSON / CLI 展示
```

### 核心设计原则

- **JSON Mode 强制开启** — `response_format: {"type": "json_object"}`，杜绝模型输出解释文本和 Markdown 包裹
- **Pydantic Schema 校验** — 所有 LLM 输出经过类型校验、字段完整性检查、默认值补全
- **Normalize Layer** — 分类归一化映射表（~120条），LLM 负责理解，Rule 负责标准化。如 "午饭"→"餐饮"、"打车"→"交通"
- **Canonical Intent Object** — 删除/修改使用 `canonical + aliases` 双维度匹配：先精确匹配标准化字段，再模糊搜索原始用词
- **temperature = 0** — 事务类 AI 优先保证稳定性和可预测性
- **Prompt 模块化** — 一个 Prompt 一个文件，单一职责，Few-shot 边界案例库独立管理
- **AI 不直接写入数据库** — LLM → Schema → Normalize → Repository

## UI 设计系统

### 色彩（浅色模式优先）

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-primary` | `#0f0f1a` | 最深背景 |
| `--bg-secondary` | `#1a1a2e` | 卡片/表面 |
| `--accent` | `#6366F1` | AI Purple 主色 |
| `--success` | `#10B981` | 完成状态/收入 |
| `--expense` | `#ef4444` | 支出 |
| `--income` | `#10B981` | 收入 |

### AI 核心球状态系统

| 状态 | 效果 | 用户感受 |
|------|------|----------|
| 待机 | 微呼吸 + 微光晕（3-4s周期） | AI 在等待我 |
| 监听中 | 外圈波纹扩散 + 光晕增强 | AI 正在听 |
| 处理中 | 渐变流动 + 轻旋转 + 呼吸加快 | AI 正在思考 |
| 完成 | 绿色闪烁 + 缩放回归 | AI 完成了 |

## API 文档

### POST /api/chat

主端点，处理所有自然语言输入。

```json
// 请求
{ "message": "今天午饭35" }

// 支出
{
  "intent": "expense",
  "success": true,
  "feedback": "已记录：🍜 餐饮支出 ¥35 ｜2026-05-21（午饭）",
  "records": [{ "id": 1, "type": "expense", "category": "餐饮", "amount": 35, ... }],
  "total": 35,
  "count": 1
}
```

支持的 intent：`expense` | `income` | `schedule` | `query` | `modify` | `delete` | `chat`

混合类型多事务响应包含 `groups` 字段，每个 group 独立携带 intent + records + feedback。

### 其他端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/entries` | GET | 获取所有记录 |
| `/api/stats` | GET | 本月统计（支出/收入分开） |
| `/api/delete` | POST | `{ "id": 1 }` 按 ID 删除 |

## 测试

```bash
npm test
# 或
python -m pytest backend/tests/ -v
```

测试覆盖：时间解析（25）、JSON 解析（15）、SQLite CRUD（18）、多事务拆分集成（7）、Splitter 服务（13）、Prompt Schema 与 Normalize（47），共 136 个。

### 手动回归测试

`docs/测试用例-自然语言.md`（本地文档，未提交到仓库）包含约 60 条自然语言测试用例，覆盖 9 类意图。⭐ 标注约 20 条回归必测用例。

最近修复（2026-05-23）：
- **日期上下文传递**：相对日期（前天/昨天/明天）在拆分后正确传播到后续分句
- **¥0 金额拒绝**：模糊金额（"忘了多少钱"）不再创建无效记录
- **删除增强**：支持"最近一笔"查询；别名过滤 + 时间精确匹配
- **修改匹配增强**：别名过滤防止匹配到不相关记录
- **拆分器改进**：依赖从句（"忘了多少钱了"）不再被逗号错误拆分

## 项目阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| V1 MVP | 文本输入、AI 记账、AI 日程、JSON 输出 | ✅ 完成 |
| V2 | 多事务拆分、修改删除、查询统计、Web UI、SQLite | ✅ 完成 |
| V3 | AI OS 风格 UI、AI 核心球、语音输入 | 🔄 进行中 |
| V4 | AI 预算分析、Agent 记忆、用户习惯学习 | 📋 计划中 |

## 后续方向

- 语音输入（Whisper API / 浏览器 SpeechRecognition）
- 移动端 APP（uni-app / React Native）
- AI 统计分析（消费趋势、预算建议）
- 上下文记忆（用户偏好学习）
- 多事务协同处理

## 许可

MIT
