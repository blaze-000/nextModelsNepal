"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@geist-ui/react";
import Axios from "@/lib/axios-instance";
import Link from "next/link";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/app-form");
      setApplications(response.data.data || []);
    } catch (error: any) {
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
      setDeletingId(id);
      await Axios.delete(`/api/app-form/${id}`);
      setApplications(applications.filter(app => app._id !== id));
      toast.success("Application deleted successfully");
    } catch (error: any) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setDeletingId(null);
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

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Admin Dashboard</h1>
          <p className="text-[var(--color-foreground)]/70 mt-2">Manage model applications</p>
        </div>
        <Button 
          onClick={fetchApplications} 
          variant="outline"
          className="mt-4 md:mt-0 border-[var(--color-gold-500)] text-[var(--color-gold-500)] hover:bg-[var(--color-gold-500)] hover:text-[var(--color-primary-foreground)]"
        >
          <i className="ri-refresh-line mr-2" />
          Refresh
        </Button>
      </div>

      <div className="bg-[var(--color-background2)] rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-foreground)]/50">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-muted-background)]">
              <thead className="bg-[var(--color-muted-background)]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[var(--color-foreground)]/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-muted-background)]">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-[var(--color-muted-background)]/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/admin/applications/${application._id}`}
                        className="text-sm font-medium text-[var(--color-gold-500)] hover:text-[var(--color-gold-400)] hover:underline"
                      >
                        {application.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]/80">{application.age}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]/80">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]/80">{application.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]/80">{application.gender || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]/80">{formatDate(application.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(application._id)}
                        disabled={deletingId === application._id}
                        className="bg-[var(--color-gold-600)] hover:bg-[var(--color-gold-900)] text-[var(--color-primary-foreground)]"
                      >
                        {deletingId === application._id ? (
                          <Spinner />
                        ) : (
                          <i className="ri-delete-bin-line text-lg" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-[var(--color-foreground)]/50">
          Showing {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;