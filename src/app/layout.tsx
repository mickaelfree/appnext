import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppContent from "@/components/AppContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AppNext Learning Platform",
  description: "An optimized learning application with spaced repetition flashcards and shadow coding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-950`}
      >
        <main className="min-h-screen bg-background">
          <AppContent>
            {children}
          </AppContent>
        </main>
      </body>
    </html>
  );
}
