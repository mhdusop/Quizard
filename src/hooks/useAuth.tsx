"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@prisma/client";
import { UserAuth } from "@/types/user-auth";

interface UseAuthOptions {
   requireAuth?: boolean;
   requiredRole?: Role;
   redirectTo?: string;
}

type AuthStatus = "authenticated" | "loading" | "unauthenticated";

interface UseAuthReturn {
   user: UserAuth | undefined;
   status: AuthStatus;
   isAuthenticated: boolean;
   isLoading: boolean;
   hasRequiredRole: boolean;
   signOut: (options?: { callbackUrl?: string }) => Promise<void>;
}

export function useAuth({
   requireAuth = false,
   requiredRole,
   redirectTo = "/login",
}: UseAuthOptions = {}): UseAuthReturn {
   const { data: session, status } = useSession();
   const router = useRouter();

   const user = session?.user as UserAuth | undefined;
   const isLoading = status === "loading";
   const isAuthenticated = !!session?.user;
   const hasRequiredRole = requiredRole ? user?.role === requiredRole : true;

   useEffect(() => {
      if (isLoading) return;

      if (requireAuth && !isAuthenticated) {
         router.push(redirectTo);
      }

      if (requireAuth && requiredRole && !hasRequiredRole) {
         router.push("/unauthorized");
      }
   }, [
      isAuthenticated,
      isLoading,
      requireAuth,
      requiredRole,
      hasRequiredRole,
      router,
      redirectTo,
   ]);

   return {
      user,
      status,
      isAuthenticated,
      isLoading,
      hasRequiredRole,
      signOut,
   };
}