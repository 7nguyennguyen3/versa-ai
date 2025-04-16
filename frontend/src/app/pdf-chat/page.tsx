"use client";

import axios from "axios";
import React, { useCallback } from "react"; // Import React if not already
import UniversalChatComponent, {
  SendMessageHandlerParams, // Use the UNMODIFIED interface
} from "../_components/chat/UniversalChatComponent";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";

// --- Token Fetching Logic ---
const getTokenFromApi = async (): Promise<string | null> => {
  try {
    const tokenResponse = await fetch("/api/auth/get-token"); // <--- YOUR TOKEN ENDPOINT
    if (!tokenResponse.ok) {
      console.error("Failed to fetch auth token status:", tokenResponse.status);
      return null;
    }
    const tokenData = await tokenResponse.json();
    return tokenData?.token ?? null; // Adjust based on your endpoint's response
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
    return null;
  }
};
// --- End Token Fetching Logic ---

const PdfChatPage = () => {
  // Get authoritative userId from the auth store hook
  const { userId } = useAuthStore();

  // Get necessary actions and state via direct getState calls
  // This avoids unnecessary re-renders of PdfChatPage if other parts of the store change
  const updateChatTitleAction = useAppStore.getState().updateChatTitle;
  const markSessionAsNotNewAction = useAppStore.getState().markSessionAsNotNew;
  const { selectedModel } = useAppStore();

  console.log(selectedModel);

  // --- Implementation for onSendMessage ---
  const handleAuthenticatedSendMessage = useCallback(
    async (params: SendMessageHandlerParams) => {
      // Using the UNMODIFIED interface
      // Destructure ONLY the properties defined in the UNMODIFIED SendMessageHandlerParams
      const { message, pdfId, chatId, model, retrievalMethod, streamHandlers } =
        params;

      // Get potentially needed state at the time of execution
      const authUserId = useAuthStore.getState().userId; // Use authoritative ID
      const currentSelectedChat = useAppStore.getState().selectedChat; // Get current selectedChat object

      // --- Validations ---
      if (!authUserId) {
        streamHandlers.onStreamError("User ID not found. Cannot send message.");
        return;
      }
      // Although UniversalChatComponent should guarantee chatId now, keep check based on interface type
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
      const sessionIdToUse = chatId; // Use the ID from params

      // *** Determine if this is the first message for the session ***
      // Read the flag from the selectedChat state BEFORE the async call
      // Use ?? false to safely handle if selectedChat is null
      const isNewSessionForThisRequest =
        currentSelectedChat?.isNewSession ?? false;

      try {
        // 1. Get Authentication Token
        const token = await getTokenFromApi();
        if (!token) {
          throw new Error(
            "Authentication token is missing or could not be fetched."
          );
        }

        // 2. Initial POST request - Single, unified call
        console.log(
          `Sending POST to /chat_send for session: ${sessionIdToUse}, isNewSession: ${isNewSessionForThisRequest}`
        );
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // *** CORRECTED PAYLOAD ***
        // Construct payload matching backend's MessageRequest model
        const payload = {
          message: message,
          chat_session_id: sessionIdToUse,
          pdf_id: pdfId,
          userId: authUserId, // Use authoritative userId
          model: selectedModel,
          retrievalMethod: retrievalMethod,
          isNewSession: isNewSessionForThisRequest, // <<< SEND THE BOOLEAN FLAG
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_send`,
          payload, // Send the correctly structured payload
          { headers: headers }
        );
        // *** END CORRECTED PAYLOAD ***

        // 3. Process POST Response (Title Update)
        if (res.data?.new_title) {
          console.log(
            `Updating title for ${sessionIdToUse} to: ${res.data.new_title}`
          );
          // Call action obtained via getState
          updateChatTitleAction(sessionIdToUse, res.data.new_title);
        } else {
          console.log("No new title received from /chat_send");
        }

        // --- RESET THE isNewSession FLAG in the store ---
        // Only reset if the flag was actually true for THIS request
        if (isNewSessionForThisRequest) {
          console.log(`Marking session ${sessionIdToUse} as not new anymore.`);
          // Call action obtained via getState
          markSessionAsNotNewAction(sessionIdToUse); // <<< CALL THE ACTION
        }
        // --- END RESET THE FLAG ---

        // 4. Open EventSource Connection
        const streamUrl = `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/chat_stream/${sessionIdToUse}`;
        console.log("Opening EventSource:", streamUrl);
        eventSource = new EventSource(streamUrl);

        // 5. Handle Stream Events (No changes needed here)
        let botResponse = "";
        eventSource.onmessage = (event) => {
          const chunk = event.data;
          if (chunk && chunk.trim() !== "") {
            botResponse += chunk;
            streamHandlers.onChunkReceived(chunk);
          }
        };

        eventSource.addEventListener("end", (event) => {
          console.log("EventSource 'end' event received for:", sessionIdToUse);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          streamHandlers.onStreamComplete(botResponse);
        });

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
      } catch (err: any) {
        // Handle errors from POST request or token fetching
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
          err.response?.data?.message ||
          err.message ||
          "Failed to send message or initiate stream.";
        streamHandlers.onStreamError(errorMsg);
      }
    },
    // Dependencies for useCallback: userId from useAuthStore hook is the primary reactive value.
    // Actions obtained via getState don't strictly need to be dependencies, but including them
    // can sometimes help clarity or if their underlying logic could hypothetically change based on other state.
    [userId]
  );

  // --- Render Logic ---
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
        userId={userId} // Pass authoritative userId
        onSendMessage={handleAuthenticatedSendMessage} // Pass the callback
        pdfDataSource={[]} // Empty for authenticated mode
      />
    </div>
  );
};

export default PdfChatPage;
