from dataclasses import dataclass, field
from typing import Optional, Literal, Union


@dataclass
class ExpenseEntry:
    type: Literal["expense"] = "expense"
    category: str = "其他"
    amount: float = 0.0
    time: str = ""
    note: str = ""
    id: Optional[int] = None


@dataclass
class IncomeEntry:
    type: Literal["income"] = "income"
    category: str = "工资"
    amount: float = 0.0
    time: str = ""
    source: str = ""
    note: str = ""
    id: Optional[int] = None


@dataclass
class ScheduleEntry:
    type: Literal["schedule"] = "schedule"
    title: str = ""
    category: str = "其他"
    time: str = ""
    remind_time: str = ""
    repeat_type: str = "none"
    note: str = ""
    id: Optional[int] = None


Entry = Union[ExpenseEntry, IncomeEntry, ScheduleEntry]
