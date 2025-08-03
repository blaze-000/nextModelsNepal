import { Request, Response } from "express";

import { CareerModel } from "../models/career.model";
import { careerSchema } from "../validations/career.validation";

/**
 * Fetch all Career items
 */
export const getCareerItems = async (_req: Request, res: Response) => {
    try {
        const careerItems = await CareerModel.find({});
        if (!careerItems || careerItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No career items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Career items retrieved successfully.",
            data: careerItems,
        });
    } catch (error: any) {
        console.error("Error fetching Career items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Career items.",
        });
    }
};

/**
 * Get single Career item by ID
 */
export const getCareerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const careerItem = await CareerModel.findById(id);

        if (!careerItem) {
            return res.status(404).json({
                success: false,
                message: `Career item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Career item retrieved successfully.",
            data: careerItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Career item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Career item.",
        });
    }
};

/**
 * Create Career item
 */
export const createCareerItem = async (req: Request, res: Response) => {
    try {
        const careerData = careerSchema.parse(req.body);
        const { maintitle, subtitle, description, link } = careerData;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let imagePaths: string[] = [];

        if (files && files['images']) {
            imagePaths = files['images'].map(file => file.path);
        }

        const careerSection = await CareerModel.create({
            maintitle,
            subtitle,
            description,
            link,
            images: imagePaths
        });

        res.status(201).json({
            success: true,
            message: "Career section item created successfully.",
            data: careerSection
        });
    } catch (error: any) {
        console.error("Error creating Career item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
};

/**
 * Update a Career item by ID
 */
export const updateCareerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Check if files are present
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        let updateData: any = {};
        
        if (files && files['images'] && files['images'].length > 0) {
            // If files are present, validate with careerSchema
            const validatedData = careerSchema.parse(req.body);
            const { maintitle, subtitle, description, link } = validatedData;
            
            // Get all uploaded image paths
            const newImagePaths = files['images'].map(file => file.path);
            
            // Get the existing career item to add to its images array
            const existingCareer = await CareerModel.findById(id);
            if (!existingCareer) {
                return res.status(404).json({
                    success: false,
                    message: `Career item with ID ${id} not found.`,
                });
            }
            
            // Combine existing images with new images
            const existingImages = existingCareer.images || [];
            const updatedImages = [...existingImages, ...newImagePaths];
            
            updateData = {
                maintitle,
                subtitle,
                description,
                link,
                images: updatedImages
            };
        } else {
            // If no files, only validate the fields that are present in req.body
            const { maintitle, subtitle, description, link } = req.body;
            
            if (maintitle !== undefined) updateData.maintitle = maintitle;
            if (subtitle !== undefined) updateData.subtitle = subtitle;
            if (description !== undefined) updateData.description = description;
            if (link !== undefined) updateData.link = link;
            
            // If no fields are provided, return error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update.",
                });
            }
        }
        
        const updatedItem = await CareerModel.findByIdAndUpdate(id, updateData, {
            new: true,
            upsert: false,
        });
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `Career item with ID ${id} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Career item updated successfully.",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error(`Error updating Career item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating Career item.",
            error: error.message,
        });
    }
};

/**
 * Delete a Career item by ID
 */
export const deleteCareerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await CareerModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Career item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Career item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting Career item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Career item.",
            error: error.message,
        });
    }
}; 