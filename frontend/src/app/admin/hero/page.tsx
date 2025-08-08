"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import AdminButton from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import PhotoUpload from "@/components/admin/form/photo-upload";

import { apiClient } from "@/lib/api";
import { Hero, HeroFormData } from "@/types/admin";

const initialFormData: HeroFormData = {
  maintitle: "",
  subtitle: "",
  description: "",
  images: [],
};

export default function HeroSectionPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [formData, setFormData] = useState<HeroFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch heroes on component mount
  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Hero>("/hero");
      if (response.success && response.data) {
        setHeroes(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch hero sections");
      console.error("Error fetching heroes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingHero(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero);
    setFormData({
      maintitle: hero.maintitle,
      subtitle: hero.subtitle,
      description: hero.description,
      images: [],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (hero: Hero) => {
    if (!confirm("Are you sure you want to delete this hero section?")) return;

    try {
      const response = await apiClient.delete("/hero", hero._id);
      if (response.success) {
        toast.success("Hero section deleted successfully");
        fetchHeroes();
      } else {
        toast.error("Failed to delete hero section");
      }
    } catch (error) {
      toast.error("Failed to delete hero section");
      console.error("Error deleting hero:", error);
    }
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maintitle.trim()) {
      newErrors.maintitle = "Main title is required";
    }
    if (!formData.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!editingHero && formData.images.length === 0) {
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

    submitFormData.append("maintitle", formData.maintitle);
    submitFormData.append("subtitle", formData.subtitle);
    submitFormData.append("description", formData.description);

    formData.images.forEach((image) => {
      submitFormData.append("images", image);
    });

    try {
      const response = editingHero
        ? await apiClient.update("/hero", editingHero._id, submitFormData)
        : await apiClient.create("/hero", submitFormData);

      if (response.success) {
        toast.success(
          `Hero section ${editingHero ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        fetchHeroes();
      } else {
        toast.error(
          `Failed to ${editingHero ? "update" : "create"} hero section`
        );
      }
    } catch (error) {
      toast.error(
        `Failed to ${editingHero ? "update" : "create"} hero section`
      );
      console.error("Error submitting hero:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "maintitle",
      label: "Main Title",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium">{String(value)}</div>
      ),
    },
    {
      key: "subtitle",
      label: "Subtitle",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      render: (value: unknown) => (
        <div className="max-w-xs truncate">{String(value)}</div>
      ),
    },
    {
      key: "images",
      label: "Images",
      render: (value: unknown) => {
        const images = value as string[];
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded">
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
        title="Hero Section"
        description="Manage hero sections displayed on the homepage"
      >
        <AdminButton onClick={handleCreate} icon="ri-add-line">
          Add Hero Section
        </AdminButton>
      </PageHeader>

      <DataTable
        data={heroes}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No hero sections found. Create your first hero section to get started."
        searchPlaceholder="Search hero sections..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHero ? "Edit Hero Section" : "Create Hero Section"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Main Title"
            name="maintitle"
            value={formData.maintitle}
            onChange={handleInputChange}
            placeholder="Enter main title"
            error={errors.maintitle}
            required
          />

          <Input
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="Enter subtitle"
            error={errors.subtitle}
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description"
            error={errors.description}
            required
            rows={4}
          />

          <PhotoUpload
            label="Images"
            name="images"
            onChange={handlePhotoChange}
            selectedFiles={formData.images}
            onRemoveFile={handleRemovePhoto}
            error={errors.images}
            required={!editingHero}
            maxFiles={5}
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
              {editingHero ? "Update" : "Create"} Hero Section
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
