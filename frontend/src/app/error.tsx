"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react"; // Using AlertTriangle
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // useEffect added for logging
import { motion } from "framer-motion";
import Link from "next/link";

// Note: This component catches errors during rendering in the segment it wraps
// and its children segments. It receives the error and a reset function.
const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const router = useRouter();

  useEffect(() => {
    // Log the error to the console for debugging during development
    // In production, you'd send this to an error tracking service (Sentry, LogRocket, etc.)
    console.error("Caught Error Boundary:", error);
  }, [error]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 flex flex-col items-center justify-center text-center px-6 py-12">
      <motion.div
        className="max-w-lg w-full" // Control content width
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Static Icon */}
        <motion.div variants={itemVariants}>
          <AlertTriangle
            className="h-16 w-16 md:h-20 md:w-20 mx-auto text-red-500 mb-6" // Error color, no pulse
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4"
        >
          Something Went Wrong
        </motion.h1>

        {/* User-Friendly Message */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-8"
        >
          Sorry, we encountered an unexpected issue. Please try again, or return
          to the homepage.
        </motion.p>

        {/* Error details box removed for end-users */}
        {/* <div className="bg-gray-50 p-4 rounded-lg w-full">...</div> */}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            // Clear primary action style
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-base font-semibold rounded-md shadow-sm transition-all"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/")} // Navigate home
            // Clear secondary action style
            className="border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-3 text-base font-semibold rounded-md shadow-sm transition-all"
          >
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>
        </motion.div>

        {/* Contact Link */}
        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-sm mt-12"
        >
          If the problem persists, please{" "}
          <Link
            href="/contact" // Link to a contact page
            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
          >
            Contact Support
          </Link>
          .
          {/* Optionally display error digest in development for easier lookup */}
          {/* {process.env.NODE_ENV === 'development' && error.digest && <span className="block text-xs mt-1">Digest: {error.digest}</span>} */}
        </motion.p>
        {/* Removed random Session ID and hardcoded error code */}
      </motion.div>
      {/* Removed the animated background blobs causing hydration issues */}
    </div>
  );
};

export default ErrorPage;
