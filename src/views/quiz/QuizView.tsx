"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Quiz } from "@/types/quiz";

export default function QuizView() {
   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [quizTitle, setQuizTitle] = useState("");
   const [quizDescription, setQuizDescription] = useState("");
   const [timeLimit, setTimeLimit] = useState(300);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
   const router = useRouter();

   useEffect(() => {
      fetchQuizzes();
   }, []);

   const fetchQuizzes = async () => {
      setIsLoadingQuizzes(true);
      try {
         const response = await fetch("/api/quiz");
         const data = await response.json();
         setQuizzes(data.quizzes || []);
      } catch (error) {
         console.error("Failed to fetch quizzes:", error);
      } finally {
         setIsLoadingQuizzes(false);
      }
   };

   const handleCreateQuiz = async () => {
      setIsLoading(true);

      try {
         const response = await fetch("/api/quiz", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: quizTitle,
               description: quizDescription,
               timeLimit,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || "Failed to create quiz");
         }

         await fetchQuizzes();

         setQuizTitle("");
         setQuizDescription("");
         setTimeLimit(300);
         setIsDialogOpen(false);
      } catch (error) {
         console.error(error);
         alert("An unexpected error occurred.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="p-4">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Quizzes</h1>
            <Button onClick={() => setIsDialogOpen(true)}>Create Quiz</Button>
         </div>

         {isLoadingQuizzes ? (
            <div className="flex justify-center items-center p-8">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
         ) : quizzes.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
               No quizzes available. Create your first quiz!
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {quizzes.map((quiz) => (
                  <Card
                     key={quiz.id}
                     className="cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => router.push(`/admin/quiz/${quiz.id}`)}
                  >
                     <CardHeader>
                        <CardTitle>{quiz.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-gray-600 mb-2">{quiz.description || "No description available."}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                           <span>Questions: {quiz.questionCount}</span>
                           <span>Time: {Math.floor(quiz.timeLimit / 60)}:{(quiz.timeLimit % 60).toString().padStart(2, '0')}</span>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Create a New Quiz</DialogTitle>
               </DialogHeader>
               <div className="space-y-4 py-4">
                  <Input
                     placeholder="Quiz Title"
                     value={quizTitle}
                     onChange={(e) => setQuizTitle(e.target.value)}
                     disabled={isLoading}
                  />
                  <Input
                     placeholder="Quiz Description"
                     value={quizDescription}
                     onChange={(e) => setQuizDescription(e.target.value)}
                     disabled={isLoading}
                  />
                  <Input
                     type="number"
                     placeholder="Time Limit (seconds)"
                     value={timeLimit}
                     onChange={(e) => setTimeLimit(Number(e.target.value))}
                     min={1}
                     disabled={isLoading}
                  />
                  <Button
                     onClick={handleCreateQuiz}
                     disabled={isLoading}
                     className="w-full"
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Creating...
                        </>
                     ) : (
                        "Create Quiz"
                     )}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}