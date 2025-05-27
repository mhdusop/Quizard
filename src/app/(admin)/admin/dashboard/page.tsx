import AdminDashboardView from "@/views/admin/dashboard/AdminDashboardView";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Admin Dashboard | Quiz App",
   description: "Page for admin to manage quizzes and users",
}

export default function AdminDashboard() {
   return <AdminDashboardView />
}