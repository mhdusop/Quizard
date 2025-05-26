"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, HelpCircle } from "lucide-react";

type Quiz = {
   id: string;
   title: string;
   description?: string;
   timeLimit: number;
   questionCount: number;
};

export default function UserQuizView() {
   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   useEffect(() => {
      fetchQuizzes();
   }, []);

   const fetchQuizzes = async () => {
      try {
         setLoading(true);
         const response = await fetch('/api/user/quiz');

         if (!response.ok) {
            throw new Error('Gagal memuat data quiz');
         }

         const data = await response.json();
         setQuizzes(data.quizzes || []);
      } catch (error) {
         console.error('Error fetching quizzes:', error);
         setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
      } finally {
         setLoading(false);
      }
   };

   const startQuiz = (quizId: string) => {
      router.push(`/user/quiz/${quizId}`);
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
               <p className="text-gray-500">Memuat daftar quiz...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
               <HelpCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-red-800 mb-2">Terjadi kesalahan</h3>
               <p className="text-red-600">{error}</p>
               <Button
                  onClick={fetchQuizzes}
                  variant="outline"
                  className="mt-4"
               >
                  Coba Lagi
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-4">
         <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Daftar Quiz</h1>
            <p className="text-gray-600">
               Pilih quiz yang ingin Anda kerjakan dari daftar di bawah ini.
            </p>
         </div>

         {quizzes.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
               <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-800 mb-2">Belum ada quiz tersedia</h3>
               <p className="text-gray-600">
                  Saat ini belum ada quiz yang tersedia untuk dikerjakan.
                  Silakan periksa kembali nanti.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                     <div className="h-2 bg-primary"></div>
                     <CardHeader>
                        <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                           {quiz.description || "Tidak ada deskripsi untuk quiz ini."}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div className="flex items-center">
                              <HelpCircle className="h-4 w-4 text-primary mr-2" />
                              <span>{quiz.questionCount} Pertanyaan</span>
                           </div>
                           <div className="flex items-center">
                              <Clock className="h-4 w-4 text-primary mr-2" />
                              <span>
                                 {Math.floor(quiz.timeLimit / 60)}:
                                 {(quiz.timeLimit % 60).toString().padStart(2, "0")} menit
                              </span>
                           </div>
                        </div>
                     </CardContent>
                     <CardFooter className="bg-gray-50 border-t">
                        <Button
                           onClick={() => startQuiz(quiz.id)}
                           className="w-full"
                        >
                           Lihat Quiz
                        </Button>
                     </CardFooter>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
}