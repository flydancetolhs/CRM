
# CRM Python 項目學習指引 (初學者版)

歡迎來到CRM Python項目的學習世界！本指引將帶你一步步了解如何設置、運行和理解這個項目。無論你是編程新手還是剛接觸後端開發，本指引都將為你提供清晰的路徑。

---

## 🎯 學習目標

完成本指引後，你將能夠：

1.  **獨立搭建**並運行一個Python後端應用。
2.  **理解**一個典型Web項目的代碼結構。
3.  **學會**如何通過API與後端服務進行交互。
4.  **初步接觸**並理解一個重要的軟件設計模式——策略模式。

---

## 🛠️ 準備工作 (Prerequisites)

在開始之前，請確保你的電腦上安裝了以下軟件：

- **Python 3.8+**: [官方下載地址](https://www.python.org/downloads/)
- **MySQL數據庫**: 一個免費的關係型數據庫。你可以使用 `Docker` 快速啟動一個實例，或直接安裝。 [官方下載地址](https://dev.mysql.com/downloads/mysql/)
- **一個代碼編輯器**: 推薦使用 [Visual Studio Code](https://code.visualstudio.com/)，它免費且功能強大。
- **一個API測試工具**: 推薦使用 [Postman](https://www.postman.com/downloads/) 或 [Insomnia](https://insomnia.rest/download)。

---

## 🚀 第一部分：環境搭建與運行

讓我們從零開始，將項目在你的本地電腦上運行起來。

### 第1步：下載項目文件

將本項目所有文件下載到你電腦的一個文件夾中，例如 `my-crm-project`。

### 第2步：創建並激活虛擬環境

打開你的終端（在Windows上是命令提示符或PowerShell），進入項目文件夾，然後運行以下命令。虛擬環境可以確保項目的依賴包與你電腦上的其他Python項目隔離。

```bash
# 進入項目文件夾
cd path/to/my-crm-project

# 創建一個名為 venv 的虛擬環境
python -m venv venv

# 激活虛擬環境
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate
```

激活成功後，你會在命令行提示符前看到 `(venv)` 的標記。

### 第3步：安裝項目依賴

項目所需的所有Python庫都記錄在 `requirements.txt` 文件中。運行以下命令進行安裝：

```bash
pip install -r requirements.txt
```

### 第4步：配置並啟動數據庫

你需要一個MySQL數據庫來存儲CRM數據。請確保你的MySQL服務正在運行，並創建一個名為 `crm_db` 的數據庫。

```sql
CREATE DATABASE crm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然後，你需要修改 `crm_main.py` 文件中的數據庫連接字符串，以匹配你的MySQL用戶名和密碼。

```python
# 在 crm_main.py 文件中找到這一行
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost:3306/crm_db'
# 將 'root' 替換為你的MySQL用戶名，'password' 替換為你的密碼
```

### 第5步：運行項目！

一切準備就緒！在終端中運行以下命令來啟動後端服務：

```bash
python crm_main.py
```

如果一切順利，你會看到類似以下的輸出，表示服務器已成功啟動：

```
 * CRM系統啟動，監聽 http://localhost:5000
 * Running on http://127.0.0.1:5000
```

現在，打開你的瀏覽器，訪問 `http://localhost:5000/api/health`，如果頁面顯示 `{"status":"healthy", ...}`，恭喜你，項目已成功運行！

---

## 📂 第二部分：代碼結構詳解

理解項目的組織方式是掌握項目的關鍵。`crm_main.py` 是我們唯一的代碼文件，但它結構清晰，分為幾個主要部分。

```python
# crm_main.py

# --- 1. 初始化與配置 ---
# 引入庫，創建Flask app，配置數據庫等。

# --- 2. 數據模型 (Data Models) ---
# 定義了數據在數據庫中如何存儲。
# - Customer: 客戶信息
# - Opportunity: 銷售機會信息
# - SalesRep: 銷售人員信息

# --- 3. 業務邏輯服務 (Business Logic Services) ---
# 處理核心業務邏輯的地方。
# - OpportunityService: 封裝了創建、更新、指派機會等操作。
# - AssignmentStrategy: 定義了不同的指派策略（這就是設計模式的應用！）。

# --- 4. API 路由 (API Routes) ---
# 定義了外部可以訪問的URL地址（端點）。
# 例如，當你訪問 /api/opportunities 時，會觸發哪個函數。

# --- 5. 錯誤處理 (Error Handling) ---
# 定義了當發生錯誤（如404 Not Found）時，服務器應如何響應。

# --- 6. 應用啟動 (App Startup) ---
# 程序的入口，運行這個文件時會從這裡開始執行。

```

**核心概念**：
- **模型 (Model)**: 如同數據庫表的藍圖，定義了數據的字段和類型。
- **服務 (Service)**: 處理具體的“做什麼”，例如“創建一個機會”這個動作的具體步驟。
- **路由 (Route)**: 如同服務的門牌號，告訴外部世界如何找到並觸發某個服務。

---

## 🔌 第三部分：API 使用指南

API（應用程序編程接口）是你的前端（或其他服務）與後端溝通的橋樑。你可以使用 Postman 等工具來測試這些API。

以下是幾個核心API的用法：

| **功能** | **HTTP方法** | **URL** | **用途** |
| :--- | :--- | :--- | :--- |
| 創建機會 | `POST` | `/api/opportunities` | 創建一個新的銷售機會。需要在請求體(Body)中提供JSON格式的數據。 |
| 獲取所有機會 | `GET` | `/api/opportunities` | 獲取數據庫中所有銷售機會的列表。 |
| 獲取單個機會 | `GET` | `/api/opportunities/<id>` | 獲取指定ID的銷售機會的詳細信息。例如 `/api/opportunities/1`。 |
| 更新機會 | `PUT` | `/api/opportunities/<id>` | 更新指定ID的銷售機會。需要在請求體中提供要更新的數據。 |

**示例：使用cURL創建一個新機會**

打開一個新的終端，運行以下命令（假設你的服務器仍在運行）：

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{
    "name": "一個重要的新機會",
    "amount": 50000,
    "customer_id": 1
}' \
http://localhost:5000/api/opportunities
```

*注意：在運行此命令前，你需要先手動在數據庫的 `customers` 表中創建一條記錄，否則 `customer_id: 1` 會引發錯誤。*

---

## 🎨 第四部分：設計模式初探 (策略模式)

設計模式是解決常見編程問題的“套路”或“最佳實踐”。本項目使用了一個非常實用的模式——**策略模式 (Strategy Pattern)**。

**問題場景**: 假設我們要給一個新的銷售機會指派銷售人員。我們可能有不同的指派規則（策略）：
- **策略A**: 誰最閒就給誰（負載均衡）。
- **策略B**: 誰的專業領域最匹配就給誰（專業匹配）。

如果用 `if-else` 來寫，代碼會很亂，而且每次增加新策略都要修改代碼。

**策略模式的解決方案**: 

策略模式的思想是，將每個策略（規則）都封裝成一個獨立的對象，讓它們可以互相替換。就像你出門可以選擇不同的交通工具（策略）：可以開車，可以坐地鐵，也可以騎自行車。

在我們的代碼 `crm_main.py` 中：

1.  `AssignmentStrategy` 是一個抽象的“交通工具”基類，它規定了所有交通工具都必須有一個 `assign` 方法。
2.  `LoadBalancingStrategy` 和 `SpecializationStrategy` 是具體的“交通工具”，它們各自實現了 `assign` 方法，代表了不同的指派邏輯。

```python
# 策略的基類 (抽象的交通工具)
class AssignmentStrategy:
    def assign(self, opportunity, sales_reps):
        raise NotImplementedError

# 具體的策略A (開車)
class LoadBalancingStrategy(AssignmentStrategy):
    def assign(self, opportunity, sales_reps):
        # 找到工作量最小的銷售
        return min(sales_reps, key=lambda rep: rep.workload)

# 具體的策略B (坐地鐵)
class SpecializationStrategy(AssignmentStrategy):
    def assign(self, opportunity, sales_reps):
        # 找到專業最匹配的銷售
        # ... 實現細節
        pass
```

這樣，當我們需要指派時，就可以根據情況選擇使用哪個策略對象，而不需要修改主流程代碼，使得系統非常靈活和易於擴展。

---

## 🚀 第五部分：下一步做什麼？

恭喜你完成了基礎學習！現在可以嘗試一些小挑戰來鞏固你的知識：

1.  **添加新字段**: 嘗試給 `Customer` 模型添加一個 `address` (地址) 字段，並更新API使其支持地址的讀寫。
2.  **創建新API**: 創建一個 `DELETE /api/opportunities/<id>` 的API，用於刪除一個銷售機會。
3.  **實現新策略**: 實現一個新的指派策略 `RegionStrategy`，優先將機會分配給同一區域的銷售人員。
4.  **完善驗證**: 在創建機會的API中添加驗證，確保 `amount` 必須是一個正數。

---

## 結語

本指引為你打開了後端開發的大門。編程學習最重要的方法就是“動手實踐”。不斷地修改、嘗試、犯錯、修正，你將會在這個過程中飛速成長。祝你學習愉快！
