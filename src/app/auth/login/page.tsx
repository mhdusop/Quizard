import { LoginView } from "@/views/auth/LoginView"
import { Metadata } from "next"
import { Suspense } from "react";

export const metadata: Metadata = {
   title: "Login | Quiz App",
   description: "Login to your account to access your quizzes",
}

export default function LoginPage() {
   return (
      <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
         <LoginView />
      </Suspense>
   );
}