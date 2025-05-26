import { Clock } from "lucide-react";

type QuizHeaderProps = {
   title: string;
   currentQuestionIndex: number;
   totalQuestions: number;
   timeRemaining: number | null;
   formatTime: (seconds: number) => string;
};

export function QuizHeader({
   title,
   currentQuestionIndex,
   totalQuestions,
   timeRemaining,
   formatTime
}: QuizHeaderProps) {
   return (
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
         <div>
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            <div className="text-sm text-gray-500">
               Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
            </div>
         </div>

         {timeRemaining !== null && (
            <div className={`
          mt-2 sm:mt-0 flex items-center px-4 py-2 rounded-full 
          ${timeRemaining < 30 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}
        `}>
               <Clock className={`mr-2 h-5 w-5 ${timeRemaining < 30 && "animate-pulse"}`} />
               <div className="text-lg font-mono font-medium">
                  {formatTime(timeRemaining)}
               </div>
            </div>
         )}
      </div>
   );
}