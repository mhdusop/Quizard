import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

type AttemptItem = {
   id: string;
   quizId: string;
   quizTitle: string;
   score: number;
   completedAt: string;
};

type RecentAttemptsProps = {
   attempts: AttemptItem[];
   onAttemptSelect: (attemptId: string) => void;
};

export function RecentAttempts({ attempts, onAttemptSelect }: RecentAttemptsProps) {
   const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: 'numeric',
         month: 'short',
         year: 'numeric'
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
   };

   const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
   };

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quiz Terakhir</CardTitle>
            <Button
               variant="outline"
               size="sm"
               onClick={() => window.location.href = '/user/attempts'}
            >
               Lihat Semua
            </Button>
         </CardHeader>
         <CardContent>
            {attempts.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                  <p>Belum ada quiz yang diselesaikan</p>
               </div>
            ) : (
               <div className="space-y-3">
                  {attempts.map((attempt) => (
                     <div
                        key={attempt.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0"
                     >
                        <div>
                           <p className="font-medium line-clamp-1">{attempt.quizTitle}</p>
                           <p className="text-xs text-gray-500">{formatDate(attempt.completedAt)}</p>
                        </div>
                        <div className="flex items-center">
                           <Award className="h-4 w-4 mr-1 text-yellow-500" />
                           <span className={`font-bold ${getScoreColor(attempt.score)}`}>
                              {attempt.score}%
                           </span>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onAttemptSelect(attempt.id)}
                              className="ml-2"
                           >
                              Detail
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   );
}