import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SCEObject } from '@/lib/db';

const objectSchema = z.object({
  name: z.string().min(1, 'Требуется название объекта'),
  class: z.string().min(1, 'Требуется выбрать класс объекта'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  containment: z.string().min(10, 'Условия содержания должны содержать минимум 10 символов'),
  procedures: z.string().min(10, 'Процедуры должны содержать минимум 10 символов'),
  discovery: z.string().min(10, 'Информация об обнаружении должна содержать минимум 10 символов'),
  addenda: z.string().optional(),
});

type ObjectFormValues = z.infer<typeof objectSchema>;

interface ObjectFormProps {
  initialData?: Partial<SCEObject>;
  onSubmit: (data: ObjectFormValues) => void;
  isSubmitting: boolean;
}

const ObjectForm: React.FC<ObjectFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const form = useForm<ObjectFormValues>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      name: initialData?.name || '',
      class: initialData?.class || '',
      description: initialData?.description || '',
      containment: initialData?.containment || '',
      procedures: initialData?.procedures || '',
      discovery: initialData?.discovery || '',
      addenda: initialData?.addenda || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название объекта</FormLabel>
                <FormControl>
                  <Input placeholder="SCE-XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Класс объекта</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите класс объекта" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Безопасный">Безопасный</SelectItem>
                    <SelectItem value="Евклид">Евклид</SelectItem>
                    <SelectItem value="Кетер">Кетер</SelectItem>
                    <SelectItem value="Таумиэль">Таумиэль</SelectItem>
                    <SelectItem value="Нейтрализованный">Нейтрализованный</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Подробное описание объекта SCE" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="containment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Условия содержания</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Описание условий и требований для безопасного содержания объекта" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Процедуры</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Описание процедур взаимодействия с объектом" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="discovery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Обнаружение</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Информация об обнаружении и истории объекта" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="addenda"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Приложения (необязательно)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Дополнительная информация, результаты экспериментов и т.д." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-sce-primary hover:bg-sce-accent"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить объект'}
        </Button>
      </form>
    </Form>
  );
};

export default ObjectForm;
