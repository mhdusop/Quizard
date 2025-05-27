// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user || session.user.role !== "ADMIN") {
         return NextResponse.json(
            { error: "Unauthorized. Admin access required." },
            { status: 401 }
         );
      }

      // Get query parameters
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const page = parseInt(url.searchParams.get("page") || "1");

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Build search filter

      // Fetch users
      const users = await prisma.user.findMany({
         orderBy: {
            createdAt: "desc",
         },
         skip,
         take: limit,
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
               select: {
                  attempts: true,
               },
            },
         },
      });

      // Count total for pagination
      const total = await prisma.user.count();

      const formattedUsers = users.map((user) => ({
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         createdAt: user.createdAt.toISOString(),
         attemptCount: user._count.attempts,
      }));

      return NextResponse.json({
         users: formattedUsers,
         pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
         },
      });
   } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
         { error: "Failed to fetch users" },
         { status: 500 }
      );
   }
}

// Create new user endpoint
export async function POST(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user || session.user.role !== "ADMIN") {
         return NextResponse.json(
            { error: "Unauthorized. Admin access required." },
            { status: 401 }
         );
      }

      const body = await req.json();
      const { name, email, password, role } = body;

      if (!name || !email || !password) {
         return NextResponse.json(
            { error: "Name, email, and password are required" },
            { status: 400 }
         );
      }

      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (existingUser) {
         return NextResponse.json(
            { error: "A user with this email already exists" },
            { status: 409 }
         );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            role: role || "USER",
         },
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
         },
      });

      return NextResponse.json({ user }, { status: 201 });
   } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
         { error: "Failed to create user" },
         { status: 500 }
      );
   }
}
