import { Request, Response } from "express";
import { HeroModel } from "../models/hero.model";
import { heroItemSchema } from "../validations/hero.validation";
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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || Object.keys(files).length === 0) {

      return res.status(400).json({ error: "At least one image file is required." });

    }

    // Handle req.body properly for file uploads

    const bodyData = req.body || {};

    // Only validate text fields if they exist and are not empty

    let maintitle, subtitle, description;

    if (Object.keys(bodyData).length > 0) {

      try {

        const textFields = heroItemSchema.pick({ maintitle: true, subtitle: true, description: true }).parse(bodyData);

        ({ maintitle, subtitle, description } = textFields);

      } catch (validationError: any) {

        // If validation fails, set fields to undefined (they're optional anyway)

        maintitle = subtitle = description = undefined;

      }

    }

    // Initialize images array with 4 slots

    const imagePaths: string[] = new Array(4).fill("");

    let titleImagePath: string | undefined;

    // Handle position-specific image uploads

   

    const filesArray = files as unknown as Express.Multer.File[];

    if (filesArray && Array.isArray(filesArray)) {

      filesArray.forEach((file) => {

        const fieldName = file.fieldname;

        if (fieldName.startsWith("image_")) {

          const position = parseInt(fieldName.split("_")[1]);

          if (!isNaN(position) && position >= 0 && position < 4) {

            const newImagePath = file.path.replace(/\\/g, "/");

            imagePaths[position] = newImagePath;

          }

        } else if (fieldName === "titleImage") {

          titleImagePath = file.path.replace(/\\/g, "/");

        }

      });

    }

    // If no titleImage was uploaded, use the first non-empty image as titleImage

    if (!titleImagePath) {

      const firstImage = imagePaths.find((img) => img && img.length > 0);

      if (firstImage) {

        titleImagePath = firstImage;

      }

    }

    // Ensure we have at least one image

    const hasImage =

      imagePaths.some((img) => img && img.length > 0) || titleImagePath;

    if (!hasImage) {

      return res

        .status(400)

        .json({ error: "At least one image file is required." });

    }

    const heroSection = await HeroModel.create({

      maintitle,

      subtitle,

      description,

      images: imagePaths,

      titleImage:

        titleImagePath || imagePaths.find((img) => img && img.length > 0) || "",

    });

    res.status(201).json({

      success: true,

      message: "Hero section item created successfully.",

      data: heroSection,

    });

  } catch (error: any) {

    console.error("Error creating Hero items:", error.message);

    return res.status(400).json({

      success: false,

      message: "Invalid input data.",

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
    const files = req.files as Express.Multer.File[];

    const existingHero = await HeroModel.findById(id);
    if (!existingHero) {
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

    // Start with existing images, ensure we have 4 slots
    const updatedImages = [...(existingHero.images || [])];
    while (updatedImages.length < 4) {
      updatedImages.push("");
    }

    // Handle removed existing images first
    let removedExistingIndices: number[] = [];
    try {
      if (req.body.removedExistingIndices) {
        removedExistingIndices = JSON.parse(req.body.removedExistingIndices);
      }
    } catch (e) {
      console.log("Could not parse removedExistingIndices:", e);
    }

    // Track files to delete when they are being replaced or removed
    const filesToDelete: string[] = [];

    // Clear removed positions and mark files for deletion
    removedExistingIndices.forEach((index: number) => {
      if (
        index >= 0 &&
        index < 4 &&
        updatedImages[index] &&
        updatedImages[index].trim() !== ""
      ) {
        filesToDelete.push(updatedImages[index]);
        updatedImages[index] = "";
      }
    });

    // Process new uploaded files
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.fieldname.startsWith("image_")) {
          const position = parseInt(file.fieldname.split("_")[1]);
          if (position >= 0 && position < 4) {
            // If there was an existing image at this position, mark it for deletion (replacement)
            if (
              updatedImages[position] &&
              updatedImages[position].trim() !== ""
            ) {
              filesToDelete.push(updatedImages[position]);
            }
            // Set new image path - multer already generates consistent naming
            updatedImages[position] = file.path.replace(/\\/g, "/");
          }
        }
      });
    }

    // Update titleImage to first non-empty image
    const titleImage = updatedImages.find((img) => img !== "") || "";

    // Update the database
    const updatedItem = await HeroModel.findByIdAndUpdate(
      id,
      {
        images: updatedImages,
        titleImage,
      },
      { new: true }
    );

    // Delete old files after successful database update (this handles both replacement and removal)
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
