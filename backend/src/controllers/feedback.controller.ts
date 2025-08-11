import { Request, Response } from "express";
import { FeedBackModel } from "../models/feedback.model";
import { feedbackSchema } from "../validations/feedback.validation";

/**
 * Fetch all Feedback items
 */
export const getFeedbackItems = async (_req: Request, res: Response) => {
  try {
    const feedbackItems = await FeedBackModel.find();
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
    console.error(
      `Error fetching Feedback item with ID ${req.params.id}:`,
      error.message
    );
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

    let processedItems: any[] = [];

    // Method 1: Try to parse nested formdata structure (item[0][name], item[0][message], etc.)
    const itemKeys = Object.keys(rest).filter((key) => key.startsWith("item["));

    if (itemKeys.length > 0) {
      // Group by item index
      const itemGroups: { [key: string]: any } = {};
      itemKeys.forEach((key) => {
        const match = key.match(/item\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [, index, field] = match;
          if (!itemGroups[index]) {
            itemGroups[index] = { index: (parseInt(index) + 1).toString() };
          }
          itemGroups[index][field] = rest[key];
        }
      });

      // Convert to array and sort by index
      processedItems = Object.values(itemGroups).sort(
        (a, b) => parseInt(a.index) - parseInt(b.index)
      );
    } else {
      // Method 2: Try to parse as JSON string if it's a single field
      const itemField = rest.item;
      if (itemField) {
        try {
          if (typeof itemField === "string") {
            processedItems = JSON.parse(itemField);
          } else if (Array.isArray(itemField)) {
            processedItems = itemField;
          }
        } catch (e) {
          console.log("Failed to parse item field as JSON:", e);
        }
      }

      // Method 3: Try to find individual item fields
      const individualItemKeys = Object.keys(rest).filter(
        (key) => key.startsWith("name") || key.startsWith("message")
      );

      if (individualItemKeys.length > 0 && processedItems.length === 0) {
        // Create a single item from individual fields
        processedItems = [
          {
            index: "1",
            name: rest.name || "Anonymous",
            message: rest.message || "",
            images: "",
          },
        ];
      }
    }

    const files = req.files as Express.Multer.File[] | undefined;

    // Handle individual item images (item[0][image], item[1][image], etc.)
    if (files && files.length > 0) {
      files.forEach((file) => {
        // Check if this is an item image field
        if (
          file.fieldname.startsWith("item[") &&
          file.fieldname.endsWith("[image]")
        ) {
          const match = file.fieldname.match(/item\[(\d+)\]\[image\]/);
          if (match) {
            const itemIndex = parseInt(match[1]);

            // Add image to the corresponding item (as string, not array)
            if (processedItems[itemIndex]) {
              processedItems[itemIndex].images = file.path;
            }
          }
        }
      });
    }

    // Ensure all items have proper structure with images as string
    processedItems = processedItems.map((item, index) => ({
      index: (index + 1).toString(),
      name: item.name || "Anonymous",
      message: item.message || "",
      images: typeof item.images === "string" ? item.images : "",
    }));

    const feedbackSection = await FeedBackModel.create({
      item: processedItems,
    });

    res.status(201).json({
      success: true,
      message: "Feedback section item created successfully.",
      data: feedbackSection,
    });
  } catch (error: any) {
    console.error("Error creating Feedback item:", error.message);
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
      let updatedItems = existingFeedback.item.map((item) => ({
        index: item.index,
        name: item.name,
        message: item.message,
        images: item.images,
      }));

      // Apply updates from the item array
      rest.item.forEach((itemUpdate: any, index: number) => {
        if (updatedItems[index]) {
          // Update existing item with provided fields
          updatedItems[index] = {
            ...updatedItems[index],
            ...itemUpdate,
          };
        } else {
          // Create new item if it doesn't exist
          updatedItems[index] = {
            index: (index + 1).toString(),
            name: itemUpdate.name || "Anonymous",
            message: itemUpdate.message || "",
            images: itemUpdate.images || "",
          };
        }
      });

      updateData.item = updatedItems;
    }

    // Also check for flat key structure as fallback
    const itemKeys = Object.keys(rest).filter((key) => key.startsWith("item["));

    if (itemKeys.length > 0) {
      // Get existing items as plain objects (if not already set)
      let updatedItems =
        updateData.item ||
        existingFeedback.item.map((item) => ({
          index: item.index,
          name: item.name,
          message: item.message,
          images: item.images,
        }));

      // Group updates by item index
      const itemUpdates: { [key: string]: any } = {};
      itemKeys.forEach((key) => {
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
      Object.keys(itemUpdates).forEach((indexStr) => {
        const index = parseInt(indexStr);
        const updates = itemUpdates[index];

        if (updatedItems[index]) {
          // Update existing item
          updatedItems[index] = {
            ...updatedItems[index],
            ...updates,
          };
        } else {
          // Create new item if it doesn't exist
          updatedItems[index] = {
            index: (index + 1).toString(),
            name: updates.name || "Anonymous",
            message: updates.message || "",
            images: updates.images || "",
          };
        }
      });

      updateData.item = updatedItems;
    }

    // Handle file updates
    if (files && files.length > 0) {
      // Get current items (either from updateData or existing)
      let currentItems = updateData.item || existingFeedback.item;

      files.forEach((file) => {
        // Check if this is an item image field
        if (
          file.fieldname.startsWith("item[") &&
          file.fieldname.endsWith("[image]")
        ) {
          const match = file.fieldname.match(/item\[(\d+)\]\[image\]/);
          if (match) {
            const itemIndex = parseInt(match[1]);

            // Update image for the corresponding item (as string, not array)
            if (currentItems[itemIndex]) {
              currentItems[itemIndex].images = file.path;
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
    console.error(
      `Error updating Feedback item with ID ${req.params.id}:`,
      error.message
    );
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
    console.error(
      `Error deleting Feedback item with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting Feedback item.",
      error: error.message,
    });
  }
};
