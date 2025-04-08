"use client";
import ChatComponent from "../_components/ChatComponent";
import { useAuthStore } from "../_store/useAuthStore";

const PdfChatPage = () => {
  const { userId } = useAuthStore();

  return (
    <div className="h-screen bg-white">
      <ChatComponent userId={userId} />
    </div>
  );
};

export default PdfChatPage;
