import { v4 as uuidv4 } from "uuid";
import axios from "axios";
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

  // Create new chat session if needed
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_stream/${sessionId}`
    );

    let botResponse = "";

    eventSource.onmessage = (event) => {
      botResponse += event.data.replace(/<br>/g, "\n");
      onStreamUpdate(botResponse); // Use callback instead of store update
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
      setChatLoading(false);
      const finalContent = botResponse.replace(/<br>/g, "\n");
      addMessage({ role: "ai", content: finalContent });
      onStreamComplete(finalContent); // Final update
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
