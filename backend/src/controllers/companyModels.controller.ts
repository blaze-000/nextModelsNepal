import { Request, Response } from "express";
import { COMMODEL } from "../models/companyModels.model";

//  * Fetch all Models items
export const getModels = async (_req: Request, res: Response) => {
    try {
        const modelsItems = await COMMODEL.find({});
        if (!modelsItems || modelsItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No models found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Models items retrieved successfully.",
            data: modelsItems,
        });
    } catch (error: any) {
        console.error("Error fetching Models :", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Models.",
        });
    }
};

// Get single Models item by ID
export const getModelsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const modelsItem = await COMMODEL.findById(id);

        if (!modelsItem) {
            return res.status(404).json({
                success: false,
                message: `Models item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Models item retrieved successfully.",
            data: modelsItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Models item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Models item.",
        });
    }
};

//  Create Models item
export const createModels = async (req: Request, res: Response) => {
    try {
        const { name, intro, address, gender, slug } = req.body;

        // Check if model with same name exists
        const existMember = await COMMODEL.findOne({ name });
        if (existMember) {
            return res.status(409).send(`${name} model already exists.`);
        }

        // When using uploadCompanyModelFiles.fields(), files come as an object with field names
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Get cover image (required)
        const coverImageFiles = files?.coverImage || [];
        if (coverImageFiles.length === 0) {
            return res.status(400).send("Please provide a cover image.");
        }
        const coverImagePath = coverImageFiles[0].path;

        // Get gallery images (optional)
        const galleryImageFiles = files?.images || [];
        const galleryImagePaths = galleryImageFiles.map(file => file.path);

        // Create new member
        const newMember = await COMMODEL.create({
            name,
            intro,
            address,
            gender,
            coverImage: coverImagePath,
            images: galleryImagePaths,
            slug
        });

        res.status(201).json({
            success: true,
            message: "Company Models created successfully.",
            newMember
        });
    } catch (error) {
        console.error("Error creating models:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update a Models item by ID
export const updateModelsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the model exists
        const existMember = await COMMODEL.findById(id);
        if (!existMember) {
            return res.status(401).send("Invalid Model Id.");
        }

        // When using uploadCompanyModelFiles.fields(), files come as an object with field names
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Build the update object
        const updateData: any = {};

        // Check if req.body exists before destructuring
        if (req.body) {
            const { name, intro, address, gender, slug } = req.body;

            if (name !== undefined) updateData.name = name;
            if (intro !== undefined) updateData.intro = intro;
            if (address !== undefined) updateData.address = address;
            if (gender !== undefined) updateData.gender = gender;
            if (slug !== undefined) updateData.slug = slug;
        }

        // Handle cover image update
        const coverImageFiles = files?.coverImage || [];
        if (coverImageFiles.length > 0) {
            updateData.coverImage = coverImageFiles[0].path;
        }

        // Append new gallery images to existing images array
        const galleryImageFiles = files?.images || [];
        if (galleryImageFiles.length > 0) {
            updateData.images = [...(existMember.images || []), ...galleryImageFiles.map(f => f.path)];
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field or file must be provided for update.",
            });
        }

        const updatedItem = await COMMODEL.findByIdAndUpdate(id, updateData, {
            new: true,
            upsert: false,
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
        res.status(500).json({ error: "Internal server error" });
    }
};

//  Delete a Models item by ID
export const deleteModelsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existMember = await COMMODEL.findOne({ _id: id });
        if (!existMember) {
            return res.status(401).send("Invalid Member Id.");
        }

        await COMMODEL.findByIdAndDelete({ _id: id });

        res.status(201).json({
            success: true,
            message: `${existMember.name} model deleted successfully.`
        });
    } catch (error: any) {
        console.error("Error Deleting model by Id:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};