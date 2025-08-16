import { Request, Response } from "express";
import { NewsModel } from "../models/news.model";
import { createNewsSchema, updateNewsSchema } from "../validations/news.validation";
import fs from "fs";
import path from "path";

// Helper function to delete image files
const deleteImageFile = (imagePath: string) => {
    if (imagePath) {
        const fullPath = path.join(process.cwd(), "uploads", path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
};

/**
 * Fetch all News
 */
export const getAllNews = async (_req: Request, res: Response) => {
    try {
        const newsItems = await NewsModel.find({}).populate({
            path: 'event',
            select: 'name',
            options: { strictPopulate: false }
        });
        if (!newsItems || newsItems.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No news items found.",
                data: [],
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
        const newsItem = await NewsModel.findById(id).populate({
            path: 'event',
            select: 'name',
            options: { strictPopulate: false }
        });
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
export const createNews = async (req: Request, res: Response) => {
    try {
        // Validate input data
        const validation = createNewsSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: validation.error.flatten().fieldErrors
            });
        }

        const { title, description, link, type, year, event } = validation.data;

        // Handle uploaded image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }
        const image = `/uploads/${req.file.filename}`;

        // Prepare the news item data
        const newsData = {
            title,
            description,
            link,
            type,
            year: year || String(new Date().getFullYear()),
            image,
            event: event || null
        };

        const newNews = await NewsModel.create(newsData);

        res.status(201).json({
            success: true,
            message: "News item created successfully.",
            data: newNews
        });
    } catch (error: any) {
        console.error("Error creating News item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    }
};

/**
 * Update a News item by ID
 */
export const updateNewsById = async (req: Request, res: Response) => {
    try {
        // Validate input data
        const validation = updateNewsSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: validation.error.flatten().fieldErrors
            });
        }

        const { id } = req.params;
        const { title, description, link, type, year, event } = validation.data;

        // Get the existing news item first
        const existingNews = await NewsModel.findById(id);
        if (!existingNews) {
            return res.status(404).json({
                success: false,
                message: `News item with ID ${id} not found.`,
            });
        }

        // Handle image update
        let image = existingNews.image;
        if (req.file) {
            // Delete old image if exists
            if (existingNews.image) {
                deleteImageFile(existingNews.image);
            }
            image = `/uploads/${req.file.filename}`;
        }

        // Prepare update data
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (link !== undefined) updateData.link = link;
        if (type !== undefined) updateData.type = type;
        if (year !== undefined) updateData.year = year;
        if (event !== undefined) updateData.event = event;
        if (image !== existingNews.image) updateData.image = image;

        // If no fields are provided, return error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field must be provided for update.",
            });
        }

        const updatedNews = await NewsModel.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate({
            path: 'event',
            select: 'name',
            options: { strictPopulate: false }
        });

        if (!updatedNews) {
            return res.status(404).json({
                success: false,
                message: `News item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "News item updated successfully.",
            data: updatedNews,
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
        const deletedNews = await NewsModel.findById(id);

        if (!deletedNews) {
            return res.status(404).json({
                success: false,
                message: `News item with ID ${id} not found.`,
            });
        }

        // Delete the associated image file
        if (deletedNews.image) {
            deleteImageFile(deletedNews.image);
        }

        await NewsModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "News item deleted successfully.",
            data: deletedNews,
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