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
import IconUpload from "@/components/admin/form/icon-upload";

import { apiClient } from "@/lib/api";
import { CompanyModel, ModelFormData } from "@/types/admin";

const initialFormData: ModelFormData = {
  name: "",
  intro: "",
  address: "",
  gender: "",
  coverImage: null,
  images: [],
};

export default function ModelsPage() {
  const [models, setModels] = useState<CompanyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CompanyModel | null>(null);
  const [formData, setFormData] = useState<ModelFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<CompanyModel>("/models");
      if (response.success && response.data) {
        setModels(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch models");
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingModel(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (model: CompanyModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      intro: model.intro,
      address: model.address,
      gender: model.gender,
      coverImage: null,
      images: [],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (model: CompanyModel) => {
    if (!confirm("Are you sure you want to delete this model?")) return;

    try {
      const response = await apiClient.delete("/models", model._id);
      if (response.success) {
        toast.success("Model deleted successfully");
        fetchModels();
      } else {
        toast.error("Failed to delete model");
      }
    } catch (error) {
      toast.error("Failed to delete model");
      console.error("Error deleting model:", error);
    }
  };

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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, coverImage: file }));
    if (errors.coverImage) {
      setErrors((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.intro.trim()) newErrors.intro = "Introduction is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";

    if (!editingModel && !formData.coverImage) {
      newErrors.coverImage = "Cover image is required";
    }
    if (!editingModel && formData.images.length === 0) {
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

    submitFormData.append("name", formData.name);
    submitFormData.append("intro", formData.intro);
    submitFormData.append("address", formData.address);
    submitFormData.append("gender", formData.gender);

    if (formData.coverImage) {
      submitFormData.append("coverImage", formData.coverImage);
    }

    formData.images.forEach((image) => {
      submitFormData.append("images", image);
    });

    try {
      const response = editingModel
        ? await apiClient.update("/models", editingModel._id, submitFormData)
        : await apiClient.create("/models", submitFormData);

      if (response.success) {
        toast.success(
          `Model ${editingModel ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        fetchModels();
      } else {
        toast.error(`Failed to ${editingModel ? "update" : "create"} model`);
      }
    } catch (error) {
      toast.error(`Failed to ${editingModel ? "update" : "create"} model`);
      console.error("Error submitting model:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium">{String(value)}</div>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
      render: (value: unknown) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === "Male"
              ? "bg-blue-500/20 text-blue-400"
              : value === "Female"
              ? "bg-pink-500/20 text-pink-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {String(value)}
        </span>
      ),
    },
    {
      key: "address",
      label: "Address",
      sortable: true,
    },
    {
      key: "intro",
      label: "Introduction",
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
        title="Models"
        description="Manage company models and their profiles"
      >
        <AdminButton onClick={handleCreate} icon="ri-add-line">
          Add Model
        </AdminButton>
      </PageHeader>

      <DataTable
        data={models}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No models found. Add your first model to get started."
        searchPlaceholder="Search models..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingModel ? "Edit Model" : "Add Model"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter model name"
              error={errors.name}
              required
            />

            <div className="w-full">
              <label className="block mb-4 md:mb-2 text-sm md:text-base font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-muted-background text-gray-100 px-6 md:px-6 py-4 md:py-6 outline-none rounded"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            error={errors.address}
            required
          />

          <Textarea
            label="Introduction"
            name="intro"
            value={formData.intro}
            onChange={handleInputChange}
            placeholder="Enter model introduction"
            error={errors.intro}
            required
            rows={4}
          />

          <IconUpload
            label="Cover Image"
            name="coverImage"
            onChange={handleCoverImageChange}
            selectedFile={formData.coverImage || undefined}
            onRemoveFile={handleRemoveCoverImage}
            error={errors.coverImage}
            required={!editingModel}
            maxFileSize={5}
          />

          <PhotoUpload
            label="Gallery Images"
            name="images"
            onChange={handlePhotosChange}
            selectedFiles={formData.images}
            onRemoveFile={handleRemovePhoto}
            error={errors.images}
            required={!editingModel}
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
              {editingModel ? "Update" : "Create"} Model
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
