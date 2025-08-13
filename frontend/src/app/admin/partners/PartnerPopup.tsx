"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Partner, PartnerFormData } from "@/types/admin";

interface PartnerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
  onSuccess: () => void;
}

const initialFormData: PartnerFormData = {
  sponserName: "",
  sponserImage: null,
};

export default function PartnerPopup({
  isOpen,
  onClose,
  partner,
  onSuccess,
}: PartnerPopupProps) {
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or partner changes
  useEffect(() => {
    if (isOpen && partner) {
      setFormData({
        sponserName: partner.sponserName,
        sponserImage: null,
      });
    } else if (isOpen && !partner) {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [isOpen, partner]);

  const handleImageChange = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      sponserImage: files[0] || null,
    }));
    if (errors.sponserImage) {
      setErrors((prev) => ({ ...prev, sponserImage: "" }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      sponserImage: null,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sponserName.trim()) {
      newErrors.sponserName = "Partner name is required";
    }

    // For new partners, image is required
    if (!partner && !formData.sponserImage) {
      newErrors.sponserImage = "Partner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const submitFormData = new FormData();

    submitFormData.append("sponserName", formData.sponserName);
    if (formData.sponserImage) {
      submitFormData.append("sponserImage", formData.sponserImage);
    }

    try {
      let response;
      if (partner) {
        response = await Axios.patch(
          `/api/partners/${partner._id}`,
          submitFormData
        );
      } else {
        response = await Axios.post("/api/partners", submitFormData);
      }

      const data = response.data;
      if (data.success) {
        toast.success(
          `Partner ${partner ? "updated" : "created"} successfully`
        );
        onSuccess();
        onClose();
      } else {
        toast.error(`Failed to ${partner ? "update" : "create"} partner`);
      }
    } catch (error) {
      let errorMessage = `Failed to ${partner ? "update" : "create"} partner`;
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={partner ? "Edit Partner" : "Add Partner"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Partner Name */}
          <Input
            label="Partner Name"
            name="sponserName"
            value={formData.sponserName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sponserName: e.target.value }))
            }
            placeholder="Enter partner/sponsor name"
            error={errors.sponserName}
            required
          />

          {/* Partner Image */}
          <div className="space-y-4">
            <PhotoUpload
              label="Partner Image"
              name="sponserImage"
              mode="single"
              onImageChange={handleImageChange}
              error={errors.sponserImage}
              selectedFiles={
                formData.sponserImage ? [formData.sponserImage] : []
              }
              existingImages={
                partner?.sponserImage
                  ? [normalizeImagePath(partner.sponserImage)]
                  : []
              }
              onRemoveExisting={handleRemoveImage}
              required={!partner}
              acceptedTypes={["image/*"]}
              maxFileSize={5}
            />
            {partner && (
              <p className="text-sm text-gray-400">
                Leave empty to keep current image
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-600">
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
              ? `${partner ? "Updating" : "Creating"}...`
              : `${partner ? "Update" : "Create"} Partner`}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
