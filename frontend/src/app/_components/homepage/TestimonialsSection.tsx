"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import EmblaCarousel from "../Carousel";

const testimonials = [
  {
    text: "This AI chatbot has transformed how I handle customer inquiries. Amazing! 🎉",
    name: "Alex D.",
  },
  {
    text: "The PDF assistant helped me analyze contracts in seconds. A lifesaver! ⚡",
    name: "Jamie R.",
  },
  {
    text: "Incredible tool! It saved me hours of manual work. Highly recommend!",
    name: "Sam T.",
  },
  {
    text: "The AI chatbot is so intuitive and easy to use. It's a game-changer!",
    name: "Taylor M.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="max-w-6xl w-full py-16 px-6 mx-auto">
      <motion.h2
        className="text-xl md:text-4xl font-extrabold text-blue-900 mb-16 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌟 What Our Users Say
      </motion.h2>

      {/* Carousel for Medium Screens and Above */}
      <div className="hidden md:block">
        <EmblaCarousel
          slides={testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all rounded-lg p-6 mx-4"
            >
              <CardContent className="text-center">
                <p className="text-gray-700 italic">{testimonial.text}</p>
                <span className="block mt-4 font-semibold">
                  - {testimonial.name}
                </span>
                <div className="flex justify-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        />
      </div>

      {/* Grid Layout for Small Screens */}
      <div className="md:hidden grid gap-6">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all rounded-lg p-6"
          >
            <CardContent className="text-center">
              <p className="text-gray-700 italic">{testimonial.text}</p>
              <span className="block mt-4 font-semibold">
                - {testimonial.name}
              </span>
              <div className="flex justify-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
