import { baseProcedure } from '../base.js';
import { requireAdminMiddleware } from '../middleware/auth.middleware.js';
import { HeroService } from '../../services/hero.service.js';
import { z } from 'zod';
import { ImageFileSchema } from '@nextmodels/shared-types';

/**
 * Hero Procedures - Thin API Layer
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
 * All business logic is delegated to HeroService.
 */

// Inline Zod Schemas (ORPC will infer types from these)
const HeroGallerySchema = z.object({
  titleImage: z.string(),
  image_1: z.string(),
  image_2: z.string(),
  image_3: z.string(),
  image_4: z.string(),
});

const HeroLandingSchema = z.object({
  hero: HeroGallerySchema.nullable(),
  upcoming: z.boolean(),
  ongoing: z.boolean(),
});

const HeroGalleryUploadSchema = z.object({
  titleImage: ImageFileSchema,
  image_1: ImageFileSchema.optional(),
  image_2: ImageFileSchema.optional(),
  image_3: ImageFileSchema.optional(),
  image_4: ImageFileSchema.optional(),
});

const HeroGalleryUpdateSchema = z.object({
  titleImage: ImageFileSchema.optional(),
  image_1: ImageFileSchema.optional(),
  image_2: ImageFileSchema.optional(),
  image_3: ImageFileSchema.optional(),
  image_4: ImageFileSchema.optional(),
  removedTitleImage: z.boolean().optional(),
  removedExistingIndices: z.array(z.number()).optional(),
});

export const heroRouter = {
  /**
   * Get hero landing data (public)
   * 
   * Output type is automatically inferred by ORPC
   */
  getLanding: baseProcedure
    .output(HeroLandingSchema)
    .handler(async () => {
      return await HeroService.getLanding();
    }),

  /**
   * Create hero gallery (admin only)
   * 
   * Input/output types automatically inferred by ORPC
   */
  create: baseProcedure
    .use(requireAdminMiddleware)
    .input(HeroGalleryUploadSchema)
    .output(HeroGallerySchema)
    .handler(async ({ input }) => {
      return await HeroService.create(input);
    }),

  /**
   * Update hero gallery (admin only)
   * 
   * Input/output types automatically inferred by ORPC
   */
  update: baseProcedure
    .use(requireAdminMiddleware)
    .input(HeroGalleryUpdateSchema)
    .output(HeroGallerySchema)
    .handler(async ({ input }) => {
      return await HeroService.update(input);
    }),

  /**
   * Delete hero gallery (admin only)
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
      return await HeroService.delete(input.id);
    }),
};

export type HeroRouter = typeof heroRouter;
