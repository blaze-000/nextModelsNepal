"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Axios from "@/lib/axios-instance";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

interface HireRequest {
  _id: string;
  name: string; // model name
  model: string; // model id
  email: string;
  phone: string;
  message: string;
  date: string;
  createdAt: string;
}

const HireRequestsPage = () => {
  const [hires, setHires] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHires = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/api/hire-model");
      setHires(res.data.data || []);
    } catch (error: unknown) {
      console.error("Error fetching hire requests:", error);
      toast.error("Failed to load hire requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: HireRequest) => {
    if (!confirm("Are you sure you want to delete this hire request?")) return;
    try {
      await Axios.delete(`/api/hire-model/${item._id}`);
      setHires((prev) => prev.filter((h) => h._id !== item._id));
      toast.success("Hire request deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting hire request:", error);
      toast.error("Failed to delete hire request");
    }
  };

  useEffect(() => {
    fetchHires();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Model",
      sortable: true,
      render: (value: unknown, item: HireRequest) => (
        <Link
          href={`/admin/hire-requests/${item._id}`}
          className="text-gold-500 hover:text-gold-400 hover:underline font-medium"
        >
          {String(value)}
        </Link>
      ),
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
        <div className="font-medium text-sm sm:text-base py-2">
          {String(value)}
        </div>
      ),
      label: "Phone",
      sortable: false,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (value: unknown) => formatDate(String(value)),
    },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-newsreader text-primary">
            Hire Requests
          </h1>
          <p className="text-foreground/70 mt-2">Manage model hire requests</p>
        </div>
        <Button
          onClick={fetchHires}
          variant="outline"
          className="mt-4 md:mt-0 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-primary-foreground"
        >
          <i className="ri-refresh-line mr-2" />
          Refresh
        </Button>
      </div>

      <DataTable
        data={hires}
        columns={columns}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No hire requests found"
        searchPlaceholder="Search hire requests..."
      />

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-foreground/50">
          Showing {hires.length} hire request{hires.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default HireRequestsPage;
