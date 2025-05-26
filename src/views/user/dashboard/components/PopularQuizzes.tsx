import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users } from 'lucide-react';

type Quiz = {
   id: string;
   title: string;
};

type PopularQuizzesProps = {
   quizzes: Quiz[];
   onQuizSelect: (quizId: string) => void;
};

export function PopularQuizzes({ quizzes, onQuizSelect }: PopularQuizzesProps) {
   return (
      <Card>
         <CardHeader className="flex flex-row items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            <CardTitle>Quiz Populer</CardTitle>
         </CardHeader>
         <CardContent>
            {quizzes.length === 0 ? (
               <div className="text-center py-4 text-gray-500">
                  <p>Belum ada quiz populer</p>
               </div>
            ) : (
               <div className="space-y-2">
                  {quizzes.map((quiz, index) => (
                     <div
                        key={quiz.id}
                        className={`flex items-center p-3 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                     >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                           <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="font-medium truncate">{quiz.title}</p>
                        </div>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => onQuizSelect(quiz.id)}
                        >
                           Buka
                        </Button>
                     </div>
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   );
}