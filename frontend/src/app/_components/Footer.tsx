"use client";

import React from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Company Info */}
        <Card className="bg-transparent border-none shadow-none">
          <CardContent>
            <h2 className="text-xl font-bold mb-3 text-white">
              🚀 Our AI Platform
            </h2>
            <p className="text-gray-400 text-sm">
              Transforming the way you interact with AI. From PDF insights to
              customizable AI assistants, we’ve got you covered.
            </p>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-transparent border-none shadow-none">
          <CardContent>
            <h3 className="text-lg font-semibold mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-blue-400">
                  📖 About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-400">
                  💰 Pricing
                </Link>
              </li>
              <li>
                <Link href="/terms-and-privacy" className="hover:text-blue-400">
                  ⚖️ Terms & Privacy
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-blue-400">
                  🛠 Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400">
                  📩 Contact Us
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF className="text-gray-300 hover:text-blue-500 w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="text-gray-300 hover:text-blue-400 w-6 h-6" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-gray-300 hover:text-gray-500 w-6 h-6" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-gray-500 text-center text-sm">
        © {new Date().getFullYear()} Our AI Platform. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
