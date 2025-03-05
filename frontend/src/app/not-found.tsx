"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <Card className="shadow-2xl border-blue-200 bg-white max-w-2xl w-full p-8 transform transition-all hover:shadow-xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
            Page Not Found
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
            {
              "The page you're looking for seems to have vanished into the digital void. Don't worry - our AI assistants are on the case! 🕵️♂️"
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-lg text-lg shadow-md transition-all duration-300 hover:scale-105"
            >
              🏠 Return Home
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105"
            >
              ↩ Go Back
            </Button>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            Error Code: 404 | Still lost?{" "}
            <a
              href="mailto:support@versapdf.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
