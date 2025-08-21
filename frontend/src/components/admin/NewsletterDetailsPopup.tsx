"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface NewsletterDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  newsletter: any;
}

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

export default function NewsletterDetailsPopup({ isOpen, onClose, newsletter }: NewsletterDetailsPopupProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !newsletter) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { color: "bg-green-100 text-green-800", text: "Sent" },
      failed: { color: "bg-red-100 text-red-800", text: "Failed" },
      partial: { color: "bg-yellow-100 text-yellow-800", text: "Partial" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.sent;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Newsletter Details</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-200"
          >
            <i className="ri-close-line text-xl" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-400">Title</label>
                  <p className="text-gray-100">{newsletter.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Description</label>
                  <p className="text-gray-100">{newsletter.description}</p>
                </div>
                {newsletter.descriptionOpt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Additional Description</label>
                    <p className="text-gray-100">{newsletter.descriptionOpt}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="mt-1">{getStatusBadge(newsletter.status)}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Delivery Statistics</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-400">Successfully Sent</label>
                  <p className="text-2xl font-bold text-green-400">{newsletter.sentTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Total Subscribers</label>
                  <p className="text-2xl font-bold text-blue-400">{newsletter.totalSubscribers}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Failed Deliveries</label>
                  <p className="text-2xl font-bold text-red-400">{newsletter.failedCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Success Rate</label>
                  <p className="text-2xl font-bold text-purple-400">
                    {newsletter.totalSubscribers > 0
                      ? Math.round((newsletter.sentTo / newsletter.totalSubscribers) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          {(newsletter.link || newsletter.linkLabel) && (
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Links</h3>
              <div className="space-y-3">
                {newsletter.linkLabel && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Link Label</label>
                    <p className="text-gray-100">{newsletter.linkLabel}</p>
                  </div>
                )}
                {newsletter.link && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Link URL</label>
                    <a
                      href={newsletter.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400 break-all"
                    >
                      {newsletter.link}
                    </a>
                  </div>
                )}
                {newsletter.websiteLink && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Website Link</label>
                    <a
                      href={newsletter.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-400 break-all"
                    >
                      {newsletter.websiteLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Images */}
          {(newsletter.image?.length > 0 || newsletter.imageOpt?.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsletter.image?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Main Images</label>
                    <div className="space-y-2">
                      {newsletter.image.map((img: string, index: number) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Main image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                      ))}
                    </div>
                  </div>
                )}
                {newsletter.imageOpt?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Optional Images</label>
                    <div className="space-y-2">
                      {newsletter.imageOpt.map((img: string, index: number) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Optional image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Timing</h3>
            <div>
              <label className="text-sm font-medium text-gray-400">Sent Date</label>
              <p className="text-gray-100">{formatDate(newsletter.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-600">
          <Button
            onClick={onClose}
            variant="outline"
            className="mr-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
