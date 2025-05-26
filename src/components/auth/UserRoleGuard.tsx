"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function UserRoleGuard({ children }: { children: React.ReactNode }) {
   const { data: session, status } = useSession();
   const router = useRouter();

   useEffect(() => {
      if (status === "loading") return;

      if (!session) {
         router.push("/auth/login");
      }
   }, [session, status, router]);

   if (status === "loading" || !session) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   return <>{children}</>;
}