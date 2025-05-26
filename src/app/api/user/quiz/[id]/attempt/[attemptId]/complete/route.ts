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
      const { score, endedAt, completed } = body;

      if (score === undefined || !endedAt || completed === undefined) {
         return NextResponse.json(
            {
               error: "Skor, waktu selesai, dan status penyelesaian harus diisi",
            },
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
            { error: "Quiz attempt ini sudah selesai" },
            { status: 400 }
         );
      }

      const updatedAttempt = await prisma.quizAttempt.update({
         where: { id: attemptId },
         data: {
            score,
            endedAt: new Date(endedAt),
            completed,
         },
      });

      return NextResponse.json({
         success: true,
         attempt: updatedAttempt,
      });
   } catch (error) {
      console.error("Error completing quiz attempt:", error);
      return NextResponse.json(
         { error: "Gagal menyelesaikan quiz attempt" },
         { status: 500 }
      );
   }
}
