"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";

import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import EventPopup, { BackendEvent } from "../EventPopup";
import SeasonPopup, { BackendSeason } from "./seasons/SeasonPopup";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Types
interface Event {
  _id: string;
  name: string;
  overview: string;
  titleImage: string;
  coverImage: string;
  subtitle: string;
  quote: string;
  purpose: string;
  purposeImage: string;
  timelineSubtitle: string;
  managedBy: "self" | "partner";
  seasons?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface Season {
  _id: string;
  eventId: string;
  name: string;
  year: number;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed";
  images: string[];
  createdAt: string;
  updatedAt: string;
  // Additional fields for BackendSeason compatibility
  image?: string;
  slug?: string;
  pricePerVote?: number;
  auditionFormDeadline?: string;
  votingOpened?: boolean;
  votingEndDate?: string;
  titleImage?: string;
  posterImage?: string;
  gallery?: string[];
  notice?: string[];
  timeline?: Array<{
    label: string;
    datespan: string;
    icon: string;
  }>;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  // Modal states
  const [editEventModal, setEditEventModal] = useState(false);
  const [addSeasonModal, setAddSeasonModal] = useState(false);
  const [editSeasonModal, setEditSeasonModal] = useState<{
    isOpen: boolean;
    season: BackendSeason | null;
  }>({
    isOpen: false,
    season: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "season" | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`/api/events/${eventId}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      }
    };

    fetchEvent();
  }, [eventId]);

  // Fetch seasons data
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await Axios.get(`/api/season/event/${eventId}`);
        const seasonsData = res.data.data || [];
        console.log("Seasons data:", seasonsData);
        // Log image data for debugging
        seasonsData.forEach((season: Season, index: number) => {
          console.log(`Season ${index} image data:`, {
            images: season.images,
            image: season.image,
            titleImage: season.titleImage,
            posterImage: season.posterImage,
            gallery: season.gallery,
          });
        });
        setSeasons(seasonsData);
      } catch (err) {
        console.error("Failed to fetch seasons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, [eventId]);

  // Handlers
  const handleViewSeason = (season: Season) => {
    router.push(`/admin/events/${eventId}/seasons/${season._id}`);
  };

  const toggleAccordionItem = (itemId: string) => {
    setOpenAccordionItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isAccordionItemOpen = (itemId: string) => {
    return openAccordionItems.includes(itemId);
  };

  const handleEditSeason = (season: Season) => {
    setEditSeasonModal({
      isOpen: true,
      season: season as BackendSeason,
    });
  };

  const handleAddSeason = () => {
    setAddSeasonModal(true);
  };

  const handleDeleteSeason = async () => {
    if (!deleteModal.id) return;

    try {
      setDeleting(true);
      const response = await Axios.delete(`/api/season/${deleteModal.id}`);

      if (response.data.success) {
        toast.success("Season deleted successfully");
        setDeleteModal({ isOpen: false, type: null, id: null, name: "" });
        // Refresh seasons
        const res = await Axios.get(`/api/season/event/${eventId}`);
        setSeasons(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to delete season:", error);
      toast.error("Failed to delete season");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (season: Season) => {
    setDeleteModal({
      isOpen: true,
      type: "season",
      id: season._id,
      name: season.name,
    });
  };

  const handleSeasonSuccess = async () => {
    try {
      // Refresh seasons after successful create/edit
      const res = await Axios.get(`/api/season/event/${eventId}`);
      setSeasons(res.data.data || []);
      setAddSeasonModal(false);
      setEditSeasonModal({ isOpen: false, season: null });
    } catch (err) {
      console.error("Failed to refresh seasons:", err);
    }
  };

  const closeEditSeasonModal = () => {
    setEditSeasonModal({ isOpen: false, season: null });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, id: null, name: "" });
  };

  const handleEventEditSuccess = async () => {
    try {
      const res = await Axios.get(`/api/events/${eventId}`);
      setEvent(res.data.data);
      setEditEventModal(false);
    } catch (err) {
      console.error("Failed to refresh event:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-2xl text-red-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">
            Event Not Found
          </h3>
          <p className="text-gray-400 mb-6">{error || "Event not found"}</p>
          <Button onClick={() => router.push("/admin/events")}>
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={event.name}>
        <Button variant="default" onClick={() => setEditEventModal(true)}>
          <i className="ri-edit-line mr-2"></i>
          Edit Event
        </Button>
      </PageHeader>

      {/* Event Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Hero Section with Cover Image */}
        {event.coverImage && (
          <div className="relative h-80 lg:h-96 bg-gray-800 rounded-xl overflow-hidden">
            <Image
              src={normalizeImagePath(event.coverImage)}
              alt={event.name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
              <div className="space-y-4">
                {/* Management Badge */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${event.managedBy === "self"
                        ? "bg-green-500/20 text-green-300 border border-green-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                  >
                    <i
                      className={`mr-2 ${event.managedBy === "self"
                          ? "ri-user-settings-line"
                          : "ri-team-line"
                        }`}
                    ></i>
                    {event.managedBy === "self"
                      ? "Self Managed"
                      : "Partner Managed"}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm bg-gold-500/20 text-gold-300 border border-gold-500/40">
                    <i className="ri-calendar-line mr-2"></i>
                    Founded {new Date(event.createdAt).getFullYear()}
                  </span>
                </div>

                {/* Event Title & Subtitle */}
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">
                    {event.name}
                  </h1>
                  {event.subtitle && (
                    <p className="text-lg lg:text-xl text-gray-200 max-w-2xl">
                      {event.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-6">
          {/* Total Seasons */}
          <div className="bg-background2 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Total Seaons
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-100 mt-1">
                  {loading ? "..." : seasons.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-chat-quote-line text-blue-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-background2 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  Active Seasons
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-100 mt-1">
                  {loading
                    ? "..."
                    : seasons.filter((s) => s.status === "ongoing").length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-line text-indigo-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-background2 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-100 mt-1">
                  {loading
                    ? "..."
                    : seasons.filter((s) => s.status === "completed").length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <i className="ri-calendar-line text-indigo-400 text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Accordion */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center mb-1">
              <i className="ri-information-line mr-2 text-gold-500"></i>
              Event Details
            </h2>
            <p className="text-sm text-foreground/60">
              Explore detailed information about this event
            </p>
          </div>

          <div className="space-y-3">
            {/* Quote Accordion Item */}
            {event.quote && (
              <div
                className={`border border-gold-900/20 rounded-lg overflow-hidden ${isAccordionItemOpen("quote")
                    ? "bg-muted-background"
                    : "bg-background2"
                  }`}
              >
                <button
                  onClick={() => toggleAccordionItem("quote")}
                  className="w-full p-4 text-left hover:bg-gold-900/10 transition-colors focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                        <i className="ri-chat-quote-line text-gold-500 text-sm"></i>
                      </div>
                      <span className="text-sm font-medium text-foreground/60">
                        Event Quote
                      </span>
                    </div>
                    <i
                      className={`ri-arrow-${isAccordionItemOpen("quote") ? "up" : "down"
                        }-s-line text-foreground/60 transition-transform`}
                    ></i>
                  </div>
                </button>
                {isAccordionItemOpen("quote") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 border-t border-gold-900/20"
                  >
                    <div className="pl-12 pt-4">
                      <blockquote className="text-foreground italic leading-relaxed">
                        &quot;{event.quote}&quot;
                      </blockquote>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Purpose Accordion Item */}
            <div
              className={`border border-gold-900/20 rounded-lg overflow-hidden ${isAccordionItemOpen("purpose")
                  ? "bg-muted-background"
                  : "bg-background2"
                }`}
            >
              <button
                onClick={() => toggleAccordionItem("purpose")}
                className="w-full p-4 text-left hover:bg-gold-900/10 transition-colors focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                      <i className="ri-calendar-event-line text-gold-500 text-sm"></i>
                    </div>
                    <span className="text-sm font-medium text-foreground/60">
                      Event Purpose
                    </span>
                  </div>
                  <i
                    className={`ri-arrow-${isAccordionItemOpen("purpose") ? "up" : "down"
                      }-s-line text-foreground/60 transition-transform`}
                  ></i>
                </div>
              </button>
              {isAccordionItemOpen("purpose") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 pb-4 border-t border-gold-900/20"
                >
                  <div className="pl-12 pt-4">
                    <div className="flex items-start space-x-3">
                      {/* {event.purposeImage && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={normalizeImagePath(event.purposeImage)}
                            alt="Purpose"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )} */}
                      <p className="text-foreground leading-relaxed">
                        {event.purpose}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Timeline Accordion Item */}
            {event.timelineSubtitle && (
              <div
                className={`border border-gold-900/20 rounded-lg overflow-hidden ${isAccordionItemOpen("timeline")
                    ? "bg-muted-background"
                    : "bg-background2"
                  }`}
              >
                <button
                  onClick={() => toggleAccordionItem("timeline")}
                  className="w-full p-4 text-left hover:bg-gold-900/10 transition-colors focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                        <i className="ri-time-line text-gold-500 text-sm"></i>
                      </div>
                      <span className="text-sm font-medium text-foreground/60">
                        Event Timeline
                      </span>
                    </div>
                    <i
                      className={`ri-arrow-${isAccordionItemOpen("timeline") ? "up" : "down"
                        }-s-line text-foreground/60 transition-transform`}
                    ></i>
                  </div>
                </button>
                {isAccordionItemOpen("timeline") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 border-t border-gold-900/20"
                  >
                    <div className="pl-12 pt-4">
                      <div className="flex items-center space-x-3">
                        <p className="text-foreground leading-relaxed">
                          {event.timelineSubtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Seasons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">Seasons</h2>
            <p className="text-sm text-gray-400">
              Manage seasons for this event
            </p>
          </div>
          <Button variant="default" onClick={handleAddSeason}>
            <i className="ri-add-line mr-2"></i>
            Add Season
          </Button>
        </div>

        {seasons.length === 0 ? (
          <div className="bg-muted-background border border-gold-900/20 rounded-lg p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-2-line text-2xl text-gold-500"></i>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Seasons Found
              </h3>
              <p className="text-foreground/60 mb-6">
                This event doesn&apos;t have any seasons yet. Create your first
                season to get started.
              </p>
              <Button onClick={handleAddSeason}>
                <i className="ri-add-line mr-2"></i>
                Create First Season
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          >
            {seasons.map((season, index) => (
              <motion.div
                key={season._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-muted-background border border-gold-900/20 rounded-lg overflow-hidden hover:bg-gold-900/10 transition-colors group"
              >
                {/* Season Image */}
                <div className="relative h-48 bg-background2">
                  {(() => {
                    // Try different image sources in order of preference
                    const imageSource =
                      season.images && season.images.length > 0
                        ? season.images[0]
                        : season.titleImage
                          ? season.titleImage
                          : season.posterImage
                            ? season.posterImage
                            : season.image
                              ? season.image
                              : season.gallery && season.gallery.length > 0
                                ? season.gallery[0]
                                : null;

                    return imageSource ? (
                      <Image
                        src={normalizeImagePath(imageSource)}
                        alt={season.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-calendar-2-line text-4xl text-foreground/30"></i>
                      </div>
                    );
                  })()}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${season.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : season.status === "ongoing"
                            ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                    >
                      {season.status.charAt(0).toUpperCase() +
                        season.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Season Content */}
                <div className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gold-500">
                      {season.year}
                    </h3>
                    <span className="text-sm text-foreground/60">
                      {season.name}
                    </span>
                  </div>

                  <p className="text-xs lg:text-sm text-foreground/60 mb-4 line-clamp-2">
                    {season.description}
                  </p>

                  {/* Date Range */}
                  <div className="flex items-center text-xs lg:text-sm text-foreground/60 mb-4">
                    <i className="ri-calendar-line mr-2 text-gold-500"></i>
                    <span>
                      {new Date(season.startDate).toLocaleDateString()} -{" "}
                      {new Date(season.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSeason(season)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      <i className="ri-eye-line mr-1 lg:mr-2"></i>
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSeason(season)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      <i className="ri-edit-line mr-1 lg:mr-2"></i>
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(season)}
                      className="px-2 lg:px-3"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </Button>
                  </div>
                </div>

                {/* Footer with timestamp */}
                <div className="px-4 lg:px-6 py-3 bg-background2 border-t border-gold-900/20">
                  <p className="text-xs text-foreground/60">
                    Created {new Date(season.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Event Edit Modal */}
      <EventPopup
        isOpen={editEventModal}
        event={event as BackendEvent}
        onClose={() => setEditEventModal(false)}
        onSuccess={handleEventEditSuccess}
      />

      {/* Add Season Modal */}
      <SeasonPopup
        isOpen={addSeasonModal}
        season={null}
        eventId={eventId}
        onClose={() => setAddSeasonModal(false)}
        onSuccess={handleSeasonSuccess}
      />

      {/* Edit Season Modal */}
      <SeasonPopup
        isOpen={editSeasonModal.isOpen}
        season={editSeasonModal.season}
        eventId={eventId}
        onClose={closeEditSeasonModal}
        onSuccess={handleSeasonSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSeason}
        title="Delete Season"
        message={`Are you sure you want to delete "${deleteModal.name}"? This action cannot be undone and will also delete all associated contestants, jury members, and winners.`}
        isDeleting={deleting}
      />
    </div>
  );
}
