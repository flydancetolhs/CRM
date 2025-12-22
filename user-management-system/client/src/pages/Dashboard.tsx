import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Users, Shield, Search } from "lucide-react";
import { GoogleAppsScriptAPI } from "@/lib/api";

interface User {
  userId: string;
  username: string;
  email: string;
  phone: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
}

interface Role {
  roleId: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);

  // 表單狀態
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    roleIds: [] as string[]
  });

  const [roleFormData, setRoleFormData] = useState({
    name: "",
    permissions: [] as string[]
  });

  const api = new GoogleAppsScriptAPI();

  // 加載用戶列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await api.queryUsers({
        username: searchQuery || undefined
      });
      if (result.success) {
        setUsers(result.data || []);
      } else {
        toast.error(result.message || "加載用戶失敗");
      }
    } catch (error) {
      toast.error("加載用戶失敗");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 加載角色列表
  const loadRoles = async () => {
    try {
      const result = await api.listRoles();
      if (result.success) {
        setRoles(result.data || []);
      }
    } catch (error) {
      console.error("加載角色失敗", error);
    }
  };

  // 初始化加載
  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // 搜索用戶
  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 創建用戶
  const handleCreateUser = async () => {
    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      toast.error("請填寫所有必填字段");
      return;
    }

    try {
      const result = await api.createUser(
        formData.username,
        formData.email,
        formData.phone,
        formData.password,
        formData.roleIds
      );

      if (result.success) {
        toast.success(result.message || "用戶創建成功");
        setFormData({ username: "", email: "", phone: "", password: "", roleIds: [] });
        setIsCreateUserOpen(false);
        loadUsers();
      } else {
        toast.error(result.message || "創建用戶失敗");
      }
    } catch (error) {
      toast.error("創建用戶失敗");
      console.error(error);
    }
  };

  // 創建角色
  const handleCreateRole = async () => {
    if (!roleFormData.name) {
      toast.error("請填寫角色名稱");
      return;
    }

    try {
      const result = await api.createRole(roleFormData.name, roleFormData.permissions);

      if (result.success) {
        toast.success(result.message || "角色創建成功");
        setRoleFormData({ name: "", permissions: [] });
        setIsCreateRoleOpen(false);
        loadRoles();
      } else {
        toast.error(result.message || "創建角色失敗");
      }
    } catch (error) {
      toast.error("創建角色失敗");
      console.error(error);
    }
  };

  // 刪除用戶
  const handleDeleteUser = async (userId: string) => {
    if (confirm("確定要刪除此用戶嗎？")) {
      try {
        const result = await api.deleteUser(userId);
        if (result.success) {
          toast.success("用戶刪除成功");
          loadUsers();
        } else {
          toast.error(result.message || "刪除用戶失敗");
        }
      } catch (error) {
        toast.error("刪除用戶失敗");
        console.error(error);
      }
    }
  };

  // 分配角色
  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      const result = await api.assignRole(userId, roleId);
      if (result.success) {
        toast.success("角色分配成功");
        loadUsers();
      } else {
        toast.error(result.message || "分配角色失敗");
      }
    } catch (error) {
      toast.error("分配角色失敗");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">用戶管理系統</h1>
          <p className="text-gray-600">使用 React + Google Apps Script + Google Sheet 構建</p>
        </div>

        {/* 標籤頁 */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              用戶管理
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              角色管理
            </TabsTrigger>
          </TabsList>

          {/* 用戶管理標籤 */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>用戶列表</CardTitle>
                <CardDescription>管理系統中的所有用戶</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 搜索和操作欄 */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="search" className="mb-2 block">
                      搜索用戶
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="按用戶名搜索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        新建用戶
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>創建新用戶</DialogTitle>
                        <DialogDescription>填寫以下信息創建新用戶</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="username">用戶名</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="3-20個字符"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">郵箱</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="user@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">手機號</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="10-15位數字"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">密碼</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="至少8個字符"
                          />
                        </div>
                        <div>
                          <Label htmlFor="roles">角色</Label>
                          <Select
                            value={formData.roleIds[0] || ""}
                            onValueChange={(value) => setFormData({ ...formData, roleIds: [value] })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="選擇角色" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.roleId} value={role.roleId}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleCreateUser} className="w-full">
                          創建用戶
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* 用戶表格 */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用戶名</TableHead>
                        <TableHead>郵箱</TableHead>
                        <TableHead>手機號</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>創建時間</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            加載中...
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            暫無用戶數據
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.userId}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {user.roles.length > 0 ? (
                                  user.roles.map((roleId) => {
                                    const role = roles.find((r) => r.roleId === roleId);
                                    return (
                                      <span
                                        key={roleId}
                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                      >
                                        {role?.name || roleId}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-gray-500 text-sm">無</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const roleId = roles[0]?.roleId;
                                    if (roleId) handleAssignRole(user.userId, roleId);
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.userId)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 角色管理標籤 */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>角色列表</CardTitle>
                <CardDescription>管理系統中的所有角色和權限</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      新建角色
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>創建新角色</DialogTitle>
                      <DialogDescription>填寫以下信息創建新角色</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="roleName">角色名稱</Label>
                        <Input
                          id="roleName"
                          value={roleFormData.name}
                          onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                          placeholder="例如：Editor"
                        />
                      </div>
                      <Button onClick={handleCreateRole} className="w-full">
                        創建角色
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="grid gap-4">
                  {roles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">暫無角色數據</div>
                  ) : (
                    roles.map((role) => (
                      <Card key={role.roleId} className="bg-white">
                        <CardHeader>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription>ID: {role.roleId}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <p className="text-sm font-medium mb-2">權限：</p>
                            <div className="flex gap-2 flex-wrap">
                              {role.permissions.length > 0 ? (
                                role.permissions.map((perm) => (
                                  <span
                                    key={perm}
                                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                  >
                                    {perm}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-sm">無權限</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
