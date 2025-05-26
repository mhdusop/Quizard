"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Clock, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";

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
   timeLimit: number;
   questions: Question[];
};

type QuizAttempt = {
   id: string;
   startedAt: string;
   answers: Answer[];
};

type Answer = {
   questionId: string;
   selectedOptionId: string | null;
   isCorrect: boolean | null;
};

type ResultsData = {
   correctCount: number;
   incorrectCount: number;
   unansweredCount: number;
   totalQuestions: number;
   score: number;
};

export default function QuizAttemptView({ id }: { id: string }) {
   const [quiz, setQuiz] = useState<Quiz | null>(null);
   const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);
   const [submitting, setSubmitting] = useState<boolean>(false);
   const [isComplete, setIsComplete] = useState<boolean>(false);
   const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
   const [results, setResults] = useState<ResultsData | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [selectedOption, setSelectedOption] = useState<string | null>(null);

   const router = useRouter();
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   // Fungsi untuk memeriksa dan memuat data yang tersimpan dalam localStorage
   const checkLocalStorage = () => {
      if (typeof window !== "undefined") {
         const savedAttempt = localStorage.getItem(`quiz_attempt_${id}`);
         const savedTime = localStorage.getItem(`quiz_time_${id}`);
         const savedIndex = localStorage.getItem(`quiz_question_index_${id}`);

         if (savedAttempt) {
            return {
               attempt: JSON.parse(savedAttempt),
               timeRemaining: savedTime ? parseInt(savedTime) : null,
               questionIndex: savedIndex ? parseInt(savedIndex) : 0,
            };
         }
      }
      return null;
   };

   // Fetch quiz data
   useEffect(() => {
      const fetchQuiz = async () => {
         try {
            setLoading(true);

            // Fetch quiz detail
            const response = await fetch(`/api/user/quiz/${id}`, {
               cache: "no-store",
            });

            if (!response.ok) {
               throw new Error("Gagal mengambil data quiz");
            }

            const data = await response.json();
            console.log("Quiz data:", data);

            if (!data.quiz) {
               throw new Error("Data quiz tidak ditemukan");
            }

            // Simpan data quiz dasar
            const quizData = {
               ...data.quiz,
               questions: [] // Inisialisasi questions sebagai array kosong
            };

            // Periksa apakah quiz memiliki pertanyaan berdasarkan questionCount
            if (!data.quiz.questionCount || data.quiz.questionCount === 0) {
               setError("Quiz ini tidak memiliki pertanyaan");
               setQuiz(quizData);
               setLoading(false);
               return;
            }

            // Fetch pertanyaan quiz secara terpisah
            try {
               const questionsResponse = await fetch(`/api/user/quiz/${id}/question`, {
                  cache: "no-store",
               });
               if (questionsResponse.ok) {
                  const questionsData = await questionsResponse.json();
                  console.log("Questions data:", questionsData);

                  if (questionsData.questions && Array.isArray(questionsData.questions)) {
                     quizData.questions = questionsData.questions;
                  }
               } else {
                  throw new Error("Gagal mengambil pertanyaan quiz");
               }
            } catch (questionsError) {
               console.error("Error fetching questions:", questionsError);
               setError("Gagal memuat pertanyaan quiz. Silakan coba lagi nanti.");
               setLoading(false);
               return;
            }

            setQuiz(quizData);

            // Periksa lagi apakah quiz sekarang memiliki pertanyaan
            if (!quizData.questions || quizData.questions.length === 0) {
               setError("Quiz ini tidak memiliki pertanyaan");
            } else {
               // Jika ada pertanyaan, lanjutkan dengan attempt
               checkSavedAttemptOrStart(quizData);
            }
         } catch (error) {
            console.error("Error fetching quiz:", error);
            setError(error instanceof Error ? error.message : "Gagal memuat quiz. Silakan coba lagi nanti.");
         } finally {
            setLoading(false);
         }
      };

      fetchQuiz();
   }, [id]);

   // Timer logic
   useEffect(() => {
      if (timeRemaining === null || isComplete) return;

      // Jika waktu habis, selesaikan quiz
      if (timeRemaining <= 0) {
         if (attempt && quiz && quiz.questions.length > 0) {
            completeQuiz(attempt.answers);
         }
         return;
      }

      // Set up timer
      timerRef.current = setInterval(() => {
         setTimeRemaining(prev => {
            if (prev === null || prev <= 1) {
               if (timerRef.current) clearInterval(timerRef.current);
               return 0;
            }

            const newValue = prev - 1;
            // Save to localStorage
            if (typeof window !== "undefined") {
               localStorage.setItem(`quiz_time_${id}`, newValue.toString());
            }
            return newValue;
         });
      }, 1000);

      // Clean up timer
      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, [timeRemaining, isComplete, attempt, quiz, id]);

   // Clean up timer on unmount
   useEffect(() => {
      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, []);

   // Check for saved attempt or start new one
   const checkSavedAttemptOrStart = (quizData: Quiz) => {
      // Validasi quiz data
      if (!quizData) {
         setError("Data quiz tidak valid");
         return;
      }

      // Pastikan questions adalah array
      if (!Array.isArray(quizData.questions)) {
         quizData.questions = [];
      }

      // Periksa apakah quiz memiliki pertanyaan
      if (quizData.questions.length === 0) {
         setError("Quiz ini tidak memiliki pertanyaan");
         return;
      }

      const savedData = checkLocalStorage();

      if (savedData && !savedData.attempt.completed) {
         try {
            // Resume quiz from localStorage
            setAttempt(savedData.attempt);
            setTimeRemaining(savedData.timeRemaining || quizData.timeLimit);

            // Validasi index pertanyaan
            const maxIndex = Math.max(0, quizData.questions.length - 1);
            const safeIndex = Math.min(savedData.questionIndex || 0, maxIndex);
            setCurrentQuestionIndex(safeIndex);

            // Set selected option for current question if exists
            const currentQuestionId = quizData.questions[safeIndex]?.id;
            if (currentQuestionId) {
               const savedAnswer = savedData.attempt.answers.find(
                  (a: Answer) => a.questionId === currentQuestionId
               );
               if (savedAnswer) {
                  setSelectedOption(savedAnswer.selectedOptionId);
               }
            }

            console.log("Melanjutkan quiz dari localStorage");
         } catch (error) {
            console.error("Error resuming quiz:", error);
            // Jika terjadi error saat meresume, mulai attempt baru
            startNewAttempt(quizData);
         }
      } else {
         // Start a new attempt
         startNewAttempt(quizData);
      }
   };

   // Start a new quiz attempt
   const startNewAttempt = async (quizData: Quiz) => {
      try {
         setSubmitting(true);
         const response = await fetch(`/api/user/quiz/${id}/attempt`, {
            method: "POST",
            cache: "no-store",
         });

         if (!response.ok) {
            throw new Error("Gagal memulai quiz");
         }

         const data = await response.json();
         const newAttempt = {
            id: data.attempt.id,
            startedAt: data.attempt.startedAt,
            answers: []
         };

         setAttempt(newAttempt);
         setTimeRemaining(quizData.timeLimit);
         setCurrentQuestionIndex(0);

         // Save to localStorage
         if (typeof window !== "undefined") {
            localStorage.setItem(`quiz_attempt_${id}`, JSON.stringify(newAttempt));
            localStorage.setItem(`quiz_time_${id}`, quizData.timeLimit.toString());
            localStorage.setItem(`quiz_question_index_${id}`, "0");
         }
      } catch (error) {
         console.error("Error starting quiz attempt:", error);
         setError("Gagal memulai quiz. Silakan coba lagi.");
      } finally {
         setSubmitting(false);
      }
   };

   // Handle answer selection
   const handleSelectOption = (optionId: string) => {
      if (submitting || isComplete) return;
      setSelectedOption(optionId);
   };

   // Handle answer submission
   const handleSubmitAnswer = async () => {
      if (!quiz || !attempt || !selectedOption || submitting || isComplete) return;

      setSubmitting(true);

      try {
         // Get the current question
         const currentQuestion = quiz.questions[currentQuestionIndex];
         if (!currentQuestion) return;

         // Get the selected option
         const selectedOptionObj = currentQuestion.options.find(opt => opt.id === selectedOption);
         if (!selectedOptionObj) return;

         // Create new answer
         const newAnswer: Answer = {
            questionId: currentQuestion.id,
            selectedOptionId: selectedOption,
            isCorrect: selectedOptionObj.isCorrect,
         };

         // Update attempt
         const updatedAttempt = { ...attempt };
         const existingAnswerIndex = updatedAttempt.answers.findIndex(
            a => a.questionId === currentQuestion.id
         );

         if (existingAnswerIndex >= 0) {
            updatedAttempt.answers[existingAnswerIndex] = newAnswer;
         } else {
            updatedAttempt.answers.push(newAnswer);
         }

         setAttempt(updatedAttempt);

         // Save to localStorage
         if (typeof window !== "undefined") {
            localStorage.setItem(`quiz_attempt_${id}`, JSON.stringify(updatedAttempt));
         }

         // Save answer to server - PERBAIKAN PATH API
         await fetch(`/api/user/quiz/${id}/attempt/${attempt.id}/answer`, {
            method: "POST",
            cache: "no-store",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               questionId: currentQuestion.id,
               selectedOptionId: selectedOption,
               isCorrect: selectedOptionObj.isCorrect,
            }),
         });

         // Move to next question
         if (currentQuestionIndex < (quiz.questions.length - 1)) {
            goToNextQuestion();
         } else {
            // If it's the last question, complete the quiz
            completeQuiz(updatedAttempt.answers);
         }
      } catch (error) {
         console.error("Error saving answer:", error);
         setError("Gagal menyimpan jawaban. Silakan coba lagi.");
      } finally {
         setSubmitting(false);
      }
   };

   // Go to next question
   const goToNextQuestion = () => {
      setCurrentQuestionIndex(prev => {
         const newIndex = prev + 1;
         // Reset selected option
         setSelectedOption(null);

         // Check if there's an answer for the next question
         if (quiz && attempt) {
            const nextQuestionId = quiz.questions[newIndex]?.id;
            const existingAnswer = attempt.answers.find(a => a.questionId === nextQuestionId);
            if (existingAnswer) {
               setSelectedOption(existingAnswer.selectedOptionId);
            }
         }

         // Save question index to localStorage
         if (typeof window !== "undefined") {
            localStorage.setItem(`quiz_question_index_${id}`, newIndex.toString());
         }

         return newIndex;
      });
   };

   // Calculate results and complete quiz
   const completeQuiz = async (answers: Answer[]) => {
      if (!quiz || isComplete) return;

      try {
         setSubmitting(true);

         // Calculate results
         const totalQuestions = quiz.questions.length;
         const correctCount = answers.filter(a => a.isCorrect === true).length;
         const incorrectCount = answers.filter(a => a.isCorrect === false).length;
         const unansweredCount = totalQuestions - answers.length;
         const score = Math.round((correctCount / totalQuestions) * 100);

         // Set results
         setResults({
            correctCount,
            incorrectCount,
            unansweredCount,
            totalQuestions,
            score,
         });

         setIsComplete(true);

         // Save completion to server - PERBAIKAN PATH API
         if (attempt) {
            await fetch(`/api/user/quiz/${id}/attempt/${attempt.id}/complete`, {
               method: "POST",
               cache: "no-store",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  score,
                  endedAt: new Date().toISOString(),
                  completed: true,
               }),
            });

            // Clear localStorage data
            if (typeof window !== "undefined") {
               localStorage.removeItem(`quiz_attempt_${id}`);
               localStorage.removeItem(`quiz_time_${id}`);
               localStorage.removeItem(`quiz_question_index_${id}`);
            }
         }
      } catch (error) {
         console.error("Error completing quiz:", error);
         setError("Gagal menyelesaikan quiz. Silakan coba lagi.");
      } finally {
         setSubmitting(false);
      }
   };

   // Format time (seconds) to MM:SS
   const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
   };

   // Show loading state
   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
               <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
               <h2 className="text-xl font-medium mb-2">Memuat Quiz</h2>
               <p className="text-gray-500">Mohon tunggu sebentar...</p>
            </div>
         </div>
      );
   }

   // Show error state
   if (error) {
      return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center max-w-md p-8 bg-red-50 rounded-lg">
               <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
               <h2 className="text-xl font-medium text-red-800 mb-2">Terjadi Kesalahan</h2>
               <p className="text-red-600 mb-4">{error}</p>
               <Button onClick={() => router.push("/user/quiz")}>
                  Kembali ke Daftar Quiz
               </Button>
            </div>
         </div>
      );
   }

   // Show completion results
   if (isComplete && results) {
      return (
         <div className="container mx-auto p-4 max-w-3xl">
            <Card className="overflow-hidden">
               <div className="h-2 bg-primary"></div>
               <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{quiz?.title} - Hasil</CardTitle>
               </CardHeader>
               <CardContent>
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
                              className={`${results.score >= 80 ? "text-green-500" :
                                 results.score >= 60 ? "text-yellow-500" :
                                    "text-red-500"
                                 }`}
                              strokeWidth="10"
                              strokeDasharray={`${results.score * 4.4} 440`}
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
                              <span className="text-4xl font-bold">{results.score}%</span>
                              <p className="text-sm text-gray-500">Nilai Anda</p>
                           </div>
                        </div>
                     </div>
                  </div>

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
                     onClick={() => router.push("/user/quiz")}
                     variant="outline"
                  >
                     Kembali ke Daftar Quiz
                  </Button>
                  <Button
                     onClick={() => router.push(`/user/attempt/${attempt?.id}`)}
                  >
                     Lihat Detail Hasil
                  </Button>
               </CardFooter>
            </Card>
         </div>
      );
   }

   // Show current question
   if (quiz && quiz.questions && quiz.questions.length > 0 && currentQuestionIndex < quiz.questions.length) {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

      return (
         <div className="container mx-auto p-4 max-w-3xl">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
               <div>
                  <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
                  <div className="text-sm text-gray-500">
                     Pertanyaan {currentQuestionIndex + 1} dari {quiz.questions.length}
                  </div>
               </div>

               {timeRemaining !== null && (
                  <div className={`
                     mt-2 sm:mt-0 flex items-center px-4 py-2 rounded-full 
                     ${timeRemaining < 30 ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}
                  `}>
                     <Clock className={`mr-2 h-5 w-5 
                        ${timeRemaining < 30 && "animate-pulse"}`}
                     />
                     <div className="text-lg font-mono font-medium">
                        {formatTime(timeRemaining)}
                     </div>
                  </div>
               )}
            </div>

            <Progress value={progress} className="mb-6 h-2" />

            <Card className="mb-6">
               <CardHeader>
                  <CardTitle className="text-xl leading-normal">
                     {currentQuestion.content}
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {currentQuestion.options.map((option) => (
                        <div
                           key={option.id}
                           className={`
                              p-4 border rounded-lg cursor-pointer transition-all
                              ${selectedOption === option.id
                                 ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-1"
                                 : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }
                           `}
                           onClick={() => handleSelectOption(option.id)}
                        >
                           <div className="flex items-center">
                              <div className={`
                                 w-5 h-5 rounded-full mr-3 flex items-center justify-center
                                 ${selectedOption === option.id
                                    ? "bg-primary border-primary"
                                    : "border-2 border-gray-300"
                                 }
                              `}>
                                 {selectedOption === option.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                 )}
                              </div>
                              <div>{option.content}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
               <CardFooter className="flex justify-between">
                  <div className="text-xs text-gray-500">
                     {selectedOption ? "Klik tombol berikutnya untuk melanjutkan" : "Pilih salah satu jawaban di atas"}
                  </div>
                  <Button
                     onClick={handleSubmitAnswer}
                     disabled={!selectedOption || submitting}
                  >
                     {submitting ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Menyimpan...
                        </>
                     ) : currentQuestionIndex === quiz.questions.length - 1 ? (
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
         </div>
      );
   }

   // Fallback (should never reach here if implementation is correct)
   return (
      <div className="flex justify-center items-center min-h-[60vh]">
         <div className="text-center max-w-md p-6 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
               Quiz tidak dapat dimuat
            </h3>
            <p className="text-yellow-600 mb-4">
               {quiz && quiz.questions && quiz.questions.length === 0
                  ? "Quiz ini tidak memiliki pertanyaan."
                  : "Terjadi kesalahan saat memuat quiz."}
            </p>
            <Button onClick={() => router.push("/user/quiz")}>
               Kembali ke Daftar Quiz
            </Button>
         </div>
      </div>
   );
}