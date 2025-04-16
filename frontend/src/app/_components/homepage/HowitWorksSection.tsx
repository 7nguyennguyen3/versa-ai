"use client";

import { motion } from "framer-motion";
import { UploadCloud, MessageCircleQuestion, Sparkles } from "lucide-react";
import React from "react";

const steps = [
  {
    id: 1,
    icon: UploadCloud,
    title: "Upload Your Document",
    description:
      "Securely upload PDFs, Word docs, or even scanned images. We support various formats.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    icon: MessageCircleQuestion,
    title: "Ask Anything",
    description:
      "Interact using natural language. Ask specific questions, request summaries, or compare information.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Get Instant Insights",
    description:
      "Receive AI-powered answers, data extractions, and analyses in seconds, complete with source links.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

// Container variant controls staggering of children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Time between each child animating in
      delayChildren: 0.2, // Delay before the first child starts
    },
  },
};

// Item variant for individual steps
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HowItWorksSection = () => {
  return (
    <section className="w-full bg-white py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header Animation - Use animate instead of whileInView */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }} // CHANGED
          // Removed viewport prop
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Get Started in 3 Simple Steps
        </motion.h2>
        {/* Paragraph Animation - Use animate instead of whileInView */}
        <motion.p
          className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }} // CHANGED
          // Removed viewport prop
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }} // Keep delay relative to h2
        >
          Transforming documents into knowledge has never been easier. Follow
          our straightforward process.
        </motion.p>

        {/* Grid Container Animation - Use animate, variants handle children */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible" // CHANGED from whileInView
          // Removed viewport prop
        >
          {/* Optional: Dashed connecting line (remains the same) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 mt-[-10px] -z-10">
            {/* ... svg line code ... */}
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {" "}
              <line
                x1="16.66%"
                y1="50%"
                x2="83.33%"
                y2="50%"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="8 8"
              />{" "}
            </svg>
          </div>

          {/* Map items - they inherit animation trigger from parent */}
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center p-6 rounded-lg z-0"
              variants={itemVariants} // Define how each item animates
              // No need for initial/animate here, inherits from parent via variants
            >
              <div
                className={`p-4 rounded-full ${step.bgColor} mb-5 ring-8 ring-white`}
              >
                <step.icon className={`h-8 w-8 ${step.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {" "}
                {step.title}{" "}
              </h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
