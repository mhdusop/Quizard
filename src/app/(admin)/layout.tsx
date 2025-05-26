import { ReactNode } from "react";
import { AuthProvider } from "../providers";
import AdminNavbar from "@/components/base/AdminNavbar";


export default function AdminLayout({ children }: { children: ReactNode }) {
   return (
      <AuthProvider>
         <div className="flex flex-col w-full">
            <AdminNavbar />
            <main className="flex-1 px-16 py-6">{children}</main>
         </div>
      </AuthProvider>
   );
}