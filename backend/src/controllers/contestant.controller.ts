import { Request, Response } from "express";
import { ContestantModel, SeasonModel } from "../models/events.model";
import { createContestantSchema, updateContestantSchema } from "../validations/contestant.validation";
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
 * Create Contestant under a Season
 */
export const createContestant = async (req: Request, res: Response) => {
  try {
    const validatedData = createContestantSchema.parse(req.body);
    if (!mongoose.Types.ObjectId.isValid(validatedData.seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }
    const seasonExists = await SeasonModel.exists({ _id: validatedData.seasonId });
    if (!seasonExists) {
      return res.status(404).json({ success: false, message: "Season not found" });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Contestant image is required"
      });
    }

    // Get file path
    const image = req.file.path;

    // Create contestant with image path
    const contestant = await ContestantModel.create({
      ...validatedData,
      image
    });

    res.status(201).json({ success: true, data: contestant });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create contestant error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Contestants by Season ID
 */
export const getContestantsBySeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const { page = 1, limit = 10, gender, sort = "name", order = "asc" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Build filter object
    const filter: any = { seasonId };
    if (gender && ["Male", "Female"].includes(String(gender))) {
      filter.gender = gender;
    }

    const contestants = await ContestantModel.find(filter)
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await ContestantModel.countDocuments(filter);

    res.json({
      success: true,
      data: contestants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get contestants by season error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contestants" });
  }
};

/**
 * Get All Contestants (with optional filtering)
 */
export const getAllContestants = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, gender, seasonId, sort = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Build filter object
    const filter: any = {};
    if (gender && ["Male", "Female"].includes(String(gender))) {
      filter.gender = gender;
    }
    if (seasonId && mongoose.Types.ObjectId.isValid(String(seasonId))) {
      filter.seasonId = seasonId;
    }

    const contestants = await ContestantModel.find(filter)
      .populate("seasonId", "year slug")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await ContestantModel.countDocuments(filter);

    res.json({
      success: true,
      data: contestants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all contestants error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contestants" });
  }
};

/**
 * Get Contestant by ID
 */
export const getContestantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid contestant ID format" });
    }

    const contestant = await ContestantModel.findById(id).populate("seasonId", "year slug votingOpened");
    if (!contestant) {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    // Check if contestant is eliminated
    if (contestant.status === "eliminated") {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    // Check if parent season's voting is on
    const season = contestant.seasonId as any;
    if (!season || !season.votingOpened) {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    res.json({ success: true, data: contestant });
  } catch (error) {
    console.error("Get contestant by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contestant" });
  }
};

/**
 * Update Contestant by ID
 */
export const updateContestant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateContestantSchema.parse(req.body);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid contestant ID format" });
    }

    // Get existing contestant to check for old image
    const existingContestant = await ContestantModel.findById(id);
    if (!existingContestant) {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    // Handle image update if a new file was uploaded
    const updateData: any = { ...validatedData };

    if (req.file) {
      // Delete old image if it exists
      if (existingContestant.image) {
        deleteFile(existingContestant.image);
      }
      // Set new image path
      updateData.image = req.file.path;
    }

    const contestant = await ContestantModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!contestant) {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    res.json({ success: true, data: contestant });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update contestant error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Contestant by ID
 */
export const deleteContestant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid contestant ID format" });
    }

    const contestant = await ContestantModel.findById(id);
    if (!contestant) {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    // Delete associated image file
    if (contestant.image) {
      deleteFile(contestant.image);
    }

    const deleted = await ContestantModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Contestant not found" });
    }

    res.json({ success: true, message: "Contestant deleted successfully" });
  } catch (error) {
    console.error("Delete contestant error:", error);
    res.status(500).json({ success: false, message: "Failed to delete contestant" });
  }
};
