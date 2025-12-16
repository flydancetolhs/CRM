# Python CRM API 專案

這是一個基於Flask和多種設計模式實現的輕量級CRM系統後端API專案。專案旨在演示一個清晰、可擴展、可維護的後端架構，其核心功能源自對一個CRM開發教學逐字稿的分析。

## ✨ 功能特性

- **用戶認證**: 提供基於JWT (JSON Web Tokens) 的用戶註冊和登錄功能。
- **記住我**: 通過刷新令牌 (Refresh Token) 實現安全的持久化登錄。
- **營銷機會管理**: 對營銷機會進行完整的CRUD (創建、讀取、更新、刪除) 操作。
- **多條件查詢**: 使用策略模式實現靈活、可擴展的多條件搜索功能。
- **全局異常處理**: 統一處理應用程序中的所有異常，提供一致的錯誤響應。
- **分層架構**: 清晰的表現層、業務邏輯層、數據訪問層分離。
- **設計模式應用**: 展示了單例模式和策略模式在實際項目中的應用。

---

## 🏛️ 系統架構

本專案採用經典的分層架構，確保了模塊之間的高內聚和低耦合。

![系統架構圖](https://raw.githubusercontent.com/your-username/your-repo/main/system_architecture.png)
*（請將圖片上傳至GitHub倉庫後替換此鏈接）*

- **表現層 (Controllers)**: 負責處理HTTP請求，調用業務邏輯，並返回JSON響應。
- **業務邏輯層 (Services)**: 包含核心業務邏輯，協調數據訪問層和模型。
- **數據訪問層 (DAO)**: 封裝數據庫操作，實現數據的持久化和檢索。
- **模型層 (Models)**: 定義數據庫表的結構和對象關係映射 (ORM)。
- **工具與模式 (Utils & Patterns)**: 提供全局工具（如認證、異常處理）和設計模式實現。

---

## 🛠️ 技術棧

- **框架**: Flask
- **數據庫**: SQLAlchemy (ORM), SQLite (開發環境)
- **認證**: Flask-JWT-Extended
- **密碼處理**: Werkzeug
- **設計模式**: 策略模式, 單例模式

---

## 📁 專案結構

```
crm_project/
├── app.py                  # Flask應用主文件
├── config.py               # 配置文件
├── models/                 # 數據模型
│   ├── user.py
│   └── sales.py
├── dao/                    # 數據訪問對象 (DAO)
│   ├── base_dao.py
│   └── sales_dao.py
├── services/               # 業務邏輯層
│   └── sales_service.py
├── controllers/            # 控制器 (API路由)
│   └── sales_controller.py
├── utils/                  # 工具類
│   ├── auth.py             # 認證與攔截器
│   └── exception_handler.py # 全局異常處理
└── patterns/               # 設計模式實現
    ├── query_strategy.py   # 查詢策略模式
    └── singleton.py        # 單例模式
```

---

## 🚀 安裝與啟動

1.  **克隆倉庫**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd crm_project
    ```

2.  **創建並激活虛擬環境**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **安裝依賴**
    ```bash
    pip install Flask Flask-SQLAlchemy Flask-JWT-Extended Werkzeug
    ```

4.  **初始化數據庫**
    打開Python終端，執行以下命令來創建數據庫和表：
    ```python
    from app import app, db
    with app.app_context():
        db.create_all()
    ```

5.  **啟動應用**
    ```bash
    python app.py
    ```
    應用將在 `http://127.0.0.1:5000` 上運行。

---

##  API 端點說明

所有需要認證的端點都需要在請求頭中包含 `Authorization: Bearer <access_token>`。

### 認證 (`/api/auth`)

- **`POST /register`**: 註冊新用戶。
  - **請求體**: `{"username": "your_user", "password": "your_pass"}`
- **`POST /login`**: 用戶登錄。
  - **請求體**: `{"username": "your_user", "password": "your_pass", "remember": true}`
  - **響應**: `{"access_token": "...", "refresh_token": "..."}` (如果 `remember` 為 `true`)
- **`POST /refresh`**: 使用刷新令牌獲取新的訪問令牌。
- **`GET /profile`**: (需認證) 獲取當前用戶信息。

### 營銷機會 (`/api/sales`)

- **`GET /opportunities`**: (需認證) 獲取所有或搜索營銷機會。
  - **查詢參數**: `name`, `customer_name`, `stage`, `min_amount`, `max_amount`
- **`GET /opportunities/<id>`**: (需認證) 根據ID獲取單個機會。
- **`POST /opportunities`**: (需認證) 創建新的機會。
  - **請求體**: `{"name": "New Deal", "customer_name": "Big Corp", "amount": 50000}`
- **`PUT /opportunities/<id>`**: (需認證) 更新機會信息。
- **`DELETE /opportunities/<id>`**: (需認證) 刪除機會。

---

## 🎨 設計模式應用

### 策略模式 (Strategy Pattern)

在 `SalesDAO` 的 `search` 方法中，我們使用了策略模式來處理不同的查詢條件。每個查詢條件（如按名稱、按金額範圍）都是一個獨立的策略對象。這使得添加新的查詢條件變得非常容易，只需創建一個新的策略類，而無需修改現有的 `search` 方法。

**實現**: `patterns/query_strategy.py`

### 單例模式 (Singleton Pattern)

`patterns/singleton.py` 文件提供了一個基於元類的單例模式實現。雖然在當前版本的Flask應用中未直接使用（因為Flask的擴展通常會自己管理實例），但它是一個經典的設計模式示例，可用於確保某些資源（如數據庫連接池、配置管理器）在整個應用中只有一個實例。

---

## 流程圖

### 用戶登錄流程

![用戶登錄流程圖](https://raw.githubusercontent.com/your-username/your-repo/main/login_flow.png)
*（請將圖片上傳至GitHub倉庫後替換此鏈接）*

### 非法請求攔截流程

![非法請求攔截流程圖](https://raw.githubusercontent.com/your-username/your-repo/main/request_interception_flow.png)
*（請將圖片上傳至GitHub倉庫後替換此鏈接）*

### 營銷機會CRUD流程

![營銷機會CRUD流程圖](https://raw.githubusercontent.com/your-username/your-repo/main/sales_opportunity_crud_flow.png)
*（請將圖片上傳至GitHub倉庫後替換此鏈接）*
