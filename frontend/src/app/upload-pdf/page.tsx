"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios, { AxiosProgressEvent } from "axios";
import {
  File,
  Loader2,
  Upload,
  XCircle,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  ChangeEvent,
  DragEvent,
  useRef,
} from "react";
import { useAuthStore } from "../_store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

const UploadPdfPage = () => {
  const { monthlyUploadUsage, monthlyUploadLimit, userId, checkStatus } =
    useAuthStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fileSizeMB, setFileSizeMB] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limit = typeof monthlyUploadLimit === "number" ? monthlyUploadLimit : 0;
  const usage = typeof monthlyUploadUsage === "number" ? monthlyUploadUsage : 0;
  const remainingUploadLimit = Math.max(0, limit - usage).toFixed(2);

  useEffect(() => {
    const fetchTokenAndStatus = async () => {
      try {
        const response = await fetch("/api/auth/get-token");
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
          await checkStatus();
        } else {
          throw new Error("Token not found");
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setError("Authentication required. Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      }
    };
    fetchTokenAndStatus();
  }, [router, checkStatus]);

  const processFile = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
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
      } else {
        setFile(selectedFile);
        setPdfName(selectedFile.name.replace(/\.pdf$/i, ""));
        setError("");
        setSuccessMessage("");
      }
    } else if (selectedFile) {
      setError("Please select a valid PDF file.");
      setFile(null);
      setPdfName("");
      setFileSizeMB(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0] ?? null);
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0] ?? null);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPdfName(e.target.value);
    if (error === "PDF name is required.") {
      setError("");
    }
  };
  const removeFile = () => {
    setFile(null);
    setPdfName("");
    setFileSizeMB(null);
    setError("");
    setSuccessMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }
    if (!pdfName.trim()) {
      setError("PDF name is required.");
      return;
    }
    if (!userId) {
      setError("User not authenticated.");
      return;
    }
    if (!token) {
      setError("Authentication token missing.");
      return;
    }
    if (fileSizeMB !== null && fileSizeMB > parseFloat(remainingUploadLimit)) {
      setError(
        `File size (${fileSizeMB.toFixed(
          2
        )} MB) exceeds remaining limit (${remainingUploadLimit} MB).`
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccessMessage("");
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("pdfName", pdfName.trim());
    formData.append("userId", userId);

    try {
      const response = await axios.post("/api/pdf/upload", formData, {
        /* ... headers, onUploadProgress ... */
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setUploadProgress(percentCompleted);
        },
      });
      setSuccessMessage("✅ PDF uploaded successfully! Processing for chat...");
      await checkStatus();
      setTimeout(removeFile, 3000);
    } catch (err: any) {
      /* ... error handling ... */
      setUploadProgress(0);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        const errorMessage =
          typeof err?.response?.data?.error === "string"
            ? err.response.data.error
            : "Upload failed. Please check the file or try again.";
        setError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    // MODIFIED: Added justify-center, removed pt/pb for vertical centering
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 flex flex-col items-center justify-center px-4 py-6">
      {" "}
      {/* Reduced overall py slightly */}
      {/* Card container with animations */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }} // Added scale animation
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl mt-20 lg:mt-0" // Content width
      >
        <Card className="w-full shadow-xl border border-gray-200/80 overflow-hidden">
          {" "}
          {/* Slightly stronger shadow */}
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
                PDF Name
              </label>
              <Input
                id="pdfName"
                type="text"
                placeholder="Enter a name for your PDF"
                value={pdfName}
                onChange={handleNameChange}
                disabled={uploading || !!successMessage}
                className="w-full border-gray-300 shadow-sm"
                aria-describedby="pdf-name-description"
              />
              <p
                id="pdf-name-description"
                className="mt-1 text-xs text-gray-500"
              >
                This name helps you identify the document later.
              </p>
            </div>

            {/* File Upload Section / Dropzone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`relative w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out
                        ${
                          isDragging
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        ${file ? "border-green-500 bg-green-50/80" : ""}
                        ${
                          uploading || !!successMessage
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        } `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading || !!successMessage}
                />
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file-info"
                      /* ... animation props ... */ className="flex flex-col items-center space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        disabled={uploading}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 h-auto px-2 py-1"
                      >
                        {" "}
                        <XCircle className="w-4 h-4 mr-1" /> Remove{" "}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dropzone-prompt"
                      /* ... animation props ... */ className="flex flex-col items-center space-y-2 text-gray-500 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Upload className="w-10 h-10" />
                      <p className="font-medium">
                        {isDragging
                          ? "Drop the file here!"
                          : "Drag & Drop PDF or Click"}
                      </p>
                      <p className="text-xs">
                        Max file size: {limit} MB (based on your plan)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-1 pt-2">
                <Progress
                  value={uploadProgress}
                  className="w-full h-2 transition-all"
                />
                <p className="text-xs text-indigo-600 text-center">{`Uploading... ${uploadProgress}%`}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                /* ... animation props ... */ className="flex items-start space-x-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {" "}
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{" "}
                <span>{error}</span>{" "}
              </motion.div>
            )}
            {/* Success Message */}
            {successMessage && (
              <motion.div
                /* ... animation props ... */ className="flex items-start space-x-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3 mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {" "}
                <CheckCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />{" "}
                <span>{successMessage}</span>{" "}
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t border-gray-200/80 p-6">
            <Button
              onClick={handleUpload}
              disabled={
                uploading ||
                !file ||
                !pdfName.trim() ||
                !!error ||
                !!successMessage
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold py-3 disabled:bg-indigo-300 disabled:cursor-not-allowed"
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
