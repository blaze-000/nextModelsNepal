"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
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
  link: "",
  type: "Feature",
  year: new Date().getFullYear().toString(),
  image: null,
  event: "",
};

export default function NewsPopup({
  isOpen,
  onClose,
  editingNews,
  onSuccess,
}: NewsPopupProps) {
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
      // Handle event field - could be string (ID) or object (populated)
      let eventValue = "";
      if (editingNews.event) {
        if (typeof editingNews.event === 'string') {
          eventValue = editingNews.event;
        } else if (typeof editingNews.event === 'object' && editingNews.event !== null && '_id' in editingNews.event) {
          eventValue = (editingNews.event as { _id: string })._id;
        }
      }

      setFormData({
        title: editingNews.title || "",
        description: editingNews.description || "",
        link: editingNews.link || "",
        type: editingNews.type || "Feature",
        year: editingNews.year || new Date().getFullYear().toString(),
        image: null,
        event: eventValue,
      });
      setSelectedFiles([]); // Reset selected files when editing
    } else {
      setFormData(initialFormData);
      setSelectedFiles([]); // Reset selected files for new news
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
    setSelectedFiles(files);
    setFormData((prev) => ({
      ...prev,
      image: files[0] || null,
    }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.link.trim()) newErrors.link = "Link is required";
    if (!formData.year.trim()) newErrors.year = "Year is required";

    // Validate URL format
    try {
      new URL(formData.link);
    } catch {
      newErrors.link = "Please enter a valid URL";
    }

    // Check if we have either a new image or an existing image
    if (!formData.image && !editingNews?.image) {
      newErrors.image = "An image is required";
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
    submitFormData.append("link", formData.link);
    submitFormData.append("type", formData.type);
    submitFormData.append("year", formData.year);
    if (formData.event) {
      submitFormData.append("event", formData.event);
    }

    // Only append image if we have a new file
    if (formData.image) {
      submitFormData.append("image", formData.image);
    }

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
    label: event.name,
  }));

  const typeOptions = [
    { value: "Interview", label: "Interview" },
    { value: "Feature", label: "Feature" },
    { value: "Announcement", label: "Announcement" },
  ];

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

        <Input
          label="Link"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          placeholder="Enter article URL"
          error={errors.link}
          required
        />

        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          options={typeOptions}
          placeholder="Select article type..."
          required
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
          label="Article Image"
          name="image"
          mode="single"
          maxFiles={1}
          selectedFiles={selectedFiles}
          onImageChange={handleImageChange}
          existingImages={editingNews?.image ? [editingNews.image] : []}
          error={errors.image}
          required={true}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}>
            {submitting ? "Saving..." : editingNews ? "Update" : "Create"}{" "}
            Article
          </Button>
        </div>
      </form>
    </Modal>
  );
}
