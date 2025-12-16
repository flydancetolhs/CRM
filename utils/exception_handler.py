_# crm_project/utils/exception_handler.py_

from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    """註冊全局異常處理器"""

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        """處理HTTP異常"""
        response = e.get_response()
        response.data = jsonify({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }).data
        response.content_type = "application/json"
        return response

    @app.errorhandler(ValueError)
    def handle_value_error(e):
        """處理ValueError"""
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """處理所有其他未捕獲的異常"""
        # 在生產環境中，這裡應該記錄詳細的錯誤日誌
        return jsonify({
            "error": "An unexpected error occurred.",
            "details": str(e) # 僅在調試模式下顯示
        }), 500
