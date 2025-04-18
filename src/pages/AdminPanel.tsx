import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [objectCount, setObjectCount] = useState(5); // Пример данных
  const [postCount, setPostCount] = useState(3); // Пример данных

  useEffect(() => {
    // Проверка прав администратора
    const user = localStorage.getItem('sce-user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        setIsAdmin(true);
      } else {
        // Перенаправление на главную, если пользователь не администратор
        navigate('/');
      }
    } else {
      // Перенаправление на страницу входа, если пользователь не авторизован
      navigate('/login');
    }
    
    // Загрузка количества пользователей
    const users = localStorage.getItem('sce-users');
    if (users) {
      setUserCount(JSON.parse(users).length);
    }
  }, [navigate]);

  if (!isAdmin) {
    return null; // или можно показать заглушку загрузки
  }

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-sce-primary mb-8">Панель администратора</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
              <CardDescription>Зарегистрированные аккаунты</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{userCount}</div>
              <Button asChild variant="outline">
                <Link to="/admin/users">Управление пользователями</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Объекты SCE</CardTitle>
              <CardDescription>Зарегистрированные аномалии</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{objectCount}</div>
              <Button asChild variant="outline">
                <Link to="/objects/create">Добавить новый объект</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Материалы</CardTitle>
              <CardDescription>Статьи и документация</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">{postCount}</div>
              <Button asChild variant="outline">
                <Link to="/posts">Просмотреть все материалы</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="objects" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="objects">Управление объектами</TabsTrigger>
            <TabsTrigger value="posts">Управление материалами</TabsTrigger>
            <TabsTrigger value="settings">Настройки сайта</TabsTrigger>
          </TabsList>
          
          <TabsContent value="objects" className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-4">Управление объектами SCE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="bg-sce-primary hover:bg-sce-accent">
                <Link to="/objects/create">Создать новый объект</Link>
              </Button>
              <Button asChild>
                <Link to="/objects">Просмотреть все объекты</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/classifications">Управление классификациями</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/logs/objects">Журнал изменений</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="posts" className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-4">Управление материалами</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="bg-sce-primary hover:bg-sce-accent">
                <Link to="/posts/create">Создать новый материал</Link>
              </Button>
              <Button asChild>
                <Link to="/posts">Просмотреть все материалы</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/categories">Управление категориями</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/logs/posts">Журнал публикаций</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-4">Настройки сайта</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild>
                <Link to="/admin/settings/general">Общие настройки</Link>
              </Button>
              <Button asChild>
                <Link to="/admin/settings/security">Безопасность</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/settings/appearance">Оформление</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin/settings/backup">Резервное копирование</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Сводка активности</CardTitle>
            <CardDescription>Последние действия в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 border-b">
                <span className="text-sce-dark font-medium">Сегодня, 12:34</span> - 
                <span className="ml-2">Создан новый пользователь: user@example.com</span>
              </li>
              <li className="p-2 border-b">
                <span className="text-sce-dark font-medium">Вчера, 18:15</span> - 
                <span className="ml-2">Обновлен объект: SCE-003</span>
              </li>
              <li className="p-2 border-b">
                <span className="text-sce-dark font-medium">21.05.2023, 09:41</span> - 
                <span className="ml-2">Создан новый материал: "Протокол исследования SCE-005"</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminPanel;
