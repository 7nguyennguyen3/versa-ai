"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
      <p className="text-gray-600 mt-2">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="mt-4 flex gap-4">
        <Button onClick={() => reset()}>Try Again</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
