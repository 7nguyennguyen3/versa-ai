"use client";
import { MarkdownText } from "@/components/markdown/markdown-text";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, FileText, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { sendMessage } from "../_hooks/useChatSend";
import { useAppStore } from "../_store/useAppStore";
import GearSettings from "./GearSettings";
import { StickyToBottomContent } from "./StickToBottom";

interface ChatComponentProps {
  userId: string | null;
}

interface PdfSidebarProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const PdfSidebar: React.FC<PdfSidebarProps> = ({ pdfUrl, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-full bg-white shadow-lg z-50"
        >
          <div className="p-4 flex justify-center items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[14px] text-gray-500 font-semibold"
            >
              Press <span className="text-blue-600 font-semibold">Esc</span> to
              quickly open or close PDF view
            </motion.div>
            <Button onClick={onClose} size="sm" variant="destructive">
              Close
            </Button>
          </div>
          <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ChatComponent: React.FC<ChatComponentProps> = ({ userId }) => {
  const { messages, isChatLoading, currentChatId, currentPdfId, selectedPdf } =
    useAppStore();
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"chat" | "pdf">("chat");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Clear error when a chat or pdf is selected
  useEffect(() => {
    if (currentChatId || currentPdfId) {
      setError(null);
    }
  }, [currentChatId, currentPdfId]);

  const handleStreamUpdate = useCallback((data: string) => {
    setStreamingResponse(data);
  }, []);

  const handleStreamComplete = useCallback(() => {
    setStreamingResponse("");
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/get-token");
        const data = await response.json();
        if (data.token) setToken(data.token);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };
    fetchToken();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !token) return;

    if (!currentChatId && !currentPdfId) {
      setError("Please select a PDF before sending a message.");
      return;
    }

    setError(null);

    try {
      await sendMessage({
        message,
        userId,
        token,
        onStreamUpdate: handleStreamUpdate,
        onStreamComplete: handleStreamComplete,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Auto-adjust the textarea's height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 360)}px`;
    }
  }, [message]);

  // Automatically scroll when new messages arrive
  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isChatLoading, streamingResponse]);

  // Toggle PDF view with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeView === "pdf") {
          setActiveView("chat");
        } else if (activeView === "chat" && selectedPdf) {
          setActiveView("pdf");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, selectedPdf]);

  return (
    <div className="flex-1 flex flex-col h-screen relative">
      {/* PDF Sidebar overlays the chat view */}
      {selectedPdf && (
        <PdfSidebar
          pdfUrl={selectedPdf.pdfUrl}
          isOpen={activeView === "pdf"}
          onClose={() => setActiveView("chat")}
        />
      )}

      {activeView === "chat" && (
        // Using StickToBottom container to wrap content and footer.
        <StickToBottom className="relative flex-1 overflow-hidden pt-20">
          <StickyToBottomContent
            className="absolute inset-0 overflow-y-scroll h-screen"
            contentClassName="max-w-3xl w-full mx-auto p-4 flex flex-col gap-8 min-h-[calc(100vh-200px)]" // <-- Note the min-height here.
            content={
              <div className="flex flex-col gap-8 pt-20">
                {messages.length === 0 && !isChatLoading ? (
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 h-[75vh]">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-medium">
                      How can I help you today?
                    </h3>
                    <p className="mt-2">Ask questions about your document</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`relative max-w-full lg:max-w-[85%] ${
                        msg.role === "human" ? "self-end" : "self-start"
                      }`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`rounded-xl p-4 ${
                          msg.role === "human"
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                        }`}
                      >
                        <MarkdownText>
                          {msg.content.replace(/<br\s*\/?>/gi, "\n")}
                        </MarkdownText>
                      </div>
                      {/* Absolute Positioned Avatar using shadcn-ui */}
                      <div
                        className={`absolute bottom-[-10px] ${
                          msg.role === "human"
                            ? "right-[-10px]"
                            : "left-[-10px]"
                        }`}
                      >
                        {msg.role === "human" ? (
                          <Avatar className="w-6 h-6 text-white bg-black items-center">
                            <AvatarFallback className="m-auto">
                              U
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src="/ai-avatar.jpeg"
                              alt="AI Avatar"
                            />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isChatLoading && !streamingResponse && (
                  <div className="relative max-w-full lg:max-w-[85% self-start gap-2 mb-10">
                    <div className="bg-white border rounded-lg p-4 space-y-2">
                      <Skeleton className="h-4 w-[290px] bg-gray-200" />
                      <Skeleton className="h-4 w-[250px] bg-gray-200" />
                      <Skeleton className="h-4 w-[200px] bg-gray-200" />
                    </div>
                    <Avatar className="w-6 h-6 absolute bottom-[-10px] left-[-10px]">
                      <AvatarImage src="/ai-avatar.jpeg" alt="AI Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {streamingResponse && (
                  <div className="relative max-w-[85%] self-start gap-2 mb-10">
                    <div className="bg-white border rounded-lg p-4">
                      <MarkdownText>
                        {streamingResponse.replace(/<br\s*\/?>/gi, "\n")}
                      </MarkdownText>
                    </div>
                    <Avatar className="w-6 h-6 absolute bottom-[-10px] left-[-10px]">
                      <AvatarImage src="/ai-avatar.jpeg" alt="AI Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            }
            footer={
              <div className="w-full px-4 max-w-3xl mx-auto">
                <div className="bg-gray-100 p-2 sm:p-4 rounded-3xl shadow-md mx-auto w-full max-w-3xl mb-10">
                  {error && (
                    <div className="text-red-500 text-sm px-3 py-2 bg-red-50 rounded-lg mb-3">
                      ⚠️ {error}
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    className="w-full min-h-[60px] max-h-[200px] p-2 focus:outline-none text-sm md:text-[16px] lg:text-lg bg-transparent"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    disabled={isChatLoading}
                  />
                  <div className="flex justify-between items-center mt-2 text-xs text-black">
                    <GearSettings
                      userId={userId}
                      component={
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"outline"}
                                size="sm"
                                onClick={() => setActiveView("pdf")}
                                disabled={!selectedPdf}
                                className="gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                Open Document
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click or press Esc</p>
                              <p>to open PDF View</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                    />
                    <Button
                      className="h-8 w-4 rounded-full"
                      onClick={handleSendMessage}
                      disabled={isChatLoading || !message.trim()}
                    >
                      <ArrowUp className="scale-125" />
                    </Button>
                  </div>
                </div>
              </div>
            }
          />
        </StickToBottom>
      )}
    </div>
  );
};

export default ChatComponent;
