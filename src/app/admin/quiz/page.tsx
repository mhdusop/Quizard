import QuizView from "@/views/quiz/QuizView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Quiz | Quiz App",
   description: "Page for create Quiz",
}

export default function QuizPage() {
   return <QuizView />
}