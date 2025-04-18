import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем URL для перенаправления после входа (если есть)
  const from = location.state?.from?.pathname || '/';

  // Используем useEffect для перенаправления, чтобы избежать ошибки обновления компонента во время рендеринга
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (data: LoginData) => {
    setIsSubmitting(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast({
          title: "Авторизация успешна",
          description: "Добро пожаловать в систему Фонда SCE",
        });
        
        // Перенаправляем на главную страницу или предыдущую страницу
        navigate(from);
      } else {
        toast({
          title: "Ошибка авторизации",
          description: "Неверный email или пароль. Пожалуйста, попробуйте еще раз.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        description: "Не удалось выполнить вход. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Избегаем прямого перенаправления в теле компонента
  if (isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-sce-primary">Вход в систему</CardTitle>
            <CardDescription>
              Введите свои учетные данные для доступа к материалам Фонда SCE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="login" onSubmit={handleLogin} />
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                Нет учетной записи?{' '}
                <Link to="/register" className="text-sce-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
