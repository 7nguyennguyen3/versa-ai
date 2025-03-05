"use client";
import { useState } from "react";
import { APP_ROADMAP } from "../_global/variables";
import { Button } from "@/components/ui/button";

const STATUS_FILTERS = [
  "All",
  "In Progress",
  "Completed",
  "Not Started",
  "Skipped",
  "On Hold",
];

const PRIORITY_COLORS = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

const RoadmapPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filteredRoadmap =
    selectedStatus === "All"
      ? APP_ROADMAP
      : APP_ROADMAP.filter((item) => item.status === selectedStatus);

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50 py-12">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Development Roadmap
        </h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {STATUS_FILTERS.map((status) => (
            <Button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === status
                  ? " text-white"
                  : " bg-gray-200 text-zinc-500 "
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Roadmap Items */}
        <div className="flex flex-col border-l-2 border-gray-300 space-y-8">
          {filteredRoadmap.length > 0 ? (
            filteredRoadmap.map((item, index) => (
              <div key={index} className="flex items-start">
                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white self-center ${
                    item.status === "Completed"
                      ? "bg-green-500"
                      : item.status === "In Progress"
                      ? "bg-yellow-500"
                      : item.status === "Not Started"
                      ? "bg-gray-400"
                      : item.status === "Skipped"
                      ? "bg-red-500"
                      : item.status === "On Hold"
                      ? "bg-blue-500"
                      : "bg-purple-500"
                  }`}
                ></div>

                {/* Content */}
                <div className="ml-6 flex-1">
                  <h2 className="text-xl font-semibold">{item.devName}</h2>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : item.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Not Started"
                          ? "bg-gray-100 text-gray-800"
                          : item.status === "Skipped"
                          ? "bg-red-100 text-red-800"
                          : item.status === "On Hold"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        PRIORITY_COLORS[item.priority]
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.startDate.toLocaleDateString()} -{" "}
                      {item.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  {item.comments && (
                    <p className="text-sm text-gray-500 mt-2">
                      {item.comments}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
