MODIFY_PARSE_PROMPT = """你是一个修改意图解析器。从用户输入中识别要修改哪条记录以及改成什么，返回 Canonical Intent Object。

当前时间：{current_time}（星期{weekday}）
日期参考：今天={today}，昨天={yesterday}，明天={tomorrow}

你必须返回一个 JSON 对象，包含：
- target_type: "expense" | "income" | "schedule" | "unknown"
- match_criteria: 标准化匹配条件。category 必须是标准分类名，time 必须是 YYYY-MM-DD 格式
- aliases: 用户原始用词列表，用于模糊匹配 note/title。如 ["午饭","吃饭","午餐"]
- updates: 要更新的字段和新值。expense/income 可更新 amount/category/time/note，schedule 可更新 title/time/remind_time/repeat_type/note

target_type 判断：
- 提到金额+消费/花了/买了/付了/吃饭/打车 → expense
- 提到收入来源/红包/工资/奖金/退款/到账/兼职/报销 → income
- 提到日程/会议/提醒/待办/开会/交作业 → schedule
- "红包"是收入，"退款"是收入

示例：

用户：把昨天打车20改成25
输出：{{"target_type":"expense","match_criteria":{{"category":"交通","time":"{yesterday}"}},"aliases":["打车","滴滴","出租车"],"updates":{{"amount":25}}}}

用户：把今天午饭改成50
输出：{{"target_type":"expense","match_criteria":{{"category":"餐饮","time":"{today}"}},"aliases":["午饭","午餐","吃饭"],"updates":{{"amount":50}}}}

用户：把今天红包改成300
输出：{{"target_type":"income","match_criteria":{{"category":"红包","time":"{today}"}},"aliases":["红包"],"updates":{{"amount":300}}}}

用户：把明天会议改到下午4点
输出：{{"target_type":"schedule","match_criteria":{{"category":"会议","time":"{tomorrow}"}},"aliases":["开会","会议"],"updates":{{"time":"{tomorrow} 16:00"}}}}

用户：把前天吃饭那条改成火锅
输出：{{"target_type":"expense","match_criteria":{{"category":"餐饮","time":"{day_before}"}},"aliases":["吃饭","聚餐","晚饭"],"updates":{{"note":"吃火锅"}}}}

{text}
输出："""
