"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsOverview } from './components/StatsOverview';
import { RecentQuizzes } from './components/RecentQuizzes';
import { RecentAttempts } from './components/RecentAttempts';
import { PopularQuizzes } from './components/PopularQuizzes';
import { LoadingState } from '@/components/state/LoadingState';
import { ErrorState } from '@/components/state/ErrorState';
import { useSession } from 'next-auth/react';

type DashboardStats = {
   totalQuizzesCompleted: number;
   averageScore: number;
   bestScore: number;
   totalQuestions: number;
};

type QuizItem = {
   id: string;
   title: string;
   description?: string;
   questionCount: number;
   timeLimit: number;
};

type AttemptItem = {
   id: string;
   quizId: string;
   quizTitle: string;
   score: number;
   completedAt: string;
};

export default function UserDashboardView() {
   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [availableQuizzes, setAvailableQuizzes] = useState<QuizItem[]>([]);
   const [recentAttempts, setRecentAttempts] = useState<AttemptItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();
   const { data: session } = useSession();

   const userName = session?.user?.name || "User";

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            setLoading(true);

            // Fetch all data in parallel
            const [statsResponse, quizzesResponse, attemptsResponse] = await Promise.all([
               fetch('/api/user/dashboard/stats'),
               fetch('/api/user/quiz'),
               fetch('/api/user/attempts/recent')
            ]);

            // Handle stats response
            if (!statsResponse.ok) throw new Error('Failed to fetch dashboard statistics');
            const statsData = await statsResponse.json();

            // Handle quizzes response
            if (!quizzesResponse.ok) throw new Error('Failed to fetch quizzes');
            const quizzesData = await quizzesResponse.json();

            // Handle attempts response
            if (!attemptsResponse.ok) throw new Error('Failed to fetch recent attempts');
            const attemptsData = await attemptsResponse.json();

            // Update state with all fetched data
            setStats(statsData.stats);
            setAvailableQuizzes(quizzesData.quizzes || []);
            setRecentAttempts(attemptsData.attempts || []);

         } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
   }, []);

   const handleQuizSelect = (quizId: string) => {
      router.push(`/user/quiz/${quizId}`);
   };

   const handleAttemptSelect = (attemptId: string) => {
      router.push(`/user/attempts/${attemptId}`);
   };

   if (loading) {
      return <LoadingState message="Memuat dashboard..." />;
   }

   if (error) {
      return <ErrorState message={error} onRetry={() => window.location.reload()} />;
   }

   return (
      <div className="container mx-auto p-4">
         <DashboardHeader
            userName={userName}
            greeting="Selamat datang kembali"
         />

         {/* Stats Row */}
         <div className="mb-6">
            <StatsOverview stats={stats} />
         </div>

         {/* Main Content Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Recent Quizzes (2/3 width on large screens) */}
            <div className="lg:col-span-2">
               <RecentQuizzes
                  quizzes={availableQuizzes}
                  onQuizSelect={handleQuizSelect}
               />
            </div>

            {/* Right Column - Activity Feed (1/3 width on large screens) */}
            <div className="space-y-6">
               <RecentAttempts
                  attempts={recentAttempts}
                  onAttemptSelect={handleAttemptSelect}
               />

               <PopularQuizzes
                  quizzes={availableQuizzes.slice(0, 3)}
                  onQuizSelect={handleQuizSelect}
               />
            </div>
         </div>
      </div>
   );
}