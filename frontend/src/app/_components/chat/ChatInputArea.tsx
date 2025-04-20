import React, { useRef, useEffect, Dispatch, SetStateAction } from "react"; // Import necessary hooks
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUp,
  Clock,
  Cpu,
  Database,
  FileText,
  Lightbulb,
  Loader2,
  Lock,
  MessageSquare,
  PlusCircleIcon,
  Settings,
  XCircle,
} from "lucide-react";
import { PDFDocument, ChatSession } from "../../_global/interface"; // Import necessary types
import { MODEL_OPTIONS, RETRIEVAL_OPTIONS } from "../../_global/variables"; // Import options

// Corrected props needed for the ChatInputArea component
interface ChatInputAreaProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>; // Correct type for setMessage
  error: string | null;
  isChatLoading: boolean;
  isDemo: boolean;
  selectedPdf: PDFDocument | null;
  isPdfSidebarOpen: boolean;
  userId: string | null | undefined; // Use the type from props
  isLoadingOptions: boolean;
  pdfOptions: PDFDocument[];
  chatOptions: ChatSession[];
  selectedChat: ChatSession | null;
  selectedModel: string;
  selectedRetrievalMethod: string;
  pdfDataSource: PDFDocument[]; // Needed for demo mode PDF selection dropdown

  // --- Corrected: Pass the specific handler down ---
  onSendMessage: () => Promise<void>; // The function to call when sending a message

  togglePdfView: () => void;
  handleDemoPdfChange: (pdfUrl: string) => void;
  handleDemoNewChatClick: () => void;
  handleAuthPdfSelection: (pdfId: string) => void;
  handleAuthChatSelection: (sessionId: string) => void;
  handleAuthNewChat: () => void;
  setOpenTutorial: (isOpen: boolean) => void;
  setModel: (model: string) => void;
  setRetrievalMethod: (method: string) => void;

  textareaRef: React.RefObject<HTMLTextAreaElement | null>; // Pass the ref
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  message,
  setMessage,
  error,
  isChatLoading,
  isDemo,
  selectedPdf,
  isPdfSidebarOpen,
  userId,
  isLoadingOptions,
  pdfOptions,
  chatOptions,
  selectedChat,
  selectedModel,
  selectedRetrievalMethod,
  pdfDataSource,
  onSendMessage, // Receive the handler here (renamed from handleSendMessageInternal for clarity in this component)
  togglePdfView,
  handleDemoPdfChange,
  handleDemoNewChatClick,
  handleAuthPdfSelection,
  handleAuthChatSelection,
  handleAuthNewChat,
  setOpenTutorial,
  setModel,
  setRetrievalMethod,
  textareaRef,
}) => {
  // Textarea height adjustment effect (moved here as it's tied to the textarea)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Keep max height
    }
  }, [message, textareaRef]); // Depend on message and the ref

  return (
    <div className="w-full px-4 pb-4 pt-2 bg-gradient-to-t from-slate-100/90 via-slate-50/70 to-transparent backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 border border-gray-200/80 p-2 sm:p-3 rounded-xl shadow-lg relative backdrop-blur-md">
          {/* Error Display */}
          {error && (
            <div className="text-red-600 text-xs px-3 py-2 bg-red-50 border border-red-200 rounded-md mb-2">
              ⚠️ {error}
            </div>
          )}
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="w-full p-2 focus:outline-none text-sm md:text-base bg-transparent resize-none border-none overflow-y-auto custom-scrollbar"
            placeholder={
              selectedPdf
                ? `Ask a question about ${selectedPdf.pdfName}...`
                : "Select a PDF using Settings (⚙️) to begin..."
            }
            value={message}
            rows={1}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage(); // Call the passed-down handler
              }
            }}
            disabled={isChatLoading || (!isDemo && !selectedPdf)}
            style={{ minHeight: "48px" }}
          />
          {/* Action Buttons Row */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            {/* Left Aligned Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* --- Conditional Settings --- */}
              {isDemo ? (
                // --- Demo Settings (PDF Selection & New Chat) ---
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-black hover:text-blue-600 h-8 w-8"
                        aria-label="Select Demo Document"
                      >
                        <Settings className="scale-125" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <div className="px-3 py-2 font-medium text-sm">
                        Select Demo PDF
                      </div>
                      {pdfDataSource.map((pdf) => (
                        <DropdownMenuItem
                          key={pdf.pdfId}
                          onSelect={() => handleDemoPdfChange(pdf.pdfUrl)}
                          disabled={pdf.pdfUrl === selectedPdf?.pdfUrl}
                        >
                          {pdf.pdfName}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDemoNewChatClick}
                          className="text-black hover:text-blue-600 h-8 w-8"
                          aria-label="Start New Demo Chat Context"
                        >
                          <PlusCircleIcon className="scale-125" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Clear Chat</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* Tutorial button is now handled in EmptyChatState and potentially elsewhere */}
                  {/* Removed the duplicate Tutorial button here */}
                </>
              ) : (
                // --- Authenticated User Settings (PDF, Chat, Model, Retrieval) ---
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-black hover:text-blue-600 h-8 w-8"
                      aria-label="Chat Settings"
                    >
                      <Settings className="scale-125" />
                    </Button>
                  </DropdownMenuTrigger>
                  {/* --- Authenticated Settings Content --- */}
                  {/* This content is complex and could be extracted further later */}
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="w-72 p-4 bg-white shadow-lg rounded-lg border border-gray-200 space-y-4"
                  >
                    {/* PDF Selection Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        Document
                      </h3>
                      <Select
                        onValueChange={handleAuthPdfSelection}
                        value={selectedPdf?.pdfId || ""}
                        disabled={isLoadingOptions}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select a PDF (Required)" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingOptions ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 px-3 py-4">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading documents...
                            </div>
                          ) : pdfOptions.length === 0 ? (
                            <div className="text-sm text-center text-gray-500 px-3 py-4">
                              No PDFs uploaded yet.
                            </div>
                          ) : (
                            [...pdfOptions]
                              .sort(
                                (a, b) =>
                                  new Date(b.uploadedAt || 0).getTime() -
                                  new Date(a.uploadedAt || 0).getTime()
                              )
                              .map((pdf) => {
                                const isPending =
                                  pdf.pdfIngestionStatus === "pending";
                                const isFailed =
                                  pdf.pdfIngestionStatus === "failed";
                                const isDisabled = isPending || isFailed;

                                return (
                                  <SelectItem
                                    key={pdf.pdfId}
                                    value={pdf.pdfId}
                                    disabled={isDisabled}
                                    className="text-sm py-2"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span
                                        className="truncate"
                                        title={pdf.pdfName}
                                      >
                                        {pdf.pdfName}
                                      </span>
                                      {isPending && (
                                        <span
                                          title="Processing..."
                                          className="flex items-center gap-1 text-xs text-orange-600 ml-auto flex-shrink-0"
                                        >
                                          <Clock className="w-3.5 h-3.5" />
                                        </span>
                                      )}
                                      {isFailed && (
                                        <span
                                          title="Processing Failed"
                                          className="flex items-center gap-1 text-xs text-red-600 ml-auto flex-shrink-0"
                                        >
                                          <XCircle className="w-3.5 h-3.5" />
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator className="bg-gray-100" />

                    {/* Chat History Section */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        Chat History
                      </h3>
                      <Select
                        onValueChange={handleAuthChatSelection}
                        value={selectedChat?.chat_session_id || ""}
                        disabled={isLoadingOptions}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select a Chat" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingOptions ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 px-3 py-4">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Loading chats...
                            </div>
                          ) : chatOptions.length === 0 ? (
                            <div className="text-sm text-center text-gray-500 px-3 py-4">
                              No previous chats found.
                            </div>
                          ) : (
                            [...chatOptions]
                              .sort(
                                (a, b) =>
                                  new Date(b.last_activity || 0).getTime() -
                                  new Date(a.last_activity || 0).getTime()
                              )
                              .map((chat) => (
                                <SelectItem
                                  key={chat.chat_session_id}
                                  value={chat.chat_session_id}
                                  className="text-sm py-2"
                                >
                                  <span
                                    className="truncate"
                                    title={
                                      chat.title ||
                                      `Chat from ${new Date(
                                        chat.last_activity!
                                      ).toLocaleDateString()}`
                                    }
                                  >
                                    {chat.title ||
                                      `Chat from ${new Date(
                                        chat.last_activity!
                                      ).toLocaleDateString()}`}
                                  </span>
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <DropdownMenuSeparator className="bg-gray-100" />

                    {/* AI Configuration Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-gray-500" />
                          AI Model
                        </h3>
                        <Select onValueChange={setModel} value={selectedModel}>
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                          <SelectContent>
                            {MODEL_OPTIONS.map((model) => (
                              <SelectItem
                                key={model.value}
                                value={model.value}
                                disabled={model.disabled}
                                className="text-sm py-2"
                              >
                                <div className="flex items-center gap-2">
                                  {model.disabled && (
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                  {model.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Database className="w-4 h-4 text-gray-500" />
                          Retrieval Method
                        </h3>
                        <Select
                          onValueChange={setRetrievalMethod}
                          value={selectedRetrievalMethod}
                        >
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder="Select Method" />
                          </SelectTrigger>
                          <SelectContent>
                            {RETRIEVAL_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className="text-sm py-2"
                              >
                                <div className="flex items-center gap-2">
                                  {option.disabled && (
                                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                                  )}
                                  {option.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Authenticated New Chat Button (Conditional) */}
              {!isDemo && ( // Only show New Chat button in authenticated mode here
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleAuthNewChat}
                        className="text-black hover:text-blue-600 h-8 w-8"
                        aria-label="Start New Chat"
                        disabled={!userId}
                      >
                        <PlusCircleIcon className="scale-125" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Start New Chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Tutorial Button (Conditional - show here for both modes) */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpenTutorial(true)} // Use the passed setter
                      className="text-black hover:text-blue-600 h-8 w-8"
                      aria-label="Open Tutorial"
                    >
                      <Lightbulb className="scale-125" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Open Tutorial</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* PDF View Toggle Button */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size="icon"
                      onClick={togglePdfView}
                      disabled={!selectedPdf || isPdfSidebarOpen}
                      className="text-black hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed h-8 w-8"
                      aria-label="Open Document View"
                    >
                      <FileText className="scale-125" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {selectedPdf
                      ? isPdfSidebarOpen
                        ? "PDF View Open"
                        : "Open PDF View (Esc)"
                      : "Select a PDF first"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Send/Loading Button */}
            <Button
              size="icon"
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onSendMessage} // Call the passed-down handler
              disabled={
                isChatLoading || !message.trim() || (!isDemo && !selectedPdf)
              }
              aria-label={isChatLoading ? "Sending..." : "Send Message"}
            >
              {isChatLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputArea;
