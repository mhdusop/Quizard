import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type QuizHeaderInfoProps = {
   title: string;
   createdAt: string;
   onBackClick: () => void;
};

export function QuizHeaderInfo({ title, createdAt, onBackClick }: QuizHeaderInfoProps) {
   const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: "numeric",
         month: "long",
         year: "numeric"
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
   };

   return (
      <div className="mb-4">
         <Button
            onClick={onBackClick}
            variant="ghost"
            size="sm"
            className="mb-4 cursor-pointer"
         >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Quiz
         </Button>

         <h1 className="text-xl font-bold">{title}</h1>
         <p className="text-gray-500 text-sm">Dibuat pada {formatDate(createdAt)}</p>
      </div>
   );
}