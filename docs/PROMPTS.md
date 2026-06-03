# AI Native 自然语言事务管理系统 - Prompt 文档

## 一、Prompt设计原则

本项目核心目标：

# 自然语言 → 结构化JSON

因此 Prompt 必须：

- 输出稳定
- 格式统一
- 避免聊天
- 避免解释
- 保证JSON合法

---

# 二、基础事务解析 Prompt

## V1 Prompt

```text
你是一个事务解析AI。

你的任务：
从用户输入中提取事务信息。

你必须返回 JSON。

禁止：
- 聊天
- 解释
- Markdown
- 代码块

如果是记账，请返回：
{
  "type": "expense",
  "category": "",
  "amount": 0,
  "time": "",
  "note": ""
}

如果是日程，请返回：
{
  "type": "schedule",
  "title": "",
  "time": "",
  "note": ""
}

用户输入：
{{input}}
```

---

# 三、多事务拆分 Prompt

## V2 Prompt

```text
你是一个事务拆分AI。

请从用户输入中拆分多个事务。

返回 JSON 数组。

禁止输出解释。

用户输入：
{{input}}
```

---

# 四、分类 Prompt

## 分类规则

### expense 分类

- 餐饮
- 交通
- 娱乐
- 学习
- 工资
- 日用

---

## 分类示例

输入：
奶茶16

输出：
餐饮

---

# 五、时间解析规则

## 支持时间

- 今天
- 明天
- 后天
- 今晚
- 下周三
- 每周一

---

## 时间默认规则

### 未指定时间
默认：今天

### 未指定消费类型
自动推理分类

---

# 六、测试案例

## 测试1

输入：
今天午饭35

输出：

```json
{
  "type": "expense",
  "category": "餐饮",
  "amount": 35,
  "time": "今天",
  "note": "午饭"
}
```

---

## 测试2

输入：
明天下午3点开会提醒我

输出：

```json
{
  "type": "schedule",
  "title": "开会",
  "time": "明天下午3点",
  "note": "提醒"
}
```

---

## 测试3

输入：
今天午饭35，晚上打车20

输出：

```json
[
  {
    "type": "expense",
    "category": "餐饮",
    "amount": 35
  },
  {
    "type": "expense",
    "category": "交通",
    "amount": 20
  }
]
```

---

# 七、Prompt优化方向

## 当前问题

- JSON不稳定
- 模型会解释
- 多事务解析错误
- 时间理解不稳定

---

## 后续优化方向

### 1. Few-shot Prompt
增加示例。

---

### 2. Function Calling
使用结构化输出。

---

### 3. JSON Schema
限制输出格式。

---

### 4. Agent Workflow
拆分多个Prompt模块。

---

# 八、当前使用模型

## 本地开发

- qwen2.5:7b

---

## 上线阶段

- DeepSeek API
- 通义千问 API

---

# 九、Prompt版本记录

## v1

仅支持单条记账。

---

## v2

支持日程。

---

## v3

支持多事务拆分。

---

## v4（未来）

支持修改、删除、查询。
