import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUsers, getRoles, getRoleById, deleteUser, updateUser } from '@/lib/db';
import { useAuthContext } from '@/components/auth/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuthContext();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  useEffect(() => {
    // Загружаем пользователей и роли
    const loadedUsers = getUsers();
    const loadedRoles = getRoles();
    
    setUsers(loadedUsers);
    setRoles(loadedRoles);
  }, []);

  const handleRoleChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setSelectedRole(user.roleId);
      setIsRoleDialogOpen(true);
    }
  };

  const handleRoleUpdate = () => {
    if (selectedUser && selectedRole) {
      try {
        // Обновляем роль пользователя
        const updatedUser = updateUser({
          ...selectedUser,
          roleId: selectedRole
        });
        
        // Обновляем список пользователей
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        
        toast({
          title: "Роль обновлена",
          description: `Роль пользователя ${updatedUser.name} успешно обновлена`,
        });
        
        // Закрываем диалог
        setIsRoleDialogOpen(false);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить роль пользователя",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    try {
      // Не позволяем удалить текущего пользователя
      if (userId === currentUser?.id) {
        toast({
          title: "Ошибка",
          description: "Вы не можете удалить свою учетную запись",
          variant: "destructive"
        });
        return;
      }
      
      // Удаляем пользователя
      deleteUser(userId);
      
      // Обновляем список пользователей
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: "Пользователь удален",
        description: "Учетная запись пользователя успешно удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить учетную запись",
        variant: "destructive"
      });
    }
  };

  // Получаем название роли по ID
  const getRoleName = (roleId: string) => {
    const role = getRoleById(roleId);
    return role ? role.name : roleId;
  };

  // Получаем цвет для бейджа роли
  const getRoleBadgeColor = (roleId: string) => {
    switch (roleId) {
      case 'admin': return 'bg-red-600';
      case 'researcher': return 'bg-blue-600';
      case 'reader': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <ProtectedRoute requiredPermission="all">
      <Layout>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-sce-primary mb-8">Управление пользователями</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Пользователи системы</CardTitle>
              <CardDescription>
                Список всех зарегистрированных пользователей Фонда SCE
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.roleId)}>
                              {getRoleName(user.roleId)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleRoleChange(user.id)}
                              >
                                Изменить роль
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" disabled={user.id === currentUser?.id}>
                                    Удалить
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Это действие нельзя отменить. Пользователь будет полностью удален из системы.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteUser(user.id)} 
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>Нет зарегистрированных пользователей</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Диалог изменения роли */}
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Изменение роли пользователя</DialogTitle>
                <DialogDescription>
                  Выберите новую роль для пользователя {selectedUser?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleRoleUpdate}>
                  Сохранить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserManagement;
