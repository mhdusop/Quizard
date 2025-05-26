"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { QuestionDialog } from "./components/QuestionDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

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
   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
   const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   const fetchQuiz = async () => {
      try {
         setLoading(true);
         const response = await fetch(`/api/quiz/${id}`);
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

   useEffect(() => {
      fetchQuiz();
   }, [id]);

   const handleCreateQuestion = () => {
      setIsDialogOpen(true);
   };

   const handleQuestionDialogClose = () => {
      setIsDialogOpen(false);
      fetchQuiz();
   };

   const openDeleteConfirmation = (question: Question) => {
      setDeletingQuestion(question);
      setIsConfirmDialogOpen(true);
   };

   const handleDeleteQuestion = async () => {
      if (!deletingQuestion) return;

      try {
         setIsDeleting(true);
         const response = await fetch(`/api/questions/${deletingQuestion.id}`, {
            method: "DELETE",
         });

         if (response.ok) {
            setIsConfirmDialogOpen(false);
            fetchQuiz();
         } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
         }
      } catch (error) {
         console.error("Error deleting question:", error);
         alert("Terjadi kesalahan saat menghapus pertanyaan");
      } finally {
         setIsDeleting(false);
         setDeletingQuestion(null);
      }
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
               <p className="text-gray-600 mb-4">{quiz.description || "Tidak ada deskripsi."}</p>

               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Daftar Pertanyaan</h2>
                  <Button onClick={handleCreateQuestion}>
                     Tambah Pertanyaan
                  </Button>
               </div>

               {quiz.questions.length === 0 ? (
                  <div className="text-center p-8 text-gray-500 border border-dashed rounded-md">
                     Belum ada pertanyaan. Klik Tambah Pertanyaan untuk membuat pertanyaan baru.
                  </div>
               ) : (
                  <ul className="space-y-4">
                     {quiz.questions.map((question, index) => (
                        <li key={question.id}>
                           <Card>
                              <CardHeader className="flex flex-row items-center justify-between">
                                 <CardTitle>Pertanyaan {index + 1}: {question.content}</CardTitle>
                                 <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteConfirmation(question)}
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </CardHeader>
                              <CardContent>
                                 <ul className="list-disc pl-6">
                                    {question.options.map((option) => (
                                       <li key={option.id} className={option.isCorrect ? "font-bold text-green-600" : ""}>
                                          {option.content} {option.isCorrect && "(Benar)"}
                                       </li>
                                    ))}
                                 </ul>
                              </CardContent>
                           </Card>
                        </li>
                     ))}
                  </ul>
               )}
            </CardContent>
         </Card>

         <QuestionDialog
            open={isDialogOpen}
            onClose={handleQuestionDialogClose}
            quizId={quiz.id}
         />

         <ConfirmDialog
            open={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteQuestion}
            title="Hapus Pertanyaan"
            description={`Apakah Anda yakin ingin menghapus pertanyaan "${deletingQuestion?.content}"? Tindakan ini tidak dapat dibatalkan.`}
            loading={isDeleting}
         />
      </div>
   );
}