"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pricingTiers = [
  {
    name: "Free",
    price: "$0 /mo",
    features: {
      aiModel: "Basic AI Model",
      uploadLimit: "10MB / file",
      apiAccess: "Limited",
      prioritySupport: false,
    },
    color: "bg-gray-100 border-gray-300 text-gray-900",
  },
  {
    name: "Pro",
    price: "$9 /mo",
    features: {
      aiModel: "Standard AI Model",
      uploadLimit: "100MB / file",
      apiAccess: "Full API Access",
      prioritySupport: true,
    },
    color: "bg-blue-100 border-blue-400 text-blue-900",
  },
  {
    name: "Premium",
    price: "$19 /mo",
    features: {
      aiModel: "Advanced AI Model",
      uploadLimit: "500MB / file",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4 py-8 md:py-12">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            💰 Pricing Plans
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            {
              "Choose the perfect plan for your AI-powered needs. Whether you're just getting started or need enterprise-grade AI, we have a plan for you."
            }
          </p>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`${tier.color} p-6`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <Badge variant="outline" className="text-lg font-semibold">
                  {tier.price}
                </Badge>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI Model:</span>
                  <span className="font-medium">{tier.features.aiModel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upload Limit:</span>
                  <span className="font-medium">
                    {tier.features.uploadLimit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Access:</span>
                  <span className="font-medium">{tier.features.apiAccess}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Priority Support:</span>
                  {tier.features.prioritySupport ? (
                    <CheckCircle className="text-green-600 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-600 w-5 h-5" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-left">Plan</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">AI Model</th>
                <th className="p-4 text-left hidden lg:table-cell">
                  Upload Limit
                </th>
                <th className="p-4 text-left">API Access</th>
                <th className="p-4 text-left">Support</th>
              </tr>
            </thead>
            <tbody>
              {pricingTiers.map((tier) => (
                <tr key={tier.name} className={`${tier.color} border-b`}>
                  <td className="p-4 font-semibold">{tier.name}</td>
                  <td className="p-4">{tier.price}</td>
                  <td className="p-4">{tier.features.aiModel}</td>
                  <td className="p-4 hidden lg:table-cell">
                    {tier.features.uploadLimit}
                  </td>
                  <td className="p-4">{tier.features.apiAccess}</td>
                  <td className="p-4">
                    {tier.features.prioritySupport ? (
                      <CheckCircle className="text-green-600 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-600 w-5 h-5" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Section */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need a custom AI solution? Contact us to discuss your enterprise
            needs.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-md md:text-lg">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
