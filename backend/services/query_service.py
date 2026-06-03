from backend.repositories.entry_repository import get_entries_in_range
from backend.utils.time_utils import parse_date_range

_EXPENSE_KEYWORDS = ("花了", "支出", "消费", "花费", "用了", "开销")
_SCHEDULE_KEYWORDS = ("安排", "日程", "要做", "有什么", "干嘛", "干什么", "计划")


def wants_expense_only(text: str) -> bool:
    """Detect if user is asking specifically about spending/expenses."""
    return any(kw in text for kw in _EXPENSE_KEYWORDS)


def _wants_schedule(text: str) -> bool:
    """Detect if user is asking about schedules/plans."""
    return any(kw in text for kw in _SCHEDULE_KEYWORDS)


def answer_query(
    text: str,
    query_type: str | None = None,
    category: str | None = None,
    keyword: str | None = None,
) -> dict:
    """根据存储的记录回答用户查询。

    query_type: "expense" | "income" | "schedule" | "all" (由 intent detection 传入)
    category / keyword: 由 intent detection 一次性提取后传入。

    返回 {feedback, records, total, count, date_range}。
    """
    start, end = parse_date_range(text)
    matched = get_entries_in_range(start, end)

    # 按记录类型筛选
    if query_type == "expense":
        matched = [e for e in matched if e.get("type") == "expense"]
    elif query_type == "income":
        matched = [e for e in matched if e.get("type") == "income"]
    elif query_type == "schedule":
        matched = [e for e in matched if e.get("type") == "schedule"]
    elif query_type == "all" or query_type is None:
        # 兜底：从文本中猜测类型
        if _wants_schedule(text):
            matched = [e for e in matched if e.get("type") == "schedule"]
        elif wants_expense_only(text):
            matched = [e for e in matched if e.get("type") == "expense"]

    # 支出/收入：按分类和关键词筛选
    if query_type in ("expense", "income") or (query_type is None and not _wants_schedule(text)):
        if category:
            matched = [e for e in matched if e.get("category") == category]
        if keyword:
            matched = [
                e for e in matched
                if keyword in e.get("note", "") or keyword in e.get("category", "")
            ]

    is_schedule = query_type == "schedule" or _wants_schedule(text)
    is_income = query_type == "income"

    if not matched:
        label = "日程" if is_schedule else ("收入" if is_income else "支出")
        return {
            "feedback": f"{start} 至 {end} 期间暂无{label}记录。",
            "records": [],
            "total": 0,
            "count": 0,
            "date_range": {"start": start, "end": end},
        }

    total = sum(e.get("amount") or 0 for e in matched)

    if is_schedule:
        items = "\n".join(
            f"  · {e.get('title', '未命名')}｜{e.get('time', '未设定时间')}"
            for e in matched
        )
        feedback = f"{start} 至 {end} 共 {len(matched)} 个日程：\n{items}"
    else:
        items = "\n".join(
            f"  · {e['category']} ¥{e['amount']}（{e['note']}）" for e in matched
        )
        feedback = f"{start} 至 {end} 共 {len(matched)} 笔，合计 ¥{total}：\n{items}"

    return {
        "feedback": feedback,
        "records": matched,
        "total": total,
        "count": len(matched),
        "date_range": {"start": start, "end": end},
    }
