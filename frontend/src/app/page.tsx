"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  MessageSquare,
  FileText,
  Star,
  Bot,
  Settings,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center text-center px-6 py-12">
      {/* Hero Section */}
      <section className="max-w-4xl py-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🤖 Chat with Any PDF Instantly
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Upload your document and get instant answers powered by AI. Transform
          how you interact with information! 🚀
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/chat/demo">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg text-lg shadow-md transition-all duration-300">
              🚀 Try Live Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-6xl w-full py-16">
        <h2 className="text-3xl font-bold text-blue-800 mb-12">
          ✨ Our Products
        </h2>
        <div className="grid md:grid-cols-2 gap-8 px-4">
          {/* Personalized Chatbot */}
          <Card className="shadow-lg border border-blue-200 bg-white hover:shadow-xl transition-all">
            <CardHeader className="flex flex-col items-center">
              <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle className="text-2xl font-bold text-blue-700">
                Personalized Chatbot 🤖
              </CardTitle>
              <CardDescription className="text-gray-700 min-h-[60px]">
                Create an AI chatbot tailored to your needs, trained on your
                data. Perfect for customer support and more!
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg shadow-md">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          {/* PDF Assistant */}
          <Card className="shadow-lg border border-green-200 bg-white hover:shadow-xl transition-all">
            <CardHeader className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle className="text-2xl font-bold text-green-700">
                AI PDF Assistant 📄
              </CardTitle>
              <CardDescription className="text-gray-700 min-h-[60px]">
                Upload any document and let AI extract key insights for you. Say
                goodbye to manual reading!
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg shadow-md">
                Try Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-6xl w-full py-16">
        <h2 className="text-3xl font-bold text-blue-800 mb-12">
          🌟 What Our Users Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8 px-4">
          <Card className="shadow-lg border border-purple-200 bg-white hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <p className="text-gray-700 italic">
                {
                  "This AI chatbot has transformed how I handle customer inquiries. Amazing! 🎉"
                }
              </p>
              <span className="block mt-4 font-semibold mb-4">- Alex D.</span>
              <div className="flex items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border border-pink-200 bg-white hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <p className="text-gray-700 italic">
                {
                  "The PDF assistant helped me analyze contracts in seconds. A lifesaver! ⚡"
                }
              </p>
              <span className="block mt-4 font-semibold mb-4">- Jamie R.</span>
              <div className="flex items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upload Section */}
      <section className="max-w-4xl w-full py-16">
        <h2 className="text-3xl font-bold text-blue-800 mb-8">
          📤 Get Started Now
        </h2>
        <Card className="shadow-lg border border-blue-200 bg-white hover:shadow-xl transition-all">
          <CardContent className="p-10 flex flex-col items-center">
            <UploadCloud className="h-12 w-12 text-blue-600 mb-4" />
            <p className="text-gray-700 mb-4">
              {
                "Sign in to upload and chat with your PDFs. It's quick and easy! 🎯"
              }
            </p>
            <span className="text-gray-500 text-sm mb-4">or</span>
            <Link href="/chat/demo">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg shadow-md">
                🚀 Try our Demo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Homepage;
