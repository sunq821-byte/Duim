from typing import List, Dict, Any, Optional
from backend.database.connection import get_connection, init_db


def _row_to_dict(row) -> Dict[str, Any]:
    """sqlite3.Row -> dict，过滤 None 值保持与原有行为一致。"""
    d = dict(row)
    d.pop("id", None)
    d["id"] = row["id"]
    return d


def _ensure_init() -> None:
    init_db()


def add_entries(entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    _ensure_init()
    conn = get_connection()
    result = []
    for entry in entries:
        cols = []
        vals = []
        for key in ["type", "category", "amount", "time", "title",
                     "remind_time", "repeat_type", "source", "note"]:
            if key in entry:
                cols.append(key)
                vals.append(entry[key])
        placeholders = ",".join(["?" for _ in cols])
        sql = f"INSERT INTO entries ({','.join(cols)}) VALUES ({placeholders})"
        cur = conn.execute(sql, vals)
        entry["id"] = cur.lastrowid
        result.append(entry)
    conn.commit()
    conn.close()
    return result


def get_all_entries() -> List[Dict[str, Any]]:
    _ensure_init()
    conn = get_connection()
    rows = conn.execute("SELECT * FROM entries ORDER BY id DESC").fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def get_entries_in_range(start: str, end: str) -> List[Dict[str, Any]]:
    _ensure_init()
    conn = get_connection()
    # 使用 date() 提取日期部分比较，避免 "2026-05-24 09:00:00" > "2026-05-24" 导致漏查
    rows = conn.execute(
        "SELECT * FROM entries WHERE date(time) >= ? AND date(time) <= ? ORDER BY id DESC",
        (start, end)
    ).fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def delete_entry(entry_id: int) -> bool:
    _ensure_init()
    conn = get_connection()
    cur = conn.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
    conn.commit()
    deleted = cur.rowcount > 0
    conn.close()
    return deleted


def update_entry(entry_id: int, updates: Dict[str, Any]) -> bool:
    _ensure_init()
    if not updates:
        return False
    conn = get_connection()
    allowed = {"type", "category", "amount", "time", "title",
               "remind_time", "repeat_type", "source", "note"}
    sets = []
    vals = []
    for key, value in updates.items():
        if key in allowed:
            sets.append(f"{key} = ?")
            vals.append(value)
    if not sets:
        conn.close()
        return False
    vals.append(entry_id)
    sql = f"UPDATE entries SET {', '.join(sets)} WHERE id = ?"
    cur = conn.execute(sql, vals)
    conn.commit()
    updated = cur.rowcount > 0
    conn.close()
    return updated


# 合法的 DB 列名白名单，防止 LLM 幻觉出的列名注入 SQL
_SEARCHABLE_COLUMNS = {"type", "category", "amount", "time", "title",
                       "remind_time", "repeat_type", "source", "note"}

# 匹配 note/title 时同时搜索这些字段（收入记录描述在 category/source，支出在 note）
_EXPAND_SEARCH_FIELDS = {"note", "title"}


def find_matching_entries(criteria: Dict[str, Any],
                          entry_type: Optional[str] = None) -> List[Dict[str, Any]]:
    _ensure_init()
    conn = get_connection()
    sql = "SELECT * FROM entries WHERE 1=1"
    params: List[Any] = []
    if entry_type:
        sql += " AND type = ?"
        params.append(entry_type)
    for key, value in criteria.items():
        if key not in _SEARCHABLE_COLUMNS:
            continue
        if key in _EXPAND_SEARCH_FIELDS:
            # 收入记录的描述在 category/source，支出在 note，三者一起搜
            sql += f" AND ({key} LIKE ? OR category LIKE ? OR source LIKE ?)"
            params.extend([f"%{value}%", f"%{value}%", f"%{value}%"])
        else:
            sql += f" AND {key} LIKE ?"
            params.append(f"%{value}%")
    sql += " ORDER BY time DESC, id DESC"
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]
