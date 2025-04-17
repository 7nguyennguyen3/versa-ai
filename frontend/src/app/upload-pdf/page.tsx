"use client";

// --- Necessary Imports ---
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI Button
import { Input } from "@/components/ui/input"; // Assuming Shadcn UI Input
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming Shadcn UI Card
import { Progress } from "@/components/ui/progress"; // Assuming Shadcn UI Progress
import axios, { AxiosProgressEvent, AxiosError } from "axios";
import {
  File,
  Loader2,
  Upload,
  XCircle,
  AlertCircle,
  CheckCheck,
} from "lucide-react"; // Icons
import { useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  ChangeEvent,
  DragEvent,
  useRef,
  MouseEvent, // Still needed if you add other buttons inside label later
} from "react";
import { useAuthStore } from "../_store/useAuthStore"; // Your Zustand store
import { motion, AnimatePresence } from "framer-motion"; // Animations

// --- Component Definition ---
const UploadPdfPage = () => {
  // --- State Variables ---
  const { monthlyUploadUsage, monthlyUploadLimit, userId, checkStatus } =
    useAuthStore(); // Auth state
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null); // Selected file
  const [pdfName, setPdfName] = useState(""); // Name for the PDF
  const [uploading, setUploading] = useState(false); // Upload status
  const [error, setError] = useState(""); // Error messages
  const [successMessage, setSuccessMessage] = useState(""); // Success messages
  const [fileSizeMB, setFileSizeMB] = useState<number | null>(null); // File size
  const [isDragging, setIsDragging] = useState(false); // Drag-over state
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress percentage
  const [token, setToken] = useState<string | null>(null); // Auth token
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to hidden file input

  // --- Calculated Values ---
  const limit = typeof monthlyUploadLimit === "number" ? monthlyUploadLimit : 0;
  const usage = typeof monthlyUploadUsage === "number" ? monthlyUploadUsage : 0;
  const remainingUploadLimit = Math.max(0, limit - usage).toFixed(2);

  // --- Effects ---
  useEffect(() => {
    const fetchTokenAndStatus = async () => {
      try {
        const response = await fetch("/api/auth/get-token");
        if (!response.ok) throw new Error("Failed to fetch token");
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
          await checkStatus();
        } else {
          throw new Error("Token not found in response");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setError("Authentication required. Redirecting to login...");
        const timer = setTimeout(() => router.push("/login"), 1500);
        return () => clearTimeout(timer);
      }
    };
    fetchTokenAndStatus();
  }, [router, checkStatus]);

  // --- File Processing Logic ---
  const processFile = (selectedFile: File | null) => {
    setError("");
    setSuccessMessage("");
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        const fileSize = selectedFile.size / (1024 * 1024);
        setFileSizeMB(fileSize);
        if (fileSize > parseFloat(remainingUploadLimit)) {
          setError(
            `File size (${fileSize.toFixed(
              2
            )} MB) exceeds remaining limit (${remainingUploadLimit} MB).`
          );
          setFile(null);
          setPdfName("");
          setFileSizeMB(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setFile(selectedFile);
          setPdfName(selectedFile.name.replace(/\.pdf$/i, ""));
        }
      } else {
        setError("Invalid file type. Please select a PDF file.");
        setFile(null);
        setPdfName("");
        setFileSizeMB(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      // If no file is selected (e.g., dialog cancelled), reset state
      removeFile();
    }
  };

  // --- Event Handlers ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    // Label only
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    // Only process if not currently uploading or showing success
    if (!uploading && !successMessage) {
      processFile(e.dataTransfer.files?.[0] ?? null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    // Label only
    e.preventDefault();
    e.stopPropagation();
    // Only show dragging state if interaction is allowed
    if (!uploading && !successMessage) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    // Label only
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPdfName(e.target.value);
    if (error === "PDF name is required.") {
      setError("");
    }
  };

  // **MODIFIED**: Handles removing the selected file. No event needed now.
  const removeFile = () => {
    // Reset all file-related state
    setFile(null);
    setPdfName("");
    setFileSizeMB(null);
    setError("");
    setSuccessMessage("");
    setUploadProgress(0);
    // Reset the actual file input element
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles the main upload logic (async function)
  const handleUpload = async () => {
    // --- Pre-Upload Validations ---
    if (
      !file ||
      !pdfName.trim() ||
      !userId ||
      !token ||
      (fileSizeMB !== null && fileSizeMB > parseFloat(remainingUploadLimit))
    ) {
      // Set specific errors if conditions fail (can refine this part)
      if (!file) setError("No file selected. Please choose a PDF.");
      else if (!pdfName.trim()) setError("PDF name is required.");
      else if (!userId || !token)
        setError("Authentication error. Please log in again.");
      else
        setError(
          `File size exceeds remaining limit (${remainingUploadLimit} MB).`
        );
      return;
    }

    // --- Start Upload Process ---
    setUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("pdfName", pdfName.trim());
    formData.append("userId", userId);

    try {
      // --- Axios POST Request ---
      const response = await axios.post("/api/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const total = progressEvent.total ?? file.size;
          if (total > 0) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total
            );
            setUploadProgress(percentCompleted);
          } else {
            setUploadProgress(0);
          }
        },
      });

      // --- Handle Success ---
      setSuccessMessage("✅ PDF uploaded successfully! Processing for chat...");
      await checkStatus();
      const timer = setTimeout(() => {
        removeFile(); // Reset form state
        setSuccessMessage(""); // Clear success message after reset
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer
    } catch (err: unknown) {
      // --- Handle Errors ---
      setUploadProgress(0);
      let errorMessage = "Upload failed. Please check the file or try again.";
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<any>;
        if (axiosError.response?.status === 401) {
          errorMessage =
            "Authentication failed or session expired. Please log in again.";
          const timer = setTimeout(() => router.push("/login"), 1500);
          return () => clearTimeout(timer);
        } else if (axiosError.response?.status === 413) {
          errorMessage = "File is too large. Please upload a smaller PDF.";
        } else if (axiosError.response?.status === 402) {
          errorMessage =
            "Upload limit reached or payment required. Please check your plan.";
        } else if (typeof axiosError.response?.data?.error === "string") {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      // --- Cleanup ---
      setUploading(false);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl mt-20 lg:mt-0"
      >
        <Card className="w-full shadow-xl border border-gray-200/80 overflow-hidden rounded-lg">
          <CardHeader className="bg-gray-50/50 border-b border-gray-200/80 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
              <Upload className="w-6 h-6 mr-3 text-indigo-600" /> Upload New PDF
            </CardTitle>
            <CardDescription className="text-gray-500 pt-1">
              Upload a PDF document to start chatting with it using AI.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Usage Limit Info */}
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
              Monthly Upload Limit:{" "}
              <span className="font-medium">{limit} MB</span> | Remaining:{" "}
              <span className="font-medium text-indigo-700">
                {remainingUploadLimit} MB
              </span>
            </div>
            {/* PDF Name Input */}
            <div>
              <label
                htmlFor="pdfName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                PDF Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="pdfName"
                type="text"
                placeholder="Enter a name for your PDF (e.g., 'Annual Report')"
                value={pdfName}
                onChange={handleNameChange}
                disabled={uploading || !!successMessage}
                className="w-full border-gray-300 shadow-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                aria-describedby="pdf-name-description"
                aria-required="true"
              />
              <p
                id="pdf-name-description"
                className="mt-1 text-xs text-gray-500"
              >
                This name helps you identify the document later.
              </p>
            </div>
            {/* --- File Upload Section --- */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                PDF File <span className="text-red-500">*</span>
              </span>
              {/* Clickable Label Area for selection/drop */}
              <label
                htmlFor="pdf-file-input"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative block w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ease-in-out
                                ${
                                  isDragging
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-300 hover:border-gray-400"
                                }
                                ${file ? "border-green-500 bg-green-50/80" : ""}
                                ${
                                  uploading || !!successMessage
                                    ? "opacity-60 cursor-not-allowed pointer-events-none"
                                    : "cursor-pointer"
                                } `}
              >
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  id="pdf-file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading || !!successMessage}
                  aria-hidden="true"
                />
                {/* Animated content inside the label */}
                <AnimatePresence mode="wait">
                  {file ? (
                    // Display file info TEXT inside label
                    <motion.div
                      key="file-info-text" // Changed key
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center space-y-2 pointer-events-none" // Add pointer-events-none here too
                    >
                      <File className="w-12 h-12 text-green-600" />
                      <p className="text-sm font-medium text-gray-700 break-all px-4">
                        {file.name}
                      </p>
                      {fileSizeMB !== null && (
                        <p className="text-xs text-gray-500">
                          Size: {fileSizeMB.toFixed(2)} MB
                        </p>
                      )}
                      {/* REMOVE BUTTON MOVED OUTSIDE */}
                    </motion.div>
                  ) : (
                    // Display prompt inside label
                    <motion.div
                      key="dropzone-prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center space-y-2 text-gray-500 pointer-events-none"
                    >
                      <Upload className="w-10 h-10" />
                      <p className="font-medium">
                        {isDragging
                          ? "Drop the file here!"
                          : "Drag & Drop PDF or Click Here"}
                      </p>
                      <p className="text-xs">
                        Max file size based on your plan: {limit} MB
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </label>{" "}
              {/* End of clickable label */}
              {/* *** REMOVE BUTTON NOW OUTSIDE AND BELOW THE LABEL *** */}
              {file &&
                !uploading &&
                !successMessage && ( // Only show if file exists and not busy
                  <div className="flex justify-center mt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeFile} // Calls the simplified removeFile handler
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 h-auto px-3 py-1.5 rounded-md" // Adjusted padding/margin
                      aria-label="Remove selected file"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" /> Remove File
                    </Button>
                  </div>
                )}
            </div>{" "}
            {/* End of File Upload Section container */}
            {/* Upload Progress Indicator */}
            {uploading && (
              <div className="space-y-1 pt-2">
                <Progress
                  value={uploadProgress}
                  className="w-full h-2 transition-all [&>div]:bg-indigo-600"
                  aria-label={`Uploading file progress: ${uploadProgress}%`}
                />
                <p className="text-xs text-indigo-600 text-center">{`Uploading... ${uploadProgress}%`}</p>
              </div>
            )}
            {/* Error Message Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 mt-4"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </motion.div>
            )}
            {/* Success Message Display */}
            {successMessage && !uploading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-2 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md p-3 mt-4"
                role="status"
              >
                <CheckCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-700" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </CardContent>

          {/* Card Footer with Upload Button */}
          <CardFooter className="bg-gray-50/50 border-t border-gray-200/80 p-6">
            <Button
              onClick={handleUpload}
              disabled={
                uploading ||
                !file ||
                !pdfName.trim() ||
                !!error || // Disable if validation error shown before upload attempt
                (fileSizeMB !== null &&
                  fileSizeMB > parseFloat(remainingUploadLimit)) || // Explicitly disable if file too big
                !!successMessage
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold py-3 rounded-md transition-colors duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              size="lg"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Upload className="w-5 h-5 mr-2" />
              )}
              {uploading
                ? `Uploading (${uploadProgress}%)`
                : "Upload & Process PDF"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadPdfPage;
