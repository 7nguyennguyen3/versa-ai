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
  console.log("sendMessage function called"); // Log when the function starts

  if (!message.trim()) {
    console.log("Message is empty, returning early"); // Log if the message is empty
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

  console.log("Adding user message to the chat"); // Log before adding the user message
  addMessage({ role: "human", content: message });
  setChatLoading(true);

  const sessionId: string = currentChatId ?? uuidv4();
  console.log(`Session ID: ${sessionId}`); // Log the session ID

  const isNewSession = !currentChatId || messages.length === 0;
  console.log(`Is new session? ${isNewSession}`); // Log whether it's a new session

  if (!currentChatId) {
    console.log("Creating a new chat session"); // Log when creating a new session
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
    console.log("Sending POST request to /chat_send"); // Log before sending the POST request
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

    console.log("POST request completed, response:", res.data); // Log the response from the POST request

    if (res.data.new_title) {
      console.log(`Updating chat title to: ${res.data.new_title}`); // Log if a new title is received
      updateChatTitle(sessionId, res.data.new_title);
    }

    console.log("Creating EventSource for SSE connection"); // Log before creating the EventSource
    eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_stream/${sessionId}`
    );

    let botResponse = "";
    let buffer = "";
    let lastUpdate = Date.now();

    eventSource.onmessage = (event) => {
      console.log("Received SSE message:", event.data); // Log each SSE message received
      buffer += event.data;

      const now = Date.now();
      if (now - lastUpdate >= 100) {
        botResponse += buffer;
        console.log("Updating bot response:", botResponse); // Log the updated bot response
        onStreamUpdate(botResponse);
        buffer = "";
        lastUpdate = now;
      }
    };

    eventSource.addEventListener("end", () => {
      console.log("SSE 'end' event received"); // Log when the 'end' event is received
      if (buffer) {
        botResponse += buffer;
        console.log("Finalizing bot response with buffer:", botResponse); // Log the final bot response
        onStreamUpdate(botResponse);
      }
      if (eventSource) {
        console.log("Closing EventSource connection"); // Log before closing the EventSource
        eventSource.close();
        eventSource = null; // Clear the reference
      }
      setChatLoading(false);
      const finalContent = botResponse;
      console.log("Adding final AI message to the chat:", finalContent); // Log the final AI message
      addMessage({ role: "ai", content: finalContent });
      onStreamComplete(finalContent);
    });

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error); // Log any SSE errors
      if (eventSource) {
        console.log("Closing EventSource due to error"); // Log before closing the EventSource
        eventSource.close();
        eventSource = null; // Clear the reference
      }
      setChatLoading(false);
    };
  } catch (err) {
    console.error("Axios request failed:", err); // Log any Axios errors
    if (eventSource) {
      console.log("Closing EventSource due to Axios error"); // Log before closing the EventSource
      eventSource.close();
      eventSource = null; // Clear the reference
    }
    setChatLoading(false);
  }
};
