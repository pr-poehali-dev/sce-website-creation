import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const AccessDenied: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-sce-primary mb-4">
          <AlertTriangle size={64} />
        </div>
        <h1 className="text-4xl font-bold text-sce-primary mb-4">Доступ запрещен</h1>
        <div className="mb-6 max-w-lg">
          <p className="text-lg mb-4">У вас недостаточно прав для доступа к этому разделу.</p>
          <p className="text-sce-dark">
            Для доступа к этой информации требуется более высокий уровень допуска.
            Обратитесь к администратору для повышения уровня доступа.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild className="bg-sce-primary hover:bg-sce-accent">
            <Link to="/">Вернуться на главную</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Связаться с администратором</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AccessDenied;
