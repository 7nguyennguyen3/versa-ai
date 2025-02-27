"use client";
import { useAuthStore } from "@/app/_store/useAuthStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const MicrosoftSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkStatus } = useAuthStore();

  const handleMicrosoftSignIn = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/auth/microsoft"); // Adjust if using OAuth redirect

      if (response.status === 200) {
        await checkStatus();
        router.push("/");
      }
    } catch (err) {
      console.error("Microsoft Sign-In failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMicrosoftSignIn}
      className="w-full flex items-center justify-center space-x-2 bg-[#0078D4] text-white border border-[#0078D4] hover:bg-[#005A9E]"
      disabled={loading}
    >
      <FaMicrosoft className="w-5 h-5 text-white" />
      <span>{loading ? "Signing in..." : "Continue with Microsoft"}</span>
    </Button>
  );
};

const GitHubSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkStatus } = useAuthStore();

  const handleGitHubSignIn = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/auth/github"); // Adjust if using OAuth redirect

      if (response.status === 200) {
        await checkStatus();
        router.push("/");
      }
    } catch (err) {
      console.error("GitHub Sign-In failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGitHubSignIn}
      className="w-full flex items-center justify-center space-x-2 bg-black text-white border border-black hover:bg-gray-800"
      disabled={true}
    >
      <span>{loading ? "Signing in..." : "Continue with GitHub"}</span>
      <FaGithub className="w-5 h-5" />
    </Button>
  );
};

const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false);
  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center space-x-2 bg-[#EA4335] text-white border border-[#EA4335] hover:bg-red-600"
      disabled={loading}
    >
      <FaGoogle className="w-5 h-5 text-white" />{" "}
      <span>{loading ? "Signing in..." : "Continue with Google"}</span>
    </Button>
  );
};

const SignUpButton = ({ signup }: { signup: boolean }) => {
  return (
    <Link
      href={signup ? "/auth/signup" : "/auth/signin"}
      className="w-full flex items-center justify-center"
    >
      <Button className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white border border-blue-500 hover:bg-blue-600">
        <IoMail className="w-5 h-5 text-white" />
        <span>{signup ? "Create an Account" : "Sign in with Email"}</span>
      </Button>
    </Link>
  );
};

const ThirdPartyAuth = ({ signup }: { signup: boolean }) => {
  return (
    <>
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <SignUpButton signup={signup} />
      <GitHubSignInButton />
      <GoogleSignInButton />
    </>
  );
};

export {
  GitHubSignInButton,
  GoogleSignInButton,
  MicrosoftSignInButton,
  SignUpButton,
  ThirdPartyAuth,
};
