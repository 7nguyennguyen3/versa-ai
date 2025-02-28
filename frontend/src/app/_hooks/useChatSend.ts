// sendMessage.ts
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { flushSync } from "react-dom";
import { useAppStore } from "../_store/useAppStore";

interface SendMessageProps {
  message: string;
  userId: string | null;
  token: string | null;
  onStreamUpdate: (data: string) => void;
  onStreamComplete: (finalResponse: string) => void;
}

export const sendMessage = async ({
  message,
  userId,
  token,
  onStreamUpdate,
  onStreamComplete,
}: SendMessageProps): Promise<void> => {
  if (!message.trim()) return;

  const {
    currentChatId,
    currentPdfId,
    selectedPdf,
    addMessage,
    setChatLoading,
    setCurrentChat,
    addNewChatSession,
  } = useAppStore.getState();

  // Add user message to the chat
  addMessage({ role: "human", content: message });
  setChatLoading(true);

  const sessionId: string = currentChatId ?? uuidv4();

  if (!currentChatId) {
    const newSession = {
      chat_session_id: sessionId,
      chat_history: [...useAppStore.getState().messages],
      last_activity: new Date(),
      latest_pdfId: currentPdfId || selectedPdf?.pdfId || "",
      userId: userId!,
    };

    addNewChatSession(userId || "", sessionId);
    setCurrentChat(newSession);
  }

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_send`,
      {
        message,
        chat_session_id: sessionId,
        pdf_id: currentPdfId || selectedPdf?.pdfId,
        userId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_stream/${sessionId}`
    );

    let botResponse = "";
    let buffer = "";
    let lastUpdate = Date.now();

    eventSource.onmessage = (event) => {
      buffer += event.data.replace(/<br>/g, "\n");

      // Throttle updates to avoid excessive re-renders
      const now = Date.now();
      if (now - lastUpdate >= 100) {
        // Update every 100ms
        botResponse += buffer;
        onStreamUpdate(botResponse);
        buffer = "";
        lastUpdate = now;
      }
    };

    eventSource.addEventListener("end", () => {
      if (buffer) {
        botResponse += buffer;
        onStreamUpdate(botResponse);
      }
      eventSource.close();
      setChatLoading(false);
      const finalContent = botResponse.replace(/<br>/g, "\n");
      addMessage({ role: "ai", content: finalContent });
      onStreamComplete(finalContent);
    });

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
      setChatLoading(false);
    };
  } catch (err) {
    console.error("Axios request failed:", err);
    setChatLoading(false);
  }
};
