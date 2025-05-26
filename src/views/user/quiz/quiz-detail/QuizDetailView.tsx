"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/state/LoadingState";
import { ErrorState } from "@/components/state/ErrorState";
import { NotFoundState } from "@/components/state/NotFoundState";
import { QuizHeaderInfo } from "./components/QuizHeaderInfo";
import { QuizDetailCard } from "./components/QuizDetailCard";
import { QuizAttemptsCard } from "./components/QuizAttemptCard";

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

            const quizResponse = await fetch(`/api/user/quiz/${id}`, {
               cache: "no-store",
            });
            if (!quizResponse.ok) {
               throw new Error("Gagal memuat detail quiz");
            }
            const quizData = await quizResponse.json();

            const attemptsResponse = await fetch(`/api/user/quiz/${id}/attempt`);
            const attemptsData = attemptsResponse.ok
               ? await attemptsResponse.json()
               : { attempts: [] };

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
      return <LoadingState message="Memuat detail quiz..." />;
   }

   if (error) {
      return <ErrorState message={error} onBackClick={() => router.push("/user/quiz")} />;
   }

   if (!quiz) {
      return <NotFoundState message="Quiz tidak ditemukan" onBackClick={() => router.push("/user/quiz")} />;
   }

   return (
      <div className="container mx-auto p-4">
         <QuizHeaderInfo
            title={quiz.title}
            createdAt={quiz.createdAt}
            onBackClick={() => router.push("/user/quiz")}
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
               <QuizDetailCard
                  quiz={quiz}
                  onStartQuiz={startQuiz}
                  isStarting={startingQuiz}
               />
            </div>

            <div>
               <QuizAttemptsCard
                  attempts={pastAttempts}
               />
            </div>
         </div>
      </div>
   );
}