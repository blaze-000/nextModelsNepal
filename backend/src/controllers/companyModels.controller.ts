import { Request, Response } from "express";
import { COMMODEL } from "../models/companyModels.model";

// Fetch all models
export const getModels = async (_req: Request, res: Response) => {
  try {
    const models = await COMMODEL.find({});
    if (!models || models.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No models found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Models retrieved successfully.",
      data: models,
    });
  } catch (error: any) {
    console.error("Error fetching models:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving models.",
    });
  }
};

// Get single model by ID
export const getModelsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const model = await COMMODEL.findById(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: `Model with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Model retrieved successfully.",
      data: model,
    });
  } catch (error: any) {
    console.error(
      `Error fetching model with ID ${req.params.id}:`,
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving model.",
    });
  }
};

//  Create model
export const createModels = async (req: Request, res: Response) => {
  try {
    const { name, intro, address, gender, slug } = req.body;

    // Check if model with same name exists
    const existingModel = await COMMODEL.findOne({ name });
    if (existingModel) {
      return res.status(409).json({
        success: false,
        message: `${name} model already exists.`,
      });
    }

    // When using uploadCompanyModelFiles.fields(), files come as an object with field names
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Get cover image (required)
    const coverImageFiles = files?.coverImage || [];
    if (coverImageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a cover image.",
      });
    }
    const coverImagePath = coverImageFiles[0].path;

    // Get gallery images (optional)
    const galleryImageFiles = files?.images || [];
    const galleryImagePaths = galleryImageFiles.map((file) => file.path);

    // Create new model
    const newModel = await COMMODEL.create({
      name,
      intro,
      address,
      gender,
      coverImage: coverImagePath,
      images: galleryImagePaths,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Company Model created successfully.",
      data: newModel,
    });
  } catch (error) {
    console.error("Error creating models:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a model item by ID
export const updateModelsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the model exists
    const existingModel = await COMMODEL.findById(id);
    if (!existingModel) {
      return res.status(404).json({
        success: false,
        message: "Model not found.",
      });
    }

    // When using uploadCompanyModelFiles.fields(), files come as an object with field names
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Build the update object
    const updateData: any = {};

    // Check if req.body exists before destructuring
    if (req.body) {
      const { name, intro, address, gender, slug, removedImages } = req.body;

      if (name !== undefined) updateData.name = name;
      if (intro !== undefined) updateData.intro = intro;
      if (address !== undefined) updateData.address = address;
      if (gender !== undefined) updateData.gender = gender;
      if (slug !== undefined) updateData.slug = slug;

      // Handle removed images - this helps with cleanup
      if (removedImages) {
        try {
          const removedImagesList = JSON.parse(removedImages);
          // Here you could add file system cleanup logic if needed
          console.log("Images to be removed:", removedImagesList);
        } catch (e) {
          console.log("Could not parse removedImages:", removedImages);
        }
      }
    }

    // Handle cover image update
    const coverImageFiles = files?.coverImage || [];
    if (coverImageFiles.length > 0) {
      updateData.coverImage = coverImageFiles[0].path;
    }

    // Handle gallery images update
    const galleryImageFiles = files?.images || [];
    if (galleryImageFiles.length > 0) {
      // Replace existing images with new ones
      // Frontend handles the logic of what images to keep/remove
      const newImagePaths = galleryImageFiles.map((f) => f.path);
      updateData.images = newImagePaths;
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field or file must be provided for update.",
      });
    }

    const updatedItem = await COMMODEL.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `Model with ID ${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Model item updated successfully.",
      data: updatedItem,
    });
  } catch (error: any) {
    console.error("Error Updating model:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//  Delete a model by ID
export const deleteModelsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existingModel = await COMMODEL.findById(id);
    if (!existingModel) {
      return res.status(404).json({
        success: false,
        message: "Model not found.",
      });
    }

    await COMMODEL.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `${existingModel.name} model deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error Deleting model by Id:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};