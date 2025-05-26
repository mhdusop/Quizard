// app/api/user/quiz/[id]/attempt/[attemptId]/answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

      // Await params before accessing properties
      const { id: quizId, attemptId } = await params;

      // Parse request body
      const body = await req.json();
      const { questionId, selectedOptionId, isCorrect } = body;

      // Validasi input
      if (!questionId || selectedOptionId === undefined) {
         return NextResponse.json(
            { error: "ID pertanyaan dan opsi yang dipilih harus diisi" },
            { status: 400 }
         );
      }

      // Periksa apakah attempt ada dan milik user yang sedang login
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

      // Verifikasi bahwa attempt ini adalah untuk quiz yang dimaksud
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

      // Periksa apakah jawaban untuk pertanyaan ini sudah ada
      const existingAnswer = await prisma.answer.findFirst({
         where: {
            questionId,
            attemptId,
         },
      });

      let answer;

      if (existingAnswer) {
         // Update jawaban yang sudah ada
         answer = await prisma.answer.update({
            where: { id: existingAnswer.id },
            data: {
               selectedOptionId,
               isCorrect,
            },
         });
      } else {
         // Buat jawaban baru
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
