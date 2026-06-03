from backend.repositories.entry_repository import find_matching_entries, delete_entry
from backend.utils.time_utils import normalize_date_string


def execute_delete(delete_data: dict) -> dict:
    """执行删除操作，支持 canonical + aliases 双维度匹配，以及"最近"查询。

    Args:
        delete_data: Canonical Intent Object
            {target_type, match_criteria, aliases, confirm, delete_all}

    Returns:
        {success, feedback, deleted?, candidates?, error?}
    """
    target_type = delete_data.get("target_type")
    match_criteria = delete_data.get("match_criteria", {})
    aliases = delete_data.get("aliases", [])
    delete_all = delete_data.get("delete_all", False)

    if target_type == "unknown" or (not match_criteria and not aliases):
        # 无匹配条件但有明确 target_type → 尝试取最近一条
        if target_type and target_type != "unknown":
            recent = find_matching_entries({}, entry_type=target_type)
            if recent:
                entry = recent[0]  # 已按 time DESC, id DESC 排序
                delete_entry(entry["id"])
                desc = entry.get("note") or entry.get("title") or entry.get("category", "")
                amount = entry.get("amount", "")
                amount_str = f" ¥{amount}" if amount else ""
                return {"success": True, "deleted": entry,
                        "feedback": f"已删除最近记录：{desc}{amount_str}"}
        return {"success": False, "error": "无法确定要删除哪条记录，请描述得更具体一些。"}

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
    if len(matched) > 1 and aliases and not delete_all:
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
        # 过滤后仍有多条 → 取最近一条
        if len(matched) > 1:
            matched = [matched[0]]

    # ── 结果处理 ──
    if len(matched) == 0:
        desc = match_criteria.get("note") or match_criteria.get("category") or "指定"
        return {"success": False,
                "error": f"未找到匹配的{target_type}记录。尝试搜索：{desc}，别名：{aliases}"}

    if len(matched) > 1 and not delete_all:
        return {
            "success": False,
            "error": f"找到 {len(matched)} 条匹配记录，请描述得更具体一些，或确认删除所有匹配记录。",
            "candidates": matched
        }

    # ── 执行删除 ──
    deleted_entries = []
    for entry in matched:
        delete_entry(entry["id"])
        deleted_entries.append(entry)

    if len(deleted_entries) == 1:
        entry = deleted_entries[0]
        desc = entry.get("note") or entry.get("title") or entry.get("category", "")
        amount = entry.get("amount", "")
        amount_str = f" ¥{amount}" if amount else ""
        return {"success": True, "deleted": entry,
                "feedback": f"已删除记录：{desc}{amount_str}"}

    descs = [
        e.get("note") or e.get("title") or e.get("category", "")
        for e in deleted_entries
    ]
    return {"success": True, "deleted": deleted_entries,
            "feedback": f"已删除 {len(deleted_entries)} 条记录：{'、'.join(descs)}"}
