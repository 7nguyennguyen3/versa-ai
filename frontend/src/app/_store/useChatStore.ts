import { create } from "zustand";
import { ChatMessage, ChatSession, PDFDocument } from "../_global/interface";

interface ChatState {
  messages: ChatMessage[]; // Stores chat messages
  data: string; // Stores PDF content or other data
  loading: boolean; // Loading state
  pdfId: string | null; // Current PDF ID
  chatId: string | null; // Current chat session ID
  selectedPdf: PDFDocument | null; // Selected PDF document
  selectedChat: ChatSession | null; // Selected chat session
  addMessage: (message: ChatMessage) => void; // Add a new message
  setData: (data: string) => void; // Set PDF content or other data
  setLoading: (loading: boolean) => void; // Set loading state
  setChatId: (chatId: string | null) => void; // Set current chat session ID
  setPdfId: (pdfId: string | null) => void; // Set current PDF ID
  setSelectedPdf: (pdf: PDFDocument | null) => void; // Set selected PDF
  setSelectedChat: (chat: ChatSession | null) => void; // Set selected chat session
  updateMessagesFromChatHistory: (chatHistory: ChatMessage[]) => void; // Update messages from chat history
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  data: "",
  loading: false,
  pdfId: null,
  chatId: null,
  selectedPdf: null,
  selectedChat: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setChatId: (chatId) => set({ chatId }),
  setPdfId: (pdfId) => set({ pdfId }),
  setSelectedPdf: (pdf) => set({ selectedPdf: pdf }),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  updateMessagesFromChatHistory: (chatHistory) =>
    set({ messages: chatHistory }),
}));
