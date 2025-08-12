import { Request, Response } from "express";
import { WinnerModel, SeasonModel } from "../models/events.model";
import { createWinnerSchema, updateWinnerSchema } from "../validations/winner.validation";
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
 * Create Winner under a Season
 */
export const createWinner = async (req: Request, res: Response) => {
  try {
    const validatedData = createWinnerSchema.parse(req.body);
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
        message: "Winner image is required"
      });
    }
    
    // Get file path
    const image = req.file.path;
    
    // Create winner with image path
    const winner = await WinnerModel.create({
      ...validatedData,
      image
    });
    
    res.status(201).json({ success: true, data: winner });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create winner error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Winners by Season ID
 */
export const getWinnersBySeason = async (req: Request, res: Response) => {
  try {
    const { seasonId } = req.params;
    const { page = 1, limit = 10, rank, sort = "rank", order = "asc" } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(seasonId)) {
      return res.status(400).json({ success: false, message: "Invalid season ID format" });
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;
    
    // Build filter object
    const filter: any = { seasonId };
    if (rank) {
      filter.rank = rank;
    }
    
    const winners = await WinnerModel.find(filter)
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);
    
    const total = await WinnerModel.countDocuments(filter);
    
    res.json({
      success: true,
      data: winners,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get winners by season error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch winners" });
  }
};

/**
 * Get All Winners (with optional filtering)
 */
export const getAllWinners = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, rank, seasonId, sort = "createdAt", order = "desc" } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;
    
    // Build filter object
    const filter: any = {};
    if (rank) {
      filter.rank = rank;
    }
    if (seasonId && mongoose.Types.ObjectId.isValid(String(seasonId))) {
      filter.seasonId = seasonId;
    }
    
    const winners = await WinnerModel.find(filter)
      .populate("seasonId", "year slug")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);
    
    const total = await WinnerModel.countDocuments(filter);
    
    res.json({
      success: true,
      data: winners,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get all winners error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch winners" });
  }
};

/**
 * Get Winner by ID
 */
export const getWinnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid winner ID format" });
    }
    
    const winner = await WinnerModel.findById(id).populate("seasonId", "year slug");
    if (!winner) {
      return res.status(404).json({ success: false, message: "Winner not found" });
    }
    
    res.json({ success: true, data: winner });
  } catch (error) {
    console.error("Get winner by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch winner" });
  }
};

/**
 * Update Winner by ID
 */
export const updateWinner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateWinnerSchema.parse(req.body);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid winner ID format" });
    }
    
    // Get existing winner to check for old image
    const existingWinner = await WinnerModel.findById(id);
    if (!existingWinner) {
      return res.status(404).json({ success: false, message: "Winner not found" });
    }
    
    // Handle image update if a new file was uploaded
    const updateData: any = { ...validatedData };
    
    if (req.file) {
      // Delete old image if it exists
      if (existingWinner.image) {
        deleteFile(existingWinner.image);
      }
      // Set new image path
      updateData.image = req.file.path;
    }
    
    const winner = await WinnerModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (!winner) {
      return res.status(404).json({ success: false, message: "Winner not found" });
    }
    
    res.json({ success: true, data: winner });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update winner error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Winner by ID
 */
export const deleteWinner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid winner ID format" });
    }
    
    const winner = await WinnerModel.findById(id);
    if (!winner) {
      return res.status(404).json({ success: false, message: "Winner not found" });
    }
    
    // Delete associated image file
    if (winner.image) {
      deleteFile(winner.image);
    }
    
    const deleted = await WinnerModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Winner not found" });
    }
    
    res.json({ success: true, message: "Winner deleted successfully" });
  } catch (error) {
    console.error("Delete winner error:", error);
    res.status(500).json({ success: false, message: "Failed to delete winner" });
  }
};
