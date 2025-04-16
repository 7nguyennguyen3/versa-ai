"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Keep Card for potential future use (e.g., team)
import { motion } from "framer-motion";
import {
  BrainCircuit,
  DraftingCompass,
  FileSearch,
  HeartHandshake,
  Info,
  Lock,
  PlayCircle,
  Tags,
  Target,
  Zap,
} from "lucide-react"; // Added more icons
import Link from "next/link";

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const AboutPage = () => {
  return (
    <div
      className="min-h-screen w-full
    bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 pt-20
    pb-16 md:pt-28 md:pb-24"
    >
      <div className="w-full max-w-5xl mx-auto mt-20">
        {/* --- Hero Section --- */}
        <motion.section
          className="text-center mb-20 md:mb-28"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }} // Example ease
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1 rounded-full mb-4"
          >
            About Versa AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
          >
            Unlocking Knowledge, <br className="hidden md:block" />{" "}
            Effortlessly.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            We&apos;re building the next generation of AI tools to help you
            navigate, understand, and interact with your information like never
            before.
          </motion.p>
        </motion.section>

        {/* --- Our Mission Section --- */}
        <motion.section
          className="mb-20 md:mb-28 text-center"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Target
            className="h-12 w-12 mx-auto text-indigo-500 mb-4"
            strokeWidth={1.5}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">
            To make complex information universally accessible and instantly
            understandable through intuitive, intelligent AI, empowering
            everyone from students to enterprise teams.
          </p>
        </motion.section>

        <motion.section
          className="mb-20 md:mb-28 text-center bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-8 md:p-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Tired of Information Overload?
          </h2>
          <p className="max-w-3xl mx-auto text-base text-gray-600 leading-relaxed">
            Endless documents, complex jargon, and scattered data make finding
            answers time-consuming and frustrating. Traditional search falls
            short, leaving valuable insights buried. We knew there had to be a
            better way.
          </p>
        </motion.section>

        {/* --- Our Solution / Features Section --- */}
        <motion.section
          className="mb-20 md:mb-28"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 md:mb-12 text-center">
            Our Solution
          </h2>
          {/* Feature Grid - Reimagined */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1: Instant Understanding */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-lg border border-transparent hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              <FileSearch
                className="w-10 h-10 text-indigo-600 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Instant Understanding
              </h3>
              <p className="text-sm text-gray-600">
                Ask questions in natural language and get direct, cited answers
                from your documents in seconds.
              </p>
            </motion.div>
            {/* Feature 2: Deep Analysis */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-lg border border-transparent hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              <BrainCircuit
                className="w-10 h-10 text-indigo-600 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Deep Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Go beyond keywords. Extract key themes, summarize complex
                sections, and identify crucial data points automatically.
              </p>
            </motion.div>
            {/* Feature 3: Tailored Interaction */}
            <motion.div
              variants={itemVariants}
              className="bg-white p-6 rounded-lg border border-transparent hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
            >
              <DraftingCompass
                className="w-10 h-10 text-indigo-600 mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tailored Interaction
              </h3>
              <p className="text-sm text-gray-600">
                Customize your AI&apos;s memory, purpose, and response style
                (coming soon) for truly personalized assistance.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* --- Our Values Section (Optional) --- */}
        <motion.section
          className="mb-20 md:mb-28 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 md:mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
            <div className="text-center">
              <HeartHandshake
                className="h-10 w-10 mx-auto text-indigo-500 mb-3"
                strokeWidth={1.5}
              />
              <h4 className="font-semibold text-gray-700 mb-1">
                User-Centricity
              </h4>
              <p className="text-xs text-gray-500">
                We build for our users first, focusing on intuitive design and
                real-world value.
              </p>
            </div>
            <div className="text-center">
              <Zap
                className="h-10 w-10 mx-auto text-indigo-500 mb-3"
                strokeWidth={1.5}
              />
              <h4 className="font-semibold text-gray-700 mb-1">Innovation</h4>
              <p className="text-xs text-gray-500">
                We constantly explore new AI capabilities to push the boundaries
                of what&apos;s possible.
              </p>
            </div>
            <div className="text-center">
              <Lock
                className="h-10 w-10 mx-auto text-indigo-500 mb-3"
                strokeWidth={1.5}
              />
              <h4 className="font-semibold text-gray-700 mb-1">
                Trust & Security
              </h4>
              <p className="text-xs text-gray-500">
                Your data privacy and security are paramount in everything we
                build.
              </p>
            </div>
          </div>
        </motion.section>

        {/* --- Optional: Team Section Placeholder --- */}
        {/*
             <motion.section className="mb-20 md:mb-28 text-center" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                 <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">Meet the Team</h2>
                 <p className="max-w-2xl mx-auto text-base text-gray-600 mb-8">
                    We are a passionate group of developers, designers, and AI enthusiasts dedicated to our mission.
                 </p>
                 [Consider adding team photos/links here or linking to a separate team page]
                 <Button variant="outline" asChild><Link href="/team">Learn More About Us</Link></Button>
             </motion.section>
             */}

        {/* --- Join Us / CTA Section --- */}
        <motion.section
          // Section provides margin and animation control
          className="mt-20 md:mt-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          {/* Card uses a professional dark background, similar but distinct gradient */}
          <Card className="relative overflow-hidden rounded-xl border-none shadow-xl bg-gradient-to-br from-blue-950 to-slate-900 text-white">
            {/* Optional: Subtle pattern */}
            {/* <div className="absolute inset-0 opacity-5 bg-[url('/path/to/pattern.svg')] bg-repeat -z-10"></div> */}

            <CardContent className="relative z-10 p-10 md:p-12 flex flex-col items-center text-center">
              {/* Different Icon relevant to 'About' or 'Info' */}
              <div className="mb-5 p-3 bg-white/10 rounded-full">
                <Info className="h-8 w-8 text-blue-300" strokeWidth={2} />{" "}
                {/* Changed Icon */}
              </div>

              {/* Text tailored for About Page context */}
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                Intrigued by Our Mission?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                {" "}
                {/* Adjusted text color slightly */}
                See our AI in action with an interactive demo, or explore the
                plans designed to fit your needs.
              </p>

              {/* Buttons styled for dark background, linking to Demo & Pricing */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                {/* Primary Action: Try Demo */}
                <Button
                  size="lg"
                  className="bg-white text-blue-800 hover:bg-gray-200 border-transparent px-7 py-3 rounded-md text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group" // Adjusted text color
                  asChild
                >
                  <Link href="/chat/demo" passHref>
                    <span className="flex items-center justify-center">
                      {" "}
                      {/* Ensured alignment */}
                      <PlayCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-[10deg]" />{" "}
                      {/* Changed Icon */}
                      Try Live Demo
                    </span>
                  </Link>
                </Button>

                {/* Secondary Action: View Pricing */}
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white/40 hover:border-white/80 hover:bg-white/10 px-7 py-3 rounded-md text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto group"
                  asChild
                >
                  <Link href="/pricing" passHref>
                    <span className="flex items-center justify-center">
                      {" "}
                      {/* Ensured alignment */}
                      <Tags className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-[-5deg]" />{" "}
                      {/* Changed Icon */}
                      View Pricing Plans
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
