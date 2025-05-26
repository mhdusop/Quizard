import QuizAttemptView from "@/views/user/quiz/quiz-attempt/QuizAttemptView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Mengerjakan Quiz | Quiz App",
   description: "Halaman untuk mengerjakan quiz",
};

export default async function QuizAttemptPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   return <QuizAttemptView id={resolvedParams.id} />;
}
