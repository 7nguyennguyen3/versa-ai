"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <Card className="shadow-2xl border-red-200 bg-white max-w-2xl w-full p-8 transform transition-all hover:shadow-xl z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            Unexpected Error Occurred
          </h1>

          <div className="bg-gray-50 p-4 rounded-lg w-full">
            <p className="text-red-500 font-mono text-sm break-words">
              {error.message || "Unknown error"}
            </p>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed">
            Our AI technicians have been alerted about this issue. 🛠️
            <br />
            In the meantime, you can:
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-sm">
            <Button
              onClick={() => reset()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-4 rounded-lg text-lg shadow-md transition-all duration-300 hover:scale-105 w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105 w-full"
            >
              🏠 Return Home
            </Button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Error Code: 500 | Need immediate help?{" "}
              <a
                href="mailto:support@versapdf.com"
                className="text-blue-600 hover:underline"
              >
                Contact Support
              </a>
            </p>
            <p className="mt-2 text-xs">
              Session ID:{" "}
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorPage;
