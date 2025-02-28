import axios from "axios";
import { create } from "zustand";
import { ChatMessage, ChatSession, PDFDocument } from "../_global/interface";

interface AppStoreState {
  // Chat State
  messages: ChatMessage[];
  chatData: string;
  isChatLoading: boolean;
  currentPdfId: string | null;
  currentChatId: string | null;

  // Selection State
  selectedPdf: PDFDocument | null;
  selectedChat: ChatSession | null;
  selectedModel: string;
  selectedRetrievalMethod: string;

  // Options State
  pdfOptions: PDFDocument[];
  chatOptions: ChatSession[];
  isLoadingOptions: boolean;
  error: string | null;

  // Actions
  // Chat Actions
  addMessage: (message: ChatMessage) => void;
  appendMessagePart: (content: string) => void;
  setChatData: (data: string) => void;
  setChatLoading: (loading: boolean) => void;
  updateMessagesFromHistory: (history: ChatMessage[]) => void;

  // Selection Actions
  setCurrentPdf: (pdf: PDFDocument | null) => void;
  setCurrentChat: (chat: ChatSession | null) => void;
  setModel: (model: string) => void;
  setRetrievalMethod: (method: string) => void;

  // Data Fetching Actions
  fetchPdfOptions: (userId: string) => Promise<void>;
  fetchChatOptions: (userId: string) => Promise<void>;
  addNewChatSession: (userId: string, sessionId: string) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  // Initial State
  messages: [],
  chatData: "",
  isChatLoading: false,
  currentPdfId: null,
  currentChatId: null,
  selectedPdf: null,
  selectedChat: null,
  selectedModel: "gpt-4o-mini",
  selectedRetrievalMethod: "similarity-search",
  pdfOptions: [],
  chatOptions: [],
  isLoadingOptions: false,
  error: null,

  // Actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  appendMessagePart: (content) =>
    set((state) => {
      const lastMessage = state.messages[state.messages.length - 1];
      if (!lastMessage || lastMessage.role !== "ai") return state;

      return {
        messages: state.messages.map((msg, i) =>
          i === state.messages.length - 1
            ? { ...msg, content: msg.content + content }
            : msg
        ),
      };
    }),
  setChatData: (data) => set({ chatData: data }),
  setChatLoading: (loading) => set({ isChatLoading: loading }),
  updateMessagesFromHistory: (history) => set({ messages: history }),

  setCurrentPdf: (pdf) =>
    set({
      selectedPdf: pdf,
      currentPdfId: pdf?.pdfId || null,
    }),

  setCurrentChat: (chat) =>
    set({
      selectedChat: chat,
      currentChatId: chat?.chat_session_id || null,
      currentPdfId: chat?.latest_pdfId || null,
    }),

  setModel: (model) => set({ selectedModel: model }),
  setRetrievalMethod: (method) => set({ selectedRetrievalMethod: method }),

  fetchPdfOptions: async (userId) => {
    set({ isLoadingOptions: true, error: null });
    try {
      const response = await axios.post("/api/pdf/get-user-pdfs", { userId });
      set({ pdfOptions: response.data, isLoadingOptions: false });
    } catch (err) {
      set({ error: "Failed to fetch PDFs", isLoadingOptions: false });
    }
  },

  fetchChatOptions: async (userId) => {
    set({ isLoadingOptions: true, error: null });
    try {
      const response = await axios.post("/api/chat", { userId });
      set({ chatOptions: response.data, isLoadingOptions: false });
    } catch (err) {
      set({ error: "Failed to fetch chats", isLoadingOptions: false });
    }
  },

  addNewChatSession: (userId, sessionId) => {
    const newSession: ChatSession = {
      chat_session_id: sessionId,
      chat_history: [],
      last_activity: new Date(),
      latest_pdfId: "",
      userId,
    };
    set((state) => ({ chatOptions: [newSession, ...state.chatOptions] }));
  },
}));
