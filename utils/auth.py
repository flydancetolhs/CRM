# crm_project/utils/auth.py

from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """用戶註冊"""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    
    from app import db
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """用戶登錄並返回JWT"""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    remember = data.get("remember", False) # 獲取"記住我"選項

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # 根據"記住我"選項設置過期時間
        if remember:
            # 對於"記住我"，我們使用刷新令牌來實現長期登錄
            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            return jsonify(access_token=access_token, refresh_token=refresh_token)
        else:
            # 普通登錄，只返回訪問令牌
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token)

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """刷新訪問令牌"""
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token)

@auth_bp.route("/profile")
@jwt_required()
def profile():
    """受保護的路由，返回用戶信息"""
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user)
