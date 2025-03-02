"use client";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, Send, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessage } from "../_hooks/useChatSend";
import { useAppStore } from "../_store/useAppStore";
import GearSettings from "./GearSettings";

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

  // Memoized stream handlers
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

  console.log(error);

  const handleSendMessage = async () => {
    if (!message.trim() || !token) return;

    // Only set error if no chat or PDF is selected
    if (!currentChatId && !currentPdfId) {
      setError(
        "Please select a chat session or a PDF before sending a message."
      );
      return;
    }

    setError(null); // Clear any previous error

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 130)}px`;
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
      <div className="max-w-[600px] w-full h-screen flex flex-col p-3">
        <div className="flex flex-col bg-white w-full h-full">
          <div className="flex flex-col items-center text-center space-y-2 p-4 bg-gray-100 rounded-lg shadow-md mb-5">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Utilze the{" "}
              <span className="inline-flex items-center gap-1 text-blue-500 font-medium align-middle whitespace-nowrap">
                gear icon <Settings /> and plus icon <PlusCircleIcon />
              </span>{" "}
              inside the input bar to change settings like document or start a
              new chat.
            </p>
          </div>
          {/* Chat Messages */}
          <div className="px-6 gap-5 custom-scrollbar flex flex-col flex-grow overflow-y-auto h-0 mt-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`inline-block max-w-[75%] lg:max-w-[500px] p-[10px] rounded-xl text-xs shadow-md break-words ${
                  msg.role === "human"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white self-end ml-auto"
                    : "bg-gradient-to-r from-gray-100 to-gray-300 text-black self-start"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}

            {isChatLoading && !streamingResponse && (
              <div className="max-w-[75%] p-4 rounded-2xl bg-gray-200 text-black self-start flex items-center space-x-2">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            )}
            {streamingResponse && (
              <div className="max-w-[75%] p-4 rounded-2xl bg-gray-200 text-black self-start">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamingResponse}
                </ReactMarkdown>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-[2px] bg-white flex flex-col items-center w-full border rounded-lg">
            {error && (
              <div className="text-red-500 text-sm mb-2 px-2 py-1 bg-red-50 border border-red-200 rounded w-full">
                ⚠️ {error}
              </div>
            )}
            <textarea
              ref={textareaRef}
              className="text-xs p-2 w-full focus:border-none focus:outline-none custom-scrollbar"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              disabled={isChatLoading}
              style={{ minHeight: "40px", maxHeight: "130px" }}
            />
            <div className="flex items-center justify-between w-[98%] mb-1">
              <GearSettings userId={userId} />

              <Button
                onClick={handleSendMessage}
                disabled={isChatLoading}
                className="p-3 h-5 w-9 rounded-lg"
              >
                <Send className="rotate-45" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
