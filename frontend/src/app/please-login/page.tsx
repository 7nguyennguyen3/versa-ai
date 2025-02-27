"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Unauthorized = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8); // Set initial countdown to 8 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/auth/signup");
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-red-500">Login Required</h1>
      <p className="mt-2 text-gray-600">Please log in to access this page.</p>
      <p className="mt-4 text-gray-500">
        Redirecting you to the sign up page in{" "}
        <span className="font-bold">{countdown}</span> seconds...
      </p>
      <Link
        href={"/auth/signup"}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign Up Now
      </Link>
      <Link
        href={"/"}
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Return Home
      </Link>
    </div>
  );
};

export default Unauthorized;
