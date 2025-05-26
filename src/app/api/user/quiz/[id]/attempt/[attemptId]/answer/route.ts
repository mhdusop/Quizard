import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
   req: NextRequest,
   { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
         return NextResponse.json(
            { error: "Silakan login terlebih dahulu" },
            { status: 401 }
         );
      }

      const userId = session.user.id;

      const { id: quizId, attemptId } = await params;

      const body = await req.json();
      const { questionId, selectedOptionId, isCorrect } = body;

      if (!questionId || selectedOptionId === undefined) {
         return NextResponse.json(
            { error: "ID pertanyaan dan opsi yang dipilih harus diisi" },
            { status: 400 }
         );
      }

      const attempt = await prisma.quizAttempt.findUnique({
         where: { id: attemptId },
      });

      if (!attempt) {
         return NextResponse.json(
            { error: "Quiz attempt tidak ditemukan" },
            { status: 404 }
         );
      }

      if (attempt.userId !== userId) {
         return NextResponse.json(
            {
               error: "Anda tidak memiliki izin untuk memodifikasi attempt ini",
            },
            { status: 403 }
         );
      }

      if (attempt.quizId !== quizId) {
         return NextResponse.json(
            { error: "ID quiz tidak sesuai dengan quiz attempt" },
            { status: 400 }
         );
      }

      if (attempt.completed) {
         return NextResponse.json(
            {
               error: "Tidak dapat memodifikasi quiz attempt yang sudah selesai",
            },
            { status: 400 }
         );
      }

      const existingAnswer = await prisma.answer.findFirst({
         where: {
            questionId,
            attemptId,
         },
      });

      let answer;

      if (existingAnswer) {
         answer = await prisma.answer.update({
            where: { id: existingAnswer.id },
            data: {
               selectedOptionId,
               isCorrect,
            },
         });
      } else {
         answer = await prisma.answer.create({
            data: {
               questionId,
               selectedOptionId,
               isCorrect,
               attemptId,
            },
         });
      }

      return NextResponse.json({ answer });
   } catch (error) {
      console.error("Error saving answer:", error);
      return NextResponse.json(
         { error: "Gagal menyimpan jawaban" },
         { status: 500 }
      );
   }
}
