import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getObjects } from '@/lib/db';
import { useAuthContext } from '@/components/auth/AuthProvider';

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

const ObjectsList: React.FC = () => {
  const { isAuthenticated, checkPermission } = useAuthContext();
  const [objects, setObjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredObjects, setFilteredObjects] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState('all');
  
  const canCreateObjects = isAuthenticated && checkPermission('create:object');

  // Загрузка объектов при монтировании компонента
  useEffect(() => {
    // Получаем объекты из базы данных
    const allObjects = getObjects();
    setObjects(allObjects);
    setFilteredObjects(allObjects);
  }, []);

  // Фильтрация объектов при изменении поискового запроса или вкладки
  useEffect(() => {
    let result = objects;
    
    // Фильтрация по поисковому запросу
    if (searchTerm) {
      result = result.filter(obj => 
        obj.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        obj.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтрация по классу
    if (currentTab !== 'all') {
      result = result.filter(obj => obj.class.toLowerCase() === currentTab);
    }
    
    setFilteredObjects(result);
  }, [searchTerm, currentTab, objects]);

  return (
    <Layout>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sce-primary">Объекты SCE</h1>
          {canCreateObjects && (
            <Button asChild className="bg-sce-primary hover:bg-sce-accent">
              <Link to="/objects/create">Создать новый объект</Link>
            </Button>
          )}
        </div>
        
        <div className="mb-8">
          <Input 
            placeholder="Поиск объектов SCE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setCurrentTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="безопасный">Безопасные</TabsTrigger>
            <TabsTrigger value="евклид">Евклид</TabsTrigger>
            <TabsTrigger value="кетер">Кетер</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredObjects.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-sce-dark mb-2">Объекты не найдены</h2>
            <p className="text-muted-foreground">По вашему запросу не найдено ни одного объекта SCE.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredObjects.map(obj => (
              <Card key={obj.id} className="border-l-4" style={{ borderLeftColor: `hsl(var(--sce-primary))` }}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{obj.name}</CardTitle>
                    <Badge className={getClassBadgeColor(obj.class as SCEClass)}>
                      {obj.class}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{obj.description}</p>
                  <Button asChild variant="outline">
                    <Link to={`/objects/${obj.id}`}>Подробнее</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ObjectsList;
