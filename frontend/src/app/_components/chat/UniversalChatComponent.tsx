"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatSession, PDFDocument } from "../../_global/interface";
import { useAppStore } from "../../_store/useAppStore";
import ChatInputArea from "./ChatInputArea";
import ChatLoadingOrStreaming from "./ChatLoadingOrStreaming";
import ChatMessage from "./ChatMessage";
import DemoModeBanner from "./DemoModeBanner";
import PdfSidebar from "./PDFSideBar";
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

const UniversalChatComponent: React.FC<UniversalChatComponentProps> = ({
  isDemo,
  userId, // Assumed to be non-null if isDemo is false (enforce in parent)
  onSendMessage,
  pdfDataSource, // Used for Demo PDF selection
  initialPdf,
  onDemoPdfSelected,
  onDemoNewChat,
}) => {
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

  useEffect(() => {
    if (isDemo) {
      resetDemoState();
      if (initialPdf && !selectedPdf) {
        setCurrentPdf(initialPdf);
        updateMessagesFromHistory([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, userId, resetDemoState, initialPdf, setCurrentPdf]);

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

    if (!selectedPdf) {
      setError(
        isDemo
          ? "Please select a PDF using the Settings icon first."
          : "Please select a PDF document first using the Settings (⚙️) icon."
      );
      return;
    }

    if (!isDemo && !userId) {
      setError("User information is missing. Please reload.");
      console.error("User ID is missing for authenticated chat.");
      return;
    }

    const messageToSend = message;
    addMessage({ role: "human", content: messageToSend });
    setMessage("");
    setError(null);
    setChatLoading(true);
    setStreamingAiResponse("");

    const streamHandlers: StreamHandlers = {
      onChunkReceived: handleChunkReceived,
      onStreamComplete: handleStreamComplete,
      onStreamError: handleStreamError,
    };

    try {
      await onSendMessage({
        message: messageToSend,
        pdfId: selectedPdf.pdfId,
        chatId: currentChatId,
        model: selectedModel,
        retrievalMethod: selectedRetrievalMethod,
        streamHandlers: streamHandlers,
      });
    } catch (err: any) {
      console.error("Failed to initiate send message:", err);
      handleStreamError(err.message || "Failed to start message stream.");
    }
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
      latest_pdfId: selectedPdf?.pdfId || "",
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
      {openTutorial && (
        <Tutorial isOpen={openTutorial} setOpenTutorial={setOpenTutorial} />
      )}

      <div className="flex-1 overflow-y-auto p-4 pt-6 custom-scrollbar">
        {" "}
        <div className="max-w-3xl w-full mx-auto flex flex-col gap-6 pt-10 pb-10 sm:pt-20">
          {" "}
          {isDemo && <DemoModeBanner />}
          {messages.length === 0 && !isChatLoading && !streamingAiResponse ? (
            // --- Empty State ---
            <div className="flex flex-col items-center justify-center text-center text-gray-500 flex-1 pt-10 sm:pt-20">
              <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-700">
                {selectedPdf
                  ? `Ask about ${selectedPdf.pdfName}`
                  : isDemo
                  ? "Select a demo PDF or start typing"
                  : `Use the (⚙️) icon to select a PDF and begin chatting.`}
              </h3>
              <p className="mt-2 text-gray-600">
                {selectedPdf &&
                  "Use the (⚙️) icon to select a different pdf or (💡) icon for help."}
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
            [...messages].map(
              (
                msg,
                index // Iterate over a copy
              ) => (
                <ChatMessage
                  key={`${msg.role}-${index}-${msg.pdfId}`}
                  message={msg}
                  index={index}
                />
              )
            )
          )}
          <ChatLoadingOrStreaming
            isChatLoading={isChatLoading}
            streamingAiResponse={streamingAiResponse}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInputArea
        message={message}
        setMessage={setMessage}
        error={error}
        isChatLoading={isChatLoading}
        isDemo={isDemo}
        selectedPdf={selectedPdf}
        isPdfSidebarOpen={isPdfSidebarOpen}
        userId={userId}
        isLoadingOptions={isLoadingOptions}
        pdfOptions={pdfOptions}
        chatOptions={chatOptions}
        selectedChat={selectedChat}
        selectedModel={selectedModel}
        selectedRetrievalMethod={selectedRetrievalMethod}
        pdfDataSource={pdfDataSource}
        onSendMessage={handleSendMessageInternal}
        togglePdfView={togglePdfView}
        handleDemoPdfChange={handleDemoPdfChange}
        handleDemoNewChatClick={handleDemoNewChatClick}
        handleAuthPdfSelection={handleAuthPdfSelection}
        handleAuthChatSelection={handleAuthChatSelection}
        handleAuthNewChat={handleAuthNewChat}
        setOpenTutorial={setOpenTutorial}
        setModel={setModel}
        setRetrievalMethod={setRetrievalMethod}
        textareaRef={textareaRef}
      />
    </div>
  );
};

export default UniversalChatComponent;
