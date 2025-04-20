"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  BotMessageSquare,
  Clock,
  Cpu,
  Database,
  FileText,
  Lightbulb,
  Loader2,
  Lock,
  MessageSquare,
  PlusCircleIcon,
  Settings,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatSession, PDFDocument } from "../../_global/interface";
import { MODEL_OPTIONS, RETRIEVAL_OPTIONS } from "../../_global/variables";
import { useAppStore } from "../../_store/useAppStore";
import { MarkdownText } from "@/components/markdown/mardown-text-new";
import Tutorial from "./Tutorial";

export interface StreamHandlers {
  onChunkReceived: (chunk: string) => void;
  onStreamComplete: (finalMessage: string) => void;
  onStreamError: (errorMessage: string) => void;
}
export interface SendMessageHandlerParams {
  message: string;
  pdfId: string;
  chatId: string | null;
  model: string;
  retrievalMethod: string;
  streamHandlers: StreamHandlers;
}
export interface UniversalChatComponentProps {
  isDemo: boolean;
  userId?: string | null;
  onSendMessage: (params: SendMessageHandlerParams) => Promise<void>;
  pdfDataSource: PDFDocument[];
  initialPdf?: PDFDocument;
  onDemoPdfSelected?: (pdf: PDFDocument) => void;
  onDemoNewChat?: () => void;
}

interface PdfSidebarProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
}
const PdfSidebar: React.FC<PdfSidebarProps> = ({ pdfUrl, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        e.key === "Escape" &&
        isOpen &&
        activeElement?.tagName !== "IFRAME" &&
        !activeElement?.closest('[data-testid="pdf-sidebar-content"]')
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay - ADDED */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40" // z-40 is below sidebar (z-50)
            onClick={onClose} // Close sidebar when clicking the backdrop
            aria-hidden="true" // Indicate it's decorative for accessibility
          />

          {/* Sidebar Content */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full md:w-3/4 lg:w-1/2 bg-white shadow-lg z-50 border-r border-gray-200 flex flex-col" // Added flex flex-col
            data-testid="pdf-sidebar-content" // Added test ID for focus check if needed
          >
            <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10 flex-shrink-0">
              {" "}
              {/* Added flex-shrink-0 */}
              {/* UPDATED MESSAGE */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-500 font-medium hidden sm:block"
              >
                Click outside or press{" "}
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
                  Esc
                </kbd>{" "}
                to close.
                <span className="text-xs block text-gray-400 mt-0.5">
                  (Note: Esc might require clicking outside the PDF first if
                  it&apos;s active)
                </span>
              </motion.div>
              <Button onClick={onClose} size="sm" variant="outline">
                Close View
              </Button>
            </div>
            <div className="flex-grow">
              {" "}
              {/* Added flex-grow wrapper for iframe */}
              <iframe
                src={pdfUrl}
                className="w-full h-full" // Occupy full space of the flex-grow container
                title="PDF Viewer"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- BouncingDotsLoader Component --- (Keep as is)
const BouncingDotsLoader = () => (
  <div className="flex space-x-1.5 p-2">
    <span className="animate-[bounce_1s_infinite_0.1s] w-2 h-2 bg-blue-500 rounded-full"></span>
    <span className="animate-[bounce_1s_infinite_0.2s] w-2 h-2 bg-blue-500 rounded-full"></span>
    <span className="animate-[bounce_1s_infinite_0.3s] w-2 h-2 bg-blue-500 rounded-full"></span>
  </div>
);

const UniversalChatComponent: React.FC<UniversalChatComponentProps> = ({
  isDemo,
  userId, // Assumed to be non-null if isDemo is false (enforce in parent)
  onSendMessage,
  pdfDataSource, // Used for Demo PDF selection
  initialPdf,
  onDemoPdfSelected,
  onDemoNewChat,
}) => {
  // Store State...
  const {
    messages,
    isChatLoading,
    currentChatId,
    selectedPdf,
    selectedChat, // Added for auth chat selection display
    selectedModel,
    selectedRetrievalMethod,
    pdfOptions, // Added for auth PDF selection
    chatOptions, // Added for auth chat selection
    isLoadingOptions, // Added for loading states in settings
    addMessage,
    setChatLoading,
    setCurrentPdf,
    setCurrentChat, // Added for auth chat selection action
    setModel,
    setRetrievalMethod,
    resetDemoState,
    updateMessagesFromHistory,
    fetchPdfOptions, // Added action
    fetchChatOptions, // Added action
    addNewChatSession, // Added action
  } = useAppStore();

  // Local State...
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPdfSidebarOpen, setIsPdfSidebarOpen] = useState(false);
  const [openTutorial, setOpenTutorial] = useState(false);
  const [streamingAiResponse, setStreamingAiResponse] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- Effects ---

  // Initial setup for Demo or fetch data for Authenticated
  useEffect(() => {
    if (isDemo) {
      resetDemoState();
      if (initialPdf && !selectedPdf) {
        setCurrentPdf(initialPdf);
        updateMessagesFromHistory([]);
      }
    } else if (userId) {
      // Fetch initial data for authenticated user
      // fetchPdfOptions(userId);
      // fetchChatOptions(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDemo,
    userId,
    resetDemoState,
    initialPdf,
    setCurrentPdf,
    fetchPdfOptions,
    fetchChatOptions,
  ]);

  useEffect(() => {
    if (currentChatId || selectedPdf) {
      setError(null);
    }
  }, [currentChatId, selectedPdf]);

  // Textarea height adjustment
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Keep max height
    }
  }, [message]);

  // Scroll to bottom
  useEffect(() => {
    // Delay scroll slightly to allow layout updates after streaming/loading state changes
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, [messages, streamingAiResponse, isChatLoading]); // Trigger on loading state too

  // PDF Toggle Keybind
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle PDF sidebar with Escape, but only if a PDF is selected
      if (e.key === "Escape" && selectedPdf) {
        setIsPdfSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPdf]); // Depend only on selectedPdf

  // --- Stream Handling Callbacks --- (Keep as is)
  const handleChunkReceived = useCallback((chunk: string) => {
    setStreamingAiResponse((prev) => prev + chunk);
  }, []);

  const handleStreamComplete = useCallback(
    (finalMessage: string) => {
      setChatLoading(false);
      setStreamingAiResponse("");
      if (finalMessage.trim()) {
        // Replace the temporary AI message or add a new one
        // Check if the last message was a temporary placeholder (optional)
        // For simplicity, just add the final message. Ensure `addMessage` handles potential duplicates if needed.
        addMessage({ role: "ai", content: finalMessage });
      }
      // Ensure scroll happens after state update
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [addMessage, setChatLoading]
  );

  const handleStreamError = useCallback(
    (errorMessage: string) => {
      setChatLoading(false);
      setStreamingAiResponse("");
      setError(errorMessage || "An error occurred during the stream.");
      // Ensure scroll happens after state update
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [setChatLoading]
  );

  const handleSendMessageInternal = async () => {
    if (!message.trim()) return;

    // Validation: Ensure a PDF is selected
    if (!selectedPdf) {
      setError(
        isDemo
          ? "Please select a PDF using the Settings icon first."
          : "Please select a PDF document first using the Settings (⚙️) icon." // Updated error message for auth
      );
      return;
    }

    // Validation: Ensure userId exists for authenticated chat (should be guaranteed by parent)
    if (!isDemo && !userId) {
      setError("User information is missing. Please reload.");
      console.error("User ID is missing for authenticated chat.");
      return;
    }

    const messageToSend = message;
    addMessage({ role: "human", content: messageToSend });
    setMessage(""); // Clear input after adding user message
    setError(null);
    setChatLoading(true);
    setStreamingAiResponse(""); // Clear previous stream immediately

    const streamHandlers: StreamHandlers = {
      onChunkReceived: handleChunkReceived,
      onStreamComplete: handleStreamComplete,
      onStreamError: handleStreamError,
    };

    try {
      await onSendMessage({
        message: messageToSend,
        pdfId: selectedPdf.pdfId,
        chatId: currentChatId, // Pass currentChatId from store
        model: selectedModel,
        retrievalMethod: selectedRetrievalMethod,
        streamHandlers: streamHandlers,
      });
    } catch (err: any) {
      console.error("Failed to initiate send message:", err);
      // Use handleStreamError to centralize error display and loading state reset
      handleStreamError(err.message || "Failed to start message stream.");
    }
    // No finally block needed as handleStreamError/Complete resets loading state
  };

  const handleDemoPdfChange = (pdfUrl: string) => {
    const pdf = pdfDataSource.find((p) => p.pdfUrl === pdfUrl);
    if (pdf) {
      setCurrentPdf(pdf);
      updateMessagesFromHistory([]);
      setStreamingAiResponse("");
      setError(null);
      if (onDemoPdfSelected) {
        onDemoPdfSelected(pdf);
      }
    }
  };
  const handleDemoNewChatClick = () => {
    updateMessagesFromHistory([]);
    setStreamingAiResponse("");
    setError(null);
    if (onDemoNewChat) {
      onDemoNewChat();
    }
  };

  const handleAuthPdfSelection = (pdfId: string) => {
    const pdf = pdfOptions.find((p) => p.pdfId === pdfId);
    if (pdf) {
      setCurrentPdf(pdf);
      if (!currentChatId && userId) {
        const newSessionId = uuidv4();
        const newChat: ChatSession = {
          title: "New Chat",
          chat_session_id: newSessionId,
          chat_history: [],
          last_activity: new Date(),
          latest_pdfId: pdfId,
          userId: userId,
          isNewSession: true,
        };
        addNewChatSession(userId, newSessionId);
        setCurrentChat(newChat);
        updateMessagesFromHistory([]);
      }
      setError(null);
      setStreamingAiResponse("");
    }
  };

  const handleAuthChatSelection = (sessionId: string) => {
    const chat = chatOptions.find((c) => c.chat_session_id === sessionId);
    const pdf = pdfOptions.find((p) => p.pdfId === chat?.latest_pdfId); // Find associated PDF
    if (chat) {
      setCurrentChat(chat);
      updateMessagesFromHistory(chat.chat_history || []); // Load history
      setCurrentPdf(pdf || null); // Set the associated PDF, or null if not found/set
      setError(null); // Clear error on selection change
      setStreamingAiResponse(""); // Clear any pending stream
    }
  };

  const handleAuthNewChat = () => {
    if (!userId) return; // Should not happen if logic is correct

    const newSessionId = uuidv4();
    addNewChatSession(userId, newSessionId);

    // Immediately set the new chat as current
    const newChat: ChatSession = {
      title: "New Chat", // Default title
      chat_session_id: newSessionId,
      chat_history: [],
      last_activity: new Date(),
      latest_pdfId: selectedPdf?.pdfId || "", // Associate current PDF if one is selected
      userId: userId,
      isNewSession: true,
    };
    setCurrentChat(newChat);
    updateMessagesFromHistory([]); // Start with empty messages
    // Keep the currently selected PDF (or clear it if desired?) - Current keeps it.
    // setCurrentPdf(null); // Uncomment to clear PDF on new chat
    setError(null); // Clear error on selection change
    setStreamingAiResponse(""); // Clear any pending stream
  };

  const togglePdfView = useCallback(() => {
    if (selectedPdf) {
      setIsPdfSidebarOpen((prev) => !prev);
    } else {
      setError(
        isDemo
          ? "Select a Demo PDF first"
          : "Select a PDF document first using Settings (⚙️)"
      );
    }
  }, [selectedPdf, isDemo]);

  const handlePromptSuggestionClick = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  const promptSuggestions = [
    `Give me a quick overview of ${selectedPdf?.pdfName}.`,
    `Explain key concepts in ${selectedPdf?.pdfName}. `,
    `What is interesting about ${selectedPdf?.pdfName}?`,
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-blue-100">
      {selectedPdf && (
        <PdfSidebar
          pdfUrl={selectedPdf.pdfUrl}
          isOpen={isPdfSidebarOpen}
          onClose={() => setIsPdfSidebarOpen(false)}
        />
      )}
      {openTutorial && <Tutorial setOpenTutorial={setOpenTutorial} />}

      <div className="flex-1 overflow-y-auto p-4 pt-6 custom-scrollbar">
        {" "}
        <div className="max-w-3xl w-full mx-auto flex flex-col gap-6 pt-10 pb-10 sm:pt-20">
          {" "}
          {isDemo && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-center text-xs sm:text-sm p-3 rounded-lg shadow-sm">
              This is a demo environment. Chats are not saved.{" "}
              <a
                href="/sign-up"
                className="font-semibold underline hover:text-yellow-900"
              >
                Sign up
              </a>{" "}
              for the full experience.
            </div>
          )}
          {/* Message List Rendering */}
          {messages.length === 0 && !isChatLoading && !streamingAiResponse ? (
            // --- Empty State ---
            <div className="flex flex-col items-center justify-center text-center text-gray-500 flex-1 pt-10 sm:pt-20">
              <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-700">
                {selectedPdf
                  ? `Ask about ${selectedPdf.pdfName}`
                  : isDemo
                  ? "Select a demo PDF or start typing"
                  : "Select a PDF to begin chatting."}
              </h3>
              <p className="mt-2 text-gray-600">
                {selectedPdf
                  ? "Start by typing your question below or try a suggestion."
                  : "Use the (⚙️) icon to select a pdf or (💡) icon for help."}
              </p>

              {/* Prompt Suggestions */}
              {selectedPdf && (
                <div className="mt-8 flex flex-wrap justify-center gap-2 px-4">
                  {promptSuggestions.slice(0, 3).map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm bg-white/50 hover:bg-white/80 text-blue-600 border-blue-200 hover:border-blue-300"
                      onClick={() => handlePromptSuggestionClick(prompt)}
                    >
                      <Sparkles className="h-3 w-3 mr-2 text-yellow-500" />
                      {prompt}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // --- Message Mapping ---
            [...messages].map(
              (
                msg,
                index // Iterate over a copy
              ) => (
                <div
                  key={`${msg.role}-${index}-${msg.pdfId}`}
                  className={`relative flex w-full ${
                    msg.role === "human" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-full lg:max-w-[85%] flex items-start gap-2 ${
                      msg.role === "human" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-7 h-7 mt-1 flex-shrink-0 hidden sm:block">
                      {msg.role === "human" ? (
                        <div className="flex items-center justify-center w-full h-full rounded-full bg-blue-100 dark:bg-blue-900">
                          <User className="w-4.5 h-4.5 text-blue-600 dark:text-blue-300" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center w-full h-full rounded-full bg-gray-200 dark:bg-gray-600">
                            <BotMessageSquare className="w-4.5 h-4.5 text-gray-800 dark:text-gray-300" />
                          </div>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-xl p-3 shadow-sm max-w-full ${
                        msg.role === "human"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      {/* Ensure content is treated as string */}

                      <MarkdownText>
                        {typeof msg.content === "string"
                          ? msg.content.replace(/<br\s*\/?>/gi, "\n")
                          : ""}
                      </MarkdownText>
                    </div>
                  </div>
                </div>
              )
            )
          )}
          {isChatLoading && !streamingAiResponse && (
            <div className="relative flex w-full justify-start">
              <div className="relative max-w-[85%] flex items-start gap-2">
                <div className="flex items-center justify-center w-full h-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <BotMessageSquare className="w-4.5 h-4.5 text-gray-800 dark:text-gray-300" />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm min-h-[40px] flex items-center">
                  <BouncingDotsLoader />
                </div>
              </div>
            </div>
          )}
          {/* Streaming Response Rendering (shown when streamingAiResponse has content) */}
          {streamingAiResponse && (
            <div className="relative flex w-full justify-start">
              <div className="relative max-w-[85%] flex items-start gap-2">
                <Avatar className="w-7 h-7 mt-1 flex-shrink-0">
                  <AvatarImage src="/ai-avatar.jpeg" alt="AI Avatar" />
                  <AvatarFallback className="bg-neutral-700 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-full">
                  <MarkdownText>
                    {/* Ensure content is treated as string */}
                    {typeof streamingAiResponse === "string"
                      ? streamingAiResponse.replace(/<br\s*\/?>/gi, "\n")
                      : ""}
                  </MarkdownText>
                </div>
              </div>
            </div>
          )}
          {/* Scroll Ref */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area Footer */}
      <div className="w-full px-4 pb-4 pt-2 bg-gradient-to-t from-slate-100/90 via-slate-50/70 to-transparent backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 border border-gray-200/80 p-2 sm:p-3 rounded-xl shadow-lg relative backdrop-blur-md">
            {/* Error Display */}
            {error && (
              <div className="text-red-600 text-xs px-3 py-2 bg-red-50 border border-red-200 rounded-md mb-2">
                ⚠️ {error}
              </div>
            )}
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="w-full p-2 focus:outline-none text-sm md:text-base bg-transparent resize-none border-none overflow-y-auto custom-scrollbar"
              placeholder={
                selectedPdf
                  ? `Ask a question about ${selectedPdf.pdfName}...`
                  : "Select a PDF using Settings (⚙️) to begin..."
              }
              value={message}
              rows={1}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent newline on Enter
                  handleSendMessageInternal();
                }
              }}
              disabled={isChatLoading || (!isDemo && !selectedPdf)} // Also disable if no PDF selected in auth mode
              style={{ minHeight: "48px" }} // Ensure minimum height
            />
            {/* Action Buttons Row */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              {/* Left Aligned Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* --- Conditional Settings --- */}
                {isDemo ? (
                  // --- Demo Settings ---
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-black hover:text-blue-600 h-8 w-8"
                          aria-label="Select Demo Document"
                        >
                          <Settings className="scale-125" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        <div className="px-3 py-2 font-medium text-sm">
                          Select Demo PDF
                        </div>
                        {pdfDataSource.map((pdf) => (
                          <DropdownMenuItem
                            key={pdf.pdfId}
                            onSelect={() => handleDemoPdfChange(pdf.pdfUrl)}
                            disabled={pdf.pdfUrl === selectedPdf?.pdfUrl}
                          >
                            {pdf.pdfName}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDemoNewChatClick}
                            className="text-black hover:text-blue-600 h-8 w-8"
                            aria-label="Start New Demo Chat Context"
                          >
                            <PlusCircleIcon className="scale-125" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Clear Chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpenTutorial(true)}
                            className="text-black hover:text-blue-600 h-8 w-8"
                            aria-label="Start New Demo Chat Context"
                          >
                            <Lightbulb className="scale-125" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Open Tutorial</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : (
                  // --- Authenticated User Settings ---
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          // Consider slightly larger for easier clicking:
                          // className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 h-9 w-9"
                          className="text-black hover:text-blue-600 h-8 w-8" // Kept original size, adjust if needed
                          aria-label="Chat Settings"
                        >
                          <Settings className="scale-125" />{" "}
                          {/* Adjusted icon size slightly */}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        // Use sideOffset for spacing from trigger, alignOffset for fine horizontal tuning
                        sideOffset={8}
                        // Removed ml-[-10px]
                        // Increased padding slightly, adjusted width if needed
                        className="w-72 p-4 bg-white shadow-lg rounded-lg border border-gray-200 space-y-4" // Added space-y-4 for sections
                      >
                        {/* --- PDF Selection Section --- */}
                        <div className="space-y-2">
                          {" "}
                          {/* Group label and select */}
                          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            Document
                          </h3>
                          <Select
                            onValueChange={handleAuthPdfSelection}
                            value={selectedPdf?.pdfId || ""}
                            disabled={isLoadingOptions} // Disable select while loading options
                          >
                            <SelectTrigger className="h-10 text-sm">
                              <SelectValue placeholder="Select a PDF (Required)" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingOptions ? (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 px-3 py-4">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Loading documents...
                                </div>
                              ) : pdfOptions.length === 0 ? (
                                <div className="text-sm text-center text-gray-500 px-3 py-4">
                                  No PDFs uploaded yet.
                                </div>
                              ) : (
                                [...pdfOptions]
                                  .sort(
                                    (a, b) =>
                                      new Date(b.uploadedAt || 0).getTime() -
                                      new Date(a.uploadedAt || 0).getTime()
                                  )
                                  .map((pdf) => {
                                    const isPending =
                                      pdf.pdfIngestionStatus === "pending";
                                    const isFailed =
                                      pdf.pdfIngestionStatus === "failed";
                                    const isDisabled = isPending || isFailed;

                                    return (
                                      <SelectItem
                                        key={pdf.pdfId}
                                        value={pdf.pdfId}
                                        disabled={isDisabled}
                                        className="text-sm py-2" // Added padding
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          {" "}
                                          {/* Use justify-between */}
                                          <span className="flex items-center gap-2 truncate">
                                            {/* Optional: Keep lock icon for disabled look */}
                                            {/* {isDisabled && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />} */}
                                            <span
                                              className="truncate"
                                              title={pdf.pdfName}
                                            >
                                              {pdf.pdfName}
                                            </span>
                                          </span>
                                          {/* Status Icons */}
                                          {isPending && (
                                            <span
                                              title="Processing..."
                                              className="flex items-center gap-1 text-xs text-orange-600 ml-auto flex-shrink-0"
                                            >
                                              <Clock className="w-3.5 h-3.5" />
                                              {/* Optional: Text indicator */}
                                              {/* Processing */}
                                            </span>
                                          )}
                                          {isFailed && (
                                            <span
                                              title="Processing Failed"
                                              className="flex items-center gap-1 text-xs text-red-600 ml-auto flex-shrink-0"
                                            >
                                              <XCircle className="w-3.5 h-3.5" />
                                              {/* Optional: Text indicator */}
                                              {/* Failed */}
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    );
                                  })
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <DropdownMenuSeparator className="bg-gray-100" />

                        {/* --- Chat History Section --- */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            Chat History
                          </h3>
                          <Select
                            onValueChange={handleAuthChatSelection}
                            value={selectedChat?.chat_session_id || ""}
                            disabled={isLoadingOptions}
                          >
                            <SelectTrigger className="h-10 text-sm">
                              <SelectValue placeholder="Select a Chat" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingOptions ? (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 px-3 py-4">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Loading chats...
                                </div>
                              ) : chatOptions.length === 0 ? (
                                <div className="text-sm text-center text-gray-500 px-3 py-4">
                                  No previous chats found.
                                </div>
                              ) : (
                                [...chatOptions]
                                  .sort(
                                    (a, b) =>
                                      new Date(b.last_activity || 0).getTime() -
                                      new Date(a.last_activity || 0).getTime()
                                  )
                                  .map((chat) => (
                                    <SelectItem
                                      key={chat.chat_session_id}
                                      value={chat.chat_session_id}
                                      className="text-sm py-2" // Added padding
                                    >
                                      <span
                                        className="truncate"
                                        title={
                                          chat.title ||
                                          `Chat from ${new Date(
                                            chat.last_activity!
                                          ).toLocaleDateString()}`
                                        }
                                      >
                                        {chat.title ||
                                          `Chat from ${new Date(
                                            chat.last_activity!
                                          ).toLocaleDateString()}`}
                                      </span>
                                    </SelectItem>
                                  ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <DropdownMenuSeparator className="bg-gray-100" />

                        {/* --- AI Configuration Section --- */}
                        <div className="space-y-4">
                          {" "}
                          {/* Group Model & Retrieval */}
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-gray-500" />
                              AI Model
                            </h3>
                            <Select
                              onValueChange={setModel}
                              value={selectedModel}
                            >
                              <SelectTrigger className="h-10 text-sm">
                                <SelectValue placeholder="Select Model" />
                              </SelectTrigger>
                              <SelectContent>
                                {MODEL_OPTIONS.map((model) => (
                                  <SelectItem
                                    key={model.value}
                                    value={model.value}
                                    disabled={model.disabled}
                                    className="text-sm py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      {model.disabled && (
                                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                                      )}
                                      {model.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Database className="w-4 h-4 text-gray-500" />{" "}
                              {/* Or Search icon */}
                              Retrieval Method
                            </h3>
                            <Select
                              onValueChange={setRetrievalMethod}
                              value={selectedRetrievalMethod}
                            >
                              <SelectTrigger className="h-10 text-sm">
                                <SelectValue placeholder="Select Method" />
                              </SelectTrigger>
                              <SelectContent>
                                {RETRIEVAL_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                    className="text-sm py-2" // Added padding
                                  >
                                    <div className="flex items-center gap-2">
                                      {option.disabled && (
                                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                                      )}
                                      {option.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Authenticated New Chat Button */}
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAuthNewChat}
                            className="text-black hover:text-blue-600 h-8 w-8"
                            aria-label="Start New Chat"
                            disabled={!userId} // Should always be enabled if userId is present
                          >
                            <PlusCircleIcon className="scale-125" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Start New Chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpenTutorial(true)}
                            className="text-black hover:text-blue-600 h-8 w-8"
                            aria-label="Start New Demo Chat Context"
                          >
                            <Lightbulb className="scale-125" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Open Tutorial</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size="icon"
                        onClick={togglePdfView}
                        disabled={!selectedPdf || isPdfSidebarOpen} // Disable if no PDF or already open
                        className="text-black hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed h-8 w-8"
                        aria-label="Open Document View"
                      >
                        <FileText className="scale-125" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {selectedPdf
                        ? isPdfSidebarOpen
                          ? "PDF View Open"
                          : "Open PDF View (Esc)"
                        : "Select a PDF first"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Send/Loading Button */}
              <Button
                size="icon"
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed" // Adjusted disabled style
                onClick={handleSendMessageInternal}
                disabled={
                  isChatLoading || !message.trim() || (!isDemo && !selectedPdf)
                } // Disable if loading, no message, or no PDF selected (auth)
                aria-label={isChatLoading ? "Sending..." : "Send Message"}
              >
                {isChatLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalChatComponent;
