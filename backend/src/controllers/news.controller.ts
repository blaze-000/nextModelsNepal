import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import { newsSchema } from "../validations/news.validation";

/**
 * Fetch all News items
 */
export const getNewsItems = async (_req: Request, res: Response) => {
    try {
        const newsItems = await NewsModel.find({});
        if (!newsItems || newsItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No news items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "News items retrieved successfully.",
            data: newsItems,
        });
    } catch (error: any) {
        console.error("Error fetching News items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving News items.",
        });
    }
};

/**
 * Get single News item by ID
 */
export const getNewsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const newsItem = await NewsModel.findById(id);

        if (!newsItem) {
            return res.status(404).json({
                success: false,
                message: `News item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "News item retrieved successfully.",
            data: newsItem,
        });
    } catch (error: any) {
        console.error(`Error fetching News item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving News item.",
        });
    }
};

/**
 * Create News item
 */
export const createNewsItem = async (req: Request, res: Response) => {
    try {
        const newsData = newsSchema.parse(req.body);
        const { maintitle, description, item } = newsData;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let imagePaths: string[] = [];

        if (files && files['images']) {
            imagePaths = files['images'].map(file => file.path);
        }

        // If images are uploaded, add them to the first coverage item or create a new one
        let processedItems = item || [];
        if (imagePaths.length > 0) {
            if (processedItems.length > 0) {
                // Add images to the first coverage item
                const firstItem = processedItems[0] as any;
                processedItems[0] = {
                    ...firstItem,
                    images: [...(firstItem.images || []), ...imagePaths]
                };
            } else {
                // Create a new coverage item with images
                processedItems = [{
                    index: "1",
                    title: "News Coverage",
                    description: "News coverage with images",
                    images: imagePaths
                }];
            }
        }

        const newsSection = await NewsModel.create({
            maintitle,
            description,
            item: processedItems
        });

        res.status(201).json({
            success: true,
            message: "News section item created successfully.",
            data: newsSection
        }); 
    } catch (error: any) {
        console.error("Error creating News item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
};

/**
 * Update a News item by ID
 */
export const updateNewsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Check if files are present
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        let updateData: any = {};
        
        if (files && files['images'] && files['images'].length > 0) {
            // If files are present, validate with newsSchema
            const validatedData = newsSchema.parse(req.body);
            const { maintitle, description, item } = validatedData;
            
            // Get all uploaded image paths
            const newImagePaths = files['images'].map(file => file.path);
            
            // Get the existing news item
            const existingNews = await NewsModel.findById(id);
            if (!existingNews) {
                return res.status(404).json({
                    success: false,
                    message: `News item with ID ${id} not found.`,
                });
            }
            
            // Process items with new images
            let processedItems = item || [];
            if (processedItems.length > 0) {
                // Add images to the first coverage item
                const firstItem = processedItems[0] as any;
                processedItems[0] = {
                    ...firstItem,
                    images: [...(firstItem.images || []), ...newImagePaths]
                };
            } else {
                // Create a new coverage item with images
                processedItems = [{
                    index: "1",
                    title: "News Coverage",
                    description: "News coverage with images",
                    images: newImagePaths
                }];
            }
            
            updateData = {
                maintitle,
                description,
                item: processedItems
            };
        } else {
            // If no files, only validate the fields that are present in req.body
            const { maintitle, description, item } = req.body;
            
            if (maintitle !== undefined) updateData.maintitle = maintitle;
            if (description !== undefined) updateData.description = description;
            if (item !== undefined) updateData.item = item;
            
            // If no fields are provided, return error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update.",
                });
            }
        }
        
        const updatedItem = await NewsModel.findByIdAndUpdate(id, updateData, {
            new: true,
            upsert: false,
        });
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `News item with ID ${id} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "News item updated successfully.",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error(`Error updating News item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating News item.",
            error: error.message,
        });
    }
};

/**
 * Delete a News item by ID
 */
export const deleteNewsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await NewsModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `News item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "News item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting News item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting News item.",
            error: error.message,
        });
    }
}; 