"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";


import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendEligibilityCriteria {
  _id: string;
  seasonId: string;
  label: string;
  value: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

interface EligibilityCriteriaFormData {
  label: string;
  value: string;
  icon: File[];
}

interface EligibilityCriteriaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: BackendEligibilityCriteria | null;
  seasonId: string;
  onSuccess: () => void;
}

const initialFormData: EligibilityCriteriaFormData = {
  label: "",
  value: "",
  icon: [],
};

export default function EligibilityCriteriaPopup({
  isOpen,
  onClose,
  criteria,
  seasonId,
  onSuccess,
}: EligibilityCriteriaPopupProps) {
  const [formData, setFormData] = useState<EligibilityCriteriaFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(criteria);

  // Reset form when modal opens/closes or criteria changes
  useEffect(() => {
    if (isOpen) {
      if (criteria) {
        setFormData({
          label: criteria.label,
          value: criteria.value,
          icon: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, criteria]);

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    if (!formData.label.trim()) {
      newErrors.label = "Label is required";
    }
    if (!formData.value.trim()) {
      newErrors.value = "Value is required";
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
      formDataToSend.append("label", formData.label);
      formDataToSend.append("value", formData.value);

      // Add icon only if it's selected
      if (formData.icon.length > 0) {
        formDataToSend.append("icon", formData.icon[0]);
      }

      const url = isEditing ? `/api/criteria/${criteria!._id}` : "/api/criteria";
      const method = isEditing ? "put" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Eligibility criteria ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
          `Failed to ${isEditing ? "update" : "create"} eligibility criteria`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} eligibility criteria:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} eligibility criteria`;
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
      title={isEditing ? "Edit Eligibility Criteria" : "Add Eligibility Criteria"}
      size="md"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="e.g., Age, Height, Weight"
              required
              error={errors.label}
              disabled={submitting}
            />

            <Input
              label="Value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="e.g., 19-34, 5'5&quot; and above"
              required
              error={errors.value}
              disabled={submitting}
            />

            <PhotoUpload
              label="Icon (SVG)"
              name="icon"
              onImageChange={(files: File[]) => handleImageChange("icon", files)}
              selectedFiles={formData.icon}
              existingImages={
                criteria?.icon ? [normalizeImagePath(criteria.icon)] : []
              }
              error={errors.icon}
              mode="single"
              maxFiles={1}
              maxFileSize={2}
              acceptedTypes={["image/svg+xml", "image/*"]}
              disabled={submitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <Button
              variant="ghost"
              onClick={handleClose}
              type="button"
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting
                ? `${isEditing ? "Updating" : "Creating"}...`
                : `${isEditing ? "Update" : "Create"} Criteria`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
