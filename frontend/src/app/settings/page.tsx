"use client";

import React, { useState, FormEvent, useEffect } from "react"; // Added FormEvent, useEffect
import { useAuthStore } from "@/app/_store/useAuthStore"; // Adjust path
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import {
  BadgeDollarSign,
  CheckCircle,
  Computer,
  Eye,
  EyeOff,
  Key,
  KeyRound,
  Lock,
  Settings,
  Shield,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

const SettingsPage = () => {
  const { userId, email: userEmail } = useAuthStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [subscription] = useState("Free Plan");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (passwordError && (oldPassword || newPassword || confirmPassword))
      setPasswordError("");
  }, [oldPassword, newPassword, confirmPassword, passwordError]);
  useEffect(() => {
    if (deleteError && (deleteEmail || deletePassword)) setDeleteError("");
  }, [deleteEmail, deletePassword, deleteError]);

  // --- Handlers ---
  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    // Removed setSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.post("/api/user/password", {
        // Adjust API path
        oldPassword,
        newPassword,
        userId,
      });
      toast.success("Password updated successfully!"); // Use toast for success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Added type annotation
      const message =
        err.response?.data?.error ||
        "Failed to update password. Please check current password.";
      setPasswordError(message);
      toast.error(message); // Use toast for error
      console.error("Password change error:", err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Simple email validation
    if (deleteEmail !== userEmail) {
      setDeleteError("Entered email does not match your account email.");
      return;
    }
    if (!deletePassword) {
      setDeleteError("Password is required to confirm deletion.");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await axios.put("/api/user/delete", {
        userId,
        email: deleteEmail,
        password: deletePassword,
      });

      if (response.status === 200 || response.data.success) {
        setIsDeleteDialogOpen(false); // Close dialog first
        setDeleteEmail(""); // Clear fields
        setDeletePassword("");
        toast.info("Account deletion request received."); // Initial feedback
        setTimeout(() => {
          toast.warning(
            "Please check your email to confirm the deletion within 15 minutes.",
            { duration: 10000 } // Longer duration
          );
          // Potentially log user out or redirect after a delay here
          // logout(router); // Example: Call logout from useAuthStore
        }, 1000);
      } else {
        // Handle unexpected success status
        throw new Error(
          response.data?.message || "Unexpected response during deletion."
        );
      }
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        "Failed to initiate account deletion. Please check credentials.";
      setDeleteError(message);
      toast.error("Deletion Failed", { description: message });
      console.error("Delete account error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper for password toggle button
  const PasswordToggleButton = ({
    isVisible,
    setVisibility,
  }: {
    isVisible: boolean;
    setVisibility: (visible: boolean) => void;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setVisibility(!isVisible)}
      className="absolute inset-y-0 right-1 h-7 w-7 my-auto text-gray-500 hover:text-gray-700" // Use Button component
      aria-label={isVisible ? "Hide password" : "Show password"}
    >
      {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </Button>
  );

  // --- JSX Return ---
  return (
    // Use consistent background, top padding, standard centering
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-100 px-4 py-16 md:py-24">
      <div className="w-full max-w-4xl mx-auto mt-20 lg:mt-0">
        {" "}
        {/* Center content block */}
        {/* Page Header */}
        <motion.div
          className="mb-8 md:mb-10 text-center md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center justify-center md:justify-start gap-2">
            <Settings className="w-7 h-7" /> Account Settings
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your account details, password, and security settings.
          </p>
        </motion.div>
        {/* Settings Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch" // items-start prevents cards stretching unevenly
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* --- Password Settings Card --- */}
          <Card className="shadow-md border-gray-200/80 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                <Key className="w-5 h-5 text-indigo-600" />{" "}
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your account password regularly for security.
              </CardDescription>
            </CardHeader>
            {/* ADDED: flex-grow to allow content to expand vertically */}
            {/* ADDED: flex flex-col to allow internal elements to push each other */}
            <CardContent className="flex flex-col flex-grow">
              {/* Form takes up main space, ADDED flex-grow */}
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 flex-grow"
              >
                {/* Current Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pr-10"
                      required
                      disabled={passwordLoading}
                    />
                    <PasswordToggleButton
                      isVisible={showOldPassword}
                      setVisibility={setShowOldPassword}
                    />
                  </div>
                </div>
                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                      required
                      disabled={passwordLoading}
                      placeholder="Min. 8 characters"
                    />
                    <PasswordToggleButton
                      isVisible={showNewPassword}
                      setVisibility={setShowNewPassword}
                    />
                  </div>
                </div>
                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      required
                      disabled={passwordLoading}
                    />
                    <PasswordToggleButton
                      isVisible={showConfirmPassword}
                      setVisibility={setShowConfirmPassword}
                    />
                  </div>
                </div>

                {/* --- NEW: Password Requirements --- */}
                <div className="pt-1 text-xs text-gray-500 space-y-1">
                  <p className="font-medium">Password must contain:</p>
                  <ul className="list-disc list-inside pl-2 space-y-0.5">
                    {/* Add dynamic checks here later if desired */}
                    <li>At least 8 characters</li>
                    <li>An uppercase letter</li>
                    <li>A number or symbol</li>
                  </ul>
                </div>
                {/* --- End Password Requirements --- */}

                {/* Inline Error Display for Validation */}
                {passwordError && !passwordLoading && (
                  <Alert variant="destructive" className="p-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {" "}
                      {passwordError}{" "}
                    </AlertDescription>
                  </Alert>
                )}
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>

              {/* --- NEW: Security Tip --- */}
              {/* ADDED: mt-auto to push to bottom, pt-4 border-t for separation */}
              <div className="mt-auto pt-4 border-t border-gray-200/60 text-center md:text-left">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Security Tip:</span> Use a
                  unique password for this account that you don&apos;t use
                  elsewhere. Consider using a password manager.
                </p>
              </div>
              {/* --- End Security Tip --- */}
            </CardContent>
          </Card>

          {/* --- Security Settings Card --- */}
          <Card className="shadow-md border-gray-200/80">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                <Lock className="w-5 h-5 text-indigo-600" />{" "}
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Manage two-factor authentication and other security features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Security Overview */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  {" "}
                  <div className="space-y-0.5">
                    {" "}
                    <h3 className="font-medium text-sm">
                      Account Security Status
                    </h3>{" "}
                    <p className="text-xs text-gray-600">
                      {" "}
                      {twoFactorEnabled
                        ? "Two-factor enabled"
                        : "Basic protection"}{" "}
                    </p>{" "}
                  </div>{" "}
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      twoFactorEnabled
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {" "}
                    {twoFactorEnabled ? "Secure" : "Needs Attention"}{" "}
                  </div>{" "}
                </div>
              </div>
              {/* Two-Factor */}
              <div className="pt-4 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="two-factor-switch"
                    className="flex flex-col space-y-1 flex-grow pr-4"
                  >
                    <span className="font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Two-Factor Authentication
                    </span>
                    <span className="font-normal text-xs leading-snug text-muted-foreground">
                      {" "}
                      Add an extra layer of security via email or authenticator
                      app.{" "}
                    </span>
                  </Label>
                  <Switch
                    id="two-factor-switch"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                    aria-label="Toggle two-factor authentication"
                  />
                </div>
                {twoFactorEnabled && (
                  <div className="mt-3 bg-green-50 p-3 rounded-md border border-green-200">
                    {" "}
                    <div className="flex items-center space-x-2">
                      {" "}
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />{" "}
                      <span className="text-xs text-green-800">
                        {" "}
                        2FA is currently active.{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                )}
              </div>
              {/* Additional Actions */}
              <div className="pt-4 border-t border-slate-200/60 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  More Security Options
                </h4>
                <Button
                  className="w-full justify-start text-sm font-normal"
                  variant="outline"
                  onClick={() => toast.info("Feature coming soon!")}
                >
                  {" "}
                  <Shield className="w-4 h-4 mr-2 text-gray-500" /> View
                  Security Activity{" "}
                </Button>
                <Button
                  className="w-full justify-start text-sm font-normal"
                  variant="outline"
                  onClick={() => toast.info("Feature coming soon!")}
                >
                  {" "}
                  <Computer className="w-4 h-4 mr-2 text-gray-500" /> Manage
                  Devices{" "}
                </Button>
                <Button
                  className="w-full justify-start text-sm font-normal"
                  variant="outline"
                  onClick={() => toast.info("Feature coming soon!")}
                >
                  {" "}
                  <KeyRound className="w-4 h-4 mr-2 text-gray-500" /> Change
                  Recovery Options{" "}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* --- Subscription Settings Card --- */}
          <Card className="shadow-md border-gray-200/80 lg:col-span-1 h-[240px]">
            {" "}
            {/* Adjusted span if needed */}
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                <BadgeDollarSign className="w-5 h-5 text-indigo-600" />{" "}
                <span>Subscription</span>
              </CardTitle>
              <CardDescription>
                View and manage your current plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Current Plan
                  </p>
                  <span className="text-lg font-semibold text-gray-800">
                    {subscription}
                  </span>
                </div>
                <Button variant="default" size="sm" asChild>
                  <Link href="/pricing">
                    {" "}
                    {/* Link to pricing page */}
                    {subscription === "Free Plan"
                      ? "Upgrade Plan"
                      : "Manage Plan"}
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                For billing history or detailed management, please visit our
                billing portal.
              </p>
              {/* Optionally add Cancel Subscription button if applicable */}
              {/* <Button className="w-full" variant="link" size="sm" className="text-red-600 hover:text-red-700 h-auto p-0"> Cancel Subscription </Button> */}
            </CardContent>
          </Card>

          {/* --- Danger Zone / Account Deletion Card --- */}
          <Card className="shadow-md border-red-300 bg-red-50/30 lg:col-span-1 h-[240px]">
            {" "}
            {/* Use red theme */}
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-red-800">
                <AlertTriangle className="w-5 h-5" /> <span>Danger Zone</span>
              </CardTitle>
              <CardDescription className="text-red-700">
                Irreversible actions regarding your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-2 text-sm text-gray-800">
                Delete Account
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Once deleted, your account and all associated data will be
                permanently removed. This cannot be undone.
              </p>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        {/* Delete Account Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsDeleteDialogOpen(false);
              setDeleteError("");
              setDeleteEmail("");
              setDeletePassword("");
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Confirm
                Account Deletion
              </DialogTitle>
              <DialogDescription className="pt-2">
                This action is irreversible. To confirm, please enter your
                account email and current password below. All your documents and
                chat history will be permanently lost.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="delete-email">Account Email</Label>
                <Input
                  id="delete-email"
                  type="email"
                  autoComplete="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={deleteLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="delete-password">Password</Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your current password"
                  disabled={deleteLoading}
                />
              </div>
              {deleteError && (
                <p className="text-red-600 text-sm">{deleteError}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={deleteLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleDeleteAccount}
                disabled={
                  deleteLoading ||
                  !deleteEmail ||
                  !deletePassword ||
                  deleteEmail !== userEmail
                }
                variant="destructive"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete Account Permanently"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SettingsPage;
