export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: "user";
  plan: "free" | "pro" | "premium" | "enterprise";
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  monthlyUploadUsage: number; // Track monthly upload usage in bytes
  monthlyUploadLimit: number; // Track monthly upload limit in bytes
}

export interface AIMessageRequest {
  chat_session_id: string;
  message: string;
  pdf_id: string;
}

export interface PDFUploadRequirements {
  userId: string;
  pdf: File;
  pdfName: string;
}

export interface PDFDocument {
  pdfIngestionStatus: "pending" | "success" | "failed";
  pdfId: string;
  pdfUrl: string;
  uploadedAt: Date;
  userId?: string;
  pdfName: string;
}

export interface ChatMessage {
  role: "human" | "ai" | string;
  content: string;
  pdfId?: string;
}

export interface ChatSession {
  chat_session_id: string;
  chat_history: ChatMessage[];
  last_activity: Date | null;
  latest_pdfId: string;
  title: string;
  userId?: string;
}
