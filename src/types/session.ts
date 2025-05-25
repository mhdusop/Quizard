import { UserAuth } from "./user-auth";

export interface Session {
   user: UserAuth;
   expires: string;
}
