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

      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "10");

      const quizzes = await prisma.quiz.findMany({
         orderBy: {
            createdAt: "desc",
         },
         take: limit,
         include: {
            _count: {
               select: {
                  questions: true,
                  attempts: true,
               },
            },
         },
      });

      const formattedQuizzes = quizzes.map((quiz) => ({
         id: quiz.id,
         title: quiz.title,
         description: quiz.description,
         createdAt: quiz.createdAt.toISOString(),
         questions: quiz._count.questions,
         attempts: quiz._count.attempts,
      }));

      return NextResponse.json({ quizzes: formattedQuizzes });
   } catch (error) {
      console.error("Error fetching recent quizzes:", error);
      return NextResponse.json(
         { error: "Failed to fetch recent quizzes" },
         { status: 500 }
      );
   }
}
