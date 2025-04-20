"use client";

import { useAuthStore } from "@/app/_store/useAuthStore"; // Assuming this path is correct
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Settings,
  LogOut, // Changed from AlertTriangle/LogIn/Home as they were used in Unauthorized
  UserCheck, // Alternative icon suggestion
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface LoggedInRedirectProps {
  name: string | null; // Prop to display the user's name
}

const LoggedInRedirect: React.FC<LoggedInRedirectProps> = ({ name }) => {
  const router = useRouter();
  // Countdown duration: starts at 10, redirects after 10 seconds
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Set redirect timeout to Dashboard
    const redirectTimeout = setTimeout(() => {
      router.push("/dashboard");
    }, 10 * 1000); // Redirect after 10 seconds

    // Start countdown interval for display
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval); // Stop interval when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(countdownInterval);
    };
  }, [router]); // Effect depends on the router object

  // Animation variants - Reusing the same variants as Unauthorized for consistent animation
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
    // Use the same full-page background and centering layout
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        className="max-w-lg w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon - Changed to a positive/success icon */}
        <motion.div variants={itemVariants}>
          {/* Use UserCheck or CheckCircle */}
          <UserCheck // Or CheckCircle
            className="h-20 w-20 md:h-24 md:w-24 mx-auto text-indigo-300 mb-8"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Heading - Changed messaging */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
        >
          Welcome Back{name ? `, ${name}` : ""}!{" "}
          {/* Include name if available */}
        </motion.h1>

        {/* Description - Changed messaging */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-6"
        >
          You are already logged in.
        </motion.p>

        {/* Countdown Info - Changed messaging and color */}
        <motion.div
          variants={itemVariants}
          // Changed background/border color to a positive theme color (blue or green)
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-blue-800">
            You will be automatically redirected to the dashboard in{" "}
            <span className="font-bold text-base mx-1">{countdown}</span>
            second{countdown !== 1 ? "s" : ""}...
          </p>
        </motion.div>

        {/* Action Buttons - Updated buttons for logged-in state */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Primary Button: Go to Dashboard */}
          <Button
            asChild // Use asChild with Link for proper routing
            size="lg"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold shadow-sm" // Blue theme color
            disabled={countdown === 0} // Optional: disable when redirecting
          >
            <Link href="/dashboard">
              <ArrowRight className="mr-2 h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>

          {/* Secondary Button: Go to Settings */}
          {/* Keeping the settings button as it was in the original LoggedInAlready */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-blue-400 text-blue-700 hover:bg-blue-100 px-6 py-3 font-semibold shadow-sm" // Blue outline theme
            disabled={countdown === 0} // Optional: disable when redirecting
          >
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" /> Go to Settings
            </Link>
          </Button>
        </motion.div>
        {/* Added Sign Out Button separately below the others, similar to the original */}
        <motion.div variants={itemVariants} className="mt-4">
          <Button
            variant="destructive" // Use destructive variant for sign out
            onClick={() => useAuthStore.getState().logout(router)}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-6 py-3 font-semibold shadow-sm"
            disabled={countdown === 0} // Optional: disable when redirecting
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>

        {/* Footer Info - Removed error code, kept contact link */}
        <motion.div
          variants={itemVariants}
          className="mt-10 text-xs text-gray-500 space-y-1"
        >
          <p>
            Need assistance?{" "}
            <Link
              href="/contact" // Assuming you have a contact page
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium" // Blue theme color
            >
              Contact Support
            </Link>
          </p>
        </motion.div>
      </motion.div>
      {/* Removed the animated background blobs */}
    </div>
  );
};

export default LoggedInRedirect;
