import type { Role } from "@prisma/client";

export interface UserAuth {
   id: string;
   name?: string | null;
   email: string;
   role: Role;
}
