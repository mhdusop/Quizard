import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";

interface RegistrationSuccess {
   message: string;
   user: {
      id: string;
      name: string | null;
      email: string;
      role: Role;
      emailVerified: Date | null;
      createdAt: Date;
      updatedAt: Date;
   };
}

interface RegistrationError {
   error: string | z.ZodIssue[];
}

const userSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().email("Invalid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserRegistrationInput = z.infer<typeof userSchema>;

export async function POST(
   req: NextRequest
): Promise<NextResponse<RegistrationSuccess | RegistrationError>> {
   try {
      const body = await req.json();

      const validationResult = userSchema.safeParse(body);

      if (!validationResult.success) {
         return NextResponse.json(
            { error: validationResult.error.errors },
            { status: 400 }
         );
      }

      const { name, email, password }: UserRegistrationInput =
         validationResult.data;

      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (existingUser) {
         return NextResponse.json(
            { error: "Email already registered" },
            { status: 400 }
         );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            role: Role.USER,
         },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
         {
            message: "User registered successfully",
            user: userWithoutPassword,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
         error instanceof Error ? error.message : "Something went wrong";

      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
}
