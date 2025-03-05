"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldAlert, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Unauthorized = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    const timeout = setTimeout(() => router.push("/auth/signup"), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <Card className="shadow-2xl border-blue-200 bg-white max-w-2xl w-full p-8 transform transition-all hover:shadow-xl z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-blue-100 p-4 rounded-full animate-pulse">
            <ShieldAlert className="h-12 w-12 text-blue-600" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Authentication Required
          </h1>

          <div className="bg-gray-50 p-4 rounded-lg w-full">
            <p className="text-blue-500 font-medium text-sm">
              Access to this resource requires authentication
              <span className="block mt-2 text-red-500 font-semibold">
                Redirecting in{" "}
                <span className="text-lg font-bold">{countdown}</span>{" "}
                seconds...
              </span>
            </p>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">
            Join our community to unlock full access! 🔐
            <br />
            Get started in just a few clicks:
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-sm">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-lg text-lg shadow-md transition-all duration-300 hover:scale-105 w-full"
            >
              <Link href="/auth/signup">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105 w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Error Code: 401 | Need assistance?{" "}
              <a
                href="mailto:support@versapdf.com"
                className="text-blue-600 hover:underline"
              >
                Contact Support
              </a>
            </p>
            <p className="mt-2 text-xs">
              Session ID:{" "}
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      </Card>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [-10, -30, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.5,
            }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              background: `rgba(59, 130, 246, ${Math.random() * 0.1})`,
              borderRadius: "50%",
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Unauthorized;
