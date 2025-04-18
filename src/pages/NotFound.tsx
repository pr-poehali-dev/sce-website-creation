import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-5xl font-bold text-sce-primary mb-4">404</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">ДОСТУП ЗАПРЕЩЕН</h2>
          <p className="text-lg mb-4">Запрашиваемая страница не найдена или у вас недостаточно прав доступа.</p>
          <p className="text-sce-dark">Файл засекречен или не существует в базе данных SCE Foundation.</p>
        </div>
        <Button asChild className="bg-sce-primary hover:bg-sce-accent">
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
