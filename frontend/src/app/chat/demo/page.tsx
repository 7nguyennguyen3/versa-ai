"use client";

import {
  MODEL_OPTIONS,
  publicPdfs,
  RETRIEVAL_OPTIONS,
} from "@/app/_global/variables";
import { useAppStore } from "@/app/_store/useAppStore";
import { useAuthStore } from "@/app/_store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { auth } from "firebase-admin";
import {
  FileText,
  Lock,
  MessageSquare,
  PlusCircleIcon,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";

const Demopage = () => {
  const {
    messages,
    chatData,
    isChatLoading,
    selectedPdf,
    selectedChat,
    selectedModel,
    selectedRetrievalMethod,
    addMessage,
    setChatData,
    setChatLoading,
    setCurrentPdf,
    setCurrentChat,
    setModel,
    setRetrievalMethod,
    updateMessagesFromHistory,
    resetDemoState,
  } = useAppStore();
  const { authenticated, userId } = useAuthStore();

  const [viewMode, setViewMode] = useState<"chat" | "pdf">("chat");
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const botResponseRef = useRef("");
  const lastUpdateRef = useRef(Date.now());

  const DEFAULT_PDF = publicPdfs.find((pdf) => pdf.pdfName === "Bitcoin")!;

  useEffect(() => {
    resetDemoState();
  }, [resetDemoState]);

  useEffect(() => {
    if (!selectedPdf) {
      setCurrentPdf(DEFAULT_PDF);
    }
  }, [DEFAULT_PDF, selectedPdf, setCurrentPdf]);

  const handlePdfSelection = (pdfUrl: string) => {
    const pdf = publicPdfs.find((pdf) => pdf.pdfUrl === pdfUrl);
    if (pdf) {
      setCurrentPdf(pdf);
      updateMessagesFromHistory([]);
    }
  };

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    const currentPdf = selectedPdf || DEFAULT_PDF;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setCurrentChat({
      title: currentPdf.pdfName,
      chat_session_id: newSessionId,
      chat_history: [],
      last_activity: new Date(),
      latest_pdfId: currentPdf.pdfId,
      userId: "demo",
    });

    updateMessagesFromHistory([]);
    setChatData("");
    botResponseRef.current = "";

    if (!selectedPdf) {
      setCurrentPdf(DEFAULT_PDF);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPdf) return;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const sessionId = selectedChat?.chat_session_id ?? uuidv4();

    if (!selectedChat) {
      setCurrentChat({
        title: selectedPdf.pdfName,
        chat_session_id: sessionId,
        chat_history: [],
        last_activity: new Date(),
        latest_pdfId: selectedPdf.pdfId,
        userId: "demo",
      });
    }

    addMessage({ role: "human", content: message });
    setChatData("");
    setChatLoading(true);
    botResponseRef.current = "";
    lastUpdateRef.current = Date.now();

    try {
      await axios.post("/api/chat/demo", {
        message,
        chat_session_id: sessionId,
        pdfId: selectedPdf.pdfId,
      });

      eventSourceRef.current = new EventSource(
        `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/demo_chat_stream/${sessionId}`
      );

      eventSourceRef.current.onmessage = (event) => {
        botResponseRef.current += event.data.replace(/<br>/g, "\n");

        // Throttle updates to avoid excessive re-renders
        const now = Date.now();
        if (now - lastUpdateRef.current >= 100) {
          // Update every 100ms
          setChatData(botResponseRef.current);
          lastUpdateRef.current = now;
        }
      };

      eventSourceRef.current.addEventListener("end", () => {
        eventSourceRef.current?.close();
        setChatLoading(false);
        addMessage({
          role: "ai",
          content: botResponseRef.current.replace(/<br>/g, "\n"),
        });
        setChatData("");
        botResponseRef.current = "";
      });

      eventSourceRef.current.onerror = (error) => {
        console.error("SSE connection error:", error);
        eventSourceRef.current?.close();
        setChatLoading(false);
        botResponseRef.current = "";
      };
    } catch (err) {
      console.error("Axios request failed:", err);
      setChatLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [message]);

  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isChatLoading, chatData]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Mobile Toggle Buttons */}
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

      {/* Chat Section */}
      <div
        className={`bg-white p-2 rounded-lg shadow-md flex flex-col flex-grow pt-4 ${
          viewMode === "chat" ? "flex" : "hidden"
        } lg:flex lg:w-[40%]`}
      >
        <div className="bg-white w-full flex justify-center h-screen">
          <div className="max-w-4xl w-full h-screen flex flex-col p-4">
            {/* Note Section */}
            <div className="hidden sm:flex flex-col items-center text-center space-y-2 p-4 bg-gray-100 rounded-lg shadow-md mb-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Memory & previous conversations are
                disabled in this demo. Use the{" "}
                <span className="inline-flex items-center gap-1 text-blue-500 font-medium align-middle whitespace-nowrap">
                  gear icon <Settings /> and plus icon <PlusCircleIcon />
                </span>{" "}
                inside the input bar to change the PDF or start a new chat.
              </p>
            </div>

            {/* Chat Messages */}
            <Card className="flex-1 mb-4 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "human" ? "justify-end" : "justify-start"
                  }`}
                >
                  <Card
                    className={`p-4 max-w-[95%] sm:max-w-[85%] ${
                      msg.role === "human"
                        ? "bg-black text-white"
                        : "bg-muted-2"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        {msg.role === "human" ? (
                          <>
                            <AvatarFallback className="bg-blue-500">
                              U
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/ai-avatar.jpeg" />
                            <AvatarFallback className="bg-orange-500">
                              AI
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium">
                        {msg.role === "human" ? "You" : "Assistant"}
                      </span>
                    </div>
                    <ReactMarkdown
                      className="whitespace-pre-wrap prose text-sm sm:text-lg"
                      remarkPlugins={[remarkGfm]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </Card>
                </div>
              ))}

              {/* Loading State */}
              {isChatLoading && !chatData && (
                <div className="flex justify-start">
                  <Card className="p-4 max-w-[95%] sm:min-w-[85%] min-h-[140px] bg-muted-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-6 w-6 rounded-full bg-gray-300/80 dark:bg-gray-700/80" />
                      <Skeleton className="h-4 w-20 bg-gray-300/80 dark:bg-gray-700/80" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-300/80 dark:bg-gray-700/80" />
                      <Skeleton className="h-4 w-[90%] bg-gray-300/80 dark:bg-gray-700/80" />
                      <Skeleton className="h-4 w-4/5 bg-gray-300/80 dark:bg-gray-700/80" />
                    </div>
                  </Card>
                </div>
              )}

              {/* Streaming Response */}
              {chatData && (
                <div className="flex justify-start">
                  <Card className="p-4 max-w-[95%] sm:max-w-[80%] bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/ai-avatar.jpeg" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">Assistant</span>
                    </div>
                    <ReactMarkdown
                      className="whitespace-pre-wrap prose text-sm sm:text-lg"
                      remarkPlugins={[remarkGfm]}
                    >
                      {chatData}
                    </ReactMarkdown>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </Card>

            {/* Chat Input with Expanding Textarea */}
            <div className="mt-auto">
              <div className="border rounded-lg px-2 py-1">
                <div className="flex flex-col">
                  <textarea
                    ref={textareaRef}
                    className="text-[13px] sm:text-lg p-3 w-full focus:outline-none custom-scrollbar resize-none"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    disabled={isChatLoading}
                    style={{
                      minHeight: "40px",
                      maxHeight: "360px",
                      overflowY: "auto",
                    }}
                  />
                  <div className="flex justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Settings
                            size={24}
                            className="hover:text-blue-400 hover:cursor-pointer hover:scale-110"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-3 ml-5 bg-white shadow-lg rounded-md">
                          {/* PDF Selection */}
                          <h3 className="font-medium mb-2">Select a PDF:</h3>
                          <Select
                            onValueChange={handlePdfSelection}
                            value={selectedPdf?.pdfUrl || "/bitcoin.pdf"}
                            defaultValue={DEFAULT_PDF.pdfUrl}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a PDF" />
                            </SelectTrigger>
                            <SelectContent>
                              {publicPdfs.map((pdf, index) => (
                                <SelectItem key={index} value={pdf.pdfUrl}>
                                  {pdf.pdfName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Model Selection */}
                          <h3 className="font-medium mt-4 mb-2">AI Model:</h3>
                          <Select
                            onValueChange={setModel}
                            value={selectedModel}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Model" />
                            </SelectTrigger>
                            <SelectContent>
                              {MODEL_OPTIONS.map((model, index) => (
                                <SelectItem
                                  key={index}
                                  value={model.value}
                                  disabled={model.disabled}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    {model.disabled && (
                                      <Lock className="w-4 h-4 text-gray-500" />
                                    )}
                                    <span>{model.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Retrieval Method */}
                          <h3 className="font-medium mt-4 mb-2">
                            Retrieval Method:
                          </h3>
                          <Select
                            onValueChange={setRetrievalMethod}
                            value={selectedRetrievalMethod}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Retrieval Method" />
                            </SelectTrigger>
                            <SelectContent>
                              {RETRIEVAL_OPTIONS.map((option, index) => (
                                <SelectItem
                                  key={index}
                                  value={option.value}
                                  disabled={option.disabled}
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    {option.disabled && (
                                      <Lock className="w-4 h-4 text-gray-500" />
                                    )}
                                    <span>{option.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <PlusCircleIcon
                        onClick={handleNewChat}
                        className="hover:text-blue-400 hover:scale-110 hover:cursor-pointer"
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isChatLoading}
                      className="h-[40px] w-16 p-2 flex items-center justify-center text-[16px]"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div
        className={`p-3 w-full lg:w-[60%] bg-white flex justify-center h-full ${
          viewMode === "pdf" ? "flex" : "hidden"
        } lg:flex`}
      >
        {selectedPdf ? (
          <iframe
            src={selectedPdf?.pdfUrl || ""}
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

export default Demopage;
