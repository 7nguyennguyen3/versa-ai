import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react"; // Import Lucide icons

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">📩 Contact Us</h1>
      <p className="text-gray-600 text-center mb-8">
        Have questions? Reach out to us, and we’ll get back to you soon.
      </p>

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 gap-6 text-center md:text-left mb-10">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-3">
          <MapPin className="text-gray-600 w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Address</h3>
            <p className="text-gray-600">123 AI Street, Tech City, CA</p>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="text-gray-600 w-6 h-6" />
            <p className="text-gray-600">support@ourai.com</p>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="text-gray-600 w-6 h-6" />
            <p className="text-gray-600">(123) 456-7890</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full">
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
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactPage;
