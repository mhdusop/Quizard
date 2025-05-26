import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
   try {
      // Fetch quizzes with question count
      const quizzes = await prisma.quiz.findMany({
         select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            _count: {
               select: {
                  questions: true,
               },
            },
         },
      });

      // Format the response
      const formattedQuizzes = quizzes.map((quiz) => ({
         id: quiz.id,
         title: quiz.title,
         description: quiz.description,
         timeLimit: quiz.timeLimit,
         questionCount: quiz._count.questions,
      }));

      return NextResponse.json({ quizzes: formattedQuizzes });
   } catch (error) {
      console.error("Error fetching quizzes:", error);
      return NextResponse.json(
         { error: "Gagal mengambil data quiz" },
         { status: 500 }
      );
   }
}
