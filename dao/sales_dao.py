_# crm_project/dao/sales_dao.py_

from .base_dao import BaseDAO
from models.sales import SalesOpportunity
from patterns.query_strategy import QueryStrategy, SimpleQueryStrategy, AmountRangeQueryStrategy

class SalesDAO(BaseDAO):
    """銷售機會數據訪問對象"""

    def __init__(self):
        super().__init__(SalesOpportunity)

    def search(self, params):
        """
        使用策略模式進行多條件查詢
        :param params: 查詢參數字典
        :return: 查詢結果
        """
        query = self.model.query
        
        strategies = {
            'name': SimpleQueryStrategy('name'),
            'customer_name': SimpleQueryStrategy('customer_name'),
            'stage': SimpleQueryStrategy('stage'),
            'min_amount': AmountRangeQueryStrategy('min_amount'),
            'max_amount': AmountRangeQueryStrategy('max_amount')
        }

        for key, value in params.items():
            if key in strategies and value is not None:
                strategy = strategies[key]
                query = strategy.execute(query, self.model, value)

        return query.all()
