import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Схема для формы входа
const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов')
});

// Расширенная схема для формы регистрации
const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  passwordConfirm: z.string().min(6, 'Подтверждение пароля должно содержать не менее 6 символов')
}).refine(data => data.password === data.passwordConfirm, {
  message: 'Пароли должны совпадать',
  path: ['passwordConfirm']
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: LoginFormData | RegisterFormData) => void;
  isSubmitting?: boolean;
}

export default function AuthForm({ type, onSubmit, isSubmitting = false }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema),
    defaultValues: type === 'login' 
      ? { email: '', password: '' } 
      : { name: '', email: '', password: '', passwordConfirm: '' }
  });

  const handleFormSubmit = (data: LoginFormData | RegisterFormData) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setError('root', { 
        type: 'manual',
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Вывод общих ошибок */}
      {errors.root && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      {/* Поле имени (только для регистрации) */}
      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            placeholder="Введите ваше имя"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>
      )}

      {/* Поле email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          placeholder="Введите ваш email"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Поле пароля */}
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
          {...register('password')}
          placeholder="Введите пароль"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Поле подтверждения пароля (только для регистрации) */}
      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="passwordConfirm">Подтверждение пароля</Label>
          <Input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            {...register('passwordConfirm')}
            placeholder="Подтвердите пароль"
            disabled={isSubmitting}
          />
          {errors.passwordConfirm && (
            <p className="text-destructive text-sm">{errors.passwordConfirm.message}</p>
          )}
        </div>
      )}

      {/* Кнопка отправки */}
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? 'Подождите...' 
          : type === 'login' ? 'Войти' : 'Зарегистрироваться'
        }
      </Button>
    </form>
  );
}
