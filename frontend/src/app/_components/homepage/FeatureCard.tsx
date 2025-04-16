"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Using more parts of shadcn card
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: "blue" | "green" | "purple" | "orange"; // Optional color for icon background
}

// Animation variant for individual card items
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const FeatureCard = ({
  icon,
  title,
  description,
  color = "blue",
}: FeatureCardProps) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    // Apply item variant for staggered animation
    <motion.div
      variants={itemVariants}
      className="h-full"
      whileHover={{ y: -8, scale: 1.03 }} // Enhanced hover effect
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card className="h-full border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col">
        <CardHeader className="items-start pb-4">
          {/* Icon with colored background */}
          <div className={`p-3 rounded-lg ${colorClasses[color]} mb-4`}>
            {icon}
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 text-sm">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
