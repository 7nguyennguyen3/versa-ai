import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Recursive } from "next/font/google";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const recursive = Recursive({
  variable: "--font-recursive",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chat & Document Assistant",
  description:
    "Upload documents and chat with them using AI. Create customizable AI chatbots tailored to your needs.",
};

export default function RootLayout({
  children,
  pathname,
}: Readonly<{
  children: React.ReactNode;
  pathname: string;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${recursive.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Toaster richColors />
        <SpeedInsights />
        <Footer />
      </body>
    </html>
  );
}
