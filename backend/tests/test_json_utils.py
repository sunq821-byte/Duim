import pytest
from backend.utils.json_utils import extract_json_list, extract_json_object


class TestExtractJsonList:
    def test_simple_array(self):
        raw = '[{"type": "expense", "amount": 35}]'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]

    def test_array_with_markdown_fence(self):
        raw = '```json\n[{"type": "expense", "amount": 35}]\n```'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]

    def test_single_object_wrapped(self):
        raw = '{"type": "expense", "amount": 35}'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]

    def test_single_object_in_markdown(self):
        raw = '```\n{"type": "expense", "amount": 35}\n```'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]

    def test_object_with_extra_text(self):
        raw = '{"type": "expense", "amount": 35} some trailing text'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]

    def test_required_fields_pass(self):
        raw = '[{"type": "expense", "amount": 35, "time": "today"}]'
        result = extract_json_list(raw, required_fields={"type", "amount"})
        assert len(result) == 1

    def test_required_fields_missing(self):
        raw = '[{"type": "expense"}]'
        with pytest.raises(ValueError, match="缺少字段"):
            extract_json_list(raw, required_fields={"type", "amount"})

    def test_invalid_json(self):
        with pytest.raises(ValueError):
            extract_json_list("this is not json at all")

    def test_empty_with_braces(self):
        raw = '{"type": "expense", "amount": 35} extra text'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]

    def test_chinese_mixed_with_json(self):
        raw = '好的，这是结果：\n[{"type": "expense", "amount": 35}]'
        result = extract_json_list(raw)
        assert result == [{"type": "expense", "amount": 35}]


class TestExtractJsonObject:
    def test_simple_object(self):
        raw = '{"type": "modify", "target": "expense"}'
        result = extract_json_object(raw)
        assert result == {"type": "modify", "target": "expense"}

    def test_object_in_markdown(self):
        raw = '```json\n{"type": "modify", "target": "expense"}\n```'
        result = extract_json_object(raw)
        assert result == {"type": "modify", "target": "expense"}

    def test_required_fields_pass(self):
        raw = '{"type": "modify", "match_criteria": {"note": "lunch"}}'
        result = extract_json_object(raw, required_fields={"type"})
        assert result["type"] == "modify"

    def test_required_fields_missing(self):
        raw = '{"target": "expense"}'
        with pytest.raises(ValueError):
            extract_json_object(raw, required_fields={"type"})

    def test_invalid_json_no_braces(self):
        with pytest.raises(ValueError):
            extract_json_object("no braces here")

    def test_invalid_json_bad_format(self):
        with pytest.raises(ValueError):
            extract_json_object("{bad json}")
