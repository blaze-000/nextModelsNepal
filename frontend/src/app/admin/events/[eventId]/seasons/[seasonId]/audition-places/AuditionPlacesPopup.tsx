"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";

import Axios from "@/lib/axios-instance";

export interface BackendAuditionPlace {
  _id: string;
  seasonId: string;
  place: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface AuditionPlaceFormData {
  place: string;
  date: string;
}

interface AuditionPlacesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  auditionPlace: BackendAuditionPlace | null;
  seasonId: string;
  onSuccess: () => void;
}

const initialFormData: AuditionPlaceFormData = {
  place: "",
  date: "",
};

export default function AuditionPlacesPopup({
  isOpen,
  onClose,
  auditionPlace,
  seasonId,
  onSuccess,
}: AuditionPlacesPopupProps) {
  const [formData, setFormData] = useState<AuditionPlaceFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(auditionPlace);

  // Reset form when modal opens/closes or audition place changes
  useEffect(() => {
    if (isOpen) {
      if (auditionPlace) {
        setFormData({
          place: auditionPlace.place,
          date: auditionPlace.date ? auditionPlace.date.split("T")[0] : "",
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, auditionPlace]);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.place.trim()) {
      newErrors.place = "Place is required";
    }
    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
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
      const requestData = {
        seasonId,
        place: formData.place,
        date: formData.date,
      };

      const url = isEditing ? `/api/auditions/${auditionPlace!._id}` : "/api/auditions";
      const method = isEditing ? "put" : "post";

      const response = await Axios[method](url, requestData);

      if (response.data.success) {
        toast.success(
          `Audition place ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
          `Failed to ${isEditing ? "update" : "create"} audition place`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} audition place:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} audition place`;
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
      title={isEditing ? "Edit Audition Place" : "Add Audition Place"}
      size="md"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Place"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder="e.g., Kathmandu, Pokhara"
              required
              error={errors.place}
              disabled={submitting}
            />

            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              error={errors.date}
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
                : `${isEditing ? "Update" : "Create"} Audition Place`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
