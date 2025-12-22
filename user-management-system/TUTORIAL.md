# 用戶管理系統 - React + Google Apps Script + Google Sheet 完整教學

## 📋 目錄

1. [項目概述](#項目概述)
2. [技術棧說明](#技術棧說明)
3. [Google Sheet 設置](#google-sheet-設置)
4. [Google Apps Script 部署](#google-apps-script-部署)
5. [React 前端配置](#react-前端配置)
6. [完整部署步驟](#完整部署步驟)
7. [使用指南](#使用指南)
8. [常見問題](#常見問題)
9. [擴展建議](#擴展建議)

---

## 項目概述

本項目是一個無服務器的用戶管理系統，採用現代化的技術棧：

| 層級 | 技術 | 說明 |
|------|------|------|
| **前端** | React 19 + TypeScript | 現代化的用戶界面，支持實時交互 |
| **後端** | Google Apps Script | 無需服務器，直接在Google Cloud上運行 |
| **數據庫** | Google Sheet | 簡單易用的數據存儲，支持版本控制 |

### 核心功能

- ✅ 用戶管理（CRUD操作）
- ✅ 多條件查詢（用戶名、郵箱、手機號）
- ✅ 角色管理與權限控制
- ✅ 用戶驗證與密碼加密
- ✅ 實時數據同步
- ✅ 完整的錯誤處理

### 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    React 前端應用                             │
│              (用戶界面、表單驗證、數據展示)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP POST/GET)
┌─────────────────────────────────────────────────────────────┐
│                 Google Apps Script 後端                       │
│         (業務邏輯、數據驗證、Google Sheet操作)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Google Sheet 數據庫                        │
│              (Users表、Roles表、數據持久化)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 技術棧說明

### React 前端

**框架與工具**：
- React 19：最新的React版本，支持最新的特性
- TypeScript：類型安全，提升開發體驗
- Tailwind CSS：快速構建UI，無需編寫CSS
- shadcn/ui：高質量的UI組件庫
- Wouter：輕量級路由解決方案

**主要特性**：
- 響應式設計，支持移動端
- 實時搜索和過濾
- 對話框表單，用戶體驗流暢
- 完整的錯誤提示和成功反饋

### Google Apps Script 後端

**特點**：
- 無需部署服務器，Google Cloud自動托管
- 與Google Sheet無縫集成
- 支持CORS跨域請求
- 免費使用（在配額內）

**核心功能**：
- 用戶CRUD操作
- 數據驗證與唯一性檢查
- 密碼加密（SHA256）
- 角色與權限管理
- 多條件查詢

### Google Sheet 數據庫

**優勢**：
- 無需配置數據庫，開箱即用
- 支持版本控制和協作編輯
- 可視化數據管理
- 自動備份

**表結構**：
- **Users表**：存儲用戶信息
- **Roles表**：存儲角色和權限

---

## Google Sheet 設置

### 第1步：創建Google Sheet

1. 打開 [Google Sheet](https://sheets.google.com)
2. 點擊 "新建" → "電子表格"
3. 命名為 "用戶管理系統"
4. 記下電子表格ID（URL中 `/d/` 後面的部分）

### 第2步：創建表格結構

#### Users 表（用戶表）

在第一個工作表中，添加以下表頭：

| 列 | 名稱 | 類型 | 說明 |
|----|------|------|------|
| A | ID | 文本 | 用戶唯一標識，格式：user_timestamp_random |
| B | Username | 文本 | 用戶名，3-20個字符 |
| C | Email | 文本 | 郵箱，必須唯一 |
| D | Phone | 文本 | 手機號，10-15位數字 |
| E | Password Hash | 文本 | 密碼哈希值（SHA256加密） |
| F | Roles | 文本 | 角色ID列表，多個用逗號分隔 |
| G | Is Active | 布爾值 | 用戶是否激活 |
| H | Created At | 時間戳 | 創建時間（ISO格式） |
| I | Updated At | 時間戳 | 更新時間（ISO格式） |

**示例數據**：
```
ID | Username | Email | Phone | Password Hash | Roles | Is Active | Created At | Updated At
user_1 | alice | alice@example.com | 13800138000 | [hash] | role_1 | TRUE | 2024-06-21T10:00:00Z | 2024-06-21T10:00:00Z
```

#### Roles 表（角色表）

創建新工作表 "Roles"，添加以下表頭：

| 列 | 名稱 | 類型 | 說明 |
|----|------|------|------|
| A | ID | 文本 | 角色唯一標識，格式：role_timestamp_random |
| B | Name | 文本 | 角色名稱，如 Admin、User |
| C | Permissions | 文本 | 權限列表，多個用逗號分隔 |
| D | Created At | 時間戳 | 創建時間 |
| E | Updated At | 時間戳 | 更新時間 |

**示例數據**：
```
ID | Name | Permissions | Created At | Updated At
role_1 | Admin | user:view,user:add,user:update,user:delete,role:manage | 2024-06-21T10:00:00Z | 2024-06-21T10:00:00Z
role_2 | User | user:view | 2024-06-21T10:00:00Z | 2024-06-21T10:00:00Z
```

### 第3步：設置共享權限

1. 點擊右上角的 "共享" 按鈕
2. 選擇 "更改為任何人都可訪問"（或設置特定用戶）
3. 確保Google Apps Script有讀寫權限

---

## Google Apps Script 部署

### 第1步：打開Apps Script編輯器

1. 在Google Sheet中，點擊 "擴展功能" → "Apps Script"
2. 這將打開一個新標籤頁，顯示Apps Script編輯器

### 第2步：複製後端代碼

1. 在編輯器中，清空默認的 `Code.gs` 文件
2. 將 `google_apps_script.js` 文件中的所有代碼複製到 `Code.gs`
3. 保存文件（Ctrl+S 或 Cmd+S）

### 第3步：部署為Web應用

1. 點擊 "部署" 按鈕（右上角）
2. 選擇 "新建部署"
3. 在 "選擇類型" 下拉菜單中，選擇 "Web應用"
4. 填寫以下信息：
   - **執行身份為**：選擇您的Google帳號
   - **有權訪問的用戶**：選擇 "任何人"
5. 點擊 "部署"
6. 系統會要求授予權限，點擊 "授權"
7. 複製部署URL（格式：`https://script.google.com/macros/d/{deploymentId}/usercontent`）

### 第4步：驗證部署

在瀏覽器中訪問部署URL，應該看到以下響應：
```json
{
  "success": false,
  "message": "未知的操作："
}
```

這表示部署成功。

---

## React 前端配置

### 第1步：環境變量設置

在項目根目錄創建 `.env.local` 文件：

```env
# Google Apps Script 部署URL
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/{deploymentId}/usercontent
```

將 `{deploymentId}` 替換為您的實際部署ID。

### 第2步：配置API客戶端

編輯 `client/src/lib/api.ts`，確保部署URL正確：

```typescript
export class GoogleAppsScriptAPI {
  private deploymentUrl: string;

  constructor(deploymentUrl?: string) {
    this.deploymentUrl =
      deploymentUrl ||
      localStorage.getItem("GAS_DEPLOYMENT_URL") ||
      import.meta.env.VITE_GAS_DEPLOYMENT_URL ||
      "";
  }
}
```

### 第3步：運行開發服務器

```bash
cd user_management_react
pnpm install  # 如果尚未安裝依賴
pnpm dev      # 啟動開發服務器
```

訪問 `http://localhost:3000` 查看應用。

### 第4步：在應用中配置部署URL

如果您沒有設置環境變量，可以在應用中動態設置：

1. 打開應用
2. 點擊設置按鈕（如果有）
3. 輸入Google Apps Script部署URL
4. 保存配置

---

## 完整部署步驟

### 快速部署檢查清單

- [ ] 創建Google Sheet電子表格
- [ ] 創建Users和Roles工作表
- [ ] 在Google Sheet中打開Apps Script編輯器
- [ ] 複製google_apps_script.js代碼到Code.gs
- [ ] 部署為Web應用
- [ ] 複製部署URL
- [ ] 在React應用中配置部署URL
- [ ] 運行開發服務器
- [ ] 測試創建用戶功能
- [ ] 測試查詢和更新功能

### 部署順序

```
1. Google Sheet 設置
   ↓
2. Google Apps Script 部署
   ↓
3. React 前端配置
   ↓
4. 本地測試
   ↓
5. 生產部署
```

---

## 使用指南

### 用戶管理

#### 創建用戶

1. 點擊 "新建用戶" 按鈕
2. 填寫以下信息：
   - **用戶名**：3-20個字符，只包含字母、數字、下劃線
   - **郵箱**：有效的郵箱地址
   - **手機號**：10-15位數字
   - **密碼**：至少8個字符
   - **角色**：選擇一個或多個角色（可選）
3. 點擊 "創建用戶"

#### 搜索用戶

1. 在搜索框中輸入用戶名
2. 系統自動過濾結果
3. 支持模糊搜索

#### 編輯用戶

1. 點擊用戶行的 "編輯" 按鈕
2. 修改郵箱、手機號或角色
3. 保存更改

#### 刪除用戶

1. 點擊用戶行的 "刪除" 按鈕
2. 確認刪除
3. 用戶被從系統中移除

### 角色管理

#### 創建角色

1. 切換到 "角色管理" 標籤
2. 點擊 "新建角色" 按鈕
3. 輸入角色名稱（如 "Editor"、"Viewer"）
4. 點擊 "創建角色"

#### 查看角色

1. 在 "角色管理" 標籤中查看所有角色
2. 每個角色卡片顯示：
   - 角色名稱
   - 角色ID
   - 擁有的權限

#### 為角色添加權限

1. 通過Google Apps Script添加權限（需要編程）
2. 或在Google Sheet中直接編輯Permissions列

### 權限系統

#### 內置權限

| 權限 | 說明 |
|------|------|
| `user:view` | 查看用戶列表 |
| `user:add` | 創建新用戶 |
| `user:update` | 編輯用戶信息 |
| `user:delete` | 刪除用戶 |
| `role:manage` | 管理角色和權限 |

#### 權限檢查

在應用中集成權限檢查：

```typescript
// 檢查用戶是否有特定權限
const hasPermission = await api.checkPermission(userId, "user:add");
if (hasPermission) {
  // 允許用戶執行操作
}
```

---

## 常見問題

### Q1: 部署URL無效怎麼辦？

**A**：檢查以下幾點：
1. 確保Google Apps Script已部署為Web應用
2. 確保選擇了 "任何人" 的訪問權限
3. 檢查部署URL是否正確複製
4. 嘗試在瀏覽器中直接訪問URL

### Q2: CORS錯誤怎麼解決？

**A**：Google Apps Script Web應用默認支持CORS。如果仍有問題：
1. 確保部署時選擇了 "任何人" 的訪問權限
2. 檢查瀏覽器控制台的詳細錯誤信息
3. 嘗試重新部署應用

### Q3: 密碼是否安全？

**A**：當前實現使用SHA256加密。為了提高安全性：
1. 考慮使用bcrypt或argon2
2. 添加密碼強度驗證
3. 實現密碼重置功能
4. 使用HTTPS傳輸（生產環境必須）

### Q4: 如何備份數據？

**A**：Google Sheet自動備份。您也可以：
1. 定期下載Google Sheet為CSV或Excel格式
2. 使用Google Sheet的版本歷史功能
3. 設置Google Drive同步

### Q5: 如何擴展系統？

**A**：參考 [擴展建議](#擴展建議) 部分。

---

## 擴展建議

### 1. 前端增強

**添加高級搜索**：
```typescript
// 支持多字段搜索
const advancedSearch = {
  username: "alice",
  email: "example.com",
  phone: "138",
  createdAfter: "2024-01-01"
};
```

**添加分頁**：
```typescript
// 支持分頁查詢
const result = await api.queryUsers(criteria, {
  page: 1,
  pageSize: 10
});
```

**添加批量操作**：
```typescript
// 批量刪除用戶
await api.deleteUsers(userIds);

// 批量分配角色
await api.assignRolesToUsers(userIds, roleId);
```

### 2. 後端增強

**密碼重置**：
```javascript
function resetPassword(userId, newPassword) {
  // 驗證新密碼
  // 更新密碼哈希
  // 發送確認郵件
}
```

**審計日誌**：
```javascript
function logAction(userId, action, details) {
  // 記錄用戶操作
  // 用於安全審計
}
```

**郵件通知**：
```javascript
function sendEmail(to, subject, body) {
  // 使用GmailApp發送郵件
  // 用戶創建、密碼重置等通知
}
```

### 3. 數據庫優化

**添加索引**：
- 在Username和Email列上添加索引以加快查詢

**數據歸檔**：
- 定期歸檔舊數據到備份表

**備份策略**：
- 自動每天備份到另一個Google Sheet

### 4. 安全增強

**實現認證**：
```typescript
// 添加Google OAuth登錄
const auth = await google.auth.getAuth();
```

**速率限制**：
```javascript
// 防止暴力攻擊
function checkRateLimit(userId) {
  // 檢查用戶在時間窗口內的請求數
}
```

**數據加密**：
```javascript
// 加密敏感數據
function encryptData(data) {
  // 使用Utilities.computeDigest加密
}
```

### 5. 集成第三方服務

**Slack集成**：
```javascript
function notifySlack(message) {
  // 發送通知到Slack
}
```

**Google Forms集成**：
```javascript
// 自動從Google Form創建用戶
```

**Google Calendar集成**：
```javascript
// 記錄用戶操作到日曆
```

---

## 部署到生產環境

### 使用Google Cloud Run

1. 將React應用構建為靜態文件
2. 部署到Google Cloud Storage
3. 使用Cloud CDN加速

### 使用Firebase Hosting

```bash
# 安裝Firebase CLI
npm install -g firebase-tools

# 登錄Firebase
firebase login

# 初始化項目
firebase init hosting

# 構建React應用
pnpm build

# 部署
firebase deploy
```

### 使用Vercel或Netlify

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

---

## 性能優化

### 前端優化

1. **代碼分割**：使用動態導入分割代碼
2. **緩存**：使用localStorage緩存用戶列表
3. **虛擬化**：大列表使用虛擬滾動
4. **圖片優化**：使用WebP格式

### 後端優化

1. **批量操作**：一次處理多個用戶
2. **緩存結果**：緩存角色列表
3. **異步處理**：使用Triggers進行後台任務

### 數據庫優化

1. **歸檔舊數據**：定期清理歷史數據
2. **分表**：按時間或用戶ID分表
3. **備份**：定期備份到另一個Sheet

---

## 監控與日誌

### Google Apps Script日誌

```javascript
// 查看執行日誌
Logger.log("用戶創建成功");

// 在Apps Script編輯器中查看：
// 執行 → 日誌
```

### 前端日誌

```typescript
// 使用console記錄
console.log("API請求成功", result);
console.error("API請求失敗", error);
```

### 設置告警

1. 在Google Sheet中添加告警規則
2. 監控異常操作
3. 發送郵件通知

---

## 支持與反饋

如有問題或建議，請：

1. 檢查 [常見問題](#常見問題) 部分
2. 查看Google Apps Script官方文檔
3. 參考React官方文檔

---

## 許可證

本項目採用MIT許可證。

---

## 更新日誌

| 版本 | 日期 | 說明 |
|------|------|------|
| 1.0 | 2024年6月 | 初始版本 |

---

**最後更新**：2024年6月  
**作者**：Manus AI  
**項目名稱**：用戶管理系統 - React + Google Apps Script版本
