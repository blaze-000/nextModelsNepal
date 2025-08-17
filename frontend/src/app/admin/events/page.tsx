"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/admin/PageHeader";

import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import EventPopup, { BackendEvent } from "./EventPopup";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function EventsAdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BackendEvent | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    event: Event | null;
  }>({
    isOpen: false,
    event: null,
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `/api/events?page=${pagination.page}&limit=${pagination.limit}`
      );
      const data = response.data;

      if (data.success) {
        setEvents(data.data || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsPopupOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    // Convert Event to BackendEvent format for the popup
    const backendEvent: BackendEvent = {
      _id: event._id,
      name: event.name,
      overview: event.overview,
      titleImage: event.titleImage,
      coverImage: event.coverImage,
      subtitle: event.subtitle,
      quote: event.quote,
      purpose: event.purpose,
      purposeImage: event.purposeImage,
      timelineSubtitle: event.timelineSubtitle,
      managedBy: event.managedBy,
      seasons: event.seasons,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
    setEditingEvent(backendEvent);
    setIsPopupOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    router.push(`/admin/events/${event._id}`);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingEvent(null);
  };

  const handlePopupSuccess = () => {
    fetchEvents(); // Refresh the list after successful create/edit
  };

  const handleDelete = async () => {
    if (!deleteModal.event) return;

    try {
      setDeleting(true);
      const response = await Axios.delete(
        `/api/events/${deleteModal.event._id}`
      );

      if (response.data.success) {
        toast.success("Event deleted successfully");
        setDeleteModal({ isOpen: false, event: null });
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (event: Event) => {
    setDeleteModal({ isOpen: true, event });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, event: null });
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        description="Manage your events and seasons"
      >
        <Button variant="default" onClick={handleAddEvent}>
          <i className="ri-add-line mr-2"></i>
          Add Event
        </Button>
      </PageHeader>

      {events.length === 0 ? (
        <div className="bg-muted-background rounded-lg border border-gray-600 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-calendar-event-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-400 mb-6">
              You haven&apos;t created any events yet. Create your first event
              to get started.
            </p>
            <Button variant="default" onClick={handleAddEvent}>
              <i className="ri-add-line mr-2"></i>
              Create Your First Event
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-muted-background rounded-lg border border-gray-600 overflow-hidden hover:border-gray-500 transition-colors group"
              >
                {/* Event Image */}
                <div className="relative h-48 bg-gray-800">
                  {event.coverImage ? (
                    <Image
                      src={normalizeImagePath(event.coverImage)}
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-image-line text-4xl text-gray-600"></i>
                    </div>
                  )}

                  {/* Managed By Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${event.managedBy === "self"
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

                {/* Event Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-base lg:text-xl font-newsreader font-semibold text-gold-500 line-clamp-2 flex-1">
                      {event.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-300 mb-2 line-clamp-1">
                    {event.subtitle}
                  </p>
                  {/* Seasons Count */}
                  <div className="flex items-center text-xs lg:text-sm text-gray-400 mb-4">
                    <i className="ri-calendar-2-line mr-2"></i>
                    <span>{event.seasons?.length} Seasons</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEvent(event)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      <i className="ri-eye-line mr-1 lg:mr-2"></i>
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      className="flex-1 text-xs lg:text-sm"
                    >
                      <i className="ri-edit-line mr-1 lg:mr-2"></i>
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(event)}
                      className="px-2 lg:px-3"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </Button>
                  </div>
                </div>

                {/* Footer with timestamp */}
                <div className="px-4 lg:px-6 py-3 bg-gray-800/50 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    Created {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center items-center gap-2 mt-8"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <i className="ri-arrow-left-line"></i>
              </Button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                <i className="ri-arrow-right-line"></i>
              </Button>
            </motion.div>
          )}
        </>
      )}

      {/* Event Popup */}
      <EventPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        event={editingEvent}
        onSuccess={handlePopupSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and will also delete all associated seasons."
        isDeleting={deleting}
      />
    </div>
  );
}
