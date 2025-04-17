"use client";

import { useAuthStore } from "@/app/_store/useAuthStore"; // Adjust path
import { ThirdPartyAuth } from "@/app/auth/_component/ThirdPartyAuth"; // Adjust path
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
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { checkStatus } = useAuthStore();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    // Typed event
    e.preventDefault();
    // Basic password validation (example)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/signup", {
        // Adjust API path
        name,
        email,
        password,
      });

      if (response.status === 201) {
        await checkStatus();
        sessionStorage.setItem("justLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError(
          response.data?.message || "Signup failed: Unexpected status code."
        );
      }
    } catch (err) {
      console.error("Sign up error:", err);
      let message = "Signup failed. Please try again.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md" // Slightly wider card
      >
        <Card className="w-full shadow-xl border-gray-200/80">
          <CardHeader className="text-center p-6">
            {/* <YourLogo className="h-10 w-auto mx-auto mb-4" /> */}{" "}
            {/* Add your logo here */}
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create an Account
            </CardTitle>
            <CardDescription>
              Join us! Enter your details below.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

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

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password (min. 8 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {/* Simple password requirement hint */}
                {password && password.length < 8 && (
                  <p className="text-xs text-red-500">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <p className="text-red-600 text-sm font-medium flex items-center">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-base py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    Up...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or sign up with
                  </span>
                </div>
              </div>

              {/* Third-Party Auth Buttons */}
              {/* Assuming 'true' means Sign Up mode for your component */}
              <ThirdPartyAuth signup={true} />
            </form>
            {/* Link to Sign In */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
