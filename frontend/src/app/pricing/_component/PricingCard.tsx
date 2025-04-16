"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { PricingTier } from "../../_global/interface";

interface PricingCardProps {
  tier: PricingTier;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const PricingCard: React.FC<PricingCardProps> = ({ tier }) => {
  const isEnterprise = tier.name === "Enterprise";
  const isHighlighted = tier.highlight;

  // Define button styles based on state
  let buttonClasses = "w-full text-base font-semibold";
  if (isEnterprise) {
    buttonClasses += " border-gray-500 text-gray-700 hover:bg-gray-100";
  } else if (isHighlighted) {
    // Highlighted button style (e.g., solid blue)
    buttonClasses += " bg-blue-600 hover:bg-blue-700 text-white";
  } else {
    // Default outline button style
    buttonClasses += " border-gray-400 text-gray-700 hover:bg-gray-50";
  }

  return (
    <motion.div variants={cardVariants} className="h-full">
      {/* Apply dynamic border based on highlight and theme */}
      <Card
        className={`flex flex-col h-full rounded-xl shadow-md border ${
          isHighlighted
            ? tier.themeColorClass + " border-2 shadow-xl"
            : "border-gray-200"
        } ${isHighlighted ? "relative" : ""}`}
      >
        {/* Badge for highlighted tier */}
        {isHighlighted && (
          <Badge
            variant="default"
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white border-none px-3 py-0.5 text-xs font-semibold"
          >
            Most Popular
          </Badge>
        )}
        <CardHeader className="pt-8 pb-4 px-6">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
            {tier.name}
          </CardTitle>
          {/* Fixed height ensures card headers align */}
          <CardDescription className="text-gray-500 h-10 text-sm">
            {tier.description}
          </CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-gray-900">
              {tier.price}
            </span>
            {tier.frequency && (
              <span className="text-base font-medium text-gray-500 ml-1">
                {tier.frequency}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow px-6 pb-6">
          <p className="font-semibold text-sm text-gray-700 mb-3">
            Features include:
          </p>
          <ul className="space-y-3 text-sm text-gray-600">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                {feature.included ? (
                  <Check
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    strokeWidth={3}
                  />
                ) : (
                  <X
                    className="h-4 w-4 text-gray-400 flex-shrink-0"
                    strokeWidth={3}
                  />
                )}
                {/* Optional: Wrap text for tooltip */}
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="mt-auto px-6 pb-8">
          <Button
            asChild // Use asChild to allow Link to work correctly with Button styling
            size="lg"
            variant={
              isEnterprise ? "outline" : isHighlighted ? "default" : "outline"
            } // Use variants logically
            className={buttonClasses} // Apply dynamic classes
          >
            <Link href={tier.href || "#"}>{tier.cta}</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
