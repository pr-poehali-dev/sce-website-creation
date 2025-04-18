import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUser } from '@/lib/db';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  currentPassword: z.string().min(1, 'Требуется текущий пароль'),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => !data.newPassword || data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Проверяем текущий пароль
      if (data.currentPassword !== user.password) {
        toast({
          title: "Ошибка",
          description: "Неверный текущий пароль",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Обновляем данные пользователя
      const updatedUser = {
        ...user,
        name: data.name,
        // Обновляем пароль только если был указан новый
        password: data.newPassword ? data.newPassword : user.password
      };
      
      updateUser(updatedUser);
      
      // Обновляем данные в localStorage
      localStorage.setItem('sce-current-user', JSON.stringify(updatedUser));
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно обновлены"
      });
      
      // Сбрасываем поля пароля
      form.reset({
        name: data.name,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-sce-primary mb-8">Профиль пользователя</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Информация</CardTitle>
                <CardDescription>Ваши учетные данные</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Роль</Label>
                    <p className="font-medium capitalize">{user.roleId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Дата регистрации</Label>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  {user.lastLogin && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Последний вход</Label>
                      <p className="font-medium">
                        {new Date(user.lastLogin).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Редактировать профиль</CardTitle>
                <CardDescription>
                  Обновите ваши личные данные и пароль
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-4">Изменить пароль</h3>
                      
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Текущий пароль</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Новый пароль</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Подтверждение пароля</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-sce-primary hover:bg-sce-accent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
