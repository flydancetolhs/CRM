# 快速開始指南 - 5分鐘部署

## 📌 前置要求

- Google帳號
- Node.js 16+ 和 pnpm
- 代碼編輯器（VS Code推薦）

---

## 🚀 5步快速部署

### 步驟1：創建Google Sheet（1分鐘）

1. 打開 [Google Sheet](https://sheets.google.com)
2. 新建電子表格，命名為 "用戶管理系統"
3. 記下URL中的電子表格ID（`/d/` 後面的部分）

### 步驟2：設置表格結構（1分鐘）

**第一個工作表（Users）**：
```
A: ID | B: Username | C: Email | D: Phone | E: Password Hash | F: Roles | G: Is Active | H: Created At | I: Updated At
```

**新建工作表（Roles）**：
```
A: ID | B: Name | C: Permissions | D: Created At | E: Updated At
```

### 步驟3：部署Google Apps Script（2分鐘）

1. 在Google Sheet中，點擊 "擴展功能" → "Apps Script"
2. 清空默認代碼，複製 `google_apps_script.js` 中的所有代碼
3. 保存（Ctrl+S）
4. 點擊 "部署" → "新建部署" → "Web應用"
5. 執行身份：選擇您的Google帳號
6. 有權訪問的用戶：選擇 "任何人"
7. 點擊 "部署"，複製生成的URL

### 步驟4：配置React應用（1分鐘）

在 `user_management_react` 目錄創建 `.env.local`：

```env
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercontent
```

將 `{YOUR_DEPLOYMENT_ID}` 替換為步驟3中的部署ID。

### 步驟5：運行應用（1分鐘）

```bash
cd user_management_react
pnpm install
pnpm dev
```

訪問 `http://localhost:3000`，開始使用！

---

## ✅ 驗證部署

### 測試創建用戶

1. 點擊 "新建用戶"
2. 填寫信息：
   - 用戶名：`testuser`
   - 郵箱：`test@example.com`
   - 手機號：`13800138000`
   - 密碼：`password123`
3. 點擊 "創建用戶"
4. 應該看到成功提示

### 檢查Google Sheet

1. 打開Google Sheet
2. 在Users工作表中應該看到新用戶
3. 數據應該包含：用戶名、郵箱、手機號等

---

## 🔧 常見問題快速解決

| 問題 | 解決方案 |
|------|--------|
| **部署URL無效** | 檢查URL格式，確保複製完整 |
| **CORS錯誤** | 確保Apps Script部署時選擇"任何人"訪問 |
| **無法加載用戶** | 檢查Google Sheet是否有Users工作表和表頭 |
| **創建用戶失敗** | 檢查郵箱是否已存在，密碼是否至少8個字符 |

---

## 📚 下一步

- 閱讀完整教程：[TUTORIAL.md](./TUTORIAL.md)
- 了解系統架構：[README.md](./README.md)
- 查看API文檔：[API.md](./API.md)（如果有）

---

## 🎯 典型工作流

```
1. 創建用戶
   ↓
2. 創建角色
   ↓
3. 為用戶分配角色
   ↓
4. 管理權限
   ↓
5. 查詢和報告
```

---

## 💡 提示

- **開發環境**：使用 `pnpm dev` 進行本地開發
- **生產構建**：使用 `pnpm build` 構建生產版本
- **調試**：打開瀏覽器開發者工具（F12）查看API請求
- **Google Sheet備份**：定期下載備份，防止數據丟失

---

## 📞 需要幫助？

1. 檢查 [TUTORIAL.md](./TUTORIAL.md) 的常見問題部分
2. 查看Google Apps Script官方文檔
3. 檢查瀏覽器控制台的錯誤信息

---

**祝您使用愉快！** 🎉
