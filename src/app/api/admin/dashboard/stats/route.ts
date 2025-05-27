import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user || session.user.role !== "ADMIN") {
         return NextResponse.json(
            { error: "Unauthorized. Admin access required." },
            { status: 401 }
         );
      }

      // Fetch overall statistics
      const totalQuizzes = await prisma.quiz.count();
      const totalUsers = await prisma.user.count();
      const totalQuestions = await prisma.question.count();

      // Get quiz attempts data
      const attempts = await prisma.quizAttempt.findMany({
         where: { completed: true },
         select: {
            score: true,
         },
      });

      const totalAttempts = attempts.length;

      // Calculate average score
      const averageScore =
         totalAttempts > 0
            ? Math.round(
                 attempts.reduce(
                    (sum, attempt) => sum + (attempt.score || 0),
                    0
                 ) / totalAttempts
              )
            : 0;

      // Calculate completion rate
      const allAttempts = await prisma.quizAttempt.count();
      const completionRate =
         allAttempts > 0 ? Math.round((totalAttempts / allAttempts) * 100) : 0;

      // User statistics
      const usersCreatedThisMonth = await prisma.user.count({
         where: {
            createdAt: {
               gte: new Date(new Date().setDate(1)),
            },
         },
      });

      // Active users (users with attempts in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeUsers = await prisma.user.count({
         where: {
            attempts: {
               some: {
                  startedAt: {
                     gte: thirtyDaysAgo,
                  },
               },
            },
         },
      });

      // Quiz statistics
      const popularQuiz = await prisma.quiz.findMany({
         orderBy: {
            attempts: {
               _count: "desc",
            },
         },
         take: 1,
         select: {
            title: true,
         },
      });

      const mostPopularQuiz =
         popularQuiz.length > 0 ? popularQuiz[0].title : "N/A";

      // Average questions per quiz
      const averageQuestions =
         totalQuizzes > 0 ? (totalQuestions / totalQuizzes).toFixed(1) : "0";

      return NextResponse.json({
         stats: {
            totalQuizzes,
            totalUsers,
            totalQuestions,
            totalAttempts,
            averageScore,
            completionRate,
         },
         userStats: {
            totalUsers,
            activeUsers,
            newUsersThisMonth: usersCreatedThisMonth,
         },
         quizStats: {
            totalQuizzes,
            mostPopularQuiz,
            averageQuestions: parseFloat(averageQuestions),
         },
      });
   } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return NextResponse.json(
         { error: "Failed to fetch dashboard statistics" },
         { status: 500 }
      );
   }
}
