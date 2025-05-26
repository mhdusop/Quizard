import QuizDetailView from "@/views/admin/quiz/QuizDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Quiz Detail | Quiz App",
   description: "Page for create detail Quiz",
}

export default function QuizDetailPage({ params }: { params: { id: string } }) {
   return <QuizDetailView id={params.id} />
}