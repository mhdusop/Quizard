import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type QuizFallbackProps = {
   onBack: () => void;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   quiz: any;
};

export function QuizFallback({ onBack, quiz }: QuizFallbackProps) {
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center max-w-md p-6 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
               Quiz tidak dapat dimuat
            </h3>
            <p className="text-yellow-600 mb-4">
               {quiz && quiz.questions && quiz.questions.length === 0
                  ? "Quiz ini tidak memiliki pertanyaan."
                  : "Terjadi kesalahan saat memuat quiz."}
            </p>
            <Button onClick={onBack}>
               Kembali ke Daftar Quiz
            </Button>
         </div>
      </div>
   );
}