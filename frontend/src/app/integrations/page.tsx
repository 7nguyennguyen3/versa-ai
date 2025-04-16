"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Cloud, // Page icons
  Database,
  GitBranch,
  MessageCircleQuestion,
  MessageSquare,
  PlugZap,
  Slack as SlackIcon,
  StickyNote,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  IntegrationCard,
  IntegrationCardProps,
} from "./_component/IntegrationCard";

// --- Example Integrations Data (Using Icons) ---
const integrationsData: IntegrationCardProps[] = [
  {
    name: "Google Drive",
    description:
      "Import documents directly from your Google Drive account for seamless analysis.",
    icon: Database,
    status: "Live",
    category: "Storage",
    docsUrl: "/docs/integrations/google-drive",
  },
  {
    name: "Zapier",
    description:
      "Connect Versa AI to thousands of other apps and automate workflows.",
    icon: Zap,
    status: "Live",
    category: "Automation",
    docsUrl: "/docs/integrations/zapier",
  },
  {
    name: "Slack",
    description:
      "Send summaries, insights, or notifications directly to your Slack channels.",
    icon: SlackIcon,
    status: "Live",
    category: "Communication",
    docsUrl: "/docs/integrations/slack",
  },
  {
    name: "Notion",
    description:
      "Export summaries, extracted data, and chat insights directly into your Notion pages.",
    icon: StickyNote,
    status: "Beta",
    category: "Productivity",
    docsUrl: "/docs/integrations/notion-beta",
  },
  {
    name: "Dropbox",
    description:
      "Connect your Dropbox account to easily access and analyze stored documents.",
    icon: Box,
    status: "Beta",
    category: "Storage",
  },
  {
    name: "Microsoft Teams",
    description:
      "Share insights and collaborate with your team directly within Microsoft Teams.",
    icon: MessageSquare,
    status: "Coming Soon",
    category: "Communication",
  },
  {
    name: "OneDrive",
    description:
      "Access and process files stored in your Microsoft OneDrive account.",
    icon: Cloud,
    status: "Coming Soon",
    category: "Storage",
  },
  {
    name: "Make (Integromat)",
    description:
      "Build custom automations and integrate Versa AI with other services.",
    icon: Workflow,
    status: "Coming Soon",
    category: "Automation",
  },
] as const;

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 }, // Adjusted item entrance slightly
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const IntegrationsPage = () => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("searchQuery");
    if (typeof query === "string" && query.trim()) {
      window.location.href = `/kb/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div
      className="min-h-screen w-full
    bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 pt-20
    pb-16 md:pt-28 md:pb-24"
    >
      <div className="w-full max-w-6xl mx-auto mt-20">
        {/* --- Hero Section --- */}
        <motion.section
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            {" "}
            <PlugZap
              className="h-8 w-8 text-indigo-600"
              strokeWidth={1.5}
            />{" "}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            {" "}
            Connect Your Workflow{" "}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            {" "}
            Integrate Versa AI with the tools you already use to streamline
            processes, automate tasks, and bring AI insights directly into your
            workflow.{" "}
          </p>
        </motion.section>

        {/* --- Integrations Grid Section --- */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="mb-16 md:mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-10 text-center">
            {" "}
            Available Integrations{" "}
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={gridContainerVariants}
          >
            {integrationsData.map((integration) => (
              <motion.div key={integration.name} variants={itemVariants}>
                {/* Render the card using the icon prop */}
                <IntegrationCard {...integration} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* --- Coming Soon / Request Section --- */}
        <motion.section
          className="text-center bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-8 md:p-10 mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            More Integrations Coming Soon!
          </h3>
          <p className="text-gray-600 max-w-lg mx-auto mb-6 text-sm">
            {" "}
            We&apos;re constantly working on adding new connections. Is there a
            specific tool you&apos;d love to see integrated? Let us know!{" "}
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact?subject=Integration+Request">
              {" "}
              <MessageCircleQuestion className="mr-2 h-4 w-4" /> Request an
              Integration{" "}
            </Link>
          </Button>
        </motion.section>

        {/* --- Developer / API Section --- */}
        <motion.section
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <GitBranch
            className="h-8 w-8 mx-auto text-indigo-500 mb-3"
            strokeWidth={1.5}
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Build Your Own
          </h3>
          <p className="text-gray-600 max-w-lg mx-auto mb-6 text-sm">
            {" "}
            Leverage our powerful API to build custom integrations and embed AI
            document intelligence directly into your own applications.{" "}
          </p>
          <Button variant="default" asChild>
            <Link href="/developers/api">
              {" "}
              View API Documentation <ArrowRight className="ml-1.5 h-4 w-4" />{" "}
            </Link>
          </Button>
        </motion.section>
      </div>
    </div>
  );
};

export default IntegrationsPage;
