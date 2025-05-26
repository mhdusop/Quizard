import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
   req: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      if (!params.id) {
         return NextResponse.json(
            { error: "ID pertanyaan tidak valid" },
            { status: 400 }
         );
      }

      const question = await prisma.question.findUnique({
         where: { id: params.id },
      });

      if (!question) {
         return NextResponse.json(
            { error: "Pertanyaan tidak ditemukan" },
            { status: 404 }
         );
      }

      await prisma.question.delete({
         where: { id: params.id },
      });

      return NextResponse.json({ message: "Pertanyaan berhasil dihapus" });
   } catch (error) {
      console.error("Error menghapus pertanyaan:", error);
      return NextResponse.json(
         { error: "Gagal menghapus pertanyaan" },
         { status: 500 }
      );
   }
}
