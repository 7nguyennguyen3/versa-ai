"use client";

import React, { useMemo, useState } from "react"; // Added useMemo
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_ROADMAP } from "../_global/variables"; // Adjust path
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapItem } from "../_global/interface";

// Status Filters
const STATUS_FILTERS = [
  "All",
  "Completed", // Moved Completed up for logical grouping in UI, doesn't affect logic
  "In Progress",
  "On Hold", // Added On Hold here
  "Not Started",
  "Skipped",
] as const; // Order here only affects button display order
type StatusFilter = (typeof STATUS_FILTERS)[number];

// Desired Sort Order Map
const STATUS_SORT_ORDER: Record<RoadmapItem["status"], number> = {
  Completed: 1,
  "In Progress": 2,
  "On Hold": 3,
  "Not Started": 4,
  Skipped: 5,
};

// Priority Tag Styles (Keep as is)
const PRIORITY_STYLES: Record<RoadmapItem["priority"], string> = {
  Low: "border-green-300 bg-green-50 text-green-700",
  Medium: "border-yellow-300 bg-yellow-50 text-yellow-700",
  High: "border-red-300 bg-red-50 text-red-700",
};

// Status Styles (Dot and Tag) (Keep as is)
const STATUS_STYLES: Record<
  RoadmapItem["status"],
  { dot: string; tag: string }
> = {
  Completed: {
    dot: "bg-green-500 border-green-600",
    tag: "border-green-300 bg-green-50 text-green-700",
  },
  "In Progress": {
    dot: "bg-yellow-500 border-yellow-600",
    tag: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  "Not Started": {
    dot: "bg-gray-400 border-gray-500",
    tag: "border-gray-300 bg-gray-50 text-gray-700",
  },
  Skipped: {
    dot: "bg-red-500 border-red-600",
    tag: "border-red-300 bg-red-50 text-red-700",
  },
  "On Hold": {
    dot: "bg-blue-500 border-blue-600",
    tag: "border-blue-300 bg-blue-50 text-blue-700",
  },
};

// Date Formatting Options (Keep as is)
const dateOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

// --- Component ---

const RoadmapPage = () => {
  // UPDATED: Default filter is now "In Progress"
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>("In Progress");

  // Sort the entire roadmap based on the desired status order first
  // useMemo ensures this sorting only happens once unless APP_ROADMAP changes
  const sortedRoadmap = useMemo(() => {
    return [...APP_ROADMAP].sort((a, b) => {
      // Primary sort: Status Order
      const statusComparison =
        STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status];
      if (statusComparison !== 0) {
        return statusComparison;
      }
      // Secondary sort (optional): End Date (descending - newest first)
      // You could add more sorting criteria here if needed (e.g., priority)
      return b.endDate.getTime() - a.endDate.getTime();
    });
  }, []); // Dependency array includes APP_ROADMAP if it could change dynamically, otherwise empty

  // Filter the pre-sorted list based on the selected status filter
  const filteredRoadmap = useMemo(() => {
    if (selectedStatus === "All") {
      return sortedRoadmap; // Return the full sorted list
    } else {
      // Filter the already sorted list
      return sortedRoadmap.filter((item) => item.status === selectedStatus);
    }
  }, [selectedStatus, sortedRoadmap]); // Re-filter when status or sorted list changes

  // Animation variants (Keep as is)
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    // Use consistent background, added more padding
    <div
      className="min-h-screen w-full
     bg-gradient-to-br from-slate-50 via-white to-blue-100 py-16 md:py-24 px-4"
    >
      <div className="w-full max-w-4xl mx-auto mt-20">
        {/* Header (Keep as is) */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            Development Roadmap
          </h1>
          <p className="text-lg text-gray-600">
            Follow our progress and see what&apos;s coming next.
          </p>
        </motion.div>

        {/* Filter Buttons (Keep as is - order defined in STATUS_FILTERS) */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status}
              onClick={() => setSelectedStatus(status)}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-150 ${
                selectedStatus === status
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-sm" // Active style
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50" // Inactive style
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Roadmap Timeline - Now maps over the sorted and filtered list */}
        <motion.div
          className="relative border-l-2 border-indigo-200/80 ml-2 space-y-10 md:space-y-12"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredRoadmap.length > 0 ? (
              // Map over the correctly sorted and filtered list
              filteredRoadmap.map((item) => (
                <motion.div
                  key={`${item.devName}-${item.status}`} // Using a slightly more unique key
                  className="relative flex items-start pl-8"
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Dot on the timeline (Keep as is) */}
                  <div className="absolute left-0 top-1 transform -translate-x-1/2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        STATUS_STYLES[item.status]?.dot ??
                        "bg-gray-400 border-gray-500"
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Content Box (Keep as is) */}
                  <div className="flex-1 space-y-2">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                      {item.devName}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm">
                      <Badge
                        variant="outline"
                        className={`font-medium ${
                          STATUS_STYLES[item.status]?.tag ??
                          "border-gray-300 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`font-medium ${
                          PRIORITY_STYLES[item.priority] ??
                          "border-gray-300 bg-gray-50 text-gray-700"
                        }`}
                      >
                        {item.priority} Priority
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Est:{" "}
                        {item.startDate.toLocaleDateString(
                          undefined,
                          dateOptions
                        )}{" "}
                        -{" "}
                        {item.endDate.toLocaleDateString(
                          undefined,
                          dateOptions
                        )}
                      </span>
                    </div>
                    {item.comments && (
                      <p className="text-xs text-gray-500 pt-1 italic">
                        Note: {item.comments}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              // No items message (Keep as is)
              <motion.div
                key="no-items"
                className="text-center text-gray-500 pl-8 py-4"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                No items match the selected filter.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapPage;
