import UserQuizView from "@/views/user/quiz/UserQuizView"
import { Metadata } from "next"

export const metadata: Metadata = {
   title: "User Quiz | Quiz App",
   description: "Manage your quizzes and track your progress in the user quiz section.",
}

export default function UserQuizPage() {
   return <UserQuizView />
}