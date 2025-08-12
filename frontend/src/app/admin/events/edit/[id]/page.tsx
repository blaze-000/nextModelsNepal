"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
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

interface Event {
  _id: string;
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

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/events/${eventId}`);

      if (response.data.success && response.data.data) {
        const eventData = response.data.data;
        setEvent(eventData);

        // Populate form data
        setFormData({
          name: eventData.name || "",
          overview: eventData.overview || "",
          titleImage: eventData.titleImage || "",
          coverImage: eventData.coverImage || "",
          subtitle: eventData.subtitle || "",
          quote: eventData.quote || "",
          purpose: eventData.purpose || "",
          purposeImage: eventData.purposeImage || "",
          timelineSubtitle: eventData.timelineSubtitle || "",
          managedBy: eventData.managedBy || "self",
        });
      } else {
        toast.error("Event not found");
        router.push("/admin/events");
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
      toast.error("Failed to fetch event details");
      router.push("/admin/events");
    } finally {
      setLoading(false);
    }
  };

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

    // Validate image URLs if they are provided
    const isValidUrl = (url: string) => {
      if (!url.trim()) return true; // Allow empty for optional update
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (formData.titleImage && !isValidUrl(formData.titleImage)) {
      newErrors.titleImage = "Please enter a valid image URL";
    }

    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = "Please enter a valid image URL";
    }

    if (formData.purposeImage && !isValidUrl(formData.purposeImage)) {
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
        // Only include image URLs if they are provided
        ...(formData.titleImage && { titleImage: formData.titleImage }),
        ...(formData.coverImage && { coverImage: formData.coverImage }),
        ...(formData.purposeImage && { purposeImage: formData.purposeImage }),
      };

      const response = await Axios.put(`/api/events/${eventId}`, eventData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Event updated successfully!");
        router.push("/admin/events");
      } else {
        throw new Error(response.data.message || "Failed to update event");
      }
    } catch (error: unknown) {
      console.error("Failed to update event:", error);
      let errorMessage = "Failed to update event";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Event not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Event: ${event.name}`}
        description="Update event details and information"
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
                placeholder={
                  event?.titleImage || "https://example.com/title-image.jpg"
                }
                error={errors.titleImage}
                type="url"
              />

              <Input
                label="Cover Image URL"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder={
                  event?.coverImage || "https://example.com/cover-image.jpg"
                }
                error={errors.coverImage}
                type="url"
              />
            </div>

            <Input
              label="Purpose Image URL"
              name="purposeImage"
              value={formData.purposeImage}
              onChange={handleInputChange}
              placeholder={
                event?.purposeImage || "https://example.com/purpose-image.jpg"
              }
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
                <li>• Leave empty to keep existing image</li>
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
                  Updating Event...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2"></i>
                  Update Event
                </>
              )}
            </AdminButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
