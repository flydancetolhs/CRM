_# crm_project/models/user.py_

from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """用戶模型"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        """設置密碼"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """檢查密碼"""
        return check_password_hash(self.password_hash, password)
