import { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  authenticateUser, 
  getUserByEmail, 
  addUser, 
  hasPermission, 
  getRoleById
} from '@/lib/db';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Загружаем данные пользователя при инициализации
  useEffect(() => {
    const savedUser = localStorage.getItem('sce-current-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as User;
        const role = getRoleById(user.roleId);
        setAuthState({
          user,
          role,
          isLoading: false,
          isAuthenticated: true
        });
      } catch (e) {
        console.error('Ошибка при загрузке данных пользователя:', e);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Функция для входа в систему
  const login = async (email: string, password: string) => {
    const user = authenticateUser(email, password);
    if (user) {
      const role = getRoleById(user.roleId);
      localStorage.setItem('sce-current-user', JSON.stringify(user));
      setAuthState({
        user,
        role,
        isLoading: false,
        isAuthenticated: true
      });
      return true;
    }
    return false;
  };

  // Функция для регистрации нового пользователя
  const register = async (name: string, email: string, password: string) => {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    // Определяем роль для нового пользователя
    // Если это первый пользователь, даем роль администратора
    const users = JSON.parse(localStorage.getItem('sce-users') || '[]');
    const roleId = users.length === 0 ? 'admin' : 'reader';

    // Создаем нового пользователя
    const newUser = addUser({
      name,
      email,
      password,
      roleId
    });

    // Автоматически входим в систему
    localStorage.setItem('sce-current-user', JSON.stringify(newUser));
    const role = getRoleById(newUser.roleId);
    setAuthState({
      user: newUser,
      role,
      isLoading: false,
      isAuthenticated: true
    });

    return { 
      success: true, 
      message: roleId === 'admin' 
        ? 'Вы зарегистрированы как администратор с полным доступом к системе' 
        : 'Вы успешно зарегистрированы как читатель'
    };
  };

  // Функция для выхода из системы
  const logout = () => {
    localStorage.removeItem('sce-current-user');
    setAuthState({
      user: null,
      role: null,
      isLoading: false,
      isAuthenticated: false
    });
  };

  // Проверка разрешений
  const checkPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    return hasPermission(authState.user, permission);
  };

  return {
    ...authState,
    login,
    register,
    logout,
    checkPermission
  };
};

export default useAuth;
