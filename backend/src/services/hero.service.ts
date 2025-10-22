import { ORPCError } from '@orpc/server';
import { HeroModel } from '../models/hero.model.js';
import { SeasonModel } from '../models/events.model.js';
import { processAndSaveFile, deleteFile } from '../utils/fileUpload.js';

const INTERNAL_ERROR = 'INTERNAL_SERVER_ERROR' as const;

/**
 * Hero Service - Business Logic Layer
 * 
 * Handles all hero-related operations:
 * - Database queries
 * - File processing
 * - Data validation
 * 
 * Keep procedures thin by delegating all logic here.
 * Makes code testable, reusable, and maintainable.
 */

export class HeroService {
  /**
   * Get hero landing data with event counts
   */
  static async getLanding() {
    try {
      const [heroDoc, upcomingCount, ongoingCount] = await Promise.all([
        HeroModel.findOne().lean().exec(),
        SeasonModel.countDocuments({ status: 'upcoming' }),
        SeasonModel.countDocuments({ status: 'ongoing' }),
      ]);

      return {
        hero: heroDoc ? {
          titleImage: heroDoc.titleImage,
          image_1: heroDoc.image_1,
          image_2: heroDoc.image_2,
          image_3: heroDoc.image_3,
          image_4: heroDoc.image_4,
        } : null,
        upcoming: upcomingCount > 0,
        ongoing: ongoingCount > 0,
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to load hero section');
    }
  }

  /**
   * Create new hero gallery (only one allowed)
   */
  static async create(input: {
    titleImage: File;
    image_1?: File;
    image_2?: File;
    image_3?: File;
    image_4?: File;
  }) {
    try {
      // Validate only one hero exists
      const existingHero = await HeroModel.findOne();
      if (existingHero) {
        throw new ORPCError('BAD_REQUEST', {
          message: 'Hero item already exists. Only one hero item is allowed.',
        });
      }

      // Process all images
      const images = await this.processImages({
        titleImage: input.titleImage,
        image_1: input.image_1,
        image_2: input.image_2,
        image_3: input.image_3,
        image_4: input.image_4,
      });

      // Save to database
      const hero = await HeroModel.create(images);

      return this.formatHeroResponse(hero);
    } catch (error) {
      if (error instanceof ORPCError) throw error;
      throw this.handleError(error, 'Failed to create hero section');
    }
  }

  /**
   * Update hero gallery with image replacements
   */
  static async update(input: {
    titleImage?: File;
    image_1?: File;
    image_2?: File;
    image_3?: File;
    image_4?: File;
    removedTitleImage?: boolean;
    removedExistingIndices?: number[];
  }) {
    try {
      const existingHero = await HeroModel.findOne();
      if (!existingHero) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Hero item not found',
        });
      }

      // Calculate what to update and what to delete
      const { updateData, filesToDelete } = await this.calculateImageUpdates(
        existingHero,
        input
      );

      // Update database
      const updatedHero = await HeroModel.findByIdAndUpdate(
        existingHero._id,
        updateData,
        { new: true }
      );

      if (!updatedHero) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Hero item not found after update',
        });
      }

      // Clean up old files
      filesToDelete.forEach(deleteFile);

      return this.formatHeroResponse(updatedHero);
    } catch (error) {
      if (error instanceof ORPCError) throw error;
      throw this.handleError(error, 'Failed to update hero section');
    }
  }

  /**
   * Delete hero gallery and cleanup files
   */
  static async delete(heroId: string) {
    try {
      const heroToDelete = await HeroModel.findById(heroId);
      if (!heroToDelete) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Hero item not found',
        });
      }

      // Collect files to delete
      const filesToDelete = [
        heroToDelete.titleImage,
        heroToDelete.image_1,
        heroToDelete.image_2,
        heroToDelete.image_3,
        heroToDelete.image_4,
      ].filter(Boolean);

      // Delete database record
      await HeroModel.findByIdAndDelete(heroId);

      // Clean up files
      filesToDelete.forEach(deleteFile);

      return { success: true, message: 'Hero item deleted successfully' };
    } catch (error) {
      if (error instanceof ORPCError) throw error;
      throw this.handleError(error, 'Failed to delete hero section');
    }
  }

  /**
   * Process multiple images (reusable helper)
   */
  private static async processImages(input: Record<string, File | undefined>) {
    const result: Record<string, string> = {};

    for (const [key, file] of Object.entries(input)) {
      if (file) {
        const processed = await processAndSaveFile(file);
        result[key] = processed.path;
      } else {
        result[key] = '';
      }
    }

    return result;
  }

  /**
   * Calculate which images to update and which files to delete
   */
  private static async calculateImageUpdates(
    existingHero: any,
    input: any
  ) {
    const updateData: Record<string, string> = {};
    const filesToDelete: string[] = [];

    // Handle title image
    if (input.removedTitleImage) {
      if (existingHero.titleImage) {
        filesToDelete.push(existingHero.titleImage);
      }
      updateData.titleImage = '';
    } else if (input.titleImage) {
      if (existingHero.titleImage) {
        filesToDelete.push(existingHero.titleImage);
      }
      const titleImageFile = await processAndSaveFile(input.titleImage);
      updateData.titleImage = titleImageFile.path;
    }

    // Handle gallery images
    const imageFields = ['image_1', 'image_2', 'image_3', 'image_4'] as const;
    const removedIndices = input.removedExistingIndices || [];

    for (let i = 0; i < imageFields.length; i++) {
      const field = imageFields[i];
      const isRemoved = removedIndices.includes(i);
      const newFile = input[field];

      if (isRemoved) {
        const currentImage = existingHero[field];
        if (currentImage) {
          filesToDelete.push(currentImage);
        }
        updateData[field] = '';
      } else if (newFile) {
        const currentImage = existingHero[field];
        if (currentImage) {
          filesToDelete.push(currentImage);
        }
        const processedFile = await processAndSaveFile(newFile);
        updateData[field] = processedFile.path;
      }
    }

    return { updateData, filesToDelete };
  }

  /**
   * Format hero response
   */
  private static formatHeroResponse(hero: any) {
    return {
      titleImage: hero.titleImage,
      image_1: hero.image_1,
      image_2: hero.image_2,
      image_3: hero.image_3,
      image_4: hero.image_4,
    };
  }

  /**
   * Centralized error handling
   */
  private static handleError(error: unknown, message: string) {
    console.error(`[HeroService] ${message}:`, error);

    return new ORPCError(INTERNAL_ERROR, {
      message,
      cause: error instanceof Error ? error : undefined,
    });
  }
}
