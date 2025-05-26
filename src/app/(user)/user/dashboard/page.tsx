
import UserDashboardView from "@/views/user/dashboard/UserDashboardView"
import { Metadata } from "next"

export const metadata: Metadata = {
   title: "User Dashboard | Quiz App",
   description: "Welcome to your user dashboard where you can manage your quizzes and profile.",
}

export default function UserDashboardPage() {
   return <UserDashboardView />
}