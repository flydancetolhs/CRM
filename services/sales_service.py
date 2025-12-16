_# crm_project/services/sales_service.py_

from dao.sales_dao import SalesDAO

class SalesService:
    """銷售機會業務邏輯層"""

    def __init__(self):
        self.sales_dao = SalesDAO()

    def get_all_opportunities(self):
        """獲取所有銷售機會"""
        return [opp.to_dict() for opp in self.sales_dao.get_all()]

    def get_opportunity_by_id(self, id):
        """根據ID獲取銷售機會"""
        opp = self.sales_dao.get_by_id(id)
        return opp.to_dict() if opp else None

    def create_opportunity(self, data):
        """創建銷售機會"""
        # 在這裡可以添加業務邏輯，例如數據驗證、權限檢查等
        if not data.get('name') or not data.get('customer_name') or not data.get('amount'):
            raise ValueError("缺少必要的機會信息")
        
        new_opp = self.sales_dao.create(data)
        return new_opp.to_dict()

    def update_opportunity(self, id, data):
        """更新銷售機會"""
        updated_opp = self.sales_dao.update(id, data)
        return updated_opp.to_dict() if updated_opp else None

    def delete_opportunity(self, id):
        """刪除銷售機會"""
        deleted_opp = self.sales_dao.delete(id)
        return deleted_opp.to_dict() if deleted_opp else None

    def search_opportunities(self, params):
        """搜索銷售機會"""
        return [opp.to_dict() for opp in self.sales_dao.search(params)]
