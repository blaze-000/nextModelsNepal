import { Request, Response } from "express";
import { CriteriaModel, SeasonModel } from "../models/events.model";
import { createCriteriaSchema, updateCriteriaSchema } from "../validations/criteria.validation";
import mongoose from "mongoose";

/**
 * Create Criteria under a Season
 */
export const createCriteria = async (req: Request, res: Response) => {
  try {
    const validatedData = createCriteriaSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(validatedData.seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const seasonExists = await SeasonModel.exists({ _id: validatedData.seasonId });
    if (!seasonExists) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    const criteria = await CriteriaModel.create(validatedData);
    res.status(201).json({ success: true, data: criteria });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create criteria error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Criteria by Season ID
 */
export const getCriteriaBySeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const { page = 1, limit = 10, sort = "label", order = "asc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    const criteriaList = await CriteriaModel.find({ seasonId })
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await CriteriaModel.countDocuments({ seasonId });

    res.json({
      success: true,
      data: criteriaList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get criteria by season error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch criteria" });
  }
};

/**
 * Get All Criteria (with optional filtering)
 */
export const getAllCriteria = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, seasonId, sort = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Build filter object
    const filter: any = {};
    if (seasonId && mongoose.Types.ObjectId.isValid(String(seasonId))) {
      filter.seasonId = seasonId;
    }

    const criteriaList = await CriteriaModel.find(filter)
      .populate("seasonId", "year slug")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await CriteriaModel.countDocuments(filter);

    res.json({
      success: true,
      data: criteriaList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all criteria error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch criteria" });
  }
};

/**
 * Get Criteria by ID
 */
export const getCriteriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid criteria ID format" });
    }

    const criteria = await CriteriaModel.findById(id).populate("seasonId", "year slug");
    if (!criteria) {
      return res.status(404).json({ success: false, message: "Criteria not found" });
    }

    res.json({ success: true, data: criteria });
  } catch (error) {
    console.error("Get criteria by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch criteria" });
  }
};

/**
 * Update Criteria by ID
 */
export const updateCriteria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateCriteriaSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid criteria ID format" });
    }

    const criteria = await CriteriaModel.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!criteria) {
      return res.status(404).json({ success: false, message: "Criteria not found" });
    }

    res.json({ success: true, data: criteria });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update criteria error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Criteria by ID
 */
export const deleteCriteria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid criteria ID format" });
    }

    const deleted = await CriteriaModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Criteria not found" });
    }

    res.json({ success: true, message: "Criteria deleted successfully" });
  } catch (error) {
    console.error("Delete criteria error:", error);
    res.status(500).json({ success: false, message: "Failed to delete criteria" });
  }
};
