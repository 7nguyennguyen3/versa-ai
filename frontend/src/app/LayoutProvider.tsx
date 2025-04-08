"use client";

import { usePathname } from "next/navigation";
import Footer from "./_components/Footer";

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const showFooter = !pathname?.startsWith("/pdf-chat");

  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
};
