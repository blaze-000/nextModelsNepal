"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import PhotoUpload from "@/components/admin/form/photo-upload";
import Axios from "@/lib/axios-instance";
import { Feedback, FeedbackItem, FeedbackFormData } from "@/types/admin";

const initialFormData: FeedbackFormData = {
  name: "",
  message: "",
  image: null,
};

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackItem | null>(null);
  const [formData, setFormData] = useState<FeedbackFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/feedback");
      const data = response.data;
      
      if (data.success && data.data) {

        const feedbackDocuments = data.data as Feedback;
        

        if (feedbackDocuments) {
          setFeedbackData(feedbackDocuments);
        } else {
          setFeedbackData(null);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch feedback data");
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Modal handlers
  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: FeedbackItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      message: item.message,
      image: null,
    });
    setErrors({});
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (item: FeedbackItem) => {
      if (
        !confirm(
          `Are you sure you want to delete feedback from "${item.name}"?`
        )
      )
        return;

      try {
        if (!feedbackData) return;

        // Remove the item from the feedback data
        const updatedItems = feedbackData.item.filter(
          (feedbackItem) => feedbackItem.index !== item.index
        );

        // Re-index the remaining items
        const reIndexedItems = updatedItems.map((feedbackItem, index) => ({
          ...feedbackItem,
          index: (index + 1).toString(),
        }));

        const submitData = new FormData();
        reIndexedItems.forEach((feedbackItem, index) => {
          submitData.append(`item[${index}][name]`, feedbackItem.name);
          submitData.append(`item[${index}][message]`, feedbackItem.message);
          if (feedbackItem.images) {
            submitData.append(`item[${index}][images]`, feedbackItem.images);
          }
        });

        const response = await Axios.patch(
          `/api/feedback/${feedbackData._id}`,
          submitData
        );
        const data = response.data;
        if (data.success) {
          toast.success("Feedback deleted successfully");
          fetchFeedback();
        } else {
          toast.error("Failed to delete feedback");
        }
      } catch (error) {
        toast.error("Failed to delete feedback");
        console.error("Error deleting feedback:", error);
      }
    },
    [feedbackData, fetchFeedback]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialFormData);
    setErrors({});
  }, []);

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
    (index: number, file: File | null) => {
      setFormData((prev) => ({ ...prev, image: file }));
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

    if (!editingItem && !formData.image) {
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
        if (editingItem) {
          // Update existing feedback item
          if (!feedbackData) return;

          const updatedItems = feedbackData.item.map((item) =>
            item.index === editingItem.index
              ? {
                  ...item,
                  name: formData.name,
                  message: formData.message,
                  // Keep existing image if no new image is uploaded
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
            if (item.index === editingItem.index && formData.image) {
              // Upload new image for this specific item
              submitFormData.append(`item[${index}][image]`, formData.image);
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
            closeModal();
            fetchFeedback();
          } else {
            toast.error("Failed to update feedback");
          }
        } else {
          // Always create a new feedback item (individual document)
          submitFormData.append(`item[0][index]`, "1");
          submitFormData.append(`item[0][name]`, formData.name);
          submitFormData.append(`item[0][message]`, formData.message);
          if (formData.image) {
            submitFormData.append(`item[0][image]`, formData.image);
          }

          const response = await Axios.post("/api/feedback", submitFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          const data = response.data;
          if (data.success) {
            toast.success("Feedback created successfully");
            closeModal();
            fetchFeedback();
          } else {
            toast.error("Failed to create feedback");
          }
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
    },
    [
      editingItem,
      formData,
      validateForm,
      closeModal,
      fetchFeedback,
      feedbackData,
    ]
  );

  // Table columns configuration
  const columns = [
    {
      key: "images",
      label: "Photo",
      render: (value: unknown) => (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
          {value && typeof value === "string" ? (
            <Image
              src={`http://localhost:8000/${String(value)}`}
              alt="Feedback"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <i className="ri-image-line text-xl" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base">{String(value)}</div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (value: unknown) => (
        <div className="text-xs sm:text-sm text-gray-300 truncate max-w-40 sm:max-w-xs">
          {String(value)}
        </div>
      ),
    },
    {
      key: "index",
      label: "Order",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded">
          #{String(value)}
        </span>
      ),
    },
  ];

  const feedbackItems = feedbackData?.item || [];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-6 lg:p-2">
      <PageHeader
        title="Feedback Management"
        description="Manage customer feedback and testimonials for your website"
      >
        <AdminButton onClick={handleCreate} className="w-full sm:w-auto">
          Add New Feedback
        </AdminButton>
      </PageHeader>

      {/* Feedback Table */}
      <div className="overflow-hidden">
        <DataTable
          data={feedbackItems}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No feedback found. Add your first feedback to get started."
          searchPlaceholder="Search feedback..."
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
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
              selectedFiles={formData.image ? [formData.image] : []}
              onImageChange={handleImageChange}
              error={errors.image}
              required={!editingItem}
              acceptedTypes={["image/*"]}
              maxFileSize={5}
            />

            {editingItem && editingItem.images && !formData.image && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400 mb-2">Current Image:</p>
                <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                  <Image
                    src={`http://localhost:8000/${editingItem.images}`}
                    alt={editingItem.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-700">
            <AdminButton
              variant="ghost"
              onClick={closeModal}
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
    </div>
  );
}
