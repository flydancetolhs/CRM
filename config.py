_# crm_project/config.py_

import os

class Config:
    """Flask配置"""
    # 密鑰，用於簽名，如session, cookie, and other things
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-hard-to-guess-string'

    # 數據庫配置
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT配置
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another-super-secret-key'
    # JWT過期時間（秒）
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1小時
    # JWT刷新令牌過期時間（天）
    JWT_REFRESH_TOKEN_EXPIRES = 30    # 30天
