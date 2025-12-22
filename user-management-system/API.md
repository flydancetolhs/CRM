# Google Apps Script API 文檔

## 概述

本文檔詳細說明了Google Apps Script後端提供的所有API端點。所有請求都通過HTTP POST或GET發送到部署的Web應用URL。

---

## 基本信息

| 項目 | 說明 |
|------|------|
| **基礎URL** | `https://script.google.com/macros/d/{deploymentId}/usercontent` |
| **請求方法** | POST（推薦）或 GET |
| **內容類型** | application/json |
| **響應格式** | JSON |

---

## 響應格式

所有API響應都遵循以下格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": {...},
  "count": 10
}
```

| 字段 | 類型 | 說明 |
|------|------|------|
| **success** | boolean | 操作是否成功 |
| **message** | string | 操作結果消息 |
| **data** | object/array | 返回的數據（可選） |
| **count** | number | 返回的記錄數（可選） |

---

## 用戶管理 API

### 1. 創建用戶

**請求**：
```json
POST /usercontent
{
  "action": "createUser",
  "username": "alice",
  "email": "alice@example.com",
  "phone": "13800138000",
  "password": "password123",
  "roleIds": ["role_1"]
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：createUser |
| username | string | ✓ | 用戶名（3-20個字符，只包含字母、數字、下劃線） |
| email | string | ✓ | 郵箱（必須唯一） |
| phone | string | ✓ | 手機號（10-15位數字） |
| password | string | ✓ | 密碼（至少8個字符） |
| roleIds | array | ✗ | 角色ID列表 |

**響應示例**：
```json
{
  "success": true,
  "message": "用戶 alice 創建成功",
  "userId": "user_1719041400000_5432"
}
```

**錯誤示例**：
```json
{
  "success": false,
  "message": "用戶名已存在"
}
```

---

### 2. 獲取用戶詳情

**請求**：
```json
POST /usercontent
{
  "action": "getUser",
  "userId": "user_1719041400000_5432"
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：getUser |
| userId | string | ✓ | 用戶ID |

**響應示例**：
```json
{
  "success": true,
  "data": {
    "userId": "user_1719041400000_5432",
    "username": "alice",
    "email": "alice@example.com",
    "phone": "13800138000",
    "roles": ["role_1"],
    "isActive": true,
    "createdAt": "2024-06-21T10:00:00Z",
    "updatedAt": "2024-06-21T10:00:00Z"
  }
}
```

---

### 3. 更新用戶

**請求**：
```json
POST /usercontent
{
  "action": "updateUser",
  "userId": "user_1719041400000_5432",
  "email": "newemail@example.com",
  "phone": "13900139000",
  "roleIds": ["role_1", "role_2"]
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：updateUser |
| userId | string | ✓ | 用戶ID |
| email | string | ✗ | 新郵箱 |
| phone | string | ✗ | 新手機號 |
| roleIds | array | ✗ | 新角色列表 |

**響應示例**：
```json
{
  "success": true,
  "message": "用戶 alice 更新成功"
}
```

---

### 4. 刪除用戶

**請求**：
```json
POST /usercontent
{
  "action": "deleteUser",
  "userId": "user_1719041400000_5432"
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：deleteUser |
| userId | string | ✓ | 用戶ID |

**響應示例**：
```json
{
  "success": true,
  "message": "用戶 alice 刪除成功"
}
```

---

### 5. 查詢用戶

**POST請求**：
```json
POST /usercontent
{
  "action": "queryUsers",
  "criteria": {
    "username": "alice",
    "email": "example.com",
    "phone": "138"
  }
}
```

**GET請求**：
```
GET /usercontent?action=queryUsers&username=alice&email=example.com&phone=138
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：queryUsers |
| criteria | object | ✗ | 查詢條件 |
| criteria.username | string | ✗ | 用戶名（支持模糊搜索） |
| criteria.email | string | ✗ | 郵箱（支持模糊搜索） |
| criteria.phone | string | ✗ | 手機號（支持模糊搜索） |

**響應示例**：
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "userId": "user_1719041400000_5432",
      "username": "alice",
      "email": "alice@example.com",
      "phone": "13800138000",
      "roles": ["role_1"],
      "isActive": true,
      "createdAt": "2024-06-21T10:00:00Z",
      "updatedAt": "2024-06-21T10:00:00Z"
    }
  ]
}
```

---

### 6. 為用戶分配角色

**請求**：
```json
POST /usercontent
{
  "action": "assignRole",
  "userId": "user_1719041400000_5432",
  "roleId": "role_2"
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：assignRole |
| userId | string | ✓ | 用戶ID |
| roleId | string | ✓ | 角色ID |

**響應示例**：
```json
{
  "success": true,
  "message": "成功為用戶 alice 分配角色 User"
}
```

---

### 7. 撤銷用戶的角色

**請求**：
```json
POST /usercontent
{
  "action": "revokeRole",
  "userId": "user_1719041400000_5432",
  "roleId": "role_2"
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：revokeRole |
| userId | string | ✓ | 用戶ID |
| roleId | string | ✓ | 角色ID |

**響應示例**：
```json
{
  "success": true,
  "message": "成功撤銷用戶 alice 的角色"
}
```

---

## 角色管理 API

### 1. 創建角色

**請求**：
```json
POST /usercontent
{
  "action": "createRole",
  "name": "Editor",
  "permissions": ["user:view", "user:add", "user:update"]
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：createRole |
| name | string | ✓ | 角色名稱 |
| permissions | array | ✗ | 權限列表 |

**響應示例**：
```json
{
  "success": true,
  "message": "角色 Editor 創建成功",
  "roleId": "role_1719041400000_5432"
}
```

---

### 2. 列出所有角色

**POST請求**：
```json
POST /usercontent
{
  "action": "listRoles"
}
```

**GET請求**：
```
GET /usercontent?action=listRoles
```

**響應示例**：
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "roleId": "role_1",
      "name": "Admin",
      "permissions": ["user:view", "user:add", "user:update", "user:delete", "role:manage"],
      "createdAt": "2024-06-21T10:00:00Z",
      "updatedAt": "2024-06-21T10:00:00Z"
    },
    {
      "roleId": "role_2",
      "name": "User",
      "permissions": ["user:view"],
      "createdAt": "2024-06-21T10:00:00Z",
      "updatedAt": "2024-06-21T10:00:00Z"
    }
  ]
}
```

---

### 3. 為角色添加權限

**請求**：
```json
POST /usercontent
{
  "action": "addPermissionToRole",
  "roleId": "role_2",
  "permission": "user:delete"
}
```

**參數**：

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| action | string | ✓ | 操作名稱：addPermissionToRole |
| roleId | string | ✓ | 角色ID |
| permission | string | ✓ | 權限名稱 |

**響應示例**：
```json
{
  "success": true,
  "message": "成功為角色 User 添加權限 user:delete"
}
```

---

## 系統管理 API

### 初始化系統

**請求**：
```json
POST /usercontent
{
  "action": "initializeSystem"
}
```

**說明**：
- 創建Users和Roles工作表
- 創建默認角色（Admin和User）
- 初始化系統數據

**響應示例**：
```json
{
  "success": true,
  "message": "系統初始化成功"
}
```

---

## 權限列表

系統內置以下權限：

| 權限 | 說明 |
|------|------|
| `user:view` | 查看用戶列表 |
| `user:add` | 創建新用戶 |
| `user:update` | 編輯用戶信息 |
| `user:delete` | 刪除用戶 |
| `role:manage` | 管理角色和權限 |

---

## 錯誤處理

### 常見錯誤碼

| 錯誤 | 說明 | 解決方案 |
|------|------|--------|
| 用戶名已存在 | 用戶名重複 | 使用不同的用戶名 |
| 郵箱已被使用 | 郵箱重複 | 使用不同的郵箱 |
| 用戶不存在 | 用戶ID無效 | 檢查用戶ID是否正確 |
| 角色不存在 | 角色ID無效 | 檢查角色ID是否正確 |
| 用戶名格式不正確 | 用戶名不符合規則 | 使用3-20個字符，只包含字母、數字、下劃線 |
| 郵箱格式不正確 | 郵箱格式無效 | 使用有效的郵箱格式 |
| 手機號格式不正確 | 手機號不符合規則 | 使用10-15位數字 |
| 密碼長度至少8個字符 | 密碼太短 | 使用至少8個字符的密碼 |

### 錯誤響應示例

```json
{
  "success": false,
  "message": "用戶名已存在"
}
```

---

## 使用示例

### JavaScript/TypeScript

```typescript
// 創建用戶
const response = await fetch(deploymentUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    action: "createUser",
    username: "alice",
    email: "alice@example.com",
    phone: "13800138000",
    password: "password123"
  })
});

const result = await response.json();
if (result.success) {
  console.log("用戶創建成功", result.userId);
} else {
  console.error("創建失敗", result.message);
}
```

### Python

```python
import requests
import json

deployment_url = "https://script.google.com/macros/d/{deploymentId}/usercontent"

# 創建用戶
payload = {
    "action": "createUser",
    "username": "alice",
    "email": "alice@example.com",
    "phone": "13800138000",
    "password": "password123"
}

response = requests.post(deployment_url, json=payload)
result = response.json()

if result["success"]:
    print(f"用戶創建成功：{result['userId']}")
else:
    print(f"創建失敗：{result['message']}")
```

### cURL

```bash
curl -X POST \
  https://script.google.com/macros/d/{deploymentId}/usercontent \
  -H "Content-Type: application/json" \
  -d '{
    "action": "createUser",
    "username": "alice",
    "email": "alice@example.com",
    "phone": "13800138000",
    "password": "password123"
  }'
```

---

## 速率限制

Google Apps Script有以下限制：

| 限制 | 值 |
|------|-----|
| 每天執行次數 | 20,000 |
| 同時執行數 | 30 |
| 執行時間 | 6分鐘 |

---

## 最佳實踐

1. **錯誤處理**：始終檢查 `success` 字段
2. **驗證輸入**：在發送前驗證數據
3. **重試機制**：在失敗時實現重試邏輯
4. **日誌記錄**：記錄所有API調用用於調試
5. **安全性**：使用HTTPS傳輸敏感數據

---

## 更新日誌

| 版本 | 日期 | 說明 |
|------|------|------|
| 1.0 | 2024年6月 | 初始版本 |

---

**最後更新**：2024年6月
