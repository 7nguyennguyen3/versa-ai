"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  User,
  Lock,
  Mail,
  Key,
  ShieldCheck,
  BadgeDollarSign,
} from "lucide-react";

const SettingsPage = () => {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [subscription, setSubscription] = useState("Pro Plan");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6" />
        <span>Settings</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>New Password</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button className="w-full">Update Account</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Two-Step Verification</span>
              </span>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            <Button className="w-full" variant="outline">
              Manage Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BadgeDollarSign className="w-5 h-5" />
              <span>Subscription</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{subscription}</span>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <Button className="w-full" variant="destructive">
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
