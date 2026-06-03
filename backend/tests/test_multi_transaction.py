import pytest
from unittest.mock import patch
from backend.services.intent_service import detect_intent
from backend.services.extract_service import parse_expense, parse_income, parse_schedule


class TestMultiTransactionPipeline:
    """用 mock LLM 验证完整链路：意图识别 → 信息提取 → JSON 解析。"""

    @patch("backend.services.intent_service.call_llm")
    def test_intent_expense(self, mock_llm):
        mock_llm.return_value = '{"intent":"expense"}'
        result = detect_intent("今天午饭35")
        assert result["intent"] == "expense"
        assert result["query_category"] is None

    @patch("backend.services.intent_service.call_llm")
    def test_intent_schedule(self, mock_llm):
        mock_llm.return_value = '{"intent":"schedule"}'
        result = detect_intent("明天下午3点开会提醒我")
        assert result["intent"] == "schedule"

    @patch("backend.services.intent_service.call_llm")
    def test_intent_multi_expense(self, mock_llm):
        mock_llm.return_value = '{"intent":"expense"}'
        result = detect_intent("今天午饭35，晚上打车20")
        assert result["intent"] == "expense"

    @patch("backend.services.intent_service.call_llm")
    def test_intent_query_with_filter(self, mock_llm):
        mock_llm.return_value = '{"intent":"query","query_type":"expense","query_category":"交通","query_keyword":"打车"}'
        result = detect_intent("我打车一共花了多少钱")
        assert result["intent"] == "query"
        assert result["query_type"] == "expense"
        assert result["query_category"] == "交通"
        assert result["query_keyword"] == "打车"

    @patch("backend.services.intent_service.call_llm")
    def test_intent_query_overview(self, mock_llm):
        mock_llm.return_value = '{"intent":"query","query_type":"expense","query_category":null,"query_keyword":null}'
        result = detect_intent("这个月花了多少")
        assert result["intent"] == "query"
        assert result["query_type"] == "expense"
        assert result["query_category"] is None
        assert result["query_keyword"] is None

    @patch("backend.services.intent_service.call_llm")
    def test_intent_query_schedule(self, mock_llm):
        mock_llm.return_value = '{"intent":"query","query_type":"schedule","query_category":null,"query_keyword":"安排"}'
        result = detect_intent("明天有什么安排")
        assert result["intent"] == "query"
        assert result["query_type"] == "schedule"
        assert result["query_keyword"] == "安排"

    @patch("backend.services.extract_service.call_llm")
    def test_parse_single_expense(self, mock_llm):
        today = "2026-05-22"
        mock_llm.return_value = (
            f'[{{"type":"expense","category":"餐饮","amount":35,"time":"{today}","note":"午饭"}}]'
        )
        result = parse_expense("今天午饭35", stream=False)
        assert len(result) == 1
        assert result[0]["type"] == "expense"
        assert result[0]["category"] == "餐饮"
        assert result[0]["amount"] == 35

    @patch("backend.services.extract_service.call_llm")
    def test_parse_multi_expense(self, mock_llm):
        today = "2026-05-22"
        mock_llm.return_value = (
            f'['
            f'{{"type":"expense","category":"餐饮","amount":35,"time":"{today}","note":"午饭"}},'
            f'{{"type":"expense","category":"交通","amount":20,"time":"{today}","note":"打车"}}'
            f']'
        )
        result = parse_expense("今天午饭35，晚上打车20", stream=False)
        assert len(result) == 2
        assert result[0]["category"] == "餐饮"
        assert result[0]["amount"] == 35
        assert result[1]["category"] == "交通"
        assert result[1]["amount"] == 20

    @patch("backend.services.extract_service.call_llm")
    def test_parse_schedule(self, mock_llm):
        tomorrow = "2026-05-23"
        mock_llm.return_value = (
            f'{{"schedules":['
            f'{{"type":"schedule","title":"开会","time":"{tomorrow} 15:00",'
            f'"remind_time":"{tomorrow} 14:30","repeat_type":"none","note":"提醒"}}'
            f']}}'
        )
        result = parse_schedule("明天下午3点开会提醒我", stream=False)
        assert len(result) == 1
        assert result[0]["type"] == "schedule"
        assert result[0]["title"] == "开会"

    @patch("backend.services.extract_service.call_llm")
    def test_parse_mixed_types_not_supported_yet(self, mock_llm):
        """混合类型输入（支出+日程）当前只能由 intent 路由到单一解析器。
        这是 V2 多事务拆分的已知限制，先记录此行为。"""
        mock_llm.return_value = (
            '[{"type":"expense","category":"餐饮","amount":35,"time":"2026-05-22","note":"午饭"}]'
        )
        result = parse_expense("今天午饭35，明天下午3点开会提醒我", stream=False)
        assert len(result) >= 1
        assert result[0]["type"] == "expense"
