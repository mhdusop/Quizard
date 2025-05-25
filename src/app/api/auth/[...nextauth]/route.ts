import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(prisma) as Adapter,
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               throw new Error("Email and password required");
            }

            const user = await prisma.user.findUnique({
               where: { email: credentials.email },
            });

            if (!user || !user.password) {
               throw new Error("User not found");
            }

            const passwordMatch = await bcrypt.compare(
               credentials.password,
               user.password
            );

            if (!passwordMatch) {
               throw new Error("Incorrect password");
            }

            return {
               id: user.id,
               name: user.name,
               email: user.email,
               role: user.role,
            };
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.role = user.role;
            token.id = user.id;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.role = token.role;
            session.user.id = token.id;
         }
         return session;
      },
   },
   session: {
      strategy: "jwt",
   },
   pages: {
      signIn: "/login",
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
