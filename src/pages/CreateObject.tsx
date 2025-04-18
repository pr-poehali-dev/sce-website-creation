import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ObjectForm from '@/components/objects/ObjectForm';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { addObject, getNextObjectId } from '@/lib/db';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const CreateObject: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      // Получаем следующий доступный ID для объекта
      const objectId = getNextObjectId();
      
      // Имя объекта должно соответствовать формату SCE-XXX
      const objectName = data.name.startsWith('SCE-') ? data.name : `SCE-${data.name.replace('SCE-', '')}`;
      
      // Создаем новый объект
      const newObject = addObject({
        name: objectName,
        class: data.class,
        description: data.description,
        containment: data.containment,
        procedures: data.procedures,
        discovery: data.discovery,
        addenda: data.addenda,
        createdBy: user.id
      });

      toast({
        title: "Объект создан",
        description: `Объект ${newObject.name} успешно создан и добавлен в базу данных`,
      });

      // Перенаправляем на страницу созданного объекта
      navigate(`/objects/${newObject.id}`);
    } catch (error) {
      console.error('Ошибка при создании объекта:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать объект. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredPermission="create:object">
      <Layout>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-sce-primary mb-8">Создание нового объекта SCE</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Новый объект SCE</CardTitle>
              <CardDescription>
                Заполните все необходимые поля для создания нового объекта
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObjectForm 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                initialData={{ name: getNextObjectId() }}
              />
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateObject;
