import re
from backend.prompts.splitter_prompt import SPLITTER_PROMPT
from backend.services.llm_service import call_llm
from backend.utils.json_utils import extract_json_list


# 规则层分隔符：按优先级从高到低
_RULE_DELIMITERS = [
    r"[，,]",      # 中文/英文逗号
    r"[；;]",      # 中文/英文分号
    r"[。.]",      # 中文/英文句号
    r"还有",       # 口语连接词
    r"然后",
    r"另外",
    r"\s+和\s+",   # "和" 作为连接词（前后有空格）
]

_MIN_SEGMENT_LENGTH = 3

# 事务相关关键词：用于判断子句是否为独立事务而非依赖从句
_TRANSACTION_INDICATORS = re.compile(
    r"(\d+元|\d+块|\d+¥|¥\d+|块钱|花了|买了|卖了|付了|支付|消费|支出了|"
    r"工资|到账|收入|赚了|收了|收到|红包|奖金|稿费|退款|报销|转账|"
    r"开会|会议|面试|聚餐|约会|提醒|日程|待办|站会|聚会|带伞|交作业|"
    r"充了|交了|打车|吃饭|午饭|晚饭|早餐|咖啡|奶茶|借了|还了)"
)

# 日期表达式模式（用于提取开头日期 + 检测子句是否已有日期）
_DATE_PATTERNS = [
    r"\d{1,2}月\d{1,2}[日号](的?时候|那天)?",   # 5月20日的时候、5月20号那天
    r"(上周|本周|下周|上上周|这周)[一二三四五六日末]",  # 上周五、上周末、这周一
    r"(今年|去年|明年)?\d{1,2}月\d{1,2}[日号]?",  # 5月20日
    r"(这个月|本月|上个月|上月|下个月|下月)",       # 本月、上个月
]
_RELATIVE_DATE_RE = re.compile(r"(今天|昨天|前天|明天|后天|大前天|大后天|上周|本周|下周|这周|本月|上月)")


def _extract_leading_date(text: str) -> str:
    """提取文本开头的日期表达式，如 "5月20日的时候" → 返回该片段。"""
    text = text.strip()
    m = _RELATIVE_DATE_RE.match(text)
    if m:
        return m.group(0)
    for pattern in _DATE_PATTERNS:
        m = re.match(pattern, text)
        if m:
            return m.group(0)
    return ""


def _has_date(text: str) -> bool:
    """检查文本中是否已包含日期引用。"""
    if _RELATIVE_DATE_RE.search(text):
        return True
    for pattern in _DATE_PATTERNS:
        if re.search(pattern, text):
            return True
    return False


def split_text(text: str) -> list[str]:
    """将用户输入拆分为独立的事务描述子句。

    第一层：规则拆分（标点 + 连接词）
    第二层：AI 拆分（兜底，当规则拆分结果不足以覆盖时）
    第三层：日期上下文传播（开头日期补齐到无日期子句）
    """
    date_prefix = _extract_leading_date(text)

    segments = _rule_split(text)
    segments = _clean_segments(segments)

    # 如果规则拆分有效（>1段且所有段都够长且都含事务特征），直接返回
    if (len(segments) > 1
            and all(len(s) >= _MIN_SEGMENT_LENGTH for s in segments)
            and all(_TRANSACTION_INDICATORS.search(s) for s in segments)):
        pass  # 使用规则拆分结果
    elif len(segments) > 1:
        # 部分段缺乏事务特征 → 走 AI 拆分
        segments = _ai_split(text)
    else:
        # 否则走 AI 拆分
        segments = _ai_split(text)

    # 日期上下文传播：开头日期补齐到无日期子句
    if date_prefix and len(segments) > 1:
        segments = [
            f"{date_prefix} {seg}" if not _has_date(seg) else seg
            for seg in segments
        ]

    return segments


def _rule_split(text: str) -> list[str]:
    """按分隔符递归拆分，返回所有片段。"""
    for pattern in _RULE_DELIMITERS:
        parts = re.split(pattern, text)
        if len(parts) > 1:
            # 对每个部分继续尝试后续分隔符
            result = []
            for part in parts:
                result.extend(_rule_split(part))
            return result
    return [text]


def _clean_segments(segments: list[str]) -> list[str]:
    """过滤空字符串并去除首尾空白。"""
    return [s.strip() for s in segments if s.strip()]


def _ai_split(text: str) -> list[str]:
    """使用 AI 拆分文本。JSON Mode 返回 {"segments": [...]}。"""
    prompt = SPLITTER_PROMPT.format(text=text)
    raw = call_llm(prompt)
    segments = extract_json_list(raw, list_key="segments")
    result = []
    for item in segments:
        if isinstance(item, str):
            result.append(item)
        elif isinstance(item, dict):
            result.append(str(list(item.values())[0]) if item.values() else "")
    return _clean_segments(result) if result else [text]
