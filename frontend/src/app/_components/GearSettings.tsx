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
import { Lock, PlusCircleIcon, Settings } from "lucide-react";
import React from "react";
import { MODEL_OPTIONS, RETRIEVAL_OPTIONS } from "../_global/variables";
import { useAppStore } from "../_store/useAppStore";
import { ChatSession } from "../_global/interface";
import { v4 as uuivd4 } from "uuid";

interface GearSettingsProps {
  userId: string | null;
}

const GearSettings: React.FC<GearSettingsProps> = ({ userId }) => {
  const {
    selectedPdf,
    selectedChat,
    selectedModel,
    selectedRetrievalMethod,
    pdfOptions,
    chatOptions,
    isLoadingOptions,
    error,
    setCurrentPdf,
    setCurrentChat,
    setModel,
    setRetrievalMethod,
    updateMessagesFromHistory,
    addNewChatSession,
  } = useAppStore();

  const handlePdfSelection = (pdfUrl: string) => {
    const pdf = pdfOptions.find((p) => p.pdfUrl === pdfUrl);
    if (pdf) {
      setCurrentPdf(pdf);
    }
  };

  const handleChatSelection = (sessionId: string) => {
    const chat = chatOptions.find((c) => c.chat_session_id === sessionId);
    const pdf = pdfOptions.find((p) => p.pdfId === chat?.latest_pdfId);
    if (chat) {
      setCurrentChat(chat);
      updateMessagesFromHistory(chat.chat_history);
      setCurrentPdf(pdf || null);
    }
  };
  const handleNewChat = () => {
    if (!userId) return;

    // Generate unique session ID
    const sessionId = uuivd4();

    // Create new chat session object
    const newChat: ChatSession = {
      chat_session_id: sessionId,
      chat_history: [],
      last_activity: new Date(),
      latest_pdfId: "",
      userId,
    };

    // Update app store state
    addNewChatSession(userId, sessionId);
    setCurrentChat(newChat);
    updateMessagesFromHistory([]);
    setCurrentPdf(null);
  };

  return (
    <div className="flex items-center space-x-2">
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
            value={selectedPdf?.pdfUrl}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a PDF" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingOptions ? (
                <div className="text-sm text-gray-500">Loading PDFs...</div>
              ) : pdfOptions.length === 0 ? (
                <div className="text-sm text-gray-500">No PDFs found</div>
              ) : (
                pdfOptions.map((pdf) => (
                  <SelectItem key={pdf.pdfId} value={pdf.pdfUrl}>
                    {pdf.pdfName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Chat History Selection */}
          <h3 className="font-medium mt-4 mb-2">Select Chat History:</h3>
          <Select
            onValueChange={handleChatSelection}
            value={selectedChat?.chat_session_id || ""}
            defaultValue={selectedChat?.chat_session_id || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a Chat" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingOptions ? (
                <div className="text-sm text-gray-500">Loading chats...</div>
              ) : chatOptions.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No chat history found
                </div>
              ) : (
                chatOptions.map((chat) => (
                  <SelectItem
                    key={chat.chat_session_id}
                    value={chat.chat_session_id}
                  >
                    {chat.chat_session_id}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Model Selection */}
          <h3 className="font-medium mt-4 mb-2">AI Model:</h3>
          <Select onValueChange={setModel} value={selectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Model" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((model) => (
                <SelectItem
                  key={model.value}
                  value={model.value}
                  disabled={model.disabled}
                >
                  <div className="flex items-center gap-2">
                    {model.disabled && (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                    {model.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Retrieval Method Selection */}
          <h3 className="font-medium mt-4 mb-2">Retrieval Method:</h3>
          <Select
            onValueChange={setRetrievalMethod}
            value={selectedRetrievalMethod}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Method" />
            </SelectTrigger>
            <SelectContent>
              {RETRIEVAL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
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
  );
};

export default GearSettings;
