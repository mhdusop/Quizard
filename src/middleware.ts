import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
   const authPaths = ["/dashboard", "/quiz"];

   const isAuthPath = authPaths.some((path) =>
      req.nextUrl.pathname.startsWith(path)
   );

   const adminPaths = ["/admin"];
   const isAdminPath = adminPaths.some((path) =>
      req.nextUrl.pathname.startsWith(path)
   );

   if (isAdminPath && (!token || token.role !== "ADMIN")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
   }

   if (isAuthPath && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
   }

   if (
      (req.nextUrl.pathname === "/login" ||
         req.nextUrl.pathname === "/register") &&
      token
   ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      "/dashboard/:path*",
      "/admin/:path*",
      "/quiz/:path*",
      "/login",
      "/register",
   ],
};
