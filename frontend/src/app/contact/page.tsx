"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, Loader2, Building } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

const ContactPage = () => {
  // State for the form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(""); // Added subject state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(""); // Using toast instead
  // const [success, setSuccess] = useState(""); // Using toast instead

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // setError("");
    // setSuccess("");

    try {
      // Replace with your actual API endpoint and payload structure
      const response = await axios.post("/api/contact", {
        name,
        email,
        subject,
        message,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Message Sent!", {
          description: "Thanks for reaching out. We'll get back to you soon.",
        });
        // Clear form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error(
          response.data?.message || "Unexpected response from server."
        );
      }
    } catch (err: any) {
      console.error("Contact form error:", err);
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Failed to send message. Please try again later.";
      // toast.error("Submission Failed", { description: errMsg });
      toast.info("We're currently implementing this feature. Stay tuned!");
      // setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Consistent background, top alignment, padding
    <div
      className="min-h-screen w-full 
    bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 py-16 md:py-24 
    flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto mt-20 lg:mt-0">
        {" "}
        {/* Wider max-width */}
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our platform, partnerships, or anything else?
            We&apos;d love to hear from you.
          </p>
        </motion.div>
        {/* Main Content Grid (Split Screen on Large) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
              Contact Information
            </h2>
            <div className="space-y-6 text-gray-700">
              <div className="flex items-start space-x-4">
                <MapPin
                  className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">Our Office</h3>
                  <p className="text-sm leading-relaxed">
                    123 AI Street, Suite 404, <br />
                    Tech City, California, 90210 <br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail
                  className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    General Inquiries
                  </h3>
                  <a
                    href="mailto:hello@versai.com"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    hello@versai.com
                  </a>{" "}
                  {/* Replace email */}
                  <p className="text-xs text-gray-500 mt-1">
                    For general questions & information.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone
                  className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">Call Us</h3>
                  <a
                    href="tel:+11234567890"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    (123) 456-7890
                  </a>{" "}
                  {/* Replace phone */}
                  <p className="text-xs text-gray-500 mt-1">
                    Mon-Fri, 9 AM - 5 PM PST.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Building
                  className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Partnerships & Sales
                  </h3>
                  <a
                    href="mailto:sales@versai.com"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    sales@versai.com
                  </a>{" "}
                  {/* Replace email */}
                </div>
              </div>
            </div>
            {/* Optional Map Placeholder */}
            {/* <div className="mt-8 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">Map Placeholder</div> */}
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-200/80"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject / Inquiry Type</Label>
                <Select
                  value={subject}
                  onValueChange={setSubject}
                  required
                  disabled={loading}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="sales">Sales Question</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5} // Increased rows
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  required
                  disabled={loading}
                />
              </div>
              {/* Removed inline error, relying on toast */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
