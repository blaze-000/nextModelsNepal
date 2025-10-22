import { Request, Response } from "express";
import { Model } from '../models/model.model.js';
import fs from "fs";
import path from "path";
import { createModelSchema } from '../validations/model.validation.js';

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

// Create a new model
export const createModel = async (req: Request, res: Response) => {
  const session = await Model.startSession();
  session.startTransaction();

  try {
    const { order, name, intro, address, gender, slug } =
      createModelSchema.parse(req.body);

    // Determine max order
    const maxOrderDoc = await Model.findOne()
      .sort({ order: -1 })
      .session(session);
    const maxOrder = maxOrderDoc ? maxOrderDoc.order : 0;

    let newOrder;
    const parsedOrder =
      order !== undefined && order !== null && order !== ""
        ? parseInt(order)
        : undefined;

    if (parsedOrder === undefined || parsedOrder > maxOrder) {
      // If order is undefined, null, empty string, or greater than max existing order → assign maxOrder + 1
      newOrder = maxOrder + 1;
    } else {
      // If order <= maxOrder → increment order of all models where order >= newOrder
      newOrder = parsedOrder;

      // Get all models that need to be shifted, sorted by order descending to avoid conflicts
      const modelsToShift = await Model.find({ order: { $gte: newOrder } })
        .sort({ order: -1 })
        .session(session);

      // Update each model's order one by one, starting from the highest order
      for (const model of modelsToShift) {
        await Model.updateOne(
          { _id: model._id },
          { order: model.order + 1 },
          { session }
        );
      }
    }

    // Process uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImage = files.coverImage
      ? `/uploads/${files.coverImage[0].filename}`
      : "";
    const images = files.images
      ? files.images.map((file) => `/uploads/${file.filename}`)
      : [];

    // Create new model
    const newModel = new Model({
      order: newOrder,
      name,
      intro,
      address,
      gender,
      slug,
      coverImage,
      images,
    });

    await newModel.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, data: newModel });
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
      .json({ success: false, message: "Error creating model", error });
  } finally {
    session.endSession();
  }
};

// Get all models
export const getAllModels = async (_req: Request, res: Response) => {
  try {
    const models = await Model.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: models });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching models", error });
  }
};

// Get model by slug
export const getModelBySlug = async (req: Request, res: Response) => {
  try {
    const model = await Model.findOne({ slug: req.params.slug });
    if (!model) {
      return res
        .status(404)
        .json({ success: false, message: "Model not found" });
    }
    res.status(200).json({ success: true, data: model });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching model", error });
  }
};

// Update model by ID
export const updateModelById = async (req: Request, res: Response) => {
  const session = await Model.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { order, name, intro, address, gender, slug } = req.body;
    const existingModel = await Model.findById(id).session(session);

    if (!existingModel) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Model not found" });
    }

    // Process uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let coverImage = existingModel.coverImage;
    let images = [...existingModel.images];

    // Handle cover image update
    if (files.coverImage && files.coverImage.length > 0) {
      if (existingModel.coverImage) {
        deleteImageFiles([existingModel.coverImage]);
      }
      coverImage = `/uploads/${files.coverImage[0].filename}`;
    }

    // Handle gallery images update
    // Frontend can send a JSON array `retainImages` of existing image paths to keep
    // We'll delete any existing images not present in retainImages
    let retainImages: string[] | undefined;
    try {
      if (typeof req.body.retainImages === "string") {
        retainImages = JSON.parse(req.body.retainImages);
      } else if (Array.isArray(req.body.retainImages)) {
        retainImages = req.body.retainImages as string[];
      }
    } catch (_) {
      retainImages = undefined;
    }

    if (retainImages) {
      const toDelete = images.filter((img) => !retainImages!.includes(img));
      if (toDelete.length) deleteImageFiles(toDelete);
      images = retainImages;
    }

    // Append any newly uploaded files
    if (files.images && files.images.length > 0) {
      const newImages = files.images.map((file) => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    // Handle order update
    if (order !== undefined) {
      const parsedOrder =
        order !== undefined && order !== null && order !== ""
          ? parseInt(order)
          : undefined;
      const currentOrder = existingModel.order;
      const maxOrderDoc = await Model.findOne()
        .sort({ order: -1 })
        .session(session);
      const maxOrder = maxOrderDoc ? maxOrderDoc.order : 0;

      let finalOrder;
      if (parsedOrder === undefined || parsedOrder > maxOrder) {
        // If order is undefined, null, empty string, or greater than maxOrder → assign maxOrder + 1
        finalOrder = maxOrder + 1;
      } else {
        // If order <= maxOrder → increment order of all models where order >= newOrder
        finalOrder = parsedOrder;

        // Only shift if the order is actually changing and it's a valid order
        if (parsedOrder !== currentOrder && parsedOrder >= 1) {
          // Determine the range of models that need to be shifted
          let startOrder, endOrder;

          if (parsedOrder < currentOrder) {
            // Moving up: shift models from parsedOrder to currentOrder-1
            startOrder = parsedOrder;
            endOrder = currentOrder - 1;
          } else {
            // Moving down: shift models from currentOrder+1 to parsedOrder
            startOrder = currentOrder + 1;
            endOrder = parsedOrder;
          }

          // First, temporarily move the current model to a safe position
          const tempOrder = maxOrder + 2;
          await Model.updateOne({ _id: id }, { order: tempOrder }, { session });

          // Get models in the range that need to be shifted
          const modelsToShift = await Model.find({
            order: { $gte: startOrder, $lte: endOrder },
            _id: { $ne: id },
          })
            .sort({ order: -1 })
            .session(session);

          // Update each model's order one by one, starting from the highest order
          for (const modelToShift of modelsToShift) {
            const newOrder =
              parsedOrder < currentOrder
                ? modelToShift.order + 1
                : modelToShift.order - 1;
            await Model.updateOne(
              { _id: modelToShift._id },
              { order: newOrder },
              { session }
            );
          }

          // Now move the current model to its final position
          await Model.updateOne(
            { _id: id },
            { order: parsedOrder },
            { session }
          );
        }
      }

      existingModel.order = finalOrder;
    }

    // Update other fields
    if (name) existingModel.name = name;
    if (intro) existingModel.intro = intro;
    if (address) existingModel.address = address;
    if (gender) existingModel.gender = gender;
    if (slug) existingModel.slug = slug;
    if (coverImage !== existingModel.coverImage)
      existingModel.coverImage = coverImage;
    if (images !== existingModel.images) existingModel.images = images;

    await existingModel.save({ session });
    await session.commitTransaction();

    res.status(200).json({ success: true, data: existingModel });
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
      .json({ success: false, message: "Error updating model", error });
  } finally {
    session.endSession();
  }
};

// Delete model by ID
export const deleteModelById = async (req: Request, res: Response) => {
  const session = await Model.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const model = await Model.findById(id).session(session);

    if (!model) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Model not found" });
    }

    // Delete all image files
    const imagesToDelete = [model.coverImage, ...model.images];
    deleteImageFiles(imagesToDelete);

    // Get the order of the model to be deleted
    const deletedOrder = model.order;

    // Delete the model
    await Model.findByIdAndDelete(id, { session });

    // Decrement order for all models with order > deletedOrder
    await Model.updateMany(
      { order: { $gt: deletedOrder } },
      { $inc: { order: -1 } },
      { session }
    );

    await session.commitTransaction();
    res
      .status(200)
      .json({ success: true, message: "Model deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ success: false, message: "Error deleting model", error });
  } finally {
    session.endSession();
  }
};
