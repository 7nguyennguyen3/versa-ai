"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all rounded-lg p-6 h-full flex flex-col">
        <div className="flex flex-col items-center flex-1">
          {icon}
          <h3 className="text-2xl font-bold text-gray-800 mt-4">{title}</h3>
          <p className="text-gray-600 text-center mt-2 flex-1">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
