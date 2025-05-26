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
      const attempts = await prisma.quizAttempt.findMany({
         where: {
            userId,
            completed: true,
         },
         include: {
            answers: true,
         },
      });

      const totalQuizzesCompleted = attempts.length;

      const scores = attempts.map((attempt) => attempt.score || 0);
      const averageScore =
         scores.length > 0
            ? Math.round(
                 scores.reduce((sum, score) => sum + score, 0) / scores.length
              )
            : 0;

      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      const totalQuestions = attempts.reduce(
         (sum, attempt) => sum + attempt.answers.length,
         0
      );

      return NextResponse.json({
         stats: {
            totalQuizzesCompleted,
            averageScore,
            bestScore,
            totalQuestions,
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
