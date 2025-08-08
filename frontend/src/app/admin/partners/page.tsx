"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import AdminButton from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";

import { apiClient } from "@/lib/api";
import { Partner, PartnerFormData } from "@/types/admin";

const initialFormData: PartnerFormData = {
  maintitle: "",
  partners: [],
};

export default function PartnersPage() {
  const [partnersData, setPartnersData] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [viewingPartner, setViewingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Partner>("/partners");
      if (response.success && response.data) {
        setPartnersData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch partners");
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPartner(null);
    setFormData(initialFormData);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      maintitle: partner.maintitle,
      partners: partner.partners.map((p) => ({ name: p.name, image: null })),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleView = (partner: Partner) => {
    setViewingPartner(partner);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (partner: Partner) => {
    if (!confirm("Are you sure you want to delete this partner section?"))
      return;

    try {
      const response = await apiClient.delete("/partners", partner._id);
      if (response.success) {
        toast.success("Partner section deleted successfully");
        fetchPartners();
      } else {
        toast.error("Failed to delete partner section");
      }
    } catch (error) {
      toast.error("Failed to delete partner section");
      console.error("Error deleting partner:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: PartnerFormData) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePartnerNameChange = (index: number, value: string) => {
    setFormData((prev: PartnerFormData) => ({
      ...prev,
      partners: prev.partners.map((partner, i) =>
        i === index ? { ...partner, name: value } : partner
      ),
    }));
  };

  const handlePartnerImageChange = (index: number, file: File | null) => {
    setFormData((prev: PartnerFormData) => ({
      ...prev,
      partners: prev.partners.map((partner, i) =>
        i === index ? { ...partner, image: file } : partner
      ),
    }));
  };

  const addPartner = () => {
    setFormData((prev: PartnerFormData) => ({
      ...prev,
      partners: [...prev.partners, { name: "", image: null }],
    }));
  };

  const removePartner = (index: number) => {
    setFormData((prev: PartnerFormData) => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maintitle.trim())
      newErrors.maintitle = "Main title is required";
    if (formData.partners.length === 0)
      newErrors.partners = "At least one partner is required";

    formData.partners.forEach((partner, index) => {
      if (!partner.name.trim()) {
        newErrors[`partner_name_${index}`] = "Partner name is required";
      }
      if (!editingPartner && !partner.image) {
        newErrors[`partner_image_${index}`] = "Partner image is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    const submitFormData = new FormData();

    submitFormData.append("maintitle", formData.maintitle);

    // Convert partners to JSON string for the partners field
    const partnersData = formData.partners.map((partner) => ({
      name: partner.name,
    }));
    submitFormData.append("partners", JSON.stringify(partnersData));

    // Append partner images
    formData.partners.forEach((partner) => {
      if (partner.image) {
        submitFormData.append("partners", partner.image);
      }
    });

    try {
      const response = editingPartner
        ? await apiClient.update(
            "/partners",
            editingPartner._id,
            submitFormData
          )
        : await apiClient.create("/partners", submitFormData);

      if (response.success) {
        toast.success(
          `Partners ${editingPartner ? "updated" : "created"} successfully`
        );
        setIsModalOpen(false);
        fetchPartners();
      } else {
        toast.error(
          `Failed to ${editingPartner ? "update" : "create"} partners`
        );
      }
    } catch (error) {
      toast.error(`Failed to ${editingPartner ? "update" : "create"} partners`);
      console.error("Error submitting partners:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "maintitle",
      label: "Title",
      sortable: true,
      render: (value: unknown) => (
        <div className="font-medium">{String(value)}</div>
      ),
    },
    {
      key: "partners",
      label: "Partners",
      render: (value: unknown) => {
        const partners = value as { name: string; image: string }[];
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
              {partners?.length || 0} partners
            </span>
            {partners && partners.length > 0 && (
              <div className="flex -space-x-2">
                {partners.slice(0, 3).map((partner, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-gray-800 rounded border border-gray-600 overflow-hidden"
                  >
                    <Image
                      src={`http://localhost:8000/${partner.image}`}
                      alt={partner.name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                {partners.length > 3 && (
                  <div className="w-6 h-6 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                    <span className="text-xs text-gray-300">
                      +{partners.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partners"
        description="Manage business partners and sponsors"
      >
        <AdminButton onClick={handleCreate} icon="ri-add-line">
          Add Partners Section
        </AdminButton>
      </PageHeader>

      <DataTable
        data={partnersData}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No partner sections found. Create your first partners section to get started."
        searchPlaceholder="Search partners..."
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingPartner ? "Edit Partners Section" : "Create Partners Section"
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Main Title"
            name="maintitle"
            value={formData.maintitle}
            onChange={handleInputChange}
            placeholder="Enter section title"
            error={errors.maintitle}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Partners
              </label>
              <AdminButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPartner}
                icon="ri-add-line"
              >
                Add Partner
              </AdminButton>
            </div>

            {errors.partners && (
              <p className="text-red-400 text-sm mb-4">{errors.partners}</p>
            )}

            <div className="space-y-4">
              {formData.partners.map((partner, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-600 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-300">
                      Partner {index + 1}
                    </h4>
                    <AdminButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePartner(index)}
                      icon="ri-delete-bin-line"
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </AdminButton>
                  </div>

                  <Input
                    name={`partner_name_${index}`}
                    label="Partner Name"
                    value={partner.name}
                    onChange={(e) =>
                      handlePartnerNameChange(index, e.target.value)
                    }
                    placeholder="Enter partner name"
                    error={errors[`partner_name_${index}`]}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Partner Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handlePartnerImageChange(
                          index,
                          e.target.files?.[0] || null
                        )
                      }
                      className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30"
                    />
                    {errors[`partner_image_${index}`] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[`partner_image_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            <AdminButton
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={submitting}>
              {editingPartner ? "Update" : "Create"} Partners
            </AdminButton>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="View Partners Section"
        size="xl"
      >
        {viewingPartner && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {viewingPartner.maintitle}
              </h3>
              <div className="text-sm text-gray-400">
                {viewingPartner.partners?.length || 0} partners
              </div>
            </div>

            {viewingPartner.partners && viewingPartner.partners.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-300 mb-3">Partners</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingPartner.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                        <Image
                          src={`http://localhost:8000/${partner.image}`}
                          alt={partner.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">
                          {partner.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-600">
              <AdminButton
                variant="ghost"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
