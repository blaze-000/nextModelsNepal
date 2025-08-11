import { Request, Response } from "express";
import mongoose from "mongoose";
import { EventModel } from "../models/events.model";
import { eventZodSchema } from "../validations/event.validation";
import { ZodError } from "zod";
import { MemberModel } from "../models/member.model";

//  Fetch all Event items
export const getEventItems = async (_req: Request, res: Response) => {
    try {
        const eventItems = await EventModel.find({}).populate('member');
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
        const eventItem = await EventModel.findOne({ index: id }).populate('member');

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
        const files = req.files as { [key: string]: Express.Multer.File[] };

        // Inject file paths into req.body before validation
        req.body.coverImage = files?.coverImage?.[0]?.path || "";
        req.body.logo = files?.logo?.[0]?.path || "";
        req.body.titleImage = files?.titleImage?.[0]?.path || "";
        req.body.subImage = files?.subImage?.[0]?.path || "";

        req.body.highlight = files?.highlight?.map(f => f.path) || [];
        req.body.sponsersImage = files?.sponsersImage?.map(f => f.path) || [];

        req.body.startingTimelineIcon = files?.startingTimelineIcon?.[0]?.path || "";
        req.body.midTimelineIcon = files?.midTimelineIcon?.[0]?.path || "";
        req.body.endTimelineIcon = files?.endTimelineIcon?.[0]?.path || "";

        // Parse request body with Zod (after injecting file paths)
        const eventData = eventZodSchema.parse(req.body);

        // Resolve member id robustly from form-data that may send duplicates
        let memberIdRaw: unknown = (req.body as any).member ?? (req.body as any).memberId ?? (req.body as any).id;
        console.log(memberIdRaw)
        if (Array.isArray(memberIdRaw)) {
            // pick the last non-empty value
            const nonEmpty = memberIdRaw.filter((v) => typeof v === 'string' && v.trim().length > 0);
            memberIdRaw = nonEmpty.length > 0 ? nonEmpty[nonEmpty.length - 1] : '';
        }
        const memberId: string = typeof memberIdRaw === 'string' ? memberIdRaw : '';

        if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({ success: false, message: 'Invalid member id' });
        }

        const existMember = await MemberModel.findById(memberId);
        if (!existMember) {
            return res.status(404).send("Member not found with this id");
        }

        // Destructure eventData
        const {
            state,
            title,
            slug,
            manageBy,
            date,
            year,
            overview,
            purpose,
            eventDescription,
            startingTimelineDate,
            startingTimelineEvent,
            midTimelineDate,
            midTimelineEvent,
            endTimelineDate,
            endTimelineEvent,
            coverImage,
            titleImage,
            subImage,
            logo,
            highlight,
            startingTimelineIcon,
            midTimelineIcon,
            endTimelineIcon,
            sponsersImage
        } = eventData;

        // Create the event document in MongoDB
        const eventSection = await EventModel.create({
            state,
            title,
            slug,
            manageBy,
            date,
            year,
            overview,
            purpose,
            coverImage,
            titleImage,
            subImage,
            logo,
            highlight,
            eventDescription,
            startingTimelineIcon,
            startingTimelineDate,
            startingTimelineEvent,
            midTimelineIcon,
            midTimelineDate,
            midTimelineEvent,
            endTimelineIcon,
            endTimelineDate,
            endTimelineEvent,
            sponsersImage,
            member: existMember._id
        });

        return res.status(201).json({
            success: true,
            message: "Event section item created successfully.",
            data: eventSection
        });

    } catch (error: any) {
        console.error("Error creating Event item:", error);

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data.",
                error: error.message
            });
        }

        // Handle Multer unexpected file fields
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message: "Unexpected file field. Please check your form field names.",
                error: error.message,
                expectedFields: [
                    "coverImage", "titleImage", "subImage", "highlight", "logo",
                    "startingTimelineIcon", "midTimelineIcon", "endTimelineIcon", "sponsersImage"
                ]
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};

//  Update a Event item by ID
export const updateEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the event exists
        const existEvent = await EventModel.findOne({ index: id });
        if (!existEvent) {
            return res.status(404).send("Invalid Event Id.");
        }

        // When using uploadEventFiles.fields(), files come as an object with field names
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        // Build the update object
        const updateData: any = {};

        // Check if req.body exists before destructuring
        if (req.body) {
            const { state, title, slug, manageBy, date, year, overview, purpose, eventDescription, startingTimelineDate, startingTimelineEvent, midTimelineDate, midTimelineEvent, endTimelineDate, endTimelineEvent } = req.body;

            if (state !== undefined) updateData.state = state;
            if (title !== undefined) updateData.title = title;
            if (slug !== undefined) updateData.slug = slug;
            if (manageBy !== undefined) updateData.manageBy = manageBy;
            if (date !== undefined) updateData.date = date;
            if (year !== undefined) updateData.year = year;
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

        // Handle sponsers images update (append to existing)
        const sponsersImageFiles = files?.sponsersImage || [];
        if (sponsersImageFiles.length > 0) {
            updateData.sponsersImage = [...(existEvent.sponsersImage || []), ...sponsersImageFiles.map(f => f.path)];
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
        }).populate('member');

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