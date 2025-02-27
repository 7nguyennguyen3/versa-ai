"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600">Page Not Found</h1>
      <p className="text-gray-600 mt-2">
        The page you are trying to access does not exist or is currently
        unavailable.
      </p>
      <Button className="mt-4" onClick={() => router.push("/")}>
        Go to Homepage
      </Button>
    </div>
  );
};

export default ErrorPage;
