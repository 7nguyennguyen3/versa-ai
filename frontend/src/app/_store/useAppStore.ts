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
  cacheBuster: number | null; // Add cacheBuster to the state

  // Actions
  // Chat Actions
  addMessage: (message: ChatMessage) => void;
  appendMessagePart: (content: string) => void;
  setChatData: (data: string) => void;
  setChatLoading: (loading: boolean) => void;
  updateMessagesFromHistory: (history: ChatMessage[]) => void;
  updateChatTitle: (sessionId: string, newTitle: string) => void;

  // Selection Actions
  setCurrentPdf: (pdf: PDFDocument | null) => void;
  setCurrentChat: (chat: ChatSession | null) => void;
  markSessionAsNotNew: (sessionId: string) => void;
  setModel: (model: string) => void;
  setRetrievalMethod: (method: string) => void;

  // Data Fetching Actions
  fetchPdfOptions: (
    userId: string,
    cacheBuster?: number | null
  ) => Promise<void>; // Add cacheBuster parameter
  fetchChatOptions: (userId: string) => Promise<void>;
  addNewChatSession: (userId: string, sessionId: string) => void;
  resetDemoState: () => void;
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
  selectedModel: "gemini-2.0",
  selectedRetrievalMethod: "similarity-search",
  pdfOptions: [],
  chatOptions: [],
  isLoadingOptions: false,
  error: null,
  cacheBuster: null, // Initialize cacheBuster

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
  updateChatTitle: (sessionId, newTitle) =>
    set((state) => ({
      chatOptions: state.chatOptions.map((chat) =>
        chat.chat_session_id === sessionId ? { ...chat, title: newTitle } : chat
      ),
    })),

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
  markSessionAsNotNew: (sessionId) =>
    set((state) => {
      let updatedSelectedChat = state.selectedChat;

      // Update selectedChat if it's the one being marked
      // Check if selectedChat exists and matches the sessionId before updating
      if (
        state.selectedChat &&
        state.selectedChat.chat_session_id === sessionId
      ) {
        // Create a new object with the updated flag
        updatedSelectedChat = {
          ...state.selectedChat,
          isNewSession: false, // Set the flag to false
        };
      }

      // ALSO update the chat in the chatOptions list for consistency
      // Otherwise, if the user selects it again later, it might still think it's new
      const updatedChatOptions = state.chatOptions.map((chat) =>
        chat.chat_session_id === sessionId
          ? { ...chat, isNewSession: false } // Update the flag here too
          : chat
      );

      // Return the updated state
      return {
        selectedChat: updatedSelectedChat,
        chatOptions: updatedChatOptions,
      };
    }),

  setModel: (model) => set({ selectedModel: model }),
  setRetrievalMethod: (method) => set({ selectedRetrievalMethod: method }),

  fetchPdfOptions: async (userId, cacheBuster = null) => {
    set({ isLoadingOptions: true, error: null });
    try {
      const response = await axios.post("/api/pdf/get-user-pdfs", {
        userId,
        cacheBuster,
      });
      set({
        pdfOptions: response.data.pdfs,
        cacheBuster: response.data.cacheBuster, // Update cacheBuster in the store
        isLoadingOptions: false,
      });
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
      title: "New Chat",
      userId,
    };
    set((state) => ({ chatOptions: [newSession, ...state.chatOptions] }));
  },

  resetDemoState: () => {
    set({
      messages: [],
      chatData: "",
      selectedPdf: null,
      currentPdfId: null,
      currentChatId: null,
      isChatLoading: false,
    });
  },
}));
