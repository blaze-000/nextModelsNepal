import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "../../../backend/src/api/router";

/**
 * ⚠️ IMPORTANT: Separate Backend Architecture
 *
 * Since our backend is a separate Express server (not co-located with Next.js),
 * we CANNOT use `createRouterClient` for SSR optimization. That pattern only
 * works when the router is in the same project.
 *
 * Instead, we use HTTP (RPCLink) for both SSR and client-side:
 * - Both SSR and Browser: http://localhost:8000/api/rpc (direct backend connection)
 *
 * This approach still provides:
 * ✅ Full type safety
 * ✅ Automatic type inference
 * ✅ Zero configuration
 *
 * Trade-off: SSR requests go over HTTP (minimal overhead on localhost)
 *
 * @see https://github.com/unnoq/orpc/blob/main/apps/content/docs/adapters/next.md
 */

const API_URL = "http://localhost:8000";

/**
 * HTTP-based RPC link for both SSR and client-side requests
 *
 * Both SSR and browser use direct backend connection (localhost:8000)
 */
const link = new RPCLink({
    url: () => {
        // Both SSR and browser: Direct backend connection
        return `${API_URL}/api/rpc`;
    },
    headers: async () => {
        // For SSR, we need to forward cookies from the Next.js request
        if (typeof window === "undefined") {
            try {
                const { headers } = await import("next/headers");
                const headersList = await headers();
                const cookie = headersList.get("cookie");
                return cookie ? { cookie } : {};
            } catch {
                return {};
            }
        }

        // Browser: Auth handled via credentials: 'include'
        return {};
    },
    fetch: (request, init) => {
        return globalThis.fetch(request, {
            ...init,
            credentials: "include", // Include cookies for auth
            cache: typeof window === "undefined" ? "no-store" : undefined, // SSR: disable cache
        });
    },
});

/**
 * Type-safe ORPC client for separate backend architecture
 *
 * **How it works:**
 * - Both SSR and Browser: Direct HTTP to backend at localhost:8000
 *
 * **Benefits:**
 * - ✅ Full end-to-end type safety
 * - ✅ Automatic type inference from backend router
 * - ✅ Same API for server and client
 * - ✅ Cookie forwarding for auth
 *
 * **Usage:**
 * ```tsx
 * // Server Component (SSR)
 * const heroData = await orpc.hero.getLanding();
 *
 * // Server Action
 * 'use server'
 * export async function updateHero() {
 *   return await orpc.hero.update(data);
 * }
 *
 * // Client Component (with TanStack Query)
 * 'use client'
 * const { data } = useQuery(orpcQuery.hero.getLanding.queryOptions());
 * ```
 *
 * @see https://github.com/unnoq/orpc/blob/main/apps/content/docs/adapters/next.md
 */
export const orpc: RouterClient<AppRouter> = createORPCClient(link);
