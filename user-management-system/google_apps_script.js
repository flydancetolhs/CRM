/**
 * 用戶管理系統 - Google Apps Script 後端實現
 * 
 * 此文件包含所有與Google Sheet交互的業務邏輯
 * 將此代碼複製到Google Apps Script編輯器中
 * 
 * 設置步驟：
 * 1. 在Google Sheet中打開 "擴展功能" > "Apps Script"
 * 2. 將此代碼複製到 Code.gs 文件中
 * 3. 點擊 "部署" > "新建部署" > 選擇 "Web應用"
 * 4. 執行身份為：您的Google帳號
 * 5. 有權訪問的用戶：任何人
 * 6. 複製部署URL供前端使用
 */

// ============================================================================
// 1. 全局配置與工具函數
// ============================================================================

/**
 * 獲取電子表格和工作表
 */
function getSpreadsheet() {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  return spreadsheet;
}

function getUsersSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Users");
  if (!sheet) {
    sheet = ss.insertSheet("Users");
    // 初始化表頭
    sheet.appendRow(["ID", "Username", "Email", "Phone", "Password Hash", "Roles", "Is Active", "Created At", "Updated At"]);
  }
  return sheet;
}

function getRolesSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName("Roles");
  if (!sheet) {
    sheet = ss.insertSheet("Roles");
    // 初始化表頭
    sheet.appendRow(["ID", "Name", "Permissions", "Created At", "Updated At"]);
  }
  return sheet;
}

/**
 * 生成唯一ID
 */
function generateId(prefix) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * SHA256密碼加密（簡化版，實際應用應使用更安全的方法）
 */
function hashPassword(password) {
  // 注意：Google Apps Script的Utilities.computeDigest不支持SHA256
  // 這裡使用簡化的加密方法，實際應用應考慮使用第三方服務
  const salt = "user_management_system";
  const combined = password + salt;
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined)
    .map(byte => ("0" + (byte & 0xFF).toString(16)).slice(-2))
    .join("");
}

/**
 * 驗證密碼
 */
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

/**
 * 驗證用戶名格式
 */
function validateUsername(username) {
  if (!username || username.length < 3 || username.length > 20) {
    return false;
  }
  return /^[a-zA-Z0-9_]+$/.test(username);
}

/**
 * 驗證郵箱格式
 */
function validateEmail(email) {
  if (!email || !email.includes("@")) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 驗證手機號格式
 */
function validatePhone(phone) {
  if (!phone || phone.length < 10 || phone.length > 15) {
    return false;
  }
  return /^\d+$/.test(phone);
}

/**
 * 驗證密碼強度
 */
function validatePassword(password) {
  return password && password.length >= 8;
}

// ============================================================================
// 2. 用戶管理函數
// ============================================================================

/**
 * 創建新用戶
 */
function createUser(username, email, phone, password, roleIds) {
  try {
    // 驗證輸入
    if (!validateUsername(username)) {
      return {
        success: false,
        message: "用戶名格式不正確（3-20個字符，只包含字母、數字、下劃線）"
      };
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        message: "郵箱格式不正確"
      };
    }

    if (!validatePhone(phone)) {
      return {
        success: false,
        message: "手機號格式不正確（10-15位數字）"
      };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        message: "密碼長度至少8個字符"
      };
    }

    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();

    // 檢查用戶名是否已存在
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === username) {
        return {
          success: false,
          message: "用戶名已存在"
        };
      }
      if (data[i][2] === email) {
        return {
          success: false,
          message: "郵箱已被使用"
        };
      }
    }

    // 驗證角色是否存在
    if (roleIds && roleIds.length > 0) {
      const rolesSheet = getRolesSheet();
      const rolesData = rolesSheet.getDataRange().getValues();
      const roleIdSet = new Set(rolesData.slice(1).map(row => row[0]));

      for (const roleId of roleIds) {
        if (!roleIdSet.has(roleId)) {
          return {
            success: false,
            message: `角色 ${roleId} 不存在`
          };
        }
      }
    }

    // 創建用戶
    const userId = generateId("user");
    const passwordHash = hashPassword(password);
    const now = new Date().toISOString();
    const rolesStr = roleIds ? roleIds.join(",") : "";

    sheet.appendRow([
      userId,
      username,
      email,
      phone,
      passwordHash,
      rolesStr,
      true,
      now,
      now
    ]);

    return {
      success: true,
      message: `用戶 ${username} 創建成功`,
      userId: userId
    };
  } catch (error) {
    return {
      success: false,
      message: `創建用戶失敗：${error.message}`
    };
  }
}

/**
 * 獲取用戶詳情
 */
function getUser(userId) {
  try {
    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        return {
          success: true,
          data: {
            userId: data[i][0],
            username: data[i][1],
            email: data[i][2],
            phone: data[i][3],
            roles: data[i][5] ? data[i][5].split(",") : [],
            isActive: data[i][6],
            createdAt: data[i][7],
            updatedAt: data[i][8]
          }
        };
      }
    }

    return {
      success: false,
      message: "用戶不存在"
    };
  } catch (error) {
    return {
      success: false,
      message: `獲取用戶失敗：${error.message}`
    };
  }
}

/**
 * 更新用戶信息
 */
function updateUser(userId, email, phone, roleIds) {
  try {
    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();

    let userRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        userRowIndex = i;
        break;
      }
    }

    if (userRowIndex === -1) {
      return {
        success: false,
        message: "用戶不存在"
      };
    }

    // 驗證郵箱
    if (email && email !== data[userRowIndex][2]) {
      if (!validateEmail(email)) {
        return {
          success: false,
          message: "郵箱格式不正確"
        };
      }

      // 檢查郵箱是否已被使用
      for (let i = 1; i < data.length; i++) {
        if (i !== userRowIndex && data[i][2] === email) {
          return {
            success: false,
            message: "郵箱已被使用"
          };
        }
      }
      sheet.getRange(userRowIndex + 1, 3).setValue(email);
    }

    // 驗證手機號
    if (phone && phone !== data[userRowIndex][3]) {
      if (!validatePhone(phone)) {
        return {
          success: false,
          message: "手機號格式不正確"
        };
      }
      sheet.getRange(userRowIndex + 1, 4).setValue(phone);
    }

    // 更新角色
    if (roleIds !== undefined) {
      const rolesSheet = getRolesSheet();
      const rolesData = rolesSheet.getDataRange().getValues();
      const roleIdSet = new Set(rolesData.slice(1).map(row => row[0]));

      for (const roleId of roleIds) {
        if (!roleIdSet.has(roleId)) {
          return {
            success: false,
            message: `角色 ${roleId} 不存在`
          };
        }
      }

      const rolesStr = roleIds.join(",");
      sheet.getRange(userRowIndex + 1, 6).setValue(rolesStr);
    }

    // 更新時間戳
    const now = new Date().toISOString();
    sheet.getRange(userRowIndex + 1, 9).setValue(now);

    return {
      success: true,
      message: `用戶 ${data[userRowIndex][1]} 更新成功`
    };
  } catch (error) {
    return {
      success: false,
      message: `更新用戶失敗：${error.message}`
    };
  }
}

/**
 * 刪除用戶
 */
function deleteUser(userId) {
  try {
    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        sheet.deleteRow(i + 1);
        return {
          success: true,
          message: `用戶 ${data[i][1]} 刪除成功`
        };
      }
    }

    return {
      success: false,
      message: "用戶不存在"
    };
  } catch (error) {
    return {
      success: false,
      message: `刪除用戶失敗：${error.message}`
    };
  }
}

/**
 * 查詢用戶（支持多條件）
 */
function queryUsers(criteria) {
  try {
    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const user = {
        userId: data[i][0],
        username: data[i][1],
        email: data[i][2],
        phone: data[i][3],
        roles: data[i][5] ? data[i][5].split(",") : [],
        isActive: data[i][6],
        createdAt: data[i][7],
        updatedAt: data[i][8]
      };

      // 應用查詢條件
      let matches = true;

      if (criteria.username && !user.username.toLowerCase().includes(criteria.username.toLowerCase())) {
        matches = false;
      }

      if (criteria.email && !user.email.toLowerCase().includes(criteria.email.toLowerCase())) {
        matches = false;
      }

      if (criteria.phone && !user.phone.includes(criteria.phone)) {
        matches = false;
      }

      if (matches) {
        results.push(user);
      }
    }

    return {
      success: true,
      count: results.length,
      data: results
    };
  } catch (error) {
    return {
      success: false,
      message: `查詢用戶失敗：${error.message}`
    };
  }
}

/**
 * 為用戶分配角色
 */
function assignRole(userId, roleId) {
  try {
    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();

    let userRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        userRowIndex = i;
        break;
      }
    }

    if (userRowIndex === -1) {
      return {
        success: false,
        message: "用戶不存在"
      };
    }

    // 驗證角色是否存在
    const rolesSheet = getRolesSheet();
    const rolesData = rolesSheet.getDataRange().getValues();
    let roleExists = false;
    let roleName = "";

    for (let i = 1; i < rolesData.length; i++) {
      if (rolesData[i][0] === roleId) {
        roleExists = true;
        roleName = rolesData[i][1];
        break;
      }
    }

    if (!roleExists) {
      return {
        success: false,
        message: "角色不存在"
      };
    }

    // 檢查用戶是否已擁有此角色
    const roles = data[userRowIndex][5] ? data[userRowIndex][5].split(",") : [];
    if (roles.includes(roleId)) {
      return {
        success: false,
        message: "用戶已擁有此角色"
      };
    }

    // 添加角色
    roles.push(roleId);
    const rolesStr = roles.join(",");
    sheet.getRange(userRowIndex + 1, 6).setValue(rolesStr);

    // 更新時間戳
    const now = new Date().toISOString();
    sheet.getRange(userRowIndex + 1, 9).setValue(now);

    return {
      success: true,
      message: `成功為用戶 ${data[userRowIndex][1]} 分配角色 ${roleName}`
    };
  } catch (error) {
    return {
      success: false,
      message: `分配角色失敗：${error.message}`
    };
  }
}

/**
 * 撤銷用戶的角色
 */
function revokeRole(userId, roleId) {
  try {
    const sheet = getUsersSheet();
    const data = sheet.getDataRange().getValues();

    let userRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        userRowIndex = i;
        break;
      }
    }

    if (userRowIndex === -1) {
      return {
        success: false,
        message: "用戶不存在"
      };
    }

    // 移除角色
    const roles = data[userRowIndex][5] ? data[userRowIndex][5].split(",") : [];
    const index = roles.indexOf(roleId);

    if (index === -1) {
      return {
        success: false,
        message: "用戶不擁有此角色"
      };
    }

    roles.splice(index, 1);
    const rolesStr = roles.join(",");
    sheet.getRange(userRowIndex + 1, 6).setValue(rolesStr);

    // 更新時間戳
    const now = new Date().toISOString();
    sheet.getRange(userRowIndex + 1, 9).setValue(now);

    return {
      success: true,
      message: `成功撤銷用戶 ${data[userRowIndex][1]} 的角色`
    };
  } catch (error) {
    return {
      success: false,
      message: `撤銷角色失敗：${error.message}`
    };
  }
}

// ============================================================================
// 3. 角色管理函數
// ============================================================================

/**
 * 創建角色
 */
function createRole(name, permissions) {
  try {
    const sheet = getRolesSheet();
    const data = sheet.getDataRange().getValues();

    // 檢查角色名是否已存在
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === name) {
        return {
          success: false,
          message: `角色 ${name} 已存在`
        };
      }
    }

    // 創建角色
    const roleId = generateId("role");
    const now = new Date().toISOString();
    const permissionsStr = permissions ? permissions.join(",") : "";

    sheet.appendRow([
      roleId,
      name,
      permissionsStr,
      now,
      now
    ]);

    return {
      success: true,
      message: `角色 ${name} 創建成功`,
      roleId: roleId
    };
  } catch (error) {
    return {
      success: false,
      message: `創建角色失敗：${error.message}`
    };
  }
}

/**
 * 列出所有角色
 */
function listRoles() {
  try {
    const sheet = getRolesSheet();
    const data = sheet.getDataRange().getValues();
    const roles = [];

    for (let i = 1; i < data.length; i++) {
      roles.push({
        roleId: data[i][0],
        name: data[i][1],
        permissions: data[i][2] ? data[i][2].split(",") : [],
        createdAt: data[i][3],
        updatedAt: data[i][4]
      });
    }

    return {
      success: true,
      count: roles.length,
      data: roles
    };
  } catch (error) {
    return {
      success: false,
      message: `列出角色失敗：${error.message}`
    };
  }
}

/**
 * 為角色添加權限
 */
function addPermissionToRole(roleId, permission) {
  try {
    const sheet = getRolesSheet();
    const data = sheet.getDataRange().getValues();

    let roleRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === roleId) {
        roleRowIndex = i;
        break;
      }
    }

    if (roleRowIndex === -1) {
      return {
        success: false,
        message: "角色不存在"
      };
    }

    // 添加權限
    const permissions = data[roleRowIndex][2] ? data[roleRowIndex][2].split(",") : [];
    if (permissions.includes(permission)) {
      return {
        success: false,
        message: "角色已擁有此權限"
      };
    }

    permissions.push(permission);
    const permissionsStr = permissions.join(",");
    sheet.getRange(roleRowIndex + 1, 3).setValue(permissionsStr);

    // 更新時間戳
    const now = new Date().toISOString();
    sheet.getRange(roleRowIndex + 1, 5).setValue(now);

    return {
      success: true,
      message: `成功為角色 ${data[roleRowIndex][1]} 添加權限 ${permission}`
    };
  } catch (error) {
    return {
      success: false,
      message: `添加權限失敗：${error.message}`
    };
  }
}

// ============================================================================
// 4. Web應用端點 (必須部署為Web應用)
// ============================================================================

/**
 * 處理POST請求
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let result;

    switch (action) {
      // 用戶管理
      case "createUser":
        result = createUser(data.username, data.email, data.phone, data.password, data.roleIds);
        break;
      case "getUser":
        result = getUser(data.userId);
        break;
      case "updateUser":
        result = updateUser(data.userId, data.email, data.phone, data.roleIds);
        break;
      case "deleteUser":
        result = deleteUser(data.userId);
        break;
      case "queryUsers":
        result = queryUsers(data.criteria || {});
        break;
      case "assignRole":
        result = assignRole(data.userId, data.roleId);
        break;
      case "revokeRole":
        result = revokeRole(data.userId, data.roleId);
        break;

      // 角色管理
      case "createRole":
        result = createRole(data.name, data.permissions);
        break;
      case "listRoles":
        result = listRoles();
        break;
      case "addPermissionToRole":
        result = addPermissionToRole(data.roleId, data.permission);
        break;

      default:
        result = {
          success: false,
          message: `未知的操作：${action}`
        };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: `服務器錯誤：${error.message}`
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 處理GET請求（用於測試）
 */
function doGet(e) {
  const action = e.parameter.action;

  let result;

  switch (action) {
    case "listRoles":
      result = listRoles();
      break;
    case "queryUsers":
      const criteria = {};
      if (e.parameter.username) criteria.username = e.parameter.username;
      if (e.parameter.email) criteria.email = e.parameter.email;
      if (e.parameter.phone) criteria.phone = e.parameter.phone;
      result = queryUsers(criteria);
      break;
    default:
      result = {
        success: false,
        message: `未知的操作：${action}`
      };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 5. 初始化函數（首次運行時調用）
// ============================================================================

/**
 * 初始化系統（創建表格和默認數據）
 */
function initializeSystem() {
  try {
    // 確保表格存在
    getUsersSheet();
    getRolesSheet();

    // 創建默認角色
    createRole("Admin", ["user:view", "user:add", "user:update", "user:delete", "role:manage"]);
    createRole("User", ["user:view"]);

    Logger.log("系統初始化成功");
    return {
      success: true,
      message: "系統初始化成功"
    };
  } catch (error) {
    Logger.log(`初始化失敗：${error.message}`);
    return {
      success: false,
      message: `初始化失敗：${error.message}`
    };
  }
}
