// This program is responsible for automatic updating of status of events:
// upcoming -> ongoing -> ended

import cron from "node-cron";
import { SeasonModel } from "../models/events.model"

async function updateSeasonStatuses(): Promise<void> {
    const now = new Date();
    console.log(`[${new Date().toISOString()}] Running season status updater. Current time: ${now.toISOString()}`);
    
    // Update upcoming seasons that should start now
    const upcomingResult = await SeasonModel.updateMany(
        { status: "upcoming", startDate: { $lte: now } },
        { $set: { status: "ongoing" } }
    );
    console.log(`[${new Date().toISOString()}] Updated ${upcomingResult.modifiedCount} upcoming seasons to ongoing`);

    // Update ongoing seasons that should end now
    const ongoingResult = await SeasonModel.updateMany(
        { status: "ongoing", endDate: { $lte: now } },
        { $set: { status: "ended" } }
    );
    console.log(`[${new Date().toISOString()}] Updated ${ongoingResult.modifiedCount} ongoing seasons to ended`);
    // Production: Season statuses updated
}

// Skip scheduling when running tests or when explicitly asked to skip
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
    // Run every hour instead of daily to be more responsive
    cron.schedule("0 * * * *", () => {
        updateSeasonStatuses().catch(error => {
            console.error(`[${new Date().toISOString()}] Error in season status updater:`, error);
        });
    });
    console.log(`[${new Date().toISOString()}] Season status updater cron scheduled to run every hour`);
    // Production: Season status updater cron started
} else {
    // Production: Skipping season status updater in test environment
}