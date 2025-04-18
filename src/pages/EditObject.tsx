import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ObjectForm from '@/components/objects/ObjectForm';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getObjectById, updateObject } from '@/lib/db';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';

const EditObject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [object, setObject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const objData = getObjectById(id);
      if (objData) {
        setObject(objData);
      } else {
        toast({
          title: "Ошибка",
          description: "Объект не найден",
          variant: "destructive"
        });
        navigate('/objects');
      }
    }
    setIsLoading(false);
  }, [id, navigate]);

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);

    try {
      if (!user || !object) {
        throw new Error('Ошибка доступа или объект не найден');
      }

      // Обновляем объект
      const updatedObject = updateObject({
        ...object,
        name: data.name,
        class: data.class,
        description: data.description,
        containment: data.containment,
        procedures: data.procedures,
        discovery: data.discovery,
        addenda: data.addenda
      });

      toast({
        title: "Объект обновлен",
        description: `Объект ${updatedObject.name} успешно обновлен`,
      });

      // Перенаправляем на страницу объекта
      navigate(`/objects/${updatedObject.id}`);
    } catch (error) {
      console.error('Ошибка при обновлении объекта:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить объект. Пожалуйста, попробуйте еще раз.",
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

  if (!object) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-4">Объект не найден</h2>
          <p className="mb-6">Запрашиваемый объект SCE не существует или у вас нет доступа к нему.</p>
          <Button onClick={() => navigate('/objects')}>
            Вернуться к списку объектов
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute requiredPermission="edit:object">
      <Layout>
        <div className="py-8">
          <h1 className="text-3xl font-bold text-sce-primary mb-8">Редактирование объекта {object.name}</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Редактирование объекта</CardTitle>
              <CardDescription>
                Внесите необходимые изменения в объект SCE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObjectForm 
                initialData={object}
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

export default EditObject;
