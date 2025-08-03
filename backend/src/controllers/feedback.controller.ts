import { Request, Response } from "express";
import { FeedBackModel } from "../models/feedback.model";
import { feedbackSchema } from "../validations/feedback.validation";

/**
 * Fetch all Feedback items
 */
export const getFeedbackItems = async (_req: Request, res: Response) => {
    try {
        const feedbackItems = await FeedBackModel.find({});
        if (!feedbackItems || feedbackItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No feedback items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback items retrieved successfully.",
            data: feedbackItems,
        });
    } catch (error: any) {
        console.error("Error fetching Feedback items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Feedback items.",
        });
    }
};

/**
 * Get single Feedback item by ID
 */
export const getFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedbackItem = await FeedBackModel.findById(id);

        if (!feedbackItem) {
            return res.status(404).json({
                success: false,
                message: `Feedback item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback item retrieved successfully.",
            data: feedbackItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Feedback item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Feedback item.",
        });
    }
};

/**
 * Create Feedback item
 */
export const createFeedbackItem = async (req: Request, res: Response) => {
    try {
        const feedbackData = feedbackSchema.parse(req.body);
        const { maintitle, item } = feedbackData;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let imagePaths: string[] = [];

        if (files && files['images']) {
            imagePaths = files['images'].map(file => file.path);
        }

        // If images are uploaded, add them to the first comment or create a new comment
        let processedItems = item || [];
        if (imagePaths.length > 0) {
            if (processedItems.length > 0) {
                // Add images to the first comment
                processedItems[0] = {
                    ...processedItems[0],
                    images: [...(processedItems[0].images || []), ...imagePaths]
                };
            } else {
                // Create a new comment with images
                processedItems = [{
                    index: "1",
                    name: "Anonymous",
                    message: "Feedback with images",
                    images: imagePaths
                }];
            }
        }

        const feedbackSection = await FeedBackModel.create({
            maintitle,
            item: processedItems
        });

        res.status(201).json({
            success: true,
            message: "Feedback section item created successfully.",
            data: feedbackSection
        });
    } catch (error: any) {
        console.error("Error creating Feedback item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
};

/**
 * Update a Feedback item by ID
 */
export const updateFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Check if files are present
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        let updateData: any = {};
        
        if (files && files['images'] && files['images'].length > 0) {
            // If files are present, validate with feedbackSchema
            const validatedData = feedbackSchema.parse(req.body);
            const { maintitle, item } = validatedData;
            
            // Get all uploaded image paths
            const newImagePaths = files['images'].map(file => file.path);
            
            // Get the existing feedback item
            const existingFeedback = await FeedBackModel.findById(id);
            if (!existingFeedback) {
                return res.status(404).json({
                    success: false,
                    message: `Feedback item with ID ${id} not found.`,
                });
            }
            
            // Process items with new images
            let processedItems = item || [];
            if (processedItems.length > 0) {
                // Add images to the first comment
                const firstItem = processedItems[0] as any;
                processedItems[0] = {
                    ...firstItem,
                    images: [...(firstItem.images || []), ...newImagePaths]
                };
            } else {
                // Create a new comment with images
                processedItems = [{
                    index: "1",
                    name: "Anonymous",
                    message: "Feedback with images",
                    images: newImagePaths
                }];
            }
            
            updateData = {
                maintitle,
                item: processedItems
            };
        } else {
            // If no files, only validate the fields that are present in req.body
            const { maintitle, item } = req.body;
            
            if (maintitle !== undefined) updateData.maintitle = maintitle;
            if (item !== undefined) updateData.item = item;
            
            // If no fields are provided, return error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update.",
                });
            }
        }
        
        const updatedItem = await FeedBackModel.findByIdAndUpdate(id, updateData, {
            new: true,
            upsert: false,
        });
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `Feedback item with ID ${id} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Feedback item updated successfully.",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error(`Error updating Feedback item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating Feedback item.",
            error: error.message,
        });
    }
};

/**
 * Delete a Feedback item by ID
 */
export const deleteFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await FeedBackModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Feedback item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting Feedback item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Feedback item.",
            error: error.message,
        });
    }
}; 