"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import AdminButton from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import PhotoUpload from "@/components/admin/form/photo-upload";

import { apiClient } from "@/lib/api";
import { News, NewsFormData } from "@/types/admin";

const initialFormData: NewsFormData = {
  title: "",
  description: "",
  content: "",
  year: new Date().getFullYear().toString(),
  images: [],
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [viewingNews, setViewingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<News>("/news");
      if (response.success && response.data) {
        setNews(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch news");
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
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

    try {
      const response = await apiClient.delete("/news", newsItem._id);
      if (response.success) {
        toast.success("News article deleted successfully");
        fetchNews();
      } else {
        toast.error("Failed to delete news article");
      }
    } catch (error) {
      toast.error("Failed to delete news article");
      console.error("Error deleting news:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    formData.images.forEach((image: File) => {
      submitFormData.append("images", image);
    });

    try {
      const response = editingNews
        ? await apiClient.update("/news", editingNews._id, submitFormData)
        : await apiClient.create("/news", submitFormData);

      if (response.success) {
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
      key: "description",
      label: "Description",
      render: (value: unknown) => (
        <div className="max-w-sm truncate text-gray-400">{String(value)}</div>
      ),
    },
    {
      key: "year",
      label: "Year",
      sortable: true,
      width: "100px",
      render: (value: unknown) => (
        <span className="px-2 py-1 text-xs bg-gold-500/20 text-gold-400 rounded">
          {String(value)}
        </span>
      ),
    },
    {
      key: "images",
      label: "Images",
      render: (value: unknown) => {
        const images = value as string[];
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
              {images?.length || 0} images
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="News"
        description="Manage news articles and press coverage"
      >
        <AdminButton onClick={handleCreate} icon="ri-add-line">
          Add News Article
        </AdminButton>
      </PageHeader>

      <DataTable
        data={news}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No news articles found. Create your first news article to get started."
        searchPlaceholder="Search news articles..."
      />

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
            <AdminButton type="submit" loading={submitting}>
              {editingNews ? "Update" : "Create"} Article
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
