"use client";

import { motion } from "framer-motion";
import { Bot, FileText, UploadCloud } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Bot className="h-12 w-12 text-blue-600" />,
      title: "AI-Powered Chat",
      description:
        "Interact with your documents using natural language and get instant answers.",
    },
    {
      icon: <FileText className="h-12 w-12 text-green-600" />,
      title: "Document Insights",
      description:
        "Extract key insights, summaries, and actionable data from any document.",
    },
    {
      icon: <UploadCloud className="h-12 w-12 text-purple-600" />,
      title: "Easy Upload",
      description:
        "Upload PDFs, Word documents, and more in just a few clicks.",
    },
  ];

  return (
    <section className="max-w-6xl w-full py-16 px-6 mx-auto">
      <motion.h2
        className="text-4xl font-extrabold text-blue-900 mb-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ✨ Key Features
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
