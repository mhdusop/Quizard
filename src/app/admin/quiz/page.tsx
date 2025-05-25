import QuizView from "@/views/quiz/QuizView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Quiz | Quiz App",
   description: "Create a new account to access the quiz app",
}

export default function QuizPage() {
   return <QuizView />
}