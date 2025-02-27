import { RoadmapProps } from "../roadmap/page";
import { PDFDocument } from "./interface";

export const APP_ROADMAP: RoadmapProps[] = [
  {
    devName: "JWT Authentication inside Cookies",
    status: "Completed",
    description: "Implement JWT authentication using cookies.",
    startDate: new Date("02/24/2025"),
    endDate: new Date("02/24/2025"),
    comments: "",
  },
  {
    devName: "Authorization Header for Non-SSE Routes",
    status: "Completed",
    description: "Implement authorization headers for non-SSE routes.",
    startDate: new Date("02/23/2025"),
    endDate: new Date("02/24/2025"),
    comments: "",
  },
  {
    devName: "Basic Rate Limiting",
    status: "Completed",
    description: "Implement basic rate limiting to prevent abuse.",
    startDate: new Date("02/24/2025"),
    endDate: new Date("02/24/2025"),
    comments: "",
  },
  {
    devName: "Demo Chat",
    status: "Completed",
    description: "Create a demo chat interface.",
    startDate: new Date("02/24/2025"),
    endDate: new Date("02/25/2025"),
    comments: "",
  },
  {
    devName:
      "Front-end field validation --> userId, pdfId, message, chat_session_id, other",
    status: "Not Started",
    description: "Implement front-end validation for various fields.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Github Login",
    status: "Not Started",
    description: "Add GitHub OAuth login functionality.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Reduce Bandwith Usage, Cache PDFs/ Other Strategies",
    status: "Not Started",
    description: "Reduce bandwidth usage by caching PDFs.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Rename Chat Session to be more descriptive",
    status: "Not Started",
    description: "Rename chat session to be more descriptive.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Optimize Uploaded PDF",
    status: "Not Started",
    description:
      "Have an option for user to optimize their uploaded PDFs before upserting to save bytes.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Custom No PDF Chat",
    status: "Not Started",
    description: "Implement chat functionality without PDF support.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Enhanced Data Parsing/Display for Chat",
    status: "Not Started",
    description: "Improve data parsing and display in the chat interface.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Cookies Auth for SSE Route",
    status: "Not Started",
    description: "Use cookies for SSE route authentication.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "CSRF Protection",
    status: "Not Started",
    description: "Add CSRF protection to secure the application.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Create test to stimulate handling 100+ users",
    status: "Not Started",
    description: "Create a test to simulate handling 100+ users.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Implement Custom Memory",
    status: "Not Started",
    description: "Add custom memory implementation for chat sessions.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },

  {
    devName: "UI Improvement",
    status: "Not Started",
    description: "Enhance the user interface for better usability.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },

  {
    devName: "Advanced Rate Limiting",
    status: "Not Started",
    description: "Add advanced rate limiting mechanisms.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
  {
    devName: "Reverse Proxy",
    status: "Not Started",
    description: "Set up a reverse proxy for the application.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
  },
];

export const MODEL_OPTIONS = [
  {
    name: "GPT-4o-Mini",
    value: "gpt-4o-mini",
    disabled: false,
  },
  {
    name: "GPT-4",
    value: "gpt-4",
    disabled: true,
  },
  {
    name: "GPT-3.5",
    value: "gpt-3.5",
    disabled: true,
  },
  {
    name: "Custom Model (Coming Soon)",
    value: "custom-model",
    disabled: true,
  },
];

export const RETRIEVAL_OPTIONS = [
  {
    name: "Similarity Search",
    value: "similarity-search",
    disabled: false,
  },
  {
    name: "Keyword Search",
    value: "keyword-search",
    disabled: true,
  },
  {
    name: "Hybrid Search",
    value: "hybrid-search",
    disabled: true,
  },
  {
    name: "Semantic Search",
    value: "semantic-search",
    disabled: true,
  },
];

export const publicPdfs: PDFDocument[] = [
  {
    pdfId: "cod-pdf",
    pdfUrl: "/cod.pdf",
    pdfName: "Cod",
    uploadedAt: new Date(),
  },
  {
    pdfId: "bitcoin-pdf",
    pdfUrl: "/bitcoin.pdf",
    pdfName: "Bitcoin",
    uploadedAt: new Date(),
  },
  {
    pdfId: "theory_of_relativity-pdf",
    pdfUrl: "/theory_of_relativity.pdf",
    pdfName: "Theory of Relativity",
    uploadedAt: new Date(),
  },
];

export const chatOptions = [
  { chat_session_id: "chat1", last_activity: new Date(), chat_history: [] },
  { chat_session_id: "chat2", last_activity: new Date(), chat_history: [] },
];
