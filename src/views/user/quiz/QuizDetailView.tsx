"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Clock, HelpCircle, Award, ArrowLeft, BookOpen } from "lucide-react";

type Quiz = {
   id: string;
   title: string;
   description?: string;
   timeLimit: number;
   questionCount: number;
   createdAt: string;
};

type PastAttempt = {
   id: string;
   score: number | null;
   completedAt: string;
};

export default function QuizDetailComponent({ id }: { id: string }) {
   const [quiz, setQuiz] = useState<Quiz | null>(null);
   const [pastAttempts, setPastAttempts] = useState<PastAttempt[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [startingQuiz, setStartingQuiz] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   useEffect(() => {
      const fetchQuizDetails = async () => {
         try {
            setLoading(true);

            // Fetch quiz details - ini sudah benar dengan path /api/user/quiz/${id}
            const quizResponse = await fetch(`/api/user/quiz/${id}`);
            if (!quizResponse.ok) {
               throw new Error("Gagal memuat detail quiz");
            }
            const quizData = await quizResponse.json();

            // Fetch past attempts - path ini perlu diubah dari /quiz/${id}/attempt menjadi /quiz/${id}/attempts
            // karena endpoint GET mengembalikan daftar attempts (jamak)
            const attemptsResponse = await fetch(`/api/user/quiz/${id}/attempt`);
            const attemptsData = attemptsResponse.ok
               ? await attemptsResponse.json()
               : { attempts: [] };

            console.log("Quiz data:", quizData);
            console.log("Attempts data:", attemptsData);

            setQuiz(quizData.quiz);
            setPastAttempts(attemptsData.attempts || []);
         } catch (error) {
            console.error("Error fetching quiz details:", error);
            setError(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat detail quiz");
         } finally {
            setLoading(false);
         }
      };

      fetchQuizDetails();
   }, [id]);

   const startQuiz = async () => {
      try {
         setStartingQuiz(true);
         router.push(`/user/quiz/${id}/attempt`);
      } catch (error) {
         console.error("Error starting quiz:", error);
         setError("Gagal memulai quiz. Silakan coba lagi.");
         setStartingQuiz(false);
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
               <p className="text-gray-500">Memuat detail quiz...</p>
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
               <p className="text-red-600 mb-4">{error}</p>
               <Button onClick={() => router.push("/user/quiz")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Daftar Quiz
               </Button>
            </div>
         </div>
      );
   }

   if (!quiz) {
      return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center max-w-md p-6 bg-yellow-50 rounded-lg">
               <HelpCircle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-yellow-800 mb-2">Quiz tidak ditemukan</h3>
               <p className="text-yellow-600 mb-4">Quiz yang Anda cari tidak tersedia atau telah dihapus.</p>
               <Button onClick={() => router.push("/user/quiz")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Daftar Quiz
               </Button>
            </div>
         </div>
      );
   }

   // Format date
   const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: "numeric",
         month: "long",
         year: "numeric"
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
   };

   // Format time (seconds to minutes)
   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} menit ${remainingSeconds > 0 ? `${remainingSeconds} detik` : ''}`;
   };

   return (
      <div className="container mx-auto p-4 max-w-4xl">
         <div className="mb-4">
            <Button
               onClick={() => router.push("/user/quiz")}
               variant="ghost"
               size="sm"
               className="mb-2"
            >
               <ArrowLeft className="mr-2 h-4 w-4" />
               Kembali ke Daftar Quiz
            </Button>

            <h1 className="text-3xl font-bold mb-1">{quiz.title}</h1>
            <p className="text-gray-500">Dibuat pada {formatDate(quiz.createdAt)}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
               <Card>
                  <CardHeader>
                     <CardTitle>Detail Quiz</CardTitle>
                     {quiz.description && (
                        <CardDescription>{quiz.description}</CardDescription>
                     )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                           <HelpCircle className="h-5 w-5 text-primary mr-3" />
                           <div>
                              <div className="font-medium">{quiz.questionCount} Pertanyaan</div>
                              <div className="text-sm text-gray-500">Untuk dikerjakan</div>
                           </div>
                        </div>

                        <div className="flex items-center">
                           <Clock className="h-5 w-5 text-primary mr-3" />
                           <div>
                              <div className="font-medium">{formatTime(quiz.timeLimit)}</div>
                              <div className="text-sm text-gray-500">Batas waktu</div>
                           </div>
                        </div>
                     </div>

                     <Separator />

                     <div className="space-y-2">
                        <h3 className="font-semibold">Petunjuk Pengerjaan:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                           <li>Pastikan Anda memiliki koneksi internet yang stabil selama mengerjakan quiz.</li>
                           <li>Timer akan berjalan saat Anda memulai quiz dan tidak dapat dihentikan.</li>
                           <li>Setiap pertanyaan hanya memiliki satu jawaban yang benar.</li>
                           <li>Anda dapat melanjutkan quiz yang tertunda jika browser ditutup.</li>
                           <li>Setelah menjawab semua pertanyaan atau waktu habis, quiz akan otomatis diselesaikan.</li>
                        </ul>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Button
                        onClick={startQuiz}
                        disabled={startingQuiz}
                        className="w-full"
                     >
                        {startingQuiz ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Memulai Quiz...
                           </>
                        ) : (
                           <>
                              <BookOpen className="mr-2 h-5 w-5" />
                              Mulai Quiz
                           </>
                        )}
                     </Button>
                  </CardFooter>
               </Card>
            </div>

            <div>
               <Card>
                  <CardHeader>
                     <CardTitle className="text-lg">Riwayat Pengerjaan</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {pastAttempts.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">
                           <p>Anda belum pernah mengerjakan quiz ini</p>
                        </div>
                     ) : (
                        <div className="space-y-3">
                           {pastAttempts.map(attempt => (
                              <div
                                 key={attempt.id}
                                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                 <div>
                                    <div className="text-sm text-gray-500">
                                       {formatDate(attempt.completedAt)}
                                    </div>
                                    <div className="flex items-center">
                                       <Award className="h-4 w-4 mr-1 text-primary" />
                                       <span className="font-medium">{attempt.score}%</span>
                                    </div>
                                 </div>
                                 <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => router.push(`/user/attempts/${attempt.id}`)}
                                 >
                                    Detail
                                 </Button>
                              </div>
                           ))}
                        </div>
                     )}
                  </CardContent>
                  <CardFooter className="flex justify-center border-t pt-4">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/user/attempts?quizId=${id}`)}
                     >
                        Lihat Semua Riwayat
                     </Button>
                  </CardFooter>
               </Card>
            </div>
         </div>
      </div>
   );
}