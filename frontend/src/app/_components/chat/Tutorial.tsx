import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Settings,
  PlusCircleIcon,
  Lightbulb,
  FileText,
  Text,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

// --- Tutorial Content Definition ---
// Standardize inline icon size and alignment class
const iconSize = 16; // e.g., 16px
const iconClass = "inline-block align-middle mx-1"; // Use align-middle or align-text-bottom

const tutorialPages = [
  // --- Page 1: Welcome ---
  {
    title: "Welcome to the Demo!",
    content: (
      <>
        <p className="mb-4">
          This demo allows you to interact with a PDF document using AI. Chat
          with the document to ask questions and get information based on its
          content.
        </p>
        <p>
          Let&apos;s quickly go over the key features you&apos;ll find in the
          toolbar.
        </p>
      </>
    ),
  },
  // --- Page 2: Toolbar Overview ---
  {
    title: "Toolbar Overview",
    content: (
      <>
        <p className="mb-4">
          Look at the row of icons near the top right. These give you control:
        </p>
        {/* Use flex with items-center for vertical centering in list items */}
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <Settings size={iconSize + 2} className="text-primary shrink-0" />{" "}
            {/* Slightly larger icon maybe */}
            <span>Change PDF, Conversation, AI Model, Retrieval method.</span>
          </li>
          <li className="flex items-center gap-2">
            <PlusCircleIcon
              size={iconSize + 2}
              className="text-primary shrink-0"
            />
            <span>Start a new conversation.</span>
          </li>
          <li className="flex items-center gap-2">
            <Lightbulb size={iconSize + 2} className="text-primary shrink-0" />
            <span>Reopen this guide.</span>
          </li>
          <li className="flex items-center gap-2">
            <Text size={iconSize + 2} className="text-primary shrink-0" />
            <span>Toggle Summary Mode</span>
          </li>
          <li className="flex items-center gap-2">
            <FileText size={iconSize + 2} className="text-primary shrink-0" />
            <span>Toggle PDF view (or press `Esc`).</span>
          </li>
        </ul>
      </>
    ),
  },
  // --- Page 3: Settings Menu ---
  {
    title: "The Settings Menu",
    content: (
      <>
        {/* Apply alignment class to inline icons */}
        <p className="mb-4">
          Click the{" "}
          <Settings size={iconSize} className={iconClass + " text-primary"} />
          icon to open the settings.
        </p>
        <p className="mb-2 font-medium">Here you can:</p>
        <ul className="list-disc list-outside space-y-1.5 pl-5">
          <li>Select a different Demo PDF.</li>
          <li>Switch between conversations.</li>
          <li>Choose the AI Model (e.g., Gemini, GPT).</li>
          <li>Select the Retrieval Method.</li>
        </ul>
      </>
    ),
  },
  // --- Page 4: Understanding Citations ---
  // (Content remains largely the same, ensure styling is consistent)
  {
    title: "Understanding Citations",
    content: (
      <>
        <p className="mb-4">
          AI answers often include citations linking to the source in the PDF:
        </p>
        <Alert
          variant="default"
          className="mb-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
        >
          <AlertTitle className="text-blue-800 dark:text-blue-300">
            Example Citation
          </AlertTitle>
          <AlertDescription className="text-center font-mono text-blue-700 dark:text-blue-400 !pl-0">
            (p.7, 1/2)
          </AlertDescription>
        </Alert>
        <Alert
          variant="default"
          className="mb-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30"
        >
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">
            How to Read Citations
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400 !pl-0">
            <ul className="list-disc list-outside space-y-2 pl-5 mt-2">
              <li>
                <code>p.X</code>: Page number (e.g., <code>p.7</code> = Page 7).
              </li>
              <li>
                <code>Y/Z</code>: Vertical section. Page divided into{" "}
                <code>Z</code> parts, <code>Y</code> is the part from the top
                (e.g., <code>1/2</code> = top half).
              </li>
              <li>
                Multiple sections like <code>(p.9, 1/4, 2/4)</code> mean info
                spans the top two quarters of page 9.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
        <p>Citations help you verify answers and find the source quickly!</p>
      </>
    ),
  },
  // --- Page 5: Managing Chat ---
  {
    title: "Managing Your Chat",
    content: (
      <>
        {/* Apply alignment class to inline icons */}
        <p className="mb-4">
          Use the{" "}
          <PlusCircleIcon
            size={iconSize}
            className={iconClass + " text-primary"}
          />
          button to start a fresh chat, clearing the current conversation.
        </p>
        <p className="mb-4">
          This is useful for switching topics or if the chat feels off track.
        </p>
        <p>
          Toggle the{" "}
          <FileText size={iconSize} className={iconClass + " text-primary"} />
          Document View to see the PDF alongside the chat.
        </p>
      </>
    ),
  },
  // --- Page 6: Summary Mode ---
  {
    title: "Summary Mode",
    content: (
      <>
        {/* Apply alignment class to inline icons */}
        <p className="mb-2">
          {" "}
          {/* Reduced margin slightly */}
          Toggle{" "}
          <Text size={iconSize} className={iconClass + " text-primary"} />
          Summary Mode to enable document summarization commands.
        </p>

        {/* NEW: Explanation of summary types */}
        <span className="mb-4 text-muted-foreground ">
          You can ask for summaries covering:
          <ul className="list-disc list-outside pl-5 mt-1 space-y-0.5">
            <li>The entire document</li>
            <li>A single page</li>
            <li>A range of pages (e.g., pages 2-5)</li>
            <li>Specific, non-consecutive pages (e.g., pages 1, 3, 8)</li>
          </ul>
        </span>

        {/* Examples section */}
        <p className="mb-2 font-medium">Examples:</p>
        <div className="space-y-1.5 rounded-md border bg-muted p-3 dark:bg-muted/50">
          {/* Examples map directly to the types above */}
          <code className="block text-sm">Summarize this document</code>
          <code className="block text-sm">Summarize page 5</code>
          <code className="block text-sm">Summarize pages 1-3</code>
          <code className="block text-sm">Summarize pages 1, 4, 7</code>
        </div>

        {/* Note remains the same */}
        <p className="mt-4 text-muted-foreground text-xs">
          Note: Topic-based summaries are not yet supported.
        </p>
      </>
    ),
  },
  // --- Page 7: Reminder ---
  {
    title: "Need a Reminder?",
    content: (
      <>
        {/* Apply alignment class to inline icons */}
        <p className="mb-4">
          Forget something? Click the
          <Lightbulb size={iconSize} className={iconClass + " text-primary"} />
          icon anytime to reopen this guide.
        </p>
        <p className="font-medium">
          You&apos;re all set! Happy chatting with your PDF!
        </p>
      </>
    ),
  },
];

interface TutorialProps {
  isOpen: boolean;
  setOpenTutorial: (open: boolean) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ isOpen, setOpenTutorial }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalPages = tutorialPages.length;
  const isLastPage = currentPageIndex === totalPages - 1;
  const isFirstPage = currentPageIndex === 0;

  // --- Navigation Handlers (useCallback for performance) ---
  const handleNextPage = useCallback(() => {
    if (!isLastPage) {
      setCurrentPageIndex((prevIndex) => prevIndex + 1);
    }
  }, [isLastPage]);

  const handlePrevPage = useCallback(() => {
    if (!isFirstPage) {
      setCurrentPageIndex((prevIndex) => prevIndex - 1);
    }
  }, [isFirstPage]);

  const handleGoToPage = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalPages) {
        setCurrentPageIndex(index);
      }
    },
    [totalPages]
  );

  const handleClose = useCallback(() => {
    setOpenTutorial(false);
  }, [setOpenTutorial]);

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === "ArrowRight") handleNextPage();
      else if (event.key === "ArrowLeft") handlePrevPage();
      // Allow Dialog default Escape behavior
      // else if (event.key === 'Escape') handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNextPage, handlePrevPage]); // Removed handleClose dependency as Dialog handles ESC

  // --- Reset page index when modal re-opens ---
  useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(0);
    }
  }, [isOpen]);

  const currentPage = tutorialPages[currentPageIndex];

  return (
    <Dialog open={isOpen} onOpenChange={setOpenTutorial}>
      <DialogContent
        className="sm:max-w-lg flex flex-col" // Removed max-h here, height is controlled by content div
        onEscapeKeyDown={handleClose} // Ensure Dialog handles Esc
        // onPointerDownOutside={(e) => e.preventDefault()} // Uncomment to prevent closing on outside click
      >
        <DialogHeader>
          {/* Added pr-12 to prevent title overlapping with close button */}
          <DialogTitle className="text-center text-xl sm:text-2xl pr-12">
            {currentPage.title}
          </DialogTitle>
        </DialogHeader>

        {/* Content Area: FIXED HEIGHT and SCROLLABLE */}
        <div
          className="px-6 py-4 text-sm sm:text-base text-foreground/90 space-y-4
        h-[200px] xs:h-[320px] overflow-y-auto"
        >
          {currentPage.content}
        </div>

        {/* Footer with Navigation and Progress */}
        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center gap-4 pt-4 border-t mt-auto">
          {" "}
          {/* Ensure footer is pushed down */}
          {/* Previous Button */}
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={isFirstPage}
            size="sm"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {tutorialPages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGoToPage(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ease-in-out
                                    ${
                                      currentPageIndex === index
                                        ? "w-4 bg-primary scale-110"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                                    }`}
                aria-label={`Go to step ${index + 1}`}
                aria-current={currentPageIndex === index ? "step" : undefined}
              />
            ))}
          </div>
          {/* Next/Done Button */}
          <Button
            onClick={isLastPage ? handleClose : handleNextPage}
            size="sm"
            aria-label={isLastPage ? "Finish tutorial" : "Next step"}
          >
            {isLastPage ? (
              <>
                Done <Check className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
