"use client";

import { Button } from "@/components/ui/button";
// Removed Card import
import { ShieldAlert, ArrowRight, Home, LogIn } from "lucide-react"; // Use LogIn or UserPlus
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Unauthorized = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8); // Countdown duration

  useEffect(() => {
    // Start countdown interval
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop interval when countdown reaches 0 or less
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set redirect timeout
    const timeout = setTimeout(() => {
      // Redirect to signup or login page - adjust as needed
      router.push("/auth/signin"); // Changed to login, adjust if signup is preferred
    }, countdown * 1000); // Use state variable for timeout duration

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router, countdown]); // Add countdown to dependencies to reset timeout if needed, though unlikely here

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    // Cleaner background, full page centering
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        className="max-w-lg w-full" // Control content width
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Static Icon */}
        <motion.div variants={itemVariants}>
          <ShieldAlert
            className="h-16 w-16 md:h-20 md:w-20 mx-auto text-indigo-500 mb-6" // Theme color, no pulse
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" // Solid color
        >
          Authentication Required
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-6"
        >
          You need to be logged in to access this page or resource.
        </motion.p>

        {/* Countdown Info */}
        <motion.div
          variants={itemVariants}
          className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-indigo-800">
            You will be automatically redirected to the login page in{" "}
            <span className="font-bold text-base mx-1">{countdown}</span>
            second{countdown !== 1 ? "s" : ""}...
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Button matching the redirect destination */}
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-semibold shadow-sm"
          >
            <Link href="/auth/login">
              {" "}
              {/* Ensure this matches redirect */}
              <LogIn className="mr-2 h-4 w-4" /> Log In Now
            </Link>
          </Button>

          {/* Alternative Action */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/")} // Go home
            className="w-full sm:w-auto border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-3 font-semibold shadow-sm"
          >
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="mt-10 text-xs text-gray-500 space-y-1"
        >
          <p>Error Code: 401 (Unauthorized)</p>
          <p>
            Need assistance?{" "}
            <Link
              href="/contact" // Use contact page link
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
            >
              Contact Support
            </Link>
          </p>
          {/* Removed random Session ID */}
        </motion.div>
      </motion.div>
      {/* Removed the animated background blobs causing hydration issues */}
    </div>
  );
};

export default Unauthorized;
