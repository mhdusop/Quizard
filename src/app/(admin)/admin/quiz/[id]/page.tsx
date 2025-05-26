import QuizDetailView from "@/views/admin/quiz/QuizDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Quiz Detail | Quiz App",
   description: "Page for create detail Quiz",
}

export default async function AdminQuizDetailPage({
   params
}: {
   params: Promise<{ id: string }>
}) {
   const resolvedParams = await params;
   return <QuizDetailView id={resolvedParams.id} />;
}