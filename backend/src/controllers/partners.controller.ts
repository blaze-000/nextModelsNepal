import { Request, Response } from "express";
import { PartnersModel } from "../models/partners.model";
import {
  createPartnersSchema,
  updatePartnersSchema,
} from "../validations/partners.validation";
import fs from "fs";
import path from "path";

// Helper function to delete image files
const deleteImageFile = (imagePath: string) => {
  try {
    if (imagePath && imagePath.trim() !== "") {
      const fullPath = path.resolve(imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting file ${imagePath}:`, error);
  }
};

/**
 * Fetch all Partners
 */
export const getPartners = async (_req: Request, res: Response) => {
  try {
    const partners = await PartnersModel.find({});
    return res.status(200).json({
      success: true,
      message:
        partners.length > 0
          ? "Partners retrieved successfully."
          : "No partners found.",
      data: partners,
    });
  } catch (error: any) {
    console.error("Error fetching Partners:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving Partners.",
    });
  }
};

/**
 * Get single Partner by ID
 */
export const getPartnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const partner = await PartnersModel.findById(id);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: `Partner with ID ${id} not found.`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Partner retrieved successfully.",
      data: partner,
    });
  } catch (error: any) {
    console.error(
      `Error fetching Partner with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving Partner.",
    });
  }
};

/**
 * Create Partner
 */
export const createPartner = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validation = createPartnersSchema.safeParse(req.body);
    if (!validation.success) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { sponserName } = validation.data;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Sponsor image is required",
      });
    }

    // Set image path with normalized slashes
    const sponserImage = req.file.path.replace(/\\/g, "/");

    // Create the partner
    const newPartner = await PartnersModel.create({
      sponserName,
      sponserImage,
    });

    res.status(201).json({
      success: true,
      message: "Partner created successfully.",
      data: newPartner,
    });
  } catch (error: any) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      deleteImageFile(req.file.path);
    }
    console.error("Error creating Partner:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating Partner.",
      error: error.message,
    });
  }
};

/**
 * Update a Partner by ID
 */
export const updatePartnerById = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const validation = updatePartnersSchema.safeParse(req.body);
    if (!validation.success) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        deleteImageFile(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id } = req.params;
    const { sponserName } = validation.data;

    // Get the existing partner first
    const existingPartner = await PartnersModel.findById(id);
    if (!existingPartner) {
      // Clean up uploaded file if partner not found
      if (req.file) {
        deleteImageFile(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: `Partner with ID ${id} not found.`,
      });
    }

    // Handle image update
    let sponserImage = existingPartner.sponserImage;
    if (req.file) {
      // Delete old image if exists
      if (
        existingPartner.sponserImage &&
        existingPartner.sponserImage.trim() !== ""
      ) {
        deleteImageFile(existingPartner.sponserImage);
      }
      sponserImage = req.file.path.replace(/\\/g, "/");
    }

    // Prepare update data
    const updateData: any = {};
    if (sponserName !== undefined) updateData.sponserName = sponserName;
    if (req.file) updateData.sponserImage = sponserImage;

    // If no fields are provided, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update.",
      });
    }

    const updatedPartner = await PartnersModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedPartner) {
      return res.status(404).json({
        success: false,
        message: `Partner with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Partner updated successfully.",
      data: updatedPartner,
    });
  } catch (error: any) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      deleteImageFile(req.file.path);
    }
    console.error(
      `Error updating Partner with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating Partner.",
      error: error.message,
    });
  }
};

/**
 * Delete a Partner by ID
 */
export const deletePartnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPartner = await PartnersModel.findById(id);

    if (!deletedPartner) {
      return res.status(404).json({
        success: false,
        message: `Partner with ID ${id} not found.`,
      });
    }

    // Delete the associated image file
    if (
      deletedPartner.sponserImage &&
      deletedPartner.sponserImage.trim() !== ""
    ) {
      deleteImageFile(deletedPartner.sponserImage);
    }

    await PartnersModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Partner deleted successfully.",
      data: deletedPartner,
    });
  } catch (error: any) {
    console.error(
      `Error deleting Partner with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting Partner.",
      error: error.message,
    });
  }
};
