import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getPosts, getCategories, getCategoryById } from '@/lib/db';
import { useAuthContext } from '@/components/auth/AuthProvider';

const Posts: React.FC = () => {
  const { isAuthenticated, checkPermission } = useAuthContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const canCreatePosts = isAuthenticated && checkPermission('create:post');

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Получаем посты и категории из базы данных
    const allPosts = getPosts();
    const allCategories = getCategories();
    
    // Отображаем только опубликованные посты для обычных пользователей
    // Администраторы и авторы видят все посты
    const isAdmin = isAuthenticated && checkPermission('all');
    const filteredPosts = isAdmin ? allPosts : allPosts.filter(post => post.published);
    
    setPosts(filteredPosts);
    setFilteredPosts(filteredPosts);
    setCategories(allCategories);
  }, [isAuthenticated, checkPermission]);

  // Фильтрация постов при изменении поискового запроса или выбранной категории
  useEffect(() => {
    let result = posts;
    
    // Фильтрация по поисковому запросу
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтрация по категории
    if (selectedCategory) {
      result = result.filter(post => post.categoryId === selectedCategory);
    }
    
    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, posts]);

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sce-primary">Материалы Фонда SCE</h1>
          {canCreatePosts && (
            <Button asChild className="bg-sce-primary hover:bg-sce-accent">
              <Link to="/posts/create">Создать новый материал</Link>
            </Button>
          )}
        </div>
        
        <div className="mb-8">
          <Input 
            placeholder="Поиск материалов..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="mb-8 flex flex-wrap gap-2">
          <Badge 
            className={`cursor-pointer ${!selectedCategory ? 'bg-sce-primary' : 'bg-sce-secondary text-sce-dark'}`}
            onClick={() => setSelectedCategory(null)}
          >
            Все категории
          </Badge>
          {categories.map(category => (
            <Badge
              key={category.id}
              className={`cursor-pointer ${selectedCategory === category.id ? category.color : 'bg-sce-secondary text-sce-dark'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-sce-dark mb-2">Материалы не найдены</h2>
            <p className="text-muted-foreground">По вашему запросу не найдено ни одного материала.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map(post => {
              const category = getCategoryById(post.categoryId);
              return (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2 text-sce-primary">
                          {post.title}
                          {!post.published && (
                            <Badge className="ml-2 bg-gray-500">Черновик</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 text-sce-dark">
                            <span>{formatDate(post.date)}</span>
                            <span>•</span>
                            <span>{post.readTime} мин. чтения</span>
                            <span>•</span>
                            <span>{post.authorName}</span>
                          </div>
                        </CardDescription>
                      </div>
                      {category && (
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.excerpt}</p>
                    <Button asChild variant="outline">
                      <Link to={`/posts/${post.id}`}>Читать полностью</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Posts;
