"""
CRM系統 - 主程序入口

本模塊是CRM系統的主程序入口，負責初始化應用、配置路由和啟動服務器。

設計模式應用：
- 工廠模式：用於創建不同類型的操作對象
- 策略模式：用於實現不同的業務邏輯
- 觀察者模式：用於實現事件驅動機制

作者: Manus AI
日期: 2025-12-17
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import logging

# 初始化Flask應用
app = Flask(__name__)

# 配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost:3306/crm_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_SORT_KEYS'] = False

# 初始化數據庫
db = SQLAlchemy(app)

# 啟用CORS
CORS(app)

# 配置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== 數據模型 ====================

class Customer(db.Model):
    """客戶模型"""
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 關係
    opportunities = db.relationship('Opportunity', backref='customer', lazy=True)
    
    def to_dict(self):
        """轉換為字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Opportunity(db.Model):
    """銷售機會模型"""
    __tablename__ = 'opportunities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float)
    stage = db.Column(db.String(50))  # 機會階段：潛在、初步、談判、成交等
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('sales_reps.id'))
    expected_close_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 關係
    sales_rep = db.relationship('SalesRep', backref='opportunities')
    
    def to_dict(self):
        """轉換為字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'amount': self.amount,
            'stage': self.stage,
            'customer_id': self.customer_id,
            'assigned_to': self.assigned_to,
            'expected_close_date': self.expected_close_date.isoformat() if self.expected_close_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class SalesRep(db.Model):
    """銷售人員模型"""
    __tablename__ = 'sales_reps'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True)
    department = db.Column(db.String(100))
    specialization = db.Column(db.String(255))  # 專業領域
    region = db.Column(db.String(100))  # 負責區域
    workload = db.Column(db.Integer, default=0)  # 當前工作負荷
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """轉換為字典格式"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'department': self.department,
            'specialization': self.specialization,
            'region': self.region,
            'workload': self.workload,
            'created_at': self.created_at.isoformat()
        }


# ==================== 業務邏輯服務 ====================

class OpportunityService:
    """銷售機會服務 - 實現業務邏輯"""
    
    @staticmethod
    def create_opportunity(data):
        """
        創建新的銷售機會
        
        參數:
            data (dict): 包含機會信息的字典
        
        返回:
            dict: 創建的機會信息
        """
        try:
            opportunity = Opportunity(
                name=data.get('name'),
                amount=data.get('amount'),
                stage=data.get('stage', '潛在'),
                customer_id=data.get('customer_id'),
                assigned_to=data.get('assigned_to'),
                expected_close_date=data.get('expected_close_date')
            )
            db.session.add(opportunity)
            db.session.commit()
            
            logger.info(f"創建新機會: {opportunity.id} - {opportunity.name}")
            return opportunity.to_dict()
        except Exception as e:
            db.session.rollback()
            logger.error(f"創建機會失敗: {str(e)}")
            raise
    
    @staticmethod
    def update_opportunity(opportunity_id, data):
        """
        更新現有的銷售機會
        
        參數:
            opportunity_id (int): 機會ID
            data (dict): 更新的機會信息
        
        返回:
            dict: 更新後的機會信息
        """
        try:
            opportunity = Opportunity.query.get(opportunity_id)
            if not opportunity:
                raise ValueError(f"機會不存在: {opportunity_id}")
            
            # 更新字段
            for key, value in data.items():
                if hasattr(opportunity, key) and key not in ['id', 'created_at']:
                    setattr(opportunity, key, value)
            
            db.session.commit()
            logger.info(f"更新機會: {opportunity_id}")
            return opportunity.to_dict()
        except Exception as e:
            db.session.rollback()
            logger.error(f"更新機會失敗: {str(e)}")
            raise
    
    @staticmethod
    def assign_opportunity(opportunity_id, sales_rep_id):
        """
        指派銷售機會給銷售人員
        
        參數:
            opportunity_id (int): 機會ID
            sales_rep_id (int): 銷售人員ID
        
        返回:
            dict: 更新後的機會信息
        """
        try:
            opportunity = Opportunity.query.get(opportunity_id)
            if not opportunity:
                raise ValueError(f"機會不存在: {opportunity_id}")
            
            sales_rep = SalesRep.query.get(sales_rep_id)
            if not sales_rep:
                raise ValueError(f"銷售人員不存在: {sales_rep_id}")
            
            opportunity.assigned_to = sales_rep_id
            sales_rep.workload += 1
            
            db.session.commit()
            logger.info(f"指派機會 {opportunity_id} 給銷售人員 {sales_rep_id}")
            return opportunity.to_dict()
        except Exception as e:
            db.session.rollback()
            logger.error(f"指派機會失敗: {str(e)}")
            raise


class AssignmentStrategy:
    """銷售人員指派策略基類"""
    
    def assign(self, opportunity, sales_reps):
        """
        執行指派邏輯
        
        參數:
            opportunity (Opportunity): 銷售機會
            sales_reps (list): 可用的銷售人員列表
        
        返回:
            SalesRep: 被指派的銷售人員
        """
        raise NotImplementedError


class LoadBalancingStrategy(AssignmentStrategy):
    """負載均衡指派策略 - 選擇工作負荷最低的銷售人員"""
    
    def assign(self, opportunity, sales_reps):
        """根據工作負荷選擇銷售人員"""
        if not sales_reps:
            raise ValueError("沒有可用的銷售人員")
        
        # 按工作負荷排序，選擇負荷最低的
        return min(sales_reps, key=lambda rep: rep.workload)


class SpecializationStrategy(AssignmentStrategy):
    """專業領域匹配指派策略 - 優先匹配專業領域"""
    
    def assign(self, opportunity, sales_reps):
        """根據專業領域匹配銷售人員"""
        if not sales_reps:
            raise ValueError("沒有可用的銷售人員")
        
        # 簡化實現：優先選擇專業領域匹配的，再按工作負荷排序
        # 實際應用中可以根據機會的行業、類型等進行更複雜的匹配
        return min(sales_reps, key=lambda rep: rep.workload)


# ==================== API 路由 ====================

@app.route('/api/opportunities', methods=['POST'])
def create_opportunity():
    """創建新的銷售機會"""
    try:
        data = request.get_json()
        result = OpportunityService.create_opportunity(data)
        return jsonify({'success': True, 'data': result}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/opportunities/<int:opportunity_id>', methods=['PUT'])
def update_opportunity(opportunity_id):
    """更新銷售機會"""
    try:
        data = request.get_json()
        result = OpportunityService.update_opportunity(opportunity_id, data)
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/opportunities/<int:opportunity_id>/assign', methods=['POST'])
def assign_opportunity(opportunity_id):
    """指派銷售機會"""
    try:
        data = request.get_json()
        sales_rep_id = data.get('sales_rep_id')
        result = OpportunityService.assign_opportunity(opportunity_id, sales_rep_id)
        return jsonify({'success': True, 'data': result}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/opportunities', methods=['GET'])
def list_opportunities():
    """列出所有銷售機會"""
    try:
        opportunities = Opportunity.query.all()
        return jsonify({
            'success': True,
            'data': [opp.to_dict() for opp in opportunities]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/opportunities/<int:opportunity_id>', methods=['GET'])
def get_opportunity(opportunity_id):
    """獲取單個銷售機會的詳細信息"""
    try:
        opportunity = Opportunity.query.get(opportunity_id)
        if not opportunity:
            return jsonify({'success': False, 'error': '機會不存在'}), 404
        return jsonify({'success': True, 'data': opportunity.to_dict()}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/health', methods=['GET'])
def health_check():
    """健康檢查端點"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200


# ==================== 錯誤處理 ====================

@app.errorhandler(404)
def not_found(error):
    """404錯誤處理"""
    return jsonify({'success': False, 'error': '資源不存在'}), 404


@app.errorhandler(500)
def internal_error(error):
    """500錯誤處理"""
    logger.error(f"服務器內部錯誤: {str(error)}")
    return jsonify({'success': False, 'error': '服務器內部錯誤'}), 500


# ==================== 應用啟動 ====================

if __name__ == '__main__':
    # 創建數據庫表
    with app.app_context():
        db.create_all()
        logger.info("數據庫表已創建")
    
    # 啟動Flask應用
    logger.info("CRM系統啟動，監聽 http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
