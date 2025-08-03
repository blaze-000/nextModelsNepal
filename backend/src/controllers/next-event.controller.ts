import { Request, Response } from "express";
import { NextEventModel } from "../models/next.events.model";
import { nextEventSchema } from "../validations/next.event.validation";

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

// Create event
export const createNextEventItem = async (req: Request, res: Response) => {
    try {
        // Convert strings to arrays if needed
        const bodyData = { ...req.body };
        if (typeof bodyData.subtitle === 'string') {
            bodyData.subtitle = [{ text: bodyData.subtitle, icon: [] }];
        }
        if (typeof bodyData.notice === 'string') {
            bodyData.notice = [bodyData.notice];
        }

        // Validate input
        const validData = nextEventSchema.parse(bodyData);
        
        // Handle file uploads
        const files = req.files as { [key: string]: Express.Multer.File[] };
        if (files?.images) {
            validData.images = files.images.map(file => file.path);
        }
        if (files?.icons && validData.subtitle?.[0]) {
            validData.subtitle[0].icon = files.icons.map(file => file.path);
        }

        const event = await NextEventModel.create(validData);
        
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error: any) {
        res.status(400).json({
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

        // Convert strings to arrays if needed
        if (typeof updateData.subtitle === 'string') {
            updateData.subtitle = [{ text: updateData.subtitle, icon: [] }];
        }
        if (typeof updateData.notice === 'string') {
            updateData.notice = [updateData.notice];
        }

        // Handle file uploads if present
        const files = req.files as { [key: string]: Express.Multer.File[] };
        if (files) {
            const event = await NextEventModel.findById(id);
            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                });
            }

            // Add new images to existing ones
            if (files.images) {
                updateData.images = [
                    ...(event.images || []),
                    ...files.images.map(file => file.path)
                ];
            }

            // Add new icons to first subtitle
            if (files.icons && event.subtitle?.[0]) {
                updateData.subtitle = [...event.subtitle];
                updateData.subtitle[0].icon = [
                    ...(event.subtitle[0].icon || []),
                    ...files.icons.map(file => file.path)
                ];
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