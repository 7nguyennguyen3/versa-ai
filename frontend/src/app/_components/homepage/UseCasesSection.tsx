"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Microscope,
  Scale,
  ScrollText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const useCases = [
  {
    icon: GraduationCap,
    title: "Students & Academics",
    description:
      "Quickly analyze research papers, summarize textbooks, and verify sources for essays and assignments.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Scale,
    title: "Legal Professionals",
    description:
      "Review contracts, depositions, and case files rapidly. Extract key clauses and compare document versions.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Briefcase,
    title: "Business Analysts",
    description:
      "Extract insights from market research, financial reports, and business proposals efficiently.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Microscope,
    title: "Researchers",
    description:
      "Synthesize findings from multiple studies, track citations, and stay updated on the latest research.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: ScrollText,
    title: "Content Creators",
    description:
      "Repurpose information from documents, fact-check articles, and generate summaries for blogs or reports.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: UserCog,
    title: "General Productivity",
    description:
      "Understand manuals, agreements, or any lengthy document faster without tedious reading.",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
];

import { UserCog } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" },
  },
};

const UseCasesSection = () => {
  return (
    <section className="w-full bg-white py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Who Benefits From Our AI?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Our platform empowers various professionals and individuals to save
          time and gain deeper understanding from their documents.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {useCases.map((useCase) => (
            <motion.div
              key={useCase.title}
              variants={itemVariants}
              className="h-full"
            >
              <Card className="h-full text-left border-gray-200 hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden">
                <CardHeader>
                  <div
                    className={`inline-block p-3 rounded-lg ${useCase.bgColor} mb-4`}
                  >
                    <useCase.icon
                      className={`h-7 w-7 ${useCase.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {useCase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{useCase.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;
