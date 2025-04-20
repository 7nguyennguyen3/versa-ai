"use client";

import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  X as CancelIcon,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  PlusCircle,
  Save,
  Upload,
} from "lucide-react";

import { ChatSession, PDFDocument } from "../_global/interface";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";

// Variants (unchanged)
const sectionVariants = {
  /* ... */
};
const listVariants = {
  /* ... */
};
const itemVariants = {
  /* ... */
};
const quickActionVariants = {
  /* ... */
};

// Helper
const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return "-";
  try {
    return new Date(dateInput).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const ListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex justify-between items-center px-4 py-5 bg-gray-100 rounded-xl animate-pulse"
      >
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-6 rounded-full bg-gray-300" />
          <Skeleton className="h-5 w-40 bg-gray-300 rounded-md" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md bg-gray-300" />
      </div>
    ))}
  </div>
);

const SidebarNav = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <nav className="min-h-screen bg-transparent">
    <ul className="space-y-4 bg-transparent pt-20">
      <li>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-2 text-base hover:bg-gray-50 rounded-md"
          onClick={onLinkClick}
        >
          <Upload className="scale-125 text-blue-600" />
          <Link href="/upload-pdf">Upload PDF</Link>
        </Button>
      </li>
      <li>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-2 text-base hover:bg-gray-50 rounded-md"
          onClick={onLinkClick}
        >
          <MessageSquare className="scale-125 text-purple-600" />
          <Link href="/pdf-chat">Chat Interface</Link>
        </Button>
      </li>
    </ul>
  </nav>
);

const DashboardPage = () => {
  const {
    pdfOptions,
    chatOptions,
    setCurrentChat,
    setCurrentPdf,
    addNewChatSession,
    updateChatTitle,
    selectedPdf,
    isLoadingOptions,
    updateMessagesFromHistory,
  } = useAppStore();
  const { userId } = useAuthStore();
  const router = useRouter();

  const [currentUploadPage, setCurrentUploadPage] = useState(1);
  const [currentChatPage, setCurrentChatPage] = useState(1);
  const itemsPerPage = 5;

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSavingRename, setIsSavingRename] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    if (justLoggedIn === "true") {
      sessionStorage.removeItem("justLoggedIn");
      window.location.reload();
    }
  }, []);

  const paginatedData = useMemo(() => {
    const pdfs = pdfOptions || [];
    const chats = chatOptions || [];
    const totalUploadPages = Math.ceil(pdfs.length / itemsPerPage);
    const totalChatPages = Math.ceil(chats.length / itemsPerPage);
    const paginatedUploads = pdfs.slice(
      (currentUploadPage - 1) * itemsPerPage,
      currentUploadPage * itemsPerPage
    );
    const paginatedChats = chats.slice(
      (currentChatPage - 1) * itemsPerPage,
      currentChatPage * itemsPerPage
    );
    return {
      totalUploadPages,
      totalChatPages,
      paginatedUploads,
      paginatedChats,
    };
  }, [
    pdfOptions,
    chatOptions,
    currentUploadPage,
    currentChatPage,
    itemsPerPage,
  ]);
  const { totalUploadPages, totalChatPages, paginatedUploads, paginatedChats } =
    paginatedData;

  const handleStartNewChat = () => {
    if (!userId) return;
    const sessionId = uuidv4();
    addNewChatSession(userId, sessionId);
    const tempNewChat: ChatSession = {
      chat_session_id: sessionId,
      chat_history: [],
      last_activity: new Date(),
      title: "New Chat",
      latest_pdfId: selectedPdf?.pdfId || "",
      userId,
    };
    setCurrentChat(tempNewChat);
    if (selectedPdf) setCurrentPdf(selectedPdf);
    router.push("/pdf-chat");
  };

  const handleContinueChat = (chat: ChatSession) => {
    setCurrentChat(chat);
    updateMessagesFromHistory(chat.chat_history);
    const associatedPdf = pdfOptions?.find(
      (pdf) => pdf.pdfId === chat.latest_pdfId
    );
    setCurrentPdf(associatedPdf ?? null);
    router.push("/pdf-chat");
  };

  const handleEditStart = (chat: ChatSession) => {
    setEditingChatId(chat.chat_session_id);
    setEditingTitle(chat.title);
    setSaveError(null);
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
    setSaveError(null);
  };

  const handleSaveRename = async () => {
    if (!editingChatId || !editingTitle.trim() || !userId) {
      setSaveError("Invalid title or context.");
      return;
    }
    setIsSavingRename(true);
    setSaveError(null);
    try {
      await axios.post("/api/chat/rename", {
        userId,
        chatId: editingChatId,
        newTitle: editingTitle.trim(),
      });
      updateChatTitle(editingChatId, editingTitle.trim());
      handleCancelRename();
    } catch (error: any) {
      const message = error?.response?.data?.error || "Failed to rename chat.";
      setSaveError(message);
      console.error("Rename failed:", error);
    } finally {
      setIsSavingRename(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveRename();
    } else if (event.key === "Escape") {
      handleCancelRename();
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-100 pb-20 lg:pb-0">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white p-6 sticky top-0 h-screen">
            <SidebarNav />
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-10 mt-20">
            {/* Quick Actions */}
            <motion.section
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-start gap-4"
            >
              <motion.div
                custom={0}
                variants={quickActionVariants}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto sm:max-w-[300px] flex items-center justify-center gap-2 py-6
                 bg-blue-600 hover:bg-blue-700 shadow-lg rounded-xl text-white
                 font-semibold transition-all duration-300 hover:scale-[1.03]"
                >
                  <Link href="/upload-pdf" className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload New PDF</span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                custom={1}
                variants={quickActionVariants}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  onClick={handleStartNewChat}
                  className="w-full sm:w-auto sm:max-w-[300px] flex items-center justify-center gap-2 py-6
                 bg-purple-600 hover:bg-purple-700 shadow-lg rounded-xl text-white
                 font-semibold transition-all duration-300 hover:scale-[1.03]"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Start New Chat</span>
                </Button>
              </motion.div>
            </motion.section>

            {/* Recent Uploads */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Card className="shadow-lg border border-gray-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm">
                <CardHeader className="flex justify-between items-center p-4 bg-gray-50/80 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Recent Uploads
                  </CardTitle>
                  {totalUploadPages > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentUploadPage === 1}
                        onClick={() => setCurrentUploadPage((p) => p - 1)}
                        className="p-1 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600 font-medium tabular-nums">
                        {currentUploadPage}&nbsp;/&nbsp;{totalUploadPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentUploadPage === totalUploadPages}
                        onClick={() => setCurrentUploadPage((p) => p + 1)}
                        className="p-1 disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 sm:p-6 min-h-[200px]">
                  {isLoadingOptions ? (
                    <ListSkeleton />
                  ) : (
                    <motion.ul
                      className="space-y-4"
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {paginatedUploads.length > 0 ? (
                        paginatedUploads.map((file: PDFDocument) => {
                          const filename = file.pdfName || "";
                          const truncated =
                            filename.length > 50
                              ? filename.slice(0, 50) + "…"
                              : filename;
                          return (
                            <motion.li
                              key={file.pdfId}
                              variants={itemVariants}
                              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-xl border transition-all duration-200 hover:shadow-md hover:border-gray-300"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="text-sm font-medium text-gray-800 truncate">
                                      {truncated}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs max-w-[300px] break-words">
                                      {filename}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                <span className="text-xs text-gray-500 hidden sm:block">
                                  {formatDate(file.uploadedAt)}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-xs hover:bg-gray-100 transition-colors"
                                >
                                  <a
                                    href={file.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>View</span>
                                  </a>
                                </Button>
                              </div>
                            </motion.li>
                          );
                        })
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col items-center justify-center text-center text-gray-500 py-10"
                        >
                          <FileText className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="text-sm font-medium mb-2">
                            No uploads yet
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Link href="/upload-pdf">
                              Upload your first PDF
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </motion.ul>
                  )}
                </CardContent>
              </Card>
            </motion.section>

            {/* Chat History */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Card className="shadow-lg border border-gray-200 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm">
                <CardHeader className="flex justify-between items-center p-4 bg-gray-50/80 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Chat History
                  </CardTitle>
                  {totalChatPages > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentChatPage === 1}
                        onClick={() => setCurrentChatPage((p) => p - 1)}
                        className="p-1 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600 font-medium tabular-nums">
                        {currentChatPage}&nbsp;/&nbsp;{totalChatPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={currentChatPage === totalChatPages}
                        onClick={() => setCurrentChatPage((p) => p + 1)}
                        className="p-1 disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 sm:p-6 min-h-[200px]">
                  {isLoadingOptions ? (
                    <ListSkeleton />
                  ) : (
                    <motion.ul
                      className="space-y-4"
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {paginatedChats.length > 0 ? (
                        paginatedChats.map((chat) => {
                          const title = chat.title || "Untitled Chat";
                          const isEditing =
                            editingChatId === chat.chat_session_id;
                          return (
                            <motion.li
                              key={chat.chat_session_id}
                              variants={itemVariants}
                              layout
                              transition={{ duration: 0.2 }}
                              className={`flex flex-col sm:flex-row justify-between p-4 bg-white rounded-xl border transition-all duration-300 ${
                                isEditing
                                  ? "shadow-lg ring-2 ring-indigo-300 ring-offset-2 scale-[1.01]"
                                  : "hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
                              }`}
                            >
                              <div className="flex-1 min-w-[150px] mr-0 sm:mr-2">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) =>
                                          setEditingTitle(e.target.value)
                                        }
                                        onKeyDown={handleInputKeyDown}
                                        className="h-9 text-sm flex-grow rounded-md"
                                        disabled={isSavingRename}
                                        autoFocus
                                        aria-label="New chat title"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-1 text-red-600 hover:bg-red-100 rounded-full flex-shrink-0"
                                        onClick={handleCancelRename}
                                        disabled={isSavingRename}
                                        aria-label="Cancel rename"
                                      >
                                        <CancelIcon className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-1 text-green-600 hover:bg-green-100 rounded-full flex-shrink-0"
                                        onClick={handleSaveRename}
                                        disabled={
                                          isSavingRename || !editingTitle.trim()
                                        }
                                        aria-label="Save rename"
                                      >
                                        {isSavingRename ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Save className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                    {saveError && (
                                      <p className="text-xs text-red-500">
                                        {saveError}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <Tooltip>
                                      <TooltipTrigger>
                                        {chat.latest_pdfId ? (
                                          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        ) : (
                                          <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        )}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">
                                          {chat.latest_pdfId
                                            ? "Related to a PDF"
                                            : "General Chat Session"}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <span className="text-sm font-medium text-gray-800 truncate">
                                      {title}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {!isEditing && (
                                <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
                                  <span className="text-xs text-gray-500 hidden md:block">
                                    {formatDate(chat.last_activity)}
                                  </span>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1 text-xs transition-colors"
                                    onClick={() => handleContinueChat(chat)}
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                    <span>Continue</span>
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleEditStart(chat)}
                                        className="cursor-pointer text-sm"
                                      >
                                        <Edit3 className="mr-2 w-3.5 h-3.5" />
                                        Rename
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </motion.li>
                          );
                        })
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col items-center justify-center text-center text-gray-500 py-10"
                        >
                          <MessageSquare className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="text-sm font-medium mb-2">
                            No chat history yet
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={handleStartNewChat}
                          >
                            Start a new chat!
                          </Button>
                        </motion.div>
                      )}
                    </motion.ul>
                  )}
                </CardContent>
              </Card>
            </motion.section>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardPage;
