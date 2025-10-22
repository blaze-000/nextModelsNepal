import { z } from 'zod';

/**
 * ✅ REUSABLE BUILDING BLOCK
 * 
 * This is the ONLY thing that belongs in @shared-types:
 * A reusable Zod validator used by MULTIPLE procedures.
 * 
 * All API-specific schemas (HeroGalleryUploadSchema, etc.)
 * should be defined INLINE in procedures, not here.
 * 
 * @see ORPC_TYPE_INFERENCE_GUIDE.md
 */

/**
 * Zod schema for image file uploads
 * Supports: PNG, JPEG, WebP, SVG
 */
export const ImageFileSchema = z
    .file()
    .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: 'File size must be less than 10MB',
    })
    .refine(
        (file) => {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
            return validTypes.includes(file.type);
        },
        {
            message: 'File must be an image (PNG, JPEG, WebP, or SVG)',
        }
    );

/**
 * Optional image file schema
 */
export const OptionalImageFileSchema = ImageFileSchema.optional();


