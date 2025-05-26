import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

type Quiz = {
   id: string;
   title: string;
};

type QuizAttempt = {
   id: string;
};

type ResultsData = {
   correctCount: number;
   incorrectCount: number;
   unansweredCount: number;
   totalQuestions: number;
   score: number;
};

type QuizResultsProps = {
   quiz: Quiz | null;
   results: ResultsData;
   attempt: QuizAttempt | null;
   onBackToList: () => void;
   onViewDetails: () => void;
};

export function QuizResults({
   quiz,
   results,
   onBackToList,
}: QuizResultsProps) {
   return (
      <div className="container mx-auto p-4 max-w-3xl">
         <Card className="overflow-hidden">
            <CardHeader className="text-center">
               <CardTitle className="text-2xl">{quiz?.title} - Hasil</CardTitle>
            </CardHeader>
            <CardContent>
               <ScoreChart score={results.score} />

               <ResultStats results={results} />

               <div className="border-t border-gray-200 pt-6 text-center">
                  <h3 className="font-medium text-lg mb-2">
                     {results.score >= 80 ? "Luar Biasa! 🎉" :
                        results.score >= 60 ? "Bagus! 👍" :
                           "Teruslah Belajar! 📚"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                     {results.score >= 80 ? "Anda telah menyelesaikan quiz dengan nilai yang sangat baik!" :
                        results.score >= 60 ? "Anda telah menyelesaikan quiz dengan nilai yang baik." :
                           "Jangan menyerah, teruslah belajar dan coba lagi nanti."}
                  </p>
               </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
               <Button
                  onClick={onBackToList}
               >
                  Kembali ke Daftar Quiz
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
}

type ScoreChartProps = {
   score: number;
};

function ScoreChart({ score }: ScoreChartProps) {
   return (
      <div className="flex justify-center mb-8">
         <div className="relative w-40 h-40">
            <svg className="w-full h-full">
               <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
               />
               <circle
                  className={`${score >= 80 ? "text-green-500" :
                     score >= 60 ? "text-yellow-500" :
                        "text-red-500"
                     }`}
                  strokeWidth="10"
                  strokeDasharray={`${score * 4.4} 440`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                  transform="rotate(-90 80 80)"
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center">
                  <span className="text-4xl font-bold">{score}%</span>
                  <p className="text-sm text-gray-500">Nilai Anda</p>
               </div>
            </div>
         </div>
      </div>
   );
}

type ResultStatsProps = {
   results: ResultsData;
};

function ResultStats({ results }: ResultStatsProps) {
   return (
      <div className="grid grid-cols-3 gap-4 text-center mb-8">
         <div className="p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-700">{results.correctCount}</div>
            <div className="text-sm text-gray-500">Benar</div>
         </div>
         <div className="p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-red-700">{results.incorrectCount}</div>
            <div className="text-sm text-gray-500">Salah</div>
         </div>
         <div className="p-4 bg-gray-50 rounded-lg">
            <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-700">{results.unansweredCount}</div>
            <div className="text-sm text-gray-500">Tidak Dijawab</div>
         </div>
      </div>
   );
}