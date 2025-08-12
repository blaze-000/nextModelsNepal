"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { ModelFormData, ModelsPopupProps } from "@/types/admin";

const INITIAL_FORM_DATA: ModelFormData = {
  name: "",
  intro: "",
  address: "",
  gender: "",
  slug: "",
  coverImage: [],
  galleryImages: [],
};

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

// Utility function to generate URL-friendly slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

const ModelsPopup = ({
  isOpen,
  onClose,
  model,
  onSuccess,
}: ModelsPopupProps) => {
  const [formData, setFormData] = useState<ModelFormData>(INITIAL_FORM_DATA);
  const [existingCoverImage, setExistingCoverImage] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(model);
  const modalTitle = isEditing ? "Edit Model" : "Add New Model";

  // Initialize form data when modal opens or model changes
  useEffect(() => {
    if (isOpen) {
      if (model) {
        setFormData({
          name: model.name || "",
          intro: model.intro || "",
          address: model.address || "",
          gender: model.gender || "",
          slug: model.slug || "",
          coverImage: [],
          galleryImages: [],
        });
        setExistingCoverImage(
          model.coverImage ? [normalizeImagePath(model.coverImage)] : []
        );
        setExistingGalleryImages(
          model.images ? model.images.map((img) => normalizeImagePath(img)) : []
        );
      } else {
        setFormData(INITIAL_FORM_DATA);
        setExistingCoverImage([]);
        setExistingGalleryImages([]);
      }
      setErrors({});
    }
  }, [isOpen, model]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Model name is required";
    }

    if (!formData.intro.trim()) {
      newErrors.intro = "Introduction is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    // Cover image validation
    const hasCoverImage =
      formData.coverImage.length > 0 || existingCoverImage.length > 0;
    if (!hasCoverImage) {
      newErrors.coverImage = "Cover image is required";
    }

    // Gallery images validation
    const hasGalleryImages =
      formData.galleryImages.length > 0 || existingGalleryImages.length > 0;
    if (!hasGalleryImages) {
      newErrors.galleryImages = "At least one gallery image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, existingCoverImage, existingGalleryImages]);

  // Handle input changes
  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const newData = { ...prev, [name]: value };

        // Auto-generate slug when name changes
        if (name === "name") {
          newData.slug = generateSlug(value);
        }

        return newData;
      });

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  // Handle cover image changes
  const handleCoverImageChange = useCallback(
    (files: File[]) => {
      setFormData((prev) => ({ ...prev, coverImage: files }));
      if (errors.coverImage) {
        setErrors((prev) => ({ ...prev, coverImage: "" }));
      }
    },
    [errors]
  );

  // Handle gallery images changes
  const handleGalleryImagesChange = useCallback(
    (files: File[]) => {
      setFormData((prev) => ({ ...prev, galleryImages: files }));
      if (errors.galleryImages) {
        setErrors((prev) => ({ ...prev, galleryImages: "" }));
      }
    },
    [errors]
  );

  // Handle removal of existing images
  const handleRemoveExistingCoverImage = useCallback(() => {
    setExistingCoverImage([]);
  }, []);

  const handleRemoveExistingGalleryImage = useCallback((index: number) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fix the form errors");
        return;
      }

      setIsSubmitting(true);

      try {
        const submitFormData = new FormData();

        // Add text fields
        submitFormData.append("name", formData.name.trim());
        submitFormData.append("intro", formData.intro.trim());
        submitFormData.append("address", formData.address.trim());
        submitFormData.append("gender", formData.gender);
        submitFormData.append("slug", formData.slug.trim());

        // Add cover image if new one is selected
        if (formData.coverImage[0]) {
          submitFormData.append("coverImage", formData.coverImage[0]);
        }

        // Add gallery images if new ones are selected
        formData.galleryImages.forEach((image) => {
          submitFormData.append("images", image);
        });

        const url = isEditing ? `/api/models/${model!._id}` : "/api/models";
        const method = isEditing ? "patch" : "post";

        const response = await Axios[method](url, submitFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          toast.success(
            `Model ${isEditing ? "updated" : "created"} successfully`
          );
          onSuccess();
          onClose();
        } else {
          throw new Error(response.data.message || "Operation failed");
        }
      } catch (error: unknown) {
        console.error("Error submitting model:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to ${isEditing ? "update" : "create"} model`;
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, formData, isEditing, model, onSuccess, onClose]
  );

  // Handle modal close
  const handleClose = useCallback(() => {
    if (isSubmitting) return;

    setFormData(INITIAL_FORM_DATA);
    setExistingCoverImage([]);
    setExistingGalleryImages([]);
    setErrors({});
    onClose();
  }, [isSubmitting, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle} size="xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the model&apos;s basic details and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Model Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter model's full name"
              error={errors.name}
              required
              disabled={isSubmitting}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              error={errors.gender}
              required
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="url-friendly-name"
            error={errors.slug}
            required
            disabled={isSubmitting}
            helpText="This will be used in the URL. Auto-generated from name, but you can customize it."
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            error={errors.address}
            required
            disabled={isSubmitting}
          />

          <Textarea
            label="Introduction"
            name="intro"
            value={formData.intro}
            onChange={handleInputChange}
            placeholder="Write a compelling introduction about the model..."
            error={errors.intro}
            required
            disabled={isSubmitting}
            rows={4}
          />
        </div>

        {/* Cover Image Section */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Cover Image
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload a high-quality cover image that represents the model.
            </p>
          </div>

          <PhotoUpload
            label="Cover Image"
            name="coverImage"
            mode="single"
            selectedFiles={formData.coverImage}
            existingImages={existingCoverImage}
            onImageChange={handleCoverImageChange}
            onRemoveExisting={handleRemoveExistingCoverImage}
            error={errors.coverImage}
            required
            disabled={isSubmitting}
            maxFileSize={5}
            acceptedTypes={["image/*"]}
          />
        </div>

        {/* Gallery Images Section */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Gallery Images
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Upload additional images to showcase the model&apos;s portfolio.
            </p>
          </div>

          <PhotoUpload
            label="Gallery Images"
            name="galleryImages"
            mode="multiple"
            maxFiles={10}
            selectedFiles={formData.galleryImages}
            existingImages={existingGalleryImages}
            onImageChange={handleGalleryImagesChange}
            onRemoveExisting={handleRemoveExistingGalleryImage}
            error={errors.galleryImages}
            required
            disabled={isSubmitting}
            maxFileSize={5}
            acceptedTypes={["image/*"]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <AdminButton
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </AdminButton>

          <AdminButton
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? `${isEditing ? "Updating" : "Creating"}...`
              : `${isEditing ? "Update" : "Create"} Model`}
          </AdminButton>
        </div>
      </form>
    </Modal>
  );
};

export default ModelsPopup;
