"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

const ContactPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/contact");
      setContacts(response.data.data || []);
    } catch (error: unknown) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact
  const handleDelete = async (contact: Contact) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }
    try {
      await Axios.delete(`/api/contact/${contact._id}`);
      setContacts(contacts.filter(c => c._id !== contact._id));
      toast.success("Contact deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  // Load contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Define table columns
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: unknown, contact: Contact) => (
        <Link
          href={`/admin/contacts/${contact._id}`}
          className="text-gold-500 hover:text-gold-400 hover:underline font-medium"
        >
          {String(value)}
        </Link>
      ),
      sortable: true,
    },
    {
      key: "email",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base">{String(value)}</div>
      ),
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base py-2">{String(value)}</div>
      ),
      label: "Phone",
      sortable: false,
    },
    {
      key: "subject",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base py-2">{String(value)}</div>
      ),
      label: "Subject",
      sortable: false,
    },
    {
      key: "createdAt",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base py-2">{formatDate(String(value))}</div>
      ),
      label: "Date",
      sortable: true,
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-newsreader text-primary">Contact Messages</h1>
          <p className="text-foreground/70 mt-2">Manage contact form submissions</p>
        </div>
        <Button
          onClick={fetchContacts}
          variant="default"
        >
          <i className="ri-refresh-line mr-2" />
          Refresh
        </Button>
      </div>

      <DataTable
        data={contacts}
        columns={columns}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No contact messages found"
        searchPlaceholder="Search contacts..."
      />

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-foreground/50">
          Showing {contacts.length} contact message{contacts.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
