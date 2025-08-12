"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import FeedbackPopup from "@/app/admin/feedback/FeedbackPopup";
import { AdminButton } from "@/components/admin/AdminButton";
import Axios from "@/lib/axios-instance";
import { FeedbackItem, Feedback } from "@/types/admin";

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalFeedback: 0,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackItem | null>(null);

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/feedback");
      const data = response.data;

      if (data.success && data.data) {
        const feedbackDocuments = data.data as Feedback;
        setFeedbackData(feedbackDocuments);
        setStatistics({
          totalFeedback: feedbackDocuments?.item?.length || 0,
        });
      } else {
        setFeedbackData(null);
        setStatistics({ totalFeedback: 0 });
      }
    } catch (error) {
      toast.error("Failed to fetch feedback data");
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Modal handlers
  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: FeedbackItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (item: FeedbackItem) => {
      if (
        !confirm(
          `Are you sure you want to delete feedback from "${item.name}"?`
        )
      )
        return;

      try {
        if (!feedbackData) return;

        // Use the existing endpoint with itemIndex query parameter
        const response = await Axios.delete(
          `/api/feedback/${feedbackData._id}?itemIndex=${item.index}`
        );

        const data = response.data;
        if (data.success) {
          toast.success("Feedback deleted successfully");
          fetchFeedback();
        } else {
          toast.error("Failed to delete feedback");
        }
      } catch (error) {
        console.error("Error deleting feedback:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete feedback";
        toast.error(errorMessage);
      }
    },
    [feedbackData, fetchFeedback]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handlePopupSuccess = useCallback(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Table columns configuration
  const columns = [
    {
      key: "images",
      label: "Photo",
      render: (value: unknown) => (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
          {value && typeof value === "string" ? (
            <Image
              src={`http://localhost:8000/${String(value)}`}
              alt="Feedback"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <i className="ri-image-line text-xl" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
          {String(value)}
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (value: unknown) => (
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-40 sm:max-w-xs">
          {String(value)}
        </div>
      ),
    },
    {
      key: "index",
      label: "Order",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
          #{String(value)}
        </span>
      ),
    },
  ];

  const feedbackItems =
    feedbackData?.item.map((item, arrayIndex) => ({
      ...item,
      _id: `${feedbackData._id}-${arrayIndex}`, // Create a unique ID for DataTable
    })) || [];

  return (
    <div className="space-y-6 sm:space-y-6 p-2 sm:p-6 lg:p-2">
      <PageHeader
        title="Feedback Management"
        description="Manage customer feedback and testimonials for your website"
      >
        <AdminButton onClick={handleCreate} className="w-full sm:w-auto">
          Add New Feedback
        </AdminButton>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Feedback
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {loading ? "..." : statistics.totalFeedback}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-chat-quote-line text-blue-600 dark:text-blue-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Published
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {loading ? "..." : statistics.totalFeedback}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-check-line text-green-600 dark:text-green-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                This Month
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {loading ? "..." : "0"}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-calendar-line text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Rating
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {loading ? "..." : "5.0"}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-star-line text-yellow-600 dark:text-yellow-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <DataTable
          data={feedbackItems}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No feedback found. Add your first feedback to get started."
          searchPlaceholder="Search feedback..."
        />
      </div>

      {/* Add/Edit Modal */}
      <FeedbackPopup
        isOpen={isModalOpen}
        onClose={closeModal}
        editingItem={editingItem}
        feedbackData={feedbackData}
        onSuccess={handlePopupSuccess}
      />
    </div>
  );
}
