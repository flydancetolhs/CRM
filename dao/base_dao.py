_# crm_project/dao/base_dao.py_

from app import db

class BaseDAO:
    """基礎數據訪問對象，封裝通用CRUD操作"""

    def __init__(self, model):
        self.model = model

    def get_all(self):
        return self.model.query.all()

    def get_by_id(self, id):
        return self.model.query.get(id)

    def create(self, data):
        instance = self.model(**data)
        db.session.add(instance)
        db.session.commit()
        return instance

    def update(self, id, data):
        instance = self.get_by_id(id)
        if instance:
            for key, value in data.items():
                setattr(instance, key, value)
            db.session.commit()
        return instance

    def delete(self, id):
        instance = self.get_by_id(id)
        if instance:
            db.session.delete(instance)
            db.session.commit()
        return instance
