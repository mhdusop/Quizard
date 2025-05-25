import { AuthProvider } from "./providers";
import { ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'

export const metadata: Metadata = {
  title: "Quiz Application",
  description: "Take interactive quizzes and test your knowledge",
}

const poppins = Poppins({
  weight: ['400'],
  subsets: ['latin']
})

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}