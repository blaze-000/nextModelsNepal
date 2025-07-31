import { Request, Response } from "express";
import { EventModel } from "../models/events.model";
import { eventZodSchema } from "../validations/event.validation";

//  Fetch all Event items
export const getEventItems = async (_req: Request, res: Response) => {
    try {
        const eventItems = await EventModel.find({});
        if (!eventItems || eventItems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No event items found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event items retrieved successfully.",
            data: eventItems,
        });
    } catch (error: any) {
        console.error("Error fetching Event items:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Event items.",
        });
    }
};

//  Get single Event item by ID
export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventItem = await EventModel.findOne({ index: id });

        if (!eventItem) {
            return res.status(404).json({
                success: false,
                message: `Event item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event item retrieved successfully.",
            data: eventItem,
        });
    } catch (error: any) {
        console.error(`Error fetching Event item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving Event item.",
        });
    }
};

//  Create Event item
export const createEventItem = async (req: Request, res: Response) => {
    try {
        const eventData = eventZodSchema.parse(req.body);
        const { tag, title, date, description, content, participants } = eventData;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const imageFiles = files['images'] || [];
        const iconFiles = files['icon'] || [];

        if (iconFiles.length === 0) {
            return res.status(400).json({ error: "One SVG icon file is required." });
        }

        const imagePath = imageFiles.length > 0 ? imageFiles[0].path : null;
        const iconPath = iconFiles[0].path;

        const eventSection = await EventModel.create({
            tag,
            title,
            date,
            description,
            content,
            participants,
            images: imagePath ? [imagePath] : [],  // your schema expects an array of strings
            icon: iconPath
        });

        res.status(201).json({
            success: true,
            message: "Event section item created successfully.",
            data: eventSection
        });
    } catch (error: any) {
        console.error("Error creating Event item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
};

//  Update a Event item by ID
export const updateEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if files are present
        const files = req.files as Express.Multer.File[] | undefined;

        let updateData: any = {};

        if (files && files.length > 0) {
            // If files are present, validate with eventSchema
            const validatedData = eventZodSchema.parse(req.body);
            const { index, tag, title, date, description, content, participants } = validatedData;

            const imagePath = files[0].path;

            updateData = {
                index,
                tag,
                title,
                date,
                description,
                content,
                participants,
                images: imagePath
            };
        } else {
            const { index, tag, title, date, description, content, participants } = req.body;

            if (tag !== undefined) updateData.tag = tag;
            if (title !== undefined) updateData.title = title;
            if (date !== undefined) updateData.date = date;
            if (description !== undefined) updateData.description = description;
            if (content !== undefined) updateData.content = content;
            if (participants !== undefined) updateData.participants = participants;

            // If no fields are provided, return error
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update.",
                });
            }
        }

        const updatedItem = await EventModel.findOneAndUpdate({ index: id }, updateData, {
            new: true,
            upsert: false,
        });

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: `Event item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event item updated successfully.",
            data: updatedItem,
        });
    } catch (error: any) {
        console.error(`Error updating Event item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating Event item.",
            error: error.message,
        });
    }
};

//  Delete a Event item by ID
export const deleteEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await EventModel.findOneAndDelete({ index: id });

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: `Event item with ID ${id} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event item deleted successfully.",
            data: deletedItem,
        });
    } catch (error: any) {
        console.error(`Error deleting Event item with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting Event item.",
            error: error.message,
        });
    }
};
