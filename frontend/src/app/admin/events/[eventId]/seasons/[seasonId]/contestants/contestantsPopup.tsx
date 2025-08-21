"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendContestant {
  _id: string;
  seasonId: string;
  name: string;
  intro: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  status: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface ContestantFormData {
  name: string;
  intro: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  status: string;
  image: File[];
}

interface ContestantPopupProps {
  isOpen: boolean;
  onClose: () => void;
  contestant: BackendContestant | null;
  seasonId: string;
  onSuccess: () => void;
}

const initialFormData: ContestantFormData = {
  name: "",
  intro: "",
  gender: "Male",
  address: "",
  status: "Not Eliminated",
  image: [],
};

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const statusOptions = [
  { value: "Eliminated", label: "Eliminated" },
  { value: "Not Eliminated", label: "Not Eliminated" },
];

export default function ContestantPopup({
  isOpen,
  onClose,
  contestant,
  seasonId,
  onSuccess,
}: ContestantPopupProps) {
  const [formData, setFormData] = useState<ContestantFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(contestant);

  // Reset form when modal opens/closes or contestant changes
  useEffect(() => {
    if (isOpen) {
      if (contestant) {
        setFormData({
          name: contestant.name,
          intro: contestant.intro,
          gender: contestant.gender,
          address: contestant.address,
          status: contestant.status,
          image: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, contestant]);

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
    if (!formData.intro.trim()) {
      newErrors.intro = "Introduction is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // For new contestants, image is required
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
      formDataToSend.append("intro", formData.intro);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("status", formData.status);

      // Add image only if it is selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }

      const url = isEditing
        ? `/api/contestants/${contestant!._id}`
        : "/api/contestants";
      const method = isEditing ? "put" : "post";

      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Contestant ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
          `Failed to ${isEditing ? "update" : "create"} contestant`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} contestant:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"
        } contestant`;
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
      title={isEditing ? "Edit Contestant" : "Add New Contestant"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-100">
              Contestant Information
            </h3>
            <Select
              label="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              required
              error={errors.status}
              disabled={submitting}
            />
            <p className="text-sm text-gray-400">
              Enter the contestant&apos;s details and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter contestant name"
              required
              error={errors.name}
              disabled={submitting}
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genderOptions}
              required
              error={errors.gender}
              disabled={submitting}
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            required
            error={errors.address}
            disabled={submitting}
          />

          <Textarea
            label="Introduction"
            name="intro"
            value={formData.intro}
            onChange={handleInputChange}
            placeholder="Enter contestant introduction"
            rows={4}
            required
            error={errors.intro}
            disabled={submitting}
          />
        </div>

        {/* Image */}
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-100">
              Contestant Image
            </h3>
            <p className="text-sm text-gray-400">
              Upload an image for the contestant. Image is required for new
              contestants.
            </p>
          </div>

          <PhotoUpload
            label="Contestant Image"
            name="image"
            onImageChange={(files: File[]) => handleImageChange("image", files)}
            selectedFiles={formData.image}
            existingImages={
              contestant?.image ? [normalizeImagePath(contestant.image)] : []
            }
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
              : `${isEditing ? "Update" : "Create"} Contestant`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
