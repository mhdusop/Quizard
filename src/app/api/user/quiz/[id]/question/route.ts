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

      if (!session?.user) {
         return NextResponse.json(
            { error: "Unauthorized. Please log in." },
            { status: 401 }
         );
      }

      const quizId = params.id;

      // Fetch questions for the quiz
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
