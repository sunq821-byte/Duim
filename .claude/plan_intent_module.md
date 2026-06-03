# AI 意图识别模块 — 模块化升级方案

## Context

当前 `src/main.py` 是 310 行单体文件，`detect_intent()` 仅支持 3 种意图（record/query/chat）。REQUIREMENTS.md 第2节要求支持 6 种意图：记账、收入、日程、查询、修改、删除。CLAUDE.md 要求分层架构（services/repositories/prompts/utils）。

采用「先模块化、再扩展」策略：Phase 1 拆文件但零行为变更，Phase 2-6 逐步添加新功能。

---

## 目标架构

```
src/
  config.py                  # DEEPSEEK_URL, DEEPSEEK_KEY, MODEL
  prompts/                   # Prompt 模板（每个意图独立文件）
    __init__.py
    intent_detection.py
    expense_parsing.py
    income_parsing.py
    schedule_parsing.py
    modify_parsing.py
    delete_parsing.py
  models/
    __init__.py
    entry.py                 # Dataclass: ExpenseEntry, IncomeEntry, ScheduleEntry
  repositories/
    __init__.py
    entry_repository.py      # 统一存储: entries[], CRUD, fuzzy find
  services/
    __init__.py
    llm_service.py           # call_llm()
    intent_service.py        # detect_intent() → 7 意图
    extract_service.py       # parse_expense/income/schedule/modify/delete()
    query_service.py         # answer_query()
    feedback_service.py      # format_feedback() 各类型
    modify_service.py        # execute_modify()
    delete_service.py        # execute_delete()
  utils/
    __init__.py
    json_utils.py            # extract_json_list(), extract_json_object()
    time_utils.py            # parse_date_range()
  main.py                    # CLI 入口（薄壳）
  web/server.py              # Flask（更新 imports，不变路由逻辑）
```

---

## Phase 1：模块化（零行为变更）

**目标**：将 main.py 拆成模块，CLI 和 Flask API 行为完全不变。

### Step 1.1：创建 config.py

从 main.py L11-15 搬出 DEEPSEEK_URL / DEEPSEEK_KEY / MODEL。

### Step 1.2：创建 models/entry.py

定义 dataclass：
- `ExpenseEntry(type, category, amount, time, note, id?)`
- `IncomeEntry(type, category, amount, time, note, source, id?)`
- `ScheduleEntry(type, title, time, remind_time, repeat_type, note, id?)`

Phase 1 仅 ExpenseEntry 实际使用，其余预定义。

### Step 1.3：创建 repositories/entry_repository.py

从 main.py L18-24 搬出 `entries` 列表和 `_next_id()`，封装为：
- `add_entries(entries)` → 分配 ID，追加到列表
- `get_all_entries()` → 返回全部
- `get_entries_in_range(start, end)` → 按时间范围筛选
- `delete_entry(id)` → 按 ID 删除
- `update_entry(id, updates)` → 按 ID 更新字段
- `find_matching_entries(criteria, type?)` → 模糊匹配（子串、忽略大小写）

Phase 1 仅使用 add/get/delete，其余预定义供后续 phase 使用。

### Step 1.4：创建 services/llm_service.py

从 main.py L27-77 搬出 `call_llm()`，改为从 config 导入。

### Step 1.5：创建 prompts/intent_detection.py + services/intent_service.py

从 main.py L79-97 搬出 `detect_intent()`，Prompt 模板抽到 prompts 文件。Phase 1 保持 3 意图 Prompt 不变。

### Step 1.6：创建 prompts/expense_parsing.py + services/extract_service.py

从 main.py L100-136 搬出 `parse_expense()`，Prompt 模板抽到 prompts 文件。

### Step 1.7：创建 services/query_service.py + utils/time_utils.py

- `parse_date_range()` 从 main.py L139-172 搬到 utils/time_utils.py
- `answer_query()` 从 main.py L175-188 搬到 services/query_service.py

### Step 1.8：创建 services/feedback_service.py

从 main.py L234-260 搬出 `format_feedback()`。

### Step 1.9：创建 utils/json_utils.py

从 main.py L191-231 搬出 `_extract_json_list()`，重命名为公开函数 `extract_json_list(raw, required_fields?)`。

### Step 1.10：重写 main.py 为 CLI 薄壳

从各 service 导入函数，保持 CLI 循环逻辑不变。

### Step 1.11：更新 web/server.py imports

从 `import main` 改为从各 service/repository 导入函数。路由逻辑零改动。

### Phase 1 验证

```bash
# CLI 测试
echo "午饭25" | python src/main.py
# 预期：已记录餐饮支出 ¥25

# API 测试
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"午饭25"}'
# 预期：{"intent":"record","success":true,...}
```

---

## Phase 2：扩展意图检测 → 7 意图

### Step 2.1：更新 prompts/intent_detection.py

Prompt 从 3 意图扩展到 7 意图，添加收入/日程/修改/删除的识别规则与示例。

### Step 2.2：更新 services/intent_service.py

`detect_intent()` 返回值从 `record/query/chat` 变为 `expense/income/schedule/query/modify/delete/chat`。

### Phase 2 验证

```bash
# 测试各意图
curl -X POST ... -d '{"message":"工资到账15000"}'  # → intent: income
curl -X POST ... -d '{"message":"明天下午3点开会"}'  # → intent: schedule
curl -X POST ... -d '{"message":"删除昨天午饭"}'    # → intent: delete
```

---

## Phase 3：新增 income/schedule/modify/delete 解析

### Step 3.1：新增 prompts/income_parsing.py + parse_income()

JSON Schema：`[{"type":"income","category":"工资","amount":15000,"time":"YYYY-MM-DD","source":"工资","note":""}]`

### Step 3.2：新增 prompts/schedule_parsing.py + parse_schedule()

JSON Schema：`[{"type":"schedule","title":"开会","time":"YYYY-MM-DD HH:MM","remind_time":"YYYY-MM-DD HH:MM","repeat_type":"none|daily|weekly|monthly|yearly","note":""}]`

默认值：time 默认 09:00，remind_time 默认比 time 早 30 分钟，repeat_type 默认 none。

### Step 3.3：新增 prompts/modify_parsing.py + parse_modify()

返回单个 JSON 对象（非数组）：
`{"target_type":"expense","match_criteria":{"time":"...","note":"..."},"updates":{"amount":50}}`

### Step 3.4：新增 prompts/delete_parsing.py + parse_delete()

返回单个 JSON 对象：
`{"target_type":"expense","match_criteria":{"time":"...","note":"..."},"confirm":false}`

### Step 3.5：更新 utils/json_utils.py

新增 `extract_json_object(raw, required_fields?)` 用于 modify/delete 的单对象提取。

---

## Phase 4：修改/删除执行逻辑

### Step 4.1：services/modify_service.py

`execute_modify(modify_data)` — 调用 `find_matching_entries()`，匹配到 1 条则 `update_entry()`，0 条报错，多条返回候选。

### Step 4.2：services/delete_service.py

`execute_delete(delete_data)` — 同上模式，匹配到 1 条则 `delete_entry()`。

---

## Phase 5：更新 Flask 路由

### Step 5.1：server.py `/api/chat` 路由

新增 intent 分支：
- `expense` → parse_expense + format_feedback（现有逻辑）
- `income` → parse_income + format_income_feedback
- `schedule` → parse_schedule + format_schedule_feedback
- `modify` → parse_modify + execute_modify
- `delete` → parse_delete + execute_delete
- `query` → 现有逻辑
- `chat` → 返回引导语

### Step 5.2：services/feedback_service.py

新增 `format_income_feedback()` 和 `format_schedule_feedback()`。

---

## Phase 6：更新 CLI

### Step 6.1：main.py main() 函数

扩展 CLI 循环，每个 intent 走对应的 parse → execute → 输出反馈分支。

---

## 验证计划

全部 Phase 完成后，按 REQUIREMENTS.md 第五节用户场景测试：

1. `"今天午饭35"` → expense 记录成功
2. `"工资到账15000"` → income 记录成功
3. `"明天下午3点开会提醒我"` → schedule 创建成功
4. `"今天午饭35，晚上打车20"` → 两条 expense 拆分成功
5. `"今天花了多少"` → query 返回汇总
6. `"把昨天午饭改成50"` → modify 成功
7. `"删除昨天午饭记录"` → delete 成功

### 测试方式

```bash
# CLI 手动测试
python src/main.py

# API 测试（每个 intent 至少一个用例）
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d '{"message":"午饭35"}'
```

---

## 关键设计决策

1. **Phase 1 零行为变更** — 模块化只是搬代码，不改 prompt、不改逻辑、不改 API 响应格式
2. **统一 entries 列表** — 用 `type` 字段区分 expense/income/schedule，不需多张表
3. **Modify/Delete 用模糊匹配** — LLM 返回 match_criteria，Python 做子串匹配
4. **Prompt 独立文件** — 每个意图的 prompt 在 `src/prompts/` 下单独维护，符合 CLAUDE.md 规范
5. **Required fields 参数化** — `extract_json_list()` 接受 required_fields 参数，每种类型验证不同字段
