import React from "react";
import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react"; // Import Lucide icons
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SupportPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">🛠 Support Center</h1>
      <p className="text-gray-600 text-center mb-8">
        {"Need help? We're here for you. Choose a support option below."}
      </p>

      {/* Support Options */}
      <div className="grid md:grid-cols-3 gap-6 text-center mb-10">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
          <HelpCircle className="text-gray-600 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">FAQs</h3>
          <p className="text-gray-600 text-sm">
            Find answers to common questions.
          </p>
          <Link href="/faq">
            <Button variant="secondary" className="mt-3">
              View FAQs
            </Button>
          </Link>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
          <MessageCircle className="text-gray-600 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Live Chat</h3>
          <p className="text-gray-600 text-sm">
            Chat with our support team in real-time.
          </p>
          <Link href="/chat-support">
            <Button variant="secondary" className="mt-3">
              Start Chat
            </Button>
          </Link>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
          <Mail className="text-gray-600 w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Email Us</h3>
          <p className="text-gray-600 text-sm">
            Send us an email for inquiries.
          </p>
          <a href="mailto:support@ourai.com">
            <Button variant="secondary" className="mt-3">
              Email Support
            </Button>
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input type="text" placeholder="John Doe" required />
          </div>
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              rows={4}
              placeholder="Write your message here..."
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SupportPage;
