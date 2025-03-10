"use client";

import { useAuthStore } from "@/app/_store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { userId } = useAuthStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [subscription] = useState("Free Plan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/user/password", {
        oldPassword,
        newPassword,
        userId,
      });

      if (response.status === 200) {
        setSuccess("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.put("/api/user/delete", {
        userId,
        email,
        password,
      });

      if (response.data.success) {
        toast.success("This feature is still in development. ");

        setTimeout(() => {
          toast.warning(
            "Account deletion initiated. Please check your email to confirm it within 15 minutes.",
            { duration: 8000 }
          );
        }, 4000);

        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to initiate account deletion."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6" />
        <span>Settings</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Password Settings */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Password Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow space-y-4">
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 flex-grow"
            >
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <span>Current Password</span>
                </label>
                <div className="relative mt-1">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showOldPassword ? (
                      <Eye className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <span>New Password</span>
                </label>
                <div className="relative mt-1">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showNewPassword ? (
                      <Eye className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-sm font-medium flex items-center space-x-2">
                  <span>Confirm New Password</span>
                </label>
                <div className="relative mt-1">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </form>

            {/* Delete Account Button */}
            <div className="mt-auto pt-4 border-t">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete Account
              </Button>

              {/* Delete Account Dialog */}
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={loading}
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={loading || !email || !password}
                      variant="destructive"
                    >
                      {loading ? "Deleting..." : "Confirm Deletion"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
          <CardContent className="space-y-6">
            {/* Security Status Overview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Account Security Status</h3>
                  <p className="text-sm text-gray-600">
                    {twoFactorEnabled ? "Enhanced" : "Basic"} protection
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    twoFactorEnabled
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {twoFactorEnabled ? "Secure" : "At Risk"}
                </div>
              </div>
              {/* <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle
                    className={`w-4 h-4 ${
                      twoFactorEnabled ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span className="text-sm">Two-Factor Authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-gray-300" />
                  <span className="text-sm">Recent Activity Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-gray-300" />
                  <span className="text-sm">Device Management</span>
                </div>
              </div> */}
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">Two-Step Verification</h3>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              {twoFactorEnabled && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">
                      Two-factor authentication is active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Security Actions */}
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                View Security Activity
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Computer className="w-4 h-4 mr-2" />
                Manage Devices
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <KeyRound className="w-4 h-4 mr-2" />
                Change Recovery Options
              </Button>
            </div>
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
