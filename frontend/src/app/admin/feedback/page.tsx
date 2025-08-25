"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import FeedbackPopup from "@/app/admin/feedback/FeedbackPopup";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { FeedbackItem } from "@/types/admin";

export default function FeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeedbackItem | null>(null);

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null as FeedbackItem | null,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/feedback");
      const data = response.data;

      setFeedbackItems(data.success && data.data ? data.data : []);
    } catch (error) {
      toast.error("Failed to fetch feedback data");
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FeedbackItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: FeedbackItem) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;

    try {
      setSubmitting(true);
      const response = await Axios.delete(
        `/api/feedback/${deleteModal.item._id}`
      );
      if (response.data.success) {
        toast.success("Feedback deleted successfully");
        setDeleteModal({ isOpen: false, item: null });
        fetchFeedback();
      } else {
        toast.error("Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handlePopupSuccess = () => {
    fetchFeedback();
  };

  // Dashboard-style statistics
  const totalFeedback = feedbackItems.length;
  const thisMonthFeedback = feedbackItems.filter((item) => {
    if (!item.createdAt) return false;
    const d = new Date(item.createdAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;
  const lastMonthFeedback = feedbackItems.filter((item) => {
    if (!item.createdAt) return false;
    const d = new Date(item.createdAt);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      d.getMonth() === lastMonth.getMonth() &&
      d.getFullYear() === lastMonth.getFullYear()
    );
  }).length;
  const statsData = [
    {
      title: "Total Feedback",
      value: totalFeedback,
      icon: "ri-chat-quote-line",
      change: totalFeedback > 0 ? `+${totalFeedback}%` : "0%",
    },
    {
      title: "This Month",
      value: thisMonthFeedback,
      icon: "ri-calendar-line",
      change:
        totalFeedback > 0
          ? `+${Math.round((thisMonthFeedback / totalFeedback) * 100)}%`
          : "0%",
    },
    {
      title: "Last Month",
      value: lastMonthFeedback,
      icon: "ri-history-line",
      change:
        totalFeedback > 0
          ? `+${Math.round((lastMonthFeedback / totalFeedback) * 100)}%`
          : "0%",
    },
  ];

  // Table columns
  const columns = [
    {
      key: "image",
      label: "Photo",
      render: (value: unknown) => (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
          {value && typeof value === "string" ? (
            <Image
              src={normalizeImagePath(value)}
              alt="Feedback"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
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
        <div className="font-medium text-sm sm:text-base">{String(value)}</div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (value: unknown) => (
        <div className="text-xs sm:text-sm text-gray-500 line-clamp-2 max-w-40 sm:max-w-xs">
          {String(value)}
        </div>
      ),
    },
    {
      key: "order",
      label: "Order",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
          #{value !== undefined && value !== null ? String(value) : ""}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-6 p-2 sm:p-6 lg:p-2">
      <PageHeader
        title="Feedback Management"
        description="Manage customer feedback and testimonials for your website"
      >
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          Add New Feedback
        </Button>
      </PageHeader>

 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-6">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 sm:h-4 bg-gold-900/30 rounded w-20 sm:w-24 mb-2"></div>
                    <div className="h-5 sm:h-6 bg-gold-900/30 rounded w-12 sm:w-16 mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-10 sm:w-12"></div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-900/30 rounded-lg"></div>
                </div>
              </div>
            ))
          : statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6 hover:bg-gold-900/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs sm:text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-gold-500 text-xs sm:text-sm mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                    <i
                      className={`${stat.icon} text-gold-500 text-lg sm:text-xl`}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Feedback Table */}
      <div className="overflow-hidden">
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
        onSuccess={handlePopupSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Feedback"
        message={`Are you sure you want to delete feedback from "${deleteModal.item?.name}"? This action cannot be undone.`}
        confirmText="Delete Feedback"
        isDeleting={submitting}
      />
    </div>
  );
}
