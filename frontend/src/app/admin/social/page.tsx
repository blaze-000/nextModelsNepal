"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";
import PageHeader from "@/components/admin/PageHeader";
import Axios from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";

interface SocialData {
  _id?: string;
  instagram: string;
  x: string;
  fb: string;
  linkdln: string;
  phone: string[];
  mail: string;
  location: string;
}

const initialState: SocialData = {
  instagram: "https://www.instagram.com/",
  x: "https://x.com/",
  fb: "https://www.facebook.com/",
  linkdln: "https://www.linkedin.com/",
  phone: [],
  mail: "",
  location: "",
};

export default function SocialAdminPage() {
  const [data, setData] = useState<SocialData>(initialState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await Axios.get("/api/social");
        if (
          res.data?.success &&
          Array.isArray(res.data.social) &&
          res.data.social.length > 0
        ) {
          const s = res.data.social[0];
          setData({
            _id: s._id,
            instagram: s.instagram || initialState.instagram,
            x: s.x || initialState.x,
            fb: s.fb || initialState.fb,
            linkdln: s.linkdln || initialState.linkdln,
            phone: s.phone || initialState.phone,
            mail: s.mail || initialState.mail,
            location: s.location || initialState.location,
          });
        }
      } catch (err) {
        console.error("Failed to fetch social data", err);
        toast.error("Failed to load social settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (k: keyof SocialData, v: string) => {
    setData((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      if (data._id) {
        const res = await Axios.patch(`/api/social/${data._id}`, data);
        if (res.data.success) {
          toast.success("Social settings updated");
        } else {
          toast.error("Failed to update social settings");
        }
      } else {
        const res = await Axios.post(`/api/social`, data);
        if (res.data.success) {
          toast.success("Social settings created");
          // set returned id if available
          if (res.data.data?._id)
            setData((d) => ({ ...d, _id: res.data.data._id }));
        } else {
          toast.error("Failed to save social settings");
        }
      }
    } catch (err) {
      console.error("Save error", err);
      toast.error("Failed to save social settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <PageHeader
        title="Social Settings"
        description="Manage social links and contact info for the site footer."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-muted-background rounded border border-gray-700 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-foreground/70">Instagram URL</span>
            <input
              value={data.instagram}
              onChange={(e) => handleChange("instagram", e.target.value)}
              className="mt-1 rounded px-3 py-2 bg-background2 border border-gray-600"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-foreground/70">X (Twitter) URL</span>
            <input
              value={data.x}
              onChange={(e) => handleChange("x", e.target.value)}
              className="mt-1 rounded px-3 py-2 bg-background2 border border-gray-600"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-foreground/70">Facebook URL</span>
            <input
              value={data.fb}
              onChange={(e) => handleChange("fb", e.target.value)}
              className="mt-1 rounded px-3 py-2 bg-background2 border border-gray-600"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-foreground/70">LinkedIn URL</span>
            <input
              value={data.linkdln}
              onChange={(e) => handleChange("linkdln", e.target.value)}
              className="mt-1 rounded px-3 py-2 bg-background2 border border-gray-600"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-foreground/70">Phone Numbers</span>
            {data.phone.map((p, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <input
                  value={p}
                  onChange={(e) => {
                    const newPhones = [...data.phone];
                    newPhones[i] = e.target.value;
                    setData((prev) => ({ ...prev, phone: newPhones }));
                  }}
                  className="flex-1 rounded px-3 py-2 bg-background2 border border-gray-600"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setData((prev) => ({
                      ...prev,
                      phone: prev.phone.filter((_, idx) => idx !== i),
                    }));
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={() =>
                setData((prev) => ({ ...prev, phone: [...prev.phone, ""] }))
              }
            >
              + Add Phone
            </Button>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-foreground/70">Email</span>
            <input
              value={data.mail}
              onChange={(e) => handleChange("mail", e.target.value)}
              className="mt-1 rounded px-3 py-2 bg-background2 border border-gray-600"
            />
          </label>

          <label className="md:col-span-2 flex flex-col">
            <span className="text-sm text-foreground/70">Location</span>
            <input
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="mt-1 rounded px-3 py-2 bg-background2 border border-gray-600"
            />
          </label>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={submitting || loading}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
