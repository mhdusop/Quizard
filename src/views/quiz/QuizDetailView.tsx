"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { QuestionDialog } from "./components/QuestionDialog";

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

type Quiz = {
   id: string;
   title: string;
   description?: string;
   questions: Question[];
};

export default function QuizDetailView({ id }: { id: string }) {
   const [quiz, setQuiz] = useState<Quiz | null>(null);
   const [loading, setLoading] = useState(true);
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   useEffect(() => {
      const fetchQuiz = async () => {
         try {
            const response = await fetch(`/api/quiz/${id}`, {
               cache: "no-store"
            });
            console.log({ response });

            const data = await response.json();
            if (response.ok) {
               setQuiz(data.quiz);
            } else {
               console.error(data.error);
            }
         } catch (error) {
            console.error("Failed to fetch quiz:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchQuiz();
   }, [id]);

   const handleCreateQuestion = () => {
      setIsDialogOpen(true);
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   if (!quiz) {
      return <div>Quiz tidak ditemukan.</div>;
   }

   return (
      <div className="p-4">
         <Card>
            <CardHeader>
               <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
               <p>{quiz.description || "Tidak ada deskripsi."}</p>
               <h2 className="text-xl font-semibold mt-4">Daftar Pertanyaan</h2>
               <ul className="space-y-4">
                  {quiz.questions.map((question) => (
                     <li key={question.id}>
                        <Card>
                           <CardHeader>
                              <CardTitle>{question.content}</CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ul className="list-disc pl-6">
                                 {question.options.map((option) => (
                                    <li key={option.id}>
                                       {option.content} {option.isCorrect && "(Benar)"}
                                    </li>
                                 ))}
                              </ul>
                           </CardContent>
                        </Card>
                     </li>
                  ))}
               </ul>
               <Button onClick={handleCreateQuestion} className="mt-4">
                  Tambah Pertanyaan
               </Button>
            </CardContent>
         </Card>

         <QuestionDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            quizId={quiz.id}
         />
      </div>
   );
}