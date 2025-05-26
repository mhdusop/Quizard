import QuizDetailView from "@/views/user/quiz/quiz-detail/QuizDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Detail Quiz | Quiz App",
   description: "Informasi detail tentang quiz yang akan dikerjakan",
};

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   return <QuizDetailView id={resolvedParams.id} />;
}