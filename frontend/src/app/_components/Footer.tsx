"use client";

import React from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import Link from "next/link";
// Import your Logo component or use an img tag
// import Logo from './Logo';

// Define social links data (replace '#' with actual URLs)
const socialLinks = [
  { name: "Facebook", href: "#", icon: FaFacebookF },
  { name: "X (Twitter)", href: "#", icon: FaXTwitter },
  { name: "LinkedIn", href: "#", icon: FaLinkedinIn },
  { name: "GitHub", href: "#", icon: FaGithub },
];

const Footer = () => {
  return (
    // Use a slightly lighter dark color for better contrast potentially
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-10">
          {/* Column 1: Company Info & Logo */}
          <div className="md:col-span-2 lg:col-span-1">
            {/* Replace with your actual Logo component or img tag */}
            {/* <Logo className="h-8 w-auto text-white mb-4" /> */}
            <h2 className="text-lg font-semibold text-white mb-3">
              Your AI Platform {/* Or your actual platform name */}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transforming the way you interact with documents using AI. From
              PDF insights to customizable assistants.
            </p>
          </div>

          {/* Column 2: Quick Links (Product/Features) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/features"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-chat"
                  className="hover:text-white hover:underline transition-colors"
                >
                  PDF Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links (Company/Resources) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:underline transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; 2025 Versa AI, Inc. All Rights Reserved.
          </p>
          <div className="flex space-x-5">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name} // Accessibility improvement
                className="text-slate-400 hover:text-white transition-colors"
              >
                <link.icon className="w-5 h-5" /> {/* Consistent size */}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
