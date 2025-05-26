import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      const quiz = await prisma.quiz.findUnique({
         where: { id },
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
