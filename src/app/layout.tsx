import { AuthProvider } from "./providers";
import { ReactNode } from "react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Application",
  description: "Take interactive quizzes and test your knowledge",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}