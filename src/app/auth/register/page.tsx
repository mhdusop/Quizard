import { RegisterView } from "@/views/auth/RegisterView"
import { Metadata } from "next"

export const metadata: Metadata = {
   title: "Register | Quiz App",
   description: "Create a new account to access the quiz app",
}

export default function RegisterPage() {
   return <RegisterView />
}