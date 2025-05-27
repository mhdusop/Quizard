import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user || session.user.role !== "ADMIN") {
         return NextResponse.json(
            { error: "Unauthorized. Admin access required." },
            { status: 401 }
         );
      }

      // Get query parameters
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "10");

      // Fetch recent quiz attempts
      const completedAttempts = await prisma.quizAttempt.findMany({
         where: {
            completed: true,
         },
         orderBy: {
            endedAt: "desc",
         },
         take: Math.ceil(limit / 2),
         include: {
            user: {
               select: {
                  name: true,
               },
            },
            quiz: {
               select: {
                  title: true,
               },
            },
         },
      });

      // Fetch recently created quizzes
      const createdQuizzes = await prisma.quiz.findMany({
         orderBy: {
            createdAt: "desc",
         },
         take: Math.floor(limit / 2),
         include: {
            createdBy: {
               select: {
                  name: true,
               },
            },
         },
      });

      // Format and combine activities
      const quizAttemptActivities = completedAttempts.map((attempt) => ({
         id: `attempt-${attempt.id}`,
         user: attempt.user.name || "Unknown User",
         action: "completed",
         target: attempt.quiz.title,
         time: attempt.endedAt ? formatTimeAgo(attempt.endedAt) : "recently",
         score: attempt.score,
         timestamp: attempt.endedAt || attempt.startedAt,
      }));

      const quizCreationActivities = createdQuizzes.map((quiz) => ({
         id: `quiz-${quiz.id}`,
         user: quiz.createdBy.name || "Admin",
         action: "created",
         target: quiz.title,
         time: formatTimeAgo(quiz.createdAt),
         timestamp: quiz.createdAt,
      }));

      // Combine and sort activities
      const activities = [...quizAttemptActivities, ...quizCreationActivities]
         .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
         .slice(0, limit);

      return NextResponse.json({ activities });
   } catch (error) {
      console.error("Error fetching activity feed:", error);
      return NextResponse.json(
         { error: "Failed to fetch activity feed" },
         { status: 500 }
      );
   }
}

// Helper function to format relative time
function formatTimeAgo(date: Date): string {
   const now = new Date();
   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

   if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`;
   }

   const diffInMinutes = Math.floor(diffInSeconds / 60);
   if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
   }

   const diffInHours = Math.floor(diffInMinutes / 60);
   if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
   }

   const diffInDays = Math.floor(diffInHours / 24);
   if (diffInDays < 30) {
      return `${diffInDays} hari yang lalu`;
   }

   const diffInMonths = Math.floor(diffInDays / 30);
   return `${diffInMonths} bulan yang lalu`;
}
