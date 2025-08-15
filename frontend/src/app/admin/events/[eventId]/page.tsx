"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import EventPopup, { BackendEvent } from "../EventPopup";
import SeasonPopup, { BackendSeason } from "./SeasonPopup";
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
  const eventId = params.eventId as string;

  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setSeasons(res.data.data || []);
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
          <AdminButton onClick={() => router.push("/admin/events")}>
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Events
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={event.name} description={event.overview}>
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
        className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden"
      >
        {/* Event Cover Image */}
        {event.coverImage && (
          <div className="relative h-64 bg-gray-800">
            <Image
              src={normalizeImagePath(event.coverImage)}
              alt={event.name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.managedBy === "self"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {event.managedBy === "self"
                  ? "Self Managed"
                  : "Partner Managed"}
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Event Details
              </h3>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-400 mb-1">
                    Subtitle
                  </dt>
                  <dd className="text-sm text-gray-200">{event.subtitle}</dd>
                </div>
                {event.quote && (
                  <div>
                    <dt className="text-sm font-medium text-gray-400 mb-1">
                      Quote
                    </dt>
                    <dd className="text-sm text-gray-200 italic">
                      &quot;{event.quote}&quot;
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-400 mb-1">
                    Purpose
                  </dt>
                  <dd className="text-sm text-gray-200">{event.purpose}</dd>
                </div>
                {event.timelineSubtitle && (
                  <div>
                    <dt className="text-sm font-medium text-gray-400 mb-1">
                      Timeline
                    </dt>
                    <dd className="text-sm text-gray-200">
                      {event.timelineSubtitle}
                    </dd>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gold-400 mb-1">
                    {seasons.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Seasons</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gold-400 mb-1">
                    {new Date(event.createdAt).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-400">Founded</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Created {new Date(event.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seasons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">Seasons</h2>
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
          <div className="bg-muted-background rounded-lg border border-gray-600 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-2-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                No Seasons Found
              </h3>
              <p className="text-gray-400 mb-6">
                This event doesn&apos;t have any seasons yet. Create your first
                season to get started.
              </p>
              <AdminButton onClick={handleAddSeason}>
                <i className="ri-add-line mr-2"></i>
                Create First Season
              </AdminButton>
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
                className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden hover:border-gray-500 transition-colors group"
              >
                {/* Season Image */}
                <div className="relative h-48 bg-gray-800">
                  {season.images && season.images.length > 0 ? (
                    <Image
                      src={normalizeImagePath(season.images[0])}
                      alt={season.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-calendar-2-line text-4xl text-gray-600"></i>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        season.status === "completed"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : season.status === "ongoing"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {season.status.charAt(0).toUpperCase() +
                        season.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Season Content */}
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-100 line-clamp-1 flex-1">
                      {season.name}
                    </h3>
                    <span className="text-sm text-gold-400 font-medium ml-2">
                      {season.year}
                    </span>
                  </div>

                  <p className="text-xs lg:text-sm text-gray-400 mb-4 line-clamp-2">
                    {season.description}
                  </p>

                  {/* Date Range */}
                  <div className="flex items-center text-xs lg:text-sm text-gray-400 mb-4">
                    <i className="ri-calendar-line mr-2"></i>
                    <span>
                      {new Date(season.startDate).toLocaleDateString()} -{" "}
                      {new Date(season.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSeason(season)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      <i className="ri-eye-line mr-1 lg:mr-2"></i>
                      View
                    </AdminButton>

                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSeason(season)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      <i className="ri-edit-line mr-1 lg:mr-2"></i>
                      Edit
                    </AdminButton>

                    <AdminButton
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(season)}
                      className="px-2 lg:px-3"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </AdminButton>
                  </div>
                </div>

                {/* Footer with timestamp */}
                <div className="px-4 lg:px-6 py-3 bg-gray-800/50 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
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
