import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const resolvedParams = await params;
      const id = resolvedParams.id;

      const quiz = await prisma.quiz.findUnique({
         where: { id },
         include: {
            questions: {
               include: {
                  options: true,
               },
            },
         },
      });

      if (!quiz) {
         return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      return NextResponse.json({ quiz });
   } catch (error) {
      console.error("Error fetching quiz:", error);
      return NextResponse.json(
         { error: "Failed to fetch quiz" },
         { status: 500 }
      );
   }
}
