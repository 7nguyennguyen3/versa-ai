"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="max-w-4xl py-32 relative">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-50 -z-10 animate-gradient" />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Chat with Any PDF Instantly
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-700 text-lg lg:text-xl mb-8"
      >
        Upload your document and get instant answers powered by AI. Transform
        how you interact with information! 🚀
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex gap-4 justify-center"
      >
        <Link href="/chat/demo">
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
          text-white px-5 py-6 rounded-lg lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            🚀 Try Live Demo
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
