import { Request, Response } from "express";
import { JuryModel, SeasonModel } from "../models/events.model";
import { createJurySchema, updateJurySchema } from "../validations/jury.validation";
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
        // Production: File deletion logged
      }
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

/**
 * Create Jury member under a Season
 */
export const createJury = async (req: Request, res: Response) => {
  try {
    const validatedData = createJurySchema.parse(req.body);
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
        message: "Jury image is required"
      });
    }
    
    // Get file path
    const image = req.file.path;
    
    // Create jury member with image path
    const jury = await JuryModel.create({
      ...validatedData,
      image
    });
    
    res.status(201).json({ success: true, data: jury });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create jury error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Jury members by Season ID
 */
export const getJuryBySeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const { page = 1, limit = 10, sort = "name", order = "asc" } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;
    
    const juryMembers = await JuryModel.find({ seasonId })
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);
    
    const total = await JuryModel.countDocuments({ seasonId });
    
    res.json({
      success: true,
      data: juryMembers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get jury by season error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jury members" });
  }
};

/**
 * Get All Jury members (with optional filtering)
 */
export const getAllJury = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, seasonId, sort = "createdAt", order = "desc" } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;
    
    // Build filter object
    const filter: any = {};
    if (seasonId && mongoose.Types.ObjectId.isValid(String(seasonId))) {
      filter.seasonId = seasonId;
    }
    
    const juryMembers = await JuryModel.find(filter)
      .populate("seasonId", "year slug")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);
    
    const total = await JuryModel.countDocuments(filter);
    
    res.json({
      success: true,
      data: juryMembers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all jury error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jury members" });
  }
};

/**
 * Get Jury member by ID
 */
export const getJuryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid jury ID format" });
    }
    
    const jury = await JuryModel.findById(id).populate("seasonId", "year slug");
    if (!jury) {
      return res.status(404).json({ success: false, message: "Jury member not found" });
    }
    
    res.json({ success: true, data: jury });
  } catch (error) {
    console.error("Get jury by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jury member" });
  }
};

/**
 * Update Jury member by ID
 */
export const updateJury = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateJurySchema.parse(req.body);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid jury ID format" });
    }
    
    // Get existing jury member to check for old image
    const existingJury = await JuryModel.findById(id);
    if (!existingJury) {
      return res.status(404).json({ success: false, message: "Jury member not found" });
    }
    
    // Handle image update if a new file was uploaded
    const updateData: any = { ...validatedData };
    
    if (req.file) {
      // Delete old image if it exists
      if (existingJury.image) {
        deleteFile(existingJury.image);
      }
      // Set new image path
      updateData.image = req.file.path;
    }
    
    const jury = await JuryModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (!jury) {
      return res.status(404).json({ success: false, message: "Jury member not found" });
    }
    
    res.json({ success: true, data: jury });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update jury error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Jury member by ID
 */
export const deleteJury = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid jury ID format" });
    }
    
    const jury = await JuryModel.findById(id);
    if (!jury) {
      return res.status(404).json({ success: false, message: "Jury member not found" });
    }
    
    // Delete associated image file
    if (jury.image) {
      deleteFile(jury.image);
    }
    
    const deleted = await JuryModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Jury member not found" });
    }
    
    res.json({ success: true, message: "Jury member deleted successfully" });
  } catch (error) {
    console.error("Delete jury error:", error);
    res.status(500).json({ success: false, message: "Failed to delete jury member" });
  }
};