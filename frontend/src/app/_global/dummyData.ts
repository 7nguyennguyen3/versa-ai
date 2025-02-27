import { ChatSession } from "./interface";

export const dummyChatSessions: ChatSession[] = [
  {
    chat_session_id: "session1",
    chat_history: [
      { role: "human", content: "Hello, can you summarize this document?" },
      {
        role: "ai",
        content: "Sure! This document covers the basics of physics...",
      },
      { role: "human", content: "Great! Can you explain Newton's second law?" },
      {
        role: "ai",
        content:
          "Newton's second law states that force equals mass times acceleration...",
      },
      { role: "human", content: "Can you give me a real-life example?" },
      {
        role: "ai",
        content:
          "Yes! Pushing a car versus pushing a bicycle shows how mass affects force...",
      },
      { role: "human", content: "That makes sense. What about momentum?" },
      {
        role: "ai",
        content:
          "Momentum is the product of mass and velocity, meaning heavier objects carry more momentum.",
      },
      { role: "human", content: "So how does it apply in sports?" },
      {
        role: "ai",
        content:
          "In sports like football, a heavier player running fast has more momentum than a lighter player.",
      },
      {
        role: "human",
        content: "Interesting! Can you explain impulse as well?",
      },
      {
        role: "ai",
        content:
          "Impulse is the change in momentum, which happens when force is applied over time, like catching a fast-moving ball.",
      },
    ],
    last_activity: new Date(),
    latest_pdfId: "physics-doc-123",
    userId: "user1",
  },
  {
    chat_session_id: "session2",
    chat_history: [
      { role: "human", content: "What is the capital of France?" },
      { role: "ai", content: "The capital of France is Paris." },
    ],
    last_activity: new Date(),
    latest_pdfId: "geography-doc-456",
    userId: "user2",
  },
];

export const predefinedChat = [
  {
    id: "chathistory1",
    name: "History.pdf",
    url: "/pdfs/history.pdf",
    chat: [
      {
        role: "human",
        content: "Hello, I have a question about the History.pdf",
      },
      { role: "ai", content: "Sure, what would you like to know?" },
      { role: "human", content: "Can you explain the first paragraph?" },
      {
        role: "ai",
        content: "The first paragraph discusses the history of Vietnam...",
      },
    ],
  },
  {
    id: "chathistory2",
    name: "Science.pdf",
    url: "/pdfs/science.pdf",
    chat: [
      { role: "human", content: "What is Newton's first law?" },
      {
        role: "ai",
        content:
          "Newton's first law states that an object in motion stays in motion...",
      },
    ],
  },
  {
    id: "chathistory3",
    name: "Math.pdf",
    url: "/pdfs/math.pdf",
    chat: [
      { role: "human", content: "How do you solve quadratic equations?" },
      {
        role: "ai",
        content:
          "Quadratic equations can be solved using the quadratic formula...",
      },
    ],
  },
  {
    id: "chathistory4",
    name: "Math.pdf",
    url: "/pdfs/math.pdf",
    chat: [
      { role: "human", content: "How do you solve quadratic equations?" },
      {
        role: "ai",
        content:
          "Quadratic equations can be solved using the quadratic formula...",
      },
    ],
  },
];

export const predefinedPdfs = [
  { name: "History.pdf", url: "/vn_history.pdf" },
  { name: "Science.pdf", url: "/science.pdf" },
  { name: "Tech Report.pdf", url: "/tech_report.pdf" },
];
