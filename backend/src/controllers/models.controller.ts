import { Request, Response } from "express";
import { ModelsModel } from "../models/models.model";

//  * Fetch all Models items
export const getModels = async (_req: Request, res: Response) => {
    try {
        const modelsItems = await ModelsModel.find({});
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
        const modelsItem = await ModelsModel.findById(id);

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
        const { name, address, gender } = req.body;

        // Check if model with same name exists
        const existMember = await ModelsModel.findOne({ name });
        if (existMember) {
            return res.status(409).send(`${name} model already exists.`);
        }

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Get image path (optional)
        const imageFiles = files?.images || [];
        const imagePath = imageFiles.length > 0 ? imageFiles[0].path : null;

        // Get icon file (required)
        const iconFiles = files?.icon || [];
        if (iconFiles.length === 0) {
            return res.status(400).json({ error: "One SVG icon file is required." });
        }
        const iconPath = iconFiles[0].path;

        // Create new member
        const newMember = await ModelsModel.create({
            name,
            address,
            gender,
            images: imagePath,
            icon: iconPath
        });

        res.status(201).json({
            success: true,
            message: "Models created successfully.",
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
        const existMember = await ModelsModel.findById(id);
        if (!existMember) {
            return res.status(401).send("Invalid Model Id.");
        }

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const imageFiles = files?.images || [];
        const iconFiles = files?.icon || [];

        // Build the update object
        const updateData: any = {};

        const { name, address, gender } = req.body;

        if (name !== undefined) updateData.name = name;
        if (address !== undefined) updateData.address = address;
        if (gender !== undefined) updateData.gender = gender;

        // Append new images to existing images array
        if (imageFiles.length > 0) {
            updateData.images = [...(existMember.images || []), ...imageFiles.map(f => f.path)];
        }

        // Replace icon if new icon uploaded
        if (iconFiles.length > 0) {
            updateData.icon = iconFiles[0].path;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field or file must be provided for update.",
            });
        }

        const updatedItem = await ModelsModel.findByIdAndUpdate(id, updateData, {
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
        const existMember = await ModelsModel.findOne({ _id: id });
        if (!existMember) {
            return res.status(401).send("Invalid Member Id.");
        }

        await ModelsModel.findByIdAndDelete({ _id: id });

        res.status(201).json({
            success: true,
            message: `${existMember.name} model deleted successfully.`
        });
    } catch (error: any) {
        console.error("Error Deleting model by Id:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};