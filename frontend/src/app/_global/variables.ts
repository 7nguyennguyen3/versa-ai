import { PDFDocument } from "./interface";

export interface RoadmapProps {
  devName: string;
  status: "In Progress" | "Completed" | "Not Started" | "Skipped" | "On Hold";
  description: string;
  startDate: Date;
  endDate: Date;
  comments?: string;
  priority: "Low" | "Medium" | "High";
}

export const APP_ROADMAP: RoadmapProps[] = [
  {
    devName: "JWT Authentication inside Cookies",
    status: "Completed",
    description: "Implement JWT authentication using cookies.",
    startDate: new Date("02/24/2025"),
    endDate: new Date("02/24/2025"),
    comments: "",
    priority: "High",
  },
  {
    devName: "Authorization Header for Non-SSE Routes",
    status: "Completed",
    description: "Implement authorization headers for non-SSE routes.",
    startDate: new Date("02/23/2025"),
    endDate: new Date("02/24/2025"),
    comments: "",
    priority: "High",
  },
  {
    devName: "Basic Rate Limiting",
    status: "Completed",
    description: "Implement basic rate limiting to prevent abuse.",
    startDate: new Date("02/24/2025"),
    endDate: new Date("02/24/2025"),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Demo Chat",
    status: "Completed",
    description: "Create a demo chat interface.",
    startDate: new Date("02/25/2025"),
    endDate: new Date("02/26/2025"),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Fix React State Update Limit",
    status: "Completed",
    description: "React state update too frequently during SSE.",
    startDate: new Date("02/27/2025"),
    endDate: new Date("02/28/2025"),
    comments: "",
    priority: "High",
  },
  {
    devName: "Github Login",
    status: "Completed",
    description: "Add GitHub OAuth login functionality.",
    startDate: new Date("02/28/2025"),
    endDate: new Date("02/28/2025"),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Sending message validation",
    status: "Completed",
    description: "Implement front-end validation for various fields.",
    startDate: new Date("03/01/2025"),
    endDate: new Date("03/01/2025"),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "CDN Caching for PDFs",
    status: "Completed",
    description:
      "Used Vercel built-in CDN caching for PDFs metadata. Changed Cache-Control header to 1 year.",
    startDate: new Date("03/01/2025"),
    endDate: new Date("03/01/2025"),
    comments: "",
    priority: "Low",
  },
  {
    devName: "Reduce Bandwidth Usage, Cache PDFs/ Other Strategies",
    status: "Completed",
    description: "Reduce bandwidth usage by caching PDFs.",
    startDate: new Date("03/4/2025"),
    endDate: new Date("03/04/2025"),
    comments:
      "Used Vercel Blob Storage Built-in CDN & Firebase Storage Caching Strategy",
    priority: "High",
  },
  {
    devName: "Rename Chat Session to be more descriptive",
    status: "Completed",
    description: "Rename chat session to be more descriptive.",
    startDate: new Date("03/07/2025"),
    endDate: new Date("03/07/2025"),
    comments: "Utilized another LLM chain to generate a more descriptive title",
    priority: "High",
  },
  {
    devName: "Add feature for manual rename chat session",
    status: "Completed",
    description: "Let user manually rename chat session.",
    startDate: new Date("03/09/2025"),
    endDate: new Date("03/09/2025"),
    comments: "Created a new endpoint to update chat session title",
    priority: "Low",
  },
  {
    devName: "Enhanced Data Parsing/Display for Chat",
    status: "In Progress",
    description: "Improve data parsing and display in the chat interface.",
    startDate: new Date("3/08/2025"),
    endDate: new Date(),
    comments:
      "Currently using React Markdown, better spacing with proper <br> and \n parsing",
    priority: "Medium",
  },
  {
    devName: "Add Upload Limit Feature",
    status: "Completed",
    description: "Limit free tier user to 10 mb per month",
    startDate: new Date("3/07/2025"),
    endDate: new Date("3/07/2025"),
    comments:
      "Updated interface and current-user route and uploadp page to handle upload limit",
    priority: "High",
  },
  {
    devName: "Add Feature to Reset Users Upload Limit Monthly",
    status: "Completed",
    description: "Cron job or API to reset users upload limit monthly",
    startDate: new Date("3/09/2025"),
    endDate: new Date("3/09/2025"),
    comments: "Used cron-job.org",
    priority: "Medium",
  },
  {
    devName: "Optimize Uploaded PDF",
    status: "Not Started",
    description:
      "Have an option for user to optimize their uploaded PDFs before upserting to save bytes.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Dashboard & Settings Page",
    status: "In Progress",
    description:
      "Update the dashboard and setting page to include functionality.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Cookies Auth for SSE Route",
    status: "Not Started",
    description: "Use cookies for SSE route authentication.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "High",
  },
  {
    devName: "CSRF Protection",
    status: "Not Started",
    description: "Add CSRF protection to secure the application.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "High",
  },
  {
    devName: "UI Improvement",
    status: "In Progress",
    description: "Enhance the user interface for better usability.",
    startDate: new Date("03/02/2025"),
    endDate: new Date(),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Object Generation Streaming",
    status: "Skipped",
    description: "Upgrade the current approach of streaming text only.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "Not Necessary --> Used React Markdown for now",
    priority: "Medium",
  },
  {
    devName: "Create test to simulate handling 100+ users",
    status: "Not Started",
    description: "Create a test to simulate handling 100+ users.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Custom No PDF Chat",
    status: "Not Started",
    description: "Implement chat functionality without PDF support.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "Low",
  },
  {
    devName: "Implement Custom Memory",
    status: "Not Started",
    description: "Add custom memory implementation for chat sessions.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Advanced Rate Limiting",
    status: "Not Started",
    description: "Add advanced rate limiting mechanisms.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "",
    priority: "Low",
  },
  {
    devName: "Reverse Proxy",
    status: "Skipped",
    description: "Set up a reverse proxy for the application.",
    startDate: new Date(),
    endDate: new Date(),
    comments: "Not Needed",
    priority: "Medium",
  },
];

export const PLAN_LIMITS = {
  free: 10 * 1024 * 1024, // 10 MB in bytes
  pro: 100 * 1024 * 1024, // 100 MB in bytes
  premium: 1024 * 1024 * 1024, // 1 GB in bytes
  enterprise: 10 * 1024 * 1024 * 1024, // 10 GB in bytes
};

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
    pdfUrl: `${process.env.NEXT_PUBLIC_COD_PDF}`,
    pdfName: "Cod",
    uploadedAt: new Date(),
    pdfIngestionStatus: "success",
  },
  {
    pdfId: "bitcoin-pdf",
    pdfUrl: `${process.env.NEXT_PUBLIC_BITCOIN_PDF}`,
    pdfName: "Bitcoin",
    uploadedAt: new Date(),
    pdfIngestionStatus: "success",
  },
  {
    pdfId: "theory_of_relativity-pdf",
    pdfUrl: `${process.env.NEXT_PUBLIC_TOR_PDF}`,
    pdfName: "Theory of Relativity",
    uploadedAt: new Date(),
    pdfIngestionStatus: "success",
  },
];
