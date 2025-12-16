_# crm_project/controllers/sales_controller.py_

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.sales_service import SalesService

# 創建藍圖
sales_bp = Blueprint("sales", __name__)

# 實例化服務
sales_service = SalesService()

@sales_bp.route("/opportunities", methods=["GET"])
@jwt_required()
def get_opportunities():
    """獲取所有或搜索銷售機會"""
    search_params = {
        "name": request.args.get("name"),
        "customer_name": request.args.get("customer_name"),
        "stage": request.args.get("stage"),
        "min_amount": request.args.get("min_amount", type=float),
        "max_amount": request.args.get("max_amount", type=float),
    }
    
    # 過濾掉值為None的參數
    search_params = {k: v for k, v in search_params.items() if v is not None}

    if search_params:
        opportunities = sales_service.search_opportunities(search_params)
    else:
        opportunities = sales_service.get_all_opportunities()
        
    return jsonify(opportunities)

@sales_bp.route("/opportunities/<int:id>", methods=["GET"])
@jwt_required()
def get_opportunity(id):
    """根據ID獲取單個銷售機會"""
    opportunity = sales_service.get_opportunity_by_id(id)
    if opportunity:
        return jsonify(opportunity)
    return jsonify({"error": "Opportunity not found"}), 404

@sales_bp.route("/opportunities", methods=["POST"])
@jwt_required()
def create_opportunity():
    """創建新的銷售機會"""
    data = request.get_json()
    try:
        new_opportunity = sales_service.create_opportunity(data)
        return jsonify(new_opportunity), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@sales_bp.route("/opportunities/<int:id>", methods=["PUT"])
@jwt_required()
def update_opportunity(id):
    """更新銷售機會"""
    data = request.get_json()
    updated_opportunity = sales_service.update_opportunity(id, data)
    if updated_opportunity:
        return jsonify(updated_opportunity)
    return jsonify({"error": "Opportunity not found"}), 404

@sales_bp.route("/opportunities/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_opportunity(id):
    """刪除銷售機會"""
    deleted_opportunity = sales_service.delete_opportunity(id)
    if deleted_opportunity:
        return jsonify({"message": "Opportunity deleted successfully"})
    return jsonify({"error": "Opportunity not found"}), 404
