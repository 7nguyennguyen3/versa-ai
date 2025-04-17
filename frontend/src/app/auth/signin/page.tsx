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
import axios from "axios"; // Import AxiosError
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"; // Added icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"; // Added FormEvent

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { checkStatus } = useAuthStore();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        await checkStatus();
        sessionStorage.setItem("justLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError(
          response.data?.message || "Login failed: Unexpected status code."
        );
      }
    } catch (err) {
      console.error("Sign in error:", err);
      let message =
        "Login failed. Please check your credentials and try again.";
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
    <div
      className="flex flex-col min-h-screen items-center justify-center 
    bg-gradient-to-br from-slate-50 via-white to-blue-100 p-4"
    >
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
              Welcome Back!
            </CardTitle>
            <CardDescription>
              Sign in to continue to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSignIn} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password" // Adjust path
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10" // Add padding for the icon
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
              </div>

              {/* Error Display */}
              {error && (
                <p className="text-red-600 text-sm font-medium flex items-center">
                  <LogIn className="w-4 h-4 mr-1.5" />
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
                    in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Third-Party Auth Buttons */}
              {/* Assuming 'false' means Sign In mode for your component */}
              <ThirdPartyAuth signup={false} />
            </form>
            {/* Link to Sign Up */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
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

export default SignInPage;
