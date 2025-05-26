import { ReactNode } from "react";
import { AuthProvider } from "../providers";
import UserNavbar from "@/components/base/UserNavbar";


export default function UserLayout({ children }: { children: ReactNode }) {
   return (
      <AuthProvider>
         <div className="flex flex-col w-full">
            <UserNavbar />
            <main className="flex-1 px-16 py-6">{children}</main>
         </div>
      </AuthProvider>
   );
}