import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle } from "lucide-react";

type Quiz = {
   id: string;
   title: string;
   description?: string;
   timeLimit: number;
   questionCount: number;
};

type QuizCardProps = {
   quiz: Quiz;
   onSelect: () => void;
};

export function QuizCard({ quiz, onSelect }: QuizCardProps) {
   const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")} menit`;
   };

   return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow gap-3">
         <CardHeader>
            <CardTitle className="line-clamp-2 font-bold text-xl">{quiz.title}</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-gray-500 text-sm mb-4 line-clamp-3">
               {quiz.description || "Tidak ada deskripsi untuk quiz ini."}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
               <QuizMetadata
                  icon={<HelpCircle className="h-4 w-4 text-primary" />}
                  text={`${quiz.questionCount} Pertanyaan`}
               />
               <QuizMetadata
                  icon={<Clock className="h-4 w-4 text-primary" />}
                  text={formatTime(quiz.timeLimit)}
               />
            </div>
         </CardContent>
         <CardFooter className="bg-gray-50 border-t">
            <Button onClick={onSelect} className="w-full">
               Lihat Quiz
            </Button>
         </CardFooter>
      </Card>
   );
}

type QuizMetadataProps = {
   icon: React.ReactNode;
   text: string;
};

function QuizMetadata({ icon, text }: QuizMetadataProps) {
   return (
      <div className="flex items-center">
         <span className="mr-2">{icon}</span>
         <span>{text}</span>
      </div>
   );
}