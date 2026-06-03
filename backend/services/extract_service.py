from datetime import datetime, timedelta
from backend.prompts.expense_parsing import EXPENSE_PARSE_PROMPT
from backend.prompts.income_parsing import INCOME_PARSE_PROMPT
from backend.prompts.schedule_parsing import SCHEDULE_PARSE_PROMPT
from backend.prompts.modify_parsing import MODIFY_PARSE_PROMPT
from backend.prompts.delete_parsing import DELETE_PARSE_PROMPT
from backend.services.llm_service import call_llm
from backend.utils.json_utils import extract_json_list, extract_json_object
from backend.validators.schemas import (
    validate_expense_list, validate_income_list, validate_schedule_list,
    DeleteOutput, ModifyOutput,
)
from backend.validators.normalizers import (
    normalize_expense_item, normalize_income_item, normalize_schedule_item,
)


def _time_context():
    """返回当前时间相关上下文字典，供各解析函数复用。"""
    now = datetime.now()
    return {
        "current_time": now.strftime("%Y-%m-%d %H:%M:%S"),
        "weekday": ["一", "二", "三", "四", "五", "六", "日"][now.weekday()],
        "today": now.strftime("%Y-%m-%d"),
        "yesterday": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
        "day_before": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
        "tomorrow": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
        "day_after": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
    }


def parse_expense(text: str, stream: bool = True) -> list[dict]:
    """将记账文本解析为结构化 JSON 列表。

    流程: LLM → JSON提取 → Pydantic校验 → 分类归一化
    """
    ctx = _time_context()
    prompt = EXPENSE_PARSE_PROMPT.format(**ctx, text=text)

    if stream:
        print("  ⏳ 正在解析支出...", end=" ")
    raw = call_llm(prompt, stream=stream)
    if stream:
        print()

    items = extract_json_list(raw, required_fields={"type", "category", "amount", "time", "note"},
                              list_key="expenses")
    # Pydantic validation
    validated = validate_expense_list(items)
    # Normalize categories
    for item in validated:
        normalize_expense_item(item)
    return validated


def parse_income(text: str, stream: bool = True) -> list[dict]:
    """将收入文本解析为结构化 JSON 列表。"""
    ctx = _time_context()
    prompt = INCOME_PARSE_PROMPT.format(**ctx, text=text)

    if stream:
        print("  ⏳ 正在解析收入...", end=" ")
    raw = call_llm(prompt, stream=stream)
    if stream:
        print()

    items = extract_json_list(raw, required_fields={"type", "category", "amount", "time", "source"},
                              list_key="incomes")
    validated = validate_income_list(items)
    for item in validated:
        normalize_income_item(item)
    return validated


def parse_schedule(text: str, stream: bool = True) -> list[dict]:
    """将日程文本解析为结构化 JSON 列表。"""
    ctx = _time_context()
    prompt = SCHEDULE_PARSE_PROMPT.format(**ctx, text=text)

    if stream:
        print("  ⏳ 正在解析日程...", end=" ")
    raw = call_llm(prompt, stream=stream)
    if stream:
        print()

    items = extract_json_list(raw, required_fields={"type", "title", "time", "remind_time", "repeat_type"},
                              list_key="schedules")
    validated = validate_schedule_list(items)
    for item in validated:
        normalize_schedule_item(item)
    return validated


def parse_modify(text: str, stream: bool = True) -> dict:
    """从用户输入中解析修改意图，返回 {{target_type, match_criteria, updates, aliases}}。

    输出为 Canonical Intent Object，aliases 供 service 层模糊匹配。
    """
    ctx = _time_context()
    prompt = MODIFY_PARSE_PROMPT.format(**ctx, text=text)

    if stream:
        print("  ⏳ 正在解析修改...", end=" ")
    raw = call_llm(prompt, stream=stream)
    if stream:
        print()

    data = extract_json_object(raw, required_fields={"target_type", "match_criteria", "updates"})
    # Pydantic validation (aliases is optional with default [])
    validated = ModifyOutput(**data)
    return validated.model_dump()


def parse_delete(text: str, stream: bool = True) -> dict:
    """从用户输入中解析删除意图，返回 Canonical Intent Object。

    输出格式: {{target_type, match_criteria, aliases, confirm, delete_all}}
    aliases 供 service 层做多维度模糊匹配。
    """
    ctx = _time_context()
    prompt = DELETE_PARSE_PROMPT.format(**ctx, text=text)

    if stream:
        print("  ⏳ 正在解析删除...", end=" ")
    raw = call_llm(prompt, stream=stream)
    if stream:
        print()

    data = extract_json_object(raw, required_fields={"target_type", "match_criteria", "confirm"})
    validated = DeleteOutput(**data)
    return validated.model_dump()
