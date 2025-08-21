"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendEvent {
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
  seasons?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface EventFormData {
  name: string;
  overview: string;
  subtitle: string;
  quote: string;
  purpose: string;
  timelineSubtitle: string;
  managedBy: "self" | "partner";
  titleImage: File[];
  coverImage: File[];
  purposeImage: File[];
}

interface EventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  event: BackendEvent | null;
  onSuccess: () => void;
}

const initialFormData: EventFormData = {
  name: "",
  overview: "",
  subtitle: "",
  quote: "",
  purpose: "",
  timelineSubtitle: "",
  managedBy: "self",
  titleImage: [],
  coverImage: [],
  purposeImage: [],
};

const managedByOptions = [
  { value: "self", label: "Self Managed" },
  { value: "partner", label: "Partner Managed" },
];

export default function EventPopup({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventPopupProps) {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(event);

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({
          name: event.name,
          overview: event.overview,
          subtitle: event.subtitle,
          quote: event.quote,
          purpose: event.purpose,
          timelineSubtitle: event.timelineSubtitle,
          managedBy: event.managedBy,
          titleImage: [],
          coverImage: [],
          purposeImage: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, event]);

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (name: string, files: File[]) => {
    setFormData((prev) => ({ ...prev, [name]: files }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }
    if (!formData.overview.trim()) {
      newErrors.overview = "Overview is required";
    }
    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    }
    if (!formData.quote.trim()) {
      newErrors.quote = "Quote is required";
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }
    if (!formData.timelineSubtitle.trim()) {
      newErrors.timelineSubtitle = "Timeline subtitle is required";
    }

    // For new events, images are required
    if (!isEditing) {
      if (formData.titleImage.length === 0) {
        newErrors.titleImage = "Title image is required";
      }
      if (formData.coverImage.length === 0) {
        newErrors.coverImage = "Cover image is required";
      }
      if (formData.purposeImage.length === 0) {
        newErrors.purposeImage = "Purpose image is required";
      }
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
      // Create FormData to send files
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("quote", formData.quote);
      formDataToSend.append("purpose", formData.purpose);
      formDataToSend.append("timelineSubtitle", formData.timelineSubtitle);
      formDataToSend.append("managedBy", formData.managedBy);

      // Add images only if they are selected
      if (formData.titleImage.length > 0) {
        formDataToSend.append("titleImage", formData.titleImage[0]);
      }
      if (formData.coverImage.length > 0) {
        formDataToSend.append("coverImage", formData.coverImage[0]);
      }
      if (formData.purposeImage.length > 0) {
        formDataToSend.append("purposeImage", formData.purposeImage[0]);
      }

      const url = isEditing ? `/api/events/${event!._id}` : "/api/events";
      const method = isEditing ? "patch" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Event ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${isEditing ? "update" : "create"} event`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} event:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} event`;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Event" : "Add New Event"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-100">
              Basic Information
            </h3>
            <p className="text-sm text-gray-400">
              Enter the event&apos;s basic details and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter event name"
              required
              error={errors.name}
              disabled={submitting}
            />
            <Select
              label="Managed By"
              name="managedBy"
              value={formData.managedBy}
              onChange={handleInputChange}
              options={managedByOptions}
              required
              error={errors.managedBy}
              disabled={submitting}
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
            disabled={submitting}
          />

          <Textarea
            label="Overview"
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            placeholder="Enter detailed overview of the event"
            rows={3}
            required
            error={errors.overview}
            disabled={submitting}
          />

          <Textarea
            label="Quote"
            name="quote"
            value={formData.quote}
            onChange={handleInputChange}
            placeholder="Enter an inspiring quote for the event"
            rows={2}
            required
            error={errors.quote}
            disabled={submitting}
          />

          <Textarea
            label="Purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="Describe the purpose of the event"
            rows={3}
            required
            error={errors.purpose}
            disabled={submitting}
          />

          <Input
            label="Timeline Subtitle"
            name="timelineSubtitle"
            value={formData.timelineSubtitle}
            onChange={handleInputChange}
            placeholder="Enter timeline subtitle"
            required
            error={errors.timelineSubtitle}
            disabled={submitting}
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-100">
              Event Images
            </h3>
            <p className="text-sm text-gray-400">
              Upload images for your event. All images are required for new
              events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PhotoUpload
              label="Title Image"
              name="titleImage"
              onImageChange={(files: File[]) =>
                handleImageChange("titleImage", files)
              }
              selectedFiles={formData.titleImage}
              existingImages={
                event?.titleImage ? [normalizeImagePath(event.titleImage)] : []
              }
              error={errors.titleImage}
              required={!isEditing}
              mode="single"
              maxFiles={1}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
              disabled={submitting}
            />

            <PhotoUpload
              label="Cover Image"
              name="coverImage"
              onImageChange={(files: File[]) =>
                handleImageChange("coverImage", files)
              }
              selectedFiles={formData.coverImage}
              existingImages={
                event?.coverImage ? [normalizeImagePath(event.coverImage)] : []
              }
              error={errors.coverImage}
              required={!isEditing}
              mode="single"
              maxFiles={1}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
              disabled={submitting}
            />

            <PhotoUpload
              label="Purpose Image"
              name="purposeImage"
              onImageChange={(files: File[]) =>
                handleImageChange("purposeImage", files)
              }
              selectedFiles={formData.purposeImage}
              existingImages={
                event?.purposeImage
                  ? [normalizeImagePath(event.purposeImage)]
                  : []
              }
              error={errors.purposeImage}
              required={!isEditing}
              mode="single"
              maxFiles={1}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
              disabled={submitting}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-700">
          <Button
            variant="ghost"
            onClick={handleClose}
            type="button"
            disabled={submitting}
            className="order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="order-1 sm:order-2"
          >
            {submitting
              ? `${isEditing ? "Updating" : "Creating"}...`
              : `${isEditing ? "Update" : "Create"} Event`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
