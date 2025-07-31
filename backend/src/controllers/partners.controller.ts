import { Request, Response } from "express";
import { PartnersModel } from "../models/partners.model";
import { partnersSchema } from "../validations/partners.validation";

/**
 * Fetch all Partners items
 */
export const getPartnersItems = async (_req: Request, res: Response) => {
    try {
        const partnersItems = await PartnersModel.find({});
        if (!partnersItems || partnersItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No partners items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Partners items retrieved successfully.",
            data: partnersItems,
        });
    } catch (error: any) {
        console.error("Error fetching Partners items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Partners items.",
        });
    }
};

/**
 * Get single Partners item by ID
 */
export const getPartnersById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const partnersItem = await PartnersModel.findById(id);

        if (!partnersItem) {
            return res.status(404).json({
                success: false,
                message: `Partners item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Partners item retrieved successfully.",
            data: partnersItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Partners item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Partners item.",
        });
    }
};

/**
 * Create Partners item
 */
export const createPartnersItem = async (req: Request, res: Response) => {
    try {
        const partnersData = partnersSchema.parse(req.body);
        const { maintitle, description } = partnersData;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        let iconPaths: string[] = [];
        let imagePath: string | null = null;

        if (files) {
            if (files['icons']) {
                iconPaths = files['icons'].map(file => file.path);
            }
            if (files['images'] && files['images'].length > 0) {
                imagePath = files['images'][0].path;
            }
        }

        const partnersSection = await PartnersModel.create({
            maintitle,
            description,
            icon: iconPaths,
            images: imagePath
        });

        res.status(201).json({
            success: true,
            message: "Partners section item created successfully.",
            data: partnersSection
        });
    } catch (error: any) {
        console.error("Error creating Partners item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
};

/**
 * Update a Partners item by ID
 */
export const updatePartnersById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Check if files are present
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        
        let updateData: any = {};
        
        if (files) {
            // If files are present, validate with partnersSchema
            const validatedData = partnersSchema.parse(req.body);
            const { maintitle, description } = validatedData;
            
            let newIconPaths: string[] = [];
            let newImagePath: string | null = null;
            
            // Get uploaded icon paths
            if (files['icons']) {
                newIconPaths = files['icons'].map(file => file.path);
            }
            
            // Get uploaded image path
            if (files['images'] && files['images'].length > 0) {
                newImagePath = files['images'][0].path;
            }
            
            // Get the existing partners item
            const existingPartners = await PartnersModel.findById(id);
            if (!existingPartners) {
                return res.status(404).json({
                    success: false,
                    message: `Partners item with ID ${id} not found.`,
                });
            }
            
            // Combine existing icons with new icons
            const existingIcons = existingPartners.icon || [];
            const updatedIcons = [...existingIcons, ...newIconPaths];
            
            updateData = {
                maintitle,
                description,
                icon: updatedIcons,
                images: newImagePath || existingPartners.images
            };
        } else {
            // If no files, only validate the fields that are present in req.body
            const { maintitle, description } = req.body;
            
            if (maintitle !== undefined) updateData.maintitle = maintitle;
            if (description !== undefined) updateData.description = description;
            
            // If no fields are provided, return error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update.",
                });
            }
        }
        
        const updatedItem = await PartnersModel.findByIdAndUpdate(id, updateData, {
            new: true,
            upsert: false,
        });
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `Partners item with ID ${id} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Partners item updated successfully.",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error(`Error updating Partners item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating Partners item.",
            error: error.message,
        });
    }
};

/**
 * Delete a Partners item by ID
 */
export const deletePartnersById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await PartnersModel.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Partners item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Partners item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting Partners item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Partners item.",
            error: error.message,
        });
    }
}; 