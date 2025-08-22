"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import type React from "react";
import Axios from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Spinner } from "@geist-ui/react";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword === oldPassword) {
      toast.error("Old password cannot be same as new password");
      return;
    }

    try {
      setIsSubmitting(true);
      await Axios.patch("/api/auth/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    }

    catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data;

        if (data?.errors) {
          const messages = Object.values(data.errors).flat().join("\n");
          toast.error(messages);
        } else {
          toast.error(data?.message || "Failed to change password");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
    finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background2 text-foreground/80 p-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-primary mb-6 font-newsreader">
          Change Password
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Old Password */}
          <div>
            <label className="block mb-1 font-medium">Old Password</label>
            <div className="relative">
              <i className="ri-lock-password-line absolute left-3 top-3" />
              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? (
                  <i className="ri-eye-off-line" />
                ) : (
                  <i className="ri-eye-line" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <div className="relative">
              <i className="ri-key-2-line absolute left-3 top-3" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <i className="ri-eye-off-line" />
                ) : (
                  <i className="ri-eye-line" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <i className="ri-shield-keyhole-line absolute left-3 top-3" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <i className="ri-eye-off-line" />
                ) : (
                  <i className="ri-eye-line" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            variant="default"
            type="submit"
            disabled={isSubmitting}
          >
            {
              isSubmitting
              &&
              <Spinner />
            }
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
