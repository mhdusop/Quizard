import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               throw new Error("Email dan password diperlukan");
            }

            const user = await prisma.user.findUnique({
               where: {
                  email: credentials.email,
               },
            });

            if (!user || !user.password) {
               throw new Error("Email atau password tidak valid");
            }

            const isPasswordMatch = await bcrypt.compare(
               credentials.password,
               user.password
            );

            if (!isPasswordMatch) {
               throw new Error("Email atau password tidak valid");
            }

            return user;
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id;
            token.role = user.role;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.id;
            session.user.role = token.role;
         }
         return session;
      },
   },
   pages: {
      signIn: "/login",
      error: "/login",
      newUser: "/dashboard",
   },
   session: {
      strategy: "jwt",
   },
   secret: process.env.NEXTAUTH_SECRET,
};
