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
        const { ...rest } = req.body;
        let processedPartners: any[] = [];

        // Parse nested formdata structure (partners[0][sponserName], partners[0][sponserImage], etc.)
        const partnerKeys = Object.keys(rest).filter(key => key.startsWith('partners['));
        
        if (partnerKeys.length > 0) {
            // Group by partner index
            const partnerGroups: { [key: string]: any } = {};
            partnerKeys.forEach(key => {
                const match = key.match(/partners\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const [, index, field] = match;
                    if (!partnerGroups[index]) {
                        partnerGroups[index] = {};
                    }
                    partnerGroups[index][field] = rest[key];
                }
            });
            
            // Convert to array and sort by index
            processedPartners = Object.values(partnerGroups).sort((a, b) => 
                parseInt(Object.keys(partnerGroups).find(k => partnerGroups[k] === a) || '0') - 
                parseInt(Object.keys(partnerGroups).find(k => partnerGroups[k] === b) || '0')
            );
        } else {
            // Try to parse as JSON string if it's a single field
            const partnerField = rest.partners;
            if (partnerField) {
                try {
                    if (typeof partnerField === 'string') {
                        processedPartners = JSON.parse(partnerField);
                    } else if (Array.isArray(partnerField)) {
                        processedPartners = partnerField;
                    }
                } catch (e) {
                    console.log("Failed to parse partners field as JSON:", e);
                }
            }
        }

        const files = req.files as Express.Multer.File[] | undefined;

        // Handle individual partner images (partners[0][sponserImage], partners[1][sponserImage], etc.)
        if (files && files.length > 0) {
            files.forEach(file => {
                if (file.fieldname.startsWith('partners[') && file.fieldname.endsWith('[sponserImage]')) {
                    const match = file.fieldname.match(/partners\[(\d+)\]\[sponserImage\]/);
                    if (match) {
                        const partnerIndex = parseInt(match[1]);
                        
                        if (processedPartners[partnerIndex]) {
                            processedPartners[partnerIndex].sponserImage = file.path;
                        }
                    }
                }
            });
        }

        // Ensure all partners have proper structure
        processedPartners = processedPartners.map((partner, index) => ({
            index: index + 1, // Auto-increment starting from 1
            sponserName: partner.sponserName || "Anonymous Partner",
            sponserImage: partner.sponserImage || ""
        }));

        // Validate the processed data
        const validatedData = partnersSchema.parse({ partners: processedPartners });

        const partnersSection = await PartnersModel.create(validatedData);

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
        
        // Get the existing partners item first
        const existingPartners = await PartnersModel.findById(id);
        if (!existingPartners) {
            return res.status(404).json({
                success: false,
                message: `Partners item with ID ${id} not found.`,
            });
        }
        
        // Check if files are present
        const files = req.files as Express.Multer.File[] | undefined;
        
        let updateData: any = {};
        
        // Parse formdata for partial updates
        const { ...rest } = req.body;
        
        // Handle partners updates - Express parses nested formdata into objects
        if (rest.partners && Array.isArray(rest.partners)) {
            // Get existing partners as plain objects
            let updatedPartners = existingPartners.partners.map(partner => ({
                index: partner.index,
                sponserName: partner.sponserName,
                sponserImage: partner.sponserImage
            }));
            
            // Apply updates from the partners array
            rest.partners.forEach((partnerUpdate: any, index: number) => {
                if (updatedPartners[index]) {
                    // Update existing partner with provided fields
                    updatedPartners[index] = {
                        ...updatedPartners[index],
                        ...partnerUpdate
                    };
                } else {
                    // Create new partner if it doesn't exist
                    updatedPartners[index] = {
                        index: index + 1, // Auto-increment starting from 1
                        sponserName: partnerUpdate.sponserName || "Anonymous Partner",
                        sponserImage: partnerUpdate.sponserImage || ""
                    };
                }
            });
            
            updateData.partners = updatedPartners;
        }
        
        // Also check for flat key structure as fallback
        const partnerKeys = Object.keys(rest).filter(key => key.startsWith('partners['));
        
        if (partnerKeys.length > 0) {
            // Get existing partners as plain objects (if not already set)
            let updatedPartners = updateData.partners || existingPartners.partners.map(partner => ({
                index: partner.index,
                sponserName: partner.sponserName,
                sponserImage: partner.sponserImage
            }));
            
            // Group updates by partner index
            const partnerUpdates: { [key: string]: any } = {};
            partnerKeys.forEach(key => {
                const match = key.match(/partners\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const [, index, field] = match;
                    if (!partnerUpdates[index]) {
                        partnerUpdates[index] = {};
                    }
                    partnerUpdates[index][field] = rest[key];
                }
            });
            
            // Apply updates to existing partners
            Object.keys(partnerUpdates).forEach(indexStr => {
                const index = parseInt(indexStr);
                const updates = partnerUpdates[index];
                
                if (updatedPartners[index]) {
                    // Update existing partner
                    updatedPartners[index] = {
                        ...updatedPartners[index],
                        ...updates
                    };
                } else {
                    // Create new partner if it doesn't exist
                    updatedPartners[index] = {
                        index: index + 1, // Auto-increment starting from 1
                        sponserName: updates.sponserName || "Anonymous Partner",
                        sponserImage: updates.sponserImage || ""
                    };
                }
            });
            
            updateData.partners = updatedPartners;
        }
        
        // Handle file updates
        if (files && files.length > 0) {
            // Get current partners (either from updateData or existing)
            let currentPartners = updateData.partners || existingPartners.partners;
            
            files.forEach(file => {
                if (file.fieldname.startsWith('partners[') && file.fieldname.endsWith('[sponserImage]')) {
                    const match = file.fieldname.match(/partners\[(\d+)\]\[sponserImage\]/);
                    if (match) {
                        const partnerIndex = parseInt(match[1]);
                        
                        if (currentPartners[partnerIndex]) {
                            currentPartners[partnerIndex].sponserImage = file.path;
                        }
                    }
                }
            });
            
            updateData.partners = currentPartners;
        }
        
        // If no fields are provided, return error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field must be provided for update.",
            });
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