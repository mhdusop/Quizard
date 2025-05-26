import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

type NotFoundStateProps = {
   message: string;
   onBackClick?: () => void;
};

export function NotFoundState({ message, onBackClick }: NotFoundStateProps) {
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center max-w-md p-6 bg-yellow-50 rounded-lg">
            <HelpCircle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Tidak Ditemukan</h3>
            <p className="text-yellow-600 mb-4">{message}</p>
            {onBackClick && (
               <Button onClick={onBackClick} variant="outline">
                  Kembali
               </Button>
            )}
         </div>
      </div>
   );
}