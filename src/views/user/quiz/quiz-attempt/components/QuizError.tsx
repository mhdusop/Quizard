import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type QuizErrorProps = {
   error: string;
   onBack: () => void;
};

export function QuizError({ error, onBack }: QuizErrorProps) {
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center max-w-md p-8 bg-red-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-red-800 mb-2">Terjadi Kesalahan</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onBack}>
               Kembali ke Daftar Quiz
            </Button>
         </div>
      </div>
   );
}