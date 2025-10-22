import { baseProcedure } from '../base.js';
import { requireAdminMiddleware } from '../middleware/auth.middleware.js';
import { SocialService } from '../../services/social.service.js';
import { z } from 'zod';

/**
 * Social Procedures - Thin API Layer
 * 
 * ✅ ORPC Best Practice:
 * - Define schemas INLINE (single source of truth)
 * - ORPC automatically infers types for frontend
 * - No manual type syncing needed
 * 
 * Procedures are kept lean:
 * - Input validation (Zod schemas)
 * - Authorization (middleware)
 * - Call service
 * - Return data (ORPC infers output types)
 * 
 * All business logic is delegated to SocialService.
 */

// Inline Zod Schemas (ORPC will infer types from these)
const SocialSchema = z.object({
  _id: z.string(),
  instagram: z.string(),
  x: z.string(),
  fb: z.string(),
  linkdln: z.string(),
  phone: z.array(z.string()),
  mail: z.string(),
  location: z.string(),
});

const SocialInputSchema = z.object({
  instagram: z.string(),
  x: z.string(),
  fb: z.string(),
  linkdln: z.string(),
  phone: z.array(z.string()),
  mail: z.string().email(),
  location: z.string(),
});

export const socialRouter = {
  /**
   * Get social settings (public)
   * 
   * Output type is automatically inferred by ORPC
   */
  get: baseProcedure
    .output(SocialSchema.nullable())
    .handler(async () => {
      return await SocialService.get();
    }),

  /**
   * Create or update social settings (admin only)
   * Singleton pattern: only one social document allowed
   * 
   * Input/output types automatically inferred by ORPC
   */
  createOrUpdate: baseProcedure
    .use(requireAdminMiddleware)
    .input(SocialInputSchema)
    .output(SocialSchema)
    .handler(async ({ input }) => {
      return await SocialService.createOrUpdate(input);
    }),

  /**
   * Delete social settings (admin only)
   * 
   * Input/output types automatically inferred by ORPC
   */
  delete: baseProcedure
    .use(requireAdminMiddleware)
    .input(z.object({ id: z.string() }))
    .output(z.object({
      success: z.boolean(),
      message: z.string()
    }))
    .handler(async ({ input }) => {
      return await SocialService.delete(input.id);
    }),
};

export type SocialRouter = typeof socialRouter;
