"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";

// API Functions
const getNewsletterSubscribers = async () => {
  const response = await Axios.get("/api/newsletter/all");
  return response.data;
};

const deleteNewsletterSubscription = async (id: string) => {
  const response = await Axios.delete(`/api/newsletter/delete/${id}`);
  return response.data;
};

interface SubscribedEmailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewsletterEmail {
  _id: string;
  email: string;
  createdAt: string;
}

export default function SubscribedEmailsPopup({ isOpen, onClose }: SubscribedEmailsPopupProps) {
  const [subscribers, setSubscribers] = useState<NewsletterEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subscribers when popup opens
  useEffect(() => {
    if (isOpen) {
      fetchSubscribers();
    }
  }, [isOpen]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await getNewsletterSubscribers();
      setSubscribers(response.data || []);
    } catch (error: unknown) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriber: NewsletterEmail) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }
    try {
      await deleteNewsletterSubscription(subscriber._id);
      setSubscribers(subscribers.filter(s => s._id !== subscriber._id));
      toast.success("Subscriber deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting subscriber:", error);
      toast.error("Failed to delete subscriber");
    }
  };

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

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Newsletter Subscribers</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-200"
          >
            <i className="ri-close-line text-xl" />
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search email addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 bg-background text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="text-sm text-gray-400">
              {filteredSubscribers.length} of {subscribers.length} subscribers
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? "No subscribers found matching your search." : "No subscribers found."}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSubscribers.map((subscriber) => (
              <div
                key={subscriber._id}
                className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-background2/50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                      <i className="ri-mail-line text-gold-500"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">{subscriber.email}</p>
                      <p className="text-sm text-gray-400">
                        Subscribed on {formatDate(subscriber.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(subscriber)}
                  variant="outline"
                  size="sm"
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                >
                  <i className="ri-delete-bin-line mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-background2 p-4 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-gold-500">{subscribers.length}</div>
              <div className="text-sm text-gray-400">Total Subscribers</div>
            </div>
            <div className="bg-background2 p-4 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-green-400">
                {subscribers.filter(s => s.email.includes('@')).length}
              </div>
              <div className="text-sm text-gray-400">Valid Emails</div>
            </div>
            <div className="bg-background2 p-4 rounded-lg border border-gray-600">
              <div className="text-2xl font-bold text-purple-400">
                {subscribers.length > 0
                  ? Math.round((subscribers.filter(s => s.email.includes('@')).length / subscribers.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-400">Valid Rate</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-600">
          <Button
            onClick={fetchSubscribers}
            variant="outline"
            className="mr-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            <i className="ri-refresh-line mr-2" />
            Refresh
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
