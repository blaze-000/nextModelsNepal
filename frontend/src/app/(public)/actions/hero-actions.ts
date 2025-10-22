"use server";

import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import { appRouter } from "../../../../../backend/src/api/router";
/**
 * Server Action to fetch hero landing data
 *
 * This uses server-side ORPC client for optimal performance
 * No HTTP request - direct function call
 */
export async function getHeroLanding() {
    const headersList = await headers();

    // Create server-side client with context
    const client = createRouterClient(appRouter, {
        context: {
            req: {
                headers: Object.fromEntries(headersList.entries()),
            } as any,
            res: {} as any,
            admin: null,
            authToken: null,
        },
    });

    return await client.hero.getLanding();
}

export async function getNavMenu() {
    const headersList = await headers();

    const client = createRouterClient(appRouter, {
        context: {
            req: {
                headers: Object.fromEntries(headersList.entries()),
            } as any,
            res: {} as any,
            admin: null,
            authToken: null,
        },
    });

    return await client.nav.getNavMenu();
}
