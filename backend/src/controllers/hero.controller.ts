import { Request, Response } from "express";
import { HeroModel } from "../models/hero.model";
import { heroItemSchema } from "../validations/hero.validation";

/**
 * Fetch all Hero items
 */
export const getHeroItem = async (_req: Request, res: Response) => {
  try {
    const heroItems = await HeroModel.find();
    if (!heroItems || heroItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hero items found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hero items retrieved successfully.",
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
 * Get single Hero item by ID
 */
export const getHeroItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventItem = await HeroModel.findById(id);

    if (!eventItem) {
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hero item retrieved successfully.",
      data: eventItem,
    });
  } catch (error: any) {
    console.error(`Error fetching Hero item with ID ${req.params.id}:`, error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving Hero item.",
    });
  }
};

/**
 * Create multiple Heroitems
 */
export const createHeroItem = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: "At least one image file is required." });
    }

    const bodyData = req.body || {};

    let maintitle, subtitle, description;
    if (Object.keys(bodyData).length > 0) {
      try {
        const textFields = heroItemSchema.pick({ maintitle: true, subtitle: true, description: true }).parse(bodyData);
        ({ maintitle, subtitle, description } = textFields);
      } catch {
        maintitle = subtitle = description = undefined;
      }
    }

    const imagePaths: string[] = new Array(4).fill("");
    let titleImagePath: string | undefined;

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

    if (!titleImagePath) {
      const firstImage = imagePaths.find((img) => img && img.length > 0);
      if (firstImage) {
        titleImagePath = firstImage;
      }
    }

    const hasImage = imagePaths.some((img) => img && img.length > 0) || titleImagePath;
    if (!hasImage) {
      return res.status(400).json({ error: "At least one image file is required." });
    }

    // ✅ Check if a hero section already exists
    const existingHero = await HeroModel.findOne();

    let heroSection;
    if (existingHero) {
      // Update existing
      existingHero.maintitle = maintitle ?? existingHero.maintitle;
      existingHero.subtitle = subtitle ?? existingHero.subtitle;
      existingHero.description = description ?? existingHero.description;

      // Replace only provided images, keep existing ones
      imagePaths.forEach((path, idx) => {
        if (path && path.length > 0) {
          existingHero.images[idx] = path;
        }
      });

      if (titleImagePath) {
        existingHero.titleImage = titleImagePath;
      }

      heroSection = await existingHero.save();

      res.status(200).json({
        success: true,
        message: "Hero section item updated successfully.",
        data: heroSection,
      });
    } else {
      // Create new
      heroSection = await HeroModel.create({
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
    }
  } catch (error: any) {
    console.error("Error creating/updating Hero items:", error.message);
    return res.status(400).json({
      success: false,
      message: "Invalid input data.",
      error: error.message,
    });
  }
};


/**
 * Update a Hero item by ID
 */
export const updateheroById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    let updateData: any = {};

    // Check if this is an image operation (files uploaded OR images being removed)
    const hasFiles = files && Object.keys(files).length > 0;
    const hasImageOperations =
      hasFiles ||
      (req.body.removedExistingIndices &&
        req.body.removedExistingIndices !== "[]");

    if (hasImageOperations) {
      // Handle image operations (upload and/or removal)
      const bodyData = req.body || {};

      // Only validate text fields if they exist
            let validatedData: any = { maintitle: undefined, subtitle: undefined, description: undefined };
      if (Object.keys(bodyData).length > 0) {
                validatedData = heroItemSchema.pick({ maintitle: true, subtitle: true, description: true }).parse(bodyData);
      }

      const { maintitle, subtitle, description } = validatedData;

      const existingHero = await HeroModel.findById(id);
      if (!existingHero) {
        return res.status(404).json({
          success: false,
          message: `Hero item with ID ${id} not found.`,
        });
      }

      // Handle image updates with position preservation
      let updatedImages = [...(existingHero.images || [])]; // Start with existing images
      let updatedTitleImage = existingHero.titleImage;

      // Get updated positions from frontend
      const updatedPositionsStr = req.body.updatedPositions;
      const removedIndicesStr = req.body.removedExistingIndices;
      const imageStateStr = req.body.imageState;

      let updatedPositions: number[] = [];
      let removedIndices: number[] = [];
      let imageState: string[] = [];

      try {
        if (updatedPositionsStr)
          updatedPositions = JSON.parse(updatedPositionsStr);
        if (removedIndicesStr) removedIndices = JSON.parse(removedIndicesStr);
        if (imageStateStr) imageState = JSON.parse(imageStateStr);
      } catch (e) {
        // Continue with empty arrays if parsing fails
      }

      // Clear removed positions first
      removedIndices.forEach((position) => {
        if (position >= 0 && position < 4) {
          while (updatedImages.length <= position) {
            updatedImages.push("");
          }
          updatedImages[position] = "";
        }
      });

      // Then handle new file uploads if any
      if (hasFiles) {
        const filesArray = files as unknown as Express.Multer.File[];

        if (filesArray && Array.isArray(filesArray)) {
          filesArray.forEach((file) => {
            const fieldName = file.fieldname;

            if (fieldName.startsWith("image_")) {
              const position = parseInt(fieldName.split("_")[1]);
              if (!isNaN(position) && position >= 0 && position < 4) {
                const newImagePath = file.path.replace(/\\/g, "/");

                while (updatedImages.length <= position) {
                  updatedImages.push("");
                }

                updatedImages[position] = newImagePath;
              }
            } else if (fieldName === "titleImage") {
              updatedTitleImage = file.path.replace(/\\/g, "/");
            }
          });
        }
      }

      // If no titleImage was set and we have images, use the first non-empty image
      if (!updatedTitleImage && updatedImages.length > 0) {
        const firstImage = updatedImages.find((img) => img && img.length > 0);
        if (firstImage) {
          updatedTitleImage = firstImage;
        }
      }

      updateData = {
        ...(maintitle !== undefined && { maintitle }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        images: updatedImages,
        titleImage: updatedTitleImage
      };
    } else {
      // Handle case where only text fields are updated
      const bodyData = req.body || {};
      const { maintitle, subtitle, description } = bodyData;

      if (maintitle !== undefined) updateData.maintitle = maintitle;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (description !== undefined) updateData.description = description;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one field must be provided for update.",
        });
      }
    }

    const updatedItem = await HeroModel.findByIdAndUpdate(id, updateData, {
      new: true,
      upsert: false,
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

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
 * Delete a Hero item by ID
 */
export const deleteheroById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await HeroModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: `Hero item with ID ${id} not found.`,
      });
    }

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
