import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAppStore } from "../_store/useAppStore";
import { ChatSession } from "../_global/interface";

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
  if (!message.trim()) {
    return;
  }

  const {
    currentChatId,
    currentPdfId,
    selectedPdf,
    addMessage,
    setChatLoading,
    setCurrentChat,
    addNewChatSession,
    messages,
    updateChatTitle,
  } = useAppStore.getState();

  addMessage({ role: "human", content: message });
  setChatLoading(true);

  const sessionId: string = currentChatId ?? uuidv4();

  const isNewSession = !currentChatId || messages.length === 0;

  if (!currentChatId) {
    const newSession: ChatSession = {
      chat_session_id: sessionId,
      chat_history: [...useAppStore.getState().messages],
      last_activity: new Date(),
      latest_pdfId: currentPdfId || selectedPdf?.pdfId || "",
      title: "New Chat",
      userId: userId!,
    };

    addNewChatSession(userId || "", sessionId);
    setCurrentChat(newSession);
  }

  let eventSource: EventSource | null = null;

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_send`,
      {
        message,
        chat_session_id: sessionId,
        pdf_id: currentPdfId || selectedPdf?.pdfId,
        userId,
        isNewSession,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.new_title) {
      updateChatTitle(sessionId, res.data.new_title);
    }

    eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_stream/${sessionId}`
    );

    let botResponse = "";
    let buffer = "";
    let lastUpdate = Date.now();

    eventSource.onmessage = (event) => {
      buffer += event.data;

      const now = Date.now();
      if (now - lastUpdate >= 100) {
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
      if (eventSource) {
        console.log("Closing EventSource connection"); // Log before closing the EventSource
        eventSource.close();
        eventSource = null; // Clear the reference
      }
      setChatLoading(false);
      const finalContent = botResponse;
      addMessage({ role: "ai", content: finalContent });
      onStreamComplete(finalContent);
    });

    eventSource.onerror = (error) => {
      if (eventSource) {
        eventSource.close();
        eventSource = null; // Clear the reference
      }
      setChatLoading(false);
    };
  } catch (err) {
    if (eventSource) {
      eventSource.close();
      eventSource = null; // Clear the reference
    }
    setChatLoading(false);
  }
};
