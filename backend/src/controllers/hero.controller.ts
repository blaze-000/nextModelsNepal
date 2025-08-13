import { Request, Response } from "express";
import { HeroModel } from "../models/hero.model";
import { createHeroValidation, updateHeroValidation } from "../validations/hero.validation";
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
 * Get hero data
 */
export const getHeroItem = async (_req: Request, res: Response) => {
  try {
    const heroItems = await HeroModel.find();

    return res.status(200).json({
      success: true,
      message:
        heroItems.length > 0
          ? "Hero items retrieved successfully."
          : "No hero items found.",
      data: heroItems,
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
        message: "titleImage is required." 
      });
    }

    // Validate text fields using Zod
    let maintitle, subtitle, description;
    try {
      const validatedData = createHeroValidation.parse(req.body);
      ({ maintitle, subtitle, description } = validatedData);
    } catch (validationError: any) {
      // Clean up uploaded files if validation fails
      if (files.titleImage) {
        files.titleImage.forEach(file => deleteFile(file.path));
      }
      if (files.images) {
        files.images.forEach(file => deleteFile(file.path));
      }
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationError.errors
      });
    }

    // Process titleImage
    const titleImagePath = files.titleImage[0].path.replace(/\\/g, "/");

    // Process images array (up to 4 images)
    const imagePaths: string[] = [];
    if (files.images && files.images.length > 0) {
      files.images.slice(0, 4).forEach(file => {
        imagePaths.push(file.path.replace(/\\/g, "/"));
      });
    }

    const heroSection = await HeroModel.create({
      maintitle,
      subtitle,
      description,
      images: imagePaths,
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
    const { id } = req.params;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate input data using Zod
    try {
      updateHeroValidation.parse({ ...req.body, id });
    } catch (validationError: any) {
      // Clean up uploaded files if validation fails
      if (files?.titleImage) {
        files.titleImage.forEach(file => deleteFile(file.path));
      }
      if (files?.images) {
        files.images.forEach(file => deleteFile(file.path));
      }
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationError.errors
      });
    }

    const existingHero = await HeroModel.findById(id);
    if (!existingHero) {
      // Clean up uploaded files if hero not found
      if (files?.titleImage) {
        files.titleImage.forEach(file => deleteFile(file.path));
      }
      if (files?.images) {
        files.images.forEach(file => deleteFile(file.path));
      }
      
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

    // Prepare update data with text fields
    const updateData: any = {};
    if (req.body.maintitle !== undefined) updateData.maintitle = req.body.maintitle;
    if (req.body.subtitle !== undefined) updateData.subtitle = req.body.subtitle;
    if (req.body.description !== undefined) updateData.description = req.body.description;

    // Track old files to delete
    const filesToDelete: string[] = [];

    // Handle titleImage update
    if (files?.titleImage && files.titleImage.length > 0) {
      // Mark old titleImage for deletion
      if (existingHero.titleImage && existingHero.titleImage.trim() !== "") {
        filesToDelete.push(existingHero.titleImage);
      }
      // Set new titleImage
      updateData.titleImage = files.titleImage[0].path.replace(/\\/g, "/");
    }

    // Handle images array update
    if (files?.images && files.images.length > 0) {
      // Mark all old images for deletion
      if (existingHero.images && existingHero.images.length > 0) {
        existingHero.images.forEach(imagePath => {
          if (imagePath && imagePath.trim() !== "") {
            filesToDelete.push(imagePath);
          }
        });
      }
      
      // Set new images (up to 4)
      const newImagePaths: string[] = [];
      files.images.slice(0, 4).forEach(file => {
        newImagePaths.push(file.path.replace(/\\/g, "/"));
      });
      updateData.images = newImagePaths;
    }

    // Update the database
    const updatedItem = await HeroModel.findByIdAndUpdate(id, updateData, { new: true });

    // Delete old files after successful database update
    filesToDelete.forEach(deleteFile);

    return res.status(200).json({
      success: true,
      message: "Hero item updated successfully.",
      data: updatedItem,
    });
  } catch (error: any) {
    console.error(`Error updating Hero item with ID ${req.params.id}:`, error.message);
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
    
    // Add all images to deletion list
    if (heroToDelete.images && heroToDelete.images.length > 0) {
      heroToDelete.images.forEach((imagePath) => {
        if (imagePath && imagePath.trim() !== "") {
          filesToDelete.push(imagePath);
        }
      });
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
    console.error(`Error deleting Hero item with ID ${req.params.id}:`, error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting Hero item.",
      error: error.message,
    });
  }
};