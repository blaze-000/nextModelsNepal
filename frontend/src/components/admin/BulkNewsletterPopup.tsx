"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import PhotoUpload from "@/components/admin/form/photo-upload";
import Axios from "@/lib/axios-instance";

// API Functions and Interfaces
interface NewsletterData {
  title: string;
  description: string;
  image: File[];
  descriptionOpt: string;
  imageOpt: File[];
  linkLabel: string;
  link: string;
  websiteLink: string;
}

const sendBulkNewsletter = async (data: NewsletterData) => {
  const formData = new FormData();

  // Append text fields
  formData.append("title", data.title.trim());
  formData.append("description", data.description.trim());
  formData.append("descriptionOpt", data.descriptionOpt.trim());
  formData.append("linkLabel", data.linkLabel.trim());
  formData.append("link", data.link.trim());
  formData.append("websiteLink", data.websiteLink.trim());

  // Append main image
  data.image.forEach((image) => {
    formData.append("image", image);
  });

  // Append optional image
  data.imageOpt.forEach((image) => {
    formData.append("imageOpt", image);
  });

  const response = await Axios.post("/api/newsletter/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

interface BulkNewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}



export default function BulkNewsletterPopup({ isOpen, onClose, onSuccess }: BulkNewsletterPopupProps) {
  const [formData, setFormData] = useState<NewsletterData>({
    title: "",
    description: "",
    image: [],
    descriptionOpt: "",
    imageOpt: [],
    linkLabel: "",
    link: "",
    websiteLink: "https://nextmodelsnepal.com/"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      image: files
    }));
  };

  const handleImageOptChange = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      imageOpt: files
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setIsSubmitting(true);

      // Use real function now that backend is ready
      const response = await sendBulkNewsletter(formData);

      if (response.success) {
        toast.success(response.message);
        setFormData({
          title: "",
          description: "",
          image: [],
          descriptionOpt: "",
          imageOpt: [],
          linkLabel: "",
          link: "",
          websiteLink: "https://nextmodelsnepal.com/"
        });
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Error sending bulk newsletter:", error);
      const errorMessage = error.response?.data?.message || "Failed to send bulk newsletter";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-newsreader text-primary">
              Send Bulk Newsletter
            </h2>
            <button
              onClick={onClose}
              className="text-foreground/50 hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              <i className="ri-close-line text-2xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-background text-foreground"
                placeholder="Enter newsletter title"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-background text-foreground resize-none"
                placeholder="Enter newsletter description"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Image */}
            <div>
              <PhotoUpload
                label="Image"
                name="image"
                mode="single"
                selectedFiles={formData.image}
                onImageChange={handleImageChange}
                disabled={isSubmitting}
                maxFileSize={5}
                acceptedTypes={["image/*"]}
              />
            </div>

            {/* Description (Optional) */}
            <div>
              <label htmlFor="descriptionOpt" className="block text-sm font-medium text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                id="descriptionOpt"
                name="descriptionOpt"
                value={formData.descriptionOpt}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-background text-foreground resize-none"
                placeholder="Enter optional description"
                disabled={isSubmitting}
              />
            </div>

            {/* Image (Optional) */}
            <div>
              <PhotoUpload
                label="Image (Optional)"
                name="imageOpt"
                mode="single"
                selectedFiles={formData.imageOpt}
                onImageChange={handleImageOptChange}
                disabled={isSubmitting}
                maxFileSize={5}
                acceptedTypes={["image/*"]}
              />
            </div>

            {/* Link Label */}
            <div>
              <label htmlFor="linkLabel" className="block text-sm font-medium text-foreground mb-2">
                Link Label
              </label>
              <input
                type="text"
                id="linkLabel"
                name="linkLabel"
                value={formData.linkLabel}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Read More, Learn More"
                disabled={isSubmitting}
              />
            </div>

            {/* Link URL */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-foreground mb-2">
                Link URL
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-background text-foreground"
                placeholder="https://example.com/article"
                disabled={isSubmitting}
              />
            </div>

            {/* Website Link */}
            <div>
              <label htmlFor="websiteLink" className="block text-sm font-medium text-foreground mb-2">
                Website Link
              </label>
              <input
                type="url"
                id="websiteLink"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-background text-foreground"
                placeholder="https://nextmodelsnepal.com/"
                disabled={isSubmitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold-500 hover:bg-gold-400 text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size={16} color="white" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-2" />
                    Send Newsletter
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
