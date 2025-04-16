"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideProps } from "lucide-react"; // Import LucideProps type

interface FeatureListItemProps {
  icon: React.ElementType<LucideProps>; // Expect a Lucide icon component
  title: string;
  description: string;
}

// Animation variant for individual list items
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const FeatureListItem: React.FC<FeatureListItemProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      className="flex items-start space-x-4"
      variants={itemVariants} // Apply item variant
    >
      <div className="flex-shrink-0 mt-1">
        <Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureListItem;
