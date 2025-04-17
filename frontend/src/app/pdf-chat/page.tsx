"use client";

import axios from "axios";
import { useCallback } from "react";
import UniversalChatComponent, {
  SendMessageHandlerParams,
} from "../_components/chat/UniversalChatComponent";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";

const getTokenFromApi = async (): Promise<string | null> => {
  try {
    const tokenResponse = await fetch("/api/auth/get-token");
    if (!tokenResponse.ok) {
      console.error("Failed to fetch auth token status:", tokenResponse.status);
      return null;
    }
    const tokenData = await tokenResponse.json();
    return tokenData?.token ?? null;
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
    return null;
  }
};

const PdfChatPage = () => {
  const { userId } = useAuthStore();

  const updateChatTitleAction = useAppStore.getState().updateChatTitle;
  const markSessionAsNotNewAction = useAppStore.getState().markSessionAsNotNew;

  const handleAuthenticatedSendMessage = useCallback(
    async (params: SendMessageHandlerParams) => {
      const { message, pdfId, chatId, model, retrievalMethod, streamHandlers } =
        params;

      const authUserId = useAuthStore.getState().userId;
      const currentSelectedChat = useAppStore.getState().selectedChat;
      const currentSelectedModel = useAppStore.getState().selectedModel;
      const currentRetrievalMethod =
        useAppStore.getState().selectedRetrievalMethod;

      if (!authUserId) {
        streamHandlers.onStreamError("User ID not found. Cannot send message.");
        return;
      }
      if (!chatId) {
        streamHandlers.onStreamError(
          "Chat Session ID is missing. Cannot send message."
        );
        console.error(
          "handleAuthenticatedSendMessage called without a chatId."
        );
        return;
      }
      // --- End Validations ---

      let eventSource: EventSource | null = null;
      const sessionIdToUse = chatId;
      const isNewSessionForThisRequest =
        currentSelectedChat?.isNewSession ?? false;

      try {
        const token = await getTokenFromApi();
        if (!token) {
          throw new Error(
            "Authentication token is missing or could not be fetched."
          );
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const payload = {
          message: message,
          chat_session_id: sessionIdToUse,
          pdf_id: pdfId,
          userId: authUserId,
          model: currentSelectedModel,
          retrievalMethod: currentRetrievalMethod,
          isNewSession: isNewSessionForThisRequest,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_send`,
          payload,
          { headers: headers }
        );

        if (res.data?.new_title) {
          updateChatTitleAction(sessionIdToUse, res.data.new_title);
        } else {
        }

        if (isNewSessionForThisRequest) {
          markSessionAsNotNewAction(sessionIdToUse);
        }

        const streamUrl = `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_stream/${sessionIdToUse}`;
        eventSource = new EventSource(streamUrl);

        // --- Handle Stream Events (Keep as is) ---
        let botResponse = "";
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "chunk" && data.content) {
              botResponse += data.content.replace(/<br>/g, "\n"); // Convert back for internal state if needed
              streamHandlers.onChunkReceived(data.content); // Pass content with <br>
            } else if (data.type === "error") {
              console.error("Received error from stream:", data.content);
              streamHandlers.onStreamError(
                data.content || "Stream error occurred."
              );
              if (eventSource) {
                eventSource.close();
                eventSource = null;
              }
            }
            // Ignore keep-alive or other types for processing here
          } catch (e) {
            // Handle cases where event.data might not be JSON (e.g., only keep-alive comment)
            // Or handle JSON parsing errors
            if (event.data && !event.data.startsWith(":")) {
              // Avoid logging keep-alive unless debugging
              console.warn(
                "Non-JSON or unexpected message from SSE:",
                event.data,
                e
              );
            }
          }
        };

        // Using specific 'end' event from backend publisher
        eventSource.addEventListener("end", (event) => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          streamHandlers.onStreamComplete(botResponse);
        });

        // Standard onerror handler
        eventSource.onerror = (errorEvent) => {
          console.error(
            `EventSource error for session ${sessionIdToUse}:`,
            errorEvent
          );
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          streamHandlers.onStreamError(
            `Connection error during stream (Session: ${sessionIdToUse.substring(
              0,
              8
            )}...).`
          );
        };
        // --- End Handle Stream Events ---
      } catch (err: any) {
        console.error(
          `handleAuthenticatedSendMessage Error (Session: ${sessionIdToUse?.substring(
            0,
            8
          )}...):`,
          err
        );
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        const errorMsg =
          err.response?.data?.error || // Prefer specific error message
          err.response?.data?.message ||
          err.message ||
          "Failed to send message or initiate stream.";
        streamHandlers.onStreamError(errorMsg);
      }
    },
    [updateChatTitleAction, markSessionAsNotNewAction]
  );

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      <UniversalChatComponent
        isDemo={false}
        userId={userId}
        onSendMessage={handleAuthenticatedSendMessage}
        pdfDataSource={[]}
      />
    </div>
  );
};

export default PdfChatPage;
