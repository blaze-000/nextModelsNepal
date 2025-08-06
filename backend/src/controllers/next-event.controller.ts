import { Request, Response } from "express";
import { NextEventModel } from "../models/next.events.model";
import { nextEventSchema, nextEventUpdateSchema } from "../validations/next.event.validation";
import _ from "lodash"; // to help restructure nested fields

// Helper function to get relative upload path
const getRelativeUploadPath = (file: Express.Multer.File | undefined) => {
    if (!file) return undefined;
    // Convert backslashes to forward slashes and ensure it's a relative path
    const relativePath = file.path.replace(/\\/g, '/').replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/');
    return relativePath;
};

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

        // Handle flat notice[]
        const notice = Array.isArray(body.notice) ? body.notice : [body.notice];

        // Handle card field - parse if it's a JSON string
        let cardData = body.card || [];
        if (typeof cardData === 'string') {
            try {
                cardData = JSON.parse(cardData);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid card JSON format',
                    errors: e instanceof Error ? e.message : 'Unknown error'
                });
            }
        }

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
        const titleImage = getRelativeUploadPath(files.titleImage[0]);
        const image = getRelativeUploadPath(files.image[0]);

        // Defensive pass: ensure every item has criteriaIcon as a string
        if (cardData && Array.isArray(cardData)) {
            cardData.forEach((card: any) => {
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
                cardData &&
                Array.isArray(cardData) &&
                cardData[cardIndex] &&
                Array.isArray(cardData[cardIndex].item) &&
                cardData[cardIndex].item[itemIndex]
            ) {
                cardData[cardIndex].item[itemIndex].criteriaIcon = getRelativeUploadPath(file);
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
            card: cardData
        };

        // Validate using zod
        const validData = nextEventSchema.parse(formData);

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
        
        // Check if event exists
        const existingEvent = await NextEventModel.findById(id).lean();
        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

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

        // Start with a deep clone of the existing event
        let mergedData: any = _.cloneDeep(existingEvent);

        // Only update fields that are present in the request body
        if (body.tag !== undefined) mergedData.tag = body.tag;
        if (body.title !== undefined) mergedData.title = body.title;
        if (body.description !== undefined) mergedData.description = body.description;
        if (body.noticeName !== undefined) mergedData.noticeName = body.noticeName;
        if (body.notice !== undefined) {
            mergedData.notice = Array.isArray(body.notice) ? body.notice : [body.notice];
        }
        if (body.card !== undefined) {
            // Deep merge card array if provided
            mergedData.card = _.mergeWith(
                _.cloneDeep(existingEvent.card),
                body.card,
                (objValue, srcValue) => Array.isArray(objValue) && Array.isArray(srcValue) ? srcValue : undefined
            );
        }

        // Handle titleImage file update
        if (files?.titleImage && files.titleImage[0]) {
            mergedData.titleImage = getRelativeUploadPath(files.titleImage[0]);
        }

        // Handle image file update
        if (files?.image && files.image[0]) {
            mergedData.image = getRelativeUploadPath(files.image[0]);
        }

        // Handle nested file fields for criteriaIcon
        if (Array.isArray(req.files)) {
            for (const file of req.files) {
                const field = file.fieldname;
                // Match criteriaIcon field pattern: card[0][item][1][criteriaIcon]
                const match = field.match(/^card\[(\d+)]\[item]\[(\d+)]\[criteriaIcon]$/);
                if (match) {
                    const cardIndex = parseInt(match[1], 10);
                    const itemIndex = parseInt(match[2], 10);
                    if (
                        mergedData.card &&
                        Array.isArray(mergedData.card) &&
                        mergedData.card[cardIndex] &&
                        Array.isArray(mergedData.card[cardIndex].item) &&
                        mergedData.card[cardIndex].item[itemIndex]
                    ) {
                        mergedData.card[cardIndex].item[itemIndex].criteriaIcon = getRelativeUploadPath(file);
                    }
                }
            }
        }

        // Defensive pass: ensure every item has criteriaIcon as a string
        if (mergedData.card && Array.isArray(mergedData.card)) {
            mergedData.card.forEach((card: any) => {
                if (card.item && Array.isArray(card.item)) {
                    card.item.forEach((item: any) => {
                        if (typeof item.criteriaIcon !== 'string') {
                            item.criteriaIcon = "default-icon.svg";
                        }
                    });
                }
            });
        }

        // Validate the merged data using the main schema (all required fields must be present after merge)
        const validData = nextEventSchema.parse(mergedData);

        // Update the event in DB
        const updatedEvent = await NextEventModel.findByIdAndUpdate(
            id,
            validData,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent
        });

    } catch (error: any) {
        console.error("Update error:", error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message,
            errors: error.errors || null
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