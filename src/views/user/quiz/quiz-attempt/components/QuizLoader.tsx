import { Loader2 } from "lucide-react";

export function QuizLoader() {
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Memuat Quiz</h2>
            <p className="text-gray-500">Mohon tunggu sebentar...</p>
         </div>
      </div>
   );
}