"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  HelpCircle,
  LogOut,
  Mail,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";

const navLinks = {
  auth: [
    { name: "Chat", href: "/chat" },
    { name: "PDF Chat", href: "/pdf-chat" },
    { name: "Upload PDF", href: "/upload-pdf" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pricing", href: "/pricing" },
    { name: "Roadmap", href: "/roadmap" },
  ],
  guest: [
    { name: "Demo", href: "/chat/demo" },
    { name: "Pricing", href: "/pricing" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "About", href: "/about" },
  ],
};

const Navbar = () => {
  const { authenticated, name, email, logout, userId, checkStatus } =
    useAuthStore();
  const {
    fetchChatOptions,
    fetchPdfOptions,
    cacheBuster,
    updateMessagesFromHistory,
    setCurrentPdf,
  } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (authenticated && userId) {
      updateMessagesFromHistory([]);
      setCurrentPdf(null);
      fetchChatOptions(userId);
      fetchPdfOptions(userId, cacheBuster);
    } else if (!authenticated && userId) {
    }
  }, [authenticated, userId, cacheBuster, fetchChatOptions, fetchPdfOptions]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout(router);
    setIsMenuOpen(false);
  };

  const currentLinks = authenticated ? navLinks.auth : navLinks.guest;
  const userInitial = name ? (
    name.charAt(0).toUpperCase()
  ) : (
    <User className="h-4 w-4" />
  );

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/70 z-50 fixed top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          aria-label="Homepage"
        >
          <Bot className="w-7 h-7" />
          <span className="text-xl font-bold">Versa AI</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-1">
            {currentLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative group text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold bg-indigo-50/70"
                      : "text-slate-700 hover:text-indigo-600"
                  }`}
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 block w-full h-[2px] bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </Link>
              );
            })}
          </div>
          <div className="h-5 w-px bg-slate-300" />
          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarFallback className="bg-indigo-500 text-white text-xs font-semibold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-1 mr-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">
                        {name ?? "User"}
                      </p>
                      <p className="text-xs leading-none text-gray-500">
                        {email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/support" className="flex items-center gap-2">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/contact" className="flex items-center gap-2">
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Contact</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-700 hover:bg-slate-100/80"
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow"
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100/80 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open main menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm h-screen bg-white z-[70] flex flex-col p-6 shadow-xl lg:hidden"
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bot className="w-7 h-7 text-indigo-600" />
                <span className="text-xl font-bold">Versa AI</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-grow flex flex-col gap-2">
              {currentLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-2.5 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? "text-indigo-700 bg-indigo-50"
                        : "text-slate-700 hover:text-indigo-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <hr className="my-4 border-slate-200" />
              {authenticated ? (
                <>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link
                    href="/support"
                    className="hidden md:flex items-center gap-3 px-3 py-2.5 text-base font-medium text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <HelpCircle className="h-4 w-4" /> Support
                  </Link>
                  <Link
                    href="/contact"
                    className="hidden md:flex items-center gap-3 px-3 py-2.5 text-base font-medium text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Contact
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start mt-auto text-red-600 hover:bg-red-50 hover:text-red-700 text-base font-medium px-3 py-2.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
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
