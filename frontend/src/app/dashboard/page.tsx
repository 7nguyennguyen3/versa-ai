"use client";
import { Button } from "@/components/ui/button";
import { FileText, Menu, MessageSquare } from "lucide-react";
import { useState } from "react";

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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-5 hidden md:block">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 hover:bg-gray-100 rounded-lg px-4 py-3"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">📁 Recent Uploads</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 hover:bg-gray-100 rounded-lg px-4 py-3"
              >
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <span className="text-gray-700">💬 Chat History</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🎉 Welcome to Your Dashboard
          </h1>
          <Button variant="outline" className="md:hidden rounded-lg px-3 py-2">
            <Menu className="h-5 w-5 mr-2 text-purple-600" />
            <span className="text-gray-700">Menu</span>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-5 transition-all">
            <span className="text-xl mr-2">📤</span>
            Upload PDF
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-5 transition-all">
            <span className="text-xl mr-2">💬</span>
            Start New Chat
          </Button>
        </div>

        {/* Recent Uploads */}
        <section className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            📁 Recent Uploads
          </h2>
          <ul className="space-y-3">
            {uploads.length > 0 ? (
              uploads.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center px-4 py-3 bg-gray-50/50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <span className="mr-3">📄</span>
                  <span className="text-gray-700">{file.name}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 px-4">No uploads yet.</p>
            )}
          </ul>
        </section>

        {/* Chat History */}
        <section className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            💬 Chat History
          </h2>
          <ul className="space-y-3">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <li
                  key={chat.id}
                  className="flex items-center px-4 py-3 bg-gray-50/50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <span className="mr-3">🤖</span>
                  <span className="text-gray-700">{chat.title}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 px-4">No chat history available.</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
