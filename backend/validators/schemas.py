"""Pydantic schemas for validating LLM-structured output."""

from pydantic import BaseModel, Field
from typing import Literal, Optional, Any


# ── Expense ──────────────────────────────────────────────

EXPENSE_CATEGORIES = Literal[
    "餐饮", "交通", "购物", "娱乐", "居住", "通讯", "医疗", "教育",
    "服饰", "饮品", "日用", "其他"
]


class ExpenseItem(BaseModel):
    type: Literal["expense"]
    category: EXPENSE_CATEGORIES = "其他"
    amount: float = Field(ge=0, description="消费金额，>=0。0 表示用户未提供具体金额（如'几十块'）")
    time: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$", description="日期 YYYY-MM-DD")
    note: str = ""


# ── Income ───────────────────────────────────────────────

INCOME_CATEGORIES = Literal[
    "工资", "奖金", "投资", "兼职", "红包", "退款", "报销", "其他"
]


class IncomeItem(BaseModel):
    type: Literal["income"]
    category: INCOME_CATEGORIES = "其他"
    amount: float = Field(ge=0, description="收入金额，>=0。0 表示用户未提供具体金额")
    time: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    source: str = ""
    note: str = ""


# ── Schedule ─────────────────────────────────────────────

SCHEDULE_CATEGORIES = Literal[
    "工作", "学习", "聚会", "生日", "会议", "医疗", "出行", "其他"
]

REPEAT_TYPES = Literal["none", "daily", "weekly", "monthly", "yearly"]


class ScheduleItem(BaseModel):
    type: Literal["schedule"]
    title: str = Field(min_length=1)
    category: SCHEDULE_CATEGORIES = "其他"
    time: str = Field(pattern=r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$")
    remind_time: str = ""
    repeat_type: REPEAT_TYPES = "none"
    note: str = ""


# ── Modify ───────────────────────────────────────────────

MODIFY_TARGET_TYPES = Literal["expense", "income", "schedule", "unknown"]


class ModifyOutput(BaseModel):
    target_type: MODIFY_TARGET_TYPES
    match_criteria: dict = Field(default_factory=dict)
    aliases: list[str] = Field(default_factory=list,
                                description="原始分类名称，用于模糊匹配")
    updates: dict = Field(default_factory=dict)


# ── Delete ───────────────────────────────────────────────

class DeleteOutput(BaseModel):
    target_type: MODIFY_TARGET_TYPES
    match_criteria: dict = Field(default_factory=dict,
                                  description="标准化后的匹配条件")
    aliases: list[str] = Field(default_factory=list,
                                description="用户原始用词，用于模糊匹配note/title")
    confirm: bool = False
    delete_all: bool = False


# ── Intent ───────────────────────────────────────────────

INTENT_NAMES = Literal["expense", "income", "schedule", "query", "modify", "delete", "chat"]
QUERY_TYPES = Literal["expense", "income", "schedule", "all"]


class IntentOutput(BaseModel):
    intent: INTENT_NAMES
    query_type: Optional[QUERY_TYPES] = None
    query_category: Optional[str] = None
    query_keyword: Optional[str] = None


# ── Splitter ─────────────────────────────────────────────

class SplitterOutput(BaseModel):
    segments: list[str] = Field(min_length=1)


# ── Validation helpers ───────────────────────────────────

def validate_expense_list(data: list[dict]) -> list[dict]:
    return [ExpenseItem(**item).model_dump() for item in data]


def validate_income_list(data: list[dict]) -> list[dict]:
    return [IncomeItem(**item).model_dump() for item in data]


def validate_schedule_list(data: list[dict]) -> list[dict]:
    return [ScheduleItem(**item).model_dump() for item in data]


def convert_to_list(item_dict: dict) -> list[dict]:
    """Wrapper for extract_json_list: accept single dict, return list."""
    if isinstance(item_dict, list):
        return item_dict
    return [item_dict]
