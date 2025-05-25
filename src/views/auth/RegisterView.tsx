"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"

const registerSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().email("Please enter a valid email address"),
   password: z.string().min(6, "Password must be at least 6 characters"),
   confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords do not match",
   path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterView() {
   const router = useRouter()
   const [error, setError] = useState<string | null>(null)
   const [isLoading, setIsLoading] = useState(false)

   const form = useForm<RegisterFormValues>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   })

   async function onSubmit(data: RegisterFormValues) {
      setIsLoading(true)
      setError(null)

      try {
         const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name: data.name,
               email: data.email,
               password: data.password,
            }),
         })

         const responseData = await response.json()

         if (!response.ok) {
            throw new Error(responseData.error || "Registration failed")
         }

         router.push("/auth/login?registered=true")
      } catch (error) {
         console.error(error);
         setError("Something went wrong. Please try again.")
         setIsLoading(false)
      }
   }

   return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
         <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
               <CardDescription className="text-center">
                  Fill in the form below to create your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                     {error}
                  </div>
               )}

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="John Doe"
                                    {...field}
                                    disabled={isLoading}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="••••••••"
                                    type="password"
                                    {...field}
                                    autoComplete="new-password"
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
                              Creating account...
                           </>
                        ) : (
                           "Create account"
                        )}
                     </Button>
                  </form>
               </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
               <div className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                     Sign in
                  </Link>
               </div>
            </CardFooter>
         </Card>
      </div>
   )
}