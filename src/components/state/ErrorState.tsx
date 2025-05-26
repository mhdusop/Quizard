import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

type ErrorStateProps = {
   message: string;
   onBackClick?: () => void;
   onRetry?: () => void | Promise<void>;
};

export function ErrorState({ message, onBackClick }: ErrorStateProps) {
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
            <HelpCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Terjadi kesalahan</h3>
            <p className="text-red-600 mb-4">{message}</p>
            {onBackClick && (
               <Button onClick={onBackClick} variant="outline">
                  Kembali
               </Button>
            )}
         </div>
      </div>
   );
}