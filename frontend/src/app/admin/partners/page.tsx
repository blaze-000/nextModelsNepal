"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";

import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import PartnerPopup from "./PartnerPopup";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { Partner } from "@/types/admin";
import { Button } from "@/components/ui/button";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/partners");
      const data = response.data;

      if (data.success && data.data) {
        setPartners(data.data);
      } else {
        setPartners([]);
      }
    } catch (error) {
      setPartners([]);
      if (
        (error as { response?: { status?: number } })?.response?.status !== 404
      ) {
        toast.error("Failed to fetch partners");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPartner(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setIsPopupOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    setDeletingPartner(partner);
  };

  const confirmDelete = async () => {
    if (!deletingPartner) return;

    setIsDeleting(true);
    try {
      const response = await Axios.delete(
        `/api/partners/${deletingPartner._id}`
      );
      const data = response.data;

      if (data.success) {
        toast.success("Partner deleted successfully");
        setDeletingPartner(null);
        fetchPartners();
      } else {
        toast.error("Failed to delete partner");
      }
    } catch {
     
      toast.error("Failed to delete partner");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePopupSuccess = () => {
    fetchPartners();
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingPartner(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingPartner(null);
  };

  // Table columns configuration
  const columns = [
    {
      key: "sponserName",
      label: "Partner Name",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium text-sm sm:text-base truncate">
          {String(value)}
        </div>
      ),
    },
    {
      key: "sponserImage",
      label: "Image",
      render: (value: unknown) => (
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
          <Image
            src={normalizeImagePath(String(value))}
            alt="Partner"
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Partners"
        description="Manage business partners and sponsors"
      >
        <Button variant="default" onClick={handleCreate} className="w-full sm:w-auto">
          <i className="ri-add-line mr-2" />
          Add Partner
        </Button>
      </PageHeader>

      <div className="overflow-hidden">
        <DataTable
          data={partners}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No partners found. Add your first partner to get started."
          searchPlaceholder="Search partners..."
        />
      </div>

      {/* Partner Popup */}
      <PartnerPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        partner={editingPartner}
        onSuccess={handlePopupSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingPartner}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Partner"
        message={`Are you sure you want to delete "${deletingPartner?.sponserName}"? This action cannot be undone.`}
        confirmText="Delete Partner"
        isDeleting={isDeleting}
      />
    </div>
  );
}
