"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { authenticated, name, logout, userId } = useAuthStore();
  const { fetchChatOptions, fetchPdfOptions, cacheBuster } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().checkStatus();
  }, []);

  useEffect(() => {
    if (authenticated && userId) {
      fetchChatOptions(userId);
      fetchPdfOptions(userId, cacheBuster);
    }
  }, [userId, cacheBuster]);

  const authLinks = [
    { name: "Chat", href: "/chat" },
    { name: "PDF Chat", href: "/pdf-chat" },
    { name: "Upload Pdf", href: "/upload-pdf" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Pricing", href: "/pricing" },
  ];

  const guestLinks = [
    { name: "Demo", href: "/chat/demo" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Pricing", href: "/pricing" },
    { name: "Support", href: "/support" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-lg border-b border-gray-200 z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <Bot className="w-8 h-8" />
          <span className="text-xl font-semibold tracking-tight">Versa AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-4">
            {(authenticated ? authLinks : guestLinks).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-gray-600 hover:text-indigo-700 transition-colors px-3 py-2 rounded-lg group"
              >
                {link.name}
                {/* Animated underline */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-700 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="h-6 w-[2px] bg-gray-300" />

          {authenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 group pl-3 pr-2 py-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                  {name?.charAt(0) ?? "J"}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-2 border border-gray-100"
                  >
                    <div className="px-3 py-2 text-sm font-medium text-gray-500">
                      {name ?? "Jimmy"}
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ⚙️ Settings
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50/50 mt-2"
                      onClick={() => logout(router)}
                    >
                      🚪 Logout
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="text-gray-600 hover:bg-gray-100/70 px-4 py-2"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 shadow-sm hover:shadow-md transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100/70 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 min-h-screen bg-white z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Bot className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-semibold">Versa AI</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100/70 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col max-w-[200px] gap-3">
              {(authenticated ? authLinks : guestLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100/70 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {authenticated ? (
                <>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100/70 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Button
                    className="w-full mt-4 bg-red-100 text-red-600 hover:bg-red-200 h-12 text-lg"
                    onClick={() => logout(router)}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-6">
                  <Link href="/auth/signin" className="block">
                    <Button
                      className="w-full h-12 text-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button
                      className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
