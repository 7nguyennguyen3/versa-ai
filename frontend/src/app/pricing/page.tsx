"use client";

import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    price: "$0 /mo",
    features: {
      aiModel: "Basic AI Model",
      uploadLimit: "50MB / file",
      apiAccess: "Limited",
      prioritySupport: false,
    },
    color: "bg-gray-100 border-gray-300 text-gray-900",
  },
  {
    name: "Pro",
    price: "$19 /mo",
    features: {
      aiModel: "Standard AI Model",
      uploadLimit: "500MB / file",
      apiAccess: "Full API Access",
      prioritySupport: true,
    },
    color: "bg-blue-100 border-blue-400 text-blue-900",
  },
  {
    name: "Premium",
    price: "$49 /mo",
    features: {
      aiModel: "Advanced AI Model",
      uploadLimit: "2GB / file",
      apiAccess: "Full API + Batch Processing",
      prioritySupport: true,
    },
    color: "bg-purple-100 border-purple-400 text-purple-900",
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    features: {
      aiModel: "Custom AI Model",
      uploadLimit: "Unlimited",
      apiAccess: "Dedicated API with SLA",
      prioritySupport: true,
    },
    color: "bg-green-100 border-green-400 text-green-900",
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center text-center px-6 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        💰 Pricing Plans
      </h1>
      <p className="max-w-3xl text-gray-600 mb-8">
        {`Choose the perfect plan for your AI-powered needs. Whether you're just
        getting started or need enterprise-grade AI, we have a plan for you.`}
      </p>

      {/* Pricing Table */}
      <div className="w-full max-w-6xl overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4 text-lg">Plan</th>
              <th className="p-4 text-lg">Price</th>
              <th className="p-4 text-lg">AI Model</th>
              <th className="p-4 text-lg">Upload Limit</th>
              <th className="p-4 text-lg">API Access</th>
              <th className="p-4 text-lg">Priority Support</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {pricingTiers.map((tier, index) => (
              <tr key={tier.name} className={`${tier.color} border`}>
                <td className="p-4 font-semibold">{tier.name}</td>
                <td className="p-4">{tier.price}</td>
                <td className="p-4">{tier.features.aiModel}</td>
                <td className="p-4">{tier.features.uploadLimit}</td>
                <td className="p-4">{tier.features.apiAccess}</td>
                <td className="p-4">
                  {tier.features.prioritySupport ? (
                    <CheckCircle className="text-green-600 inline-block w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-600 inline-block w-5 h-5" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <p className="text-gray-600 max-w-xl mb-6">
          Need a custom AI solution? Contact us to discuss your enterprise
          needs.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 text-lg rounded-lg shadow-md transition-all duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default PricingPage;
