"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/AdminButton";
import Input from "@/components/admin/form/input";

import Axios from "@/lib/axios-instance";
import { Partner, PartnerFormData, PartnerItem } from "@/types/admin";

// Types
type PartnerWithCollection = PartnerItem & {
  collectionId: string;
  _id: string;
};

// Constants
const INITIAL_FORM_DATA: PartnerFormData = {
  partners: [{ sponserName: "", sponserImage: null }],
};

const INITIAL_EDIT_FORM = {
  sponserName: "",
  sponserImage: null as File | null,
};

export default function PartnersPage() {
  const [partnersData, setPartnersData] = useState<Partner[]>([]);
  const [allPartners, setAllPartners] = useState<PartnerWithCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] =
    useState<PartnerWithCollection | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>(INITIAL_FORM_DATA);
  const [editFormData, setEditFormData] = useState(INITIAL_EDIT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch partners
  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/partners");
      const data = response.data;

      if (data.success && data.data) {
        setPartnersData(data.data);

        // Flatten partners for table display
        const flatPartners = data.data.flatMap((collection: Partner) =>
          collection.partners.map((partner: PartnerItem) => ({
            ...partner,
            collectionId: collection._id,
            _id: `${collection._id}-${partner.index}`,
          }))
        );
        setAllPartners(flatPartners);
      }
    } catch (error) {
      toast.error("Failed to fetch partners");
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Modal handlers
  const handleCreate = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: PartnerWithCollection) => {
    setEditingPartner(item);
    setEditFormData({
      sponserName: item.sponserName,
      sponserImage: null,
    });
    setErrors({});
    setIsEditModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingPartner(null);
    setErrors({});
  }, []);

  // Form handlers
  const updatePartner = useCallback(
    (
      index: number,
      field: "sponserName" | "sponserImage",
      value: string | File | null
    ) => {
      setFormData((prev) => ({
        ...prev,
        partners: prev.partners.map((partner, i) =>
          i === index ? { ...partner, [field]: value } : partner
        ),
      }));

      // Clear related error
      const errorKey =
        field === "sponserName"
          ? `partner_name_${index}`
          : `partner_image_${index}`;
      if (errors[errorKey]) {
        setErrors((prev) => ({ ...prev, [errorKey]: "" }));
      }
    },
    [errors]
  );

  const addPartner = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      partners: [...prev.partners, { sponserName: "", sponserImage: null }],
    }));
  }, []);

  const removePartner = useCallback(
    (index: number) => {
      if (formData.partners.length === 1) {
        toast.error("At least one partner is required");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        partners: prev.partners.filter((_, i) => i !== index),
      }));
    },
    [formData.partners.length]
  );

  const handleEditInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.partners.length === 0) {
      newErrors.partners = "At least one partner is required";
    }

    formData.partners.forEach((partner, index) => {
      if (!partner.sponserName.trim()) {
        newErrors[`partner_name_${index}`] = "Partner name is required";
      }
      if (!partner.sponserImage) {
        newErrors[`partner_image_${index}`] = "Partner image is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.partners]);

  const validateEditForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.sponserName.trim()) {
      newErrors.sponserName = "Partner name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editFormData.sponserName]);

  // API operations
  const handleDelete = useCallback(
    async (item: PartnerWithCollection) => {
      if (
        !confirm(
          `Are you sure you want to delete partner "${item.sponserName}"?`
        )
      ) {
        return;
      }

      try {
        const collection = partnersData.find(
          (c) => c._id === item.collectionId
        );
        if (!collection) {
          toast.error("Partner collection not found");
          return;
        }

        const updatedPartners = collection.partners.filter(
          (p) => p.index !== item.index
        );

        if (updatedPartners.length === 0) {
          const response = await Axios.delete(
            `/api/partners/${item.collectionId}`
          );
          const data = response.data;
          if (data.success) {
            toast.success("Partner deleted successfully");
            fetchPartners();
          } else {
            toast.error("Failed to delete partner");
          }
        } else {
          const updateFormData = new FormData();
          updatedPartners.forEach((p, index) => {
            updateFormData.append(
              `partners[${index}][sponserName]`,
              p.sponserName
            );
            updateFormData.append(
              `partners[${index}][sponserImage]`,
              p.sponserImage
            );
          });

          const response = await Axios.patch(
            `/api/partners/${item.collectionId}`,
            updateFormData
          );
          const data = response.data;
          if (data.success) {
            toast.success("Partner deleted successfully");
            fetchPartners();
          } else {
            toast.error("Failed to delete partner");
          }
        }
      } catch (error) {
        toast.error("Failed to delete partner");
        console.error("Error deleting partner:", error);
      }
    },
    [partnersData, fetchPartners]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setSubmitting(true);
      const submitFormData = new FormData();

      formData.partners.forEach((partner, index) => {
        submitFormData.append(
          `partners[${index}][sponserName]`,
          partner.sponserName
        );
        if (partner.sponserImage) {
          submitFormData.append(
            `partners[${index}][sponserImage]`,
            partner.sponserImage
          );
        }
      });

      try {
        const response = await Axios.post("/api/partners", submitFormData);
        const data = response.data;

        if (data.success) {
          toast.success("Partners created successfully");
          closeModals();
          fetchPartners();
        } else {
          toast.error("Failed to create partners");
        }
      } catch (error) {
        toast.error("Failed to create partners");
        console.error("Error submitting partners:", error);
      } finally {
        setSubmitting(false);
      }
    },
    [formData, validateForm, closeModals, fetchPartners]
  );

  const handleEditSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEditForm() || !editingPartner) return;

      setSubmitting(true);

      try {
        const collection = partnersData.find(
          (c) => c._id === editingPartner.collectionId
        );
        if (!collection) {
          toast.error("Partner collection not found");
          return;
        }

        const updatedPartners = collection.partners.map((p) =>
          p.index === editingPartner.index
            ? { ...p, sponserName: editFormData.sponserName }
            : p
        );

        const updateFormData = new FormData();
        updatedPartners.forEach((partner, index) => {
          updateFormData.append(
            `partners[${index}][sponserName]`,
            partner.sponserName
          );

          if (
            partner.index === editingPartner.index &&
            editFormData.sponserImage
          ) {
            updateFormData.append(
              `partners[${index}][sponserImage]`,
              editFormData.sponserImage
            );
          } else {
            updateFormData.append(
              `partners[${index}][sponserImage]`,
              partner.sponserImage
            );
          }
        });

        const response = await Axios.patch(
          `/api/partners/${editingPartner.collectionId}`,
          updateFormData
        );
        const data = response.data;

        if (data.success) {
          toast.success("Partner updated successfully");
          closeModals();
          fetchPartners();
        } else {
          toast.error("Failed to update partner");
        }
      } catch (error) {
        toast.error("Failed to update partner");
        console.error("Error updating partner:", error);
      } finally {
        setSubmitting(false);
      }
    },
    [
      editFormData,
      editingPartner,
      partnersData,
      validateEditForm,
      closeModals,
      fetchPartners,
    ]
  );

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
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
          <Image
            src={`http://localhost:8000/${String(value)}`}
            alt="Partner"
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      ),
    },
    {
      key: "index",
      label: "Index",
      sortable: true,
      render: (value: unknown) => (
        <div className="text-xs sm:text-sm text-gray-400">#{String(value)}</div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Partners"
        description="Manage business partners and sponsors"
      >
        <AdminButton onClick={handleCreate} className="w-full sm:w-auto">
          Add Partners
        </AdminButton>
      </PageHeader>

      <div className="overflow-hidden">
        <DataTable
          data={allPartners}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No partners found. Create your first partners to get started."
          searchPlaceholder="Search partners..."
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModals}
        title="Add Partners"
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Partners
            </label>

            {errors.partners && (
              <p className="text-red-400 text-sm mb-4">{errors.partners}</p>
            )}

            <div className="space-y-4">
              {formData.partners.map((partner, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-600 rounded-lg space-y-4 bg-gray-800/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-medium text-gray-300">
                      Partner {index + 1}
                    </h4>
                    {formData.partners.length > 1 && (
                      <AdminButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePartner(index)}
                        className="text-red-400 hover:text-red-300 self-start sm:self-auto"
                      >
                        Remove
                      </AdminButton>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Input
                      name={`partner_name_${index}`}
                      label="Partner Name"
                      value={partner.sponserName}
                      onChange={(e) =>
                        updatePartner(index, "sponserName", e.target.value)
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
                          updatePartner(
                            index,
                            "sponserImage",
                            e.target.files?.[0] || null
                          )
                        }
                        className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 
                          file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm 
                          file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30 
                          focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      />
                      {errors[`partner_image_${index}`] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors[`partner_image_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <AdminButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={addPartner}
                className="w-full sm:w-auto"
              >
                Add Partner
              </AdminButton>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-600">
            <AdminButton
              variant="ghost"
              onClick={closeModals}
              type="button"
              className="order-2 sm:order-1"
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              disabled={submitting}
              className="order-1 sm:order-2"
            >
              {submitting ? "Creating..." : "Create Partners"}
            </AdminButton>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Edit Partner"
        size="lg"
      >
        <form
          onSubmit={handleEditSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <Input
              label="Partner Name"
              name="sponserName"
              value={editFormData.sponserName}
              onChange={handleEditInputChange}
              placeholder="Enter partner name"
              error={errors.sponserName}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Partner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    sponserImage: e.target.files?.[0] || null,
                  }))
                }
                className="w-full p-3 bg-transparent border border-gray-600 rounded-lg text-gray-100 
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm 
                  file:bg-gold-500/20 file:text-gold-400 hover:file:bg-gold-500/30 
                  focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
              <p className="text-sm text-gray-400 mt-2">
                Leave empty to keep current image
              </p>
            </div>

            {editingPartner && (
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-400 mb-2">Current Image:</p>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                  <Image
                    src={`http://localhost:8000/${editingPartner.sponserImage}`}
                    alt={editingPartner.sponserName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-600">
            <AdminButton
              variant="ghost"
              onClick={closeModals}
              type="button"
              className="order-2 sm:order-1"
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              disabled={submitting}
              className="order-1 sm:order-2"
            >
              {submitting ? "Updating..." : "Update Partner"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
