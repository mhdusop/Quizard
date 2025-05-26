import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock, HelpCircle, Loader2 } from "lucide-react";

type QuizDetailCardProps = {
   quiz: {
      title: string;
      description?: string;
      timeLimit: number;
      questionCount: number;
   };
   onStartQuiz: () => void;
   isStarting: boolean;
};

export function QuizDetailCard({ quiz, onStartQuiz, isStarting }: QuizDetailCardProps) {
   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} menit ${remainingSeconds > 0 ? `${remainingSeconds} detik` : ''}`;
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-md">Detail Quiz</CardTitle>
            {quiz.description && (
               <CardDescription>{quiz.description}</CardDescription>
            )}
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <QuizStatItem
                  icon={<HelpCircle className="h-5 w-5 text-primary" />}
                  value={`${quiz.questionCount} Pertanyaan`}
                  label="Untuk dikerjakan"
               />
               <QuizStatItem
                  icon={<Clock className="h-5 w-5 text-primary" />}
                  value={formatTime(quiz.timeLimit)}
                  label="Batas waktu"
               />
            </div>

            <Separator />

            <div className="space-y-2">
               <h3 className="font-semibold">Petunjuk Pengerjaan:</h3>
               <ul className="list-disc pl-5 space-y-1 text-gray-500 text-sm font-normal">
                  <li>Pastikan Anda memiliki koneksi internet yang stabil selama mengerjakan quiz.</li>
                  <li>Timer akan berjalan saat Anda memulai quiz dan tidak dapat dihentikan.</li>
                  <li>Setiap pertanyaan hanya memiliki satu jawaban yang benar.</li>
                  <li>Anda dapat melanjutkan quiz yang tertunda jika browser ditutup.</li>
                  <li>Setelah menjawab semua pertanyaan atau waktu habis, quiz akan otomatis diselesaikan.</li>
               </ul>
            </div>
         </CardContent>
         <CardFooter>
            <Button
               onClick={onStartQuiz}
               disabled={isStarting}
               className="w-full cursor-pointer"
            >
               {isStarting ? (
                  <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Memulai Quiz...
                  </>
               ) : (
                  <>
                     <BookOpen className="mr-2 h-5 w-5" />
                     Mulai Quiz
                  </>
               )}
            </Button>
         </CardFooter>
      </Card>
   );
}

type QuizStatItemProps = {
   icon: React.ReactNode;
   value: string;
   label: string;
};

function QuizStatItem({ icon, value, label }: QuizStatItemProps) {
   return (
      <div className="flex items-center">
         <div className="mr-3">{icon}</div>
         <div>
            <div className="font-medium text-sm">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
         </div>
      </div>
   );
}