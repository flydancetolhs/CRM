# crm_project/models/sales.py

from app import db
import datetime

class SalesOpportunity(db.Model):
    """營銷機會模型"""
    __tablename__ = 'sales_opportunities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    customer_name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    stage = db.Column(db.String(64), default='初期') # 例如：初期, 跟進中, 談判中, 成交, 失敗
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<SalesOpportunity {self.name}>'

    def to_dict(self):
        """將對象轉換為字典"""
        return {
            'id': self.id,
            'name': self.name,
            'customer_name': self.customer_name,
            'amount': self.amount,
            'stage': self.stage,
            'created_at': self.created_at.isoformat()
        }
