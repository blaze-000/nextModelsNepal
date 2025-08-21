// This program is responsible for automatic updating of status of events:
// upcoming -> ongoing -> ended

import cron from "node-cron";
import { SeasonModel } from "../models/events.model"

async function updateSeasonStatuses(): Promise<void> {
    const now = new Date();
    
    await SeasonModel.updateMany(
        { status: "upcoming", startDate: { $lte: now } },
        { $set: { status: "ongoing" } }
    );

    await SeasonModel.updateMany(
        { status: "ongoing", endDate: { $lt: now } },
        { $set: { status: "ended" } }
    );
    console.log("Season statuses updated at", now.toISOString());
}

// Skip scheduling when running tests or when explicitly asked to skip
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
    cron.schedule("0 0 * * *", () => {
        updateSeasonStatuses().catch(console.error);
    });
    console.log("Season status updater cron started");
} else {
    console.log('Skipping season status updater cron in test environment or under Jest');
}
