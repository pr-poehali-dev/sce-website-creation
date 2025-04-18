import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 sce-logo text-sce-primary">SCE FOUNDATION</h1>
          <p className="text-xl mb-6">Secure. Control. Explore.</p>
          <div className="flex justify-center gap-4">
            <Button asChild className="bg-sce-primary hover:bg-sce-accent">
              <Link to="/login">Вход в систему</Link>
            </Button>
            <Button asChild variant="outline" className="border-sce-primary text-sce-primary hover:bg-sce-secondary">
              <Link to="/register">Регистрация</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-sce-primary border-t-4">
            <CardHeader>
              <CardTitle className="text-sce-primary">SECURE</CardTitle>
              <CardDescription>Обеспечение безопасности</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Фонд SCE обеспечивает безопасное содержание аномальных объектов, сущностей и явлений, представляющих угрозу для человечества.</p>
            </CardContent>
          </Card>
          
          <Card className="border-sce-primary border-t-4">
            <CardHeader>
              <CardTitle className="text-sce-primary">CONTROL</CardTitle>
              <CardDescription>Контроль аномалий</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Наши специалисты разрабатывают процедуры содержания для удержания и контроля аномальных объектов, предотвращая их влияние на мир.</p>
            </CardContent>
          </Card>
          
          <Card className="border-sce-primary border-t-4">
            <CardHeader>
              <CardTitle className="text-sce-primary">EXPLORE</CardTitle>
              <CardDescription>Исследование неизвестного</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Мы изучаем аномалии, чтобы понять их природу, происхождение и потенциальную пользу для человечества.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-sce-primary">Последние объекты SCE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SCE-001</CardTitle>
                <CardDescription>Класс: Безопасный</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Аномальный объект, способный искажать восприятие времени у находящихся поблизости людей.</p>
                <Button asChild variant="outline">
                  <Link to="/objects/sce-001">Подробнее</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SCE-002</CardTitle>
                <CardDescription>Класс: Евклид</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Гуманоидная сущность, способная проходить сквозь твердые объекты и манипулировать электрическими полями.</p>
                <Button asChild variant="outline">
                  <Link to="/objects/sce-002">Подробнее</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-sce-primary">Присоединяйтесь к Фонду SCE</h2>
          <p className="mb-6">Создайте учетную запись для доступа к секретным материалам и исследованиям Фонда.</p>
          <Button asChild className="bg-sce-primary hover:bg-sce-accent">
            <Link to="/register">Зарегистрироваться</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
