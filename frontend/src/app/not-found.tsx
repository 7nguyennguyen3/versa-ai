"use client";

import React from "react"; // Removed useState, FormEvent
import { Button } from "@/components/ui/button";
// Removed Input import
import { SearchX, Home, ArrowLeft } from "lucide-react"; // Removed Search icon
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NotFoundPage = () => {
  const router = useRouter();
  // Removed searchQuery state and handleSearch function

  // Animation variants (remain the same)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    // Use simpler background, center content vertically and horizontally
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 flex flex-col items-center justify-center text-center px-4 py-16">
      <motion.div
        className="max-w-lg w-full" // Controls content width
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div variants={itemVariants}>
          <SearchX
            className="h-20 w-20 md:h-24 md:w-24 mx-auto text-indigo-300 mb-6"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* 404 Indicator */}
        <motion.p
          variants={itemVariants}
          className="text-base font-semibold text-indigo-600 uppercase tracking-wide mb-2"
        >
          404 Error
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
        >
          Page Not Found
        </motion.h1>

        {/* Helper Text */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-10" // Increased margin-bottom slightly after removing search
        >
          Sorry, we couldn&apos;t find the page you were looking for. It might
          have been moved, deleted, or maybe the URL was mistyped.
        </motion.p>

        {/* Removed Search Bar Form */}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-base font-semibold rounded-md shadow-sm transition-all"
          >
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-3 text-base font-semibold rounded-md shadow-sm transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </motion.div>

        {/* Contact Link */}
        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-sm mt-12"
        >
          Still having trouble?{" "}
          <Link
            href="/contact" // Link to a contact page
            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
          >
            Contact Support
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
