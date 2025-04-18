import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, checkPermission } = useAuthContext();
  const location = useLocation();

  // Пока проверяем аутентификацию, показываем загрузку
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-sce-primary rounded-full border-t-transparent"></div>
    </div>;
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется определенное разрешение, проверяем его
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Если все проверки пройдены, показываем защищенный контент
  return <>{children}</>;
};

export default ProtectedRoute;
