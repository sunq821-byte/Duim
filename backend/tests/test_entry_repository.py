import pytest
import os
from backend.repositories.entry_repository import (
    add_entries, get_all_entries, get_entries_in_range,
    delete_entry, update_entry, find_matching_entries
)
from backend.database.connection import init_db


@pytest.fixture(autouse=True)
def fresh_db(tmp_path, monkeypatch):
    """每个测试使用独立临时数据库。"""
    db_path = tmp_path / "test.db"
    import backend.database.connection as conn_module
    monkeypatch.setattr(conn_module, "DB_PATH", str(db_path))
    monkeypatch.setattr(conn_module, "DB_DIR", str(tmp_path))
    # Re-init with new path
    init_db()


class TestAddAndGet:
    def test_add_single_expense(self):
        entries = add_entries([
            {"type": "expense", "category": "餐饮", "amount": 35.0,
             "time": "2026-05-22", "note": "午饭"}
        ])
        assert len(entries) == 1
        assert entries[0]["id"] == 1
        assert entries[0]["type"] == "expense"

    def test_add_multiple_types(self):
        add_entries([
            {"type": "expense", "category": "餐饮", "amount": 35.0, "time": "2026-05-22"},
            {"type": "income", "category": "工资", "amount": 15000.0, "time": "2026-05-20"},
            {"type": "schedule", "title": "开会", "time": "2026-05-23"},
        ])
        assert len(get_all_entries()) == 3

    def test_add_returns_with_id(self):
        entries = add_entries([{"type": "expense", "amount": 10}])
        assert "id" in entries[0]
        assert isinstance(entries[0]["id"], int)


class TestGetAll:
    def test_empty_db(self):
        assert get_all_entries() == []

    def test_order_desc_by_id(self):
        add_entries([
            {"type": "expense", "amount": 10, "time": "2026-01-01"},
            {"type": "expense", "amount": 20, "time": "2026-01-02"},
        ])
        all_e = get_all_entries()
        assert all_e[0]["id"] > all_e[1]["id"]


class TestGetInRange:
    def test_filters_by_date(self):
        add_entries([
            {"type": "expense", "amount": 10, "time": "2026-05-20"},
            {"type": "expense", "amount": 20, "time": "2026-05-22"},
            {"type": "expense", "amount": 30, "time": "2026-05-25"},
        ])
        result = get_entries_in_range("2026-05-21", "2026-05-23")
        assert len(result) == 1
        assert result[0]["amount"] == 20

    def test_empty_range(self):
        add_entries([{"type": "expense", "amount": 10, "time": "2026-05-20"}])
        result = get_entries_in_range("2026-06-01", "2026-06-30")
        assert result == []


class TestDelete:
    def test_delete_existing(self):
        entries = add_entries([{"type": "expense", "amount": 10}])
        ok = delete_entry(entries[0]["id"])
        assert ok is True
        assert get_all_entries() == []

    def test_delete_nonexistent(self):
        ok = delete_entry(999)
        assert ok is False


class TestUpdate:
    def test_update_amount(self):
        entries = add_entries([{"type": "expense", "amount": 10}])
        ok = update_entry(entries[0]["id"], {"amount": 25.0})
        assert ok is True
        updated = get_all_entries()[0]
        assert updated["amount"] == 25.0

    def test_update_multiple_fields(self):
        entries = add_entries([{"type": "expense", "amount": 10, "note": "old"}])
        update_entry(entries[0]["id"], {"amount": 30, "note": "new note"})
        e = get_all_entries()[0]
        assert e["amount"] == 30
        assert e["note"] == "new note"

    def test_update_nonexistent(self):
        ok = update_entry(999, {"amount": 99})
        assert ok is False

    def test_update_empty(self):
        entries = add_entries([{"type": "expense", "amount": 10}])
        ok = update_entry(entries[0]["id"], {})
        assert ok is False

    def test_update_ignores_invalid_fields(self):
        entries = add_entries([{"type": "expense", "amount": 10}])
        ok = update_entry(entries[0]["id"], {"id": 999, "amount": 50})
        assert ok is True
        e = get_all_entries()[0]
        assert e["id"] == entries[0]["id"]


class TestFindMatching:
    def test_find_by_note(self):
        add_entries([
            {"type": "expense", "category": "餐饮", "amount": 35, "note": "午饭"},
            {"type": "expense", "category": "交通", "amount": 20, "note": "打车"},
        ])
        matched = find_matching_entries({"note": "午饭"})
        assert len(matched) == 1
        assert matched[0]["amount"] == 35

    def test_find_by_type_filter(self):
        add_entries([
            {"type": "expense", "amount": 35, "note": "test"},
            {"type": "income", "amount": 100, "note": "test"},
        ])
        matched = find_matching_entries({"note": "test"}, entry_type="income")
        assert len(matched) == 1
        assert matched[0]["type"] == "income"

    def test_find_no_match(self):
        add_entries([{"type": "expense", "amount": 10, "note": "lunch"}])
        matched = find_matching_entries({"note": "nonexistent"})
        assert matched == []

    def test_find_case_insensitive(self):
        add_entries([{"type": "expense", "note": "Lunch"}])
        matched = find_matching_entries({"note": "lunch"})
        assert len(matched) == 1

    def test_find_income_by_note_searches_category_and_source(self):
        """收入记录的描述在 category/source 中，note 为空，搜索 note 时也应匹配"""
        add_entries([
            {"type": "income", "category": "红包", "amount": 200,
             "time": "2026-05-23", "source": "红包", "note": ""},
        ])
        matched = find_matching_entries({"note": "红包"}, entry_type="income")
        assert len(matched) == 1
        assert matched[0]["category"] == "红包"

    def test_find_income_by_note_searches_category_partial(self):
        """部分匹配也应生效"""
        add_entries([
            {"type": "income", "category": "工资", "amount": 15000,
             "time": "2026-05-23", "source": "工资", "note": ""},
        ])
        matched = find_matching_entries({"note": "工资"}, entry_type="income")
        assert len(matched) == 1

    def test_ignores_invalid_column(self):
        """LLM 幻觉出的列名不应导致 SQL 错误"""
        add_entries([{"type": "expense", "note": "test", "amount": 10}])
        matched = find_matching_entries({"nonexistent_col": "value", "note": "test"})
        assert len(matched) == 1
