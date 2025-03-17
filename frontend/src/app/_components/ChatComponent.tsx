"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircleIcon, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { sendMessage } from "../_hooks/useChatSend";
import { useAppStore } from "../_store/useAppStore";
import GearSettings from "./GearSettings";

interface ChatComponentProps {
  userId: string | null;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ userId }) => {
  const { messages, isChatLoading, currentChatId, currentPdfId } =
    useAppStore();
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
      <div className="max-w-4xl w-full h-screen flex flex-col p-1 sm:p-4">
        {/* Note Section */}
        <div className="hidden sm:flex flex-col items-center text-center space-y-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg mb-4 border border-blue-100">
          <p className="text-[13px] text-gray-700">
            <strong>Note:</strong> Utilize the{" "}
            <span className="inline-flex items-center gap-1 text-blue-600 font-medium align-middle whitespace-nowrap">
              <Settings className="w-4 h-4" /> gear icon and{" "}
              <PlusCircleIcon className="w-4 h-4" /> plus icon
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
                className={`p-4 max-w-[95%] sm:max-w-[85%] rounded-2xl shadow-sm hover:shadow-md transition-shadow ${
                  msg.role === "human" ? "bg-blue-600 text-white" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    {msg.role === "human" ? (
                      <AvatarFallback className="bg-blue-500">U</AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage src="/ai-avatar.jpeg" />
                        <AvatarFallback className="bg-orange-500">
                          AI
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <span className="text-[13px] font-medium">
                    {msg.role === "human" ? "You" : "Assistant"}
                  </span>
                </div>
                <ReactMarkdown
                  className="text-[13px] sm:text-lg"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {msg.content}
                </ReactMarkdown>
              </Card>
            </div>
          ))}

          {/* Loading State */}
          {isChatLoading && !streamingResponse && (
            <div className="flex justify-start">
              <Card className="p-4 min-w-[85%] min-h-[140px] bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-6 w-6 rounded-full bg-gray-300/80 animate-pulse" />
                  <Skeleton className="h-4 w-20 bg-gray-300/80 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-300/80 animate-pulse" />
                  <Skeleton className="h-4 w-[90%] bg-gray-300/80 animate-pulse" />
                  <Skeleton className="h-4 w-4/5 bg-gray-300/80 animate-pulse" />
                </div>
              </Card>
            </div>
          )}

          {/* Streaming Response */}
          {streamingResponse && (
            <div className="flex justify-start">
              <Card className="p-4 max-w-[80%] bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/ai-avatar.jpeg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-medium">Assistant</span>
                </div>
                <ReactMarkdown
                  className="text-[13px] sm:text-lg"
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
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
            <div className="text-red-500 text-[13px] px-2 py-1 bg-red-50 border border-red-200 rounded mb-2">
              ⚠️ {error}
            </div>
          )}
          <div className="border rounded-lg px-2 py-1 bg-gray-50 shadow-sm">
            <div className="flex flex-col">
              <textarea
                ref={textareaRef}
                className="text-[13px] sm:text-lg p-3 w-full focus:outline-none custom-scrollbar resize-none bg-transparent"
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
                <GearSettings userId={userId} />
                <Button
                  onClick={handleSendMessage}
                  disabled={isChatLoading}
                  className="h-[40px] w-16 p-2 flex items-center justify-center text-[16px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
