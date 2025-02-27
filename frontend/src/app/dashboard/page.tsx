"use client";
import React, { useState } from "react";
import { UploadCloud, MessageSquare, FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const [uploads] = useState([
    { id: 1, name: "Project_Proposal.pdf" },
    { id: 2, name: "Meeting_Notes.pdf" },
    { id: 3, name: "Research_Paper.pdf" },
  ]);

  const [chatHistory] = useState([
    { id: 1, title: "Chat with AI - Project Proposal" },
    { id: 2, title: "Contract Review Discussion" },
  ]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 hidden md:block">
        <h2 className="text-xl font-semibold mb-5">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-3">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start"
              >
                <FileText className="h-5 w-5 mr-2" /> Recent Uploads
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start"
              >
                <MessageSquare className="h-5 w-5 mr-2" /> Chat History
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
          <Button className="md:hidden flex items-center">
            <Menu className="h-5 w-5 mr-2" /> Menu
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button className="bg-blue-600 text-white flex items-center">
            <UploadCloud className="h-5 w-5 mr-2" /> Upload PDF
          </Button>
          <Button className="bg-green-600 text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" /> Start New Chat
          </Button>
        </div>

        {/* Recent Uploads */}
        <section className="bg-white p-5 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
          <ul>
            {uploads.length > 0 ? (
              uploads.map((file) => (
                <li key={file.id} className="border-b py-2">
                  {file.name}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No uploads yet.</p>
            )}
          </ul>
        </section>

        {/* Chat History */}
        <section className="bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Chat History</h2>
          <ul>
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <li key={chat.id} className="border-b py-2">
                  {chat.title}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No chat history available.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
