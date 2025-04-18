import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// Провайдеры
import AuthProvider from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Страницы
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import AccessDenied from '@/pages/AccessDenied';
import Posts from '@/pages/Posts';
import PostDetail from '@/pages/PostDetail';
import CreatePost from '@/pages/CreatePost';
import EditPost from '@/pages/EditPost';
import ObjectsList from '@/pages/ObjectsList';
import ObjectDetail from '@/pages/ObjectDetail';
import CreateObject from '@/pages/CreateObject';
import EditObject from '@/pages/EditObject';
import AdminPanel from '@/pages/AdminPanel';
import UserManagement from '@/pages/UserManagement';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Защищенные маршруты - требуют авторизацию */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Публичный доступ к постам */}
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          
          {/* Создание и редактирование постов - требует определенных прав */}
          <Route 
            path="/posts/create" 
            element={
              <ProtectedRoute requiredPermission="create:post">
                <CreatePost />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/posts/edit/:id" 
            element={
              <ProtectedRoute requiredPermission="edit:post">
                <EditPost />
              </ProtectedRoute>
            } 
          />
          
          {/* Доступ к объектам требует авторизации */}
          <Route 
            path="/objects" 
            element={
              <ProtectedRoute>
                <ObjectsList />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/objects/:id" 
            element={
              <ProtectedRoute>
                <ObjectDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* Создание и редактирование объектов - требует определенных прав */}
          <Route 
            path="/objects/create" 
            element={
              <ProtectedRoute requiredPermission="create:object">
                <CreateObject />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/objects/edit/:id" 
            element={
              <ProtectedRoute requiredPermission="edit:object">
                <EditObject />
              </ProtectedRoute>
            } 
          />
          
          {/* Административные маршруты - требуют прав администратора */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredPermission="all">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredPermission="all">
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Страницы ошибок */}
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Компонент для отображения уведомлений */}
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
