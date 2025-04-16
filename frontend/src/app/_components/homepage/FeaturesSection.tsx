"use client";

import { motion } from "framer-motion";
import { Bot, FileText, Upload, Zap } from "lucide-react";
import { JSX } from "react";
import FeatureCard from "./FeatureCard";

type FeatureColor = "blue" | "green" | "purple" | "orange";

// Define the structure for a feature item
interface FeatureItem {
  icon: JSX.Element;
  title: string;
  description: string;
  color: FeatureColor; // Use the specific type here
}

// Define the features array with the specific type
const features: readonly FeatureItem[] = [
  // Add readonly and FeatureItem[] type annotation
  {
    icon: <Bot className="h-10 w-10 text-blue-600" />,
    title: "AI-Powered Chat",
    description:
      "Interact with your documents using natural language. Get instant answers and summaries.",
    color: "blue",
  },
  {
    icon: <FileText className="h-10 w-10 text-green-600" />,
    title: "Deep Document Insights",
    description:
      "Extract key information, entities, and actionable data points effortlessly.",
    color: "green",
  },
  {
    icon: <Upload className="h-10 w-10 text-purple-600" />,
    title: "Simple & Secure Upload",
    description:
      "Easily upload PDFs, Word docs, and more. Your data remains confidential.",
    color: "purple",
  },
  {
    icon: <Zap className="h-10 w-10 text-orange-500" />,
    title: "Blazing Fast Analysis",
    description:
      "Our optimized AI processes documents quickly, saving you valuable time.",
    color: "orange",
  },
] as const; // <--- Add 'as const' here

// Animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger animation of children
      delayChildren: 0.3,
    },
  },
};

const FeaturesSection = () => {
  return (
    <section
      className="w-full max-w-7xl py-20 md:py-28 px-6 mx-auto 
    bg-gradient-to-br from-sky-50/50 via-white to-indigo-100/50 
    rounded-b-[3rem] md:rounded-b-[4rem] mb-10 md:mb-16"
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }} // Animate when in view
        viewport={{ once: true, amount: 0.5 }} // Trigger animation once
        transition={{ duration: 0.6 }}
      >
        Why Choose Our AI Assistant?
      </motion.h2>
      <motion.p
        className="text-lg text-gray-600 mb-16 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Go beyond simple search. Understand your documents like never before
        with intelligent features designed for efficiency.
      </motion.p>

      {/* Apply container variants for staggered animation */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" // Animate when the grid comes into view
        viewport={{ once: true, amount: 0.2 }} // Trigger slightly earlier
      >
        {features.map((feature, index) => (
          // Now TypeScript knows feature.color is one of the allowed literal types
          <FeatureCard key={index} {...feature} />
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
