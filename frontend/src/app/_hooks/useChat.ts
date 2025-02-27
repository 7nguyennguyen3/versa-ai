// hooks/useChat.ts
import { useState, useEffect, useCallback } from "react";
import { ChatMessage } from "../_global/interface";

export const useChat = (initialMessages: ChatMessage[]) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "human", content: inputMessage },
      ]);
      setInputMessage("");
      setIsLoading(false);
    }, 1000);
  }, [inputMessage]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
  };
};
