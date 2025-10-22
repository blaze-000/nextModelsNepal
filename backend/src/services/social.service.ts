import { ORPCError } from '@orpc/server';
import { socialModel } from '../models/social.model.js';

const INTERNAL_ERROR = 'INTERNAL_SERVER_ERROR' as const;

/**
 * Social Service - Business Logic Layer
 * 
 * Handles all social settings operations:
 * - Database queries for social links and contact info
 * - Singleton pattern (only one document allowed)
 * - Data validation
 * 
 * Keep procedures thin by delegating all logic here.
 * Makes code testable, reusable, and maintainable.
 */

export class SocialService {
  /**
   * Get social settings (singleton - returns first document)
   */
  static async get() {
    try {
      const social = await socialModel.findOne().lean().exec();

      if (!social) {
        return null;
      }

      return {
        _id: social._id.toString(),
        instagram: social.instagram,
        x: social.x,
        fb: social.fb,
        linkdln: social.linkdln,
        phone: social.phone,
        mail: social.mail,
        location: social.location,
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to load social settings');
    }
  }

  /**
   * Create or update social settings (singleton pattern)
   * If settings exist, updates them. If not, creates new.
   */
  static async createOrUpdate(input: {
    instagram: string;
    x: string;
    fb: string;
    linkdln: string;
    phone: string[];
    mail: string;
    location: string;
  }) {
    try {
      // Check if social settings already exist
      const existing = await socialModel.findOne();

      if (existing) {
        // Update existing
        const updated = await socialModel.findByIdAndUpdate(
          existing._id,
          input,
          { new: true, runValidators: true }
        );

        if (!updated) {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            message: 'Failed to update social settings',
          });
        }

        return this.formatSocialResponse(updated);
      } else {
        // Create new
        const social = await socialModel.create(input);
        return this.formatSocialResponse(social);
      }
    } catch (error) {
      if (error instanceof ORPCError) throw error;
      throw this.handleError(error, 'Failed to save social settings');
    }
  }

  /**
   * Delete social settings by ID
   */
  static async delete(id: string) {
    try {
      const social = await socialModel.findByIdAndDelete(id);

      if (!social) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Social settings not found',
        });
      }

      return { 
        success: true, 
        message: 'Social settings deleted successfully' 
      };
    } catch (error) {
      if (error instanceof ORPCError) throw error;
      throw this.handleError(error, 'Failed to delete social settings');
    }
  }

  /**
   * Format social response
   */
  private static formatSocialResponse(social: any) {
    return {
      _id: social._id.toString(),
      instagram: social.instagram,
      x: social.x,
      fb: social.fb,
      linkdln: social.linkdln,
      phone: social.phone,
      mail: social.mail,
      location: social.location,
    };
  }

  /**
   * Centralized error handling
   */
  private static handleError(error: unknown, message: string) {
    console.error(`[SocialService] ${message}:`, error);

    return new ORPCError(INTERNAL_ERROR, {
      message,
      cause: error instanceof Error ? error : undefined,
    });
  }
}
