import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
   req: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);
      const userId = session!.user.id;
      const quizId = params.id;

      const attempts = await prisma.quizAttempt.findMany({
         where: {
            userId,
            quizId,
            completed: true,
         },
         orderBy: {
            endedAt: "desc",
         },
         take: 5,
         select: {
            id: true,
            score: true,
            endedAt: true,
         },
      });

      const formattedAttempts = attempts.map((attempt) => ({
         id: attempt.id,
         score: attempt.score,
         completedAt:
            attempt.endedAt?.toISOString() || new Date().toISOString(),
      }));

      return NextResponse.json({ attempts: formattedAttempts });
   } catch (error) {
      console.error("Error fetching attempt history:", error);
      return NextResponse.json(
         { error: "Failed to fetch attempt history" },
         { status: 500 }
      );
   }
}

export async function POST(
   req: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);
      const userId = session!.user.id;
      const quizId = params.id;

      const quiz = await prisma.quiz.findUnique({
         where: { id: quizId },
         include: {
            _count: {
               select: { questions: true },
            },
         },
      });

      if (!quiz) {
         return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      if (quiz._count.questions === 0) {
         return NextResponse.json(
            { error: "This quiz doesn't have any questions yet" },
            { status: 400 }
         );
      }

      const incompleteAttempt = await prisma.quizAttempt.findFirst({
         where: {
            userId,
            quizId,
            completed: false,
         },
      });

      if (incompleteAttempt) {
         return NextResponse.json(
            { attempt: incompleteAttempt, resumed: true },
            { status: 200 }
         );
      }

      const attempt = await prisma.quizAttempt.create({
         data: {
            userId,
            quizId,
            startedAt: new Date(),
            completed: false,
         },
      });

      return NextResponse.json({ attempt, resumed: false }, { status: 201 });
   } catch (error) {
      console.error("Error starting quiz attempt:", error);
      return NextResponse.json(
         { error: "Failed to start quiz" },
         { status: 500 }
      );
   }
}
