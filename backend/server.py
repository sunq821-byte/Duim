import sys
import os

# 确保项目根目录在 sys.path 中，支持 python backend/server.py 和 VS Code F5 两种启动方式
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json

from flask import Flask, request, jsonify

from backend.services.intent_service import detect_intent
from backend.services.extract_service import (
    parse_expense, parse_income, parse_schedule, parse_modify, parse_delete
)
from backend.services.query_service import answer_query
from backend.services.feedback_service import (
    format_feedback, format_income_feedback, format_schedule_feedback,
    format_mixed_feedback
)
from backend.services.modify_service import execute_modify
from backend.services.delete_service import execute_delete
from backend.services.splitter_service import split_text
from backend.repositories.entry_repository import (
    add_entries, get_all_entries,
    delete_entry
)
from backend.database.connection import init_db

init_db()

app = Flask(__name__)


def _process_single(text: str) -> dict:
    """处理单条文本，返回 {{intent, records, feedback, ...}}。"""
    intent_result = detect_intent(text)
    intent = intent_result["intent"]

    if intent == "expense":
        data_list = parse_expense(text, stream=False)
        # 过滤金额为0的条目（用户未提供具体金额）
        valid_entries = [e for e in data_list if e.get("amount", 0) > 0]
        zero_entries = [e for e in data_list if e.get("amount", 0) <= 0]
        if not valid_entries:
            notes = "、".join(e.get("note", "") for e in zero_entries if e.get("note"))
            hint = f"请提供具体金额" + (f"（{notes}）" if notes else "")
            return {
                "intent": "chat",
                "success": True,
                "feedback": hint,
                "records": [],
                "total": 0,
                "count": 0,
                "groups": []
            }
        if zero_entries:
            skipped_notes = "、".join(e.get("note", "") for e in zero_entries if e.get("note"))
            skipped_msg = f"\n（{'，'.join(skipped_notes) if skipped_notes else '部分条目'}金额未指定，已跳过）"
        else:
            skipped_msg = ""
        add_entries(valid_entries)
        feedback = format_feedback(valid_entries) + skipped_msg
        return {
            "intent": "expense",
            "success": True,
            "feedback": feedback,
            "records": valid_entries,
            "total": sum(e["amount"] for e in valid_entries),
            "count": len(valid_entries),
            "groups": [{"intent": "expense", "records": valid_entries,
                        "total": sum(e["amount"] for e in valid_entries),
                        "count": len(valid_entries), "feedback": feedback}]
        }

    elif intent == "income":
        data_list = parse_income(text, stream=False)
        add_entries(data_list)
        feedback = format_income_feedback(data_list)
        return {
            "intent": "income",
            "success": True,
            "feedback": feedback,
            "records": data_list,
            "total": sum(e["amount"] for e in data_list),
            "count": len(data_list),
            "groups": [{"intent": "income", "records": data_list,
                        "total": sum(e["amount"] for e in data_list),
                        "count": len(data_list), "feedback": feedback}]
        }

    elif intent == "schedule":
        data_list = parse_schedule(text, stream=False)
        add_entries(data_list)
        feedback = format_schedule_feedback(data_list)
        return {
            "intent": "schedule",
            "success": True,
            "feedback": feedback,
            "records": data_list,
            "count": len(data_list),
            "groups": [{"intent": "schedule", "records": data_list,
                        "total": 0, "count": len(data_list), "feedback": feedback}]
        }

    elif intent == "modify":
        try:
            modify_data = parse_modify(text, stream=False)
            result = execute_modify(modify_data)
        except Exception as e:
            result = {"success": False, "error": f"修改失败：{e}"}
        return {
            "intent": "modify",
            "success": result["success"],
            "feedback": result.get("feedback", result.get("error", "")),
            "records": [result.get("updated")] if result.get("updated") else [],
            "candidates": result.get("candidates", []),
            "groups": [{"intent": "modify",
                        "records": [result.get("updated")] if result.get("updated") else [],
                        "total": 0, "count": 1,
                        "feedback": result.get("feedback", result.get("error", ""))}]
        }

    elif intent == "delete":
        try:
            delete_data = parse_delete(text, stream=False)
            result = execute_delete(delete_data)
        except Exception as e:
            result = {"success": False, "error": f"删除失败：{e}"}
        deleted = result.get("deleted")
        if deleted is None:
            records = []
        elif isinstance(deleted, list):
            records = deleted
        else:
            records = [deleted]
        return {
            "intent": "delete",
            "success": result["success"],
            "feedback": result.get("feedback", result.get("error", "")),
            "records": records,
            "candidates": result.get("candidates", []),
            "groups": [{"intent": "delete",
                        "records": records,
                        "total": 0, "count": len(records),
                        "feedback": result.get("feedback", result.get("error", ""))}]
        }

    elif intent == "query":
        result = answer_query(
            text,
            query_type=intent_result["query_type"],
            category=intent_result["query_category"],
            keyword=intent_result["query_keyword"],
        )
        return {
            "intent": "query",
            "success": True,
            "feedback": result["feedback"],
            "records": result["records"],
            "total": result["total"],
            "count": result["count"],
            "date_range": result["date_range"],
            "groups": [{"intent": "query", "records": result["records"],
                        "total": result["total"], "count": result["count"],
                        "feedback": result["feedback"]}]
        }

    else:
        return {
            "intent": "chat",
            "success": True,
            "feedback": (
                "我是智能事务助手，可以帮你：\n"
                "· 记账：午饭25元\n"
                "· 记录收入：工资到账15000\n"
                "· 创建日程：明天下午3点开会\n"
                "· 查询：今天花了多少\n"
                "· 修改/删除记录"
            ),
            "records": [],
            "total": 0,
            "count": 0,
            "groups": []
        }


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"success": False, "error": "缺少 message 字段"}), 400

    text = data["message"].strip()
    if not text:
        return jsonify({"success": False, "error": "输入不能为空"}), 400

    try:
        segments = split_text(text)

        if len(segments) == 1:
            return jsonify(_process_single(segments[0]))

        # Multi-segment: process each independently
        all_groups = []
        all_records = []
        has_failure = False
        feedback_parts = []
        meaningful_groups = []  # 不含 chat 的 groups

        for seg in segments:
            result = _process_single(seg)
            if not result["success"]:
                has_failure = True
            if result.get("groups"):
                for g in result["groups"]:
                    if g.get("intent") != "chat":
                        meaningful_groups.append(g)
                        all_groups.append(g)
            if result.get("records"):
                all_records.extend(result["records"])
            if result.get("feedback") and result.get("intent") != "chat":
                feedback_parts.append(result["feedback"])

        # Build aggregate response
        effective_groups = meaningful_groups if meaningful_groups else all_groups
        primary_intent = effective_groups[0]["intent"] if effective_groups else "chat"
        total_amount = sum(
            r.get("amount", 0) for r in all_records
            if r.get("type") in ("expense", "income")
        )

        if len(effective_groups) > 1:
            feedback = format_mixed_feedback(effective_groups)
        elif feedback_parts:
            feedback = "\n".join(feedback_parts)
        else:
            feedback = "已处理。"

        return jsonify({
            "intent": primary_intent,
            "success": not has_failure,
            "feedback": feedback,
            "records": all_records,
            "total": total_amount,
            "count": len(all_records),
            "groups": effective_groups
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/entries", methods=["GET"])
def get_entries():
    return jsonify(get_all_entries())


@app.route("/api/stats", methods=["GET"])
def get_stats():
    import datetime
    today = datetime.date.today()
    month_start = today.replace(day=1).isoformat()
    month_end = today.isoformat()

    all_entries = get_all_entries()
    month_entries = [
        e for e in all_entries
        if month_start <= e.get("time", "") <= month_end
    ]

    expense_entries = [e for e in month_entries if e.get("type") == "expense"]
    income_entries = [e for e in month_entries if e.get("type") == "income"]

    expense_total = sum(e["amount"] for e in expense_entries)
    income_total = sum(e["amount"] for e in income_entries)

    def build_breakdown(entries):
        cat_map: dict[str, dict] = {}
        for e in entries:
            cat = e.get("category", "其他")
            if cat not in cat_map:
                cat_map[cat] = {"amount": 0, "count": 0}
            cat_map[cat]["amount"] += e["amount"]
            cat_map[cat]["count"] += 1

        total_amount = sum(v["amount"] for v in cat_map.values()) or 1
        return [
            {
                "category": cat,
                "amount": v["amount"],
                "count": v["count"],
                "percentage": round(v["amount"] / total_amount * 100)
            }
            for cat, v in sorted(cat_map.items(), key=lambda x: x[1]["amount"], reverse=True)
        ]

    expense_breakdown = build_breakdown(expense_entries)
    income_breakdown = build_breakdown(income_entries)

    daily_totals = []
    for i in range(6, -1, -1):
        d = today - datetime.timedelta(days=i)
        ds = d.isoformat()
        day_expense = sum(
            e["amount"] for e in all_entries if e.get("time") == ds and e.get("type") == "expense"
        )
        day_income = sum(
            e["amount"] for e in all_entries if e.get("time") == ds and e.get("type") == "income"
        )
        daily_totals.append({"date": ds, "expense": day_expense, "income": day_income})

    return jsonify({
        "expenseTotal": expense_total,
        "incomeTotal": income_total,
        "expenseCount": len(expense_entries),
        "incomeCount": len(income_entries),
        "expenseBreakdown": expense_breakdown,
        "incomeBreakdown": income_breakdown,
        "dailyTotals": daily_totals,
        "recentRecords": month_entries[-10:]
    })


@app.route("/api/delete", methods=["POST"])
def delete():
    data = request.get_json(silent=True)
    if not data or "id" not in data:
        return jsonify({"success": False, "error": "缺少 id 字段"}), 400

    entry_id = data["id"]
    success = delete_entry(entry_id)

    if not success:
        return jsonify({"success": False, "error": "未找到该记录"}), 404

    return jsonify({"success": True, "removed": 1})


if __name__ == "__main__":
    print()
    print("  ╔══════════════════════════════╗")
    print("  ║   AI 智能记账助手 (Web版)    ║")
    print("  ╚══════════════════════════════╝")
    print()
    print(f"  访问地址：http://localhost:5000")
    print()
    app.run(host="0.0.0.0", port=5000, debug=True)
