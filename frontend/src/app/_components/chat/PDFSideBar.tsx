import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useCallback } from "react"; // Ensure useCallback is imported
import { Button } from "@/components/ui/button"; // Assuming Button is used here

interface PdfSidebarProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const PdfSidebar: React.FC<PdfSidebarProps> = ({ pdfUrl, isOpen, onClose }) => {
  // Use useCallback for the event handler to maintain reference equality
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // Check if the sidebar is open, the key is Escape,
      // and the focus is not inside an iframe or the sidebar content itself.
      if (
        e.key === "Escape" &&
        isOpen &&
        activeElement?.tagName !== "IFRAME" &&
        !activeElement?.closest('[data-testid="pdf-sidebar-content"]')
      ) {
        onClose();
      }
    },
    [isOpen, onClose] // Dependencies for useCallback
  );

  useEffect(() => {
    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Return a cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]); // Dependency array includes the memoized handler

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose} // Close sidebar when clicking the backdrop
            aria-hidden="true"
          />

          {/* Sidebar Content */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full md:w-3/4 lg:w-1/2 bg-white shadow-lg z-50 border-r border-gray-200 flex flex-col"
            data-testid="pdf-sidebar-content"
          >
            <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-500 font-medium hidden sm:block"
              >
                Click outside or press{" "}
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
                  Esc
                </kbd>{" "}
                to close.
                <span className="text-xs block text-gray-400 mt-0.5">
                  (Note: Esc might require clicking outside the PDF first if
                  it&apos;s active)
                </span>
              </motion.div>
              <Button onClick={onClose} size="sm" variant="outline">
                Close View
              </Button>
            </div>
            <div className="flex-grow">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PdfSidebar;
