"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import Image from "next/image";

import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";

import ModelsPopup from "./model-popup";

import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import { CompanyModel } from "@/types/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Statistics calculation hooks
const useModelStatistics = (models: CompanyModel[]) => {
  return useMemo(() => {
    const total = models.length;
    const male = models.filter((model) => model.gender === "Male").length;
    const female = models.filter((model) => model.gender === "Female").length;

    return { total, male, female };
  }, [models]);
};

export default function ModelsPage() {
  // State management
  const [models, setModels] = useState<CompanyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CompanyModel | null>(null);

  const statistics = useModelStatistics(models);

  // Fetch models function
  const fetchModels = useCallback(() => {
    setLoading(true);
    Axios.get("/api/models")
      .then((response) => {
        if (response.data.success && response.data.data) {
          setModels(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch models");
        }
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
        toast.error("Failed to load models");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Modal handlers
  const handleCreateModel = useCallback(() => {
    setEditingModel(null);
    setIsPopupOpen(true);
  }, []);

  const handleEditModel = useCallback((model: CompanyModel) => {
    setEditingModel(model);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setEditingModel(null);
  }, []);

  const handleDeleteModel = useCallback(
    (model: CompanyModel) => {
      const confirmMessage = `Are you sure you want to delete "${model.name}"? This action cannot be undone.`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      Axios.delete(`/api/models/${model._id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success("Model deleted successfully");
            fetchModels(); // Refresh the list
          } else {
            toast.error(response.data.message || "Failed to delete model");
          }
        })
        .catch((error) => {
          console.error("Error deleting model:", error);
          toast.error("Failed to delete model");
        });
    },
    [fetchModels]
  );

  const handlePopupSuccess = useCallback(() => {
    fetchModels(); // Refresh the list after successful create/edit
  }, [fetchModels]);

  // Table columns configuration
  const tableColumns = useMemo(
    () => [
      {
        key: "coverImage",
        label: "Photo",
        sortable: false,
        render: (value: unknown) => (
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-lg overflow-hidden border  border-gray-700 flex-shrink-0">
            <Image
              src={normalizeImagePath(
                typeof value === "string" ? value : undefined
              )}
              alt="Model photo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        ),
      },
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (value: unknown, item: CompanyModel) => (
          <Link
            href={`/models/${item.slug}`}
            className="font-medium text-sm sm:text-base text-gold-500 hover:text-gold-400 hover:underline"
          >
            {String(value)}
          </Link>
        ),
      },
      {
        key: "order",
        label: "Order",
        sortable: true,
        render: (value: unknown) => (
          <div className="text-sm font-medium text-gray-100">
            {String(value)}
          </div>
        ),
      },
      {
        key: "slug",
        label: "Slug",
        sortable: true,
        render: (value: unknown) => (
          <div className="text-xs sm:text-sm text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
            {String(value)}
          </div>
        ),
      },
      {
        key: "gender",
        label: "Gender",
        sortable: true,
        render: (value: unknown) => {
          const gender = String(value);
          const colorClasses = {
            Male: "bg-blue-900/30 text-blue-400",
            Female: "bg-pink-900/30 text-pink-400",
          };

          const className =
            colorClasses[gender as keyof typeof colorClasses] ||
            "bg-gray-900/30 text-gray-400";

          return (
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${className}`}
            >
              {String(value)}
            </span>
          );
        },
      },

      {
        key: "images",
        label: "Gallery",
        sortable: false,
        render: (value: unknown) => {
          const images = value as string[];
          const count = images?.length || 0;
          return (
            <div className="flex items-center">
              <span className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded font-medium">
                {count} {count === 1 ? "image" : "images"}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  // Dashboard-style statistics card data
  const statsData = [
    {
      title: "Total Models",
      value: statistics.total,
      icon: "ri-user-star-line",
      change: statistics.total > 0 ? `+${statistics.total}%` : "0%",
    },
    {
      title: "Male Models",
      value: statistics.male,
      icon: "ri-men-line",
      change:
        statistics.male > 0
          ? `+${Math.round((statistics.male / statistics.total) * 100)}%`
          : "0%",
    },
    {
      title: "Female Models",
      value: statistics.female,
      icon: "ri-women-line",
      change:
        statistics.female > 0
          ? `+${Math.round((statistics.female / statistics.total) * 100)}%`
          : "0%",
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-200 space-y-4 sm:space-y-6 p-2 sm:p-6 lg:p-2">
      {/* Page Header */}
      <PageHeader
        title="Models Management"
        description="Manage your model portfolio with comprehensive tools for adding, editing, and organizing model profiles."
      >
        <Button
          variant="default"
          onClick={handleCreateModel}
          className="w-full sm:w-auto"
          disabled={loading}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Model
        </Button>
      </PageHeader>

      {/* Dashboard-style Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-3 sm:h-4 bg-gold-900/30 rounded w-20 sm:w-24 mb-2"></div>
                    <div className="h-5 sm:h-6 bg-gold-900/30 rounded w-12 sm:w-16 mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gold-900/30 rounded w-10 sm:w-12"></div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-900/30 rounded-lg"></div>
                </div>
              </div>
            ))
          : statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-muted-background border border-gold-900/20 rounded-lg p-4 sm:p-6 hover:bg-gold-900/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-xs sm:text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    <p className="text-gold-500 text-xs sm:text-sm mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                    <i
                      className={`${stat.icon} text-gold-500 text-lg sm:text-xl`}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Models Table */}
      <div className=" rounded-lg borderborder-gray-700 overflow-hidden transition-colors duration-200">
        <DataTable
          data={models}
          columns={tableColumns}
          onEdit={handleEditModel}
          onDelete={handleDeleteModel}
          loading={loading}
          emptyMessage="No models found. Create your first model to get started."
          searchPlaceholder="Search models by name, slug, or address..."
        />
      </div>

      {/* Models Popup */}
      <ModelsPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        model={editingModel}
        onSuccess={handlePopupSuccess}
      />
    </div>
  );
}
