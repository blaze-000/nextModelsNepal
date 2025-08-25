"use client";
import { useState, useEffect, useCallback } from "react";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@geist-ui/react";
import Axios from "@/lib/axios-instance";
import Link from "next/link";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactDetails() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const id = params?.id as string;

  // Fetch contact details
  const fetchContact = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get(`/api/contact/${id}`);
      setContact(response.data.data);
    } catch (error: unknown) {
      console.error("Error fetching contact:", error);
      toast.error("Failed to load contact details");
      router.push("/admin/contacts");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  // Delete contact
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact message?")) {
      return;
    }

    try {
      setDeleting(true);
      await Axios.delete(`/api/contact/${id}`);
      toast.success("Contact message deleted successfully");
      router.push("/admin/contacts");
    } catch (error: unknown) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact message");
    } finally {
      setDeleting(false);
    }
  };

  // Load contact on component mount
  useEffect(() => {
    if (id) {
      fetchContact();
    }
  }, [id, fetchContact]);

  // Format date for display
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-foreground/50">Contact message not found</p>
          <Button
            onClick={() => router.push("/admin/contacts")}
            variant="outline"
            className="mt-4 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
          >
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary font-newsreader">
            Contact Message Details
          </h1>
          <p className="text-foreground/70 mt-2">
            Received on {formatDate(contact.createdAt)}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link href="/admin/contacts">
            <Button
              variant="outline"
              className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
            >
              <i className="ri-arrow-left-line mr-2" />
              Back to Contacts List
            </Button>
          </Link>

          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? (
              <Spinner />
            ) : (
              <>
                <i className="ri-delete-bin-line mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contact Information */}
        <div className="lg:col-span-1">
          <div className="bg-background2 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-foreground/50">Name</p>
                <p className="text-foreground font-medium">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/50">Email</p>
                <p className="text-foreground">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gold-500 hover:text-gold-400 hover:underline"
                  >
                    {contact.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/50">Phone</p>
                <p className="text-foreground">
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-gold-500 hover:text-gold-400 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/50">Subject</p>
                <p className="text-foreground font-medium">{contact.subject}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Message */}
        <div className="lg:col-span-2">
          <div className="bg-background2 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Message
            </h2>

            <div className="bg-muted-background rounded-lg p-6">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {contact.message}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button
                onClick={() => {
                  const mailtoLink = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
                  window.open(mailtoLink, "_blank");
                }}
                className="bg-gold-500 hover:bg-gold-600 text-white"
              >
                <i className="ri-mail-line mr-2" />
                Reply via Email
              </Button>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(contact.email);
                  toast.success("Email copied to clipboard");
                }}
                variant="outline"
                className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
              >
                <i className="ri-clipboard-line mr-2" />
                Copy Email ID
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
