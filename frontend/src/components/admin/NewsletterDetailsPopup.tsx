"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface NewsletterDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  newsletter: SentNewsletter | null;
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
  status: "sent" | "failed" | "partial";
  createdAt: string;
}

export default function NewsletterDetailsPopup({
  isOpen,
  onClose,
  newsletter,
}: NewsletterDetailsPopupProps) {
  if (!isOpen || !newsletter) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: SentNewsletter["status"]) => {
    const statusConfig = {
      sent: { color: "bg-green-100 text-green-800", text: "Sent" },
      failed: { color: "bg-red-100 text-red-800", text: "Failed" },
      partial: { color: "bg-yellow-100 text-yellow-800", text: "Partial" },
    };
    const config = statusConfig[status];
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const StatBox = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div>
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-600">
        {/* Header */}
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
          {/* Basic Info + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Title
                  </label>
                  <p className="text-gray-100">{newsletter.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Description
                  </label>
                  <p className="text-gray-100">{newsletter.description}</p>
                </div>
                {newsletter.descriptionOpt && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Additional Description
                    </label>
                    <p className="text-gray-100">{newsletter.descriptionOpt}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(newsletter.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Delivery Statistics
              </h3>
              <div className="space-y-3">
                <StatBox
                  label="Successfully Sent"
                  value={newsletter.sentTo}
                  color="text-green-400"
                />
                <StatBox
                  label="Total Subscribers"
                  value={newsletter.totalSubscribers}
                  color="text-blue-400"
                />
                <StatBox
                  label="Failed Deliveries"
                  value={newsletter.failedCount}
                  color="text-red-400"
                />
                <StatBox
                  label="Success Rate"
                  value={
                    newsletter.totalSubscribers > 0
                      ? `${Math.round(
                          (newsletter.sentTo / newsletter.totalSubscribers) * 100
                        )}%`
                      : "0%"
                  }
                  color="text-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          {(newsletter.link || newsletter.linkLabel || newsletter.websiteLink) && (
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Links</h3>
              <div className="space-y-3">
                {newsletter.linkLabel && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Link Label
                    </label>
                    <p className="text-gray-100">{newsletter.linkLabel}</p>
                  </div>
                )}
                {newsletter.link && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Link URL
                    </label>
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
                    <label className="text-sm font-medium text-gray-400">
                      Website Link
                    </label>
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
          {(newsletter.image?.length || newsletter.imageOpt?.length) && (
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsletter.image?.length ? (
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Main Images
                    </label>
                    <div className="space-y-2">
                      {newsletter.image.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Main image ${i + 1}`}
                          width={400}
                          height={128}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                {newsletter.imageOpt?.length ? (
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">
                      Optional Images
                    </label>
                    <div className="space-y-2">
                      {newsletter.imageOpt.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Optional image ${i + 1}`}
                          width={400}
                          height={128}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Timing</h3>
            <div>
              <label className="text-sm font-medium text-gray-400">
                Sent Date
              </label>
              <p className="text-gray-100">{formatDate(newsletter.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-6 border-t border-gray-600">
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
