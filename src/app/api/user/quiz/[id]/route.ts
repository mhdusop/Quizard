// app/api/user/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
   req: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const quizId = params.id;

      // Fetch quiz details with question count
      const quiz = await prisma.quiz.findUnique({
         where: { id: quizId },
         select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            createdAt: true,
            _count: {
               select: {
                  questions: true,
               },
            },
         },
      });

      if (!quiz) {
         return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      // Format the response
      const formattedQuiz = {
         id: quiz.id,
         title: quiz.title,
         description: quiz.description,
         timeLimit: quiz.timeLimit,
         createdAt: quiz.createdAt,
         questionCount: quiz._count.questions,
      };

      return NextResponse.json({ quiz: formattedQuiz });
   } catch (error) {
      console.error("Error fetching quiz details:", error);
      return NextResponse.json(
         { error: "Failed to fetch quiz details" },
         { status: 500 }
      );
   }
}
