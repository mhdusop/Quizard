import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronRight } from "lucide-react";

type Option = {
   id: string;
   content: string;
   isCorrect: boolean;
};

type Question = {
   id: string;
   content: string;
   options: Option[];
};

type QuizQuestionProps = {
   question: Question;
   selectedOption: string | null;
   onSelectOption: (optionId: string) => void;
   onSubmit: () => void;
   isSubmitting: boolean;
   isLastQuestion: boolean;
   progress: number;
};

export function QuizQuestion({
   question,
   selectedOption,
   onSelectOption,
   onSubmit,
   isSubmitting,
   isLastQuestion,
   progress
}: QuizQuestionProps) {
   return (
      <>
         <Progress value={progress} className="mb-6 h-2" />

         <Card className="mb-6">
            <CardHeader>
               <CardTitle className="text-xl leading-normal">
                  {question.content}
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  {question.options.map((option) => (
                     <OptionItem
                        key={option.id}
                        option={option}
                        isSelected={selectedOption === option.id}
                        onSelect={() => onSelectOption(option.id)}
                     />
                  ))}
               </div>
            </CardContent>
            <CardFooter className="flex justify-between">
               <div className="text-xs text-gray-500">
                  {selectedOption ? "Klik tombol berikutnya untuk melanjutkan" : "Pilih salah satu jawaban di atas"}
               </div>
               <Button
                  onClick={onSubmit}
                  disabled={!selectedOption || isSubmitting}
               >
                  {isSubmitting ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                     </>
                  ) : isLastQuestion ? (
                     "Selesaikan Quiz"
                  ) : (
                     <>
                        Berikutnya
                        <ChevronRight className="ml-2 h-4 w-4" />
                     </>
                  )}
               </Button>
            </CardFooter>
         </Card>
      </>
   );
}

type OptionItemProps = {
   option: Option;
   isSelected: boolean;
   onSelect: () => void;
};

function OptionItem({ option, isSelected, onSelect }: OptionItemProps) {
   return (
      <div
         className={`
        p-4 border rounded-lg cursor-pointer transition-all
        ${isSelected
               ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-1"
               : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }
      `}
         onClick={onSelect}
      >
         <div className="flex items-center">
            <div className={`
          w-5 h-5 rounded-full mr-3 flex items-center justify-center
          ${isSelected
                  ? "bg-primary border-primary"
                  : "border-2 border-gray-300"
               }
        `}>
               {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
               )}
            </div>
            <div>{option.content}</div>
         </div>
      </div>
   );
}