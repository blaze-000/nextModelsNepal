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

        // Handle req.body properly for file uploads
        const bodyData = req.body || {};
        
        // Validate only the text fields, not the file fields
        const textFields = heroItemSchema.pick({ maintitle: true, subtitle: true, description: true }).parse(bodyData);
        const { maintitle, subtitle, description } = textFields;

        // Extract image paths from uploaded files
        const imagePaths: string[] = [];
        let titleImagePath: string | undefined;

        // Handle images field
        if (files.images && files.images.length > 0) {
            imagePaths.push(...files.images.map(file => file.path));
        }

        // Handle titleImage field
        if (files.titleImage && files.titleImage.length > 0) {
            titleImagePath = files.titleImage[0].path;
        }

        // If no titleImage was uploaded, use the first image as titleImage
        if (!titleImagePath && imagePaths.length > 0) {
            titleImagePath = imagePaths[0];
        }

        // Ensure we have at least one image
        if (imagePaths.length === 0 && !titleImagePath) {
            return res.status(400).json({ error: "At least one image file is required." });
        }

        const heroSection = await HeroModel.create({
            maintitle,
            subtitle,
            description,
            images: imagePaths,
            titleImage: titleImagePath || imagePaths[0] // Use titleImage if available, otherwise first image
        });

        res.status(201).json({ message: "Hero section item created successfully.", heroSection });
    } catch (error: any) {
        console.error("Error creating Hero items:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
}

/**
 * Update a Hero item by ID
 */
export const updateheroById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        let updateData: any = {};

        if (files && Object.keys(files).length > 0) {
            // When files are present, handle them properly
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

            // Handle image updates
            let updatedImages = existingHero.images || [];
            let updatedTitleImage = existingHero.titleImage;

            // Handle images field
            if (files.images && files.images.length > 0) {
                const newImagePaths = files.images.map(file => file.path);
                updatedImages = [...newImagePaths];
            }

            // Handle titleImage field
            if (files.titleImage && files.titleImage.length > 0) {
                updatedTitleImage = files.titleImage[0].path;
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
