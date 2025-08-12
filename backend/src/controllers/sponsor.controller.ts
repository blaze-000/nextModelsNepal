import { Request, Response } from "express";
import { SponsorModel, SeasonModel } from "../models/events.model";
import { createSponsorSchema, updateSponsorSchema } from "../validations/sponsor.validation";
import mongoose from "mongoose";

/**
 * Create Sponsor under a Season
 */
export const createSponsor = async (req: Request, res: Response) => {
  try {
    const validatedData = createSponsorSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(validatedData.seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const seasonExists = await SeasonModel.exists({ _id: validatedData.seasonId });
    if (!seasonExists) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    const sponsor = await SponsorModel.create(validatedData);
    res.status(201).json({ success: true, data: sponsor });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create sponsor error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Sponsors by Season ID
 */
export const getSponsorsBySeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const { page = 1, limit = 10, sort = "name", order = "asc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    const sponsors = await SponsorModel.find({ seasonId })
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await SponsorModel.countDocuments({ seasonId });

    res.json({
      success: true,
      data: sponsors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get sponsors by season error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sponsors" });
  }
};

/**
 * Get All Sponsors (with optional filtering)
 */
export const getAllSponsors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, seasonId, sort = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Build filter object
    const filter: any = {};
    if (seasonId && mongoose.Types.ObjectId.isValid(String(seasonId))) {
      filter.seasonId = seasonId;
    }

    const sponsors = await SponsorModel.find(filter)
      .populate("seasonId", "year slug")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await SponsorModel.countDocuments(filter);

    res.json({
      success: true,
      data: sponsors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all sponsors error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sponsors" });
  }
};

/**
 * Get Sponsor by ID
 */
export const getSponsorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid sponsor ID format" });
    }

    const sponsor = await SponsorModel.findById(id).populate("seasonId", "year slug");
    if (!sponsor) {
      return res.status(404).json({ success: false, message: "Sponsor not found" });
    }

    res.json({ success: true, data: sponsor });
  } catch (error) {
    console.error("Get sponsor by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sponsor" });
  }
};

/**
 * Update Sponsor by ID
 */
export const updateSponsor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateSponsorSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid sponsor ID format" });
    }

    const sponsor = await SponsorModel.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!sponsor) {
      return res.status(404).json({ success: false, message: "Sponsor not found" });
    }

    res.json({ success: true, data: sponsor });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update sponsor error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Sponsor by ID
 */
export const deleteSponsor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid sponsor ID format" });
    }

    const deleted = await SponsorModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Sponsor not found" });
    }

    res.json({ success: true, message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Delete sponsor error:", error);
    res.status(500).json({ success: false, message: "Failed to delete sponsor" });
  }
};
