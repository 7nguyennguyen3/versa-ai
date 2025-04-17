"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Still needed for other buttons
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
import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "../_store/useAppStore";
import { useAuthStore } from "../_store/useAuthStore";

// --- Link Definitions ---
const navLinksBase = [
  { name: "Pricing", href: "/pricing" },
  { name: "Roadmap", href: "/roadmap" },
];
const navLinksAuth = [
  { name: "Chat", href: "/chat" },
  { name: "PDF Chat", href: "/pdf-chat" },
  { name: "Upload PDF", href: "/upload-pdf" },
  { name: "Dashboard", href: "/dashboard" },
  ...navLinksBase,
];
const navLinksGuest = [
  { name: "Demo", href: "/chat/demo" },
  ...navLinksBase,
  { name: "About", href: "/about" },
];

// --- Helper Hook for Active Links ---
const useIsActivePath = (href: string): boolean => {
  const pathname = usePathname();
  if (href === "/") return pathname === href;
  // Ensure it matches exact path or path followed by a slash
  return pathname === href || pathname.startsWith(`${href}/`);
};

// --- Reusable Link Components ---
const DesktopNavLink = ({ href, name }: { href: string; name: string }) => {
  const isActive = useIsActivePath(href);
  return (
    <Link
      href={href}
      className={`relative group text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
        isActive
          ? "text-indigo-600 font-semibold bg-indigo-50/70"
          : "text-slate-700 hover:text-indigo-600"
      }`}
    >
      {name}
      {!isActive && (
        <span className="absolute left-0 bottom-0 block w-full h-[2px] bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
      )}
    </Link>
  );
};

const MobileNavLink = ({ href, name }: { href: string; name: string }) => {
  const isActive = useIsActivePath(href);
  return (
    <Link
      href={href}
      className={`block px-3 py-2.5 text-base font-medium rounded-md transition-colors ${
        isActive
          ? "text-indigo-700 bg-indigo-50"
          : "text-slate-700 hover:text-indigo-700 hover:bg-slate-100"
      }`}
    >
      {name}
    </Link>
  );
};

const MobileAccountLink = ({
  href,
  name,
  icon: Icon,
}: {
  href: string;
  name: string;
  icon: React.ElementType;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-md transition-colors"
    >
      <Icon className="h-4 w-4 text-slate-500" /> {name}
    </Link>
  );
};

// --- Navbar Component ---
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

  // Effects
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);
  useEffect(() => {
    if (authenticated && userId && !sessionStorage.getItem("justLoggedIn")) {
      updateMessagesFromHistory([]);
      setCurrentPdf(null);
      fetchChatOptions(userId);
      fetchPdfOptions(userId, cacheBuster);
    }
  }, [
    authenticated,
    userId,
    cacheBuster,
    fetchChatOptions,
    fetchPdfOptions,
    updateMessagesFromHistory,
    setCurrentPdf,
  ]);
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await logout(router);
    setIsMenuOpen(false);
  }, [logout, router]);

  const currentLinks = authenticated ? navLinksAuth : navLinksGuest;
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
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors flex-shrink-0"
          aria-label="Homepage"
        >
          <Bot className="w-7 h-7" />
          <span className="text-xl font-bold">Versa AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {currentLinks.map((link) => (
              <DesktopNavLink
                key={link.href}
                href={link.href}
                name={link.name}
              />
            ))}
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div className="flex items-center gap-3">
            {authenticated ? (
              <DropdownMenu>
                {/* FIX: Removed ` and inner Button, let Trigger be the button */}
                <DropdownMenuTrigger
                  className="relative h-9 w-9 rounded-full p-0 inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent" // Added basic button/focus/open styles
                  aria-label="Open user menu"
                >
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarFallback className="bg-indigo-500 text-white text-xs font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-1"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    {" "}
                    <div className="flex flex-col space-y-1">
                      {" "}
                      <p className="text-sm font-medium leading-none text-gray-900 truncate">
                        {" "}
                        {name ?? "User"}{" "}
                      </p>{" "}
                      {email && (
                        <p className="text-xs leading-none text-gray-500 truncate">
                          {" "}
                          {email}{" "}
                        </p>
                      )}{" "}
                    </div>{" "}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    {" "}
                    <Link href="/settings" className="flex items-center">
                      {" "}
                      <Settings className="mr-2 h-4 w-4" />{" "}
                      <span>Settings</span>{" "}
                    </Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    {" "}
                    <Link href="/support" className="flex items-center">
                      {" "}
                      <HelpCircle className="mr-2 h-4 w-4" />{" "}
                      <span>Support</span>{" "}
                    </Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    {" "}
                    <Link href="/contact" className="flex items-center">
                      {" "}
                      <Mail className="mr-2 h-4 w-4" /> <span>Contact</span>{" "}
                    </Link>{" "}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer flex items-center"
                  >
                    {" "}
                    <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span>{" "}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {" "}
                {/* Desktop Guest Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 hover:bg-slate-100/80"
                >
                  {" "}
                  <Link href="/auth/signin">Sign In</Link>{" "}
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow"
                >
                  {" "}
                  <Link href="/auth/signup">Get Started</Link>{" "}
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
          aria-expanded={isMenuOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- Mobile Menu (Redesigned with Fixed Footer) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              // Panel takes full height and uses flex column layout
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm h-dvh bg-white z-[70] flex flex-col shadow-xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              {/* 1. Fixed Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-200 flex-shrink-0">
                <Link
                  href="/"
                  id="mobile-menu-title"
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
              {/* 2. Scrollable Main Content Area */}
              <div className="flex-grow overflow-y-auto p-4">
                {/* User Info (Only if authenticated, placed above links) */}
                {authenticated && (
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        {" "}
                        <AvatarFallback className="bg-indigo-500 text-white text-sm font-semibold">
                          {" "}
                          {userInitial}{" "}
                        </AvatarFallback>{" "}
                      </Avatar>
                      <div className="flex flex-col space-y-0.5">
                        {" "}
                        <p className="text-sm font-medium leading-none text-gray-900 truncate">
                          {" "}
                          {name ?? "User"}{" "}
                        </p>{" "}
                        {email && (
                          <p className="text-xs leading-none text-gray-500 truncate">
                            {" "}
                            {email}{" "}
                          </p>
                        )}{" "}
                      </div>
                    </div>
                    {/* Uncomment this section if you prefer account links grouped with user info */}
                    {/* <nav className="flex flex-col gap-1 text-sm">
                           <MobileAccountLink href="/settings" name="Settings" icon={Settings} />
                           <MobileAccountLink href="/support" name="Support" icon={HelpCircle} />
                           <MobileAccountLink href="/contact" name="Contact" icon={Mail} />
                        </nav> */}
                  </div>
                )}

                {/* Main Navigation Links */}
                <nav className="flex flex-col gap-1">
                  {currentLinks.map((link) => (
                    <MobileNavLink
                      key={link.href}
                      href={link.href}
                      name={link.name}
                    />
                  ))}
                </nav>
                {/* Optional: Secondary account links if not placed under user info */}
                {/* Comment out this block if you moved these links under user info */}
                {authenticated && (
                  <>
                    <hr className="my-4 border-slate-200" />
                    <nav className="flex flex-col gap-1 text-sm">
                      <MobileAccountLink
                        href="/settings"
                        name="Settings"
                        icon={Settings}
                      />
                      <MobileAccountLink
                        href="/support"
                        name="Support"
                        icon={HelpCircle}
                      />
                      <MobileAccountLink
                        href="/contact"
                        name="Contact"
                        icon={Mail}
                      />
                    </nav>
                  </>
                )}
              </div>{" "}
              {/* End Scrollable Content Area */}
              {/* 3. Fixed Footer Action Bar */}
              <div className="p-4 border-t border-slate-200 flex-shrink-0">
                {authenticated ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 text-base font-medium px-3 py-2.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>{" "}
              {/* End Fixed Footer */}
            </motion.div>{" "}
            {/* End Panel */}
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
