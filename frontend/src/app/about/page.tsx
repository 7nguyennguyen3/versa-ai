"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Settings } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center text-center px-6 py-12">
      {/* Page Title */}
      <h1 className="text-5xl font-bold text-blue-700 mb-4">🚀 About Us</h1>
      <p className="max-w-3xl text-gray-700 mb-8 text-lg">
        We build{" "}
        <span className="text-blue-600 font-semibold">AI solutions</span> that
        transform how you interact with information. Whether you need instant
        insights from PDFs or a fully customizable AI assistant, our platform is
        designed to adapt to your needs.
      </p>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
        {/* AI-Powered PDF Chat */}
        <Card className="shadow-lg border border-blue-200 bg-white">
          <CardHeader className="flex flex-col items-center">
            <FileText className="w-12 h-12 text-blue-600 mb-2" />
            <CardTitle className="text-blue-700">
              AI-Powered PDF Chat 📄
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Instantly extract insights from your documents with AI-powered
              chat. No more endless scrolling—just ask questions and get direct
              answers.
            </p>
          </CardContent>
        </Card>

        {/* AI-Powered Insights */}
        <Card className="shadow-lg border border-green-200 bg-white">
          <CardHeader className="flex flex-col items-center">
            <Bot className="w-12 h-12 text-green-600 mb-2" />
            <CardTitle className="text-green-700">
              AI-Powered Insights 🤖
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Our advanced AI quickly analyzes PDFs, summarizing key details so
              you don’t have to dig through pages of text.
            </p>
          </CardContent>
        </Card>

        {/* Customizable AI */}
        <Card className="shadow-lg border border-purple-200 bg-white">
          <CardHeader className="flex flex-col items-center">
            <Settings className="w-12 h-12 text-purple-600 mb-2" />
            <CardTitle className="text-purple-700">
              Fully Customizable AI ⚙️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Take control of your AI experience. Customize memory, switch
              between different models, and tailor responses to fit your exact
              needs.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-blue-800 mb-3">
          ✨ Get Started Today
        </h2>
        <p className="text-gray-700 max-w-xl mb-6">
          Unlock the power of AI-driven document processing or customize your
          own AI assistant. Experience seamless AI-powered interactions today.
        </p>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 text-lg shadow-md transition-all duration-300">
          🚀 Try It Now
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
