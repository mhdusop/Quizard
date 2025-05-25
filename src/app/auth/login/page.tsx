import { LoginView } from "@/views/auth/LoginView"
import { Metadata } from "next"

export const metadata: Metadata = {
   title: "Login | Quiz App",
   description: "Login to your account to access your quizzes",
}

export default function LoginPage() {
   return <LoginView />
}