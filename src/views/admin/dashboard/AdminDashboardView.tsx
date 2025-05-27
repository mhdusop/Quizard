"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsOverview } from "./components/StatsOverview";
import { QuizList } from "./components/QuizList";
import { UsersList } from "./components/UserList";
import { ActivityFeed } from "./components/ActivityFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/state/LoadingState";
import { ErrorState } from "@/components/state/ErrorState";
import { BarChart, FileText, Users } from "lucide-react";

// Types
interface DashboardStats {
   totalQuizzes: number;
   totalUsers: number;
   totalQuestions: number;
   totalAttempts: number;
   averageScore: number;
   completionRate: number;
}

interface Quiz {
   id: string;
   title: string;
   description?: string;
   questionCount: number;
   createdAt: string;
   attempts: number;
}

interface User {
   id: string;
   name: string | null;
   email: string;
   role: string;
   createdAt: string;
}

export default function AdminDashboardView() {
   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            setLoading(true);

            // Parallel data fetching for better performance
            const [statsResponse, quizzesResponse, usersResponse] = await Promise.all([
               fetch('/api/admin/dashboard/stats'),
               fetch('/api/admin/quizzes'),
               fetch('/api/admin/users')
            ]);

            // Handle possible API errors
            if (!statsResponse.ok) throw new Error('Failed to load dashboard statistics');
            if (!quizzesResponse.ok) throw new Error('Failed to load quizzes');
            if (!usersResponse.ok) throw new Error('Failed to load users data');

            // Parse response data
            const statsData = await statsResponse.json();
            const quizzesData = await quizzesResponse.json();
            const usersData = await usersResponse.json();

            // Update state
            setStats(statsData.stats);
            setQuizzes(quizzesData.quizzes || []);
            setUsers(usersData.users || []);

         } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data');
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
   }, []);

   // Navigation handlers
   const handleQuizView = (quizId: string) => router.push(`/admin/quiz/${quizId}`);
   const handleQuizEdit = (quizId: string) => router.push(`/admin/quiz/${quizId}/edit`);

   if (loading) {
      return <LoadingState message="Memuat dashboard admin..." />;
   }

   if (error) {
      return <ErrorState message={error} onRetry={() => window.location.reload()} />;
   }

   const dashboardStats: DashboardStats = stats || {
      totalQuizzes: 5,
      totalUsers: 12,
      totalQuestions: 36,
      totalAttempts: 48,
      averageScore: 76,
      completionRate: 89
   };

   return (
      <div className="container mx-auto p-4 space-y-6">
         <DashboardHeader
            title="Admin Dashboard"
            description="Kelola quiz, pertanyaan, dan monitor aktivitas pengguna"
         />

         <StatsOverview stats={dashboardStats} />

         <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
               <TabsTrigger value="overview" className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Ringkasan</span>
               </TabsTrigger>
               <TabsTrigger value="quizzes" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Quiz</span>
               </TabsTrigger>
               <TabsTrigger value="users" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Pengguna</span>
               </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                     <QuizList
                        quizzes={quizzes.slice(0, 5)}
                        onQuizSelect={handleQuizView}
                        onQuizEdit={handleQuizEdit}
                        title="Quiz Terbaru"
                        showViewAll={true}
                        onViewAll={() => router.push('/admin/quiz')}
                     />
                  </div>
                  <div>
                     <ActivityFeed />
                  </div>
               </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-6">
               <QuizList
                  quizzes={quizzes}
                  onQuizSelect={handleQuizView}
                  onQuizEdit={handleQuizEdit}
                  title="Semua Quiz"
                  showViewAll={false}
               />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
               <UsersList
                  users={users}
               />
            </TabsContent>
         </Tabs>
      </div>
   );
}
