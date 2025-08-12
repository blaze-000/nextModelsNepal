import { Request, Response } from "express";
import { AuditionModel, SeasonModel } from "../models/events.model";
import { createAuditionSchema, updateAuditionSchema } from "../validations/audition.validation";
import mongoose from "mongoose";

/**
 * Create Audition under a Season
 */
export const createAudition = async (req: Request, res: Response) => {
  try {
    const validatedData = createAuditionSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(validatedData.seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const seasonExists = await SeasonModel.exists({ _id: validatedData.seasonId });
    if (!seasonExists) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    const audition = await AuditionModel.create(validatedData);
    res.status(201).json({ success: true, data: audition });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create audition error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Auditions by Season ID
 */
export const getAuditionsBySeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const { page = 1, limit = 10, sort = "date", order = "asc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    const auditions = await AuditionModel.find({ seasonId })
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await AuditionModel.countDocuments({ seasonId });

    res.json({
      success: true,
      data: auditions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get auditions by season error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch auditions" });
  }
};

/**
 * Get All Auditions (with optional filtering)
 */
export const getAllAuditions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, seasonId, sort = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Build filter object
    const filter: any = {};
    if (seasonId && mongoose.Types.ObjectId.isValid(String(seasonId))) {
      filter.seasonId = seasonId;
    }

    const auditions = await AuditionModel.find(filter)
      .populate("seasonId", "year slug")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await AuditionModel.countDocuments(filter);

    res.json({
      success: true,
      data: auditions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all auditions error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch auditions" });
  }
};

/**
 * Get Audition by ID
 */
export const getAuditionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid audition ID format" });
    }

    const audition = await AuditionModel.findById(id).populate("seasonId", "year slug");
    if (!audition) {
      return res.status(404).json({ success: false, message: "Audition not found" });
    }

    res.json({ success: true, data: audition });
  } catch (error) {
    console.error("Get audition by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch audition" });
  }
};

/**
 * Update Audition by ID
 */
export const updateAudition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateAuditionSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid audition ID format" });
    }

    const audition = await AuditionModel.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!audition) {
      return res.status(404).json({ success: false, message: "Audition not found" });
    }

    res.json({ success: true, data: audition });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update audition error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Audition by ID
 */
export const deleteAudition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid audition ID format" });
    }

    const deleted = await AuditionModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Audition not found" });
    }

    res.json({ success: true, message: "Audition deleted successfully" });
  } catch (error) {
    console.error("Delete audition error:", error);
    res.status(500).json({ success: false, message: "Failed to delete audition" });
  }
};
