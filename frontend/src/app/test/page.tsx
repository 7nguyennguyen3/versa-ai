"use client";
import { Send, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you today?" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { role: "human", content: message };
    setMessages([...messages, newMessage]);
    setMessage("");
    setLoading(true);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "This is a response!" },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col bg-white w-full h-full min-h-0 border rounded-lg shadow-md overflow-hidden">
      <div className="flex-grow flex flex-col min-h-0">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar flex flex-col bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`inline-block max-w-[75%] lg:max-w-[700px] p-4 rounded-2xl text-sm shadow-md break-words transition-all duration-200 ease-in-out ${
                msg.role === "human"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="max-w-[75%] p-4 rounded-2xl bg-gray-200 text-black self-start flex items-center space-x-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white shadow-md flex gap-3 items-center border-t border-gray-300">
          <input
            type="text"
            className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out disabled:opacity-50"
          >
            <Send className="rotate-45" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
