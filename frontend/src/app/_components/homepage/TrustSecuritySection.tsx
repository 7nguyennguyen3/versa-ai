"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Server, FileCheck } from "lucide-react"; // Using relevant icons

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your documents and chats are encrypted both in transit and at rest using industry-standard protocols.",
  },
  {
    icon: ShieldCheck,
    title: "Strict Data Privacy",
    description:
      "We prioritize your privacy. Your documents are never used for training AI models without explicit consent.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Built on secure cloud infrastructure with robust access controls and regular security audits.",
  },
  {
    icon: FileCheck, // Or FileLock
    title: "Confidentiality Assured",
    description:
      "Your uploaded content remains confidential and is only processed to provide you with answers.",
  },
];

const TrustSecuritySection = () => {
  return (
    <section className="w-full bg-white py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Trust & Security Matters
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to protecting your data and ensuring
            confidentiality throughout your experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-start space-x-4"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} // Animate from sides
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 mt-1 p-3 bg-green-100 rounded-full">
                <feature.icon
                  className="h-6 w-6 text-green-700"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {feature.title}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;
