import { create } from "zustand";
import axios from "axios";
import { ChatSession, PDFDocument } from "../_global/interface";
import { MODEL_OPTIONS, RETRIEVAL_OPTIONS } from "../_global/variables";

interface GearStoreState {
  // Selected values
  selectedPdf: PDFDocument | null;
  selectedChat: ChatSession | null;
  selectedModel: string;
  retrievalMethod: string;

  // Options
  pdfOptions: PDFDocument[];
  chatOptions: ChatSession[];
  modelOptions: { name: string; value: string; disabled?: boolean }[];
  retrievalOptions: { name: string; value: string }[];

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedPdf: (pdf: PDFDocument | null) => void;
  setSelectedChat: (chat: ChatSession | null) => void;
  setSelectedModel: (model: string) => void;
  setRetrievalMethod: (method: string) => void;
  fetchPdfOptions: (userId: string) => Promise<void>;
  fetchChatOptions: (userId: string) => Promise<void>;
  addNewChatSession: (userId: string, chat_session_id: string) => void; // Simplified function to add a new session
}

export const useGearStore = create<GearStoreState>((set) => ({
  selectedPdf: null,
  selectedChat: null,
  selectedModel: "gpt-4o-mini",
  retrievalMethod: "similarity-search",
  pdfOptions: [],
  chatOptions: [],
  modelOptions: MODEL_OPTIONS,
  retrievalOptions: RETRIEVAL_OPTIONS,
  isLoading: false,
  error: null,

  setSelectedPdf: (pdf) => set({ selectedPdf: pdf }),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setRetrievalMethod: (method) => set({ retrievalMethod: method }),

  fetchPdfOptions: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/pdf/get-user-pdfs", { userId });
      set({ pdfOptions: response.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to fetch PDFs", isLoading: false });
    }
  },

  fetchChatOptions: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/chat", { userId });
      set({ chatOptions: response.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to fetch chats", isLoading: false });
    }
  },

  addNewChatSession: (userId: string, chat_session_id) => {
    const newSession: ChatSession = {
      chat_session_id: chat_session_id,
      chat_history: [],
      last_activity: new Date(),
      latest_pdfId: "",
      userId: userId,
    };

    set((state) => ({
      chatOptions: [newSession, ...state.chatOptions],
    }));
  },
}));
