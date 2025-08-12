"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";

import Axios from "@/lib/axios-instance";

interface EventFormData {
  name: string;
  overview: string;
  titleImage: string;
  coverImage: string;
  subtitle: string;
  quote: string;
  purpose: string;
  purposeImage: string;
  timelineSubtitle: string;
  managedBy: "self" | "partner";
}

const initialFormData: EventFormData = {
  name: "",
  overview: "",
  titleImage: "",
  coverImage: "",
  subtitle: "",
  quote: "",
  purpose: "",
  purposeImage: "",
  timelineSubtitle: "",
  managedBy: "self",
};

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required text fields
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";
    if (!formData.subtitle.trim()) newErrors.subtitle = "Subtitle is required";
    if (!formData.quote.trim()) newErrors.quote = "Quote is required";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.timelineSubtitle.trim())
      newErrors.timelineSubtitle = "Timeline subtitle is required";

    // Required image fields (check if they are valid URLs)
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!formData.titleImage.trim()) {
      newErrors.titleImage = "Title image URL is required";
    } else if (!isValidUrl(formData.titleImage)) {
      newErrors.titleImage = "Please enter a valid image URL";
    }

    if (!formData.coverImage.trim()) {
      newErrors.coverImage = "Cover image URL is required";
    } else if (!isValidUrl(formData.coverImage)) {
      newErrors.coverImage = "Please enter a valid image URL";
    }

    if (!formData.purposeImage.trim()) {
      newErrors.purposeImage = "Purpose image URL is required";
    } else if (!isValidUrl(formData.purposeImage)) {
      newErrors.purposeImage = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Send JSON data instead of FormData
      const eventData = {
        name: formData.name,
        overview: formData.overview,
        subtitle: formData.subtitle,
        quote: formData.quote,
        purpose: formData.purpose,
        timelineSubtitle: formData.timelineSubtitle,
        managedBy: formData.managedBy,
        titleImage: formData.titleImage,
        coverImage: formData.coverImage,
        purposeImage: formData.purposeImage,
      };

      const response = await Axios.post("/api/events", eventData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Event created successfully!");
        router.push("/admin/events");
      } else {
        throw new Error(response.data.message || "Failed to create event");
      }
    } catch (error: unknown) {
      console.error("Failed to create event:", error);
      let errorMessage = "Failed to create event";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const managedByOptions = [
    { value: "self", label: "Self Managed" },
    { value: "partner", label: "Partner Managed" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Event"
        description="Create a new event with all the necessary details"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-muted-background rounded-lg border border-gray-600 p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Basic Information */}
          <div className="space-y-4 lg:space-y-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-100 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <Input
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter event name"
                required
                error={errors.name}
              />

              <Select
                label="Managed By"
                name="managedBy"
                value={formData.managedBy}
                onChange={handleInputChange}
                options={managedByOptions}
                required
                error={errors.managedBy}
              />
            </div>

            <Input
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Enter event subtitle"
              required
              error={errors.subtitle}
            />

            <Textarea
              label="Overview"
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              placeholder="Enter detailed overview of the event"
              rows={4}
              required
              error={errors.overview}
            />

            <Textarea
              label="Quote"
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              placeholder="Enter an inspiring quote for the event"
              rows={3}
              required
              error={errors.quote}
            />
          </div>

          {/* Purpose Section */}
          <div className="space-y-4 lg:space-y-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-100 mb-4">
              Purpose & Timeline
            </h3>

            <Textarea
              label="Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="Describe the purpose and goals of this event"
              rows={4}
              required
              error={errors.purpose}
            />

            <Input
              label="Timeline Subtitle"
              name="timelineSubtitle"
              value={formData.timelineSubtitle}
              onChange={handleInputChange}
              placeholder="Enter timeline subtitle"
              required
              error={errors.timelineSubtitle}
            />
          </div>

          {/* Images Section */}
          <div className="space-y-4 lg:space-y-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-100 mb-4">
              Event Images
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <Input
                label="Title Image URL"
                name="titleImage"
                value={formData.titleImage}
                onChange={handleInputChange}
                placeholder="https://example.com/title-image.jpg"
                required
                error={errors.titleImage}
                type="url"
              />

              <Input
                label="Cover Image URL"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="https://example.com/cover-image.jpg"
                required
                error={errors.coverImage}
                type="url"
              />
            </div>

            <Input
              label="Purpose Image URL"
              name="purposeImage"
              value={formData.purposeImage}
              onChange={handleInputChange}
              placeholder="https://example.com/purpose-image.jpg"
              required
              error={errors.purposeImage}
              type="url"
            />

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                <i className="ri-information-line mr-2"></i>
                Image URL Guidelines
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>
                  • Use direct image URLs (ending in .jpg, .png, .webp, etc.)
                </li>
                <li>• Ensure images are publicly accessible</li>
                <li>• Recommended size: 1200x800px or larger</li>
                <li>
                  • You can upload images to services like Cloudinary, ImgBB, or
                  use your own hosting
                </li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-6 border-t border-gray-600">
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/events")}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>

            <AdminButton
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Creating Event...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2"></i>
                  Create Event
                </>
              )}
            </AdminButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
