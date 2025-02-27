import type { Metadata } from "next";
import { Geist, Geist_Mono, Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        {/* Hide Footer on the chat page */}
        {pathname !== "/chat" && <Footer />}
      </body>
    </html>
  );
}
