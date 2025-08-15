"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendJury {
  _id: string;
  seasonId: string;
  name: string;
  designation?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface JuryFormData {
  name: string;
  designation: string;
  image: File[];
}

interface JuryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  jury: BackendJury | null;
  seasonId: string;
  onSuccess: () => void;
}

const initialFormData: JuryFormData = {
  name: "",
  designation: "",
  image: [],
};

export default function JuryPopup({
  isOpen,
  onClose,
  jury,
  seasonId,
  onSuccess,
}: JuryPopupProps) {
  const [formData, setFormData] = useState<JuryFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(jury);

  // Reset form when modal opens/closes or jury changes
  useEffect(() => {
    if (isOpen) {
      if (jury) {
        setFormData({
          name: jury.name,
          designation: jury.designation || "",
          image: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, jury]);

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

    // For new jury members, image is required
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

      // Optional fields
      if (formData.designation.trim()) {
        formDataToSend.append("designation", formData.designation);
      }

      // Add image only if it is selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }

      const url = isEditing ? `/api/jury/${jury!._id}` : "/api/jury";
      const method = isEditing ? "patch" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Jury member ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${isEditing ? "update" : "create"} jury member`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} jury member:`,
        error
      );
      let errorMessage = `Failed to ${
        isEditing ? "update" : "create"
      } jury member`;
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
      title={isEditing ? "Edit Jury Member" : "Add New Jury Member"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Jury Member Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the jury member&apos;s details and information.
            </p>
          </div>

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter jury member name"
            required
            error={errors.name}
            disabled={submitting}
          />

          <Input
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="Enter designation (optional)"
            error={errors.designation}
            disabled={submitting}
          />
        </div>

        {/* Image */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Jury Member Image
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload an image for the jury member. Image is required for new
              jury members.
            </p>
          </div>

          <PhotoUpload
            label="Jury Member Image"
            name="image"
            onImageChange={(files: File[]) => handleImageChange("image", files)}
            selectedFiles={formData.image}
            existingImages={jury?.image ? [normalizeImagePath(jury.image)] : []}
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
              : `${isEditing ? "Update" : "Create"} Jury Member`}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
