"use client";

import { Button } from "@/components/ui/button";
import { FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import ChatComponent from "../_components/ChatComponent";
import { useAuthStore } from "../_store/useAuthStore";
import { useAppStore } from "../_store/useAppStore";

const PdfChatPage = () => {
  const { userId } = useAuthStore();
  const { selectedPdf } = useAppStore();
  const [viewMode, setViewMode] = useState<"chat" | "pdf">("chat");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Mobile Toggle Buttons (Only for screens less than lg) */}
      <div className="lg:hidden flex items-center space-x-4 p-4 bg-white">
        <Button
          variant={viewMode === "chat" ? "default" : "outline"}
          onClick={() => setViewMode("chat")}
          className="flex items-center space-x-2"
        >
          <MessageSquare className="w-5 h-5" />
          Chat
        </Button>
        <Button
          variant={viewMode === "pdf" ? "default" : "outline"}
          onClick={() => setViewMode("pdf")}
          className="flex items-center space-x-2"
        >
          <FileText className="w-5 h-5" />
          PDF
        </Button>
      </div>

      {/* Chat Section (Visible on all screens, but toggled on mobile) */}
      <div
        className={`bg-white p-2 rounded-lg shadow-md flex flex-col flex-grow pt-4 ${
          viewMode === "chat" ? "flex" : "hidden"
        } lg:flex lg:w-[50%] 2xl:w-[40%]`}
      >
        <h1 className="text-2xl font-semibold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Versa PDF Chat
        </h1>
        <ChatComponent userId={userId} />
      </div>

      {/* PDF Viewer (Visible on all screens, but toggled on mobile) */}
      <div
        className={`p-3 w-full lg:w-[50%] 2xl:w-[60%] bg-white flex justify-center h-full ${
          viewMode === "pdf" ? "flex" : "hidden"
        } lg:flex`}
      >
        {selectedPdf ? (
          <iframe
            src={selectedPdf.pdfUrl}
            className="w-full h-full border-2 border-gray-400 rounded-lg shadow-lg"
            style={{ height: "calc(100vh)" }}
          />
        ) : (
          <p className="text-center text-gray-500">No PDF selected</p>
        )}
      </div>
    </div>
  );
};

export default PdfChatPage;
