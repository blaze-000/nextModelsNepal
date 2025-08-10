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

import { apiClient } from "@/lib/api";
import { CompanyModel, ModelFormData } from "@/types/admin";

// Types
type GenderFilter = "all" | "male" | "female";

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
  const [filteredModels, setFilteredModels] = useState<CompanyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CompanyModel | null>(null);
  const [formData, setFormData] = useState<ModelFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch all models
  const fetchModels = useCallback(async () => {
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
  }, []);

  // Filter models based on gender and search
  const filterModels = useCallback(() => {
    let filtered = models;

    // Filter by gender
    if (genderFilter !== "all") {
      filtered = filtered.filter(
        (model) => model.gender.toLowerCase() === genderFilter
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.address.toLowerCase().includes(query) ||
          model.intro.toLowerCase().includes(query)
      );
    }

    setFilteredModels(filtered);
  }, [models, genderFilter, searchQuery]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    filterModels();
  }, [filterModels]);

  // Modal handlers
  const handleCreate = useCallback(() => {
    setEditingModel(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((model: CompanyModel) => {
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
  }, []);

  const handleDelete = useCallback(
    async (model: CompanyModel) => {
      if (!confirm(`Are you sure you want to delete "${model.name}"?`)) return;

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
    },
    [fetchModels]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingModel(null);
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

  const handleCoverImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({ ...prev, coverImage: file }));
      if (errors.coverImage) {
        setErrors((prev) => ({ ...prev, coverImage: "" }));
      }
    },
    [errors]
  );

  const handleImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    },
    [errors]
  );

  const removeImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const removeCoverImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, coverImage: null }));
  }, []);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.intro.trim()) newErrors.intro = "Introduction is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";

    if (!editingModel && !formData.coverImage) {
      newErrors.coverImage = "Cover image is required";
    }
    if (!editingModel && formData.images.length === 0) {
      newErrors.images = "At least one additional image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editingModel, formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
          closeModal();
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
    },
    [editingModel, formData, validateForm, closeModal, fetchModels]
  );

  // Calculate statistics
  const totalModels = models.length;
  const maleModels = models.filter(
    (model) => model.gender.toLowerCase() === "male"
  ).length;
  const femaleModels = models.filter(
    (model) => model.gender.toLowerCase() === "female"
  ).length;

  // Table columns configuration
  const columns = [
    {
      key: "coverImage",
      label: "Photo",
      render: (value: unknown) => (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
          <Image
            src={`http://localhost:8000/${String(value)}`}
            alt="Model"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            unoptimized
          />
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
      render: (value: unknown) => (
        <div className="text-xs sm:text-sm text-gray-400 truncate max-w-32 sm:max-w-none">
          {String(value)}
        </div>
      ),
    },
    {
      key: "intro",
      label: "Introduction",
      render: (value: unknown) => (
        <div className="text-xs sm:text-sm text-gray-300 truncate max-w-40 sm:max-w-xs">
          {String(value)}
        </div>
      ),
    },
    {
      key: "images",
      label: "Images",
      render: (value: unknown) => {
        const images = value as string[];
        return (
          <div className="flex items-center">
            <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded">
              {images?.length || 0}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Models Management"
        description="Manage your model portfolio with easy access to add, view, and organize models"
      >
        <AdminButton onClick={handleCreate} className="w-full sm:w-auto">
          Add New Model
        </AdminButton>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Models</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {loading ? "..." : totalModels}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Male Models</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-400">
                {loading ? "..." : maleModels}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Female Models</p>
              <p className="text-xl sm:text-2xl font-bold text-pink-400">
                {loading ? "..." : femaleModels}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Gender
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGenderFilter("all")}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                    genderFilter === "all"
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All ({totalModels})
                </button>
                <button
                  onClick={() => setGenderFilter("male")}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                    genderFilter === "male"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Male ({maleModels})
                </button>
                <button
                  onClick={() => setGenderFilter("female")}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                    genderFilter === "female"
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Female ({femaleModels})
                </button>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Models
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, address, or intro..."
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div className="overflow-hidden">
        <DataTable
          data={filteredModels}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={
            genderFilter === "all"
              ? "No models found. Add your first model to get started."
              : `No ${genderFilter} models found. ${
                  searchQuery
                    ? "Try adjusting your search."
                    : "Add your first model to get started."
                }`
          }
          searchPlaceholder="Search models..."
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingModel ? "Edit Model" : "Add New Model"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-400 border-b border-gray-700 pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter model name"
                error={errors.name}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
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
              placeholder="Write a brief introduction about the model..."
              error={errors.intro}
              required
              rows={4}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-400 border-b border-gray-700 pb-2">
              Cover Image
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image{" "}
                {!editingModel && <span className="text-red-400">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm 
                  file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30 
                  focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
              {errors.coverImage && (
                <p className="text-red-400 text-sm mt-1">{errors.coverImage}</p>
              )}
              {editingModel && (
                <p className="text-sm text-gray-400 mt-2">
                  Leave empty to keep current cover image
                </p>
              )}

              {formData.coverImage && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">
                      Selected Cover Image:
                    </span>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={removeCoverImage}
                      type="button"
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </AdminButton>
                  </div>
                  <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                    <Image
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="Cover preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {editingModel && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-400 mb-2">
                    Current Cover Image:
                  </p>
                  <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                    <Image
                      src={`http://localhost:8000/${editingModel.coverImage}`}
                      alt={editingModel.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold-400 border-b border-gray-700 pb-2">
              Gallery Images
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Images{" "}
                {!editingModel && <span className="text-red-400">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm 
                  file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30 
                  focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
              {errors.images && (
                <p className="text-red-400 text-sm mt-1">{errors.images}</p>
              )}
              {editingModel && (
                <p className="text-sm text-gray-400 mt-2">
                  Add new images to the gallery
                </p>
              )}

              {formData.images.length > 0 && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">
                      Selected Images ({formData.images.length}):
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Image ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingModel && editingModel.images.length > 0 && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-400 mb-2">
                    Current Images ({editingModel.images.length}):
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {editingModel.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-600"
                      >
                        <Image
                          src={`http://localhost:8000/${image}`}
                          alt={`Current image ${index + 1}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                ? editingModel
                  ? "Updating..."
                  : "Creating..."
                : editingModel
                ? "Update Model"
                : "Create Model"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
