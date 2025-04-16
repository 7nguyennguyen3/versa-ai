"use client";

import UniversalChatComponent, {
  SendMessageHandlerParams,
} from "@/app/_components/chat/UniversalChatComponent";
import { publicPdfs } from "@/app/_global/variables";
import { useAppStore } from "@/app/_store/useAppStore";
import axios from "axios";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument } from "@/app/_global/interface";

const DemoPage = () => {
  // Only need actions/state relevant to demo setup & cleanup
  const {
    resetDemoState,
    setCurrentPdf,
    setCurrentChat,
    updateMessagesFromHistory,
  } = useAppStore();

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
    eventSourceRef.current?.close();
    const sessionId = demoSessionIdRef.current; // Use the stable session ID for this demo instance
    let accumulatedResponse = ""; // Accumulate response locally

    try {
      await axios.post("/api/chat/demo", {
        message: params.message,
        chat_session_id: sessionId,
        pdfId: params.pdfId,
        model: params.model,
        retrieval_method: params.retrievalMethod,
      });

      const streamUrl = `${process.env.NEXT_PUBLIC_CHAT_ENDPOINT}/demo_chat_stream/${sessionId}`;
      eventSourceRef.current = new EventSource(streamUrl);

      eventSourceRef.current.onmessage = (event) => {
        const chunk = event.data.replace(/<br>/g, "\n");
        accumulatedResponse += chunk;
        params.streamHandlers.onChunkReceived(chunk); // Call UI callback
      };

      eventSourceRef.current.addEventListener("end", () => {
        eventSourceRef.current?.close();
        params.streamHandlers.onStreamComplete(accumulatedResponse); // Call UI callback with final message
      });

      eventSourceRef.current.onerror = (error) => {
        console.error("SSE connection error:", error);
        eventSourceRef.current?.close();
        params.streamHandlers.onStreamError("Connection to assistant failed."); // Call UI callback
      };
    } catch (err: any) {
      console.error("Demo send/stream setup failed:", err);
      params.streamHandlers.onStreamError(
        err.message || "Failed to start chat."
      ); // Call UI callback
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
