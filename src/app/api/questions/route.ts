import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
   try {
      const body = await req.json();
      const { quizId, content, options } = body;

      if (!quizId || !content || !options || !Array.isArray(options)) {
         return NextResponse.json(
            {
               error: "Invalid input. Please provide quizId, content, and options.",
            },
            { status: 400 }
         );
      }

      // Tambahkan tipe pertanyaan (type)
      const question = await prisma.question.create({
         data: {
            content,
            quizId,
            type: "multiple_choice", // Menambahkan field 'type' yang dibutuhkan
            options: {
               create: options.map(
                  (option: { content: string; isCorrect: boolean }) => ({
                     content: option.content,
                     isCorrect: option.isCorrect,
                  })
               ),
            },
         },
      });

      return NextResponse.json({ question }, { status: 201 });
   } catch (error) {
      console.error("Error creating question:", error);
      return NextResponse.json(
         { error: "Failed to create question" },
         { status: 500 }
      );
   }
}
