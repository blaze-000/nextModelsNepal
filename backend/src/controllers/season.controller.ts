import { Request, Response } from "express";
import { SeasonModel, EventModel } from "../models/events.model";
import { createSeasonSchema, updateSeasonSchema } from "../validations/season.validation";
import mongoose from "mongoose";

/**
 * Create Season under an existing Event
 */
export const createSeason = async (req: Request, res: Response) => {
  try {
    const validatedData = createSeasonSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(validatedData.eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID format" });
    }

    const eventExists = await EventModel.exists({ _id: validatedData.eventId });
    if (!eventExists) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const season = await SeasonModel.create(validatedData);

    res.status(201).json({ success: true, data: season });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create season error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Seasons by Event ID
 */
export const getSeasonsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10, status, sort = "year", order = "desc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID format" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = { eventId };
    if (status && ["upcoming", "ongoing", "ended"].includes(String(status))) {
      filter.status = status;
    }

    const seasons = await SeasonModel.find(filter)
      .populate("contestants")
      .populate("winners")
      .populate("jury")
      .populate("sponsors")
      .populate("criteria")
      .populate("auditions")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await SeasonModel.countDocuments(filter);

    res.json({
      success: true,
      data: seasons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get seasons by event error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch seasons" });
  }
};

/**
 * Get All Seasons (with optional filtering)
 */
export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, eventId, sort = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = {};
    if (status && ["upcoming", "ongoing", "ended"].includes(String(status))) {
      filter.status = status;
    }
    if (eventId && mongoose.Types.ObjectId.isValid(String(eventId))) {
      filter.eventId = eventId;
    }

    const seasons = await SeasonModel.find(filter)
      .populate("contestants")
      .populate("winners")
      .populate("jury")
      .populate("sponsors")
      .populate("criteria")
      .populate("auditions")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await SeasonModel.countDocuments(filter);

    res.json({
      success: true,
      data: seasons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all seasons error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch seasons" });
  }
};

/**
 * Get Season by ID
 */
export const getSeasonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const season = await SeasonModel.findById(id)
      .populate("contestants")
      .populate("winners")
      .populate("jury")
      .populate("sponsors")
      .populate("criteria")
      .populate("auditions");

    if (!season) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, data: season });
  } catch (error) {
    console.error("Get season by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch season" });
  }
};

/**
 * Update Season by ID
 */
export const updateSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateSeasonSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const updatedSeason = await SeasonModel.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeason) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, data: updatedSeason });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update season error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Season by ID
 */
export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const season = await SeasonModel.findByIdAndDelete(id);

    if (!season) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, message: "Season deleted successfully" });
  } catch (error) {
    console.error("Delete season error:", error);
    res.status(500).json({ success: false, message: "Failed to delete season" });
  }
};
