"use client";

import React from "react";
// --- Ensure all imports are correct and components exist ---
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  FileSearch,
  Bot,
  BrainCircuit,
  Combine,
  Link as LinkIcon,
  UploadCloud,
  Lock,
  MessageSquare,
  ListChecks,
  Table2,
  ShieldCheck,
  Cloud,
  FileText,
  Target,
  UserPlus,
  // Removed Settings, DatabaseZap as they weren't used in the final JSX structure provided
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
// --- End Imports Check ---

// --- Animation Variants --- (Remain the same)
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};
const visualContainerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};
const iconItemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};
const textVariantsLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};
const textVariantsRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

const FeaturesPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 pt-20 pb-16 md:pt-28 md:pb-24 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto mt-20">
        {/* --- Hero Section --- (Uses animate, should be fine) */}
        <motion.section className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1 rounded-full mb-4"
          >
            {" "}
            Platform Features{" "}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
          >
            {" "}
            Unlock Document Intelligence{" "}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            {" "}
            Explore the powerful AI features designed to help you understand,
            analyze, and interact with your documents faster and more
            effectively than ever before.{" "}
          </motion.p>
        </motion.section>

        {/* --- Feature 1: Conversational Q&A --- */}
        <motion.section
          className="mb-20 md:mb-28"
          initial="hidden"
          animate="visible" // Trigger on mount/load
          variants={sectionVariants}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} // Added delay after hero
        >
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Text Content */}
            <motion.div variants={textVariantsLeft}>
              <Badge
                variant="outline"
                className="mb-3 border-indigo-300 text-indigo-700"
              >
                Interaction
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Chat Naturally with Any Document
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {" "}
                Stop searching, start asking. Engage in natural language
                conversations...{" "}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {" "}
                {/* ... list items ... */}{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Get direct answers...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Understand complex topics...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Supports multiple languages...
                </li>{" "}
              </ul>
              <Button
                variant="link"
                asChild
                className="mt-6 px-0 text-indigo-600"
              >
                <Link href="/chat/demo">
                  Try the Chat Demo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            {/* Visual Placeholder */}
            <motion.div
              variants={visualContainerVariants}
              className="relative mt-8 lg:mt-0 aspect-[4/3] bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg shadow-lg flex items-center justify-center p-8 overflow-hidden"
            >
              {/* ... icons ... */}{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[20%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <FileSearch
                  className="w-10 h-10 text-blue-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute bottom-[20%] left-[40%] transform -translate-x-1/2 translate-y-1/2 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <MessageSquare
                  className="w-12 h-12 text-purple-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[35%] right-[20%] transform translate-x-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <Bot
                  className="w-10 h-10 text-green-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <div className="absolute w-40 h-40 bg-blue-200/30 rounded-full blur-2xl -z-10 top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/4"></div>{" "}
            </motion.div>
          </div>
        </motion.section>

        {/* --- Feature 2: Intelligent Analysis --- */}
        <motion.section
          className="mb-20 md:mb-28"
          initial="hidden"
          animate="visible" // Trigger on mount/load
          variants={sectionVariants}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }} // Added slightly longer delay
        >
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Visual Placeholder */}
            <motion.div
              variants={visualContainerVariants}
              className="order-last lg:order-first mt-8 lg:mt-0 aspect-[4/3] bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg shadow-lg flex items-center justify-center p-8 overflow-hidden relative"
            >
              {/* ... icons ... */}{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[25%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <BrainCircuit
                  className="w-12 h-12 text-purple-600"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute bottom-[25%] right-[20%] transform translate-x-1/2 translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <ListChecks
                  className="w-10 h-10 text-teal-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute bottom-[30%] left-[45%] transform -translate-x-1/2 translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <Table2
                  className="w-9 h-9 text-orange-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <div className="absolute w-40 h-40 bg-purple-200/30 rounded-full blur-2xl -z-10 top-1/4 right-1/4"></div>{" "}
            </motion.div>
            {/* Text Content */}
            <motion.div
              variants={textVariantsRight}
              className="order-first lg:order-last"
            >
              <Badge
                variant="outline"
                className="mb-3 border-purple-300 text-purple-700"
              >
                Analysis
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Instant Summaries & Deep Insights
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {" "}
                Save hours of reading. Our AI identifies and extracts the most
                critical information...{" "}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {" "}
                {/* ... list items ... */}{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Automatic summarization...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Identify key entities...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Extract structured data...
                </li>{" "}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* --- Feature 3: Multi-Document & Source Linking --- */}
        <motion.section
          className="mb-20 md:mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // REMOVED once: true
          // viewport={{ amount: 0.2 }} // FIXED: Removed once: true
          variants={sectionVariants}
        >
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Text Content */}
            <motion.div variants={textVariantsLeft}>
              <Badge
                variant="outline"
                className="mb-3 border-green-300 text-green-700"
              >
                Context & Trust
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Analyze Across Documents & Verify Sources
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {" "}
                Don&apos;t just analyze one document at a time. Ask questions
                across multiple files...{" "}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {" "}
                {/* ... list items ... */}{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Upload and chat...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Compare and contrast...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Clickable citations...
                </li>{" "}
              </ul>
            </motion.div>
            {/* Visual Placeholder */}
            <motion.div
              variants={visualContainerVariants}
              className="relative mt-8 lg:mt-0 aspect-[4/3] bg-gradient-to-br from-green-50 to-sky-100 rounded-lg shadow-lg flex items-center justify-center p-8 overflow-hidden"
            >
              {" "}
              {/* ... icons ... */}{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[50%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <Combine
                  className="w-12 h-12 text-green-600"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[30%] right-[25%] transform translate-x-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <FileText
                  className="w-9 h-9 text-blue-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute bottom-[25%] right-[40%] transform translate-x-1/2 translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <LinkIcon
                  className="w-10 h-10 text-red-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <div className="absolute w-36 h-36 bg-green-200/30 rounded-full blur-2xl -z-10 bottom-1/4 left-1/4"></div>{" "}
            </motion.div>
          </div>
        </motion.section>

        {/* --- Feature 4: Workflow & Security --- */}
        <motion.section
          className="mb-20 md:mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // REMOVED once: true
          // viewport={{ amount: 0.2 }} // FIXED: Removed once: true
          variants={sectionVariants}
        >
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Visual Placeholder */}
            <motion.div
              variants={visualContainerVariants}
              className="order-last lg:order-first mt-8 lg:mt-0 aspect-[4/3] bg-gradient-to-br from-slate-100 to-gray-200 rounded-lg shadow-lg flex items-center justify-center p-8 overflow-hidden relative"
            >
              {/* ... icons ... */}{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[30%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <UploadCloud
                  className="w-10 h-10 text-sky-600"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute bottom-[25%] left-[55%] transform -translate-x-1/2 translate-y-1/2 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <Cloud
                  className="w-12 h-12 text-blue-500"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute top-[45%] right-[20%] transform translate-x-1/2 -translate-y-1/2 p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <Lock
                  className="w-10 h-10 text-slate-600"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <motion.div
                variants={iconItemVariants}
                className="absolute bottom-[40%] right-[45%] transform translate-x-1/2 translate-y-1/2 p-2 bg-white/70 backdrop-blur-sm rounded-lg shadow"
              >
                {" "}
                <ShieldCheck
                  className="w-8 h-8 text-green-600"
                  strokeWidth={1.5}
                />{" "}
              </motion.div>{" "}
              <div className="absolute w-32 h-32 bg-gray-300/30 rounded-full blur-2xl -z-10 top-1/3 right-1/4"></div>{" "}
            </motion.div>
            {/* Text Content */}
            <motion.div
              variants={textVariantsRight}
              className="order-first lg:order-last"
            >
              <Badge
                variant="outline"
                className="mb-3 border-gray-300 text-gray-700"
              >
                Efficiency & Trust
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Seamless Workflow & Robust Security
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {" "}
                Easily upload documents via drag-and-drop or connect cloud
                storage (soon!)...{" "}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                {" "}
                {/* ... list items ... */}{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Simple drag-and-drop...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Google Drive / Dropbox...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  OCR support...
                </li>{" "}
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                  Strict data privacy...
                </li>{" "}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* --- Final CTA Section --- */}
        <motion.section
          className="mt-20 md:mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // REMOVED once: true
          // viewport={{ amount: 0.3 }} // FIXED: Removed once: true
          variants={sectionVariants}
        >
          <Card className="relative overflow-hidden rounded-xl border-none shadow-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
            <CardContent className="relative z-10 p-10 md:p-12 flex flex-col items-center text-center">
              <div className="mb-5 p-3 bg-white/10 rounded-full">
                {" "}
                <Target
                  className="h-9 w-9 text-indigo-300"
                  strokeWidth={1.5}
                />{" "}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                {" "}
                Ready to Boost Your Productivity?{" "}
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                {" "}
                Explore these features firsthand. See how Versa AI can transform
                your document workflows today.{" "}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-indigo-700 hover:bg-gray-200 border-transparent px-7 py-3 rounded-md text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group"
                >
                  <Link href="/chat/demo" passHref>
                    {" "}
                    <span className="flex items-center justify-center">
                      {" "}
                      Try Live Demo{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{" "}
                    </span>{" "}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent text-white border-white/40 hover:border-white/80 hover:bg-white/10 px-7 py-3 rounded-md text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group"
                >
                  <Link href="/auth/signup" passHref>
                    {" "}
                    <span className="flex items-center justify-center">
                      {" "}
                      Sign Up Free{" "}
                      <UserPlus className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />{" "}
                    </span>{" "}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default FeaturesPage;
