# 用戶管理系統 - React + Google Apps Script + Google Sheet

一個現代化的無服務器用戶管理系統，採用React前端、Google Apps Script後端、Google Sheet數據庫的完整技術棧。

## 🎯 核心功能

- ✅ **用戶管理**：完整的CRUD操作（創建、讀取、更新、刪除）
- ✅ **多條件查詢**：支持按用戶名、郵箱、手機號進行搜索
- ✅ **角色管理**：靈活的角色和權限控制系統
- ✅ **用戶驗證**：密碼加密存儲（SHA256）
- ✅ **實時同步**：前後端實時數據同步
- ✅ **錯誤處理**：完整的錯誤提示和驗證機制

## 🏗️ 技術棧

| 層級 | 技術 | 說明 |
|------|------|------|
| **前端** | React 19 + TypeScript | 現代化的用戶界面 |
| **後端** | Google Apps Script | 無需服務器的後端服務 |
| **數據庫** | Google Sheet | 簡單易用的數據存儲 |
| **UI框架** | Tailwind CSS + shadcn/ui | 高質量的UI組件 |

## 📋 項目結構

```
user-management-system/
├── client/                          # React前端應用
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # 主儀表板頁面
│   │   │   └── Home.tsx            # 首頁
│   │   ├── lib/
│   │   │   └── api.ts              # Google Apps Script API客戶端
│   │   ├── components/             # React組件
│   │   ├── App.tsx                 # 應用主文件
│   │   └── index.css               # 全局樣式
│   ├── public/                     # 靜態資源
│   └── index.html                  # HTML入口
├── google_apps_script.js           # Google Apps Script後端代碼
├── TUTORIAL.md                     # 完整教學文檔
├── QUICK_START.md                  # 快速開始指南
├── API.md                          # API文檔
├── package.json                    # 項目配置
└── README.md                       # 本文件
```

## 🚀 快速開始

### 前置要求

- Google帳號
- Node.js 16+ 和 pnpm
- 代碼編輯器（VS Code推薦）

### 5分鐘部署

#### 1. 創建Google Sheet

1. 打開 [Google Sheet](https://sheets.google.com)
2. 新建電子表格，命名為 "用戶管理系統"
3. 記下電子表格ID

#### 2. 設置表格結構

**Users工作表**：
```
A: ID | B: Username | C: Email | D: Phone | E: Password Hash | F: Roles | G: Is Active | H: Created At | I: Updated At
```

**Roles工作表**：
```
A: ID | B: Name | C: Permissions | D: Created At | E: Updated At
```

#### 3. 部署Google Apps Script

1. 在Google Sheet中，點擊 "擴展功能" → "Apps Script"
2. 複製 `google_apps_script.js` 中的所有代碼
3. 保存並部署為Web應用
4. 複製部署URL

#### 4. 配置React應用

創建 `.env.local`：

```env
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercontent
```

#### 5. 運行應用

```bash
pnpm install
pnpm dev
```

訪問 `http://localhost:3000`

詳細步驟請參考 [QUICK_START.md](./QUICK_START.md)

## 📖 文檔

- **[QUICK_START.md](./QUICK_START.md)** - 5分鐘快速部署指南
- **[TUTORIAL.md](./TUTORIAL.md)** - 完整教學文檔（包含Google Sheet設置、Apps Script部署、React配置等）
- **[API.md](./API.md)** - Google Apps Script API詳細文檔

## 🔑 主要特性

### 用戶管理

- 創建用戶（用戶名、郵箱、手機號、密碼）
- 查詢用戶（支持模糊搜索）
- 編輯用戶信息
- 刪除用戶
- 為用戶分配角色

### 角色管理

- 創建角色
- 查看所有角色
- 為角色添加權限
- 靈活的權限系統

### 權限控制

內置權限：
- `user:view` - 查看用戶列表
- `user:add` - 創建新用戶
- `user:update` - 編輯用戶信息
- `user:delete` - 刪除用戶
- `role:manage` - 管理角色和權限

## 🔐 安全性

- 密碼使用SHA256加密
- 郵箱和用戶名唯一性檢查
- 輸入驗證和格式檢查
- CORS支持跨域請求

## 📊 API示例

### 創建用戶

```javascript
const response = await fetch(deploymentUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "createUser",
    username: "alice",
    email: "alice@example.com",
    phone: "13800138000",
    password: "password123"
  })
});

const result = await response.json();
```

### 查詢用戶

```javascript
const response = await fetch(deploymentUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "queryUsers",
    criteria: {
      username: "alice"
    }
  })
});

const result = await response.json();
```

更多API示例請參考 [API.md](./API.md)

## 🛠️ 開發

### 安裝依賴

```bash
pnpm install
```

### 啟動開發服務器

```bash
pnpm dev
```

### 構建生產版本

```bash
pnpm build
```

### 類型檢查

```bash
pnpm check
```

## 📈 擴展建議

1. **Google OAuth登錄** - 集成Google登錄提升安全性
2. **密碼重置功能** - 通過郵件發送重置鏈接
3. **操作審計日誌** - 記錄所有用戶操作
4. **郵件通知** - 用戶創建、密碼重置等通知
5. **數據導出** - 支持導出為CSV/Excel
6. **批量操作** - 批量創建、刪除、分配角色
7. **高級搜索** - 支持多字段組合搜索
8. **分頁功能** - 支持大數據量分頁查詢

## 🐛 常見問題

### Q: 部署URL無效怎麼辦？

A: 檢查以下幾點：
1. 確保Google Apps Script已部署為Web應用
2. 確保選擇了 "任何人" 的訪問權限
3. 檢查部署URL是否正確複製

### Q: CORS錯誤怎麼解決？

A: Google Apps Script Web應用默認支持CORS。如果仍有問題，嘗試重新部署應用。

### Q: 如何備份數據？

A: Google Sheet自動備份。您也可以定期下載為CSV或Excel格式。

更多問題請參考 [TUTORIAL.md](./TUTORIAL.md) 的常見問題部分

## 📝 許可證

MIT License

## 👤 作者

Manus AI

## 🔗 相關鏈接

- [Google Apps Script文檔](https://developers.google.com/apps-script)
- [React文檔](https://react.dev)
- [Tailwind CSS文檔](https://tailwindcss.com)
- [shadcn/ui文檔](https://ui.shadcn.com)

## 📞 支持

如有問題或建議，請：

1. 檢查本README和相關文檔
2. 查看Google Apps Script官方文檔
3. 參考React官方文檔

---

**最後更新**：2024年12月  
**版本**：1.0.0
