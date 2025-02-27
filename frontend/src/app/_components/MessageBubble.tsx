// components/MessageBubble.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../_global/interface";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => (
  <div
    className={`inline-block max-w-[75%] lg:max-w-[500px] p-[10px] rounded-xl text-xs shadow-md break-words ${
      message.role === "human"
        ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white self-end ml-auto"
        : "bg-gradient-to-r from-gray-100 to-gray-300 text-black self-start"
    }`}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
  </div>
);

export default MessageBubble;
