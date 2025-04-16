"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Map, MessagesSquare, Upload } from "lucide-react";
import Link from "next/link";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ChatPage = () => {
  // const { userId } = useAuthStore(); // Keep if needed for personalization

  // Removed useEffect logic

  return (
    // Cleaner background, full page centering
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center text-center px-4 py-16">
      <motion.div
        className="max-w-xl w-full" // Control content width
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div variants={itemVariants}>
          {/* Choose an icon: Construction, Wrench, MessagesSquare etc. */}
          <MessagesSquare
            className="h-20 w-20 md:h-24 md:w-24 mx-auto text-indigo-300 mb-8"
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Badge (Optional) */}
        <motion.div variants={itemVariants} className="mb-3">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
            Coming Soon
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4"
        >
          Our New Chat Interface is Under Development
        </motion.h1>

        {/* Helper Text */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 mb-10"
        >
          We&apos;re building an amazing new way for you to interact with your
          documents. Stay tuned for updates! ✨
        </motion.p>

        {/* Action Links/Buttons */}
        <motion.div
          variants={itemVariants}
          className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4 sm:justify-center" // Layout links
        >
          {/* Styled Buttons using consistent variants */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          >
            <Link href="/pdf-chat">
              <FileText className="mr-2 h-4 w-4" /> Go to PDF Chat
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Link href="/upload-pdf">
              <Upload className="mr-2 h-4 w-4" /> Upload New PDF
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto text-gray-600 hover:bg-gray-100"
          >
            <Link href="/roadmap">
              <Map className="mr-2 h-4 w-4" /> View Roadmap
            </Link>
          </Button>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-sm mt-12"
        >
          We appreciate your patience while we build! 💪
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ChatPage;
