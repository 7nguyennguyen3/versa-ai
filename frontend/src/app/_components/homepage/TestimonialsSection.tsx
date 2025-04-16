"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import React from "react"; // Import React if not already

const testimonials = [
  {
    text: "This AI has fundamentally changed how we process client documents. The time saved is incredible!",
    name: "Alex Dubois",
    title: "Project Manager",
  },
  {
    text: "Analyzing lengthy research papers used to take days. Now, I get key summaries and insights in minutes.",
    name: "Dr. Jamie Reed",
    title: "Researcher",
  },
  {
    text: "Simple to use, powerful results. Uploading and chatting with our internal knowledge base has never been easier.",
    name: "Samira Khan",
    title: "Operations Lead",
  },
  {
    text: "I was skeptical at first, but the accuracy of the answers blew me away. It's like having an expert assistant.",
    name: "Taylor Morgan",
    title: "Legal Consultant",
  },
];

// Main Section Component
const TestimonialsSection = () => {
  return (
    // Subtle gradient, reduced padding
    <section
      className="w-full 
    bg-gradient-to-br from-sky-50/50 via-white to-indigo-100/50 py-16 md:py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14" // Reduced margin
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what others have to say about their experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {" "}
          {/* Slightly reduced gap */}
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Refined Testimonial Card Component
const TestimonialCard = ({ text, name, title }: (typeof testimonials)[0]) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} // Slightly less dramatic scale
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      {/* More subtle shadow, slightly less padding */}
      <Card className="h-full bg-white shadow-md border border-gray-100 rounded-lg p-5 flex flex-col">
        <CardContent className="flex flex-col flex-grow p-0">
          {/* Subtle Quote Icon */}
          <Quote className="w-6 h-6 text-slate-300 mb-3" strokeWidth={1.5} />
          <p className="text-gray-700 italic text-base mb-5 flex-grow">
            &quot;{text}&quot;
          </p>{" "}
          {/* Ensure text size is readable */}
          {/* Footer of card */}
          <div className="flex items-center mt-auto pt-4 border-t border-gray-100/80">
            <div className="flex-grow">
              <span className="block font-semibold text-sm text-gray-900">
                {name}
              </span>
              <span className="block text-xs text-gray-500">{title}</span>
            </div>
            {/* Smaller stars */}
            <div className="flex text-yellow-400 shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialsSection;
