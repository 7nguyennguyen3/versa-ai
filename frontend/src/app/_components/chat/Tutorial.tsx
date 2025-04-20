import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust path as needed
import { X, Settings, PlusCircleIcon, Lightbulb, FileText } from "lucide-react"; // Import icons you'll use

interface TutorialPage {
  title: string;
  content: React.ReactNode;
}

interface TutorialProps {
  setOpenTutorial: (open: boolean) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ setOpenTutorial }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Define the content for each tutorial page
  const tutorialPages: TutorialPage[] = [
    {
      title: "Welcome to the Demo!",
      content: (
        <>
          <p className="mb-4">
            {" "}
            {/* Removed text-muted-foreground */}
            This demo allows you to interact with a PDF document using AI. Chat
            with the document to ask questions and get information based on its
            content.
          </p>
          <p>
            {" "}
            {/* Removed text-muted-foreground, mb-4 added to next paragraph if needed */}
            Let&apos;s quickly go over the key features you&apos;ll find in the
            toolbar at the bottom left of the chat interface.
          </p>
        </>
      ),
    },
    {
      title: "Toolbar Overview",
      content: (
        <>
          <p className="mb-4">
            {" "}
            {/* Removed text-muted-foreground */}
            Look at the row of icons near the top right. These icons give you
            control over the demo experience:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            <li>
              <Settings
                size={16}
                className="inline-block mr-1 align-text-bottom"
              />{" "}
              Select to change the current PDF, Conversation, AI Model, and
              Retrieval method.
            </li>
            <li>
              <PlusCircleIcon
                size={16}
                className="inline-block mr-1 align-text-bottom"
              />{" "}
              Select to start a new conversation.
            </li>
            <li>
              <Lightbulb
                size={16}
                className="inline-block mr-1 align-text-bottom"
              />{" "}
              Select to reopen this guide.
            </li>
            {/* Assuming you have a document icon button */}
            <li>
              <FileText
                size={16}
                className="inline-block mr-1 align-text-bottom"
              />{" "}
              Open PDF view, press `Esc` to quickly open it.
            </li>
          </ul>
          <p className="mt-4">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            We&apos;ll cover each in more detail.
          </p>
        </>
      ),
    },
    {
      title: "The Settings Menu",
      content: (
        <>
          <p className="mb-4">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            Click the{" "}
            <Settings
              size={16}
              className="inline-block mx-1 align-text-bottom"
            />{" "}
            Settings icon to open a dropdown menu.
          </p>
          <p className="mb-4">Here you can:</p>{" "}
          {/* Removed text-muted-foreground, text-sm */}
          <ul className="list-disc list-inside space-y-2 pl-2">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            <li>Select a different Demo PDF to chat with.</li>
            <li>Select a different conversation to chat with.</li>
            <li>
              Choose the AI Model powering the responses (e.g., Gemini, GPT,
              etc.).
            </li>
            <li>
              Select the Retrieval Method (how the AI finds relevant information
              in the PDF).
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Understanding Citations",
      content: (
        <>
          <p className="mb-4">
            When the AI provides information directly from the document, it will
            often include a citation like this:
          </p>
          <p className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-md text-center font-mono">
            (p.7, 1/2)
          </p>
          <p className="mb-4">
            This citation tells you exactly where in the PDF the information
            came from.
          </p>
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md">
            <strong className="block text-yellow-900 mb-2">
              Understanding the Parts:
            </strong>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>p.X</code>: This is the page number in the document (e.g.,{" "}
                <code>p.7</code> means Page 7).
              </li>
              <li>
                <code>Y/Z</code>: This indicates which vertical section of the
                page the information is located in. The page is divided into{" "}
                <code>Z</code> equal vertical parts, and <code>Y</code> is the
                specific part containing the cited text, counting from the top.
              </li>
            </ul>
            <strong className="block text-yellow-900 mt-4 mb-2">
              Examples:
            </strong>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <code>(p.7, 1/2)</code>: Information is from Page 7, the top
                half (1st of 2 vertical sections).
              </li>
              <li>
                <code>(p.8, 2/2)</code>: Information is from Page 8, the bottom
                half (2nd of 2 vertical sections).
              </li>
              <li>
                <code>(p.9, 1/4, 2/4)</code>: Information is from Page 9, the
                top and second quarter of the page. (1st of 3 vertical
                sections).
              </li>
            </ul>
          </div>
          <p className="mt-4">
            Paying attention to citations helps you verify the AI&apos;s answers
            and find the source text quickly!
          </p>
        </>
      ),
    },
    {
      title: "Managing Your Chat",
      content: (
        <>
          <p className="mb-4">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            The{" "}
            <PlusCircleIcon
              size={16}
              className="inline-block mx-1 align-text-bottom"
            />{" "}
            New Chat button is essential.
          </p>
          <p className="mb-4">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            Clicking it will clear the current conversation. This starts a fresh
            chat session with no memory of previous questions and answers. Use
            this if you want to switch topics or feel the conversation is going
            off track.
          </p>
          {/* Assuming you have a document icon button */}
          <p className="mt-4">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            You can also toggle the PDF viewer using the{" "}
            <FileText
              size={16}
              className="inline-block mx-1 align-text-bottom"
            />{" "}
            Document View icon (if available) to see the document alongside the
            chat.
          </p>
        </>
      ),
    },
    {
      title: "Need a Reminder?",
      content: (
        <>
          <p className="mb-4">
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            If you forget what the icons do or how the demo works, just click
            the{" "}
            <Lightbulb
              size={16}
              className="inline-block mx-1 align-text-bottom"
            />{" "}
            Open Tutorial lightbulb icon again to bring this guide back up!
          </p>
          <p>
            {" "}
            {/* Removed text-muted-foreground, text-sm */}
            That&apos;s it! You&apos;re ready to start chatting with the PDF.
            Have fun exploring!
          </p>
        </>
      ),
    },
  ];

  const totalPages = tutorialPages.length;
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (!isFirstPage) {
      setCurrentPageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleCloseTutorial = () => {
    setOpenTutorial(false);
  };

  const currentPage = tutorialPages[currentPageIndex];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0"
        onClick={handleCloseTutorial} // Close on backdrop click
        aria-hidden="true"
      />

      {/* Modal Container */}
      {/* Added role="dialog" and aria-modal="true" for accessibility */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] 
        w-full max-w-md p-6 bg-card text-card-foreground rounded-lg shadow-xl 
        border animate-in fade-in-0 zoom-in-95 duration-300 h-[420px]"
      >
        <div className="relative flex flex-col h-full">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseTutorial}
            className="absolute top-0 right-0 h-6 w-6 rounded-full text-muted-foreground 
            hover:text-foreground bg-orange-300 text-white"
            aria-label="Close tutorial"
          >
            <X className="scale-110" />
          </Button>

          <div className="mb-6 pr-6 overflow-y-auto min-h-[300px] max-h-[400px] text-foreground text-sm">
            {" "}
            {/* Added min-h and max-h, applied text styles */}
            <h2 className="text-xl font-semibold mb-4 text-center pr-6 text-foreground">
              {/* Ensured title is foreground color */}
              {currentPage.title}
            </h2>
            {currentPage.content}
          </div>

          {/* Navigation (Fixed at bottom) */}
          <div className="flex items-center justify-between border-t pt-4 mt-auto">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={isFirstPage}
              size="sm"
            >
              Previous
            </Button>

            {/* Page Indicator */}
            <div className="text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {totalPages}
            </div>

            <Button
              variant="outline"
              onClick={isLastPage ? handleCloseTutorial : handleNextPage}
              size="sm"
            >
              {isLastPage ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
