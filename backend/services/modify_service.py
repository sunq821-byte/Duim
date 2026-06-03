from backend.repositories.entry_repository import find_matching_entries, update_entry
from backend.utils.time_utils import normalize_date_string


def execute_modify(modify_data: dict) -> dict:
    """执行修改操作，支持 canonical + aliases 双维度匹配。

    Args:
        modify_data: Canonical Intent Object
            {target_type, match_criteria, aliases, updates}

    Returns:
        {success, feedback, updated?, error?}
    """
    target_type = modify_data.get("target_type")
    match_criteria = modify_data.get("match_criteria", {})
    aliases = modify_data.get("aliases", [])
    updates = modify_data.get("updates", {})

    if target_type == "unknown" or (not match_criteria and not aliases):
        return {"success": False, "error": "无法确定要修改哪条记录，请描述得更具体一些。"}

    if not updates:
        return {"success": False, "error": "没有指定要修改的内容。"}

    # 归一化时间字段
    if "time" in match_criteria:
        match_criteria["time"] = normalize_date_string(match_criteria["time"])

    # ── 第一层：canonical 精确匹配 ──
    matched = find_matching_entries(match_criteria, entry_type=target_type)

    # ── 第二层：aliases 模糊匹配 ──
    if len(matched) == 0 and aliases:
        for alias in aliases:
            alias_criteria = {"note": alias}
            matched = find_matching_entries(alias_criteria, entry_type=target_type)
            if matched:
                break
        if len(matched) == 0:
            for alias in aliases:
                alias_criteria = {"title": alias}
                matched = find_matching_entries(alias_criteria, entry_type=target_type)
                if matched:
                    break

    # ── 第三层：用 aliases 过滤候选结果（优先匹配 note/title）──
    if len(matched) > 1 and aliases:
        filtered = []
        for entry in matched:
            note = (entry.get("note") or "").lower()
            title = (entry.get("title") or "").lower()
            for alias in aliases:
                if alias.lower() in note or alias.lower() in title:
                    filtered.append(entry)
                    break
        if filtered:
            matched = filtered

    # ── 结果处理 ──
    if len(matched) == 0:
        desc = match_criteria.get("note") or match_criteria.get("category") or "指定"
        return {"success": False,
                "error": f"未找到匹配的{target_type}记录。尝试搜索：{desc}，别名：{aliases}"}

    # 多条匹配时取最近一条
    entry = matched[0]
    old_amount = entry.get("amount", "")
    old_category = entry.get("category", "")
    old_title = entry.get("title", "")
    old_note = entry.get("note", "")

    update_entry(entry["id"], updates)

    # ── 构建反馈 ──
    old_desc = old_note or old_title or old_category or ""
    if "amount" in updates:
        new_amount = updates["amount"]
        feedback = f"已将 {old_desc} ¥{old_amount} 改为 ¥{new_amount}"
    elif "time" in updates:
        feedback = f"已将 {old_desc} 的时间更新为 {updates['time']}"
    elif "note" in updates:
        feedback = f"已将 {old_desc} 的备注更新为 {updates['note']}"
    else:
        feedback = f"已更新记录：{old_desc}"

    if len(matched) > 1:
        feedback += f"（共 {len(matched)} 条匹配，已更新最近一条）"

    return {"success": True, "updated": entry, "updates": updates, "feedback": feedback}
