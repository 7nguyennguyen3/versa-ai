"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../_store/useAuthStore";
import { useAppStore } from "../_store/useAppStore";
import { ChatSession } from "../_global/interface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ChatPage = () => {
  const { userId } = useAuthStore();
  const { currentChatId, addNewChatSession, setCurrentChat } = useAppStore();

  useEffect(() => {
    if (!currentChatId) {
      const timeout = setTimeout(() => {
        const generatedChatSessionId = uuidv4();
        const newSession: ChatSession = {
          chat_session_id: generatedChatSessionId,
          chat_history: [],
          last_activity: new Date(),
          latest_pdfId: "",
          userId: userId ?? "ZZhGEGRnjX2uZeGaCYpv",
        };

        addNewChatSession(newSession.userId!, generatedChatSessionId);
        setCurrentChat(newSession);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentChatId, setCurrentChat, addNewChatSession, userId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            🚀 Coming Soon! 🎉
          </CardTitle>
          <CardDescription className="text-center text-gray-600 mt-2">
            This page is currently in development. Stay tuned for something
            amazing! ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-700">
            <p>In the meantime, check out these pages:</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/pdf-chat">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300">
                📄 Go to PDF Chat
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-300">
                🗺️ View Roadmap
              </Button>
            </Link>
            <Link href="/upload-pdf">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300">
                📤 Upload PDF
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="text-center text-gray-500 text-sm">
          <p>{"We're working hard to bring you the best experience! 💪"}</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatPage;
