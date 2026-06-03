# AI Native 项目每日开发总结

## 2026-06-01 — 完整 UI 设计原型落地：HTML+CSS+JS 单文件实现

### 今日主题

**基于 `docs/1.html` 原型 + `UI设计方案.md` 设计宣言，将 AI Native 事务管理系统的 UI 完整呈现为纯前端设计稿，用于审视整体美学与交互合理性。**

### 核心成果

在单个 HTML 文件（`docs/1.html`）中实现完整的 UI 设计稿，无后端依赖，直接浏览器打开即可体验全部交互。

| 模块 | 状态 | 说明 |
|------|------|------|
| AI 核心感知区 | 增强 | 4状态Logo动画：待机呼吸（12次/分钟）→ 监听蓝波纹 → 处理莫奈流光环 → 成功回弹+绿色对勾 |
| 顶部导航栏 | 保持 | 汉堡菜单 ☰ / Dium品牌标 / 用户头像，毛玻璃 backdrop-filter |
| 底部输入栏 | 增强 | 胶囊输入框 + 发送按钮 ➤，focus时蓝色外光晕，Logo联动上移60px缩小30% |
| 左侧抽屉菜单 | 新增 | 用户头像区 + 5导航项(首页/时光轴/统计/标签/设置)，高亮激活态，badge计数 |
| 右侧时光轴 | 新增 | 按日期分组，条目含时间+类型标签+描述+金额，彩色圆点区分类型(账目/日程/收入/提醒)，7条示例数据 |
| 底部设置面板 | 新增 | 拖拽指示条+深色模式开关+4设置项，半屏Sheet弹出 |
| Toast 提示系统 | 新增 | 成功(绿)/错误(红)/信息(蓝)三种，顶部滑入，2.8秒自动消失 |
| 粒子弹射特效 | 新增 | 成功时蓝色粒子从Logo抛物线飞入菜单，暗示数据归档 |
| 手势系统 | 新增 | 左边缘右滑→侧边栏、左滑→时光轴、时光轴内右滑→关闭、长按Logo→按住说话 |
| 音效系统 | 保持 | Web Audio API合成 Apple Pay式清脆"叮"声 |

### 设计规范遵守情况

严格遵循用户提供的设计宣言：

| 原则 | 实现 |
|------|------|
| Voice First & Input First | 首页无边界画布，Logo是唯一视觉焦点，无引导文本 |
| 零阻力直接入库 | 无确认卡片，状态动效+音效完成异步入库 |
| 极简现代主义 | 浅色主题 #F4F6F8，大留白，环境阴影（无实线边框） |
| 手势驱动导航 | 干掉底部Tab栏，左右滑动呼出侧边栏/时光轴 |
| 4状态Logo动画 | 待机→监听→处理→成功，完整实现 |
| 色彩规范 | CSS变量体系：--bg-canvas #F4F6F8, --ai-blue #2563EB, --ai-green #10B981, --text-primary #1E2022 等 |
| 阴影规范 | 柔和发散阴影 box-shadow: 0 10px 40px rgba(0,0,0,0.04) |

### 关键技术实现

- **纯CSS动画**：5组 @keyframes（idleBreath / rippleOut / spinRing / successBounce / particleFlyCustom），无任何第三方库依赖
- **触屏手势**：touchstart/touchmove/touchend 三事件实现左右滑动呼出面板，带进度跟踪
- **Web Audio API**：合成880Hz→1320Hz双正弦波成功提示音
- **粒子轨迹**：JS动态创建粒子元素，CSS自定义属性 --dx/--dy 驱动贝塞尔曲线动画
- **深色模式**：CSS filter: invert(0.92) hue-rotate(180deg) 实验性实现

### 验证结果

桌面浏览器（Playwright MCP）测试通过：
- Logo点击 → 4状态动画流转 ✓
- 侧边栏打开/关闭 ✓
- 时光轴打开/关闭 ✓
- 设置面板弹出 ✓
- 文字输入+发送 → 处理动画+成功回弹+Toast ✓
- ESC键关闭所有面板 ✓
- 移动端 390×844 视口适配 ✓

### 设计感悟

这个纯UI设计稿验证了一个核心假设：**极简UI中，动效本身就是信息**。Logo的呼吸、波纹、流光旋转和成功回弹——这些动画在没有文字提示的情况下，完整地向用户传递了"AI正在工作"的状态。相比传统APP的表单+按钮+弹窗模式，这种无界面的交互方式确实更接近"软件理解用户"的AI Native理念。

---

## 2026-06-01（晚间）— React 前端 UI 重构：对齐设计原型 + 语音按钮

### 今日主题

**将 `frontend/` React 应用 UI 视觉效果完全对齐 `docs/ui_test/` 原型设计，并新增 InputArea 语音按钮作为第二语音入口。**

### 核心成果

完成 18 项前端 UI 改造任务，覆盖设计 Token 层、11 个组件重构、2 个新组件创建。

| 层级 | 文件 | 改动 |
|------|------|------|
| Token 层 | `tailwind.config.ts` | 16 个颜色 token 重建（暗紫→浅蓝体系），8 组动画 keyframes，3 级阴影体系，系统字体栈 |
| Token 层 | `src/index.css` | 全局 reset 样式，`body` 纯白背景 `#FFFFFF` |
| 外壳 | `App.tsx` | 全宽全高布局，毛玻璃顶栏，Split App/AppInner 模式（ToastProvider 包裹），TimelinePanel + SettingsSheet 集成 |
| 核心视觉 | `AICore.tsx` | 白色球体 + 内联 SVG Logo（7 路径动态 fill），4 状态动画（standby 呼吸/listening 波纹/processing 流光环/complete 对勾回弹） |
| 通知 | `Toast.tsx` | 顶部居中定位，白色底+彩色边框（success 绿/info 蓝/error 红），SVG 图标，2.8s 自动消失 |
| 侧边菜单 | `SideMenu.tsx` | 白色 280px 面板，头像头部，5 导航项（首页/时光轴/统计分析/标签管理/设置），蓝色激活态 |
| 输入框 | `InputArea.tsx` | 胶囊输入框，聚焦蓝色光晕，standby 态含**麦克风按钮**（左侧），点击触发语音监听态（波形+停止按钮） |
| 新增 | `TimelinePanel.tsx` | 右侧 340px 滑出面板，按日期分组，彩色圆点区分类型 |
| 新增 | `SettingsSheet.tsx` | 底部半屏弹出，深色模式开关（CSS filter 实现），4 设置项 |
| 卡片 | `ExpenseCard.tsx` / `ScheduleCard.tsx` | 白色卡片 + `shadow-ambient`，金色支出/蓝色日程 |
| 列表 | `TransactionList.tsx` | 时光轴风格，胶囊搜索框，彩色圆点+类型标签 |
| 图表 | `StatsChart.tsx` | 金色支出柱状图 |
| 气泡 | `ChatFlow.tsx` / `MessageBubble.tsx` | 蓝色用户气泡，白色 AI 气泡 |
| 页面 | `HomePage.tsx` | 空态仅 AICore，移除示例 chips |

### 语音按钮方案

在 InputArea standby 态胶囊左侧新增麦克风按钮：

- **视觉**：SVG 麦克风图标，18×18px，灰色 idle / hover 蓝色+浅蓝底
- **交互**：点击 → `onVoiceStart()` → `aiStatus='listening'` → InputArea 切换波形条
- **改动**：仅 `InputArea.tsx` 一个文件，Props 接口和 HomePage 均无需修改
- **与 AICore 兼容**：两者共享同一 `aiStatus` 状态，互不冲突

### 验证结果

| 验证项 | 结果 |
|--------|------|
| `tsc --noEmit` | 0 errors |
| 首页空态渲染 | 通过 |
| AI 状态机 (standby→listening→processing→complete) | 通过 |
| 语音按钮点击→listening 态切换 | 通过 |
| 信息发送→AI 回复气泡 | 通过 |
| 侧边菜单 5 项导航 | 通过 |
| TimelinePanel 右滑 | 通过 |
| SettingsSheet + 深色模式 | 通过 |
| ESC 关闭所有面板 | 通过 |
| Toast 通知 | 通过 |

### 关键设计决策

- **App/AppInner 模式**：解决 `useToast` 必须在 ToastProvider 内部使用的限制
- **内联 SVG Logo**：避免依赖 `vite-plugin-svgr`，同时支持动态 `fill` 颜色切换
- **纯 CSS 动画**：5 组 @keyframes 无第三方库依赖
- **深色模式**：CSS `filter: invert(0.92) hue-rotate(180deg)` 实验性实现

---

### 今日主题

**通过 `docs/测试用例-自然语言.md` 测试记录 + Playwright 浏览器自动化，系统性回归测试并修复 6 项核心问题。**

### 测试方法

使用 Playwright MCP 操控 `http://localhost:3000/`，逐一输入测试文档底部的 9 个已测用例，对比修复前后的 AI 响应和 UI 渲染，定位根因并修复。

### 发现的问题与修复

| # | 用例 | 修复前 | 修复后 | 根因 |
|---|------|--------|--------|------|
| 1 | 买了个东西，忘了多少钱了 | 创建 ¥0 支出记录 | 提示"请提供具体金额" | `_process_single` 不过滤 amount=0 的记录 |
| 2 | 把明天下午3点的会议取消 | 找到 3 条匹配，无法确定 | 成功删除目标会议 | 删除时间匹配仅支持日期不支持具体时间；别名过滤后仍多条时未取最近 |
| 3 | 删除最近一笔支出 | 无法确定要删除哪条 | 成功删除最近记录 | `execute_delete` 对空 match_criteria 无"最近"回退逻辑 |
| 4 | 把今天早上的咖啡改成20块 | 匹配到"两杯Starbucks"（错误） | 正确匹配到"咖啡" | 修改服务无别名过滤层，canonical 匹配结果过多时随机取 |
| 5 | 明天上午10点面试，打车去花了30 | 打车日期为今天（错误） | 打车日期为明天（正确） | `_extract_leading_date()` 不支持"明天/昨天/前天"等相对日期 |
| 6 | 前天买了书59，又买了笔8块，还充了话费30 | 后两笔日期为今天 | 全部日期为前天 | 同上，日期上下文传播遗漏 |

### 修复文件

| 文件 | 改动 |
|------|------|
| `backend/services/splitter_service.py` | `_extract_leading_date()` 新增相对日期匹配；新增 `_TRANSACTION_INDICATORS` 防止依赖从句被规则拆分；扩展 `_DATE_PATTERNS` 支持上周末/本月等 |
| `backend/services/delete_service.py` | 空 match_criteria 时取最近记录；新增第三层 aliases 过滤；过滤后仍多条取最近一条 |
| `backend/services/modify_service.py` | 新增第三层 aliases 过滤 canonical 匹配结果 |
| `backend/prompts/delete_parsing.py` | time 格式从 YYYY-MM-DD 扩展为 YYYY-MM-DD 或 YYYY-MM-DD HH:MM；更新示例为时间精确版本 |
| `backend/server.py` | expense 路径过滤 amount=0 条目；多段组合时过滤 chat intent groups/feedback |

### 核心设计改进

**1. 日期上下文传播增强**

旧行为：`_extract_leading_date()` 仅识别具体日期模式（"5月20日"、"上周五"），相对日期（"前天"、"昨天"）无法提取。

新行为：相对日期也作为 date_prefix 提取，拆分后自动补齐到无日期的分句：
```
"前天买了本书花了59，又买了支笔8块"
→ ["前天买了本书花了59", "前天 又买了支笔8块"]  # 后半句补齐日期
```

**2. 拆分器依赖从句检测**

新增 `_TRANSACTION_INDICATORS` 正则，检测分句是否包含交易关键词（金额单位、交易动词、日程关键词等）。

旧行为：`"买了个东西，忘了多少钱了"` → 逗号拆成 2 句，后者识别为 chat。

新行为："忘了多少钱了" 不含交易特征词 → 规则拆分失效 → 走 AI 拆分 → AI 识别为单一句子。

**3. 三重匹配过滤链（删除/修改服务）**

```
第一层：canonical 精确匹配（标准化 category + time）
  → 第二层：aliases 模糊匹配（无 canonical 结果时用别名搜索 note/title）
    → 第三层：aliases 过滤（canonical 结果过多时用别名缩小范围）
      → 最终兜底：取最近一条
```

### 验证结果

- 9 个已测用例逐一回归验证 ✓
- 拆分器单元测试通过 ✓
- TypeScript 零改动（后端-only 修复）

### 待解决问题（LLM 精度限制）

| 问题 | 现状 | 原因 |
|------|------|------|
| "昨天中午跟同事吃了个饭，一人50" 日期识别为今天 | ⚠️ 部分改善（不再拆成2条，但日期仍为今天） | qwen2.5:7b 对"昨天"时间词在复杂分句中的提取不够准确 |
| "今天一共花了不到100吧，吃饭六七十，买水十几块" 创建了记账条目 | ⚠️ 部分改善（chat 部分已过滤） | 模糊估算 vs 实际记账的语义边界，小模型难以区分 |
| "中午跟同事吃了个饭，一人50" → 日期上下文传递 | ⚠️ 部分改善 | 类似问题："中午"本身不是日期词，"昨天中午"才需要完整提取 |

这些剩余问题需要在升级模型（如 DeepSeek API）或优化 Expense Prompt 的 Few-shot 示例后进一步改善。

---

## 2026-05-23（上午）— Prompt 系统 A++ 升级：JSON Mode + Schema 校验 + Normalize 层

### 今日主题

**从"基础 Prompt"升级为"工程化可控的 AI 解析系统"**

基于 `docs/PROMPTS.md` 记录的四个核心痛点（JSON 不稳定、模型爱解释、多事务拆分错误、时间理解不稳定）和删除模块的匹配失败问题，实施 Prompt 系统全面升级。

### 升级方案：方案 A++

**核心理念**：系统是「围绕 LLM 的工程控制系统」，而不是「单纯调用大模型」。

```
LLM 调用 (JSON Mode)
  → Pydantic Schema 校验 (类型安全)
  → Normalize Layer (分类归一化)
  → Repository (持久化)
```

### 核心成果

| 类别 | 内容 | 文件 |
|------|------|------|
| JSON Mode | 所有 LLM 调用开启 `response_format: json_object` | `llm_service.py` |
| Pydantic 校验层 | Expense/Income/Schedule/Delete/Modify/Intent 6 组 Schema | `validators/schemas.py` |
| Normalize 层 | ~120 条分类归一化映射 (LLM 输出 → 标准分类) | `validators/normalizers.py` |
| Prompt 重写 | 7 个 Prompt 全部重写（JSON Schema 内嵌 + Few-shot） | `prompts/*.py` |
| 边界案例库 | 4 组 JSON 案例文件（支出/删除/修改/日程） | `prompts/fewshots/*.json` |
| 删除/修改增强 | canonical + aliases 双维度匹配 | `delete_service.py`, `modify_service.py` |
| 测试 | 47 个新增测试，总计 136 个 | `tests/test_prompts.py` |

### 一、JSON Mode 开启

**改动**：`llm_service.py` 一行代码

```python
payload["response_format"] = {"type": "json_object"}
```

**效果**：模型不再输出解释文本、Markdown 代码块、非法 JSON。

**连带改动**：所有列表型 Prompt 改为 `{"key": [...]}` 包裹格式（JSON Mode 要求输出 Object 而非 Array）。`json_utils.py` 新增 `list_key` 参数支持自动提取。

### 二、Pydantic Schema 校验层 (新增)

**文件**：`backend/validators/schemas.py`

| Schema | 关键约束 |
|--------|----------|
| `ExpenseItem` | amount >= 0 (0=模糊金额)，time 正则 `YYYY-MM-DD`，12 种分类枚举 |
| `IncomeItem` | amount >= 0，8 种分类（新增：退款/报销） |
| `ScheduleItem` | time 正则 `YYYY-MM-DD HH:MM`，8 种分类（新增：医疗/出行），5 种重复类型 |
| `DeleteOutput` | canonical + aliases + confirm + delete_all |
| `ModifyOutput` | canonical + aliases + updates |
| `IntentOutput` | intent 枚举 + query 扩展字段 |

**设计原则**：Schema 只负责结构验证，不负责语义理解。

### 三、Normalize 归一化层 (新增)

**文件**：`backend/validators/normalizers.py`

**核心理念**：AI 负责理解，Rule 负责标准化。

**映射表规模**：

| 类型 | 映射条数 | 典型示例 |
|------|----------|----------|
| 支出 | ~90 条 | "午饭"→"餐饮"、"打车"→"交通"、"衣服"→"服饰"、"奶茶"→"餐饮" |
| 收入 | ~20 条 | "发工资"→"工资"、"抢红包"→"红包"、"退款"→"退款"、"报销"→"报销" |
| 日程 | ~25 条 | "开会"→"会议"、"看病"→"医疗"、"聚餐"→"聚会"、"出差"→"出行" |

**设计原则**：Rule 只负责标准化，不负责推理。

### 四、Prompt 重写 (7 个)

每个 Prompt 遵循统一模板：**角色定义 → JSON Schema → 分类规则 → 时间规则 → Few-shot 示例**

| Prompt | 核心增强 |
|--------|----------|
| `delete_parsing` | Canonical Intent Object 模式：`match_criteria`（标准化）+ `aliases`（原始用词） |
| `modify_parsing` | 同上 Canonical 模式 |
| `expense_parsing` | 扩展 12 分类（新增服饰/饮品/日用）；区分完全模糊(几十块→0) vs 可估算(二十多→25)；退款识别排除 |
| `income_parsing` | 扩展 8 分类（新增退款/报销）；退款/卖闲置→收入 |
| `schedule_parsing` | 扩展 8 分类（新增医疗/出行）；时间默认 09:00；提醒默认提前30分钟 |
| `intent_detection` | 边界案例澄清：退款→income、去银行→schedule、取消→delete |
| `splitter_prompt` | JSON Mode 适配 |

### 五、删除/修改增强机制

**问题**：用户说"删掉昨天那笔午饭"，LLM 输出 `category="午饭"`，但数据库存的是"餐饮"，匹配失败。

**方案**：Canonical Intent Object

```json
{
  "target_type": "expense",
  "match_criteria": {"category": "餐饮", "time": "2026-05-22"},
  "aliases": ["午饭", "午餐", "吃饭"],
  "confirm": false,
  "delete_all": false
}
```

**匹配流程**：
1. canonical 精确匹配（标准化 category + time）→ 直接命中
2. aliases 模糊匹配（逐个别名搜索 note/title）→ 兜底命中
3. 返回候选列表 → 用户确认

### 六、边界案例库

**目录**：`backend/prompts/fewshots/`

| 文件 | 案例数 | 覆盖场景 |
|------|--------|----------|
| `expense_edge_cases.json` | 6 | AA制(每人金额)、完全模糊("几十块")、可估算("二十多")、退款误判、混合金额单位、多笔无标点 |
| `delete_edge_cases.json` | 5 | 分类不匹配、收入类删除、日程取消、模糊删除需确认、批量删除 |
| `modify_edge_cases.json` | 4 | 只改金额、改日程时间、改备注、改分类+金额 |
| `schedule_edge_cases.json` | 4 | 模糊时间("过两天")、去某地办事、每周重复、体检提醒提前 |

### 七、Bug 修复

| Bug | 修复 |
|-----|------|
| Pydantic 拒收 amount=0 → "买小吃花了二十多" 报错 | `gt=0` → `ge=0`；Prompt 区分"完全模糊(0)"和"可估算(25)" |
| 花括号在 `.format()` 中被误解析 | 所有 Prompt 中 JSON 花括号双写转义 `{{` `}}` |

### 八、需求实现状态

| 需求 | 旧状态 | 新状态 |
|------|--------|--------|
| JSON 稳定性 | ⚠️ 偶有解释文本 | ✅ JSON Mode 强制 |
| 分类匹配准确性 | ❌ "午饭"≠"餐饮" 导致删除失败 | ✅ Normalize + aliases 双维度 |
| Prompt 工程化 | ⚠️ 基础版 | ✅ Schema + Few-shot + 边界案例 |
| 测试覆盖 | 89个 | ✅ 136 个 |

### 九、设计原则遵守

- **Prompt Engineering First**：核心竞争力在 Prompt 设计，不在模型本身
- **AI 不直接写入数据库**：LLM → Schema → Normalize → Repository
- **工程可控优先**：每个模块职责单一、可独立测试
- **MVP First**：改动的 15 个文件全部在后端，前端/数据库/API路由零改动

### 待解决问题

1. **混合类型多事务**：Splitter 拆分后仍按独立子句走 intent 路由，同类事务可合并但混合类型各自独立处理（当前设计，非 bug）
2. **语音输入**：UI 预留完整，未接入 Web Speech API
3. **上下文记忆**：当前每次输入独立处理，无用户偏好学习

---

## 2026-05-22 — SQLite 持久化 + 测试体系搭建 + 工程健壮性修复

### 今日主题

**MVP 收尾：从"内存原型"升级为"可持久化的可测试系统"**

基于 `docs/今日计划.md` 的需求差距分析，完成 MVP 中缺失的 SQLite 存储、补充测试覆盖、修复多个工程健壮性问题。

### 核心成果

| 类别 | 内容 | 文件 |
|------|------|------|
| SQLite 持久化 | 新建 `database/` 模块，改造 repository 层 | `src/database/connection.py`、`src/repositories/entry_repository.py` |
| 测试体系 | 53 个测试，4 个文件 | `src/tests/test_time_utils.py`(13)、`test_json_utils.py`(15)、`test_entry_repository.py`(18)、`test_multi_transaction.py`(7) |
| 工程修复 | 5 项 | 路径导入、WAL 移除、前端错误提示、.env 缺失、config 清理 |

### 一、SQLite 持久化存储

**设计决策：单表方案**

三张独立表（expense/income/schedule）还是单表？选择单表方案，理由：
- 当前 `entry_repository` 已是统一列表 + type 字段的抽象
- 保持函数签名不变，server.py 和服务层零改动
- MVP 阶段数据量小，单表完全够用

**表结构：**
```sql
CREATE TABLE entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,          -- expense / income / schedule
    category TEXT,               -- 分类
    amount REAL,                 -- 金额
    time TEXT,                   -- 日期
    title TEXT,                  -- 日程标题
    remind_time TEXT,            -- 提醒时间
    repeat_type TEXT DEFAULT 'none',
    source TEXT,                 -- 收入来源
    note TEXT                    -- 备注
);
```

**关键点：**
- 数据库文件 `data/app.db`，启动时自动建表（`init_db()` 幂等）
- `data/` 目录已加入 `.gitignore`
- `entry_repository.py` 的 6 个公开函数签名不变，内部从列表操作改为 SQL 操作

### 二、测试体系搭建

| 文件 | 数量 | 覆盖范围 |
|------|------|----------|
| `test_time_utils.py` | 13 | 今天/昨天/前天/本周/本月/最近N天/全部/默认回退 |
| `test_json_utils.py` | 15 | 数组提取/markdown清洗/单对象包装/必填字段校验/非法输入/中文混杂 |
| `test_entry_repository.py` | 18 | CRUD 全流程/范围过滤/更新(含无效字段过滤)/模糊匹配(含类型过滤)/大小写不敏感 |
| `test_multi_transaction.py` | 7 | mock LLM 验证完整链路：意图识别→解析→JSON 提取，含多事务拆分和混合类型边界 |

**设计要点：**
- `test_entry_repository` 使用 `tmp_path` + `monkeypatch` 确保每个测试独立临时数据库，测试间无状态残留
- `test_multi_transaction` 使用 `unittest.mock.patch` 完全隔离 LLM 依赖，无需 API Key 即可运行
- 发现并记录了 V2 已知限制：混合类型输入（支出+日程）当前路由到单一解析器

### 三、工程健壮性修复（共 5 项）

| # | 问题 | 修复 |
|---|------|------|
| 1 | `python src/server.py` 报 `ModuleNotFoundError: No module named 'src'` | `server.py` 顶部添加 `sys.path.insert(0, ...)` 将项目根目录加入搜索路径（`main.py` 已有） |
| 2 | 测试在 Windows 上卡住（KeyboardInterrupt） | 移除 SQLite WAL 模式 — 单用户项目不需要并发读写，WAL 锁文件在 Windows tmp_path 快速切换下冲突 |
| 3 | Web 端对话报"连接失败" | 根因是 `.env` 缺失导致 LLM 调用失败→500；从 `.env.example` 创建 `.env`；同时修复前端 `useChat.ts` catch 块吞掉真实错误的问题 |
| 4 | 前端错误提示永远显示"连接失败" | `useChat.ts:72` 改为 `catch(e)` 并展示 `e.message` |
| 5 | `config.py` 残留 `src/web/.env` 旧路径 | 删除旧结构的 `load_dotenv` 调用 |

### 四、需求实现状态更新

基于 2026-05-21 总结的状态对照表，今日变化：

| 需求 | 旧状态 | 新状态 |
|------|--------|--------|
| 6. 数据存储（SQLite） | ❌ 未实现 | ✅ 已实现 |
| 测试体系 | ❌ 未实现 | ✅ 53 个测试，0.39s 跑完 |

**当前 MVP 完成度：6/7 功能需求全部实现**（仅日程分类字段 `⚠️ 部分实现` 保持不变）

### 五、设计原则遵守情况

- **工程可控优先**：SQLite 单表方案比三表方案更简单，repository 函数签名不变
- **MVP First**：Controller 层拆分延后、语音输入延后、混合类型多事务延后至 V2
- **Prompt Engineering First**：Prompt 本次未改，多事务拆分能力已验证可满足 V1 需求
- **学习导向**：每个设计决策（单表 vs 三表、WAL 取舍、mock vs 真实 LLM 测试）都记录了判断原因

### 六、待解决问题

1. **日程分类字段**：PROJECT_DESIGN.md 定义了工作/学习/聚会/生日/会议，但数据库和 Prompt 均未实现该字段
2. **混合类型多事务**（如"午饭35，明天开会"）：当前 intent 路由到单一解析器，需要 V2 的多意图拆分能力
3. **语音输入**：UI 和动画已就绪，Web Speech API 未接入

### 七、下午场：混合类型多事务支持

**目标**：从"同类多事务可拆分"升级为"混合类型多事务可拆分"。

**问题**：旧管道 `意图检测→单个解析器` 一次只能处理一种意图。输入"午饭35，明天下午3点开会"只会路由到 expense 解析器，日程部分丢失。

**方案**：在意图检测前插入**拆分器（Splitter）**，两阶段拆分（规则优先 + AI 兜底），每个子句独立走完整管道。

**新增文件：**

| 文件 | 用途 |
|------|------|
| `src/prompts/splitter_prompt.py` | AI 拆分 Prompt（兜底用） |
| `src/services/splitter_service.py` | 拆分器：规则层（标点/连接词）→ AI 层（兜底） |

**修改文件：**

| 文件 | 改动 |
|------|------|
| `src/server.py` | 抽取 `_process_single()` 辅助函数；`/api/chat` 调用拆分器，多段循环处理，组装 groups 响应 |
| `src/services/feedback_service.py` | 新增 `format_mixed_feedback()` 汇总多意图反馈 |
| `client/src/types/index.ts` | 新增 `IntentGroup` 接口，`ChatResponse` 增加 `groups` 可选字段 |
| `client/src/hooks/useChat.ts` | `Message` 增加 `groups` 字段；`send()` 解析 groups 并合并 records |
| `client/src/components/MessageBubble.tsx` | 修复 `intent === 'record'` dead code bug；新增 groups 分组展示 |

**验证结果：**

| 测试用例 | 结果 |
|----------|------|
| `"午饭35"` | 单句回归 ✓ |
| `"午饭35，打车20"` | 同类拆分 → 2 expense ✓ |
| `"午饭35，明天下午3点开会"` | 混合拆分 → 1 expense + 1 schedule ✓ |
| `"工资15000，打车20"` | 混合拆分 → 1 income + 1 expense ✓ |
| 现有 53 个测试 | 全部通过 ✓ |

**设计原则遵守：**
- **Prompt Engineering First**：拆分 Prompt 职责单一，遵循现有 Prompt 模板规范
- **MVP First**：不动现有意图检测和解析器，改动面最小
- **工程可控优先**：每个子句独立处理，出问题容易定位；规则层覆盖 80%+ 场景
- **向后兼容**：单意图时 `groups` 只有一个元素，旧前端逻辑不受影响

**响应格式扩展（向后兼容）：**
```json
{
  "intent": "expense",
  "success": true,
  "feedback": "已处理以下 2 类事务：...",
  "records": [...],
  "groups": [
    {"intent": "expense", "records": [...], "total": 35, "count": 1, "feedback": "..."},
    {"intent": "schedule", "records": [...], "total": 0, "count": 1, "feedback": "..."}
  ]
}
```

**待解决问题更新：**
- 混合类型多事务 → ✅ 已解决
- 日程分类字段 → 仍待实现
- 语音输入 → 仍待实现

### 八、自然语言测试用例文档

**目标**：为 Web 端手动测试 AI 反馈效果建立系统化的测试用例库。

**动机**：当前测试覆盖了工具函数和存储层的正确性，但缺少对 AI 模型实际输出质量的系统性人工验证手段。需要一个方便复制粘贴、按意图分类的用例集来辅助 Prompt 调优。

**新增文件：**

| 文件 | 用途 |
|------|------|
| `docs/测试用例-自然语言.md` | 按 9 类意图组织的约 60 条自然语言测试用例 |

**文档结构：**

| 分类 | 用例数 | 覆盖重点 |
|------|--------|----------|
| 基础记账 | 8 | 简单金额、口语化、带时间修饰 |
| 收入记录 | 7 | 工资、红包、兼职、理财 |
| 日程创建 | 8 | 具体时间、周期、提醒 |
| 同类拆分 | 5 | 2-5 笔同类支出/收入 |
| 混合拆分 | 6 | 支出+日程、收入+支出等组合 |
| 查询 | 9 | 今日/本周/本月/分类/日程 |
| 修改 | 5 | 改金额/分类/时间/备注 |
| 删除 | 5 | 按描述删除、按时间删除 |
| 边界测试 | 11 | 空输入、非事务、歧义、长文本、中英混杂 |

**设计要点：**
- ⭐ 标注约 20 条回归必测用例，改完 Prompt 优先跑
- 底部预留测试记录表格（日期/用例/结果/备注）
- 无期望输出——手动测试时自行判断 AI 反馈质量

### 九、晚间场：Web 端测试与 6 项 Bug 修复

**目标**：通过 Playwright 浏览器自动化 + `测试用例-自然语言.md` 对 Web 端进行系统性测试，发现并修复所有 Bug。

**测试方法**：用 Playwright MCP 工具操控 `http://localhost:3000/`，输入测试用例并检查 AI 响应和 UI 渲染。

**发现的 6 个 Bug 及修复：**

| Bug | 严重度 | 现象 | 根因 | 修复 |
|-----|--------|------|------|------|
| A | High | 日程卡片显示 `¥undefined`，颜色错误（红色） | `ExpenseCard` 无条件渲染金额；`ExpenseRecord.type` 缺 `schedule` | type 补充 `schedule`，amount 改 optional；日程显示标题+时间 |
| B | High | 多事务记录重复渲染（flat + groups 各一次） | `MessageBubble` 两个区块非互斥；`useChat` 多意图分支同时设置 records 和 groups | groups 存在时跳过 flat 区块；多意图分支不设 records |
| C | Medium | `ExpenseRecord.type` 联合缺 `schedule`，类型系统与实际数据不符 | types 定义遗漏 | type 补充 `'schedule'`，amount 改 optional |
| D | High | 删除日程返回 500，前端无任何反馈 | `parse_delete` LLM 调用异常未捕获 | server.py delete/modify 路径加 try-catch；useChat 显式处理所有 intent |
| E | Medium | 修改匹配过于宽泛（5条"午饭"无法定位） | `find_matching_entries` 无 ORDER BY | 加 `ORDER BY time DESC, id DESC`，多匹配时取最近一条自动更新 |
| F | Medium | 查询"花了多少"包含收入 ¥15000 | query 路径不按 type 过滤 | `wants_expense_only()` 检测"花了/支出/消费"关键词，过滤到 expense |

**修改文件：**

| 文件 | Bug |
|------|-----|
| `client/src/types/index.ts` | A, C |
| `client/src/components/ExpenseCard.tsx` | A |
| `client/src/components/MessageBubble.tsx` | B |
| `client/src/hooks/useChat.ts` | A, B, D |
| `client/src/pages/HomePage.tsx` | C (amount optional 适配) |
| `src/server.py` | D, F |
| `src/services/query_service.py` | F |
| `src/services/modify_service.py` | E |
| `src/repositories/entry_repository.py` | E |

**验证结果：**
- 53 个 Python 测试全部通过 ✓
- TypeScript `tsc --noEmit` 零错误 ✓
- 浏览器中 6 个 Bug 逐一回归验证 ✓
- 零 Console Error ✓

**待解决问题更新：**
- 日程分类字段 → 仍待实现（晚间场完成）
- 语音输入 → 仍待实现
- MessageBubble intent 匹配 bug → ✅ 已修复（Bug A）
- 混合类型多事务 → ✅ 已完成
- ~~修改/删除模糊匹配精度~~ → ✅ 已修复（Bug E）

### 十、日程分类字段实现

**目标**：补全 MVP 中最后一个缺失字段——日程分类（工作/学习/聚会/生日/会议）。

**修改文件：**

| 文件 | 改动 |
|------|------|
| `src/models/entry.py` | `ScheduleEntry` 新增 `category: str = "其他"` 字段 |
| `src/prompts/schedule_parsing.py` | Prompt 新增规则 #2：分类提取（含 5 组分类判断示例） |
| `src/services/feedback_service.py` | `format_schedule_feedback()` 新增 `category_icons` 映射（💼📚🎉🎂📋📅），单条/多条均展示分类图标 |

**设计要点：**
- 数据库 `entries` 表已有 `category` TEXT 列（单表共享），无需 schema 变更
- `entry_repository.py` 已通用处理 `category` 字段，无需改动
- Prompt 分类判断示例覆盖常见表述（"开会"→会议、"上课"→学习、"聚餐"→聚会 等）

### 十一、日程 UI 分离（Schedule UI Separation）

**目标**：解决 Web 端收支记录和日程使用同一种 UI 设计的问题。日程缺少金额字段，在 TransactionList 中显示 `¥undefined`，在 HomePage 最近记录中显示异常图标。

**核心问题**：`ExpenseCard` 同时渲染三种类型，`TransactionList` 和 `HomePage` 只处理 expense/income 图标和金额，schedule 记录在列表视图中严重异常。

**方案**：创建专用 `ScheduleCard` 组件，在所有渲染点按类型分支。

**新增文件：**

| 文件 | 用途 |
|------|------|
| `client/src/components/ScheduleCard.tsx` | 日程专用卡片：分类图标+标题+时间+提醒时间+重复标签+备注 |

**修改文件：**

| 文件 | 改动 |
|------|------|
| `client/src/types/index.ts` | 新增 `remind_time?`、`repeat_type?` 字段 |
| `client/src/components/ExpenseCard.tsx` | 移除 `isSchedule` 分支，仅处理 expense/income |
| `client/src/components/TransactionList.tsx` | 三态图标（收入+/支出-/日程日历）；日程显示标题+时间而非金额；搜索包含 title |
| `client/src/pages/HomePage.tsx` | 最近记录三态图标+标题/金额条件渲染 |
| `client/src/components/MessageBubble.tsx` | 单意图/混合分组/查询结果均按 `rec.type` 选择卡片组件；查询摘要不再对纯日程显示 ¥0 |

**ScheduleCard 布局：**

| 行 | 内容 |
|----|------|
| 1 | 分类图标+文字（💼工作 📚学习 🎉聚会 🎂生日 📋会议 📅其他）indigo 徽章 + 删除按钮 |
| 2 | 标题（主字体，indigo 色） |
| 3 | 时间（日历图标） |
| 4 | 提醒时间（铃铛图标，仅当与时间不同时显示） |
| 5 | 重复标签（每天/每周/每月/每年，仅当非 none 时显示） |
| 6 | 备注 |

**验证结果：**
- TypeScript `tsc --noEmit` 零错误 ✓
- 支出输入 "午饭35元" → ExpenseCard `餐饮` 徽章 + `¥35` ✓
- 日程输入 "明天下午3点开会" → ScheduleCard `📋 会议` + 标题 + 时间 + 提醒 ✓
- 混合输入 "午饭35元，明晚开会" → 两组分别渲染正确卡片 ✓
- 记录页面 → 日历图标 + 标题 + 日期，无 ¥undefined ✓
- 查询结果 → 日程行显示标题+分类+日期 ✓

**待解决问题更新：**
- 日程分类字段 → ✅ 已实现
- 日程 UI 分离 → ✅ 已完成（ScheduleCard 独立渲染）
- 语音输入 → 仍待实现

---

## 2026-05-21 — AI OS 风格 UI 全面重构

### 今日主题

**从"记账工具 APP"到"AI Operating System"的视觉升级**

基于 `docs/UI设计方案.md` 的设计理念和 `ui-ux-pro-max` 设计智能工具，将项目前端 UI 从浅色多 Tab 记账工具风格全面重构为暗色 AI Native OS 沉浸式体验。

### 核心设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 色彩方案 | 柔和暗色 + AI Purple (#6366F1) | AI 产品高级感更强，ChatGPT/Claude 风格 |
| 字体系统 | DM Sans + Noto Sans SC + JetBrains Mono | 温暖人文 + 中文支持 + 技术数据展示 |
| 导航模式 | 侧边抽屉菜单（☰）替代底部 Tab | 低频功能不适合底部导航；核心是单输入流 |
| 视觉灵魂 | 中央 AI 核心球（3层动画 + 4状态） | 让用户感觉"AI 在等待我"，不是"我在操作软件" |
| 导航演进 | 菜单 + 快捷入口 → 未来纯单页 | 保留可达性，为后期沉浸式单页做准备 |

### AI 核心球设计（项目视觉核心）

**3 层架构：**
- **Layer 1**：中央光晕渐变球（radial-gradient + blur + AI Purple 光晕）
- **Layer 2**：呼吸圆环（scale 1→1.03，3-4s 缓慢周期）
- **Layer 3**：状态波纹（交互时向外扩散）

**4 状态系统：**
- 待机 → 监听中 → 处理中 → 完成

### 技术实现

| 项目 | 数量 |
|------|------|
| 新建组件 | 2（AICore、SideMenu） |
| 重构文件 | 4（App.tsx、HomePage.tsx、tailwind.config.ts、index.css） |
| 暗色适配 | 7（ChatFlow、MessageBubble、InputArea、ExpenseCard、TransactionList、StatsChart、Toast） |
| 页面重命名 | 2（RecordsPage → 最近事务、StatsPage → AI 洞察） |
| 移除组件 | 2（Header、DailySummary） |
| 新增动画 | 5（breathe、breathe-fast、ripple、glow-pulse、gradient-flow） |
| 新增颜色 token | 11 |

### 侧边菜单结构

```
┌──────────────────────┐
│   👤 NYCKEL          │  ← 用户信息
│   AI Native Assistant│
├──────────────────────┤
│ ✨ AI 对话           │  ← 核心功能
│ 🕘 最近事务          │
│ 📊 AI 洞察           │
├──────────────────────┤
│ 🧠 AI 设置           │  ← 后期扩展
│ 🎯 分类与习惯        │
│ 🔔 提醒与通知        │
├──────────────────────┤
│ 🌙 深色模式          │  ← 系统
│ 🌐 Language          │
│ ⚙ 设置               │
└──────────────────────┘
```

### 与设计文档的对应

- **PROJECT_DESIGN.md** 第七章"技术选型"：前端已从 HTML/CSS/JS 升级为 React + TypeScript + TailwindCSS
- **REQUIREMENTS.md** 非功能性需求第4条"可扩展性"：UI 架构为语音输入预留了完整交互流程（AI 核心球监听状态）
- **PROMPTS.md**：Prompt 模块本次未修改，保持现有 7 意图解析能力
- **UI设计方案.md**：完全按照"AI Native Voice OS"设计理念实施

### 需求实现状态对照

基于 `docs/REQUIREMENTS.md` MVP 需求范围，当前实现状态如下：

**功能需求：**

| 需求 | 状态 | 说明 |
|------|------|------|
| 1. 用户输入模块（文本输入、中文自然语言、口语化、模糊时间） | ✅ 已实现 | Web + CLI 双入口 |
| 2. AI意图识别（记账/收入/日程/查询/修改/删除 共7种） | ✅ 已实现 | 单模型多 Prompt 工作流 |
| 3. 信息提取（记账字段：amount/category/time/note/type，日程字段：title/time/remind_time/repeat_type/note） | ✅ 已实现 | LLM 驱动 JSON 结构化提取 |
| 4. 分类模块（记账8类、日程分类） | ⚠️ 部分实现 | 记账有8类（餐饮/交通/购物/娱乐/居住/通讯/医疗/教育），日程未实现分类字段 |
| 5. 时间解析（今天/明天/后天/下周三/每周一…） | ✅ 已实现 | LLM 时间上下文注入 + 规则日期范围解析 |
| 6. 数据存储（SQLite） | ❌ 未实现 | 当前为内存列表存储，服务重启数据丢失 |
| 7. AI反馈（自然语言反馈处理结果） | ✅ 已实现 | 带 emoji 分类图标的自然语言回复 |

**非功能需求：**

| 需求 | 状态 | 说明 |
|------|------|------|
| 响应速度 ≤ 3秒 | ✅ 已实现 | DeepSeek API 响应稳定 |
| JSON 稳定性（结构化输出 + Schema 验证） | ✅ 已实现 | `json_utils` 校验 + markdown 代码块清洗 |
| 中文支持 | ✅ 已实现 | 全链路中文自然语言 |
| 可扩展性（语音输入预留） | ⚠️ 部分实现 | UI 已预留语音按钮和 AI 核心球动画，Web Speech API 未接入 |

**MVP 范围外（按计划暂不实现）：** 语音输入、推送通知、云同步、多用户系统、真正多Agent ✅ 符合预期

### 待解决问题

1. **MessageBubble 中 intent 不匹配**：前端检查 `intent === 'record'` 但后端返回的是 `'expense'`/`'income'`/`'schedule'`，导致 ExpenseCard 在聊天消息中永不会渲染。已在本次重构中注意到但未修复——需要后续专门处理。

2. **语音功能**：AI 核心球已预留完整的监听/处理状态动画，但实际语音 API（Web Speech API）尚未接入。

### 下一步计划

1. 修复 MessageBubble intent 匹配问题
2. 接入 Web Speech API 实现基础语音输入
3. 实现 AI 核心球状态与实际语音监听/处理的双向绑定
4. 完善后端 SQLite 持久化存储
5. 添加深色/浅色模式切换功能（菜单已预留入口）

---

## 总结

今天的 UI 重构是项目从"功能型 MVP"走向"AI Native 产品"的关键一步。通过暗色 AI OS 风格设计 + AI 核心球视觉元素 + 侧边菜单导航，项目的产品气质已经从"记账工具"转变为"AI 事务操作系统"。

核心原则保持不变：
- 所有 AI 输出必须结构化（JSON + Schema 验证）
- Prompt Engineering First（核心竞争力在 Prompt 设计）
- MVP 优先（可运行、可演示、可测试）
