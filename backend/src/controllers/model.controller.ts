import { Request, Response } from "express";
import { Model } from "../models/model.model";
import fs from "fs";
import path from "path";
import { createModelSchema } from "../validations/model.validation";

// Helper function to delete image files
const deleteImageFiles = (imagePaths: string[]) => {
  imagePaths.forEach((imagePath) => {
    if (imagePath) {
      const fullPath = path.join(
        process.cwd(),
        "uploads",
        path.basename(imagePath)
      );
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  });
};

// Create a new company
export const createModel = async (req: Request, res: Response) => {
  const session = await Model.startSession();
  session.startTransaction();

  try {
    const { index, name, intro, address, gender, slug } =
      createModelSchema.parse(req.body);
    const newIndex = parseInt(index);

    // Shift existing documents with index >= newIndex
    await Model.updateMany(
      { index: { $gte: newIndex } },
      { $inc: { index: 1 } },
      { session }
    );

    // Process uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImage = files.coverImage
      ? `/uploads/${files.coverImage[0].filename}`
      : "";
    const images = files.images
      ? files.images.map((file) => `/uploads/${file.filename}`)
      : [];

    // Create new company
    const newCompany = new Model({
      index: newIndex,
      name,
      intro,
      address,
      gender,
      slug,
      coverImage,
      images,
    });

    await newCompany.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, data: newCompany });
  } catch (error: any) {
    await session.abortTransaction();

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];

      let message = "Duplicate entry found";
      if (field === "slug") {
        message = `A model with the slug "${value}" already exists. Please use a different name or modify the slug.`;
      } else if (field === "name") {
        message = `A model with the name "${value}" already exists. Please use a different name.`;
      } else {
        message = `A model with this ${field} already exists. Please use a different value.`;
      }

      return res.status(409).json({ success: false, message, error });
    }

    res
      .status(500)
      .json({ success: false, message: "Error creating company", error });
  } finally {
    session.endSession();
  }
};

// Get all companies
export const getAllModels = async (_req: Request, res: Response) => {
  try {
    const companies = await Model.find().sort({ index: 1 });
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching companies", error });
  }
};

// Get company by ID
export const getModelById = async (req: Request, res: Response) => {
  try {
    const company = await Model.findById(req.params.id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching company", error });
  }
};

// Update company by ID
export const updateModelById = async (req: Request, res: Response) => {
  const session = await Model.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { index, name, intro, address, gender, slug } = req.body;
    const existingCompany = await Model.findById(id).session(session);

    if (!existingCompany) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Process uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let coverImage = existingCompany.coverImage;
    let images = [...existingCompany.images];

    // Handle cover image update
    if (files.coverImage && files.coverImage.length > 0) {
      if (existingCompany.coverImage) {
        deleteImageFiles([existingCompany.coverImage]);
      }
      coverImage = `/uploads/${files.coverImage[0].filename}`;
    }

    // Handle images update
    if (files.images && files.images.length > 0) {
      // Delete old images
      if (existingCompany.images.length > 0) {
        deleteImageFiles(existingCompany.images);
      }
      // Set new images
      images = files.images.map((file) => `/uploads/${file.filename}`);
    }

    // Handle index update
    if (index !== undefined && index !== existingCompany.index) {
      const newIndex = parseInt(index);
      const oldIndex = existingCompany.index;

      if (newIndex < oldIndex) {
        // Increment index by 1 for documents where index >= newIndex && index < oldIndex
        await Model.updateMany(
          { index: { $gte: newIndex, $lt: oldIndex } },
          { $inc: { index: 1 } },
          { session }
        );
      } else if (newIndex > oldIndex) {
        // Decrement index by 1 for documents where index <= newIndex && index > oldIndex
        await Model.updateMany(
          { index: { $lte: newIndex, $gt: oldIndex } },
          { $inc: { index: -1 } },
          { session }
        );
      }

      existingCompany.index = newIndex;
    }

    // Update other fields
    if (name) existingCompany.name = name;
    if (intro) existingCompany.intro = intro;
    if (address) existingCompany.address = address;
    if (gender) existingCompany.gender = gender;
    if (slug) existingCompany.slug = slug;
    if (coverImage !== existingCompany.coverImage)
      existingCompany.coverImage = coverImage;
    if (images !== existingCompany.images) existingCompany.images = images;

    await existingCompany.save({ session });
    await session.commitTransaction();

    res.status(200).json({ success: true, data: existingCompany });
  } catch (error: any) {
    await session.abortTransaction();

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];

      let message = "Duplicate entry found";
      if (field === "slug") {
        message = `A model with the slug "${value}" already exists. Please use a different name or modify the slug.`;
      } else if (field === "name") {
        message = `A model with the name "${value}" already exists. Please use a different name.`;
      } else {
        message = `A model with this ${field} already exists. Please use a different value.`;
      }

      return res.status(409).json({ success: false, message, error });
    }

    res
      .status(500)
      .json({ success: false, message: "Error updating company", error });
  } finally {
    session.endSession();
  }
};

// Delete company by ID
export const deleteModelById = async (req: Request, res: Response) => {
  const session = await Model.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const company = await Model.findById(id).session(session);

    if (!company) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Delete all image files
    const imagesToDelete = [company.coverImage, ...company.images];
    deleteImageFiles(imagesToDelete);

    // Get the index of the company to be deleted
    const deletedIndex = company.index;

    // Delete the company
    await Model.findByIdAndDelete(id, { session });

    // Decrement index for all companies with index > deletedIndex
    await Model.updateMany(
      { index: { $gt: deletedIndex } },
      { $inc: { index: -1 } },
      { session }
    );

    await session.commitTransaction();
    res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ success: false, message: "Error deleting company", error });
  } finally {
    session.endSession();
  }
};
