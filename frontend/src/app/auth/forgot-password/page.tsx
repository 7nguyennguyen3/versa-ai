"use client";

import { useAuthStore } from "@/app/_store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { Key, Loader2, Mail } from "lucide-react"; // Using Mail icon for forgot password
import Link from "next/link";
import { FormEvent, useState } from "react";
import LoggedInRedirect from "../_component/LoggedInRedirect";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { authenticated, userId, name } = useAuthStore();

  //   const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setMessage(""); // Clear previous messages
  //     setIsError(false);

  //     if (!email) {
  //       setMessage("Please enter your email address.");
  //       setIsError(true);
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       // Adjust this API endpoint to match your backend's forgot password route
  //       const response = await axios.post("/api/auth/forgot-password", {
  //         email,
  //       });

  //       if (response.status === 200) {
  //         setMessage(
  //           response.data?.message || "Password reset link sent to your email."
  //         );
  //         setIsError(false);
  //         setEmail(""); // Optionally clear email field on success
  //       } else {
  //         // Handle potential non-200 success responses if your API sends them
  //         setMessage(
  //           response.data?.message ||
  //             "An unexpected issue occurred. Please try again."
  //         );
  //         setIsError(true);
  //       }
  //     } catch (err) {
  //       console.error("Forgot password error:", err);
  //       let errorMessage =
  //         "Failed to send reset link. Please check your email or try again later.";
  //       if (axios.isAxiosError(err)) {
  //         errorMessage = err.response?.data?.error || err.message || errorMessage;
  //       } else if (err instanceof Error) {
  //         errorMessage = err.message;
  //       }
  //       setMessage(errorMessage);
  //       setIsError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
    toast.message(
      "This feature is not yet implemented. Please stay tuned for updates! 🌟"
    );
  };

  if (authenticated && userId) return <LoggedInRedirect name={name} />;

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center
       bg-gradient-to-br from-slate-50 via-white to-blue-100 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md" // Same card width as sign-in
      >
        <Card className="w-full shadow-xl border-gray-200/80">
          <CardHeader className="text-center p-6">
            {/* <YourLogo className="h-10 w-auto mx-auto mb-4" /> */}{" "}
            {/* Add your logo here */}
            <CardTitle className="text-2xl font-bold tracking-tight">
              Forgot Your Password?
            </CardTitle>
            <CardDescription>
              Enter your email address below and we&apos;ll send you a link to
              reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {" "}
              {/* Increased space here */}
              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {/* Message Display (Error or Success) */}
              {message && (
                <p
                  className={`text-sm font-medium flex items-center gap-1.5 ${
                    isError ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isError ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}{" "}
                  {/* Use appropriate icon */}
                  {message}
                </p>
              )}
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-sm py-3 gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow"
                disabled={loading || !email} // Disable if loading or email is empty
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                    link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <Mail className="scale-110" />{" "}
                    {/* Or use Mail icon again */}
                  </>
                )}
              </Button>
            </form>

            {/* Link back to Sign In */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/auth/signin" // Adjust path
                className="font-medium text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
            {/* Optional: Link to Sign Up */}
            <p className="mt-2 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup" // Adjust path
                className="font-medium text-blue-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
