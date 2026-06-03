# Frontend UI 重构设计文档

**日期**: 2026-06-01
**状态**: 已完成
**范围**: `frontend/` 目录，React 18 + TypeScript + Tailwind CSS 3

---

## 一、设计目标

将 `frontend/` 的 UI 视觉效果完全对齐 `docs/ui_test/` 中的原型设计，同时保持所有功能逻辑不变。

### 核心约束
- 只改 JSX/CSS 类名，不改 React 逻辑（state/hooks/事件处理/API 调用）
- 使用 `logo/logo2.svg` 作为品牌 Logo
- 主页背景必须是纯白 `#FFFFFF`

---

## 二、设计 Token 体系

### 颜色系统

| Token | 旧值（暗紫系） | 新值（浅色系） |
|-------|---------------|---------------|
| `primary` | `#1E1B4B` | `#1E2022` |
| `accent` | `#8B5CF6` (紫) | `#2563EB` (蓝) |
| `muted` | `#8B82A6` | `#8A94A6` |
| `border` | `#E8E5F2` | `#E8ECF1` |
| `bg-secondary` | `#F8F7FC` | `#F4F6F8` |
| `expense` | `#EF4444` (红) | `#F59E0B` (金) |
| `income` | `#10B981` | 保持 |
| `schedule` | — | `#2563EB` (新增) |
| `reminder` | — | `#8B5CF6` (新增) |

### 字体系统
从 `DM Sans + Noto Sans SC` 改为系统字体栈：`-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Helvetica Neue, Noto Sans SC, Arial`

### 阴影体系
- `shadow-ambient`: `0 1px 3px rgba(30,32,34,0.04), 0 4px 12px rgba(30,32,34,0.04)` — 卡片基础投影
- `shadow-ambient-md`: 中等深度 — hover 态
- `shadow-ambient-lg`: 深度投影 — Logo 球体

### 动画系统（8 组新增）
`idleBreath`, `rippleOut`, `spinRing`, `successBounce`, `toastIn`, `toastOut`, `particleFly`, `sheetUp/Down`

---

## 三、组件架构

### 三层改造策略

```
Layer 1: Token 层 (2 files)
  ├── tailwind.config.ts — 完整设计 Token 替换
  └── src/index.css — 全局样式重置

Layer 2: 组件层 (11 files)
  ├── App.tsx — 全宽布局 + 毛玻璃顶栏
  ├── AICore.tsx — 白色球体 + Logo + 4 状态动画
  ├── Toast.tsx — 顶部居中 + 彩色边框
  ├── SideMenu.tsx — 白色 280px 面板
  ├── InputArea.tsx — 胶囊输入框
  ├── HomePage.tsx — 移除示例 chips
  ├── ChatFlow.tsx / MessageBubble.tsx — 蓝色气泡
  ├── ExpenseCard.tsx / ScheduleCard.tsx — 白色卡片
  ├── TransactionList.tsx — 时光轴风格
  └── StatsChart.tsx — 金色支出柱

Layer 3: 新增组件 (2 files)
  ├── TimelinePanel.tsx — 右侧滑出面板
  └── SettingsSheet.tsx — 底部设置面板
```

---

## 四、关键设计决策

### 4.1 AICore 状态机

| 状态 | 视觉表现 | 触发条件 |
|------|---------|---------|
| `standby` | Logo 深灰色 + 5s 呼吸缩放 | 默认 |
| `listening` | Logo 蓝色 + 3 层波纹扩散 | 点击 Logo / 语音触发 |
| `processing` | Logo 蓝色 + 旋转锥形渐变环 | API 请求中 |
| `complete` | Logo 绿色 + 对勾 + 回弹 | API 返回成功 |

Logo 颜色通过计算属性动态控制：`#1E2022` (待机) → `#2563EB` (监听/处理) → `#10B981` (完成)

### 4.2 Logo 集成方式

采用内联 SVG 方式渲染 `logo2.svg`（7 条路径），用 `fill` 属性动态控制颜色。避免了对 `vite-plugin-svgr` 的依赖，同时支持状态驱动的颜色切换。

### 4.3 导航架构

```
App
├── SideMenu (左滑)
│   ├── 首页 → setActivePage('home')
│   ├── 时光轴 → setTimelineOpen(true)  [TimelinePanel 右滑]
│   ├── 统计分析 → setActivePage('stats')
│   ├── 标签管理 → showToast('即将推出')
│   └── 设置 → setSettingsOpen(true)  [SettingsSheet 底部弹出]
├── 页面切换 (home/stats/records) — 保持原有逻辑
└── 顶栏头像 → setSettingsOpen(true)
```

### 4.4 InputArea 简化

移除语音/文字模式切换，改为单模式胶囊输入框：
- 待机态：白色圆角输入框 + placeholder "键入事务..."
- 监听态：音频波形 + 红色停止按钮
- 聚焦态：蓝色微光晕（`box-shadow: 0 0 0 3px rgba(37,99,235,0.08)`）

---

## 五、验证结果

| 验证项 | 结果 |
|--------|------|
| `tsc --noEmit` | 0 errors |
| React 控制台错误 | 0 (仅 API 500，后端未运行) |
| 首页空态渲染 | 通过 |
| AI 状态机 (standby→listening) | 通过 |
| 信息发送→AI 回复气泡 | 通过 |
| 侧边菜单 5 项导航 | 通过 |
| TimelinePanel 右滑 | 通过 |
| SettingsSheet + 深色模式 | 通过 |
| ESC 关闭所有面板 | 通过 |
| Toast 通知 | 通过 |

---

## 六、未改动部分

- `src/api/index.ts` — API 客户端
- `src/hooks/useChat.ts` — 聊天状态管理
- `src/types/index.ts` — 类型定义
- 所有后端文件
- 路由/导航核心逻辑（`activePage` 状态管理）
