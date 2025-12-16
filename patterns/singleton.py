_# crm_project/patterns/singleton.py_

class SingletonMeta(type):
    """
    單例設計模式的元類實現。
    確保一個類只有一個實例，並提供一個全局訪問點。
    """
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]

# --- 使用示例 ---
class DatabaseConnection(metaclass=SingletonMeta):
    """
    一個模擬的數據庫連接類，使用單例模式。
    在實際應用中，框架（如Flask-SQLAlchemy）通常會為我們管理連接池，
    但這是一個很好的單例模式應用示例。
    """
    def __init__(self):
        # 這裡會執行昂貴的初始化操作，例如建立數據庫連接
        print("正在創建數據庫連接...")
        self.connection_id = id(self)

    def query(self, sql):
        print(f"使用連接 {self.connection_id} 執行查詢: {sql}")

# if __name__ == '__main__':
#     # 無論創建多少次，都只會得到同一個實例
#     db_conn1 = DatabaseConnection()
#     db_conn2 = DatabaseConnection()
#
#     print(f"db_conn1 的 ID: {id(db_conn1)}")
#     print(f"db_conn2 的 ID: {id(db_conn2)}")
#     print(f"db_conn1 is db_conn2: {db_conn1 is db_conn2}") # 應該輸出 True
#
#     db_conn1.query("SELECT * FROM users")
#     db_conn2.query("SELECT * FROM sales")
