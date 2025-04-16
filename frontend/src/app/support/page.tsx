"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Added CardDescription
import { Input } from "@/components/ui/input"; // For search
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  LifeBuoy,
  Mail,
  MessageSquare,
  Search,
  Users,
} from "lucide-react"; // Added icons
import Link from "next/link";
import React from "react";

// Example support options data
const supportOptions = [
  {
    icon: BookOpen,
    title: "Knowledge Base & FAQs",
    description:
      "Find answers to common questions and learn how to use features in our comprehensive guides.",
    cta: "Search Docs & FAQs",
    href: "/kb", // Link to your knowledge base/FAQ page
    color: "text-blue-600",
  },
  {
    icon: Users,
    title: "Community Forum",
    description:
      "Ask questions, share tips, and connect with other users and our team.",
    cta: "Visit Community",
    href: "/community", // Link to your forum
    color: "text-purple-600",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description:
      "Chat directly with a support agent for real-time assistance (Pro & Premium plans).",
    cta: "Start Live Chat",
    href: "/chat-support", // Link to initiate chat
    color: "text-green-600",
  },
  {
    icon: Mail,
    title: "Email / Submit Ticket",
    description:
      "Send us a detailed message about your issue, and we'll get back to you via email.",
    cta: "Submit a Ticket",
    href: "/submit-ticket", // Link to your ticket submission form/page
    color: "text-orange-600",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const SupportPage = () => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("searchQuery");
    if (typeof query === "string" && query.trim()) {
      // Redirect to search results page for docs/faq
      window.location.href = `/kb/search?q=${encodeURIComponent(query.trim())}`; // Example search path
    }
  };

  return (
    // Consistent background, top alignment, padding
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center mt-20 lg:mt-0
    bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 py-16 md:py-24"
    >
      <div className="w-full max-w-4xl mx-auto text-center">
        {" "}
        {/* Adjusted max-width */}
        {/* Header */}
        <motion.div
          className="mb-10 md:mb-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <LifeBuoy
            className="h-12 w-12 mx-auto text-indigo-500 mb-4"
            strokeWidth={1.5}
          />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Support Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re here to help! Find answers quickly or connect with our
            team.
          </p>
        </motion.div>
        {/* Search Bar - Placeholder */}
        <motion.div
          className="w-full max-w-xl mx-auto mb-12 md:mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <Label htmlFor="support-search" className="sr-only">
              Search support articles
            </Label>
            <Input
              id="support-search"
              type="search"
              name="searchQuery" // Added name for form data
              placeholder="Search knowledge base & FAQs..."
              className="h-12 text-base pl-4 pr-12 rounded-full shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-indigo-600"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </motion.div>
        {/* Support Options Grid */}
        <motion.div
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {supportOptions.map((option) => (
            <motion.div key={option.title} variants={itemVariants}>
              <Card className="h-full shadow-md border border-gray-200/80 hover:shadow-lg transition-shadow duration-300 flex flex-col text-left">
                {" "}
                {/* Added text-left, h-full, flex */}
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`p-2 rounded-md bg-gradient-to-br ${option.color
                        .replace("text-", "from-")
                        .replace("-600", "-100")} ${option.color
                        .replace("text-", "to-")
                        .replace("-600", "-200")}`}
                    >
                      <option.icon
                        className={`w-5 h-5 ${option.color}`}
                        strokeWidth={2}
                      />
                    </span>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {option.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    asChild
                  >
                    <Link href={option.href}>
                      {option.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        {/* Removed the generic contact form from the bottom */}
      </div>
    </div>
  );
};

export default SupportPage;
