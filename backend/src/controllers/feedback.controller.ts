import { Request, Response } from "express";
import { FeedBackModel } from "../models/feedback.model";
import { feedbackSchema } from "../validations/feedback.validation";

/**
 * Fetch all Feedback items
 */
export const getFeedbackItems = async (_req: Request, res: Response) => {
    try {
const feedbackItems = await FeedBackModel.findOne();
if (!feedbackItems || feedbackItems.item.length === 0) {
    return res.status(404).json({
        success: false,
        message: "No feedback items found.",
    });
}


        // Map to include single image field for convenience
        const normalized = {
            ...feedbackItems.toObject(),
            item: feedbackItems.item.map((it: any) => ({
                ...it.toObject?.() || it,
                image: (it.images && it.images.length > 0) ? it.images[0] : undefined,
            }))
        };

        return res.status(200).json({
            success: true,
            message: "Feedback items retrieved successfully.",
            data: normalized,
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
    const { ...rest } = req.body;

    const norm = (p?: string) => (p ? p.replace(/\\/g, "/") : p);

    let processedItems: Array<{ index?: string; name?: string; message?: string; images?: string[]; image?: string }> = [];

    // ---- parse request exactly like before ----
    const itemKeys = Object.keys(rest).filter((key) => key.startsWith("item["));
    if (itemKeys.length > 0) {
      const itemGroups: Record<string, any> = {};
      itemKeys.forEach((key) => {
        const match = key.match(/item\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [, idx, field] = match;
          if (!itemGroups[idx]) itemGroups[idx] = {};
          itemGroups[idx][field] = (rest as any)[key];
        }
      });
      processedItems = Object.values(itemGroups).sort((a: any, b: any) => 0); // keep incoming order
    } else {
      const itemField = (rest as any).item;
      if (itemField) {
        try {
          if (typeof itemField === "string") processedItems = JSON.parse(itemField);
          else if (Array.isArray(itemField)) processedItems = itemField;
        } catch (e) {
          console.log("Failed to parse item field as JSON:", e);
        }
      }
      const individualItemKeys = Object.keys(rest).filter((k) => k.startsWith("name") || k.startsWith("message"));
      if (individualItemKeys.length > 0 && processedItems.length === 0) {
        processedItems = [{ name: (rest as any).name || "Anonymous", message: (rest as any).message || "", images: [] }];
      }
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.fieldname.startsWith("item[") && file.fieldname.endsWith("[image]")) {
          const match = file.fieldname.match(/item\[(\d+)\]\[image\]/);
          if (match) {
            const itemIndex = parseInt(match[1]);
            if (processedItems[itemIndex]) {
              const p = norm(file.path)!;
              processedItems[itemIndex].images = [p];
              processedItems[itemIndex].image = p; // legacy
            }
          }
        }
      });
    }

    // ---- fetch existing to compute next index ----
    const existing = await FeedBackModel.findOne().lean();
    const currentMaxIndex =
      existing?.item?.reduce((max: number, it: any) => {
        const n = parseInt(it?.index ?? "0", 10);
        return Number.isFinite(n) ? Math.max(max, n) : max;
      }, 0) ?? 0;

    // ---- normalize & assign CONTIGUOUS new indices (5,6,...) ----
    const normalized = processedItems.map((item, i) => ({
      index: String(currentMaxIndex + i + 1),
      name: item.name || "Anonymous",
      message: item.message || "",
      images: item.image ? [norm(item.image)!] : (item.images || []).map(norm).filter(Boolean) as string[],
    }));

    if (normalized.length === 0) {
      return res.status(400).json({ success: false, message: "No feedback items found in request." });
    }

    let feedbackSection;
    if (existing) {
      feedbackSection = await FeedBackModel.findByIdAndUpdate(
        existing._id,
        { $push: { item: { $each: normalized } } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Feedback items appended successfully.",
        data: feedbackSection,
      });
    } else {
      feedbackSection = await FeedBackModel.create({ item: normalized });
      return res.status(201).json({
        success: true,
        message: "Feedback section created successfully.",
        data: feedbackSection,
      });
    }
  } catch (error: any) {
    console.error("Error creating/appending Feedback item:", error.message);
    return res.status(400).json({
      success: false,
      message: "Invalid input data.",
      error: error.message,
    });
  }
};



/**
 * Update a Feedback item by ID
 */
export const updateFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Get the existing feedback item first
        const existingFeedback = await FeedBackModel.findById(id);
        if (!existingFeedback) {
            return res.status(404).json({
                success: false,
                message: `Feedback item with ID ${id} not found.`,
            });
        }
        
        // Check if files are present
        const files = req.files as Express.Multer.File[] | undefined;
        
        let updateData: any = {};
        
        // Parse formdata for partial updates
        const { ...rest } = req.body;
        
        // Handle item updates - Express parses nested formdata into objects
        if (rest.item && Array.isArray(rest.item)) {
            
            // Get existing items as plain objects
            let updatedItems = existingFeedback.item.map(item => ({
                index: item.index,
                name: item.name,
                message: item.message,
                images: item.images
            }));
            
            // Apply updates from the item array
            rest.item.forEach((itemUpdate: any, index: number) => {
                if (updatedItems[index]) {
                    // Update existing item with provided fields
                    updatedItems[index] = {
                        ...updatedItems[index],
                        ...itemUpdate
                    };
                } else {
                    // Create new item if it doesn't exist
                    updatedItems[index] = {
                        index: (index + 1).toString(),
                        name: itemUpdate.name || "Anonymous",
                        message: itemUpdate.message || "",
                        images: itemUpdate.images || []
                    };
                }
            });
            
            updateData.item = updatedItems;
        }
        
        // Also check for flat key structure as fallback
        const itemKeys = Object.keys(rest).filter(key => key.startsWith('item['));
        
        if (itemKeys.length > 0) {
            // Get existing items as plain objects (if not already set)
            let updatedItems = updateData.item || existingFeedback.item.map(item => ({
                index: item.index,
                name: item.name,
                message: item.message,
                images: item.images
            }));
            
            // Group updates by item index
            const itemUpdates: { [key: string]: any } = {};
            itemKeys.forEach(key => {
                const match = key.match(/item\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const [, index, field] = match;
                    if (!itemUpdates[index]) {
                        itemUpdates[index] = {};
                    }
                    itemUpdates[index][field] = rest[key];
                }
            });
            
            // Apply updates to existing items
            Object.keys(itemUpdates).forEach(indexStr => {
                const index = parseInt(indexStr);
                const updates = itemUpdates[index];
                
                if (updatedItems[index]) {
                    // Update existing item
                    updatedItems[index] = {
                        ...updatedItems[index],
                        ...updates
                    };
                } else {
                    // Create new item if it doesn't exist
                    updatedItems[index] = {
                        index: (index + 1).toString(),
                        name: updates.name || "Anonymous",
                        message: updates.message || "",
                        images: updates.images || []
                    };
                }
            });
            
            updateData.item = updatedItems;
        }
        
        // Handle file updates
        if (files && files.length > 0) {
            // Get current items (either from updateData or existing)
            let currentItems = updateData.item || existingFeedback.item;
            
            files.forEach(file => {
                // Check if this is an item image field
                if (file.fieldname.startsWith('item[') && file.fieldname.endsWith('[image]')) {
                    const match = file.fieldname.match(/item\[(\d+)\]\[image\]/);
                    if (match) {
                        const itemIndex = parseInt(match[1]);
                        
                        // Update image for the corresponding item
                        if (currentItems[itemIndex]) {
                            currentItems[itemIndex].images = [file.path];
                            (currentItems as any)[itemIndex].image = file.path;
                        }
                    }
                }
            });
            
            updateData.item = currentItems;
        }
        
        // If no fields are provided, return error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field must be provided for update.",
            });
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