import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
         return NextResponse.json(
            { error: "Unauthorized. Please log in." },
            { status: 401 }
         );
      }

      const userId = session.user.id;

      // Get recent completed attempts
      const attempts = await prisma.quizAttempt.findMany({
         where: {
            userId,
            completed: true,
         },
         orderBy: {
            endedAt: "desc",
         },
         take: 5,
         include: {
            quiz: {
               select: {
                  title: true,
               },
            },
         },
      });

      const formattedAttempts = attempts.map((attempt) => ({
         id: attempt.id,
         quizId: attempt.quizId,
         quizTitle: attempt.quiz.title,
         score: attempt.score || 0,
         completedAt:
            attempt.endedAt?.toISOString() || new Date().toISOString(),
      }));

      return NextResponse.json({ attempts: formattedAttempts });
   } catch (error) {
      console.error("Error fetching recent attempts:", error);
      return NextResponse.json(
         { error: "Failed to fetch recent attempts" },
         { status: 500 }
      );
   }
}
