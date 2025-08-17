"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import DataTable from "@/components/admin/DataTable";

interface NewsletterEmail {
  _id: string;
  email: string;
  createdAt: string;
}

const NewsletterPage = () => {
  const [newsletters, setNewsletters] = useState<NewsletterEmail[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all newsletter subscriptions
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/newsletter");
      setNewsletters(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching newsletter subscriptions:", error);
      toast.error("Failed to load newsletter subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Delete a newsletter subscription
  const handleDelete = async (newsletter: NewsletterEmail) => {
    if (!confirm("Are you sure you want to delete this newsletter subscription?")) {
      return;
    }
    try {
      await Axios.delete(`/api/newsletter/${newsletter._id}`);
      setNewsletters(newsletters.filter(n => n._id !== newsletter._id));
      toast.success("Newsletter subscription deleted successfully");
    } catch (error: any) {
      console.error("Error deleting newsletter subscription:", error);
      toast.error("Failed to delete newsletter subscription");
    }
  };

  // Load newsletters on component mount
  useEffect(() => {
    fetchNewsletters();
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

  // Define table columns
  const columns = [
    {
      key: "email",
      label: "Email Address",
      render: (value: unknown) => (
        <span className="font-medium text-primary">
          {String(value)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Subscribed Date",
      render: (value: unknown) => formatDate(String(value)),
      sortable: true,
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-newsreader text-primary">Newsletter Subscriptions</h1>
          <p className="text-foreground/70 mt-2">Manage newsletter email subscriptions</p>
        </div>
        <Button
          onClick={fetchNewsletters}
          variant="outline"
          className="mt-4 md:mt-0 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
        >
          <i className="ri-refresh-line mr-2" />
          Refresh
        </Button>
      </div>

      <DataTable
        data={newsletters}
        columns={columns}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No newsletter subscriptions found"
        searchPlaceholder="Search email addresses..."
        itemsPerPage={15}
      />

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-foreground/50">
          Showing {newsletters.length} subscription{newsletters.length !== 1 ? "s" : ""}
        </p>
        <div className="text-sm text-foreground/50">
          <i className="ri-mail-line mr-1" />
          Total Subscribers: {newsletters.length}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
