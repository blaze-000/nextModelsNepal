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
        const { tag, title, date, overview, purpose, eventDescription, startingTimelineDate, startingTimelineEvent, midTimelineDate, midTimelineEvent, endTimelineDate, endTimelineEvent } = eventData;

        // When using uploadEventFiles.fields(), files come as an object with field names
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Get cover image (optional)
        const coverImageFiles = files?.coverImage || [];
        const coverImagePath = coverImageFiles.length > 0 ? coverImageFiles[0].path : null;

        // Get title image (optional)
        const titleImageFiles = files?.titleImage || [];
        const titleImagePath = titleImageFiles.length > 0 ? titleImageFiles[0].path : null;

        // Get sub image (optional)
        const subImageFiles = files?.subImage || [];
        const subImagePath = subImageFiles.length > 0 ? subImageFiles[0].path : null;

        // Get highlight images (optional)
        const highlightImageFiles = files?.highlight || [];
        const highlightImagePaths = highlightImageFiles.map(file => file.path);

        // Get logo (required)
        const logoFiles = files?.logo || [];
        if (logoFiles.length === 0) {
            return res.status(400).send("Please provide a logo.");
        }
        const logoPath = logoFiles[0].path;

        // Get icon (required)
        const iconFiles = files?.startingTimelineIcon || [];
        if (iconFiles.length === 0) {
            return res.status(400).send("Please provide a starting timeline icon.");
        }
        const startingIconPath = iconFiles[0].path;

        // Get icon (required)
        const midIconFiles = files?.startingTimelineIcon || [];
        if (midIconFiles.length === 0) {
            return res.status(400).send("Please provide a mid timeline icon.");
        }
        const midIconPath = iconFiles[0].path;

        // Get icon (required)
        const endIconFiles = files?.startingTimelineIcon || [];
        if (endIconFiles.length === 0) {
            return res.status(400).send("Please provide a ending timeline icon.");
        }
        const endIconPath = iconFiles[0].path;

        const eventSection = await EventModel.create({
            tag,
            title,
            date,
            overview,
            purpose,
            coverImage: coverImagePath,
            titleImage: titleImagePath,
            subImage: subImagePath,
            logo: logoPath,
            highlight: highlightImagePaths,

            eventDescription,
            startingTimelineIcon: startingIconPath,
            startingTimelineDate,
            startingTimelineEvent,

            midTimelineIcon: midIconPath,
            midTimelineDate,
            midTimelineEvent,

            endTimelineIcon: endIconPath,
            endTimelineDate,
            endTimelineEvent
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

        // Check if the event exists
        const existEvent = await EventModel.findOne({ index: id });
        if (!existEvent) {
            return res.status(401).send("Invalid Event Id.");
        }

        // When using uploadEventFiles.fields(), files come as an object with field names
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Build the update object
        const updateData: any = {};

        // Check if req.body exists before destructuring
        if (req.body) {
            const { tag, title, date, overview, purpose, eventDescription, startingTimelineDate, startingTimelineEvent, midTimelineDate, midTimelineEvent, endTimelineDate, endTimelineEvent } = req.body;

            if (tag !== undefined) updateData.tag = tag;
            if (title !== undefined) updateData.title = title;
            if (date !== undefined) updateData.date = date;
            if (overview !== undefined) updateData.overview = overview;
            if (purpose !== undefined) updateData.purpose = purpose;
            if (eventDescription !== undefined) updateData.eventDescription = eventDescription;
            if (startingTimelineDate !== undefined) updateData.startingTimelineDate = startingTimelineDate;
            if (startingTimelineEvent !== undefined) updateData.startingTimelineEvent = startingTimelineEvent;
            if (midTimelineDate !== undefined) updateData.midTimelineDate = midTimelineDate;
            if (midTimelineEvent !== undefined) updateData.midTimelineEvent = midTimelineEvent;
            if (endTimelineDate !== undefined) updateData.endTimelineDate = endTimelineDate;
            if (endTimelineEvent !== undefined) updateData.endTimelineEvent = endTimelineEvent;
        }

        // Handle cover image update
        const coverImageFiles = files?.coverImage || [];
        if (coverImageFiles.length > 0) {
            updateData.coverImage = coverImageFiles[0].path;
        }

        // Handle title image update
        const titleImageFiles = files?.titleImage || [];
        if (titleImageFiles.length > 0) {
            updateData.titleImage = titleImageFiles[0].path;
        }

        // Handle sub image update
        const subImageFiles = files?.subImage || [];
        if (subImageFiles.length > 0) {
            updateData.subImage = subImageFiles[0].path;
        }

        // Handle highlight images update (append to existing)
        const highlightImageFiles = files?.highlight || [];
        if (highlightImageFiles.length > 0) {
            updateData.highlight = [...(existEvent.highlight || []), ...highlightImageFiles.map(f => f.path)];
        }

        // Handle logo update
        const logoFiles = files?.logo || [];
        if (logoFiles.length > 0) {
            updateData.logo = logoFiles[0].path;
        }

        // Handle timeline icons update
        const startingTimelineIconFiles = files?.startingTimelineIcon || [];
        if (startingTimelineIconFiles.length > 0) {
            updateData.startingTimelineIcon = startingTimelineIconFiles[0].path;
        }

        const midTimelineIconFiles = files?.midTimelineIcon || [];
        if (midTimelineIconFiles.length > 0) {
            updateData.midTimelineIcon = midTimelineIconFiles[0].path;
        }

        const endTimelineIconFiles = files?.endTimelineIcon || [];
        if (endTimelineIconFiles.length > 0) {
            updateData.endTimelineIcon = endTimelineIconFiles[0].path;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field or file must be provided for update.",
            });
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
