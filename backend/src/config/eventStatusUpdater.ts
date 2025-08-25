// This program is responsible for automatic updating of status of events:
// upcoming -> ongoing -> ended
// and managing voting status

import cron from "node-cron";
import { SeasonModel } from "../models/events.model"

async function updateSeasonStatuses(): Promise<void> {
    const now = new Date();

    // Update upcoming seasons that should start now
    const upcomingResult = await SeasonModel.updateMany(
        { status: "upcoming", startDate: { $lte: now } },
        { $set: { status: "ongoing" } }
    );

    // Update ongoing seasons that should end now
    const ongoingResult = await SeasonModel.updateMany(
        { status: "ongoing", endDate: { $lte: now } },
        { $set: { status: "ended" } }
    );

    // First, let's find ALL seasons to understand what we're working with
    const allSeasons = await SeasonModel.find({});
    console.log(`[${new Date().toISOString()}] Total seasons in database: ${allSeasons.length}`);

    // Now find seasons that match our criteria
    const seasonsToCloseVoting = await SeasonModel.find({
        votingOpened: true
    });

    console.log(`[${new Date().toISOString()}] Found ${seasonsToCloseVoting.length} seasons with votingOpened=true:`);
    seasonsToCloseVoting.forEach(season => {
        // Check if votingEndDate exists before trying to process it
        if (season.votingEndDate) {
            const votingEndDate = new Date(season.votingEndDate);
            const votingEndDateMs = votingEndDate.getTime();
            const nowMs = now.getTime();
            const isVotingEndDatePassed = votingEndDateMs <= nowMs;
        } else {
            console.log(`  - Season ID: ${season._id} has no votingEndDate set`);
        }
    });

    // Now update them
    const votingResult = await SeasonModel.updateMany(
        { votingOpened: true, votingEndDate: { $lte: now } },
        { $set: { votingOpened: false } }
    );
    console.log(`[${new Date().toISOString()}] Updated ${votingResult.modifiedCount} seasons to close voting`);
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