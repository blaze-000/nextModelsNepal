"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import Select from "@/components/admin/form/select";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export interface BackendSeason {
  _id: string;
  eventId: string;
  year: number;
  image: string;
  status: "upcoming" | "ongoing" | "ended";
  startDate: string;
  auditionFormDeadline?: string;
  votingOpened?: boolean;
  votingEndDate?: string;
  endDate: string;
  slug: string;
  getTicketLink?: string;
  pricePerVote: number;
  posterImage?: string;
  gallery?: string[];
  notice?: string[];
  timeline?: Array<{
    label: string;
    datespan: string;
    icon: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SeasonFormData {
  year: number;
  status: "upcoming" | "ongoing" | "ended";
  startDate: string;
  auditionFormDeadline: string;
  votingOpened: boolean;
  votingEndDate: string;
  endDate: string;
  slug: string;
  getTicketLink: string;
  pricePerVote: number;
  notice: string;
  image: File[];
  posterImage: File[];
  galleryImages: File[];
  timeline: Array<{
    label: string;
    datespan: string;
    icon: File[];
  }>;
}

interface SeasonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  season: BackendSeason | null;
  eventId: string;
  eventName?: string;
  onSuccess: () => void;
}

const initialFormData: SeasonFormData = {
  year: new Date().getFullYear(),
  status: "upcoming",
  startDate: "",
  auditionFormDeadline: "",
  votingOpened: false,
  votingEndDate: "",
  endDate: "",
  slug: "",
  getTicketLink: "",
  pricePerVote: 0,
  notice: "",
  image: [],
  posterImage: [],
  galleryImages: [],
  timeline: [{ label: "", datespan: "", icon: [] }],
};

const statusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "ended", label: "Ended" },
];

export default function SeasonPopup({
  isOpen,
  onClose,
  season,
  eventId,
  eventName,
  onSuccess,
}: SeasonPopupProps) {
  const [formData, setFormData] = useState<SeasonFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [localEventName, setLocalEventName] = useState<string>(eventName || "");

  const isEditing = Boolean(season);

  // Fetch event name if not provided
  useEffect(() => {
    if ((!eventName || eventName.trim() === "") && eventId) {
      const fetchEventName = async () => {
        try {
          const response = await Axios.get(`/api/events/${eventId}`);
          if (response.data.success && response.data.data?.name) {
            setLocalEventName(response.data.data.name);
          }
        } catch (error) {
          console.error("Failed to fetch event name:", error);
        }
      };
      fetchEventName();
    } else {
      setLocalEventName(eventName || "");
    }
  }, [eventName, eventId]);

  // Reset form when modal opens/closes or season changes
  useEffect(() => {
    if (isOpen) {
      if (season) {
        setFormData({
          year: season.year,
          status: season.status,
          startDate: season.startDate ? season.startDate.split("T")[0] : "",
          auditionFormDeadline: season.auditionFormDeadline
            ? season.auditionFormDeadline.split("T")[0]
            : "",
          votingOpened: season.votingOpened || false,
          votingEndDate: season.votingEndDate
            ? season.votingEndDate.split("T")[0]
            : "",
          endDate: season.endDate ? season.endDate.split("T")[0] : "",
          slug: season.slug,
          getTicketLink: season.getTicketLink || "",
          pricePerVote: season.pricePerVote,
          notice: season.notice ? season.notice.join("\n") : "",
          image: [],
          posterImage: [],
          galleryImages: [],
          timeline: season.timeline ? season.timeline.map(item => ({
            ...item,
            icon: [] // Reset icon to empty file array when editing
          })) : [{ label: "", datespan: "", icon: [] }],
        });
        setExistingGalleryImages(
          season.gallery
            ? season.gallery.map((img) => normalizeImagePath(img))
            : []
        );
      } else {
        const newFormData = { ...initialFormData };
        // Auto-generate slug for new seasons (only if localEventName is available)
        if (localEventName && localEventName.trim() !== "") {
          newFormData.slug = `${localEventName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()}-${newFormData.year}`;
        }
        setFormData(newFormData);
        setExistingGalleryImages([]);
      }
      setErrors({});
    }
  }, [isOpen, season, localEventName]);

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setExistingGalleryImages([]);
    // Don't reset currentStep here - let the useEffect handle it when modal reopens
    onClose();
  };

  const handleStepNext = () => {
    if (currentStep === 1) {
      // Validate step 1 (status selection)
      if (!formData.status) {
        setErrors({ status: "Please select a status" });
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const addTimelineItem = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { label: "", datespan: "", icon: [] }],
    }));
  };

  const removeTimelineItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const updateTimelineItem = (
    index: number,
    field: keyof (typeof formData.timeline)[0],
    value: string | File[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // For editing, skip step 1 since status can't be changed
  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isOpen, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      parsedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: parsedValue };

      // Reset pricePerVote when status is changed to "ended"
      if (name === "status" && parsedValue === "ended") {
        newData.pricePerVote = 0;
      }

      // Auto-generate slug when year changes (only for non-editing mode)
      if (
        !isEditing &&
        name === "year" &&
        parsedValue &&
        localEventName &&
        localEventName.trim() !== ""
      ) {
        newData.slug = `${localEventName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()}-${parsedValue}`;
      }

      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (name: string, files: File[]) => {
    setFormData((prev) => ({ ...prev, [name]: files }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRemoveExistingGalleryImage = (index: number) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.year < 1900 || formData.year > 2100) {
      newErrors.year = "Year must be between 1900 and 2100";
    }
    if (!formData.startDate.trim()) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate.trim()) {
      newErrors.endDate = "End date is required";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }
    if (formData.status !== "ended" && formData.pricePerVote < 0) {
      newErrors.pricePerVote = "Price per vote must be positive";
    }

    // For new seasons, main image is required
    if (!isEditing && formData.image.length === 0) {
      newErrors.image = "Main image is required";
    }

    // Status-specific validations
    if (formData.status === "upcoming") {
      if (!formData.auditionFormDeadline.trim()) {
        newErrors.auditionFormDeadline =
          "Audition form deadline is required for upcoming seasons";
      }
      if (!formData.votingEndDate.trim()) {
        newErrors.votingEndDate =
          "Voting end date is required for upcoming seasons";
      }
    } else if (formData.status === "ongoing") {
      if (!formData.votingEndDate.trim()) {
        newErrors.votingEndDate =
          "Voting end date is required for ongoing seasons";
      }
    }

    // Date validations
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (formData.auditionFormDeadline && formData.startDate) {
      const auditionDeadline = new Date(formData.auditionFormDeadline);
      const startDate = new Date(formData.startDate);
      if (auditionDeadline >= startDate) {
        newErrors.auditionFormDeadline =
          "Audition deadline must be before start date";
      }
    }

    if (formData.votingEndDate && formData.endDate) {
      const votingEndDate = new Date(formData.votingEndDate);
      const endDate = new Date(formData.endDate);
      if (votingEndDate > endDate) {
        newErrors.votingEndDate =
          "Voting end date must be before or equal to season end date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData to send files
      const formDataToSend = new FormData();
      formDataToSend.append("eventId", eventId);
      formDataToSend.append("year", formData.year.toString());
      formDataToSend.append("status", formData.status);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("slug", formData.slug);
      if (formData.getTicketLink) {
        formDataToSend.append("getTicketLink", formData.getTicketLink);
      }
      if (formData.status !== "ended") {
        formDataToSend.append("pricePerVote", formData.pricePerVote.toString());
      }
      formDataToSend.append("votingOpened", formData.votingOpened.toString());

      // Optional fields
      if (formData.startDate) {
        formDataToSend.append("startDate", formData.startDate);
      }
      if (formData.auditionFormDeadline) {
        formDataToSend.append(
          "auditionFormDeadline",
          formData.auditionFormDeadline
        );
      }
      if (formData.votingEndDate) {
        formDataToSend.append("votingEndDate", formData.votingEndDate);
      }

      // Parse notice into array
      if (formData.notice.trim()) {
        const noticeArray = formData.notice.split("\n").filter((n) => n.trim());
        formDataToSend.append("notice", JSON.stringify(noticeArray));
      }

      // Add timeline data
      const timelineData = formData.timeline.filter(
        (item) => item.label.trim() || item.datespan.trim() || item.icon.length > 0
      );
      if (timelineData.length > 0) {
        // Create timeline data for JSON
        const timelineDataForJson = timelineData.map((item, index) => {
          // If editing and no new icon file is uploaded, preserve the existing icon path
          if (isEditing && season && season.timeline && season.timeline[index] && item.icon.length === 0) {
            return {
              label: item.label,
              datespan: item.datespan,
              icon: season.timeline[index].icon // Preserve existing icon path
            };
          }
          // For new uploads or new seasons, set empty string (backend will process files)
          return {
            label: item.label,
            datespan: item.datespan,
            icon: ""
          };
        });
        formDataToSend.append("timeline", JSON.stringify(timelineDataForJson));

        // Add timeline icon files
        timelineData.forEach((item, index) => {
          if (item.icon.length > 0) {
            formDataToSend.append(`timelineIcon_${index}`, item.icon[0]);
          }
        });

        // Debug logging
        console.log("Timeline data being sent:", timelineDataForJson);
        console.log("Timeline files being sent:", timelineData.map((item, index) => ({
          index,
          hasFile: item.icon.length > 0,
          fileName: item.icon.length > 0 ? item.icon[0].name : null
        })));
      }

      // Add images only if they are selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }
      if (formData.posterImage.length > 0) {
        formDataToSend.append("posterImage", formData.posterImage[0]);
      }

      // Add gallery images
      formData.galleryImages.forEach((image) => {
        formDataToSend.append("gallery", image);
      });

      // When editing, include which existing gallery images to retain so backend can delete removed ones
      if (isEditing) {
        const retain = existingGalleryImages
          .map((url) => {
            // Extract the original path from the normalized URL
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
            const originalPath = url.replace(baseUrl, "");
            return originalPath;
          })
          .filter(Boolean) as string[];
        formDataToSend.append("retainGallery", JSON.stringify(retain));
      }

      const url = isEditing ? `/api/season/${season!._id}` : "/api/season";
      const method = isEditing ? "patch" : "post";



      const response = await Axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Season ${isEditing ? "updated" : "created"} successfully!`
        );
        handleClose();
        onSuccess();
      } else {
        throw new Error(
          response.data.message ||
          `Failed to ${isEditing ? "update" : "create"} season`
        );
      }
    } catch (error: unknown) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} season:`,
        error
      );
      let errorMessage = `Failed to ${isEditing ? "update" : "create"} season`;
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      key={season?._id || 'new'} // Force re-render when season changes
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Season" : "Add New Season"}
      size="xl"
    >
      <div className="p-6">
        {/* Step Indicator */}
        {!isEditing && (
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${currentStep === 1
                  ? "text-gold-500"
                  : currentStep > 1
                    ? "text-green-500"
                    : "text-gray-400"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 1
                    ? "border-gold-500 bg-gold-500/20"
                    : currentStep > 1
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-400 bg-gray-400/20"
                    }`}
                >
                  {currentStep > 1 ? (
                    <i className="ri-check-line text-sm"></i>
                  ) : (
                    <span className="text-sm font-medium">1</span>
                  )}
                </div>
                <span className="text-sm font-medium">Status Selection</span>
              </div>

              <div
                className={`w-12 h-0.5 ${currentStep > 1 ? "bg-green-500" : "bg-gray-400"
                  }`}
              ></div>

              <div
                className={`flex items-center space-x-2 ${currentStep === 2 ? "text-gold-500" : "text-gray-400"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 2
                    ? "border-gold-500 bg-gold-500/20"
                    : "border-gray-400 bg-gray-400/20"
                    }`}
                >
                  <span className="text-sm font-medium">2</span>
                </div>
                <span className="text-sm font-medium">Season Details</span>
              </div>
            </div>
          </div>
        )}

        <form key={`form-${season?._id || 'new'}`} onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Status Selection */}
          {currentStep === 1 && !isEditing && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto">
                  <i className="ri-calendar-2-line text-2xl text-gold-500"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-100">
                  Select Season Status
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Choose the current status of your season. This will determine
                  which fields are required for your season.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.status === option.value
                      ? "border-gold-500 bg-gold-500/10"
                      : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                      }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        status: option.value as
                          | "upcoming"
                          | "ongoing"
                          | "ended",
                      }))
                    }
                  >
                    <div className="text-center space-y-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${option.value === "upcoming"
                          ? "bg-blue-500/20"
                          : option.value === "ongoing"
                            ? "bg-green-500/20"
                            : "bg-gray-500/20"
                          }`}
                      >
                        <i
                          className={`text-xl ${option.value === "upcoming"
                            ? "ri-time-line text-blue-400"
                            : option.value === "ongoing"
                              ? "ri-play-line text-green-400"
                              : "ri-check-line text-gray-400"
                            }`}
                        ></i>
                      </div>
                      <h4 className="font-semibold text-gray-100">
                        {option.label}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {option.value === "upcoming"
                          ? "Season hasn't started yet"
                          : option.value === "ongoing"
                            ? "Season is currently active"
                            : "Season has completed"}
                      </p>
                    </div>

                    {formData.status === option.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                          <i className="ri-check-line text-sm text-white"></i>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {errors.status && (
                <p className="text-red-400 text-sm text-center">
                  {errors.status}
                </p>
              )}

              <div className="flex justify-end pt-6">
                <Button
                  type="button"
                  onClick={handleStepNext}
                  disabled={!formData.status}
                >
                  Continue
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Season Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Status Display for Step 2 */}
              {!isEditing && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.status === "upcoming"
                        ? "bg-blue-500/20"
                        : formData.status === "ongoing"
                          ? "bg-green-500/20"
                          : "bg-gray-500/20"
                        }`}
                    >
                      <i
                        className={`text-sm ${formData.status === "upcoming"
                          ? "ri-time-line text-blue-400"
                          : formData.status === "ongoing"
                            ? "ri-play-line text-green-400"
                            : "ri-check-line text-gray-400"
                          }`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-100">
                        {
                          statusOptions.find(
                            (opt) => opt.value === formData.status
                          )?.label
                        }{" "}
                        Season
                      </h4>
                      <p className="text-sm text-gray-400">
                        Fill in the required fields for this status
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-400">
                    Enter the season&apos;s basic details and information.
                  </p>
                </div>

                <div
                  className={`grid grid-cols-1 ${formData.status !== "ended"
                    ? "md:grid-cols-3"
                    : isEditing
                      ? "md:grid-cols-2"
                      : ""
                    } gap-4`}
                >
                  <Input
                    label="Year"
                    name="year"
                    type="number"
                    value={formData.year.toString()}
                    onChange={handleInputChange}
                    placeholder="2024"
                    required
                    error={errors.year}
                    disabled={submitting}
                  />
                  {isEditing && (
                    <Select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      options={statusOptions}
                      required
                      error={errors.status}
                      disabled={submitting}
                    />
                  )}
                  {formData.status !== "ended" && (
                    <Input
                      label="Price Per Vote"
                      name="pricePerVote"
                      type="number"
                      value={formData.pricePerVote.toString()}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      error={errors.pricePerVote}
                      disabled={submitting}
                    />
                  )}
                </div>

                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="season-2024"
                  required
                  error={errors.slug}
                  disabled={submitting}
                />
                <p className="text-sm text-gray-400 -mt-2">
                  URL-friendly identifier for the season
                </p>

                <Input
                  label="Get Ticket Link"
                  name="getTicketLink"
                  value={formData.getTicketLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/tickets"
                  error={errors.getTicketLink}
                  disabled={submitting}
                />
                <p className="text-sm text-gray-400 -mt-2">
                  Link where users can purchase tickets for this season
                </p>
              </div>

              {/* Date Information - Status Dependent */}
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Date Information
                  </h3>
                  <p className="text-sm text-gray-400">
                    Set important dates for the season.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date - Always visible for all statuses (upcoming, ongoing, ended) */}
                  <Input
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    error={errors.startDate}
                    disabled={submitting}
                  />

                  <Input
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    error={errors.endDate}
                    disabled={submitting}
                  />

                  {/* Audition Form Deadline - Only for upcoming seasons */}
                  {formData.status === "upcoming" && (
                    <Input
                      label="Audition Form Deadline"
                      name="auditionFormDeadline"
                      type="date"
                      value={formData.auditionFormDeadline}
                      onChange={handleInputChange}
                      required
                      error={errors.auditionFormDeadline}
                      disabled={submitting}
                    />
                  )}

                  {/* Voting End Date - For upcoming and ongoing seasons */}
                  {(formData.status === "upcoming" ||
                    formData.status === "ongoing") && (
                      <Input
                        label="Voting End Date"
                        name="votingEndDate"
                        type="date"
                        value={formData.votingEndDate}
                        onChange={handleInputChange}
                        required
                        error={errors.votingEndDate}
                        disabled={submitting}
                      />
                    )}
                </div>

                {/* Voting Opened Checkbox - For upcoming and ongoing seasons */}
                {(formData.status === "upcoming" ||
                  formData.status === "ongoing") && (
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="votingOpened"
                        name="votingOpened"
                        checked={formData.votingOpened}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-4 h-4 text-gold-500 bg-gray-700 border-gray-600 rounded focus:ring-gold-500 focus:ring-2"
                      />
                      <label
                        htmlFor="votingOpened"
                        className="text-sm text-gray-300"
                      >
                        Voting is currently opened
                      </label>
                    </div>
                  )}
              </div>

              {/* Images */}
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Season Images
                  </h3>
                  <p className="text-sm text-gray-400">
                    Upload images for your season. Main image is required for
                    new seasons.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhotoUpload
                    label="Main Image"
                    name="image"
                    onImageChange={(files: File[]) =>
                      handleImageChange("image", files)
                    }
                    selectedFiles={formData.image}
                    existingImages={
                      season?.image ? [normalizeImagePath(season.image)] : []
                    }
                    error={errors.image}
                    required={!isEditing}
                    mode="single"
                    maxFiles={1}
                    maxFileSize={5}
                    acceptedTypes={["image/*"]}
                    disabled={submitting}
                  />



                  {/* Poster Image - Only for upcoming seasons */}
                  {formData.status === "upcoming" && (
                    <PhotoUpload
                      label="Poster Image"
                      name="posterImage"
                      onImageChange={(files: File[]) =>
                        handleImageChange("posterImage", files)
                      }
                      selectedFiles={formData.posterImage}
                      existingImages={
                        season?.posterImage
                          ? [normalizeImagePath(season.posterImage)]
                          : []
                      }
                      error={errors.posterImage}
                      mode="single"
                      maxFiles={1}
                      maxFileSize={5}
                      acceptedTypes={["image/*"]}
                      disabled={submitting}
                    />
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Gallery Images
                  </h3>
                  <p className="text-sm text-gray-400">
                    Upload additional images to showcase the season.
                  </p>
                </div>

                <PhotoUpload
                  label="Gallery Images"
                  name="galleryImages"
                  onImageChange={(files: File[]) =>
                    handleImageChange("galleryImages", files)
                  }
                  selectedFiles={formData.galleryImages}
                  existingImages={existingGalleryImages}
                  onRemoveExisting={handleRemoveExistingGalleryImage}
                  error={errors.galleryImages}
                  mode="multiple"
                  maxFiles={100}
                  maxFileSize={5}
                  acceptedTypes={["image/*"]}
                  disabled={submitting}
                />

                {isEditing && (
                  <p className="text-sm text-gray-400">
                    Upload new images to add to the gallery
                  </p>
                )}
              </div>

              {/* Notice */}
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3"></div>

                <Textarea
                  label="Notice"
                  name="notice"
                  value={formData.notice}
                  onChange={handleInputChange}
                  placeholder="Enter notices for this season (one per line)"
                  rows={3}
                  error={errors.notice}
                  disabled={submitting}
                />
                <p className="text-sm text-gray-400 -mt-2">
                  Enter each notice on a new line
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Timeline
                  </h3>
                  <p className="text-sm text-gray-400">
                    Add key milestones and events for this season.
                  </p>
                </div>

                <div className="space-y-3">
                  {formData.timeline.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                    >
                      <Input
                        label="Label"
                        name={`timeline-label-${index}`}
                        value={item.label}
                        onChange={(e) =>
                          updateTimelineItem(index, "label", e.target.value)
                        }
                        placeholder="Event name"
                        disabled={submitting}
                      />
                      <Input
                        label="Date Span"
                        name={`timeline-datespan-${index}`}
                        value={item.datespan}
                        onChange={(e) =>
                          updateTimelineItem(index, "datespan", e.target.value)
                        }
                        placeholder="Date range"
                        disabled={submitting}
                      />
                      <PhotoUpload
                        label="Icon"
                        name={`timeline-icon-${index}`}
                        onImageChange={(files: File[]) =>
                          updateTimelineItem(index, "icon", files)
                        }
                        selectedFiles={item.icon}
                        error={errors[`timeline-icon-${index}`]}
                        mode="single"
                        maxFiles={1}
                        maxFileSize={2}
                        acceptedTypes={["image/*", "image/svg+xml"]}
                        disabled={submitting}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTimelineItem(index)}
                          disabled={
                            submitting || formData.timeline.length === 1
                          }
                          className="w-full"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTimelineItem}
                    disabled={submitting}
                    className="w-full"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Timeline Item
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-700">
                <div className="flex gap-3">
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleStepBack}
                      disabled={submitting}
                    >
                      <i className="ri-arrow-left-line mr-2"></i>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    type="button"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? `${isEditing ? "Updating" : "Creating"}...`
                    : `${isEditing ? "Update" : "Create"} Season`}
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </Modal>
  );
}
