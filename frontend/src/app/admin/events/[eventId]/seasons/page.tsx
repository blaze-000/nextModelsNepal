"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import SeasonPopup, { BackendSeason } from "../SeasonPopup";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

interface Event {
  _id: string;
  name: string;
  overview: string;
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

export default function SeasonsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
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
    season: Season | null;
  }>({
    isOpen: false,
    season: null,
  });
  const [deleting, setDeleting] = useState(false);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
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
      season: season as unknown as BackendSeason,
    });
  };

  const handleAddSeason = () => {
    setAddSeasonModal(true);
  };

  const handleDeleteSeason = async () => {
    if (!deleteModal.season) return;

    try {
      setDeleting(true);
      const response = await Axios.delete(
        `/api/season/${deleteModal.season._id}`
      );

      if (response.data.success) {
        toast.success("Season deleted successfully");
        setDeleteModal({ isOpen: false, season: null });
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
    setDeleteModal({ isOpen: true, season });
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
    setDeleteModal({ isOpen: false, season: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading seasons...</p>
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
      <PageHeader
        title={`${event.name} - Seasons`}
        description={`Manage seasons for ${event.name}`}
      >
        <div className="flex gap-3">
          <AdminButton
            variant="outline"
            onClick={() => router.push(`/admin/events/${eventId}`)}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Event
          </AdminButton>
          <AdminButton onClick={handleAddSeason}>
            <i className="ri-add-line mr-2"></i>
            Add Season
          </AdminButton>
        </div>
      </PageHeader>

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
          transition={{ duration: 0.5 }}
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
        message={`Are you sure you want to delete "${deleteModal.season?.name}"? This action cannot be undone and will also delete all associated contestants, jury members, and winners.`}
        isDeleting={deleting}
      />
    </div>
  );
}
