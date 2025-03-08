"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { File, Loader2, Upload, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../_store/useAuthStore";

const UploadPdfPage = () => {
  const { monthlyUploadUsage, monthlyUploadLimit } = useAuthStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileSizeMB, setFileSizeMB] = useState<number | null>(null); // New state for file size
  const { userId } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);

  const remainingUploadLimit = monthlyUploadLimit - monthlyUploadUsage;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth/get-token");
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
        } else {
          throw new Error("Token not found");
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
        setError("Authentication required. Redirecting to login...");
        router.push("/login");
      }
    };

    fetchToken();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
      // Calculate and set the file size in MB
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      setFileSizeMB(parseFloat(fileSizeMB));
    } else {
      setError("Please select a valid PDF file.");
      setFileSizeMB(null); // Reset file size if the file is invalid
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
      setError("User ID is missing.");
      return;
    }

    if (!token) {
      setError("Authentication required. Redirecting to login...");
      router.push("/login");
      return;
    }

    if (
      monthlyUploadUsage + (fileSizeMB ?? file.size) / (1024 * 1024) >
      remainingUploadLimit
    ) {
      setError(
        `File size exceeds your plan limit. Remaining limit: ${remainingUploadLimit} MB.`
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("pdfName", pdfName);
    formData.append("userId", userId);

    try {
      const response = await axios.post("/api/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setPdfUrl(response.data.pdfUrl);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        router.push("/login");
      } else {
        const errorMessage =
          typeof err.response?.data?.error === "string"
            ? err.response.data.error
            : "Upload failed. Please try again. The format of the PDF might be invalid.";
        setError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col justify-center items-center p-6 space-y-6">
      <h2 className="text-2xl font-semibold">📄 Upload a PDF </h2>
      {/* PDF Name Input */}
      <Input
        type="text"
        placeholder="Enter PDF name"
        value={pdfName}
        onChange={(e) => setPdfName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* File Upload Section */}
      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {file ? (
          <div className="flex flex-col items-center space-y-2">
            <File className="w-10 h-10 text-gray-600" />
            <p className="text-gray-600">{file.name}</p>
            <p className="text-gray-600">Size: {fileSizeMB} MB</p>{" "}
            {/* Display file size */}
            <Button variant="destructive" onClick={() => setFile(null)}>
              <XCircle className="w-4 h-4 mr-2" /> Remove File
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="w-10 h-10 text-gray-400 mx-auto" />
            <p className="text-gray-600">
              Drag & Drop or Click to Select a PDF
            </p>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-4"
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={uploading || !file || !pdfName.trim()}
        className="w-full"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          "Upload PDF"
        )}
      </Button>

      {/* Uploaded File Link */}
      {pdfUrl && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            ✅ PDF successfully uploaded to the database. The document is now
            being processed in the background for indexing in the vector store
            📄✨
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Open Uploaded PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadPdfPage;
