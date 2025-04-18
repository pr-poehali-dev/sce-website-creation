import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sce-primary mb-4">О Фонде SCE</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Фонд SCE — международная организация, занимающаяся задержанием аномалий, исследованием и контролем. 
            Наша миссия: Secure. Control. Explore.
          </p>
        </div>
        
        <Tabs defaultValue="mission" className="mb-12">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="mission">Миссия</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="structure">Структура</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mission" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sce-primary">Миссия Фонда SCE</CardTitle>
                <CardDescription>Secure. Control. Explore.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Фонд SCE существует для защиты человечества от аномальных явлений, существ и объектов, 
                  которые нарушают естественные законы нашего мира. Наша работа основана на трех фундаментальных принципах:
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Secure (Обеспечение безопасности)</h3>
                    <p>
                      Мы обеспечиваем безопасное содержание аномальных объектов, сущностей и явлений, 
                      изолируя их от общества для предотвращения потенциального вреда. Наши специально 
                      разработанные протоколы содержания гарантируют, что аномалии остаются под надежным контролем.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Control (Контроль)</h3>
                    <p>
                      Мы контролируем информацию об аномалиях, скрывая их существование от широкой общественности 
                      для предотвращения паники и социальных потрясений. Фонд действует в тени, обеспечивая 
                      нормальное функционирование общества в мире, который гораздо более странный, чем кажется.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Explore (Исследование)</h3>
                    <p>
                      Мы изучаем природу аномалий, чтобы лучше понять их происхождение, свойства и потенциальное применение. 
                      Это знание позволяет нам разрабатывать более эффективные методы содержания и, в некоторых случаях, 
                      использовать аномальные свойства на благо человечества.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sce-primary">История Фонда SCE</CardTitle>
                <CardDescription>От истоков до современности</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Основание (1928)</h3>
                    <p>
                      Фонд SCE был основан группой ученых, военных и промышленников после серии необъяснимых происшествий 
                      в различных частях мира. Первоначально организация действовала как небольшая исследовательская группа, 
                      изучавшая странные артефакты и явления.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Расширение (1950-е)</h3>
                    <p>
                      После Второй мировой войны Фонд значительно расширил свою деятельность, получив тайную поддержку 
                      нескольких мировых правительств. В этот период были созданы первые крупные объекты содержания и 
                      разработана система классификации аномалий.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Глобализация (1980-е)</h3>
                    <p>
                      К 1980-м годам Фонд SCE стал поистине глобальной организацией с представительствами на всех континентах. 
                      Была создана современная структура Фонда с разделением на отделы и введением строгой системы допусков.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Современная эпоха (2000-е — настоящее время)</h3>
                    <p>
                      В XXI веке Фонд SCE столкнулся с новыми вызовами: увеличением числа аномалий, связанных с цифровыми 
                      технологиями, появлением конкурирующих организаций и необходимостью адаптации к быстро меняющемуся миру. 
                      Сегодня Фонд продолжает свою миссию, оставаясь невидимым для общественности, но всегда готовым защитить 
                      человечество от аномальных угроз.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="structure" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sce-primary">Структура Фонда SCE</CardTitle>
                <CardDescription>Организационная иерархия и основные отделы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Руководство</h3>
                    <p>
                      Во главе Фонда SCE стоит Совет O5 — группа из тринадцати высокопоставленных руководителей, 
                      чьи личности известны лишь немногим. Совет принимает стратегические решения и определяет 
                      политику организации.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Административный отдел</h3>
                    <p>
                      Отвечает за повседневное управление Фондом, включая финансы, логистику, кадровые вопросы 
                      и взаимодействие между различными подразделениями.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Научный отдел</h3>
                    <p>
                      Занимается исследованием аномалий, разработкой методов их содержания и потенциального использования. 
                      В научный отдел входят специалисты различных дисциплин: от физики и биологии до психологии и антропологии.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Служба безопасности</h3>
                    <p>
                      Отвечает за охрану объектов Фонда, контроль над содержащимися аномалиями и реагирование на чрезвычайные 
                      ситуации. Также в задачи службы безопасности входит нейтрализация угроз со стороны враждебных организаций.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Полевой отдел</h3>
                    <p>
                      Занимается обнаружением, исследованием и захватом аномалий "в полевых условиях". 
                      Агенты полевого отдела часто первыми сталкиваются с новыми аномалиями и проводят первичную оценку их опасности.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-sce-primary mb-2">Отдел информации</h3>
                    <p>
                      Контролирует распространение информации об аномалиях, скрывает следы их существования от общественности 
                      и занимается дезинформацией в случае утечек. Также отвечает за внутреннюю систему документации Фонда.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-sce-secondary p-6 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-sce-primary mb-4">Система классификации объектов SCE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Безопасный</h3>
              <p>Объекты, которые могут быть надежно содержаны и не представляют значительной угрозы при правильном обращении.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Евклид</h3>
              <p>Объекты, требующие специфических условий содержания или недостаточно изученные, чтобы гарантировать полную безопасность.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Кетер</h3>
              <p>Крайне опасные объекты, которые трудно или невозможно надежно содержать, представляющие серьезную угрозу человечеству.</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center">
          <p className="text-sm text-sce-dark">
            Это информационная страница о вымышленной организации SCE Foundation. Любое сходство с реальными организациями случайно.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
