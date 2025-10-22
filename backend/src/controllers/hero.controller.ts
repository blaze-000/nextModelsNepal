import { Request, Response } from "express";
import { HeroModel } from '../models/hero.model.js';
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
 * Get hero data
 */
export const getHeroItem = async (_req: Request, res: Response) => {
  try {
    const heroItems = await HeroModel.find();

    // Check for upcoming and ongoing events
    const { SeasonModel } = await import("../models/events.model");

    // Check if there are any upcoming events
    const upcomingEventsCount = await SeasonModel.countDocuments({ status: "upcoming" });
    const hasUpcomingEvents = upcomingEventsCount > 0;

    // Check if there are any ongoing events
    const ongoingEventsCount = await SeasonModel.countDocuments({ status: "ongoing" });
    const hasOngoingEvents = ongoingEventsCount > 0;

    return res.status(200).json({
      success: true,
      message:
        heroItems.length > 0
          ? "Hero items retrieved successfully."
          : "No hero items found.",
      data: heroItems,
      upcoming: hasUpcomingEvents,
      ongoing: hasOngoingEvents,
    });
  } catch (error: any) {
    console.error("Error fetching Hero items:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving Hero items.",
    });
  }
};

/**
 * Get single hero by ID
 */
export const getHeroItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const heroItem = await HeroModel.findById(id);

    if (!heroItem) {
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hero item retrieved successfully.",
      data: heroItem,
    });
  } catch (error: any) {
    console.error(
      `Error fetching Hero item with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving Hero item.",
    });
  }
};

/**
 * Create hero item
 */
export const createHeroItem = async (req: Request, res: Response) => {
  try {
    // Check if hero item already exists (only one allowed)
    const existingHero = await HeroModel.findOne();
    if (existingHero) {
      return res.status(400).json({
        success: false,
        message: "Hero item already exists. Only one hero item is allowed.",
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files.titleImage || files.titleImage.length === 0) {
      return res.status(400).json({
        success: false,
        message: "titleImage is required.",
      });
    }

    // Process titleImage
    const titleImagePath = files.titleImage[0].path;

    // Process images array (up to 4 images)
    const imagepath1 = files.image_1?.[0]?.path || "";
    const imagepath2 = files.image_2?.[0]?.path || "";
    const imagepath3 = files.image_3?.[0]?.path || "";
    const imagepath4 = files.image_4?.[0]?.path || "";

    const heroSection = await HeroModel.create({
      image_1: imagepath1,
      image_2: imagepath2,
      image_3: imagepath3,
      image_4: imagepath4,
      titleImage: titleImagePath,
    });

    res.status(201).json({
      success: true,
      message: "Hero section item created successfully.",
      data: heroSection,
    });
  } catch (error: any) {
    console.error("Error creating Hero items:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating Hero item.",
      error: error.message,
    });
  }
};

/**
 * Update hero by ID
 */
export const updateheroById = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { removedExistingIndices, removedTitleImage } = req.body;

    const existingHero = await HeroModel.findOne();
    if (!existingHero) {
      // Clean up uploaded files if hero not found
      const allFileFields = [
        "titleImage",
        "image_1",
        "image_2",
        "image_3",
        "image_4",
      ];
      allFileFields.forEach((field) => {
        if (files?.[field]) {
          files[field].forEach((file) => deleteFile(file.path));
        }
      });

      return res.status(404).json({
        success: false,
        message: `Hero item not found.`,
      });
    }

    // Prepare update data
    const updateData: any = {};
    const filesToDelete: string[] = [];

    // Handle title image removal or update
    if (removedTitleImage === "true") {
      // User wants to remove title image
      if (existingHero.titleImage && existingHero.titleImage.trim() !== "") {
        filesToDelete.push(existingHero.titleImage);
      }
      updateData.titleImage = "";
    } else if (files?.titleImage && files.titleImage.length > 0) {
      // User uploaded new title image
      if (existingHero.titleImage && existingHero.titleImage.trim() !== "") {
        filesToDelete.push(existingHero.titleImage);
      }
      updateData.titleImage = files.titleImage[0].path.replace(/\\/g, "/");
    }

    // Handle individual image updates and removals
    const imageFields = ["image_1", "image_2", "image_3", "image_4"];
    const removedIndices = removedExistingIndices
      ? JSON.parse(removedExistingIndices)
      : [];

    imageFields.forEach((field, index) => {
      const isRemoved = removedIndices.includes(index);
      const hasNewFile = files?.[field] && files[field].length > 0;

      if (isRemoved) {
        // User wants to remove this image
        const currentImage = existingHero[
          field as keyof typeof existingHero
        ] as string;
        if (currentImage && currentImage.trim() !== "") {
          filesToDelete.push(currentImage);
        }
        updateData[field] = "";
      } else if (hasNewFile) {
        // User uploaded new image for this slot
        const currentImage = existingHero[
          field as keyof typeof existingHero
        ] as string;
        if (currentImage && currentImage.trim() !== "") {
          filesToDelete.push(currentImage);
        }
        updateData[field] = files[field][0].path.replace(/\\/g, "/");
      }
    });

    // Update the database
    const updatedItem = await HeroModel.findByIdAndUpdate(
      existingHero._id,
      updateData,
      { new: true }
    );

    // Delete old files after successful database update
    filesToDelete.forEach(deleteFile);

    return res.status(200).json({
      success: true,
      message: "Hero item updated successfully.",
      data: updatedItem,
    });
  } catch (error: any) {
    console.error(
      `Error updating Hero item with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating Hero item.",
      error: error.message,
    });
  }
};

/**
 * Delete hero by ID
 */
export const deleteheroById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const heroToDelete = await HeroModel.findById(id);

    if (!heroToDelete) {
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

    // Collect all image files to delete
    const filesToDelete: string[] = [];

    // Add titleImage to deletion list
    if (heroToDelete.titleImage && heroToDelete.titleImage.trim() !== "") {
      filesToDelete.push(heroToDelete.titleImage);
    }

    // Add all individual images to deletion list
    if (heroToDelete.image_1 && heroToDelete.image_1.trim() !== "") {
      filesToDelete.push(heroToDelete.image_1);
    }
    if (heroToDelete.image_2 && heroToDelete.image_2.trim() !== "") {
      filesToDelete.push(heroToDelete.image_2);
    }
    if (heroToDelete.image_3 && heroToDelete.image_3.trim() !== "") {
      filesToDelete.push(heroToDelete.image_3);
    }
    if (heroToDelete.image_4 && heroToDelete.image_4.trim() !== "") {
      filesToDelete.push(heroToDelete.image_4);
    }

    // Delete the database record
    const deletedItem = await HeroModel.findByIdAndDelete(id);

    // Delete all associated files
    filesToDelete.forEach(deleteFile);

    return res.status(200).json({
      success: true,
      message: "Hero item deleted successfully.",
      data: deletedItem,
    });
  } catch (error: any) {
    console.error(
      `Error deleting Hero item with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting Hero item.",
      error: error.message,
    });
  }
};
