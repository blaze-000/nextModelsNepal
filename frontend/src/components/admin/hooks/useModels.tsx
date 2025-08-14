// hooks/useModels.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import Axios from "@/lib/axios-instance";
import { CompanyModel, ModelStatistics } from "@/types/admin";

interface UseModelsReturn {
  models: CompanyModel[];
  loading: boolean;
  statistics: ModelStatistics;
  fetchModels: () => Promise<void>;
  deleteModel: (model: CompanyModel) => Promise<void>;
  refreshModels: () => void;
}

export const useModels = (): UseModelsReturn => {
  const [models, setModels] = useState<CompanyModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate statistics from models
  const statistics = useMemo((): ModelStatistics => {
    const total = models.length;
    const male = models.filter(
      (model) => model.gender === "Male"
    ).length;
    const female = models.filter(
      (model) => model.gender === "Female"
    ).length;

    return { total, male, female };
  }, [models]);

  // Fetch models from API
  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/api/models");

      if (response.data.success && response.data.data) {
        setModels(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch models");
      }
    } catch (error: unknown) {
      console.error("Error fetching models:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load models";
      toast.error(errorMessage);
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete model
  const deleteModel = useCallback(async (model: CompanyModel) => {
    const confirmMessage = `Are you sure you want to delete "${model.name}"? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await Axios.delete(`/api/models/${model._id}`);

      if (response.data.success) {
        toast.success("Model deleted successfully");
        // Remove the deleted model from state immediately for better UX
        setModels((prev) => prev.filter((m) => m._id !== model._id));
      } else {
        throw new Error(response.data.message || "Failed to delete model");
      }
    } catch (error: unknown) {
      console.error("Error deleting model:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete model";
      toast.error(errorMessage);
    }
  }, []);

  // Refresh models (alias for fetchModels for better semantics)
  const refreshModels = useCallback(() => {
    fetchModels();
  }, [fetchModels]);

  // Initial load
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    loading,
    statistics,
    fetchModels,
    deleteModel,
    refreshModels,
  };
};
