def format_feedback(data_list: list[dict]) -> str:
    """将结构化支出记录列表转为自然语言确认。"""
    category_map = {
        "餐饮": "🍜 餐饮", "交通": "🚗 交通", "购物": "🛍️ 购物",
        "娱乐": "🎮 娱乐", "居住": "🏠 居住", "通讯": "📱 通讯",
        "医疗": "💊 医疗", "教育": "📚 教育", "其他": "📌 其他"
    }

    if len(data_list) == 1:
        data = data_list[0]
        cat = category_map.get(data["category"], f"📌 {data['category']}")
        note = data.get("note", "")
        note_part = f"（{note}）" if note else ""
        return f"已记录：{cat}支出 ¥{data['amount']} ｜{data['time']}{note_part}"

    total = sum(e["amount"] for e in data_list)
    lines = ["已记录以下消费："]
    for data in data_list:
        cat = category_map.get(data["category"], f"📌 {data['category']}")
        note = data.get("note", "")
        note_part = f"（{note}）" if note else ""
        lines.append(
            f"  · {cat} ¥{data['amount']} ｜{data['time']}{note_part}"
        )
    lines.append("  ───────────────")
    lines.append(f"  合计：¥{total}（共 {len(data_list)} 笔）")
    return "\n".join(lines)


def format_income_feedback(data_list: list[dict]) -> str:
    """将结构化收入记录列表转为自然语言确认。"""
    category_icons = {
        "工资": "💰 工资", "奖金": "🎁 奖金", "投资": "📈 投资",
        "兼职": "💼 兼职", "红包": "🧧 红包", "退款": "↩️ 退款", "其他": "📌 其他"
    }

    if len(data_list) == 1:
        data = data_list[0]
        cat = category_icons.get(data.get("category", ""), f"📌 {data['category']}")
        source = data.get("source", "")
        source_part = f"（来自{source}）" if source else ""
        return f"已记录：{cat}收入 ¥{data['amount']} ｜{data['time']}{source_part}"

    total = sum(e["amount"] for e in data_list)
    lines = ["已记录以下收入："]
    for data in data_list:
        cat = category_icons.get(data.get("category", ""), f"📌 {data['category']}")
        source = data.get("source", "")
        source_part = f"（来自{source}）" if source else ""
        lines.append(
            f"  · {cat} ¥{data['amount']} ｜{data['time']}{source_part}"
        )
    lines.append("  ───────────────")
    lines.append(f"  合计：¥{total}（共 {len(data_list)} 笔）")
    return "\n".join(lines)


def format_schedule_feedback(data_list: list[dict]) -> str:
    """将结构化日程记录列表转为自然语言确认。"""
    repeat_hints = {
        "none": "", "daily": "（每天）", "weekly": "（每周）",
        "monthly": "（每月）", "yearly": "（每年）"
    }
    category_icons = {
        "工作": "💼 工作", "学习": "📚 学习", "聚会": "🎉 聚会",
        "生日": "🎂 生日", "会议": "📋 会议", "其他": "📅 其他"
    }

    if len(data_list) == 1:
        data = data_list[0]
        repeat = repeat_hints.get(data.get("repeat_type", "none"), "")
        cat = category_icons.get(data.get("category", ""), f"📅 {data.get('category', '')}")
        return f"已创建日程：{cat} {data['title']} ｜{data['time']}{repeat}"

    lines = ["已创建以下日程："]
    for data in data_list:
        repeat = repeat_hints.get(data.get("repeat_type", "none"), "")
        cat = category_icons.get(data.get("category", ""), f"📅 {data.get('category', '')}")
        lines.append(f"  · {cat} {data['title']} ｜{data['time']}{repeat}")
    lines.append(f"  共 {len(data_list)} 项日程")
    return "\n".join(lines)


def format_mixed_feedback(groups: list[dict]) -> str:
    """将混合意图的多个 group 汇总为一段自然语言确认。"""
    intent_labels = {
        "expense": "支出", "income": "收入", "schedule": "日程",
        "modify": "修改", "delete": "删除", "query": "查询"
    }

    lines = [f"已处理以下 {len(groups)} 类事务："]
    for i, g in enumerate(groups, 1):
        label = intent_labels.get(g["intent"], g["intent"])
        count = g.get("count", 0)
        total = g.get("total", 0)
        if total:
            lines.append(f"  {i}. {label}：¥{total}（{count} 笔）")
        else:
            lines.append(f"  {i}. {label}：{count} 项")
    return "\n".join(lines)
