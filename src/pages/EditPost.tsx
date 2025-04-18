import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PostForm from '@/components/posts/PostForm';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getPostById, updatePost } from '@/lib/db';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, checkPermission } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const postData = getPostById(id);
      if (postData) {
        setPost(postData);
      } else {
        toast({
          title: "Ошибка",
          description: "Материал не найден",
          variant: "destructive"
        });
        navigate('/posts');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);

    try {
      if (!user || !post) {
        throw new Error('Ошибка доступа или материал не найден');
      }

      // Проверяем права на редактирование
      const canEditAny = checkPermission('edit:post');
      const canEditOwn = checkPermission('edit:own:post');
      const isOwner = post.authorId === user.id;

      if (!canEditAny && !(canEditOwn && isOwner)) {
        throw new Error('Недостаточно прав для редактирования этого материала');
      }

      // Обновляем пост
      const updatedPost = updatePost({
        ...post,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        readTime: data.readTime,
        published: data.published
      });

      toast({
        title: "Материал обновлен",
        description: data.published
          ? "Материал успешно обновлен и опубликован"
          : "Материал обновлен и сохранен как черновик",
      });

      // Перенаправляем на страницу поста
      navigate(`/posts/${updatedPost.id}`);
    } catch (error) {
      console.error('Ошибка при обновлении материала:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось обновить материал. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-sce-primary rounded-full border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-4">Материал не найден</h2>
          <p className="mb-6">Запрашиваемый материал не существует или у вас нет доступа к нему.</p>
          <Button onClick={() => navigate('/posts')}>
            Вернуться к списку материалов
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-sce-primary mb-8">Редактирование материала</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Редактирование материала</CardTitle>
              <CardDescription>
                Внесите необходимые изменения в материал
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostForm 
                initialData={post}
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditPost;
