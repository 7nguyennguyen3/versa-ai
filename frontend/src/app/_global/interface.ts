import { LucideProps } from "lucide-react";

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: "user";
  plan: "free" | "pro" | "premium" | "enterprise";
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
  monthlyUploadUsage: number;
  monthlyUploadLimit: number;
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
  summary?: string;
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
  isNewSession?: boolean;
}

export interface PdfOption {
  pdfId: string;
  pdfName: string;
  uploadedAt: string | Date;
  pdfUrl: string;
  summary: string;
  sizeInMB?: number;
  pageCount?: number;
}

export interface FeatureDetail {
  text: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  frequency: string;
  description: string;
  cta: string;
  features: FeatureDetail[];
  highlight: boolean;
  themeColorClass?: string;
  href?: string;
}

export interface RoadmapItem {
  devName: string;
  description: string;
  status: "In Progress" | "Completed" | "Not Started" | "Skipped" | "On Hold";
  priority: "Low" | "Medium" | "High";
  startDate: Date;
  endDate: Date;
  comments?: string;
}

export interface IntegrationCardProps {
  name: string;
  description: string;
  logoUrl: string;
  status: "Live" | "Coming Soon" | "Beta";
  category?: string;
  docsUrl?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  icon?: React.ElementType<LucideProps>;
  date: string;
  category: string;
  author?: string;
}
