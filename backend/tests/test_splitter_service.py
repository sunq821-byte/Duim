import pytest
from backend.services.splitter_service import (
    split_text, _extract_leading_date, _has_date
)


class TestDateExtraction:
    def test_extract_leading_date_with_shihou(self):
        assert _extract_leading_date("5月20日的时候早上买咖啡15") == "5月20日的时候"

    def test_extract_leading_date_bare(self):
        assert _extract_leading_date("5月20日买咖啡15") == "5月20日"

    def test_extract_leading_date_with_hao(self):
        assert _extract_leading_date("3月5号午饭35") == "3月5号"

    def test_extract_leading_date_with_natian(self):
        assert _extract_leading_date("5月20日那天买咖啡15") == "5月20日那天"

    def test_extract_leading_date_shangzhou(self):
        assert _extract_leading_date("上周五买书50") == "上周五"

    def test_extract_leading_date_benzhou(self):
        assert _extract_leading_date("本周三吃饭100") == "本周三"

    def test_extract_no_date(self):
        assert _extract_leading_date("午饭35，晚饭50") == ""

    def test_extract_relative_date_not_extracted(self):
        # 今天/昨天等由 LLM 处理，不需要传播
        assert _extract_leading_date("今天午饭35") == ""


class TestHasDate:
    def test_has_absolute_date(self):
        assert _has_date("5月20日的时候早上买咖啡15") is True

    def test_has_relative_date(self):
        assert _has_date("今天午饭35") is True

    def test_has_no_date(self):
        assert _has_date("中午吃饭35") is False

    def test_has_shangzhou_date(self):
        assert _has_date("上周五买书50") is True


class TestSplitTextDatePropagation:
    def test_propagates_date_to_segments_without_date(self):
        """核心场景：开头日期补齐到后续无日期子句。"""
        result = split_text("5月20日的时候早上买咖啡15，中午吃饭35，下午奶茶18")
        assert len(result) == 3
        # 所有子句都应包含日期
        for seg in result:
            assert "5月20日" in seg

    def test_no_propagation_when_no_leading_date(self):
        """无开头日期时不传播。"""
        result = split_text("午饭35，晚饭50")
        assert len(result) == 2

    def test_no_propagation_when_each_has_own_date(self):
        """每个子句各有日期时不传播。"""
        result = split_text("5月20日午饭35，5月21日晚饭50")
        assert len(result) == 2
        assert "5月20日" in result[0]
        assert "5月21日" in result[1]

    def test_propagation_with_hao_format(self):
        result = split_text("3月5号午饭35，晚饭50")
        assert len(result) == 2
        for seg in result:
            assert "3月5号" in seg

    def test_single_segment_no_propagation_needed(self):
        """单段不需要传播。"""
        result = split_text("5月20日的时候早上买咖啡15")
        assert len(result) == 1
