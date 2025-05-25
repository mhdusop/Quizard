import { ReactNode } from "react";
import { AuthProvider } from "../providers";
import NavbarComponent from "@/components/base/NavbarComponent";


export default function AdminLayout({ children }: { children: ReactNode }) {
   return (
      <AuthProvider>
         <div className="flex flex-col w-full">
            <NavbarComponent />
            <main className="flex-1 px-16 py-6">{children}</main>
         </div>
      </AuthProvider>
   );
}