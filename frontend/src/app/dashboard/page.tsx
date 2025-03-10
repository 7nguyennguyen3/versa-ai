"use client";
import { Button } from "@/components/ui/button";
import { FileText, Menu, MessageSquare } from "lucide-react";
import { useAppStore } from "../_store/useAppStore";
import { useState } from "react";
import { ChatSession } from "../_global/interface";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../_store/useAuthStore";

const DashboardPage = () => {
  const {
    pdfOptions,
    chatOptions,
    setCurrentChat,
    setCurrentPdf,
    addNewChatSession,
    selectedPdf,
  } = useAppStore();
  const { userId } = useAuthStore();
  const router = useRouter();
  const [currentUploadPage, setCurrentUploadPage] = useState(1);
  const [currentChatPage, setCurrentChatPage] = useState(1);
  const itemsPerPage = 10;

  const [renamingChat, setRenamingChat] = useState<ChatSession | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  // Pagination calculations using real data only
  const totalUploadPages = Math.ceil(pdfOptions.length / itemsPerPage);
  const totalChatPages = Math.ceil(chatOptions.length / itemsPerPage);

  const paginatedUploads = pdfOptions.slice(
    (currentUploadPage - 1) * itemsPerPage,
    currentUploadPage * itemsPerPage
  );

  const paginatedChats = chatOptions.slice(
    (currentChatPage - 1) * itemsPerPage,
    currentChatPage * itemsPerPage
  );

  const handleStartNewChat = () => {
    const sessionId = uuidv4();

    addNewChatSession(userId ?? "", sessionId);

    const newChat: ChatSession = {
      chat_session_id: sessionId,
      chat_history: [],
      last_activity: new Date(),
      latest_pdfId: selectedPdf?.pdfId || "",
      title: "New Chat",
      userId: "current-user-id",
    };

    setCurrentChat(newChat);

    if (selectedPdf) {
      setCurrentPdf(selectedPdf);
    }

    router.push("/pdf-chat");
  };

  const handleRenameStart = (chat: ChatSession) => {
    setRenamingChat(chat);
    setNewTitle(chat.title);
    setRenameError("");
  };

  const handleRenameConfirm = async () => {
    if (!renamingChat || !newTitle.trim()) {
      setRenameError("Please enter a valid title");
      return;
    }

    try {
      setIsRenaming(true);
      const response = await axios.post("/api/chat/rename", {
        chatId: renamingChat.chat_session_id,
        newTitle: newTitle.trim(),
      });

      if (response.status === 200) {
        useAppStore
          .getState()
          .updateChatTitle(renamingChat.chat_session_id, newTitle.trim());
        setRenamingChat(null);
      }
    } catch (error) {
      setRenameError("Failed to rename chat. Please try again.");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleContinueChat = (chat: ChatSession) => {
    setCurrentChat(chat);

    const associatedPdf = pdfOptions.find(
      (pdf) => pdf.pdfId === chat.latest_pdfId
    );

    if (associatedPdf) {
      setCurrentPdf(associatedPdf);
    }

    router.push("/pdf-chat");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-5 hidden md:block">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 hover:bg-gray-100 rounded-lg px-4 py-3"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">📁 Recent Uploads</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 hover:bg-gray-100 rounded-lg px-4 py-3"
              >
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700">💬 Chat History</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🎉 Welcome to Your Dashboard
          </h1>
          <Button variant="outline" className="md:hidden rounded-lg px-3 py-2">
            <Menu className="h-5 w-5 mr-2 text-purple-600" />
            <span className="text-gray-700">Menu</span>
          </Button>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-5 transition-all">
            <Link href="/upload-pdf">
              <span className="text-xl mr-2">📤</span>
              Upload PDF
            </Link>
          </Button>
          <Button
            onClick={handleStartNewChat}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-5 transition-all"
          >
            <Link href="/pdf-chat">
              <span className="text-xl mr-2">💬</span>
              Start New Chat
            </Link>
          </Button>
        </div>
        {/* Recent Uploads */}
        <section className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              📁 Recent Uploads
            </h2>
            {totalUploadPages > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentUploadPage === 1}
                  onClick={() => setCurrentUploadPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentUploadPage === totalUploadPages}
                  onClick={() => setCurrentUploadPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
          <ul className="space-y-3">
            {paginatedUploads.length > 0 ? (
              paginatedUploads.map((file) => (
                <li
                  key={file.pdfId}
                  className="flex justify-between items-center px-4 py-3 bg-gray-50/50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div>
                    <span className="mr-3">📄</span>
                    <span className="text-gray-700">{file.pdfName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm hidden sm:block">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(file.pdfUrl, "_blank");
                      }}
                    >
                      View
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 px-4">No uploads yet.</p>
            )}
          </ul>
        </section>
        {/* Chat History */}
        <section className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              💬 Chat History
            </h2>
            {totalChatPages > 1 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentChatPage === 1}
                  onClick={() => setCurrentChatPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentChatPage === totalChatPages}
                  onClick={() => setCurrentChatPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
          <ul className="space-y-3">
            {paginatedChats.length > 0 ? (
              paginatedChats.map((chat) => (
                <li
                  key={chat.chat_session_id}
                  className="flex justify-between items-center px-4 py-3 bg-gray-50/50
                   hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div>
                    <span className="mr-3">🤖</span>
                    <span className="text-gray-700">{chat.title}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRenameStart(chat)}
                      disabled={isRenaming}
                    >
                      Rename
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContinueChat(chat)}
                    >
                      Continue
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 px-4">No chat history available.</p>
            )}
          </ul>
        </section>
        <Dialog
          open={!!renamingChat}
          onOpenChange={(open) => !open && setRenamingChat(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename Chat Session</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new chat title"
                disabled={isRenaming}
              />
              {renameError && (
                <p className="text-red-500 text-sm">{renameError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRenamingChat(null)}
                disabled={isRenaming}
              >
                Cancel
              </Button>
              <Button onClick={handleRenameConfirm} disabled={isRenaming}>
                {isRenaming ? "Renaming..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        ;
      </main>
    </div>
  );
};

export default DashboardPage;
