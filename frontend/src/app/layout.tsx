import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Recursive } from "next/font/google";
import Navbar from "./_components/Navbar";
import "./globals.css";
import { LayoutProvider } from "./LayoutProvider";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${recursive.variable} antialiased`}
      >
        <Navbar />
        <LayoutProvider>{children}</LayoutProvider>
        <Toaster richColors />
        <SpeedInsights />
      </body>
    </html>
  );
}
