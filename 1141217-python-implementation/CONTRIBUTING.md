# 貢獻指南

感謝你對本項目的興趣！本指南將幫助你了解如何為這個項目做出貢獻。

## 貢獻方式

### 報告Bug

如果你發現了一個Bug，請通過以下方式報告：

1. 檢查 [Issues](https://github.com/flydancetolhs/CRM/issues) 中是否已有相同的報告。
2. 如果沒有，請創建一個新的Issue，並包含以下信息：
   - 清晰的標題
   - Bug的詳細描述
   - 復現步驟
   - 預期的行為
   - 實際的行為
   - 你的環境信息（Python版本、操作系統等）

### 提出功能建議

如果你有功能建議，請創建一個新的Issue，並包含：

1. 功能的詳細描述
2. 為什麼你認為這個功能是必要的
3. 可能的實現方式（可選）

### 提交代碼

1. **Fork** 這個倉庫
2. 創建一個新的分支：`git checkout -b feature/your-feature-name`
3. 進行你的修改
4. 提交你的修改：`git commit -m "Add your commit message"`
5. 推送到你的Fork：`git push origin feature/your-feature-name`
6. 創建一個 **Pull Request**

## 代碼風格指南

- 遵循 [PEP 8](https://www.python.org/dev/peps/pep-0008/) Python風格指南
- 使用有意義的變量名和函數名
- 為複雜的邏輯添加註釋
- 在提交前運行代碼檢查工具（如 `pylint` 或 `flake8`）

## 提交信息規範

請使用清晰且有描述性的提交信息：

```
[Type] Brief description

Detailed explanation if needed.

Fixes #issue_number
```

**Type** 可以是：
- `feat`: 新功能
- `fix`: Bug修復
- `docs`: 文檔更新
- `style`: 代碼風格修改
- `refactor`: 代碼重構
- `test`: 測試相關
- `chore`: 構建系統或依賴更新

## 測試

在提交Pull Request前，請確保：

1. 你的代碼不會破壞現有的功能
2. 新功能有相應的測試
3. 所有測試都能通過

## 許可證

通過提交代碼，你同意你的代碼將在 MIT License 下發布。

## 聯繫方式

如有任何問題，請通過以下方式聯繫：

- 在GitHub上提交Issue
- 發送郵件至項目維護者

感謝你的貢獻！
