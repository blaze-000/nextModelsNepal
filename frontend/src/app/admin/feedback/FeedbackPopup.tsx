"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import PhotoUpload from "@/components/admin/form/photo-upload";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { FeedbackItem, FeedbackFormData } from "@/types/admin";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: FeedbackItem | null;
  onSuccess: () => void;
}

const initialFormData: FeedbackFormData = {
  name: "",
  message: "",
  image: [],
};

export default function FeedbackPopup({
  isOpen,
  onClose,
  editingItem,
  onSuccess,
}: FeedbackPopupProps) {
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          name: editingItem.name,
          message: editingItem.message,
          image: [],
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, editingItem]);

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  // Form handlers
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

  const handleImageChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, image: files }));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    // Image is required for new feedback, optional for existing (unless they want to change it)
    if (!editingItem && formData.image.length === 0) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    setSubmitting(true);
    const submitFormData = new FormData();

    // Add basic form data
    submitFormData.append("name", formData.name);
    submitFormData.append("message", formData.message);

    // Add image if provided
    if (formData.image.length > 0) {
      submitFormData.append("image", formData.image[0]);
    }

    try {
      let response;
      if (editingItem) {
        // Add index for updating
        submitFormData.append("index", editingItem.index.toString());
        response = await Axios.patch(
          `/api/feedback/${editingItem._id}`,
          submitFormData
        );
      } else {
        // For new feedback, use next available index
        submitFormData.append("index", "1"); // Backend will handle proper indexing
        response = await Axios.post("/api/feedback", submitFormData);
      }

      const data = response.data;
      if (data.success) {
        toast.success(
          `Feedback ${editingItem ? "updated" : "created"} successfully`
        );
        handleClose();
        onSuccess();
      } else {
        toast.error(`Failed to ${editingItem ? "update" : "create"} feedback`);
      }
    } catch (error: unknown) {
      console.error("Error submitting feedback:", error);
      const isAxiosError =
        error && typeof error === "object" && "response" in error;
      const errorMessage = isAxiosError
        ? (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message
        : undefined;
      toast.error(
        errorMessage ||
          `Failed to ${editingItem ? "update" : "create"} feedback`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingItem ? "Edit Feedback" : "Add New Feedback"}
      size="lg"
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 space-y-4 sm:space-y-6"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gold-400 border-b border-gray-700 pb-2">
            Feedback Information
          </h3>

          <Input
            label="Customer Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter customer name"
            error={errors.name}
            required
          />

          <Textarea
            label="Feedback Message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter feedback message..."
            error={errors.message}
            required
            rows={4}
          />

          {/* Image Upload */}
          <PhotoUpload
            label="Customer Photo"
            name="image"
            mode="single"
            selectedFiles={formData.image}
            onImageChange={handleImageChange}
            error={errors.image}
            required={!editingItem}
            acceptedTypes={["image/*"]}
            maxFileSize={5}
            existingImages={
              editingItem && editingItem.image && formData.image.length === 0
                ? [normalizeImagePath(editingItem.image)]
                : []
            }
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-700">
          <AdminButton
            variant="ghost"
            onClick={handleClose}
            type="button"
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
              ? editingItem
                ? "Updating..."
                : "Adding..."
              : editingItem
              ? "Update Feedback"
              : "Add Feedback"}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
