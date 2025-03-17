"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import Link from "next/link";

const UploadSection = () => {
  return (
    <section className="max-w-4xl w-full py-16">
      <h2 className="text-4xl font-bold text-blue-800 mb-8">
        📤 Get Started Now
      </h2>
      <motion.div>
        {/* Disable animations for testing */}
        <Card className="shadow-lg border border-blue-200/50 bg-white/50 backdrop-blur-md hover:shadow-xl transition-all rounded-2xl">
          <CardContent className="p-10 flex flex-col items-center">
            <UploadCloud className="h-12 w-12 text-blue-600 mb-4 animate-float" />
            <p className="text-gray-700 mb-4">
              {
                "Sign in to upload and chat with your PDFs. It's quick and easy! 🎯"
              }
            </p>
            <span className="text-gray-500 text-sm mb-4">or</span>
            <Link href="/chat/demo">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                🚀 Try our Demo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default UploadSection;
