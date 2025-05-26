import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const session = await getServerSession(authOptions);
      const resolvedParams = await params;
      const id = resolvedParams.id;

      if (!session?.user) {
         return NextResponse.json(
            { error: "Unauthorized. Please log in." },
            { status: 401 }
         );
      }

      const quizId = id;

      const questions = await prisma.question.findMany({
         where: { quizId },
         include: {
            options: true,
         },
         orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({ questions });
   } catch (error) {
      console.error("Error fetching questions:", error);
      return NextResponse.json(
         { error: "Failed to fetch questions" },
         { status: 500 }
      );
   }
}
