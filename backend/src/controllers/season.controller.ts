import { Request, Response } from "express";
import { SeasonModel, EventModel } from "../models/events.model";
import { createSeasonSchema, updateSeasonSchema } from "../validations/season.validation";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

/**
 * Helper function to safely delete a file
 */
const deleteFile = (filePath: string): void => {
  try {
    if (filePath && filePath.trim() !== "") {
      const fullPath = path.resolve(filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

/**
 * Create Season under an existing Event
 */
export const createSeason = async (req: Request, res: Response) => {
  try {
    // Validate text fields
    const validatedData = createSeasonSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(validatedData.eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID format" });
    }

    const eventExists = await EventModel.exists({ _id: validatedData.eventId });
    if (!eventExists) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check if required image was uploaded
    if (!req.files || !(req.files as any).image) {
      return res.status(400).json({
        success: false,
        message: "Main image is required"
      });
    }

    // Get file paths
    const image = (req.files as any).image[0].path;
    const titleImage = (req.files as any).titleImage ? (req.files as any).titleImage[0].path : undefined;
    const posterImage = (req.files as any).posterImage ? (req.files as any).posterImage[0].path : undefined;

    // Create season with file paths
    const seasonData = {
      ...validatedData,
      image,
      ...(titleImage && { titleImage }),
      ...(posterImage && { posterImage }),
    };

    const season = await SeasonModel.create(seasonData);

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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    // Get existing season to check for old images
    const existingSeason = await SeasonModel.findById(id);
    if (!existingSeason) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    // Validate text fields
    const validatedData = updateSeasonSchema.parse(req.body);

    // Handle image uploads
    const updateData: any = { ...validatedData };

    if (req.files) {
      const files = req.files as any;

      // Update only the images that were uploaded and delete old ones
      if (files.image) {
        // Delete old main image if it exists
        if (existingSeason.image) {
          deleteFile(existingSeason.image);
        }
        updateData.image = files.image[0].path;
      }
      if (files.titleImage) {
        // Delete old title image if it exists
        if (existingSeason.titleImage) {
          deleteFile(existingSeason.titleImage);
        }
        updateData.titleImage = files.titleImage[0].path;
      }
      if (files.posterImage) {
        // Delete old poster image if it exists
        if (existingSeason.posterImage) {
          deleteFile(existingSeason.posterImage);
        }
        updateData.posterImage = files.posterImage[0].path;
      }
    }

    const updatedSeason = await SeasonModel.findByIdAndUpdate(id, updateData, {
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

    const season = await SeasonModel.findById(id);
    if (!season) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    // Delete associated image files
    if (season.image) {
      deleteFile(season.image);
    }
    if (season.titleImage) {
      deleteFile(season.titleImage);
    }
    if (season.posterImage) {
      deleteFile(season.posterImage);
    }

    const deletedSeason = await SeasonModel.findByIdAndDelete(id);
    if (!deletedSeason) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, message: "Season deleted successfully" });
  } catch (error) {
    console.error("Delete season error:", error);
    res.status(500).json({ success: false, message: "Failed to delete season" });
  }
};
