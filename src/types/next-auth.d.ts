import { Role } from "@prisma/client";
import "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
   interface User {
      id: string;
      role: Role;
   }

   interface Session {
      user: {
         id: string;
         name?: string | null;
         email?: string | null;
         image?: string | null;
         role: Role;
      };
   }
}

declare module "next-auth/jwt" {
   interface JWT extends NextAuthJWT {
      id: string;
      role: Role;
   }
}
