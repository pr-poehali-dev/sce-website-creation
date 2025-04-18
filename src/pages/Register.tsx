import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AuthForm from '@/components/auth/AuthForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если пользователь уже аутентифицирован, перенаправляем на главную
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleRegister = async (data: RegisterData) => {
    setIsSubmitting(true);
    
    try {
      const result = await register(data.name, data.email, data.password);
      
      if (result.success) {
        toast({
          title: "Регистрация успешна",
          description: result.message,
        });
        
        // Перенаправляем на главную страницу
        navigate('/');
      } else {
        toast({
          title: "Ошибка при регистрации",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Произошла ошибка",
        description: "Не удалось выполнить регистрацию. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-sce-primary">Регистрация</CardTitle>
            <CardDescription>
              Создайте учетную запись для доступа к материалам Фонда SCE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="register" onSubmit={handleRegister} />
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                Уже есть учетная запись?{' '}
                <Link to="/login" className="text-sce-primary hover:underline">
                  Войти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
