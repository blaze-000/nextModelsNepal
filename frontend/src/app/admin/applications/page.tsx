"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

interface Application {
  _id: string;
  name: string;
  age: string;
  phone: string;
  email: string;
  gender?: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/app-form");
      setApplications(response.data.data || []);
    } catch (error: unknown) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Delete an application
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }
    try {
      await Axios.delete(`/api/app-form/${id}`);
      setApplications(applications.filter(app => app._id !== id));
      toast.success("Application deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
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

  // Define table columns for DataTable
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: unknown, item: Application) => (
        <Link
          href={`/admin/applications/${item._id}`}
          className="text-gold-500 hover:text-gold-400 hover:underline font-medium"
        >
          {String(value)}
        </Link>
      ),
      sortable: true,
    },
    { key: "age",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base py-2">{String(value)}</div>
      ),
       label: "Age", sortable: true },
    { key: "phone",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base">{String(value)}</div>
      ),
      label: "Mobile", sortable: true },
    { key: "email",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base">{String(value)}</div>
      ),
      label: "Email", sortable: true },
    { key: "gender",
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base">{String(value)}</div>
      ),
      label: "Gender", sortable: true },
    {
      key: "createdAt",
      label: "Date",
      render: (value: unknown) => formatDate(String(value)),
      sortable: true,
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-newsreader text-primary">Applicants</h1>
        </div>
        <Button
          onClick={fetchApplications}
          variant="outline"
          className="mt-4 md:mt-0 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
        >
          <i className="ri-refresh-line mr-2" />
          Refresh
        </Button>
      </div>
      <DataTable
        data={applications}
        columns={columns}
        onDelete={(item: Application) => handleDelete(item._id)}
        loading={loading}
        emptyMessage="No applications found"
        searchPlaceholder="Search applicants..."
      />
    </div>
  );
};

export default AdminDashboard;