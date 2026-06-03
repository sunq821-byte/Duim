import json
import re


def extract_json_list(raw: str, required_fields: set | None = None,
                      list_key: str | None = None) -> list[dict]:
    """从模型返回文本中提取 JSON 数组，兼容 JSON Mode 包裹格式。

    JSON Mode 下模型返回 {"list_key": [...]} 而非裸数组。
    若指定 list_key，优先从该键提取列表；否则回退到旧逻辑。
    """
    if "```" in raw:
        raw = re.sub(r"```(?:json)?\s*", "", raw)
        raw = raw.replace("```", "")

    raw = raw.strip()

    # ── JSON Mode path: try to extract from wrapping object ──
    if list_key and raw.startswith("{"):
        try:
            obj = json.loads(raw)
        except json.JSONDecodeError:
            obj = None
        if isinstance(obj, dict) and list_key in obj:
            data = obj[list_key]
            if isinstance(data, dict):
                data = [data]
            if isinstance(data, list):
                if required_fields:
                    for item in data:
                        if not isinstance(item, dict):
                            continue
                        missing = required_fields - set(item.keys())
                        if missing:
                            raise ValueError(f"返回数据缺少字段：{missing}，内容：{item}")
                return data

    # ── Legacy path: extract bare JSON array ──
    if raw.startswith("["):
        end = raw.rfind("]")
        if end != -1:
            raw = raw[:end + 1]
    elif raw.startswith("{"):
        end = raw.rfind("}")
        if end != -1:
            raw = "[" + raw[:end + 1] + "]"
    elif raw.count("{") > 1:
        raw = "[" + raw + "]"
    else:
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            raw = "[" + raw[start:end + 1] + "]"
        else:
            raise ValueError(f"AI 返回内容中找不到 JSON：\n{raw}")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"AI 返回内容无法解析为 JSON：\n{raw}")

    if isinstance(data, dict):
        data = [data]

    if required_fields:
        for item in data:
            missing = required_fields - set(item.keys())
            if missing:
                raise ValueError(f"返回数据缺少字段：{missing}，内容：{item}")

    return data


def extract_json_object(raw: str, required_fields: set | None = None) -> dict:
    """从模型返回文本中提取单个 JSON 对象。"""
    if "```" in raw:
        raw = re.sub(r"```(?:json)?\s*", "", raw)
        raw = raw.replace("```", "")

    raw = raw.strip()

    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        raw = raw[start:end + 1]
    else:
        raise ValueError(f"AI 返回内容中找不到 JSON 对象：\n{raw}")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise ValueError(f"AI 返回内容无法解析为 JSON：\n{raw}")

    if required_fields:
        missing = required_fields - set(data.keys())
        if missing:
            raise ValueError(f"返回数据缺少字段：{missing}，内容：{data}")

    return data
