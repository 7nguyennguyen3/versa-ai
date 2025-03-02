"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";

const Navbar = () => {
  const { authenticated, name, logout, userId } = useAuthStore();
  const { fetchChatOptions, fetchPdfOptions, cacheBuster } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <header className="w-full bg-transparent backdrop-blur-md shadow-md z-999 sticky top-0">
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link href="/" className="text-lg font-bold ">
          <Bot />
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 text-xs lg:text-[14px]">
          {(authenticated ? authLinks : guestLinks).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-blue-500 transition"
            >
              {link.name}
            </Link>
          ))}

          {authenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 hover:text-blue-500 transition"
              >
                <span>Hello, {name ?? "Jimmy"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2"
                  >
                    <Link
                      href="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Settings
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full mt-2"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant={"outline"}>Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant={"outline"}>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        <button
          className="lg:hidden p-2 bg-gray-200 rounded-md"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white min-h-screen z-999 flex flex-col p-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>

            <nav className="mt-6 space-y-4">
              {(authenticated ? authLinks : guestLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg hover:text-blue-500 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {authenticated ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="max-w-[250px] flex items-center space-x-2 font-semibold"
                  >
                    <span>Hello, {name ?? "Jimmy"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 max-w-[250px] bg-white shadow-lg rounded-md p-2"
                      >
                        <Link
                          href="/settings"
                          className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <Link href={"/"}>
                          <Button
                            className="w-full mt-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                          >
                            Logout
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/auth/signin">
                    <Button
                      className="max-w-[250px]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      className="max-w-[250px]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
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
