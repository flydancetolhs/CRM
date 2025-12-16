_# crm_project/patterns/query_strategy.py_

from abc import ABC, abstractmethod

class QueryStrategy(ABC):
    """查詢策略接口"""
    @abstractmethod
    def execute(self, query, model, value):
        pass

class SimpleQueryStrategy(QueryStrategy):
    """簡單的完全匹配查詢策略"""
    def __init__(self, field_name):
        self.field_name = field_name

    def execute(self, query, model, value):
        return query.filter(getattr(model, self.field_name) == value)

class AmountRangeQueryStrategy(QueryStrategy):
    """金額範圍查詢策略"""
    def __init__(self, boundary_type): # boundary_type可以是 'min_amount' 或 'max_amount'
        self.boundary_type = boundary_type

    def execute(self, query, model, value):
        if self.boundary_type == 'min_amount':
            return query.filter(model.amount >= value)
        elif self.boundary_type == 'max_amount':
            return query.filter(model.amount <= value)
        return query

class LikeQueryStrategy(QueryStrategy):
    """模糊查詢策略"""
    def __init__(self, field_name):
        self.field_name = field_name

    def execute(self, query, model, value):
        return query.filter(getattr(model, self.field_name).like(f"%{value}%"))
