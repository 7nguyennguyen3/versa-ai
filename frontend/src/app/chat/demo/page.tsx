"use client";

import { publicPdfs } from "@/app/_global/variables";
import { useAppStore } from "@/app/_store/useAppStore";
import axios from "axios";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument } from "@/app/_global/interface";
import UniversalChatComponent, {
  SendMessageHandlerParams,
} from "@/app/_components/chat/UniversalChatComponent";

const DemoPage = () => {
  const { resetDemoState, setCurrentPdf, setCurrentChat } = useAppStore();

  const eventSourceRef = useRef<EventSource | null>(null);
  const demoSessionIdRef = useRef<string>(uuidv4()); // Manage session ID locally

  useEffect(() => {
    resetDemoState();
    demoSessionIdRef.current = uuidv4();
    const DEFAULT_PDF = publicPdfs.find((pdf) => pdf.pdfName === "Bitcoin")!;
    setCurrentPdf(DEFAULT_PDF);

    return () => {
      eventSourceRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handleDemoSendMessage = async (
    params: SendMessageHandlerParams
  ): Promise<void> => {
    // Close any existing EventSource connection before sending a new message
    eventSourceRef.current?.close();

    const sessionId = demoSessionIdRef.current; // Use the stable session ID for this demo instance
    let accumulatedResponse = ""; // Accumulate the full response locally

    try {
      // Send the user message to the backend demo endpoint
      await axios.post("/api/chat/demo", {
        message: params.message,
        chat_session_id: sessionId,
        pdfId: params.pdfId,
        model: params.model, // Assuming model is relevant for the demo chain
        retrieval_method: params.retrievalMethod, // Assuming retrieval method is relevant for the demo chain
      });

      // Construct the SSE stream URL
      const streamUrl = `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/demo_chat_stream/${sessionId}`;
      // Create a new EventSource connection
      eventSourceRef.current = new EventSource(streamUrl);

      // --- MODIFIED SSE HANDLERS ---

      // Handle incoming messages with JSON payloads (chunks, errors, etc.)
      // The server is expected to send data in the format: data: { "type": "...", "content": "..." }
      eventSourceRef.current.onmessage = (event) => {
        try {
          // Attempt to parse the data string as JSON
          const data = JSON.parse(event.data);

          // Check the type of the payload
          if (data.type === "chunk") {
            // Extract the actual content string from the payload
            const chunkContent = data.content;
            accumulatedResponse += chunkContent;
            // Pass ONLY the content string (which may contain Markdown) to the UI handler
            params.streamHandlers.onChunkReceived(chunkContent);
          } else if (data.type === "error") {
            // Handle error message payload sent from the server
            console.error("Received error payload:", data.content);
            // Close the stream on receiving an error signal
            eventSourceRef.current?.close();
            // Pass the error content to the UI handler
            params.streamHandlers.onStreamError(
              data.content || "An error occurred during streaming."
            );
          }
          // Add handlers for other potential types like 'complete' if needed via onmessage,
          // but the 'end' event listener below is standard for the final signal.
        } catch (e) {
          // If JSON parsing fails, log the error and the raw data received
          console.error("Failed to parse SSE data:", event.data, e);
          // Close the stream on a parsing error
          eventSourceRef.current?.close();
          // Notify the UI handler about the processing error
          params.streamHandlers.onStreamError(
            "Failed to process data from assistant."
          );
        }
      };

      // Handle the explicit 'end' event type sent by the server (event: end\ndata: \n\n)
      eventSourceRef.current.addEventListener("end", () => {
        console.log("Received SSE end event");
        // Close the EventSource connection
        eventSourceRef.current?.close();
        // Call the UI handler for stream completion with the full accumulated response
        params.streamHandlers.onStreamComplete(accumulatedResponse);
      });

      // Handle generic EventSource errors (e.g., connection issues)
      eventSourceRef.current.onerror = (error) => {
        console.error("SSE EventSource error:", error);
        // Close the EventSource connection
        eventSourceRef.current?.close();
        // Attempt to get an error message from the event or provide a default
        const errorMsg =
          (error as any).data || "An unknown streaming error occurred.";
        // Notify the UI handler about the streaming connection error
        params.streamHandlers.onStreamError(
          "Streaming connection error: " + errorMsg
        );
      };
    } catch (err: any) {
      console.error("Demo send/stream setup failed:", err);
      params.streamHandlers.onStreamError(
        err.message || "Failed to start chat."
      );
    }
  };

  const handleDemoPdfSelected = (pdf: PDFDocument) => {
    eventSourceRef.current?.close();
    demoSessionIdRef.current = uuidv4();
    setCurrentChat(null);
    // Message clearing is handled by UniversalChatComponent via updateMessagesFromHistory call within its own handler
  };

  const handleDemoNewChat = () => {
    eventSourceRef.current?.close();
    demoSessionIdRef.current = uuidv4();
    setCurrentChat(null);
    // Message clearing is handled by UniversalChatComponent via updateMessagesFromHistory call within its own handler
  };

  return (
    <div className="h-screen">
      <UniversalChatComponent
        isDemo={true}
        onSendMessage={handleDemoSendMessage}
        pdfDataSource={publicPdfs}
        initialPdf={publicPdfs.find((pdf) => pdf.pdfName === "Bitcoin")}
        onDemoPdfSelected={handleDemoPdfSelected}
        onDemoNewChat={handleDemoNewChat}
      />
    </div>
  );
};

export default DemoPage;
