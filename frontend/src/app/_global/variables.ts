import {
  BrainCircuit,
  Megaphone,
  ShieldCheck,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { BlogPost, PDFDocument, PricingTier } from "./interface";

export interface RoadmapProps {
  devName: string;
  status: "In Progress" | "Completed" | "Not Started" | "Skipped" | "On Hold";
  description: string;
  startDate: Date;
  endDate: Date;
  comments?: string;
  priority: "Low" | "Medium" | "High";
}

export const sampleBlogPosts: BlogPost[] = [
  {
    slug: "unlock-pdfs-conversational-ai",
    title: "Unlock Your PDFs: Introducing Conversational AI for Documents",
    excerpt:
      "Tired of searching through endless pages? Discover how Versa AI's chat feature lets you talk directly to your PDFs and get instant answers, summaries, and insights. Revolutionize your workflow.",
    icon: Megaphone,
    date: "April 10, 2025",
    category: "Product Updates",
    author: "The Versa AI Team",
  },
  {
    slug: "ai-document-analysis-productivity",
    title: "5 Ways AI Document Analysis Boosts Team Productivity",
    excerpt:
      "Learn how leveraging AI to summarize reports, extract data, and answer questions can save your team hours each week, freeing up time for more strategic work.",
    icon: Zap,
    date: "April 3, 2025",
    category: "Productivity Tips",
    author: "Jane Doe",
  },
  {
    slug: "understanding-llms-documents",
    title: "Understanding Large Language Models (LLMs) and Your Documents",
    excerpt:
      "A non-technical explanation of how LLMs like the ones powering Versa AI work to understand context and generate human-like insights from your text data.",
    icon: BrainCircuit,
    date: "March 28, 2025",
    category: "AI Explained",
    author: "The Versa AI Team",
  },
  {
    slug: "versa-ai-security-privacy",
    title: "Data Security and Privacy in Versa AI: Our Commitment",
    excerpt:
      "Your trust is paramount. Learn about the security measures like encryption and access controls, plus our privacy principles built into the Versa AI platform.",
    icon: ShieldCheck,
    date: "March 20, 2025",
    category: "Security",
    author: "Security Team",
  },
  {
    slug: "semantic-search-pdfs",
    title: "Beyond Keywords: The Power of Semantic Search in PDFs",
    excerpt:
      "Why simple keyword searches often fail with complex documents and how semantic understanding changes the game for finding relevant information.",
    icon: TerminalSquare,
    date: "March 15, 2025",
    category: "Technology",
    author: "John Smith",
  },
];

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
    status: "Completed",
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
    devName: "Dashboard & Settings Page",
    status: "Completed",
    description:
      "Update the dashboard and setting page to include functionality.",
    startDate: new Date("04/04/2025"),
    endDate: new Date("04/14/2025"),
    comments: "",
    priority: "Medium",
  },
  {
    devName: "Cookies Auth for SSE Route",
    status: "In Progress",
    description: "Use cookies for SSE route authentication.",
    startDate: new Date("04/14/2025"),
    endDate: new Date(),
    comments: "",
    priority: "High",
  },
  {
    devName: "CSRF Protection",
    status: "In Progress",
    description: "Add CSRF protection to secure the application.",
    startDate: new Date("04/14/2025"),
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
    devName: "Improve Streaming and Handling",
    status: "Completed",
    description: "Upgrade the current approach of streaming text only.",
    startDate: new Date("03/25/2025"),
    endDate: new Date("04/14/2025"),
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
    devName: "Implement Custom Personalities",
    status: "Not Started",
    description: "User choose how chatbot will respond, their tone, and more.",
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
    devName: "Improve Logic to Answer User Queries Better",
    status: "In Progress",
    description: "Consder moving to Langgraph in addition to using Langchain.",
    startDate: new Date("04/15/2025"),
    endDate: new Date(),
    comments: "Not Needed",
    priority: "High",
  },
  {
    devName: "Chatbot responding with citations and page numbers from PDF",
    status: "In Progress",
    description:
      "Agent replies with citations and page numbers from PDF for credibility",
    startDate: new Date("04/15/2025"),
    endDate: new Date(),
    comments: "Not Needed",
    priority: "High",
  },
  {
    devName: "Advanced Customization",
    status: "In Progress",
    description: "Allows more models and customization options.",
    startDate: new Date("04/15/2025"),
    endDate: new Date(),
    comments: "Not Needed",
    priority: "High",
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
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    frequency: "/ month",
    description: "For individuals getting started with AI document analysis.",
    cta: "Sign Up Free",
    href: "/auth/signup?plan=free", // Example link
    features: [
      { text: "15 Documents / month", included: true },
      { text: "50MB Upload Limit / file", included: true },
      { text: "Standard AI Model", included: true },
      { text: "Basic Chat History (7 days)", included: true },
      { text: "Multi-Document Chat (Max 2 docs)", included: false },
      { text: "OCR for Scanned Docs (Limited)", included: false },
      { text: "API Access", included: false },
      { text: "Standard Email Support", included: true },
    ],
    highlight: false,
    themeColorClass: "border-gray-300",
  },
  {
    name: "Pro",
    price: "$20",
    frequency: "/ month",
    description: "For professionals & small teams needing more power.",
    cta: "Get Started with Pro",
    href: "/auth/signup?plan=pro", // Example link
    features: [
      { text: "150 Documents / month", included: true },
      { text: "250MB Upload Limit / file", included: true },
      { text: "Advanced AI Model", included: true },
      { text: "Extended Chat History (90 days)", included: true },
      { text: "Multi-Document Chat (Max 5 docs)", included: true },
      { text: "OCR for Scanned Docs", included: true },
      { text: "API Access (Standard)", included: true },
      { text: "Priority Email Support", included: true },
    ],
    highlight: true, // Highlight this tier
    themeColorClass: "border-blue-500", // Blue theme for highlight border
  },
  {
    name: "Premium",
    price: "$45",
    frequency: "/ month",
    description: "For heavy users & growing teams requiring advanced features.",
    cta: "Go Premium",
    href: "/auth/signup?plan=premium", // Example link
    features: [
      { text: "Unlimited Documents / month", included: true },
      { text: "1GB Upload Limit / file", included: true },
      { text: "Premium AI Model (Latest)", included: true },
      { text: "Unlimited Chat History", included: true },
      { text: "Multi-Document Chat (Max 10 docs)", included: true },
      { text: "Advanced OCR & Data Extraction", included: true },
      { text: "API Access + Batch Processing", included: true },
      { text: "Priority Chat & Email Support", included: true },
    ],
    highlight: false,
    themeColorClass: "border-purple-500", // Example subtle theme border
  },
  {
    name: "Enterprise",
    price: "Custom",
    frequency: "",
    description:
      "Tailored solutions & dedicated support for large organizations.",
    cta: "Contact Sales",
    href: "/contact-sales", // Example link
    features: [
      { text: "Volume Usage & Custom Limits", included: true },
      { text: "Custom/Fine-Tuned AI Models", included: true },
      { text: "Dedicated Infrastructure Options", included: true },
      { text: "SSO & Advanced Security Audits", included: true },
      { text: "Dedicated API with SLA", included: true },
      { text: "Onboarding & Dedicated Support", included: true },
    ],
    highlight: false,
    themeColorClass: "border-gray-500", // Neutral/darker theme
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
    name: "Gemini-2.0",
    value: "gemini-2.0",
    disabled: false,
  },
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
    name: "Deepseek V3",
    value: "custom-model",
    disabled: true,
  },
  {
    name: "Claude 3.7 Sonnet",
    value: "claude-3.7-sonnet",
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
