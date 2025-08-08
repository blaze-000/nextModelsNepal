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
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "One image file is required." });
        }

        // Handle req.body properly for file uploads
        const bodyData = req.body || {};
        const heroItem = heroItemSchema.parse(bodyData);
        const { maintitle, subtitle, description } = heroItem;

        const imagePaths = files.map(file => file.path);

        const heroSection = await HeroModel.create({
            maintitle,
            subtitle,
            description,
            images: imagePaths
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

        const files = req.files as Express.Multer.File[] | undefined;

        let updateData: any = {};

        if (files && files.length > 0) {
            // When files are present, req.body might be undefined, so we need to handle it properly
            const bodyData = req.body || {};
            
            // Only validate if there are text fields in the body
            let validatedData: any = { maintitle: undefined, subtitle: undefined, description: undefined };
            if (Object.keys(bodyData).length > 0) {
                validatedData = heroItemSchema.parse(bodyData);
            }
            
            const { maintitle, subtitle, description } = validatedData;

            const newImagePaths = files.map(file => file.path);

            const existingHero = await HeroModel.findById(id);
            if (!existingHero) {
                return res.status(404).json({
                    success: false,
                    message: `Hero item with ID ${id} not found.`,
                });
            }

            // Combine existing images with new images
            const existingImages = existingHero.images || [];
            const updatedImages = [...existingImages, ...newImagePaths];

            updateData = {
                ...(maintitle !== undefined && { maintitle }),
                ...(subtitle !== undefined && { subtitle }),
                ...(description !== undefined && { description }),
                images: updatedImages
            };
        } else {
            // Handle case where req.body might be undefined
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
