import { Request, Response } from "express";
import { NavModel } from "../models/nav.model";
import { EventModel } from "../models/events.model";
import { navSchema } from "../validations/nav.validation";

// GET /nav - Get navigation settings
export const getVotingState = async (req: Request, res: Response) => {
    try {
        const nav = await NavModel.findOne();

        if (!nav) {
            return res.status(200).json({
                success: true,
                data: false,
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
export const createVotingState = async (req: Request, res: Response) => {
    try {
        const validation = navSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        // Always delete existing nav settings
        await NavModel.deleteMany({});

        // Create new nav settings
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

// GET /nav/items - Get all navigation info
export const getAllNavInfo = async (req: Request, res: Response) => {
    try {
        const nav = await NavModel.findOne().select("showVoting");

        if (!nav) {
            return res.status(200).json({
                success: true,
                data: false,
                message: "Navigation settings not found"
            });
        }

        // Get all events with their seasons populated
        const events = await EventModel.find().populate('seasons');

        console.log(events);

        // Process events into self and partner categories
        const selfEvents = [];
        const partnerEvents = [];

        for (const event of events) {
            if (event.seasons && event.seasons.length > 0) {
                // Cast seasons to any to access properties
                const seasons = event.seasons as any[];

                // Filter for ended seasons and sort by year descending to get the latest ended season
                const endedSeasons = seasons
                    .filter((season: any) => season.status === 'ended')
                    .sort((a: any, b: any) => b.year - a.year);

                if (endedSeasons.length > 0) {
                    const latestEndedSeason = endedSeasons[0];

                    const eventItem = {
                        label: event.name,
                        slug: latestEndedSeason.slug
                    };

                    if (event.managedBy === 'self') {
                        selfEvents.push(eventItem);
                    } else if (event.managedBy === 'partner') {
                        partnerEvents.push(eventItem);
                    }
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