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
  titleImage: File | null;
  coverImage: File | null;
  subtitle: string;
  quote: string;
  purpose: string;
  purposeImage: File | null;
  timelineSubtitle: string;
  managedBy: "self" | "partner";
}

const initialFormData: EventFormData = {
  name: "",
  overview: "",
  titleImage: null,
  coverImage: null,
  subtitle: "",
  quote: "",
  purpose: "",
  purposeImage: null,
  timelineSubtitle: "",
  managedBy: "self",
};

// File input component
const FileInput = ({
  label,
  name,
  onChange,
  error,
  required,
  fileName,
}: {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  fileName?: string;
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90
            cursor-pointer
          "
          accept="image/*"
          required={required}
        />
        {fileName && (
          <span className="text-sm text-gray-400 truncate max-w-[150px]">
            {fileName}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      // Clear error when user selects a file
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
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

    // Required image fields (check if a file is selected)
    if (!formData.titleImage) newErrors.titleImage = "Title image is required";
    if (!formData.coverImage) newErrors.coverImage = "Cover image is required";
    if (!formData.purposeImage) newErrors.purposeImage = "Purpose image is required";

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
      // Create FormData to send files
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("quote", formData.quote);
      formDataToSend.append("purpose", formData.purpose);
      formDataToSend.append("timelineSubtitle", formData.timelineSubtitle);
      formDataToSend.append("managedBy", formData.managedBy);

      if (formData.titleImage) {
        formDataToSend.append("titleImage", formData.titleImage);
      }
      if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
      }
      if (formData.purposeImage) {
        formDataToSend.append("purposeImage", formData.purposeImage);
      }

      const response = await Axios.post("/api/events", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
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
              <FileInput
                label="Title Image"
                name="titleImage"
                onChange={handleFileChange}
                required
                error={errors.titleImage}
                fileName={formData.titleImage?.name}
              />
              <FileInput
                label="Cover Image"
                name="coverImage"
                onChange={handleFileChange}
                required
                error={errors.coverImage}
                fileName={formData.coverImage?.name}
              />
            </div>
            <FileInput
              label="Purpose Image"
              name="purposeImage"
              onChange={handleFileChange}
              required
              error={errors.purposeImage}
              fileName={formData.purposeImage?.name}
            />
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                <i className="ri-information-line mr-2"></i>
                Image Upload Guidelines
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Supported formats: JPG, PNG, WebP</li>
                <li>• Recommended size: 1200x800px or larger</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Ensure images are high quality for best results</li>
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