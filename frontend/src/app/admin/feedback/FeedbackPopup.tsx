"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import PhotoUpload from "@/components/admin/form/photo-upload";
import Axios from "@/lib/axios-instance";
import { FeedbackItem, Feedback } from "@/types/admin";

interface FeedbackFormData {
  name: string;
  message: string;
  image: File[];
}

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: FeedbackItem | null;
  feedbackData: Feedback | null;
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
  feedbackData,
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

  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  }, [onClose]);

  // Form handlers
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleImageChange = useCallback(
    (files: File[]) => {
      setFormData((prev) => ({ ...prev, image: files }));
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    },
    [errors]
  );

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (!editingItem && formData.image.length === 0) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editingItem, formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setSubmitting(true);
      const submitFormData = new FormData();

      try {
        if (editingItem && feedbackData) {
          // Update existing feedback item
          const updatedItems = feedbackData.item.map((item) =>
            item.index === editingItem.index
              ? {
                  ...item,
                  name: formData.name,
                  message: formData.message,
                }
              : item
          );

          updatedItems.forEach((item, index) => {
            submitFormData.append(
              `item[${index}][index]`,
              (index + 1).toString()
            );
            submitFormData.append(`item[${index}][name]`, item.name);
            submitFormData.append(`item[${index}][message]`, item.message);
            if (item.index === editingItem.index && formData.image.length > 0) {
              // Upload new image for this specific item
              submitFormData.append(`item[${index}][image]`, formData.image[0]);
            } else if (item.images) {
              // Keep existing image path
              submitFormData.append(`item[${index}][images]`, item.images);
            }
          });

          const response = await Axios.patch(
            `/api/feedback/${feedbackData._id}`,
            submitFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const data = response.data;
          if (data.success) {
            toast.success("Feedback updated successfully");
          } else {
            toast.error("Failed to update feedback");
          }
        } else {
          // Create new feedback item
          submitFormData.append(`item[0][index]`, "1");
          submitFormData.append(`item[0][name]`, formData.name);
          submitFormData.append(`item[0][message]`, formData.message);
          if (formData.image.length > 0) {
            submitFormData.append(`item[0][image]`, formData.image[0]);
          }

          const response = await Axios.post("/api/feedback", submitFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          const data = response.data;
          if (data.success) {
            toast.success("Feedback created successfully");
          } else {
            toast.error("Failed to create feedback");
          }
        }

        handleClose();
        onSuccess();
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
    },
    [editingItem, feedbackData, formData, validateForm, handleClose, onSuccess]
  );

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
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter customer name"
            error={errors.name}
            required
          />

          <Textarea
            label="Message"
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
            label="Feedback Image"
            name="image"
            mode="single"
            selectedFiles={formData.image}
            onImageChange={handleImageChange}
            error={errors.image}
            required={!editingItem}
            acceptedTypes={["image/*"]}
            maxFileSize={5}
            existingImages={
              editingItem && editingItem.images && formData.image.length === 0
                ? [`http://localhost:8000/${editingItem.images}`]
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
