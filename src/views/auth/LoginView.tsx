"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginView() {
   const router = useRouter();
   const searchParams = useSearchParams();

   const [isClient, setIsClient] = useState(false);
   const [justRegistered, setJustRegistered] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   useEffect(() => {
      setIsClient(true);
      setJustRegistered(searchParams.get("registered") === "true");
   }, [searchParams]);

   async function onSubmit(data: LoginFormValues) {
      setIsLoading(true);
      setError(null);

      try {
         const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
         });

         if (result?.error) {
            setError(result.error);
         } else {
            router.push("/dashboard");
            router.refresh();
         }
      } catch (error) {
         console.error(error);
         setError("An unexpected error occurred. Please try again.");
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
         <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
               <CardDescription className="text-center">
                  Enter your email and password to access your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               {/* Only show client-side elements when isClient is true */}
               {isClient && justRegistered && (
                  <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md mb-4 border border-green-200">
                     Account created successfully! You can now sign in.
                  </div>
               )}

               {isClient && error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                     {error}
                  </div>
               )}

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="name@example.com"
                                    {...field}
                                    type="email"
                                    autoComplete="email"
                                    disabled={isLoading}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="••••••••"
                                    type="password"
                                    {...field}
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                     >
                        {isLoading ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                           </>
                        ) : (
                           "Sign in"
                        )}
                     </Button>
                  </form>
               </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
               <div className="text-sm text-center text-muted-foreground">
                  Dont have an account?{" "}
                  <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
                     Sign up
                  </Link>
               </div>
            </CardFooter>
         </Card>
      </div>
   );
}