"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { News, NewsFormData, Event } from "@/types/admin";

interface NewsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  editingNews: News | null;
  onSuccess: () => void;
}

const initialFormData: NewsFormData = {
  title: "",
  description: "",
  content: "",
  year: new Date().getFullYear().toString(),
  images: [],
  event: "",
};

export default function NewsPopup({
  isOpen,
  onClose,
  editingNews,
  onSuccess,
}: NewsPopupProps) {
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [events, setEvents] = useState<Event[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch events for the dropdown
  const fetchEvents = useCallback(() => {
    Axios.get("/api/events")
      .then((response) => {
        if (response.data.success && response.data.data) {
          setEvents(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen, fetchEvents]);

  // Set form data when editing
  useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title,
        description: editingNews.description,
        content: editingNews.content,
        year: editingNews.year,
        images: [],
        event: editingNews.event || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editingNews, isOpen]);

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

  const handleImageChange = useCallback((files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";

    if (!editingNews && formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const submitFormData = new FormData();

    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);
    submitFormData.append("content", formData.content);
    submitFormData.append("year", formData.year);
    if (formData.event) {
      submitFormData.append("event", formData.event);
    }

    formData.images.forEach((image) => {
      submitFormData.append("images", image);
    });

    const request = editingNews
      ? Axios.patch(`/api/news/${editingNews._id}`, submitFormData)
      : Axios.post("/api/news", submitFormData);

    request
      .then((response) => {
        if (response.data.success) {
          toast.success(
            `News article ${editingNews ? "updated" : "created"} successfully`
          );
          onSuccess();
          onClose();
        } else {
          toast.error(
            `Failed to ${editingNews ? "update" : "create"} news article`
          );
        }
      })
      .catch((error) => {
        console.error("Error submitting news:", error);
        toast.error(
          `Failed to ${editingNews ? "update" : "create"} news article`
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const eventOptions = events.map((event) => ({
    value: event._id,
    label: event.title,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingNews ? "Edit News Article" : "Create News Article"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter article title"
              error={errors.title}
              required
            />
          </div>
          <Input
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Enter year"
            error={errors.year}
            required
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter article description"
          error={errors.description}
          required
          rows={3}
        />

        <Textarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Enter full article content"
          error={errors.content}
          required
          rows={8}
        />

        <Select
          label="Related Event (Optional)"
          name="event"
          value={formData.event || ""}
          onChange={handleInputChange}
          options={eventOptions}
          placeholder="Select an event..."
        />

        <PhotoUpload
          label="Gallery Images"
          name="images"
          mode="multiple"
          maxFiles={10}
          onImageChange={handleImageChange}
          existingImages={editingNews?.images || []}
          error={errors.images}
          required={!editingNews}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <AdminButton
            variant="ghost"
            onClick={onClose}
            type="button"
            disabled={submitting}
          >
            Cancel
          </AdminButton>
          <AdminButton type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingNews ? "Update" : "Create"}{" "}
            Article
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
}
