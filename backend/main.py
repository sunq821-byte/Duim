import sys
import os

# Ensure project root is on sys.path for `from backend.xxx` imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.intent_service import detect_intent
from backend.services.extract_service import (
    parse_expense, parse_income, parse_schedule, parse_modify, parse_delete
)
from backend.services.query_service import answer_query
from backend.services.feedback_service import (
    format_feedback, format_income_feedback, format_schedule_feedback
)
from backend.services.modify_service import execute_modify
from backend.services.delete_service import execute_delete
from backend.repositories.entry_repository import add_entries


def main():
    print()
    print("  ╔══════════════════════════╗")
    print("  ║     AI 智能事务助手      ║")
    print("  ╚══════════════════════════╝")
    print()
    print("  记账：午饭25")
    print("  收入：工资到账15000")
    print("  日程：明天下午3点开会")
    print("  查询：今天花了多少")
    print("  修改：把昨天午饭改成50")
    print("  删除：删除昨天午饭")
    print("  输入 exit 退出")
    print()

    while True:
        try:
            user_input = input("  💬 你 > ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n  再见！")
            break

        if not user_input:
            continue
        if user_input.lower() in ("exit", "quit", "q"):
            print("  再见！")
            break

        try:
            intent_result = detect_intent(user_input)
            intent = intent_result["intent"]

            if intent == "expense":
                data_list = parse_expense(user_input)
                add_entries(data_list)
                print(f"  🤖 助手 > {format_feedback(data_list)}\n")

            elif intent == "income":
                data_list = parse_income(user_input)
                add_entries(data_list)
                print(f"  🤖 助手 > {format_income_feedback(data_list)}\n")

            elif intent == "schedule":
                data_list = parse_schedule(user_input)
                add_entries(data_list)
                print(f"  🤖 助手 > {format_schedule_feedback(data_list)}\n")

            elif intent == "modify":
                modify_data = parse_modify(user_input)
                result = execute_modify(modify_data)
                if result["success"]:
                    print(f"  🤖 助手 > {result['feedback']}\n")
                else:
                    print(f"  🤖 助手 > {result['error']}\n")

            elif intent == "delete":
                delete_data = parse_delete(user_input)
                result = execute_delete(delete_data)
                if result["success"]:
                    print(f"  🤖 助手 > {result['feedback']}\n")
                else:
                    print(f"  🤖 助手 > {result['error']}\n")

            elif intent == "query":
                result = answer_query(
                    user_input,
                    query_type=intent_result["query_type"],
                    category=intent_result["query_category"],
                    keyword=intent_result["query_keyword"],
                )
                print(f"  🤖 助手 > {result['feedback']}\n")

            else:
                print("  🤖 助手 > 我是智能事务助手，可以记账、记收入、创建日程、查询和修改记录。\n")

        except Exception as e:
            print(f"  ❌ 错误：{e}\n")


if __name__ == "__main__":
    main()
