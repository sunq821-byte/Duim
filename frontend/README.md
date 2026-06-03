# 钦会 Dium — AI Native 事务管理系统

## 项目定位

**AI Native 自然语言事务管理系统**。核心理念：软件理解用户，而非用户适应软件。

用户通过自然语言输入（文字/语音），即可自动完成 AI 记账、AI 日程、AI 提醒、AI 查询等事务管理。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript 5.6 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 3 |
| 后端 | Python Flask (端口 5000) |

## 项目结构

```
frontend/
├── src/
│   ├── App.tsx                    # 应用外壳：全宽布局 + 毛玻璃顶栏 + 页面路由
│   ├── main.tsx                   # 入口
│   ├── index.css                  # 全局样式 + Tailwind 指令
│   ├── api/
│   │   └── index.ts               # API 客户端（chat / entries / stats / delete）
│   ├── hooks/
│   │   └── useChat.ts             # 聊天状态管理 + 消息收发
│   ├── types/
│   │   └── index.ts               # TypeScript 类型定义
│   ├── components/
│   │   ├── AICore.tsx             # AI 核心球：白色球体 + 品牌 Logo + 4 状态动画
│   │   ├── SideMenu.tsx           # 左侧抽屉菜单（280px）
│   │   ├── TimelinePanel.tsx      # 右侧时光轴面板（340px）
│   │   ├── SettingsSheet.tsx      # 底部设置面板
│   │   ├── InputArea.tsx          # 胶囊输入框（含语音按钮）
│   │   ├── Toast.tsx              # Toast 通知（顶部居中）
│   │   ├── ChatFlow.tsx           # 消息列表
│   │   ├── MessageBubble.tsx      # 消息气泡（用户蓝 / AI 白）
│   │   ├── ExpenseCard.tsx        # 支出/收入卡片
│   │   ├── ScheduleCard.tsx       # 日程卡片
│   │   ├── TransactionList.tsx    # 事务列表（时光轴风格）
│   │   └── StatsChart.tsx         # 统计图表
│   └── pages/
│       ├── HomePage.tsx           # 首页：AI 核心球 + 输入栏
│       ├── RecordsPage.tsx        # 时光轴页
│       └── StatsPage.tsx          # 统计分析页
├── tailwind.config.ts             # 设计 Token 体系
├── vite.config.ts                 # Vite 配置（含 API 代理）
├── package.json
└── README.md
```

## 设计系统

### 色彩

| Token | 值 | 用途 |
|-------|----|------|
| `primary` | `#1E2022` | 主文字 |
| `accent` | `#2563EB` | 蓝色强调（按钮/链接/AI 状态） |
| `surface` | `#FFFFFF` | 卡片/面板背景 |
| `muted` | `#8A94A6` | 辅助文字 |
| `border` | `#E8ECF1` | 分割线 |
| `expense` | `#F59E0B` | 支出（金色） |
| `income` | `#10B981` | 收入（绿色） |
| `schedule` | `#2563EB` | 日程（蓝色） |
| `reminder` | `#8B5CF6` | 提醒（紫色） |

### AI 核心球 4 状态

| 状态 | 视觉 | 触发 |
|------|------|------|
| `standby` | 石墨色 Logo + 5s 呼吸缩放 | 默认 |
| `listening` | 蓝色 Logo + 3 层波纹扩散 | 点击 Logo |
| `processing` | 蓝色 Logo + 旋转锥形渐变环 | API 请求中 |
| `complete` | 绿色 Logo + 对勾回弹 | 请求成功 |

### 动画

`idleBreath` · `rippleOut` · `spinRing` · `successBounce` · `toastIn/Out` · `particleFly` · `sheetUp/Down` · `menuSlideIn/Out`

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 3000）
npm run dev

# 类型检查
npx tsc --noEmit

# 生产构建
npm run build
```

启动前请确保后端 Flask 服务已在 `localhost:5000` 运行。开发模式下 Vite 会自动代理 `/api` 请求到后端。

## 导航

- **汉堡菜单 ☰** → 左侧抽屉（首页 / 时光轴 / 统计分析 / 标签管理 / 设置）
- **时光轴** → 右侧滑出面板，按日期分组展示所有事务
- **头像 👤** → 底部设置面板（深色模式 / 语音 / 数据 / 通知 / 关于）
- **ESC** → 关闭所有打开的面板

## 设计原型

UI 设计基于 `docs/ui_test/` 中的纯 HTML+CSS+JS 原型，完整设计文档见：
- `docs/UI设计方案.md` — 设计宣言 v2.3
- `docs/superpowers/specs/2026-06-01-frontend-ui-refactor-design.md` — 前端重构设计文档
- `docs/DAILY_SUMMARY.md` — 每日开发总结

## License

Private — AI Native 个人学习项目
