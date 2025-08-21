"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import Input from "@/components/admin/form/input";
import Textarea from "@/components/admin/form/textarea";
import PhotoUpload from "@/components/admin/form/photo-upload";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

// Types
interface Event {
  _id: string;
  name: string;
  overview: string;
}

export interface BackendSeason {
  _id: string;
  eventId: string | Event; // Can be string when creating/editing, or Event object when populated
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
  eligibilityCriteria?: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  auditionPlaces?: Array<{
    place: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SeasonFormData {
  eventId: string;
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
    icon: string;
  }>;
  eligibilityCriteria: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  auditionPlaces: Array<{
    place: string;
    date: string;
  }>;
}

interface AllSeasonsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  season: BackendSeason | null;
  events: Event[];
  onSuccess: () => void;
}

const initialFormData: SeasonFormData = {
  eventId: "",
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
  timeline: [{ label: "", datespan: "", icon: "" }],
  eligibilityCriteria: [{ label: "", value: "", icon: "" }],
  auditionPlaces: [{ place: "", date: "" }],
};

const statusOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "ended", label: "Ended" },
];

export default function AllSeasonsPopup({
  isOpen,
  onClose,
  season,
  events,
  onSuccess,
}: AllSeasonsPopupProps) {
  const [formData, setFormData] = useState<SeasonFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    []
  );
  const [currentStep, setCurrentStep] = useState(1);

  const isEditing = Boolean(season);

  // Reset form when modal opens/closes or season changes
  useEffect(() => {
    if (isOpen) {
      if (season) {
        setFormData({
          eventId:
            typeof season.eventId === "string"
              ? season.eventId
              : season.eventId._id,
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
          notice: season.notice ? season.notice.join("\\n") : "",
          image: [],
          posterImage: [],
          galleryImages: [],
          timeline: season.timeline || [{ label: "", datespan: "", icon: "" }],
          eligibilityCriteria: season.eligibilityCriteria || [{ label: "", value: "", icon: "" }],
          auditionPlaces: season.auditionPlaces || [{ place: "", date: "" }],
        });
        setExistingGalleryImages(
          season.gallery
            ? season.gallery.map((img) => normalizeImagePath(img))
            : []
        );
        // For editing, skip to step 3 since event and status are pre-selected
        setCurrentStep(3);
      } else {
        setFormData(initialFormData);
        setExistingGalleryImages([]);
        setCurrentStep(1);
      }
      setErrors({});
    }
  }, [isOpen, season]);

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setExistingGalleryImages([]);
    setCurrentStep(1);
    onClose();
  };

  const handleStepNext = () => {
    if (currentStep === 1) {
      // Validate step 1 (event selection)
      if (!formData.eventId) {
        setErrors({ eventId: "Please select an event" });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate step 2 (status selection)
      if (!formData.status) {
        setErrors({ status: "Please select a status" });
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 3) {
      setCurrentStep(isEditing ? 3 : 2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const addTimelineItem = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { label: "", datespan: "", icon: "" }],
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
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addEligibilityCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: [...prev.eligibilityCriteria, { label: "", value: "", icon: "" }],
    }));
  };

  const removeEligibilityCriteria = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: prev.eligibilityCriteria.filter((_, i) => i !== index),
    }));
  };

  const updateEligibilityCriteria = (
    index: number,
    field: keyof (typeof formData.eligibilityCriteria)[0],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: prev.eligibilityCriteria.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addAuditionPlaces = () => {
    setFormData((prev) => ({
      ...prev,
      auditionPlaces: [...prev.auditionPlaces, { place: "", date: "" }],
    }));
  };

  const removeAuditionPlaces = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      auditionPlaces: prev.auditionPlaces.filter((_, i) => i !== index),
    }));
  };

  const updateAuditionPlaces = (
    index: number,
    field: keyof (typeof formData.auditionPlaces)[0],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      auditionPlaces: prev.auditionPlaces.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

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

      // Reset pricePerVote and notice when status is changed to "ended"
      if (name === "status" && parsedValue === "ended") {
        newData.pricePerVote = 0;
        newData.notice = "";
      }

      // Auto-generate slug when eventId or year changes (only for non-editing mode)
      if (!isEditing && (name === "eventId" || name === "year")) {
        const eventId =
          name === "eventId" ? (parsedValue as string) : prev.eventId;
        const year = name === "year" ? (parsedValue as number) : prev.year;

        if (eventId && year) {
          const selectedEvent = events.find((e) => e._id === eventId);
          if (selectedEvent) {
            newData.slug = `${selectedEvent.name
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim()}-${year}`;
          }
        }
      }

      return newData;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (name: string, files: File[]) => {
    // For galleryImages, append new files to existing instead of replacing
    if (name === "galleryImages") {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...files],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRemoveExistingGalleryImage = (index: number) => {
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventId) {
      newErrors.eventId = "Event selection is required";
    }
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
      formDataToSend.append("eventId", formData.eventId);
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

      // Parse notice into array - only for non-ended seasons
      if (formData.status !== "ended" && formData.notice.trim()) {
        const noticeArray = formData.notice
          .split("\\n")
          .filter((n) => n.trim());
        formDataToSend.append("notice", JSON.stringify(noticeArray));
      }

      // Add timeline data
      const timelineData = formData.timeline.filter(
        (item) => item.label.trim() || item.datespan.trim() || item.icon.trim()
      );
      if (timelineData.length > 0) {
        formDataToSend.append("timeline", JSON.stringify(timelineData));
      }

      // Add eligibility criteria
      const eligibilityCriteriaData = formData.eligibilityCriteria.filter(
        (item) => item.label.trim() || item.value.trim() || item.icon.trim()
      );
      if (eligibilityCriteriaData.length > 0) {
        formDataToSend.append(
          "eligibilityCriteria",
          JSON.stringify(eligibilityCriteriaData)
        );
      }

      // Add audition places
      const auditionPlacesData = formData.auditionPlaces.filter(
        (item) => item.place.trim() || item.date.trim()
      );
      if (auditionPlacesData.length > 0) {
        formDataToSend.append(
          "auditionPlaces",
          JSON.stringify(auditionPlacesData)
        );
      }

      // Add images only if they are selected
      if (formData.image.length > 0) {
        formDataToSend.append("image", formData.image[0]);
      }
      if (formData.posterImage.length > 0) {
        formDataToSend.append("posterImage", formData.posterImage[0]);
      }

      // Add gallery images (new uploads)
      formData.galleryImages.forEach((image) => {
        formDataToSend.append("gallery", image);
      });

      // When editing, include which existing gallery images to retain so backend can delete removed ones
      if (isEditing) {
        const retain = existingGalleryImages
          .map((url) => {
            const filename = url.split("/").pop() || "";
            return filename ? `/uploads/${filename}` : "";
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
                <span className="text-sm font-medium">Select Event</span>
              </div>

              <div
                className={`w-12 h-0.5 ${currentStep > 1 ? "bg-green-500" : "bg-gray-400"
                  }`}
              ></div>

              <div
                className={`flex items-center space-x-2 ${currentStep === 2
                  ? "text-gold-500"
                  : currentStep > 2
                    ? "text-green-500"
                    : "text-gray-400"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 2
                    ? "border-gold-500 bg-gold-500/20"
                    : currentStep > 2
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-400 bg-gray-400/20"
                    }`}
                >
                  {currentStep > 2 ? (
                    <i className="ri-check-line text-sm"></i>
                  ) : (
                    <span className="text-sm font-medium">2</span>
                  )}
                </div>
                <span className="text-sm font-medium">Select Status</span>
              </div>

              <div
                className={`w-12 h-0.5 ${currentStep > 2 ? "bg-green-500" : "bg-gray-400"
                  }`}
              ></div>

              <div
                className={`flex items-center space-x-2 ${currentStep === 3 ? "text-gold-500" : "text-gray-400"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep === 3
                    ? "border-gold-500 bg-gold-500/20"
                    : "border-gray-400 bg-gray-400/20"
                    }`}
                >
                  <span className="text-sm font-medium">3</span>
                </div>
                <span className="text-sm font-medium">Season Details</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Event Selection */}
          {currentStep === 1 && !isEditing && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto">
                  <i className="ri-calendar-event-line text-2xl text-gold-500"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-100">
                  Select Event
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Choose the event for which you want to create a new season.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.eventId === event._id
                      ? "border-gold-500 bg-gold-500/10"
                      : "border-gray-600 bg-gray-800/50 hover:border-gray-500"
                      }`}
                    onClick={() =>
                      setFormData((prev) => {
                        const newData = { ...prev, eventId: event._id };
                        // Auto-generate slug when event is selected
                        if (prev.year) {
                          newData.slug = `${event.name
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-")
                            .trim()}-${prev.year}`;
                        }
                        return newData;
                      })
                    }
                  >
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-100">
                        {event.name}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {event.overview}
                      </p>
                    </div>

                    {formData.eventId === event._id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                          <i className="ri-check-line text-sm text-white"></i>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {errors.eventId && (
                <p className="text-red-400 text-sm text-center">
                  {errors.eventId}
                </p>
              )}

              <div className="flex justify-end pt-6">
                <Button
                  type="button"
                  onClick={handleStepNext}
                  disabled={!formData.eventId}
                >
                  Continue
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Status Selection */}
          {currentStep === 2 && !isEditing && (
            <motion.div
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

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStepBack}
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Back
                </Button>
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

          {/* Step 3: Season Details */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Selected Event and Status Display */}
              {!isEditing && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <i className="ri-calendar-event-line text-gold-400"></i>
                        <span className="text-gray-300">
                          <strong>Event:</strong>{" "}
                          {events.find((e) => e._id === formData.eventId)?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${formData.status === "upcoming"
                            ? "bg-blue-400"
                            : formData.status === "ongoing"
                              ? "bg-green-400"
                              : "bg-gray-400"
                            }`}
                        ></div>
                        <span className="text-gray-300">
                          <strong>Status:</strong>{" "}
                          {
                            statusOptions.find(
                              (opt) => opt.value === formData.status
                            )?.label
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of the form - same as the existing SeasonPopup but without event selection */}
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
                  className={`grid grid-cols-1 ${formData.status !== "ended" ? "md:grid-cols-2" : ""
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

              {/* Notice - Only show for non-ended seasons */}
              {formData.status !== "ended" && (
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
              )}

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

                {/* Debug Info */}
                <div className="bg-red-500/20 p-4 rounded-lg border border-red-500">
                  <p className="text-red-400 text-sm">
                    Debug: Status = {formData.status}, Step = {currentStep}, IsEditing = {isEditing.toString()}
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
                      <Input
                        label="Icon"
                        name={`timeline-icon-${index}`}
                        value={item.icon}
                        onChange={(e) =>
                          updateTimelineItem(index, "icon", e.target.value)
                        }
                        placeholder="ri-icon-name"
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

              {/* Eligibility Criteria */}
              {formData.status === "upcoming" && (
                <div className="space-y-4 bg-blue-500/10 p-4 rounded-lg border border-blue-500">
                  <div className="border-b border-gray-700 pb-3">
                    <h3 className="text-lg font-semibold text-gray-100">
                      Eligibility Criteria
                    </h3>
                    <p className="text-sm text-gray-400">
                      Define the eligibility criteria for participants.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {formData.eligibilityCriteria.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                      >
                        <Input
                          label="Label"
                          name={`eligibilityCriteria-label-${index}`}
                          value={item.label}
                          onChange={(e) =>
                            updateEligibilityCriteria(index, "label", e.target.value)
                          }
                          placeholder="Criteria label"
                          disabled={submitting}
                        />
                        <Input
                          label="Value"
                          name={`eligibilityCriteria-value-${index}`}
                          value={item.value}
                          onChange={(e) =>
                            updateEligibilityCriteria(index, "value", e.target.value)
                          }
                          placeholder="Criteria value"
                          disabled={submitting}
                        />
                        <Input
                          label="Icon"
                          name={`eligibilityCriteria-icon-${index}`}
                          value={item.icon}
                          onChange={(e) =>
                            updateEligibilityCriteria(index, "icon", e.target.value)
                          }
                          placeholder="ri-icon-name"
                          disabled={submitting}
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEligibilityCriteria(index)}
                            disabled={
                              submitting || formData.eligibilityCriteria.length === 1
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
                      onClick={addEligibilityCriteria}
                      disabled={submitting}
                      className="w-full"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Eligibility Criteria
                    </Button>
                  </div>
                </div>
              )}

              {/* Audition Places */}
              {formData.status === "upcoming" && (
                <div className="space-y-4 bg-green-500/10 p-4 rounded-lg border border-green-500">
                  <div className="border-b border-gray-700 pb-3">
                    <h3 className="text-lg font-semibold text-gray-100">
                      Audition Places
                    </h3>
                    <p className="text-sm text-gray-400">
                      Specify the audition places and dates for the upcoming season.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {formData.auditionPlaces.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                      >
                        <Input
                          label="Place"
                          name={`auditionPlaces-place-${index}`}
                          value={item.place}
                          onChange={(e) =>
                            updateAuditionPlaces(index, "place", e.target.value)
                          }
                          placeholder="Audition place"
                          disabled={submitting}
                        />
                        <Input
                          label="Date"
                          name={`auditionPlaces-date-${index}`}
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            updateAuditionPlaces(index, "date", e.target.value)
                          }
                          disabled={submitting}
                        />
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAuditionPlaces(index)}
                            disabled={
                              submitting || formData.auditionPlaces.length === 1
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
                      onClick={addAuditionPlaces}
                      disabled={submitting}
                      className="w-full"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Audition Place
                    </Button>
                  </div>
                </div>
              )}

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
