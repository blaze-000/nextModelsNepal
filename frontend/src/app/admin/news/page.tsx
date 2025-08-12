"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { AdminButton } from "@/components/admin/AdminButton";
import NewsPopup from "./NewsPopup";

import Axios from "@/lib/axios-instance";
import { News, Event } from "@/types/admin";

// Statistics calculation hook
const useNewsStatistics = (news: News[]) => {
  return useMemo(() => {
    const total = news.length;
    const currentYear = new Date().getFullYear();
    const thisYear = news.filter(
      (article) => parseInt(article.year) === currentYear
    ).length;
    const lastYear = news.filter(
      (article) => parseInt(article.year) === currentYear - 1
    ).length;
    const withEvents = news.filter((article) => article.event).length;

    return { total, thisYear, lastYear, withEvents };
  }, [news]);
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const statistics = useNewsStatistics(news);

  // Fetch news function
  const fetchNews = useCallback(() => {
    setLoading(true);
    Axios.get("/api/news")
      .then((response) => {
        if (response.data.success && response.data.data) {
          setNews(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch news");
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        toast.error("Failed to load news");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch events function
  const fetchEvents = useCallback(() => {
    Axios.get("/api/events")
      .then((response) => {
        if (response.data.success && response.data.data) {
          setEvents(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, [fetchNews, fetchEvents]);

  // Modal handlers
  const handleCreateNews = useCallback(() => {
    setEditingNews(null);
    setIsPopupOpen(true);
  }, []);

  const handleEditNews = useCallback((newsItem: News) => {
    setEditingNews(newsItem);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setEditingNews(null);
  }, []);

  const handleDeleteNews = useCallback(
    (newsItem: News) => {
      const confirmMessage = `Are you sure you want to delete "${newsItem.title}"? This action cannot be undone.`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      Axios.delete(`/api/news/${newsItem._id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success("News article deleted successfully");
            fetchNews(); // Refresh the list
          } else {
            toast.error(response.data.message || "Failed to delete news");
          }
        })
        .catch((error) => {
          console.error("Error deleting news:", error);
          toast.error("Failed to delete news article");
        });
    },
    [fetchNews]
  );

  const handlePopupSuccess = useCallback(() => {
    fetchNews(); // Refresh the list after successful create/edit
  }, [fetchNews]);

  // Table columns configuration
  const tableColumns = useMemo(
    () => [
      {
        key: "images",
        label: "Photo",
        sortable: false,
        render: (value: unknown) => (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
            {value && Array.isArray(value) && value.length > 0 ? (
              <Image
                src={`http://localhost:8000/${value[0]}`}
                alt="News image"
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
        key: "title",
        label: "Title",
        sortable: true,
        render: (value: unknown) => (
          <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
            {String(value)}
          </div>
        ),
      },
      {
        key: "description",
        label: "Description",
        sortable: false,
        render: (value: unknown) => (
          <div
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-40 sm:max-w-xs"
            title={String(value)}
          >
            {String(value)}
          </div>
        ),
      },
      {
        key: "year",
        label: "Year",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded font-medium">
            {String(value)}
          </span>
        ),
      },
      {
        key: "event",
        label: "Event",
        sortable: false,
        render: (value: unknown) => {
          if (!value) {
            return (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                No event
              </span>
            );
          }
          const linkedEvent = events.find((event) => event._id === value);
          return linkedEvent ? (
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded font-medium">
              {linkedEvent.title}
            </span>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Unknown event
            </span>
          );
        },
      },
      {
        key: "images",
        label: "Gallery",
        sortable: false,
        render: (value: unknown) => {
          const images = value as string[];
          const count = images?.length || 0;
          return (
            <div className="flex items-center">
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded font-medium">
                {count} {count === 1 ? "image" : "images"}
              </span>
            </div>
          );
        },
      },
    ],
    [events]
  );

  // Statistics card data
  const statisticsCards = useMemo(
    () => [
      {
        title: "Total Articles",
        value: statistics.total,
        icon: "ri-newspaper-line",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "This Year",
        value: statistics.thisYear,
        icon: "ri-calendar-line",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        title: "Last Year",
        value: statistics.lastYear,
        icon: "ri-history-line",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        textColor: "text-yellow-600 dark:text-yellow-400",
      },
      {
        title: "With Events",
        value: statistics.withEvents,
        icon: "ri-links-line",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        textColor: "text-purple-600 dark:text-purple-400",
      },
    ],
    [statistics]
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-6 lg:p-2">
      <PageHeader
        title="News Management"
        description="Manage news articles and press coverage for your website"
      >
        <AdminButton onClick={handleCreateNews} className="w-full sm:w-auto">
          Add News Article
        </AdminButton>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statisticsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {loading ? "..." : card.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${card.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <i
                  className={`${card.icon} ${card.textColor} text-lg sm:text-xl`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Table */}
      <div className=" rounded-lg overflow-hidden transition-colors duration-200">
        <DataTable
          data={news}
          columns={tableColumns}
          onEdit={handleEditNews}
          onDelete={handleDeleteNews}
          loading={loading}
          emptyMessage="No news articles found. Create your first article to get started."
          searchPlaceholder="Search news by title, description, or year..."
        />
      </div>

      {/* News Popup */}
      <NewsPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        editingNews={editingNews}
        onSuccess={handlePopupSuccess}
      />
    </div>
  );
}
