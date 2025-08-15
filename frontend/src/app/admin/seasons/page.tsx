"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import { AdminButton } from "@/components/admin/AdminButton";
import AllSeasonsPopup, { BackendSeason } from "./AllSeasonsPopup";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

// Types
interface Event {
  _id: string;
  name: string;
  overview: string;
}

// Using BackendSeason from AllSeasonsPopup for consistency
type Season = BackendSeason;

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AllSeasonsPage() {
  const router = useRouter();

  // State
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [addSeasonModal, setAddSeasonModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    eventId: "",
  });

  // Fetch events for filter dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await Axios.get("/api/events?limit=100");
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  // Fetch seasons data
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          sort: "createdAt",
          order: "desc",
        });

        if (filters.eventId) {
          params.append("eventId", filters.eventId);
        }

        const res = await Axios.get(`/api/season?${params.toString()}`);
        setSeasons(res.data.data || []);
        setPagination((prev) => ({
          ...prev,
          ...res.data.pagination,
        }));
      } catch (err) {
        console.error("Failed to fetch seasons:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch seasons"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
  }, [filters, pagination.page, pagination.limit]);

  // Handlers
  const handleViewSeason = (season: Season) => {
    const eventId =
      typeof season.eventId === "string" ? season.eventId : season.eventId._id;
    router.push(`/admin/events/${eventId}/seasons/${season._id}`);
  };

  const handleEventFilter = (eventId: string) => {
    setFilters({ eventId });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleAddSeason = () => {
    setAddSeasonModal(true);
  };

  const handleSeasonSuccess = async () => {
    try {
      // Refresh seasons after successful create
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: "createdAt",
        order: "desc",
      });

      if (filters.eventId) {
        params.append("eventId", filters.eventId);
      }

      const res = await Axios.get(`/api/season?${params.toString()}`);
      setSeasons(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        ...res.data.pagination,
      }));
      setAddSeasonModal(false);
    } catch (err) {
      console.error("Failed to refresh seasons:", err);
    }
  };

  if (loading && seasons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading seasons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
        <i className="ri-error-warning-line text-3xl text-red-400 mb-4"></i>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
        <p className="text-red-300">{error}</p>
        <AdminButton
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          <i className="ri-refresh-line mr-2"></i>
          Retry
        </AdminButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Seasons"
        description="Manage seasons across all events"
      >
        <AdminButton onClick={handleAddSeason}>
          <i className="ri-add-line mr-2"></i>
          Add Season
        </AdminButton>
      </PageHeader>

      {/* Event Filter Buttons and Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-400 text-sm font-medium">
            Filter by Event:
          </span>
          <AdminButton
            size="sm"
            variant={!filters.eventId ? "default" : "outline"}
            onClick={() => handleEventFilter("")}
          >
            All Events
          </AdminButton>
          {events.map((event) => (
            <AdminButton
              key={event._id}
              size="sm"
              variant={filters.eventId === event._id ? "default" : "outline"}
              onClick={() => handleEventFilter(event._id)}
            >
              {event.name}
            </AdminButton>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-gray-400">
            Showing {seasons.length} of {pagination.total} seasons
          </p>
          {loading && (
            <div className="flex items-center text-gray-400">
              <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading...
            </div>
          )}
        </div>
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
              {filters.eventId
                ? "No seasons match your current filters."
                : "No seasons have been created yet."}
            </p>
            {filters.eventId && (
              <AdminButton
                onClick={() => {
                  setFilters({
                    eventId: "",
                  });
                }}
              >
                Clear Filters
              </AdminButton>
            )}
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
                {season.image ? (
                  <Image
                    src={normalizeImagePath(season.image)}
                    alt={`Season ${season.year}`}
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
                      season.status === "ended"
                        ? "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        : season.status === "ongoing"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {season.status.charAt(0).toUpperCase() +
                      season.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Season Content */}
              <div className="p-4 lg:p-6">
                {/* Event Name */}
                <div className="mb-2">
                  <span className="text-xs text-gold-400 font-medium bg-gold-500/10 px-2 py-1 rounded">
                    {typeof season.eventId === "string"
                      ? "Unknown Event"
                      : season.eventId.name}
                  </span>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-100 line-clamp-1 flex-1">
                    Season {season.year}
                  </h3>
                  <span className="text-sm text-gold-400 font-medium ml-2">
                    {season.year}
                  </span>
                </div>

                {/* Date Range */}
                <div className="flex items-center text-xs lg:text-sm text-gray-400 mb-4">
                  <i className="ri-calendar-line mr-2"></i>
                  <span>
                    {season.startDate
                      ? new Date(season.startDate).toLocaleDateString()
                      : "TBD"}{" "}
                    - {new Date(season.endDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Price per Vote */}
                <div className="flex items-center text-xs lg:text-sm text-gray-400 mb-4">
                  <i className="ri-money-dollar-circle-line mr-2"></i>
                  <span>₹{season.pricePerVote} per vote</span>
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
                    View Details
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <i className="ri-arrow-left-line"></i>
          </AdminButton>

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = Math.max(
              1,
              Math.min(pagination.page - 2 + i, pagination.pages - 4 + i)
            );
            return (
              <AdminButton
                key={pageNum}
                variant={pagination.page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </AdminButton>
            );
          })}

          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            <i className="ri-arrow-right-line"></i>
          </AdminButton>
        </div>
      )}

      {/* Add Season Modal */}
      <AllSeasonsPopup
        isOpen={addSeasonModal}
        onClose={() => setAddSeasonModal(false)}
        season={null}
        events={events}
        onSuccess={handleSeasonSuccess}
      />
    </div>
  );
}
