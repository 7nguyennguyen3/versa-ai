"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Search,
  UploadCloud,
  Table2,
  Combine, // <-- Added new icons
} from "lucide-react";
import Link from "next/link";

// Animation Variants (remain the same)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Slightly faster stagger for more icons
      delayChildren: 0.4,
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 150, damping: 12 },
  },
};

const HeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-sky-50/70 via-white to-indigo-100/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Text Content (Remains the same) */}
        <motion.div
          className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          {/* ... (h1, p, button code remains the same) ... */}
          <h1
            className="text-3xl font-extrabold tracking-tight text-gray-900 
          sm:text-4xl md:text-5xl mb-6" // Adjusted font sizes for consistency from snippet
          >
            Go Beyond Chat{" "}
            <span className="block ml-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Master Your Documents
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-10">
            Instantly chat, analyze, compare, extract data, and verify
            information across single or multiple documents with powerful,
            trustworthy AI.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <Link href="/chat/demo" passHref>
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <span>
                  Try Live Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Enhanced Visual Composition with More Icons */}
        <motion.div
          className="lg:col-span-6 xl:col-span-6 mt-16 lg:mt-0 flex items-center justify-center relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Container for the icons */}
          <motion.div
            className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] rounded-full bg-white/60 backdrop-blur-lg shadow-xl border border-white/50 flex items-center justify-center" // Slightly larger container
            variants={containerVariants}
          >
            {/* Positioned & Animated Icons (Original 5 + 3 New) */}
            {/* Icon 1: Document (Top-Left) */}
            <motion.div
              variants={iconVariants}
              className="absolute top-[18%] left-[18%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-blue-100/80 rounded-lg shadow-sm"
            >
              <FileText
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Icon 2: Chat/Question (Bottom-Left) */}
            <motion.div
              variants={iconVariants}
              className="absolute bottom-[30%] left-[40%] transform -translate-x-1/2 translate-y-1/2 p-3 bg-purple-100/80 rounded-lg shadow-sm"
            >
              <MessageSquare
                className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Icon 3: AI/Insight (Top-Right) */}
            <motion.div
              variants={iconVariants}
              className="absolute top-[25%] right-[15%] transform translate-x-1/2 -translate-y-1/2 p-4 bg-green-100/80 rounded-lg shadow-sm"
            >
              <Sparkles
                className="w-10 h-10 sm:w-12 sm:h-12 text-green-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Icon 4: Link/Source (Bottom-Center) */}
            <motion.div
              variants={iconVariants}
              className="absolute bottom-[10%] right-[50%] transform translate-x-1/2 translate-y-1/2 p-2 bg-red-100/80 rounded-lg shadow-sm"
            >
              <LinkIcon
                className="w-7 h-7 sm:w-8 sm:h-8 text-red-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Icon 5: Search/Find (Mid-Left) */}
            <motion.div
              variants={iconVariants}
              className="absolute top-[55%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-yellow-100/80 rounded-lg shadow-sm"
            >
              <Search
                className="w-8 h-8 sm:w-9 sm:h-9 text-yellow-700"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* === NEW ICONS === */}
            {/* Icon 6: Upload (Top-Center) */}
            <motion.div
              variants={iconVariants}
              className="absolute top-[8%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-sky-100/80 rounded-lg shadow-sm"
            >
              <UploadCloud
                className="w-9 h-9 sm:w-11 sm:h-11 text-sky-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Icon 7: Structured Data (Mid-Right) */}
            <motion.div
              variants={iconVariants}
              className="absolute top-[60%] right-[8%] transform translate-x-1/2 -translate-y-1/2 p-3 bg-orange-100/80 rounded-lg shadow-sm"
            >
              <Table2
                className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Icon 8: Multi-Document (Bottom-Right) */}
            <motion.div
              variants={iconVariants}
              className="absolute bottom-[50%] right-[42%] transform translate-x-1/2 translate-y-1/2 p-2.5 bg-teal-100/80 rounded-lg shadow-sm"
            >
              <Combine
                className="w-8 h-8 sm:w-9 sm:h-9 text-teal-600"
                strokeWidth={1.5}
              />
            </motion.div>
            {/* Subtle background elements (optional) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-50"></div>
            <div className="absolute w-2/3 h-2/3 rounded-full bg-indigo-200/30 blur-3xl opacity-70"></div>{" "}
            {/* Slightly stronger blur */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
