import pytest
from datetime import datetime
from backend.utils.time_utils import parse_date_range, normalize_date_string


def today_str() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def yesterday_str() -> str:
    from datetime import timedelta
    return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")


def day_before_str() -> str:
    from datetime import timedelta
    return (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")


def tomorrow_str() -> str:
    from datetime import timedelta
    return (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")


def day_after_str() -> str:
    from datetime import timedelta
    return (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")


def monday_str() -> str:
    from datetime import timedelta
    now = datetime.now()
    return (now - timedelta(days=now.weekday())).strftime("%Y-%m-%d")


def month_start_str() -> str:
    return datetime.now().strftime("%Y-%m") + "-01"


class TestDateRangeParsing:
    def test_today(self):
        start, end = parse_date_range("今天花了多少钱")
        t = today_str()
        assert start == t
        assert end == t

    def test_yesterday(self):
        start, end = parse_date_range("昨天吃饭了吗")
        y = yesterday_str()
        assert start == y
        assert end == y

    def test_day_before(self):
        start, end = parse_date_range("前天买了什么")
        d = day_before_str()
        assert start == d
        assert end == d

    def test_tomorrow(self):
        start, end = parse_date_range("明天有什么安排")
        t = tomorrow_str()
        assert start == t
        assert end == t

    def test_day_after(self):
        start, end = parse_date_range("后天有什么计划")
        d = day_after_str()
        assert start == d
        assert end == d

    def test_day_after_3(self):
        from datetime import timedelta
        start, end = parse_date_range("大后天出差")
        expected = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
        assert start == expected
        assert end == expected

    def test_day_before_3(self):
        from datetime import timedelta
        start, end = parse_date_range("大前天买了什么")
        expected = (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")
        assert start == expected
        assert end == expected

    def test_this_month(self):
        start, end = parse_date_range("这个月一共花了多少")
        assert start == month_start_str()
        assert end == today_str()

    def test_ben_yue(self):
        start, end = parse_date_range("本月消费统计")
        assert start == month_start_str()
        assert end == today_str()

    def test_this_week(self):
        start, end = parse_date_range("这周花了多少")
        assert start == monday_str()
        assert end == today_str()

    def test_ben_zhou(self):
        start, end = parse_date_range("本周记录")
        assert start == monday_str()
        assert end == today_str()

    def test_recent_n_days(self):
        start, end = parse_date_range("最近3天消费")
        from datetime import timedelta
        expected_start = (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")
        assert start == expected_start
        assert end == today_str()

    def test_recent_default(self):
        start, end = parse_date_range("最近花了多少")
        from datetime import timedelta
        expected_start = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        assert start == expected_start
        assert end == today_str()

    def test_all_records(self):
        start, end = parse_date_range("查看所有记录")
        assert start == "2000-01-01"
        assert end == today_str()

    def test_all_variants(self):
        for kw in ["全部记录", "一共有多少"]:
            start, end = parse_date_range(kw)
            assert start == "2000-01-01"
            assert end == today_str()

    def test_default_fallback(self):
        start, end = parse_date_range("这是什么随便说的话")
        t = today_str()
        assert start == t
        assert end == t


class TestNormalizeDateString:
    def test_today(self):
        result = normalize_date_string("今天")
        assert result == today_str()

    def test_yesterday(self):
        result = normalize_date_string("昨天")
        assert result == yesterday_str()

    def test_tomorrow(self):
        result = normalize_date_string("明天")
        assert result == tomorrow_str()

    def test_day_before(self):
        result = normalize_date_string("前天")
        assert result == day_before_str()

    def test_day_after(self):
        result = normalize_date_string("后天")
        assert result == day_after_str()

    def test_with_time_suffix(self):
        """带时间后缀的词仍能正确替换"""
        result = normalize_date_string("今天下午")
        t = today_str()
        assert result == f"{t}下午"

    def test_no_relative_date(self):
        """不含相对日期的字符串原样返回"""
        result = normalize_date_string("午饭")
        assert result == "午饭"

    def test_absolute_date_unchanged(self):
        """已是绝对日期的字符串不会被修改"""
        result = normalize_date_string("2026-05-23")
        assert result == "2026-05-23"

    def test_long_keyword_first(self):
        """大前天不会只替换'前天'部分"""
        from datetime import timedelta
        result = normalize_date_string("大前天")
        expected = (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")
        assert result == expected
