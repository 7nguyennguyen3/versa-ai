"use client";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Send, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessage } from "../_hooks/useChatSend";
import { useAppStore } from "../_store/useAppStore";
import GearSettings from "./GearSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatComponentProps {
  userId: string | null;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ userId }) => {
  const {
    messages,
    isChatLoading,
    fetchChatOptions,
    fetchPdfOptions,
    currentChatId,
    currentPdfId,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [streamingResponse, setStreamingResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
    if (userId) {
      fetchChatOptions(userId);
      fetchPdfOptions(userId);
    }
  }, [userId, fetchChatOptions, fetchPdfOptions]);

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
      setError(
        "Please select a chat session or a PDF before sending a message."
      );
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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 360)}px`; // Match maxHeight
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
  }, [messages, isChatLoading, streamingResponse]);

  return (
    <div className="bg-white w-full flex justify-center h-screen">
      <div className="max-w-4xl w-full h-screen flex flex-col p-4">
        {/* Note Section */}
        <div className="flex flex-col items-center text-center space-y-2 p-4 bg-gray-100 rounded-lg shadow-md mb-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Utilize the{" "}
            <span className="inline-flex items-center gap-1 text-blue-500 font-medium align-middle whitespace-nowrap">
              gear icon <Settings /> and plus icon <PlusCircleIcon />
            </span>{" "}
            inside the input bar to change settings like document or start a new
            chat.
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
                className={`p-4 max-w-[85%] ${
                  msg.role === "human" ? "bg-black text-white" : "bg-muted-2"
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
                  className="whitespace-pre-wrap prose text-lg"
                  remarkPlugins={[remarkGfm]}
                >
                  {msg.content}
                </ReactMarkdown>
              </Card>
            </div>
          ))}

          {/* Loading State */}
          {isChatLoading && !streamingResponse && (
            <div className="flex justify-start">
              <Card className="p-4 min-w-[85%] min-h-[140px] bg-muted-2">
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
          {streamingResponse && (
            <div className="flex justify-start">
              <Card className="p-4 max-w-[80%] bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/ai-avatar.jpeg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Assistant</span>
                </div>
                <ReactMarkdown
                  className="whitespace-pre-wrap prose text-lg"
                  remarkPlugins={[remarkGfm]}
                >
                  {streamingResponse}
                </ReactMarkdown>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Card>

        {/* Chat Input with Expanding Textarea */}
        <div className="mt-auto">
          {error && (
            <div className="text-red-500 text-sm px-2 py-1 bg-red-50 border border-red-200 rounded mb-2">
              ⚠️ {error}
            </div>
          )}
          <div className="border rounded-lg px-2 py-1">
            <div className="flex flex-col">
              <textarea
                ref={textareaRef}
                className="text-lg p-3 w-full focus:outline-none custom-scrollbar resize-none"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
                disabled={isChatLoading}
                style={{
                  minHeight: "100px",
                  maxHeight: "360px",
                  overflowY: "auto",
                }}
              />
              <div className="flex justify-between pt-4">
                <GearSettings userId={userId} />
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
  );
};
export default ChatComponent;
