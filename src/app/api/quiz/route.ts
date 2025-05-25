import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const createQuizSchema = z.object({
   title: z.string().min(1, "Title is required"),
   description: z.string().optional(),
   timeLimit: z.number().min(1, "Time limit must be at least 1 second"),
});

type CreateQuizInput = z.infer<typeof createQuizSchema>;

export async function GET() {
   try {
      const quizzes = await prisma.quiz.findMany({
         select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            questions: {
               select: {
                  id: true,
               },
            },
         },
      });

      const quizzesWithQuestionCount = quizzes.map((quiz) => ({
         ...quiz,
         questionCount: quiz.questions.length,
      }));

      return NextResponse.json({ quizzes: quizzesWithQuestionCount });
   } catch (error) {
      console.error("Error fetching quizzes:", error);
      return NextResponse.json(
         { error: "Failed to fetch quizzes" },
         { status: 500 }
      );
   }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
         return NextResponse.json(
            { error: "Unauthorized. Please log in." },
            { status: 401 }
         );
      }

      const body = await req.json();
      const validatedData: CreateQuizInput = createQuizSchema.parse(body);

      const { title, description, timeLimit } = validatedData;

      const userId = session.user.id;

      const quiz = await prisma.quiz.create({
         data: {
            title,
            description,
            timeLimit,
            userId,
         },
      });

      return NextResponse.json({ quiz }, { status: 201 });
   } catch (error) {
      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: error.errors.map((e) => e.message) },
            { status: 400 }
         );
      }

      console.error("Error creating quiz:", error);
      return NextResponse.json(
         { error: "An unexpected error occurred" },
         { status: 500 }
      );
   }
}
