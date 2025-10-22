"use server";

import { orpc } from "@/lib/orpc-client";
import { InferRouterOutputs } from "@orpc/server";
import { appRouter } from "../../../../../backend/src/api/router";

/**
 * Server Action: Get hero landing data
 *
 * This uses the shared ORPC client which automatically:
 * - Uses HTTP client (since SSR optimization is disabled)
 * - Provides full type safety
 * - Handles errors properly
 */
export async function getHeroLanding() {
    return await orpc.hero.getLanding();
}
export type HeroLanding = InferRouterOutputs<
    typeof appRouter
>["hero"]["getLanding"];
