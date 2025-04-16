"use client";

import React from "react";
import { motion } from "framer-motion";
import { pricingTiers } from "../_global/variables";
import PricingCard from "./_component/PricingCard";

const PricingPage = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center 
    bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 py-16 md:py-24"
    >
      <div className="max-w-[1400px] mx-auto mt-20 xl:mt-0">
        {/* Header Section */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Find the Right Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent pricing designed to scale with your needs. No
            hidden fees.
          </p>
        </motion.div>

        {/* Responsive Grid for Pricing Cards - MODIFIED */}
        <motion.div
          // Changed grid columns: 1 (default) -> 2 (md and lg) -> 4 (xl and up)
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
        >
          {/* Map through the pricing tiers data */}
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </motion.div>

        {/* Footer/Contact Link */}
        <div className="mt-16 md:mt-24 text-center text-gray-600 text-sm">
          <p>
            Need more?{" "}
            <a
              href="/contact-sales"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact our sales team
            </a>{" "}
            for custom enterprise solutions.
          </p>
          {/* <p className="mt-2 text-xs text-gray-400">Pricing current as of: Monday, April 14, 2025</p> */}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
