import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming these are used
import { BotMessageSquare } from "lucide-react"; // Assuming this icon is used
import { MarkdownText } from "@/components/markdown/mardown-text-new"; // Assuming MarkdownText is used
import { BouncingDotsLoader } from "./BouncingDots";

interface ChatLoadingOrStreamingProps {
  isChatLoading: boolean;
  streamingAiResponse: string;
}

const ChatLoadingOrStreaming: React.FC<ChatLoadingOrStreamingProps> = ({
  isChatLoading,
  streamingAiResponse,
}) => {
  if (isChatLoading && !streamingAiResponse) {
    return (
      <div className="relative flex w-full justify-start">
        <div className="relative max-w-[85%] flex items-start gap-2">
          {/* Avatar */}
          <div className="flex items-center justify-center w-full h-full rounded-full bg-gray-200 dark:bg-gray-600">
            {/* Use the BotMessageSquare icon directly as it's simpler than Avatar for loading */}
            <BotMessageSquare className="w-4.5 h-4.5 text-gray-800 dark:text-gray-300" />
          </div>
          {/* Loading Dots */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm min-h-[40px] flex items-center">
            <BouncingDotsLoader />
          </div>
        </div>
      </div>
    );
  }

  if (streamingAiResponse) {
    return (
      <div className="relative flex w-full justify-start">
        <div className="relative max-w-[85%] flex items-start gap-2">
          {/* Avatar for streaming response */}
          <div className="flex items-center justify-center w-7 h-7 mt-1 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-600">
            <BotMessageSquare className="w-4.5 h-4.5 text-gray-800 dark:text-gray-300" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-full">
            <MarkdownText>
              {/* Ensure content is treated as string and handle <br> */}
              {typeof streamingAiResponse === "string"
                ? streamingAiResponse
                : ""}
            </MarkdownText>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
export default ChatLoadingOrStreaming;
