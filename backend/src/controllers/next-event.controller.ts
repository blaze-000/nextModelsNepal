import { Request, Response } from "express";
import { NextEventModel } from "../models/next.events.model";
import { nextEventSchema } from "../validations/next.event.validation";
import _ from "lodash"; // to help restructure nested fields

export const createNextEventItem = async (req: Request, res: Response) => {
    try {
        // Convert req.files array (from multer.any) to object keyed by fieldname
        let files: { [key: string]: Express.Multer.File[] } = {};
        if (Array.isArray(req.files)) {
            for (const file of req.files) {
                if (!files[file.fieldname]) files[file.fieldname] = [];
                files[file.fieldname].push(file);
            }
        } else {
            files = req.files as { [key: string]: Express.Multer.File[] };
        }
        const body = req.body;
        console.log("BODY:", JSON.stringify(body, null, 2));


        // Handle flat notice[]
        const notice = Array.isArray(body.notice) ? body.notice : [body.notice];

        // Handle titleImage and image file
        if (!files?.titleImage || !files?.titleImage[0]) {
            return res.status(400).json({
                success: false,
                message: 'Title image file is required',
                errors: { field: 'titleImage' }
            });
        }
        if (!files?.image || !files?.image[0]) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required',
                errors: { field: 'image' }
            });
        }
        const titleImage = files.titleImage[0].path;
        const image = files.image[0].path;

        // Defensive pass: ensure every item has criteriaIcon as a string
        if (body.card && Array.isArray(body.card)) {
            body.card.forEach((card: any) => {
                if (card.item && Array.isArray(card.item)) {
                    card.item.forEach((item: any) => {
                        if (typeof item.criteriaIcon !== 'string') {
                         item.criteriaIcon = "default-icon.svg"; // or any valid string;
                        }
                    });
                }
            });
        }

        // Map uploaded files into correct places
if (Array.isArray(req.files)) {
    for (const file of req.files) {
        const field = file.fieldname;

        // Match criteriaIcon field pattern: card[0][item][1][criteriaIcon]
        const match = field.match(/^card\[(\d+)]\[item]\[(\d+)]\[criteriaIcon]$/);
        if (match) {
            const cardIndex = parseInt(match[1], 10);
            const itemIndex = parseInt(match[2], 10);
            if (
                body.card &&
                Array.isArray(body.card) &&
                body.card[cardIndex] &&
                Array.isArray(body.card[cardIndex].item) &&
                body.card[cardIndex].item[itemIndex]
            ) {
                body.card[cardIndex].item[itemIndex].criteriaIcon = file.path; // Save path to use in Zod
            }
        }
    }
}
        // Prepare final validated object
        const formData = {
            tag: body.tag,
            title: body.title,
            titleImage,
            image,
            description: body.description,
            noticeName: body.noticeName,
            notice,
            card: body.card || []
        };

        // Validate using zod
        const validData = nextEventSchema.parse(formData);

        // Debug log to check what is being saved
        console.log("Saving to DB:", JSON.stringify(validData, null, 2));

        // Save to DB
        const event = await NextEventModel.create(validData);

        return res.status(201).json({
            success: true,
            data: event
        });

    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
            errors: error.errors || null
        });
    }
};

// Get all events
export const getNextEventItems = async (_req: Request, res: Response) => {
    try {
        const events = await NextEventModel.find({});
        
        res.json({
            success: true,
            data: events,
            count: events.length
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single event
export const getNextEventById = async (req: Request, res: Response) => {
    try {
        const event = await NextEventModel.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update event
export const updateNextEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        const files = req.files as { [key: string]: Express.Multer.File[] };
        if (files) {
            const event = await NextEventModel.findById(id);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                });
            }
        }

        const updatedEvent = await NextEventModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({
            success: true,
            data: updatedEvent
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete event
export const deleteNextEventById = async (req: Request, res: Response) => {
    try {
        const deletedEvent = await NextEventModel.findByIdAndDelete(req.params.id);
        
        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};