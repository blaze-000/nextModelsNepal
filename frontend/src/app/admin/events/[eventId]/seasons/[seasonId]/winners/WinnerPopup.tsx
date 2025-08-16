"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendWinner {
  _id: string;
  seasonId: string;
  rank: string;
  name: string;
  slug?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface WinnerFormData {
  rank: string;
  name: string;
  slug: string;
  image: File[];
}

interface WinnerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  winner: BackendWinner | null;
  seasonId: string;
  onSuccess: () => void;
}

const initialFormData: WinnerFormData = {
  rank: "",
  name: "",
  slug: "",
  image: [],
};

export default function WinnerPopup({
  isOpen,
  onClose,
  winner,
  seasonId,
  onSuccess,
}: WinnerPopupProps) {
  const [formData, setFormData] = useState<WinnerFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(winner);

  // Reset form when modal opens/closes or winner changes
  useEffect(() => {
    if (isOpen) {
      if (winner) {
        setFormData({
          rank: winner.rank,
          name: winner.name,
          slug: winner.slug || "",
          image: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, winner]);

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

    if (!formData.rank.trim()) {
      newErrors.rank = "Rank is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // For new winners, image is required
    if (!isEditing && formData.image.length === 0) {
      newErrors.image = "Image is required";
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
      formDataToSend.append("seasonId", seasonId);
      formDataToSend.append("rank", formData.rank);
      formDataToSend.append("name", formData.name);

      // Optional fields
      if (formData.slug.trim()) {
        formDataToSend.append("slug", formData.slug);
      }

      // Add image only if it is selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }

      const url = isEditing ? `/api/winners/${winner!._id}` : "/api/winners";
      const method = isEditing ? "put" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Winner ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${isEditing ? "update" : "create"} winner`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} winner:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} winner`;
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
      title={isEditing ? "Edit Winner" : "Add New Winner"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Winner Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the winner&apos;s details and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Rank"
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              placeholder="e.g., 1st, 2nd, Winner, Runner-up"
              required
              error={errors.rank}
              disabled={submitting}
            />
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter winner name"
              required
              error={errors.name}
              disabled={submitting}
            />
          </div>

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="URL-friendly identifier (optional)"
            error={errors.slug}
            disabled={submitting}
          />
          <p className="text-sm text-gray-400 -mt-2">
            URL-friendly identifier for the winner (optional)
          </p>
        </div>

        {/* Image */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Winner Image
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload an image for the winner. Image is required for new winners.
            </p>
          </div>

          <PhotoUpload
            label="Winner Image"
            name="image"
            onImageChange={(files: File[]) => handleImageChange("image", files)}
            selectedFiles={formData.image}
            existingImages={
              winner?.image ? [normalizeImagePath(winner.image)] : []
            }
            error={errors.image}
            required={!isEditing}
            mode="single"
            maxFiles={1}
            maxFileSize={5}
            acceptedTypes={["image/*"]}
            disabled={submitting}
          />

          {isEditing && (
            <p className="text-sm text-gray-400">
              Leave image field empty to keep current image
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
              : `${isEditing ? "Update" : "Create"} Winner`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
