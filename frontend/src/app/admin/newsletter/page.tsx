"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import DataTable from "@/components/admin/DataTable";
import BulkNewsletterPopup from "@/components/admin/BulkNewsletterPopup";
import NewsletterDetailsPopup from "@/components/admin/NewsletterDetailsPopup";
import SubscribedEmailsPopup from "@/components/admin/SubscribedEmailsPopup";

// API Functions
const getSentNewsletters = async () => {
  const response = await Axios.get("/api/newsletter/sent");
  return response.data;
};

const deleteSentNewsletter = async (id: string) => {
  const response = await Axios.delete(`/api/newsletter/sent/${id}`);
  return response.data;
};



interface SentNewsletter {
  _id: string;
  title: string;
  description: string;
  descriptionOpt?: string;
  image?: string[];
  imageOpt?: string[];
  linkLabel?: string;
  link?: string;
  websiteLink?: string;
  sentTo: number;
  totalSubscribers: number;
  failedCount: number;
  status: 'sent' | 'failed' | 'partial';
  createdAt: string;
}

const NewsletterPage = () => {
  const [sentNewsletters, setSentNewsletters] = useState<SentNewsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBulkNewsletterOpen, setIsBulkNewsletterOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubscribedEmailsOpen, setIsSubscribedEmailsOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<SentNewsletter | null>(null);

  // Fetch all sent newsletters
  const fetchSentNewsletters = async () => {
    try {
      setLoading(true);
      const response = await getSentNewsletters();
      setSentNewsletters(response.data || []);
    } catch (error: unknown) {
      console.error("Error fetching sent newsletters:", error);
      toast.error("Failed to load newsletter history");
    } finally {
      setLoading(false);
    }
  };

  // Delete a sent newsletter
  const handleDelete = async (newsletter: SentNewsletter) => {
    if (!confirm("Are you sure you want to delete this newsletter record?")) {
      return;
    }
    try {
      await deleteSentNewsletter(newsletter._id);
      setSentNewsletters(sentNewsletters.filter(n => n._id !== newsletter._id));
      toast.success("Newsletter record deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting newsletter record:", error);
      toast.error("Failed to delete newsletter record");
    }
  };



  // Show newsletter details
  const handleShowDetails = (newsletter: SentNewsletter) => {
    setSelectedNewsletter(newsletter);
    setIsDetailsOpen(true);
  };

  // Load newsletters on component mount
  useEffect(() => {
    fetchSentNewsletters();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { color: "bg-green-100 text-green-800", text: "Sent" },
      failed: { color: "bg-red-100 text-red-800", text: "Failed" },
      partial: { color: "bg-yellow-100 text-yellow-800", text: "Partial" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.sent;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Define table columns
  const columns = [
    {
      key: "title",
      label: "Title",
      render: (value: unknown, row: SentNewsletter) => (
        <button
          onClick={() => handleShowDetails(row)}
          className="font-medium text-primary hover:text-gold-500 transition-colors cursor-pointer text-left"
        >
          {String(value)}
        </button>
      ),
      sortable: true,
    },
    {
      key: "sentTo",
      label: "Sent To",
      render: (value: unknown, row: SentNewsletter) => (
        <span className="text-sm">
          {row.sentTo} / {row.totalSubscribers}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => getStatusBadge(String(value)),
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Sent Date",
      render: (value: unknown) => formatDate(String(value)),
      sortable: true,
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-newsreader text-primary">Newsletter History</h1>
          <p className="text-foreground/70 mt-2">Manage sent newsletters and subscribers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button
            onClick={() => setIsBulkNewsletterOpen(true)}
            className="bg-gold-500 hover:bg-gold-400 text-primary-foreground"
          >
            <i className="ri-mail-send-line mr-2" />
            Send Bulk Newsletter
          </Button>
          <Button
            onClick={() => setIsSubscribedEmailsOpen(true)}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            <i className="ri-user-line mr-2" />
            Subscribed Emails
          </Button>
          <Button
            onClick={fetchSentNewsletters}
            variant="outline"
            className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
          >
            <i className="ri-refresh-line mr-2" />
            Refresh
          </Button>

        </div>
      </div>

      <DataTable
        data={sentNewsletters}
        columns={columns}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No newsletter history found"
        searchPlaceholder="Search newsletter titles..."
        itemsPerPage={15}
      />

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-foreground/50">
          Showing {sentNewsletters.length} newsletter{sentNewsletters.length !== 1 ? "s" : ""}
        </p>
        <div className="text-sm text-foreground/50">
          <i className="ri-mail-line mr-1" />
          Total Sent: {sentNewsletters.length}
        </div>
      </div>

      {/* Bulk Newsletter Popup */}
      <BulkNewsletterPopup
        isOpen={isBulkNewsletterOpen}
        onClose={() => setIsBulkNewsletterOpen(false)}
        onSuccess={() => {
          toast.success("Bulk newsletter sent successfully!");
          fetchSentNewsletters(); // Refresh the list
        }}
      />

      {/* Newsletter Details Popup */}
      <NewsletterDetailsPopup
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedNewsletter(null);
        }}
        newsletter={selectedNewsletter}
      />

      {/* Subscribed Emails Popup */}
      <SubscribedEmailsPopup
        isOpen={isSubscribedEmailsOpen}
        onClose={() => setIsSubscribedEmailsOpen(false)}
      />
    </div>
  );
};

export default NewsletterPage;
