"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/state/LoadingState";
import { ErrorState } from "@/components/state/ErrorState";
import { EmptyState } from "@/components/state/EmptyState";
import { PageHeader } from "./components/PageHeader";
import { QuizGrid } from "./components/QuizGrid";

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
      loadQuizzes();
   }, []);

   const loadQuizzes = async () => {
      try {
         setLoading(true);
         const response = await fetch('/api/user/quiz', {
            cache: 'no-store',
         });

         if (!response.ok) {
            throw new Error('Gagal memuat data quiz');
         }

         const data = await response.json();
         setQuizzes(data.quizzes || []);
         setError(null);
      } catch (error) {
         console.error('Error fetching quizzes:', error);
         setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
      } finally {
         setLoading(false);
      }
   };

   const handleQuizSelect = (quizId: string) => {
      router.push(`/user/quiz/${quizId}`);
   };

   if (loading) {
      return <LoadingState message="Memuat Quiz" />;
   }

   if (error) {
      return <ErrorState message={error} onRetry={loadQuizzes} />;
   }

   return (
      <div className="container mx-auto p-4">
         <PageHeader
            title="Daftar Quiz"
            description="Pilih quiz yang ingin Anda kerjakan dari daftar di bawah ini."
         />

         {quizzes.length === 0 ? (
            <EmptyState
               title="Belum ada quiz tersedia"
               description="Saat ini belum ada quiz yang tersedia untuk dikerjakan. Silakan periksa kembali nanti."
            />
         ) : (
            <QuizGrid quizzes={quizzes} onQuizSelect={handleQuizSelect} />
         )}
      </div>
   );
}