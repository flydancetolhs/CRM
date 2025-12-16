# crm_project/app.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

from config import Config
from utils.exception_handler import register_error_handlers
from controllers.sales_controller import sales_bp

# 創建Flask應用實例
app = Flask(__name__)

# 加載配置文件
app.config.from_object(Config)

# 初始化數據庫
db = SQLAlchemy(app)

# 初始化JWT管理器
jwt = JWTManager(app)

# 註冊全局異常處理器
register_error_handlers(app)

# 註冊藍圖
app.register_blueprint(sales_bp, url_prefix='/api/sales')

@app.route('/')
def index():
    return "Welcome to the CRM API!"

if __name__ == '__main__':
    app.run(debug=True)
