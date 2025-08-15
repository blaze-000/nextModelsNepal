"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import Axios from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";

export default function NavSettingsPage() {
  const [showVoting, setShowVoting] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await Axios.get("/api/nav");
        if (response.data.success && response.data.data) {
          setShowVoting(Boolean(response.data.data.showVoting));
        } else {
          setShowVoting(false);
        }
      } catch (error) {
        toast.error("Failed to fetch voting state from database.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggle = () => {
    setShowVoting((prev) => !prev);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await Axios.post("/api/nav", { showVoting });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-xl mx-auto">
      <PageHeader
        title="Navbar Settings"
        description="Configure navbar options for your platform."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showVoting}
            onChange={handleToggle}
            className="w-5 h-5 accent-primary rounded"
            disabled={submitting || loading}
          />
          <span className="text-base font-medium">Show voting in navbar</span>
        </div>
        <div className="text-gray-500 text-sm mb-2">Don&apos;t forget to click save to save in Database.</div>
        <div>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
