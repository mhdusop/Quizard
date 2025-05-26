import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, HelpCircle, PlayCircle } from 'lucide-react';

type Quiz = {
   id: string;
   title: string;
   description?: string;
   questionCount: number;
   timeLimit: number;
};

type RecentQuizzesProps = {
   quizzes: Quiz[];
   onQuizSelect: (quizId: string) => void;
};

export function RecentQuizzes({ quizzes, onQuizSelect }: RecentQuizzesProps) {
   // Format time (seconds to minutes)
   const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")} menit`;
   };

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quiz Tersedia</CardTitle>
            <Button
               variant="outline"
               size="sm"
               onClick={() => window.location.href = '/user/quiz'}
            >
               Lihat Semua
            </Button>
         </CardHeader>
         <CardContent>
            {quizzes.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                  <p>Belum ada quiz tersedia</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {quizzes.slice(0, 3).map((quiz) => (
                     <div
                        key={quiz.id}
                        className="border rounded-lg hover:shadow-md transition-shadow p-4"
                     >
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-medium text-lg">{quiz.title}</h3>
                           <Button
                              size="sm"
                              onClick={() => onQuizSelect(quiz.id)}
                              className="h-8 w-8 p-0 rounded-full"
                           >
                              <PlayCircle className="h-5 w-5" />
                           </Button>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                           {quiz.description || "Tidak ada deskripsi untuk quiz ini."}
                        </p>
                        <div className="flex text-sm text-gray-500">
                           <div className="flex items-center mr-4">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              <span>{quiz.questionCount} Pertanyaan</span>
                           </div>
                           <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{formatTime(quiz.timeLimit)}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   );
}