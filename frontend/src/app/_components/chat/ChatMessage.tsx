import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming these are used
import { User, BotMessageSquare } from "lucide-react"; // Assuming these icons are used
import { MarkdownText } from "@/components/markdown/mardown-text-new"; // Assuming MarkdownText is used
import { ChatMessage as ChatMessageType } from "../../_global/interface"; // Import the type

interface ChatMessageProps {
  message: ChatMessageType;
  index: number; // Include index for the key, though ideally messages have a unique ID
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  // Assuming ChatMessageType has 'role' (human | ai) and 'content'
  const { role, content } = message;

  return (
    <div
      key={`${role}-${index}-${message.pdfId}`} // Keep the key logic, assuming message might have pdfId
      className={`relative flex w-full ${
        role === "human" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative max-w-full lg:max-w-[85%] flex items-start gap-2 ${
          role === "human" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <Avatar className="w-7 h-7 mt-1 flex-shrink-0 hidden sm:block">
          {role === "human" ? (
            <div className="flex items-center justify-center w-full h-full rounded-full bg-blue-100 dark:bg-blue-900">
              <User className="w-4.5 h-4.5 text-blue-600 dark:text-blue-300" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full rounded-full bg-gray-200 dark:bg-gray-600">
              <BotMessageSquare className="w-4.5 h-4.5 text-gray-800 dark:text-gray-300" />
            </div>
          )}
        </Avatar>

        <div
          className={`rounded-xl p-3 shadow-sm max-w-full ${
            role === "human"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-800"
          }`}
        >
          {/* Ensure content is treated as string and handle <br> */}
          <MarkdownText>
            {typeof content === "string" ? content : ""}
          </MarkdownText>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
