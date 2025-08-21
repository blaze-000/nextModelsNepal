import { socialModel } from "../models/social.model";
import { Request, Response } from "express";
import { socialSchema, updateSocialSchema } from "../validations/social.validation";

export const createSocial = async (req: Request, res: Response) => {
    try {
        const data = socialSchema.parse(req.body);
        const { instagram, x, fb, linkdln, mail, location, phone } = data;

        // Only one social document should exist. If one exists, update it instead of creating a new one.
        const existing = await socialModel.findOne();
        if (existing) {
            const updated = await socialModel.findByIdAndUpdate(
                existing._id,
                { instagram, x, fb, linkdln, mail, location, phone },
                { new: true, runValidators: true }
            );
            if (!updated) return res.status(400).send("Failed to update social data.");
            return res.status(200).json({ success: true, social: updated, message: "Social updated" });
        }

        const social = await socialModel.create({ instagram, x, fb, linkdln, mail, location, phone });
        if (!social) return res.status(400).send("Failed to save social data.");
        res.status(201).json({ success: true, social, message: "Social created" });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create social data.",
            error: error.message
        });
    }
}

export const getAllSocial = async (req: Request, res: Response) => {
    try {
        const social = await socialModel.find();
        res.status(201).json({ success: true, social });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to get social data.",
            error: error.message
        });
    }
}

export const getSocialById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const social = await socialModel.findById(id);
        if (!social) return res.status(404).json({ success: false, message: "Invalid social id." });

        res.status(201).json({ success: true, message: "Social data deleted successfully.", social });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to get social data by Id.",
            error: error.message
        });
    }
}

export const updateSocialById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateSocialSchema.parse(req.body);
        const { instagram, x, fb, linkdln, mail, location, phone } = data;

        const updatedSocial = await socialModel.findByIdAndUpdate(
            id,
            { instagram, x, fb, linkdln, mail, location, phone },
            { new: true, runValidators: true }
        );

        if (!updatedSocial) {
            return res.status(404).json({ success: false, message: "Invalid social id." });
        }

        res.status(200).json({ success: true, message: "Social data updated successfully.", updatedSocial });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update social data.",
            error: error.message,
        });
    }
};

export const deleteSocialById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const social = await socialModel.findByIdAndDelete(id);
        if (!social) return res.status(404).json({ success: false, message: "Invalid social id." });

        res.status(201).json({ success: true, message: "Social data deleted successfully." });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete social data by Id.",
            error: error.message
        });
    }
};
