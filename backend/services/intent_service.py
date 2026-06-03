from backend.prompts.intent_detection import INTENT_DETECTION_PROMPT
from backend.services.llm_service import call_llm
from backend.utils.json_utils import extract_json_object


def detect_intent(text: str) -> dict:
    """识别用户意图，返回 {"intent": str, "query_type": str|None, "query_category": str|None, "query_keyword": str|None}。

    intent 值：expense, income, schedule, query, modify, delete, chat。
    query_type / query_category / query_keyword 仅在 intent=query 时有值。
"""
    prompt = INTENT_DETECTION_PROMPT.format(text=text)
    raw = call_llm(prompt).strip()

    try:
        result = extract_json_object(raw, required_fields={"intent"})
        intent = result.get("intent", "chat")
        # 规范化意图名
        for valid in ["schedule", "income", "modify", "delete", "query", "expense"]:
            if valid in intent.lower():
                intent = valid
                break
        else:
            intent = "chat"
        return {
            "intent": intent,
            "query_type": result.get("query_type") or None,
            "query_category": result.get("query_category") or None,
            "query_keyword": result.get("query_keyword") or None,
        }
    except Exception:
        return {"intent": "chat", "query_type": None, "query_category": None, "query_keyword": None}
