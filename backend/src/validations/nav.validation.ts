import { z } from 'zod';

/**
 * ✅ ORPC Best Practice: Define schemas inline in procedures
 * This file is kept for backward compatibility with legacy REST routes
 * but new ORPC procedures should define schemas inline.
 */

// Nav settings schema (for legacy REST routes)
export const navSchema = z.object({
    showVoting: z.boolean().default(true),
});

