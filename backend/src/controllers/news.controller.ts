import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import { newsSchema, newsUpdateSchema } from "../validations/news.validation";

// Helper function to get relative upload path
const getRelativeUploadPath = (file: Express.Multer.File | undefined) => {
    if (!file) return undefined;
    // Convert backslashes to forward slashes and ensure it's a relative path
    const relativePath = file.path.replace(/\\/g, '/').replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/');
    return relativePath;
};

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
        const { title, description, content, year } = newsData;

        console.log('Parsed news data:', newsData);
        console.log('Year value:', year, 'Type:', typeof year);

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let imagePaths: string[] = [];

        console.log('Files received:', files);
        console.log('Files.images:', files?.images);

        if (files && files.images && files.images.length > 0) {
            imagePaths = files.images.map(file => getRelativeUploadPath(file)).filter(Boolean) as string[];
            console.log('Processed image paths:', imagePaths);
        }

        const newsSection = await NewsModel.create({
            title,
            description,
            content,
            year,
            images: imagePaths
        });

        console.log('Created news section:', newsSection);

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
        
        console.log('Update - Files received:', files);
        console.log('Update - Files.images:', files?.images);
        
        if (files && files.images && files.images.length > 0) {
            // If files are present, validate with update schema (all fields optional)
            const validatedData = newsUpdateSchema.parse(req.body);
            const { title, description, content, year } = validatedData;
            
            // Get all uploaded image paths
            const newImagePaths = files.images.map(file => getRelativeUploadPath(file)).filter(Boolean) as string[];
            console.log('Update - New image paths:', newImagePaths);
            
            // Get the existing news item
            const existingNews = await NewsModel.findById(id);
            if (!existingNews) {
                return res.status(404).json({
                    success: false,
                    message: `News item with ID ${id} not found.`,
                });
            }
            
            updateData = {
                title,
                description,
                content,
                year,
                images: [...(existingNews.images || []), ...newImagePaths]
            };
        } else {
            // If no files, only validate the fields that are present in req.body
            const { title, description, content, year } = req.body;
            
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (content !== undefined) updateData.content = content;
            if (year !== undefined) updateData.year = year;
            
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