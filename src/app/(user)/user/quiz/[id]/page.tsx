import QuizDetailView from "@/views/user/quiz/QuizDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Detail Quiz | Quiz App",
   description: "Informasi detail tentang quiz yang akan dikerjakan",
};

export default function QuizDetailPage({ params }: { params: { id: string } }) {
   return <QuizDetailView id={params.id} />;
}