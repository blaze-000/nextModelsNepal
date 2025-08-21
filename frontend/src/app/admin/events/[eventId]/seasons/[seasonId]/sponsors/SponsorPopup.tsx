"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import Input from "@/components/admin/form/input";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface BackendSponsor {
  _id: string;
  seasonId: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface SponsorFormData {
  name: string;
  image: File[];
}

interface SponsorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  sponsor: BackendSponsor | null;
  seasonId: string;
  onSuccess: () => void;
}

const initialFormData: SponsorFormData = {
  name: "",
  image: [],
};

export default function SponsorPopup({
  isOpen,
  onClose,
  sponsor,
  seasonId,
  onSuccess,
}: SponsorPopupProps) {
  const [formData, setFormData] = useState<SponsorFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(sponsor);

  // Reset form when modal opens/closes or sponsor changes
  useEffect(() => {
    if (isOpen) {
      if (sponsor) {
        setFormData({
          name: sponsor.name,
          image: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, sponsor]);

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
      newErrors.name = "Name is required";
    }

    // For new sponsors, image is required
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
      formDataToSend.append("name", formData.name);

      // Add image only if it is selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }

      const url = isEditing ? `/api/sponsors/${sponsor!._id}` : "/api/sponsors";
      const method = isEditing ? "patch" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Sponsor ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
          `Failed to ${isEditing ? "update" : "create"} sponsor`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} sponsor:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"
        } sponsor`;
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
      title={isEditing ? "Edit Sponsor" : "Add New Sponsor"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-100">
              Sponsor Information
            </h3>
            <p className="text-sm text-gray-400">
              Enter the sponsor&apos;s details and information.
            </p>
          </div>

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter sponsor name"
            required
            error={errors.name}
            disabled={submitting}
          />
        </div>

        {/* Image */}
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-100">
              Sponsor Logo
            </h3>
            <p className="text-sm text-gray-400">
              Upload a logo for the sponsor. Logo is required for new sponsors.
            </p>
          </div>

          <PhotoUpload
            label="Sponsor Logo"
            name="image"
            onImageChange={(files: File[]) => handleImageChange("image", files)}
            selectedFiles={formData.image}
            existingImages={sponsor?.image ? [normalizeImagePath(sponsor.image)] : []}
            error={errors.image}
            required={!isEditing}
            mode="single"
            maxFiles={1}
            maxFileSize={5}
            acceptedTypes={["image/*"]}
            disabled={submitting}
          />
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
              : `${isEditing ? "Update" : "Create"} Sponsor`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
