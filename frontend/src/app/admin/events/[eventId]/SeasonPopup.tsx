"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendSeason {
  _id: string;
  eventId: string;
  year: number;
  image: string;
  status: "upcoming" | "ongoing" | "ended";
  startDate?: string;
  auditionFormDeadline?: string;
  votingOpened?: boolean;
  votingEndDate?: string;
  endDate: string;
  slug: string;
  pricePerVote: number;
  titleImage?: string;
  posterImage?: string;
  gallery?: string[];
  notice?: string[];
  timeline?: Array<{
    label: string;
    datespan: string;
    icon: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SeasonFormData {
  year: number;
  status: "upcoming" | "ongoing" | "ended";
  startDate: string;
  auditionFormDeadline: string;
  votingOpened: boolean;
  votingEndDate: string;
  endDate: string;
  slug: string;
  pricePerVote: number;
  notice: string;
  image: File[];
  titleImage: File[];
  posterImage: File[];
}

interface SeasonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  season: BackendSeason | null;
  eventId: string;
  onSuccess: () => void;
}

const initialFormData: SeasonFormData = {
  year: new Date().getFullYear(),
  status: "upcoming",
  startDate: "",
  auditionFormDeadline: "",
  votingOpened: false,
  votingEndDate: "",
  endDate: "",
  slug: "",
  pricePerVote: 0,
  notice: "",
  image: [],
  titleImage: [],
  posterImage: [],
};

const statusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "ended", label: "Ended" },
];

export default function SeasonPopup({
  isOpen,
  onClose,
  season,
  eventId,
  onSuccess,
}: SeasonPopupProps) {
  const [formData, setFormData] = useState<SeasonFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(season);

  // Reset form when modal opens/closes or season changes
  useEffect(() => {
    if (isOpen) {
      if (season) {
        setFormData({
          year: season.year,
          status: season.status,
          startDate: season.startDate ? season.startDate.split("T")[0] : "",
          auditionFormDeadline: season.auditionFormDeadline
            ? season.auditionFormDeadline.split("T")[0]
            : "",
          votingOpened: season.votingOpened || false,
          votingEndDate: season.votingEndDate
            ? season.votingEndDate.split("T")[0]
            : "",
          endDate: season.endDate ? season.endDate.split("T")[0] : "",
          slug: season.slug,
          pricePerVote: season.pricePerVote,
          notice: season.notice ? season.notice.join("\n") : "",
          image: [],
          titleImage: [],
          posterImage: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, season]);

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
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
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

    if (formData.year < 1900 || formData.year > 2100) {
      newErrors.year = "Year must be between 1900 and 2100";
    }
    if (!formData.endDate.trim()) {
      newErrors.endDate = "End date is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    if (formData.pricePerVote < 0) {
      newErrors.pricePerVote = "Price per vote must be positive";
    }

    // For new seasons, main image is required
    if (!isEditing && formData.image.length === 0) {
      newErrors.image = "Main image is required";
    }

    // Date validations
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.auditionFormDeadline && formData.startDate) {
      const auditionDeadline = new Date(formData.auditionFormDeadline);
      const startDate = new Date(formData.startDate);
      if (auditionDeadline >= startDate) {
        newErrors.auditionFormDeadline =
          "Audition deadline must be before start date";
      }
    }

    if (formData.votingEndDate && formData.endDate) {
      const votingEndDate = new Date(formData.votingEndDate);
      const endDate = new Date(formData.endDate);
      if (votingEndDate > endDate) {
        newErrors.votingEndDate =
          "Voting end date must be before or equal to season end date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData to send files
      const formDataToSend = new FormData();
      formDataToSend.append("eventId", eventId);
      formDataToSend.append("year", formData.year.toString());
      formDataToSend.append("status", formData.status);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("pricePerVote", formData.pricePerVote.toString());
      formDataToSend.append("votingOpened", formData.votingOpened.toString());

      // Optional fields
      if (formData.startDate) {
        formDataToSend.append("startDate", formData.startDate);
      }
      if (formData.auditionFormDeadline) {
        formDataToSend.append(
          "auditionFormDeadline",
          formData.auditionFormDeadline
        );
      }
      if (formData.votingEndDate) {
        formDataToSend.append("votingEndDate", formData.votingEndDate);
      }

      // Parse notice into array
      if (formData.notice.trim()) {
        const noticeArray = formData.notice.split("\n").filter((n) => n.trim());
        formDataToSend.append("notice", JSON.stringify(noticeArray));
      }

      // Add images only if they are selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }
      if (formData.titleImage.length > 0) {
        formDataToSend.append("titleImage", formData.titleImage[0]);
      }
      if (formData.posterImage.length > 0) {
        formDataToSend.append("posterImage", formData.posterImage[0]);
      }

      const url = isEditing ? `/api/season/${season!._id}` : "/api/season";
      const method = isEditing ? "patch" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Season ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${isEditing ? "update" : "create"} season`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} season:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} season`;
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
      title={isEditing ? "Edit Season" : "Add New Season"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the season&apos;s basic details and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Year"
              name="year"
              type="number"
              value={formData.year.toString()}
              onChange={handleInputChange}
              placeholder="2024"
              required
              error={errors.year}
              disabled={submitting}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              required
              error={errors.status}
              disabled={submitting}
            />
            <Input
              label="Price Per Vote"
              name="pricePerVote"
              type="number"
              value={formData.pricePerVote.toString()}
              onChange={handleInputChange}
              placeholder="0"
              required
              error={errors.pricePerVote}
              disabled={submitting}
            />
          </div>

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="season-2024"
            required
            error={errors.slug}
            disabled={submitting}
          />
          <p className="text-sm text-gray-400 -mt-2">
            URL-friendly identifier for the season
          </p>
        </div>

        {/* Date Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Date Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set important dates for the season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              error={errors.startDate}
              disabled={submitting}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              error={errors.endDate}
              disabled={submitting}
            />
            <Input
              label="Audition Form Deadline"
              name="auditionFormDeadline"
              type="date"
              value={formData.auditionFormDeadline}
              onChange={handleInputChange}
              error={errors.auditionFormDeadline}
              disabled={submitting}
            />
            <Input
              label="Voting End Date"
              name="votingEndDate"
              type="date"
              value={formData.votingEndDate}
              onChange={handleInputChange}
              error={errors.votingEndDate}
              disabled={submitting}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="votingOpened"
              name="votingOpened"
              checked={formData.votingOpened}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-4 h-4 text-gold-500 bg-gray-700 border-gray-600 rounded focus:ring-gold-500 focus:ring-2"
            />
            <label htmlFor="votingOpened" className="text-sm text-gray-300">
              Voting is currently opened
            </label>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Additional Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add notices and other details for the season.
            </p>
          </div>

          <Textarea
            label="Notice"
            name="notice"
            value={formData.notice}
            onChange={handleInputChange}
            placeholder="Enter notices for this season (one per line)"
            rows={3}
            error={errors.notice}
            disabled={submitting}
          />
          <p className="text-sm text-gray-400 -mt-2">
            Enter each notice on a new line
          </p>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Season Images
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload images for your season. Main image is required for new
              seasons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PhotoUpload
              label="Main Image"
              name="image"
              onImageChange={(files: File[]) =>
                handleImageChange("image", files)
              }
              selectedFiles={formData.image}
              existingImages={
                season?.image ? [normalizeImagePath(season.image)] : []
              }
              error={errors.image}
              required={!isEditing}
              mode="single"
              maxFiles={1}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
              disabled={submitting}
            />

            <PhotoUpload
              label="Title Image"
              name="titleImage"
              onImageChange={(files: File[]) =>
                handleImageChange("titleImage", files)
              }
              selectedFiles={formData.titleImage}
              existingImages={
                season?.titleImage
                  ? [normalizeImagePath(season.titleImage)]
                  : []
              }
              error={errors.titleImage}
              mode="single"
              maxFiles={1}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
              disabled={submitting}
            />

            <PhotoUpload
              label="Poster Image"
              name="posterImage"
              onImageChange={(files: File[]) =>
                handleImageChange("posterImage", files)
              }
              selectedFiles={formData.posterImage}
              existingImages={
                season?.posterImage
                  ? [normalizeImagePath(season.posterImage)]
                  : []
              }
              error={errors.posterImage}
              mode="single"
              maxFiles={1}
              maxFileSize={5}
              acceptedTypes={["image/*"]}
              disabled={submitting}
            />
          </div>

          {isEditing && (
            <p className="text-sm text-gray-400">
              Leave image fields empty to keep current images
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <AdminButton
            variant="ghost"
            onClick={handleClose}
            type="button"
            disabled={submitting}
            className="order-2 sm:order-1"
          >
            Cancel
          </AdminButton>
          <AdminButton
            type="submit"
            disabled={submitting}
            className="order-1 sm:order-2"
          >
            {submitting
              ? `${isEditing ? "Updating" : "Creating"}...`
              : `${isEditing ? "Update" : "Create"} Season`}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
