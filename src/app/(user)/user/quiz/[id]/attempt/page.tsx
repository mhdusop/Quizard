import QuizAttemptView from "@/views/user/quiz/quiz-attempt/QuizAttemptView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Mengerjakan Quiz | Quiz App",
   description: "Halaman untuk mengerjakan quiz",
};

export default function QuizAttemptPage({ params }: { params: { id: string } }) {
   return <QuizAttemptView id={params.id} />;
}
