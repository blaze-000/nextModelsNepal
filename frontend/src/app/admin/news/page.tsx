"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { News, NewsFormData, Event } from "@/types/admin";
import { Button } from "@/components/ui/button";

const initialFormData: NewsFormData = {
  title: "",
  description: "",
  content: "",
  year: new Date().getFullYear().toString(),
  images: [],
  event: "",
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [viewingNews, setViewingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/news");
      const data = response.data;
      if (data.success && data.data) {
        setNews(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch news");
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await Axios.get("/api/events");
      const data = response.data;
      if (data.success && data.data) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreate = () => {
    setEditingNews(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content,
      year: newsItem.year,
      images: [],
      event: newsItem.event || "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleView = (newsItem: News) => {
    setViewingNews(newsItem);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (newsItem: News) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    setIsDeleting(newsItem._id);
    try {
      const response = await Axios.delete(`/api/news/${newsItem._id}`);
      const data = response.data;
      if (data.success) {
        toast.success("News article deleted successfully");
        fetchNews();
      } else {
        toast.error("Failed to delete news article");
      }
    } catch (error) {
      toast.error("Failed to delete news article");
      console.error("Error deleting news:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: NewsFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev: NewsFormData) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    if (errors.images) {
      setErrors((prev: Record<string, string>) => ({ ...prev, images: "" }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev: NewsFormData) => ({
      ...prev,
      images: prev.images.filter((_: File, i: number) => i !== index),
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    formData.images.forEach((image: File) => {
      submitFormData.append("images", image);
    });

    try {
      let response;
      if (editingNews) {
        // Update existing news
        response = await Axios.patch(
          `/api/news/${editingNews._id}`,
          submitFormData
        );
      } else {
        // Create new news
        response = await Axios.post("/api/news", submitFormData);
      }

      const data = response.data;
      if (data.success) {
        toast.success(
          `News article ${editingNews ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        fetchNews();
      } else {
        toast.error(
          `Failed to ${editingNews ? "update" : "create"} news article`
        );
      }
    } catch (error) {
      toast.error(
        `Failed to ${editingNews ? "update" : "create"} news article`
      );
      console.error("Error submitting news:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const eventOptions = events.map((event) => ({
    value: event._id,
    label: event.title,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="News"
          description="Manage news articles and press coverage"
        />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="News"
        description="Manage news articles and press coverage"
      >
        <Button variant="default" onClick={handleCreate}>
          Add News Article
        </Button>
      </PageHeader>

      {news.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No news articles found. Create your first news article to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((newsItem) => {
            const linkedEvent = events.find(
              (event) => event._id === newsItem.event
            );

            return (
              <div
                key={newsItem._id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gold-500/50 transition-all duration-200 group"
              >
                {/* Image */}
                {newsItem.images && newsItem.images.length > 0 && (
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={`http://localhost:8000/${newsItem.images[0]}`}
                      alt={newsItem.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-100 text-lg line-clamp-2 leading-tight group-hover:text-gold-400 transition-colors">
                    {newsItem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {newsItem.description}
                  </p>

                  {/* Year and Event */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <i className="ri-calendar-line text-xs" />
                      <span>{newsItem.year}</span>
                    </div>
                    {linkedEvent && (
                      <div className="flex items-center gap-1 bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full">
                        <i className="ri-external-link-line text-xs" />
                        <span className="truncate max-w-20">
                          {linkedEvent.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Length */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 pt-1">
                    <i className="ri-file-text-line text-xs" />
                    <span>{newsItem.content.length} characters</span>
                    {newsItem.images && newsItem.images.length > 1 && (
                      <>
                        <span>•</span>
                        <span>{newsItem.images.length} images</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handleView(newsItem)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      <i className="ri-eye-line text-xs" />
                      <span>View</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded transition-colors"
                        title="Edit news"
                      >
                        <i className="ri-pencil-line text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem)}
                        disabled={isDeleting === newsItem._id}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                        title="Delete news"
                      >
                        {isDeleting === newsItem._id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-b border-red-400"></div>
                        ) : (
                          <i className="ri-delete-bin-line text-sm" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            label="Images"
            name="images"
            onChange={handlePhotoChange}
            selectedFiles={formData.images}
            onRemoveFile={handleRemovePhoto}
            error={errors.images}
            required={!editingNews}
            maxFiles={10}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            <AdminButton
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              type="button"
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

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View News Article"
        size="xl"
      >
        {viewingNews && (
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {viewingNews.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Year: {viewingNews.year}</span>
                  <span>•</span>
                  <span>{viewingNews.images?.length || 0} images</span>
                  {viewingNews.event && (
                    <>
                      <span>•</span>
                      <span className="text-gold-400">
                        Event:{" "}
                        {events.find((e) => e._id === viewingNews.event)
                          ?.title || "Unknown"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-300 mb-2">Description</h4>
              <p className="text-gray-400 leading-relaxed">
                {viewingNews.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-300 mb-2">Content</h4>
              <div className="text-gray-400 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {viewingNews.content}
              </div>
            </div>

            {viewingNews.images && viewingNews.images.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {viewingNews.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden"
                    >
                      <Image
                        src={`http://localhost:8000/${image}`}
                        alt={`News image ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={200}
                        height={200}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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
