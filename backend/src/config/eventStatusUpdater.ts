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

cron.schedule("0 0 * * *", () => {
    updateSeasonStatuses().catch(console.error);
});

console.log("Season status updater cron started");
