import re
from datetime import datetime, timedelta


def parse_date_range(text: str) -> tuple[str, str]:
    """用 Python 解析日期范围，不依赖 LLM。"""
    now = datetime.now()
    today = now.strftime("%Y-%m-%d")
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    day_before = (now - timedelta(days=2)).strftime("%Y-%m-%d")
    tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")
    day_after = (now + timedelta(days=2)).strftime("%Y-%m-%d")

    if "大前天" in text:
        return (now - timedelta(days=3)).strftime("%Y-%m-%d"), (now - timedelta(days=3)).strftime("%Y-%m-%d")
    if "前天" in text:
        return day_before, day_before
    if "昨天" in text:
        return yesterday, yesterday
    if "今天" in text:
        return today, today
    if "大后天" in text:
        return (now + timedelta(days=3)).strftime("%Y-%m-%d"), (now + timedelta(days=3)).strftime("%Y-%m-%d")
    if "后天" in text:
        return day_after, day_after
    if "明天" in text:
        return tomorrow, tomorrow

    if "这个月" in text or "本月" in text:
        return f"{now.strftime('%Y-%m')}-01", today

    weekday = now.weekday()
    monday = (now - timedelta(days=weekday)).strftime("%Y-%m-%d")
    if "这周" in text or "本周" in text:
        return monday, today

    match = re.search(r"最近(\d+)天", text)
    if match:
        n = int(match.group(1))
        return (now - timedelta(days=n)).strftime("%Y-%m-%d"), today

    if "最近" in text:
        return (now - timedelta(days=7)).strftime("%Y-%m-%d"), today

    if "所有" in text or "全部" in text or "一共" in text:
        return "2000-01-01", today

    return today, today


def normalize_date_string(text: str) -> str:
    """将相对日期关键词替换为实际日期，用于 match_criteria 归一化。

    例如 "今天" → "2026-05-23"，"昨天下午" → "2026-05-22下午"
    """
    now = datetime.now()
    mapping = {
        "大前天": (now - timedelta(days=3)).strftime("%Y-%m-%d"),
        "前天": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
        "昨天": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
        "今天": now.strftime("%Y-%m-%d"),
        "明天": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
        "后天": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
        "大后天": (now + timedelta(days=3)).strftime("%Y-%m-%d"),
    }
    # 先替换长的，避免 "大前天" 被 "前天" 先匹配
    for kw, date_str in mapping.items():
        text = text.replace(kw, date_str)
    return text
