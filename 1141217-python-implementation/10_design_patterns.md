# CRM系統 - 設計模式應用詳解

## 概述

本文檔詳細說明了在CRM系統設計中應用的各種設計模式，以及它們如何解決實際的架構和設計問題。

---

## 1. 工廠模式 (Factory Pattern)

### 1.1 問題背景

在CRM系統中，我們需要根據不同的操作類型（添加、更新、刪除）創建不同的操作對象。如果直接在客戶端代碼中使用`new`關鍵字創建這些對象，會導致代碼與具體的操作類緊密耦合，不利於系統的擴展和維護。

### 1.2 解決方案

使用工廠模式，創建一個工廠類，負責根據操作類型創建相應的操作對象。

### 1.3 實現示例

```python
class OperationFactory:
    """操作工廠 - 根據操作類型創建相應的操作對象"""
    
    @staticmethod
    def create_operation(operation_type):
        """
        創建操作對象
        
        參數:
            operation_type (str): 操作類型 ('create', 'update', 'delete')
        
        返回:
            Operation: 相應的操作對象
        """
        if operation_type == 'create':
            return CreateOperation()
        elif operation_type == 'update':
            return UpdateOperation()
        elif operation_type == 'delete':
            return DeleteOperation()
        else:
            raise ValueError(f"未知的操作類型: {operation_type}")


class Operation:
    """操作基類"""
    
    def execute(self, data):
        """執行操作"""
        raise NotImplementedError


class CreateOperation(Operation):
    """創建操作"""
    
    def execute(self, data):
        """執行創建操作"""
        # 驗證數據
        self._validate(data)
        # 創建記錄
        return self._create(data)
    
    def _validate(self, data):
        """驗證數據"""
        if not data.get('name'):
            raise ValueError("名稱不能為空")
    
    def _create(self, data):
        """創建記錄"""
        # 實現創建邏輯
        pass


class UpdateOperation(Operation):
    """更新操作"""
    
    def execute(self, data):
        """執行更新操作"""
        # 驗證ID
        if not data.get('id'):
            raise ValueError("ID不能為空")
        # 更新記錄
        return self._update(data)
    
    def _update(self, data):
        """更新記錄"""
        # 實現更新邏輯
        pass


class DeleteOperation(Operation):
    """刪除操作"""
    
    def execute(self, data):
        """執行刪除操作"""
        # 驗證ID
        if not data.get('id'):
            raise ValueError("ID不能為空")
        # 刪除記錄
        return self._delete(data)
    
    def _delete(self, data):
        """刪除記錄"""
        # 實現刪除邏輯
        pass
```

### 1.4 優點

- **解耦**: 客戶端代碼與具體的操作類解耦。
- **易於擴展**: 添加新的操作類型時，只需在工廠中添加新的分支，無需修改客戶端代碼。
- **集中管理**: 所有對象的創建邏輯集中在工廠類中，便於管理和維護。

---

## 2. 策略模式 (Strategy Pattern)

### 2.1 問題背景

在銷售人員指派的場景中，可能存在多種指派策略：
- **負載均衡策略**: 優先指派給工作負荷最低的銷售人員。
- **專業領域匹配策略**: 優先指派給專業領域匹配的銷售人員。
- **地理位置策略**: 優先指派給負責該地區的銷售人員。

如果將這些策略硬編碼在一個大的`if-else`語句中，代碼會變得複雜且難以維護。

### 2.2 解決方案

使用策略模式，將每種指派策略封裝為一個獨立的類，實現統一的接口。客戶端代碼可以根據需要動態選擇使用哪種策略。

### 2.3 實現示例

```python
class AssignmentStrategy:
    """指派策略基類"""
    
    def assign(self, opportunity, sales_reps):
        """執行指派"""
        raise NotImplementedError


class LoadBalancingStrategy(AssignmentStrategy):
    """負載均衡策略"""
    
    def assign(self, opportunity, sales_reps):
        """選擇工作負荷最低的銷售人員"""
        return min(sales_reps, key=lambda rep: rep.workload)


class SpecializationStrategy(AssignmentStrategy):
    """專業領域匹配策略"""
    
    def assign(self, opportunity, sales_reps):
        """選擇專業領域匹配的銷售人員"""
        # 根據機會的行業或類型篩選
        matched_reps = [rep for rep in sales_reps 
                       if rep.specialization == opportunity.industry]
        
        if not matched_reps:
            # 如果沒有完全匹配的，使用負載均衡
            return LoadBalancingStrategy().assign(opportunity, sales_reps)
        
        return min(matched_reps, key=lambda rep: rep.workload)


class RegionStrategy(AssignmentStrategy):
    """地理位置策略"""
    
    def assign(self, opportunity, sales_reps):
        """選擇負責該地區的銷售人員"""
        # 根據機會的地區篩選
        region_reps = [rep for rep in sales_reps 
                      if rep.region == opportunity.region]
        
        if not region_reps:
            # 如果沒有該地區的銷售人員，使用負載均衡
            return LoadBalancingStrategy().assign(opportunity, sales_reps)
        
        return min(region_reps, key=lambda rep: rep.workload)


class AssignmentContext:
    """指派上下文 - 使用策略"""
    
    def __init__(self, strategy):
        """初始化上下文"""
        self._strategy = strategy
    
    def set_strategy(self, strategy):
        """設置策略"""
        self._strategy = strategy
    
    def execute_assignment(self, opportunity, sales_reps):
        """執行指派"""
        return self._strategy.assign(opportunity, sales_reps)
```

### 2.4 優點

- **靈活性**: 可以在運行時動態選擇和切換策略。
- **易於擴展**: 添加新的策略時，只需創建新的策略類，無需修改現有代碼。
- **單一職責**: 每個策略類只負責一種指派邏輯。

---

## 3. 觀察者模式 (Observer Pattern)

### 3.1 問題背景

在CRM系統中，當一個銷售機會的狀態發生變化時（例如，從"潛在"變為"談判"），可能需要通知多個對象（例如，項目經理、銷售總監、客戶等）。如果在機會更新的代碼中直接調用這些對象的方法，會導致高度耦合。

### 3.2 解決方案

使用觀察者模式，將這些對象註冊為觀察者，當機會狀態變化時，自動通知所有觀察者。

### 3.3 實現示例

```python
class Observer:
    """觀察者基類"""
    
    def update(self, opportunity):
        """當被觀察的對象發生變化時調用"""
        raise NotImplementedError


class EmailNotifier(Observer):
    """郵件通知觀察者"""
    
    def update(self, opportunity):
        """發送郵件通知"""
        print(f"發送郵件：機會 {opportunity.name} 已更新")
        # 實現發送郵件的邏輯


class SMSNotifier(Observer):
    """短信通知觀察者"""
    
    def update(self, opportunity):
        """發送短信通知"""
        print(f"發送短信：機會 {opportunity.name} 已更新")
        # 實現發送短信的邏輯


class LogObserver(Observer):
    """日誌記錄觀察者"""
    
    def update(self, opportunity):
        """記錄日誌"""
        print(f"記錄日誌：機會 {opportunity.name} 已更新")
        # 實現日誌記錄的邏輯


class Opportunity:
    """銷售機會 - 被觀察的對象"""
    
    def __init__(self, name):
        self.name = name
        self._observers = []
        self._stage = '潛在'
    
    def attach(self, observer):
        """註冊觀察者"""
        if observer not in self._observers:
            self._observers.append(observer)
    
    def detach(self, observer):
        """取消註冊觀察者"""
        if observer in self._observers:
            self._observers.remove(observer)
    
    def notify(self):
        """通知所有觀察者"""
        for observer in self._observers:
            observer.update(self)
    
    def set_stage(self, stage):
        """設置機會階段"""
        self._stage = stage
        # 通知所有觀察者
        self.notify()
    
    def get_stage(self):
        """獲取機會階段"""
        return self._stage
```

### 3.4 優點

- **松耦合**: 被觀察對象與觀察者之間的耦合度低。
- **動態關係**: 可以在運行時動態添加或移除觀察者。
- **自動通知**: 當被觀察對象發生變化時，自動通知所有觀察者。

---

## 4. 單例模式 (Singleton Pattern)

### 4.1 問題背景

在CRM系統中，某些對象（如數據庫連接、配置管理器）應該只有一個實例，以確保全局的一致性和資源的高效利用。

### 4.2 解決方案

使用單例模式，確保一個類只有一個實例，並提供全局訪問點。

### 4.3 實現示例

```python
class DatabaseConnection:
    """數據庫連接 - 單例"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        # 初始化數據庫連接
        self.connection = self._create_connection()
        self._initialized = True
    
    def _create_connection(self):
        """創建數據庫連接"""
        # 實現連接邏輯
        pass
    
    def query(self, sql):
        """執行查詢"""
        return self.connection.execute(sql)


# 使用單例
db = DatabaseConnection()
result = db.query("SELECT * FROM opportunities")
```

### 4.4 優點

- **全局訪問**: 提供全局訪問點，方便在任何地方使用。
- **資源節省**: 確保只有一個實例，節省系統資源。
- **線程安全**: 使用鎖確保在多線程環境中的安全性。

---

## 5. 模板方法模式 (Template Method Pattern)

### 5.1 問題背景

在CRM系統中，不同的操作（如添加、更新、刪除）有相似的流程：驗證數據、執行操作、記錄日誌。為了避免代碼重複，可以使用模板方法模式。

### 5.2 解決方案

定義一個模板方法，在其中定義操作的骨架，將具體的步驟延遲到子類中實現。

### 5.3 實現示例

```python
class OperationTemplate:
    """操作模板 - 定義操作的骨架"""
    
    def execute(self, data):
        """執行操作 - 模板方法"""
        # 第一步：驗證數據
        self.validate(data)
        
        # 第二步：執行操作
        result = self.perform_operation(data)
        
        # 第三步：記錄日誌
        self.log(data, result)
        
        # 第四步：發送通知
        self.notify(result)
        
        return result
    
    def validate(self, data):
        """驗證數據 - 由子類實現"""
        raise NotImplementedError
    
    def perform_operation(self, data):
        """執行操作 - 由子類實現"""
        raise NotImplementedError
    
    def log(self, data, result):
        """記錄日誌"""
        print(f"操作日誌: {data} -> {result}")
    
    def notify(self, result):
        """發送通知"""
        print(f"操作完成: {result}")


class CreateOpportunityOperation(OperationTemplate):
    """創建機會操作"""
    
    def validate(self, data):
        """驗證數據"""
        if not data.get('name'):
            raise ValueError("機會名稱不能為空")
        if not data.get('customer_id'):
            raise ValueError("客戶ID不能為空")
    
    def perform_operation(self, data):
        """執行創建操作"""
        # 實現創建邏輯
        return {'id': 1, 'name': data['name']}


class UpdateOpportunityOperation(OperationTemplate):
    """更新機會操作"""
    
    def validate(self, data):
        """驗證數據"""
        if not data.get('id'):
            raise ValueError("機會ID不能為空")
    
    def perform_operation(self, data):
        """執行更新操作"""
        # 實現更新邏輯
        return {'id': data['id'], 'name': data.get('name')}
```

### 5.4 優點

- **代碼複用**: 避免重複代碼，提高代碼複用率。
- **易於維護**: 修改操作流程時，只需修改模板方法。
- **靈活性**: 子類可以根據需要覆蓋特定的步驟。

---

## 6. 總結

設計模式是軟件設計中的最佳實踐，它們提供了解決常見設計問題的經過驗證的方案。在CRM系統的設計中，合理應用這些設計模式可以提高代碼的質量、可維護性和可擴展性。

| 設計模式 | 主要用途 | 優點 |
|---------|--------|------|
| 工廠模式 | 對象創建 | 解耦、易於擴展 |
| 策略模式 | 算法選擇 | 靈活、易於擴展 |
| 觀察者模式 | 事件通知 | 松耦合、動態關係 |
| 單例模式 | 全局實例 | 全局訪問、資源節省 |
| 模板方法模式 | 流程定義 | 代碼複用、易於維護 |

---

*本文檔提供了設計模式在CRM系統中的實際應用示例，幫助開發者理解和應用這些模式。*
