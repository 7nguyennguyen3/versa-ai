"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
// Using CheckCircle or Sparkles instead of Rocket
import { ArrowRight, FilePlus, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

const CtaSection = () => {
  return (
    // Section background is now white, reduced padding
    <section
      className="w-full 
    bg-gradient-to-br from-sky-50/50 via-white to-indigo-100/50 py-20 md:py-28 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Card uses a professional dark background, subtle gradient */}
          <Card className="relative overflow-hidden rounded-xl border-none shadow-lg bg-gradient-to-br from-gray-900 to-indigo-950 text-white">
            {/* Removed optional pattern div for cleaner look */}

            {/* Reduced padding inside card */}
            <CardContent className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center">
              {/* Static, professional icon */}
              <div className="mb-5 p-2.5 bg-white/10 rounded-full">
                <Sparkles className="h-8 w-8 text-indigo-300" />
              </div>

              <h2 className="text-3xl font-bold mb-3 text-white">
                Ready to Unlock Your Document Potential?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl">
                Experience the future of document interaction. Try the demo or
                sign up free today.
              </p>
              {/* Buttons with potentially refined styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <Link href="/chat/demo" passHref>
                  <Button
                    size="lg"
                    // Primary action: White/light background on dark card
                    className="bg-white text-indigo-700 hover:bg-gray-200 border-transparent px-7 py-3 rounded-md text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group"
                    asChild
                  >
                    <span>
                      🚀 Try Live Demo
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link href="/auth/signup" passHref>
                  <Button
                    size="lg"
                    // Secondary action: Outline/Subtle on dark card
                    variant="outline"
                    className="bg-transparent text-white border-white/40 hover:border-white/80 hover:bg-white/10 px-7 py-3 rounded-md text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group"
                    asChild
                  >
                    <span>
                      Get Started Free
                      <FilePlus className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
