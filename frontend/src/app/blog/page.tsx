"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { delay, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Rss } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { sampleBlogPosts } from "../_global/variables";
import { BlogPostCard } from "./_component/BlogPostCard";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
    delay: 1,
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const BlogPage = () => {
  // Separate featured and recent posts
  const featuredPost = useMemo(() => sampleBlogPosts[0], []);
  const recentPosts = useMemo(() => sampleBlogPosts.slice(1), []);

  return (
    <div
      className="min-h-screen w-full 
    bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 pt-20 pb-16 md:pt-28 md:pb-24"
    >
      <div className="w-full max-w-6xl mx-auto mt-20">
        {/* Header Section */}
        <motion.section
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            {" "}
            <Rss className="h-8 w-8 text-indigo-600" strokeWidth={1.5} />{" "}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            {" "}
            Versa AI Blog{" "}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {" "}
            Insights, news, and updates on AI, document processing, and
            productivity from the Versa AI team.{" "}
          </p>
        </motion.section>

        {/* Featured Post Section - Redesigned without Image */}
        {featuredPost && (
          <motion.section
            className="mb-16 md:mb-20"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold tracking-tight text-gray-800 mb-6 text-center sm:text-left">
              Latest Post
            </h2>
            {/* Use Card for consistent styling, but single column layout */}
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <Card className="overflow-hidden shadow-lg border-indigo-200/50 bg-gradient-to-br from-white to-indigo-50/50 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-3">
                    <Badge
                      variant="outline"
                      className="text-xs border-indigo-300 text-indigo-700 bg-white"
                    >
                      {featuredPost.category}
                    </Badge>
                    <p className="text-xs text-gray-500 flex items-center">
                      {" "}
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />{" "}
                      {featuredPost.date}{" "}
                    </p>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold leading-tight mb-3 group-hover:text-indigo-700 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-base text-gray-600 line-clamp-3 mb-4">
                    {" "}
                    {/* Increased text size */}
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>
                      {featuredPost.author ? `By ${featuredPost.author}` : ""}
                    </span>
                  </div>
                  <p className="text-indigo-600 group-hover:underline flex items-center text-sm font-medium">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.section>
        )}

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 mb-6 md:mb-8 text-center sm:text-left">
            Recent Posts
          </h2>
          {recentPosts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              variants={gridContainerVariants}
            >
              {recentPosts.map((post) => (
                <motion.div key={post.slug} variants={itemVariants}>
                  {/* Render the card using the icon prop */}
                  <BlogPostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center text-gray-500 italic">
              More posts coming soon!
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default BlogPage;
