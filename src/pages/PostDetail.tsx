import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getPostById, getCategoryById, deletePost } from '@/lib/db';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from '@/components/ui/use-toast';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, checkPermission, user } = useAuthContext();
  const [post, setPost] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const canEditAny = isAuthenticated && checkPermission('edit:post');
  const canEditOwn = isAuthenticated && checkPermission('edit:own:post');
  const canDelete = isAuthenticated && checkPermission('all');

  useEffect(() => {
    if (id) {
      const postData = getPostById(id);
      if (postData) {
        // Если пост не опубликован, проверяем права доступа
        if (!postData.published) {
          const isAdmin = isAuthenticated && checkPermission('all');
          const isAuthor = isAuthenticated && user && postData.authorId === user.id;
          
          if (!isAdmin && !isAuthor) {
            // Пользователь не имеет права просматривать неопубликованный пост
            setLoading(false);
            return;
          }
        }
        
        setPost(postData);
        
        // Находим категорию
        if (postData.categoryId) {
          const categoryData = getCategoryById(postData.categoryId);
          setCategory(categoryData);
        }
      }
    }
    setLoading(false);
  }, [id, isAuthenticated, checkPermission, user]);

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDelete = () => {
    if (id) {
      try {
        deletePost(id);
        toast({
          title: "Материал удален",
          description: "Материал успешно удален из базы данных",
        });
        navigate('/posts');
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить материал",
          variant: "destructive"
        });
      }
    }
  };

  // Проверяем, может ли пользователь редактировать этот пост
  const canEditThis = post && isAuthenticated && (
    canEditAny || (canEditOwn && user && post.authorId === user.id)
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-pulse h-8 w-64 bg-sce-secondary rounded mb-4 mx-auto"></div>
            <div className="animate-pulse h-4 w-32 bg-sce-secondary rounded mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-4">Материал не найден</h2>
          <p className="mb-6">Запрашиваемый материал не существует, засекречен или у вас нет прав для его просмотра.</p>
          <Button asChild>
            <Link to="/posts">Вернуться к списку материалов</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-sce-primary mb-2">
                {post.title}
                {!post.published && (
                  <Badge className="ml-2 bg-gray-500">Черновик</Badge>
                )}
              </h1>
              <div className="flex items-center gap-3 text-sce-dark text-sm">
                <span>{formatDate(post.date)}</span>
                <span>•</span>
                <span>{post.readTime} мин. чтения</span>
                <span>•</span>
                <span>{post.authorName}</span>
                {category && (
                  <>
                    <span>•</span>
                    <Badge className={category.color}>
                      {category.name}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/posts">Назад к списку</Link>
              </Button>
              
              {canEditThis && (
                <Button asChild className="bg-sce-primary hover:bg-sce-accent">
                  <Link to={`/posts/edit/${id}`}>Редактировать</Link>
                </Button>
              )}
              
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Удалить</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие приведет к удалению материала "{post.title}" из базы данных Фонда SCE. Восстановление будет невозможно.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none prose-headings:text-sce-primary prose-a:text-sce-primary" 
                 dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
        </Card>
        
        <Separator className="my-8" />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-sce-dark">
            <p>ID материала: {post.id}</p>
            <p>Последнее обновление: {formatDate(post.date)}</p>
          </div>
          
          <Button asChild variant="outline">
            <Link to="/posts">Все материалы</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetail;
