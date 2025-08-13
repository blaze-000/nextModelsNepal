import { Request, Response } from "express";
import { NavModel } from "../models/nav.model";
import { EventModel } from "../models/events.model";
import { navSchema } from "../validations/nav.validation";

// GET /nav - Get navigation settings
export const showVoting = async (req: Request, res: Response) => {
    try {
        const nav = await NavModel.findOne();

        if (!nav) {
            return res.status(404).json({
                success: false,
                message: "Navigation settings not found"
            });
        }

        res.json({
            success: true,
            data: nav
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch navigation settings",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// POST /nav - Create navigation settings
export const createShowVoting = async (req: Request, res: Response) => {
    try {
        const validation = navSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        // Check if nav settings already exist
        const existingNav = await NavModel.findOne();
        if (existingNav) {
            return res.status(409).json({
                success: false,
                message: "Navigation settings already exist. Use PATCH to update."
            });
        }

        const nav = new NavModel(validation.data);
        await nav.save();

        res.status(201).json({
            success: true,
            data: nav,
            message: "Navigation settings created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create navigation settings",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// PATCH /nav - Update navigation settings
export const updateShowVoting = async (req: Request, res: Response) => {
    try {
        const validation = navSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const nav = await NavModel.findOneAndUpdate(
            {},
            validation.data,
            { new: true, upsert: true, runValidators: true }
        );

        res.json({
            success: true,
            data: nav,
            message: "Navigation settings updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update navigation settings",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

// GET /nav/items - Get all navigation info
export const getAllNavInfo = async (req: Request, res: Response) => {
    try {
        const nav = await NavModel.findOne().select("showVoting");

        if (!nav) {
            return res.status(404).json({
                success: false,
                message: "Navigation settings not found"
            });
        }

        // Get all events with their seasons populated
        const events = await EventModel.find().populate('seasons');

        // Process events into self and partner categories
        const selfEvents = [];
        const partnerEvents = [];

        for (const event of events) {
            if (event.seasons && event.seasons.length > 0) {
                // Cast seasons to any to access properties
                const seasons = event.seasons as any[];
                
                // Sort seasons by year descending and get the latest one
                const sortedSeasons = seasons.sort((a: any, b: any) => b.year - a.year);
                const latestSeason = sortedSeasons[0];
                
                const eventItem = {
                    label: event.name,
                    slug: latestSeason.slug
                };

                if (event.managedBy === 'self') {
                    selfEvents.push(eventItem);
                } else if (event.managedBy === 'partner') {
                    partnerEvents.push(eventItem);
                }
            }
        }

        const navItems = {
            showVoting: nav.showVoting,
            selfEvents,
            partnerEvents
        };

        res.json({
            success: true,
            data: navItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch navigation items",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};