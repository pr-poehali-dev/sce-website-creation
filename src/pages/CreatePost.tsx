import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PostForm from '@/components/posts/PostForm';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { addPost } from '@/lib/db';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      // Создаем новый пост
      const newPost = addPost({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        authorId: user.id,
        authorName: user.name,
        readTime: data.readTime,
        published: data.published
      });

      toast({
        title: "Материал создан",
        description: data.published
          ? "Материал успешно создан и опубликован"
          : "Материал создан и сохранен как черновик",
      });

      // Перенаправляем на страницу созданного поста
      navigate(`/posts/${newPost.id}`);
    } catch (error) {
      console.error('Ошибка при создании материала:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать материал. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredPermission="create:post">
      <Layout>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-sce-primary mb-8">Создание нового материала</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Новый материал</CardTitle>
              <CardDescription>
                Заполните все необходимые поля для создания нового материала
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostForm 
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

export default CreatePost;
