"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatComponent from "../_components/ChatComponent";
import { useAuthStore } from "../_store/useAuthStore";
import { useAppStore } from "../_store/useAppStore";
import { ChatSession } from "../_global/interface";

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

  return <ChatComponent userId={userId} />;
};

export default ChatPage;
