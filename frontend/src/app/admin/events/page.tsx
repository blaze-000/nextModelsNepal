"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";

import Axios from "@/lib/axios-instance";
import { Event } from "@/types/admin";
import { AdminButton } from "@/components/admin/AdminButton";

// Simplified event interface for the form
interface SimpleEventFormData {
  title: string;
  overview: string;
  tag?: string;
  date?: string;
  purpose?: string;
  eventDescription?: string;
  coverImage: File | null;
  titleImage: File | null;
  subImage: File | null;
  logo: File | null;
}

const initialFormData: SimpleEventFormData = {
  title: "",
  overview: "",
  tag: "",
  date: "",
  purpose: "",
  eventDescription: "",
  coverImage: null,
  titleImage: null,
  subImage: null,
  logo: null,
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [formData, setFormData] =
    useState<SimpleEventFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/events");
      const data = response.data;
      if (data.success && data.data) {
        setEvents(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      overview: event.overview,
      tag: event.tag || "",
      date: event.date ? event.date.split("T")[0] : "",
      purpose: event.purpose || "",
      eventDescription: event.eventDescription || "",
      coverImage: null,
      titleImage: null,
      subImage: null,
      logo: null,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleView = (event: Event) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (event: Event) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await Axios.delete(`/api/events/${event._id}`);
      const data = response.data;
      if (data.success) {
        toast.success("Event deleted successfully");
        fetchEvents();
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: SimpleEventFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof SimpleEventFormData
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev: SimpleEventFormData) => ({
      ...prev,
      [fieldName]: file,
    }));
    if (errors[fieldName]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";

    if (!editingEvent) {
      if (!formData.coverImage)
        newErrors.coverImage = "Cover image is required";
      if (!formData.titleImage)
        newErrors.titleImage = "Title image is required";
      if (!formData.subImage) newErrors.subImage = "Sub image is required";
      if (!formData.logo) newErrors.logo = "Logo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const submitFormData = new FormData();

    submitFormData.append("title", formData.title);
    submitFormData.append("overview", formData.overview);

    if (formData.tag) submitFormData.append("tag", formData.tag);
    if (formData.date) submitFormData.append("date", formData.date);
    if (formData.purpose) submitFormData.append("purpose", formData.purpose);
    if (formData.eventDescription)
      submitFormData.append("eventDescription", formData.eventDescription);

    if (formData.coverImage)
      submitFormData.append("coverImage", formData.coverImage);
    if (formData.titleImage)
      submitFormData.append("titleImage", formData.titleImage);
    if (formData.subImage) submitFormData.append("subImage", formData.subImage);
    if (formData.logo) submitFormData.append("logo", formData.logo);

    try {
      let response;
      if (editingEvent) {
        // Update existing event
        response = await Axios.patch(
          `/api/events/${editingEvent._id}`,
          submitFormData
        );
      } else {
        // Create new event
        response = await Axios.post("/api/events", submitFormData);
      }

      const data = response.data;
      if (data.success) {
        toast.success(
          `Event ${editingEvent ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        fetchEvents();
      } else {
        toast.error(`Failed to ${editingEvent ? "update" : "create"} event`);
      }
    } catch (error) {
      toast.error(`Failed to ${editingEvent ? "update" : "create"} event`);
      console.error("Error submitting event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium max-w-xs truncate">{String(value)}</div>
      ),
    },
    {
      key: "tag",
      label: "Tag",
      render: (value: unknown) => (
        <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded">
          {String(value) || "No tag"}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      width: "120px",
      render: (value: unknown) => (
        <span className="px-2 py-1 text-xs bg-gold-500/20 text-gold-400 rounded">
          {formatDate(String(value))}
        </span>
      ),
    },
    {
      key: "overview",
      label: "Overview",
      render: (value: unknown) => (
        <div className="max-w-sm truncate text-gray-400">{String(value)}</div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Manage events and competitions">
        <AdminButton onClick={handleCreate}>Add Event</AdminButton>
      </PageHeader>

      <DataTable
        data={events}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No events found. Create your first event to get started."
        searchPlaceholder="Search events..."
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Create Event"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              error={errors.title}
              required
            />
            <Input
              label="Tag"
              name="tag"
              value={formData.tag || ""}
              onChange={handleInputChange}
              placeholder="Enter event tag"
              error={errors.tag}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date || ""}
              onChange={handleInputChange}
              error={errors.date}
            />
            <Input
              label="Purpose"
              name="purpose"
              value={formData.purpose || ""}
              onChange={handleInputChange}
              placeholder="Enter event purpose"
              error={errors.purpose}
            />
          </div>

          <Textarea
            label="Overview"
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            placeholder="Enter event overview"
            error={errors.overview}
            required
            rows={3}
          />

          <Textarea
            label="Event Description"
            name="eventDescription"
            value={formData.eventDescription || ""}
            onChange={handleInputChange}
            placeholder="Enter detailed event description"
            error={errors.eventDescription}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image {!editingEvent && "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "coverImage")}
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
              />
              {errors.coverImage && (
                <p className="text-red-400 text-sm mt-1">{errors.coverImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title Image {!editingEvent && "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "titleImage")}
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
              />
              {errors.titleImage && (
                <p className="text-red-400 text-sm mt-1">{errors.titleImage}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sub Image {!editingEvent && "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "subImage")}
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
              />
              {errors.subImage && (
                <p className="text-red-400 text-sm mt-1">{errors.subImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo {!editingEvent && "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logo")}
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
              />
              {errors.logo && (
                <p className="text-red-400 text-sm mt-1">{errors.logo}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            <AdminButton
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={submitting}>
              {submitting ? "Saving..." : editingEvent ? "Update" : "Create"}{" "}
              Event
            </AdminButton>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View Event"
        size="xl"
      >
        {viewingEvent && (
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {viewingEvent.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  {viewingEvent.date && (
                    <span>Date: {formatDate(viewingEvent.date)}</span>
                  )}
                  {viewingEvent.tag && (
                    <>
                      <span>•</span>
                      <span>Tag: {viewingEvent.tag}</span>
                    </>
                  )}
                  {viewingEvent.purpose && (
                    <>
                      <span>•</span>
                      <span>Purpose: {viewingEvent.purpose}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-300 mb-2">Overview</h4>
              <p className="text-gray-400 leading-relaxed">
                {viewingEvent.overview}
              </p>
            </div>

            {viewingEvent.eventDescription && (
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Description</h4>
                <p className="text-gray-400 leading-relaxed">
                  {viewingEvent.eventDescription}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-300 mb-3">Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {viewingEvent.coverImage && (
                  <div className="space-y-2">
                    <div className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                      <Image
                        src={`http://localhost:8000/${viewingEvent.coverImage}`}
                        alt="Cover Image"
                        className="w-full h-full object-cover"
                        width={150}
                        height={150}
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">Cover</p>
                  </div>
                )}
                {viewingEvent.titleImage && (
                  <div className="space-y-2">
                    <div className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                      <Image
                        src={`http://localhost:8000/${viewingEvent.titleImage}`}
                        alt="Title Image"
                        className="w-full h-full object-cover"
                        width={150}
                        height={150}
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">Title</p>
                  </div>
                )}
                {viewingEvent.subImage && (
                  <div className="space-y-2">
                    <div className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                      <Image
                        src={`http://localhost:8000/${viewingEvent.subImage}`}
                        alt="Sub Image"
                        className="w-full h-full object-cover"
                        width={150}
                        height={150}
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">Sub</p>
                  </div>
                )}
                {viewingEvent.logo && (
                  <div className="space-y-2">
                    <div className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                      <Image
                        src={`http://localhost:8000/${viewingEvent.logo}`}
                        alt="Logo"
                        className="w-full h-full object-cover"
                        width={150}
                        height={150}
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-center">Logo</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-600">
              <AdminButton
                variant="ghost"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
