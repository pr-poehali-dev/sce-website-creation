import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getObjectById, deleteObject } from '@/lib/db';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from '@/components/ui/use-toast';

// Тип класса объекта SCE
type SCEClass = 'Безопасный' | 'Евклид' | 'Кетер' | 'Таумиэль' | 'Нейтрализованный';

// Функция для получения цвета значка в зависимости от класса
const getClassBadgeColor = (sceClass: SCEClass) => {
  switch (sceClass) {
    case 'Безопасный': return 'bg-green-600 hover:bg-green-700';
    case 'Евклид': return 'bg-yellow-600 hover:bg-yellow-700';
    case 'Кетер': return 'bg-red-600 hover:bg-red-700';
    case 'Таумиэль': return 'bg-purple-600 hover:bg-purple-700';
    case 'Нейтрализованный': return 'bg-gray-600 hover:bg-gray-700';
    default: return 'bg-blue-600 hover:bg-blue-700';
  }
};

const ObjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, checkPermission } = useAuthContext();
  const [object, setObject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const canEditObject = isAuthenticated && checkPermission('edit:object');
  const canDeleteObject = isAuthenticated && checkPermission('all');

  useEffect(() => {
    if (id) {
      const objData = getObjectById(id);
      if (objData) {
        setObject(objData);
      }
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (id) {
      try {
        deleteObject(id);
        toast({
          title: "Объект удален",
          description: "Объект SCE успешно удален из базы данных",
        });
        navigate('/objects');
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить объект",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-pulse h-8 w-40 bg-sce-secondary rounded mb-4 mx-auto"></div>
            <div className="animate-pulse h-4 w-64 bg-sce-secondary rounded mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!object) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-sce-primary mb-4">Объект не найден</h2>
          <p className="mb-6">Запрашиваемый объект SCE не существует или засекречен.</p>
          <Button asChild>
            <Link to="/objects">Вернуться к списку объектов</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-sce-primary">{object.name}</h1>
              <Badge className={getClassBadgeColor(object.class as SCEClass)}>
                {object.class}
              </Badge>
            </div>
            <div className="text-sce-dark text-sm">
              ID объекта: {object.id}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/objects">Назад к списку</Link>
            </Button>
            
            {canEditObject && (
              <Button asChild className="bg-sce-primary hover:bg-sce-accent">
                <Link to={`/objects/edit/${id}`}>Редактировать</Link>
              </Button>
            )}
            
            {canDeleteObject && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Удалить</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие приведет к удалению объекта {object.name} из базы данных Фонда SCE. Восстановление будет невозможно.
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
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{object.description}</p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="containment" className="mb-8">
          <TabsList>
            <TabsTrigger value="containment">Условия содержания</TabsTrigger>
            <TabsTrigger value="procedures">Процедуры</TabsTrigger>
            <TabsTrigger value="discovery">Обнаружение</TabsTrigger>
            {object.addenda && <TabsTrigger value="addenda">Приложения</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="containment" className="mt-4 p-4 border rounded-md">
            <h3 className="font-bold mb-2">Условия содержания</h3>
            <p>{object.containment}</p>
          </TabsContent>
          
          <TabsContent value="procedures" className="mt-4 p-4 border rounded-md">
            <h3 className="font-bold mb-2">Процедуры</h3>
            <p>{object.procedures}</p>
          </TabsContent>
          
          <TabsContent value="discovery" className="mt-4 p-4 border rounded-md">
            <h3 className="font-bold mb-2">Обнаружение</h3>
            <p>{object.discovery}</p>
          </TabsContent>
          
          {object.addenda && (
            <TabsContent value="addenda" className="mt-4 p-4 border rounded-md">
              <h3 className="font-bold mb-2">Приложения</h3>
              <p>{object.addenda}</p>
            </TabsContent>
          )}
        </Tabs>
        
        <Separator className="my-8" />
        
        <div className="text-sm text-sce-dark">
          <p>Создан: {new Date(object.createdAt).toLocaleDateString()}</p>
          <p>Последнее обновление: {new Date(object.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ObjectDetail;
