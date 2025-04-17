import { useAuthStore } from "@/app/_store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  ArrowRight,
  Settings,
  AlertTriangle,
  Smile,
} from "lucide-react";
import router from "next/router";
import React from "react";

interface LoggedInAlreadyProps {
  name: string | null;
}

const LoggedInAlready = ({ name }: LoggedInAlreadyProps) => {
  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center 
          bg-gradient-to-br from-slate-50 via-white to-blue-100 p-4"
    >
      <Card className="w-full max-w-md shadow-lg border-gray-200/80">
        <CardHeader className="flex flex-col items-center space-y-2 pb-4">
          <CheckCircle className="w-12 h-12 text-emerald-500" />{" "}
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {name && (
              <div className="flex items-center justify-center font-semibold text-2xl space-x-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-red-600">
                  Hi {name}!
                </span>
                <Smile className="text-red-800" />
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            You are already logged in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-500 text-white"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/settings")}
              className="w-full border-green-500 text-green-600 hover:bg-green-50"
            >
              Go to Settings
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={() => useAuthStore.getState().logout(router)}
            className="w-full bg-red-600 hover:bg-red-500 text-white max-w-[200px]"
          >
            Sign Out
            <AlertTriangle />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoggedInAlready;
