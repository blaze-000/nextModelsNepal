"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import NewsPopup from "./NewsPopup";

import Axios from "@/lib/axios-instance";
import { News, Event } from "@/types/admin";
import { normalizeImagePath } from "@/lib/utils";

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

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/api/news");
      console.log(response.data.data);
      setNews(response.data.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await Axios.get("/api/events");
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    }
  };

  // Fetch news list
  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  // Modal handlers
  const handleCreateNews = () => {
    setEditingNews(null);
    setIsPopupOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingNews(null);
  };

  const handleDeleteNews = async (newsItem: News) => {
    const confirmMessage = `Are you sure you want to delete "${newsItem.title}"? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await Axios.delete(`/api/news/${newsItem._id}`);
      toast.success("News article deleted successfully");
      fetchNews(); // Refresh the list
    } catch {
      toast.error("Failed to delete news article");
    }
  };

  const handlePopupSuccess = () => {
    fetchNews(); // Refresh the list after successful create/edit
  };

  // Table columns configuration
  const tableColumns = useMemo(
    () => [
      {
        key: "image",
        label: "Photo",
        sortable: false,
        render: (value: unknown) => (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
            {value ? (
              <Image
                src={normalizeImagePath(value as string)}
                alt="News image"
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
        key: "title",
        label: "Title",
        sortable: true,
        render: (value: unknown) => (
          <div className="font-medium text-sm sm:text-base text-gray-100">
            {String(value)}
          </div>
        ),
      },
      {
        key: "type",
        label: "Type",
        sortable: false,
        render: (value: unknown) => {
          const typeColors = {
            Interview: "bg-blue-900/30 text-blue-400",
            Feature: "bg-green-900/30 text-green-400",
            Announcement: "bg-purple-900/30 text-purple-400",
          };
          const colorClass =
            typeColors[value as keyof typeof typeColors] ||
            "bg-gray-900/30 text-gray-400";
          return (
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${colorClass}`}
            >
              {String(value)}
            </span>
          );
        },
      },
      {
        key: "year",
        label: "Year",
        sortable: true,
        render: (value: unknown) => (
          <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded font-medium">
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
            return <span className="text-xs text-gray-500">No event</span>;
          }

          // Handle both string (ID) and object (populated) event values
          let eventName = "";
          if (typeof value === "string") {
            const linkedEvent = events.find((event) => event._id === value);
            eventName = linkedEvent ? linkedEvent.name : "";
          } else if (
            typeof value === "object" &&
            value !== null &&
            "name" in value
          ) {
            eventName = (value as { name: string }).name;
          }

          return eventName ? (
            <span className="text-xs bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded font-medium">
              {eventName}
            </span>
          ) : (
            <span className="text-xs text-gray-500">Unknown event</span>
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
        bgColor: "bg-blue-900/30",
        textColor: "text-blue-400",
      },
      {
        title: "This Year",
        value: statistics.thisYear,
        icon: "ri-calendar-line",
        bgColor: "bg-green-900/30",
        textColor: "text-green-400",
      },
      {
        title: "Last Year",
        value: statistics.lastYear,
        icon: "ri-history-line",
        bgColor: "bg-yellow-900/30",
        textColor: "text-yellow-400",
      },
      {
        title: "With Events",
        value: statistics.withEvents,
        icon: "ri-links-line",
        bgColor: "bg-purple-900/30",
        textColor: "text-purple-400",
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
        <Button onClick={handleCreateNews} className="w-full sm:w-auto">
          Add News Article
        </Button>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statisticsCards.map((card, index) => (
          <div
            key={index}
            className="bg-background2 rounded-lg border border-gray-700 p-4 sm:p-6 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">
                  {card.title}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-100 mt-1">
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
          searchPlaceholder="Search news by title, type, or year..."
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
