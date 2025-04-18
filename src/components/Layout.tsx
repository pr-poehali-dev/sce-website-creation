import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, LogOut, Menu, Shield, FileText, Package, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout, checkPermission } = useAuthContext();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isAdmin = isAuthenticated && checkPermission('all');
  const canCreateObjects = isAuthenticated && checkPermission('create:object');
  const canCreatePosts = isAuthenticated && checkPermission('create:post');

  return (
    <div className="min-h-screen flex flex-col bg-sce-background">
      <header className="bg-sce-dark text-white py-4">
        <div className="sce-container flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="sce-logo text-2xl text-sce-primary font-bold">
              SCE FOUNDATION
            </Link>
            <div className="ml-4 text-sm font-medium hidden md:block">
              Secure. Control. Explore.
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-sce-accent">Главная</Link>
            <Link to="/objects" className="hover:text-sce-accent">Объекты</Link>
            <Link to="/posts" className="hover:text-sce-accent">Материалы</Link>
            <Link to="/about" className="hover:text-sce-accent">О Фонде</Link>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:text-sce-accent">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Профиль</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Панель администратора</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {canCreatePosts && (
                      <DropdownMenuItem asChild>
                        <Link to="/posts/create">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Создать материал</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {canCreateObjects && (
                      <DropdownMenuItem asChild>
                        <Link to="/objects/create">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Создать объект</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hover:text-sce-accent">Вход</Link>
            )}
          </nav>
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-sce-primary">Меню навигации</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Главная
                </Link>
                <Link 
                  to="/objects" 
                  className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="mr-2 h-5 w-5" />
                  Объекты
                </Link>
                <Link 
                  to="/posts" 
                  className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Материалы
                </Link>
                <Link 
                  to="/about" 
                  className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  О Фонде
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Профиль
                    </Link>
                    
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="mr-2 h-5 w-5" />
                        Панель администратора
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary text-left"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Выйти
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center px-2 py-2 rounded-md hover:bg-sce-secondary" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Вход
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <main className="flex-grow sce-container py-6">
        {children}
      </main>
      
      <footer className="bg-sce-dark text-white py-8">
        <div className="sce-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-sce-primary">SCE Foundation</h3>
              <p className="text-sm">Фонд SCE занимается задержанием аномалий, исследованием и контролем. Наша миссия: Secure. Control. Explore.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-sce-primary">Ссылки</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/objects" className="hover:text-sce-accent">Объекты SCE</Link></li>
                <li><Link to="/posts" className="hover:text-sce-accent">Материалы</Link></li>
                <li><Link to="/about" className="hover:text-sce-accent">О нас</Link></li>
                <li><Link to="/privacy" className="hover:text-sce-accent">Политика конфиденциальности</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-sce-primary">Контакты</h3>
              <p className="text-sm mb-2">Для связи с Фондом используйте защищенные каналы связи.</p>
              <p className="text-sm">© {new Date().getFullYear()} SCE Foundation. Все права защищены.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
