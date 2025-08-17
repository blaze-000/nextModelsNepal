import { Request, Response } from "express";
import { SeasonModel, EventModel } from "../models/events.model";
import {
  createSeasonSchema,
  updateSeasonSchema,
} from "../validations/season.validation";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Consistent helper from model.controller
const deleteImageFiles = (imagePaths: string[]) => {
  imagePaths.forEach((imagePath) => {
    if (imagePath) {
      const fullPath = path.join(
        process.cwd(),
        "uploads",
        path.basename(imagePath)
      );
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  });
};

/**
 * Create Season under an existing Event
 */
export const createSeason = async (req: Request, res: Response) => {
  try {
    // Parse JSON fields from FormData
    const requestData = { ...req.body };

    // Parse notice array if present
    if (requestData.notice && typeof requestData.notice === "string") {
      try {
        requestData.notice = JSON.parse(requestData.notice);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid notice format" });
      }
    }

    // Parse timeline array if present
    if (requestData.timeline && typeof requestData.timeline === "string") {
      try {
        requestData.timeline = JSON.parse(requestData.timeline);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid timeline format" });
      }
    }

    // Parse gallery array if present (though this comes as files)
    if (requestData.gallery && typeof requestData.gallery === "string") {
      try {
        requestData.gallery = JSON.parse(requestData.gallery);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid gallery format" });
      }
    }

    // Validate text fields
    const validatedData = createSeasonSchema.parse(requestData);

    if (!mongoose.Types.ObjectId.isValid(validatedData.eventId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID format" });
    }

    const eventExists = await EventModel.exists({ _id: validatedData.eventId });
    if (!eventExists) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if required image was uploaded
    if (!req.files || !(req.files as any).image) {
      return res.status(400).json({
        success: false,
        message: "Main image is required",
      });
    }

    // Get file paths
    const image = (req.files as any).image[0].path;
    const posterImage = (req.files as any).posterImage
      ? (req.files as any).posterImage[0].path
      : undefined;

    // Process gallery images
    const galleryImages: string[] = [];
    if ((req.files as any).gallery) {
      const galleryFiles = Array.isArray((req.files as any).gallery)
        ? (req.files as any).gallery
        : [(req.files as any).gallery];
      galleryFiles.forEach((file: any) => {
        galleryImages.push(file.path);
      });
    }

    // Create season with file paths
    const seasonData = {
      ...validatedData,
      image,
      ...(posterImage && { posterImage }),
      ...(galleryImages.length > 0 && { gallery: galleryImages }),
    };

    const season = await SeasonModel.create(seasonData);

    // Manually ensure the event-seasons relationship is maintained
    try {
      await EventModel.findByIdAndUpdate(validatedData.eventId, {
        $addToSet: { seasons: season._id },
      });
    } catch (error) {
      console.error(`Error manually updating event:`, error);
    }

    res.status(201).json({ success: true, data: season });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create season error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get Seasons by Event ID
 */
export const getSeasonsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      page = 1,
      limit = 10,
      status,
      sort = "year",
      order = "desc",
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID format" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = { eventId };
    if (status && ["upcoming", "ongoing", "ended"].includes(String(status))) {
      filter.status = status;
    }

    const seasons = await SeasonModel.find(filter)
      .populate("contestants")
      .populate("winners")
      .populate("jury")
      .populate("sponsors")
      .populate("criteria")
      .populate("auditions")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await SeasonModel.countDocuments(filter);

    res.json({
      success: true,
      data: seasons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get seasons by event error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch seasons" });
  }
};

/**
 * Get All Seasons (with optional filtering)
 */
export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      eventId,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = {};
    if (status && ["upcoming", "ongoing", "ended"].includes(String(status))) {
      filter.status = status;
    }
    if (eventId && mongoose.Types.ObjectId.isValid(String(eventId))) {
      filter.eventId = eventId;
    }

    const seasons = await SeasonModel.find(filter)
      .populate("eventId", "name overview") // Populate event with name and overview
      .populate("contestants")
      .populate("winners")
      .populate("jury")
      .populate("sponsors")
      .populate("criteria")
      .populate("auditions")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await SeasonModel.countDocuments(filter);

    res.json({
      success: true,
      data: seasons,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get all seasons error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch seasons" });
  }
};

/**
 * Get Season by ID
 */
export const getSeasonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid season ID format" });
    }

    const season = await SeasonModel.findById(id)
      .populate("contestants")
      .populate("winners")
      .populate("jury")
      .populate("sponsors")
      .populate("criteria")
      .populate("auditions");

    if (!season) {
      return res
        .status(404)
        .json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, data: season });
  } catch (error) {
    console.error("Get season by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch season" });
  }
};

/**
 * Update Season by ID
 */
export const updateSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid season ID format" });
    }

    // Get existing season to check for old images
    const existingSeason = await SeasonModel.findById(id);
    if (!existingSeason) {
      return res
        .status(404)
        .json({ success: false, message: "Season not found" });
    }

    // Parse JSON fields from FormData
    const requestData = { ...req.body };

    // Parse notice array if present
    if (requestData.notice && typeof requestData.notice === "string") {
      try {
        requestData.notice = JSON.parse(requestData.notice);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid notice format" });
      }
    }

    // Parse timeline array if present
    if (requestData.timeline && typeof requestData.timeline === "string") {
      try {
        requestData.timeline = JSON.parse(requestData.timeline);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid timeline format" });
      }
    }

    // Validate text fields
    const validatedData = updateSeasonSchema.parse(requestData);

    // Handle image uploads
    const updateData: any = { ...validatedData };

    if (req.files) {
      const files = req.files as any;

      // Update only the images that were uploaded and delete old ones
      if (files.image) {
        if (existingSeason.image) {
          deleteImageFiles([existingSeason.image]);
        }
        updateData.image = files.image[0].path;
      }

      if (files.posterImage) {
        if (existingSeason.posterImage) {
          deleteImageFiles([existingSeason.posterImage]);
        }
        updateData.posterImage = files.posterImage[0].path;
      }

      // Gallery images: retain/delete + append new
      // Accept retainGallery as JSON array of existing gallery paths to keep
      let retainGallery: string[] | undefined;
      try {
        if (typeof (req.body as any).retainGallery === "string") {
          retainGallery = JSON.parse((req.body as any).retainGallery);
        } else if (Array.isArray((req.body as any).retainGallery)) {
          retainGallery = (req.body as any).retainGallery as string[];
        }
      } catch (_) {
        retainGallery = undefined;
      }

      // Strictly match model controller logic for gallery images
      let images = [...(existingSeason.gallery || [])];

      // Handle retainGallery (same as retainImages in model)
      if (retainGallery) {
        const toDelete = images.filter((img) => !retainGallery.includes(img));
        if (toDelete.length) deleteImageFiles(toDelete);
        images = retainGallery;
      }

      // Append any newly uploaded gallery images
      if (files.gallery) {
        const newImages = Array.isArray(files.gallery)
          ? files.gallery.map(
              (file: any) => `/uploads/${path.basename(file.path)}`
            )
          : [`/uploads/${path.basename(files.gallery.path)}`];
        images = [...images, ...newImages];
      }

      updateData.gallery = images;
    }

    const updatedSeason = await SeasonModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeason) {
      return res
        .status(404)
        .json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, data: updatedSeason });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update season error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Season by ID
 */
export const deleteSeason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid season ID format" });
    }

    const season = await SeasonModel.findById(id);
    if (!season) {
      return res
        .status(404)
        .json({ success: false, message: "Season not found" });
    }

    // Delete associated image files

    const imagesToDelete = [
      season.image,
    
      season.posterImage,
      ...(season.gallery || []),
    ].filter(Boolean) as string[];
    deleteImageFiles(imagesToDelete);


    const deletedSeason = await SeasonModel.findByIdAndDelete(id);
    if (!deletedSeason) {
      return res
        .status(404)
        .json({ success: false, message: "Season not found" });
    }

    // Manually ensure the event-seasons relationship is updated
    try {
      await EventModel.findByIdAndUpdate(deletedSeason.eventId, {
        $pull: { seasons: deletedSeason._id },
      });
    } catch (error) {
      console.error(`Error manually updating event:`, error);
    }

    res.json({ success: true, message: "Season deleted successfully" });
  } catch (error) {
    console.error("Delete season error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete season" });
  }
};

/**
 * Get All Upcoming Seasons with Event Details
 */
export const getAllUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "startDate",
      order = "asc",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "desc" ? -1 : 1;

    // Filter for upcoming seasons
    const filter = { status: "upcoming" };

    const seasons = await SeasonModel.find(filter)
      .populate("eventId", "name overview") // Populate event with name and overview (no slug)
      .populate("criteria")
      .populate("auditions")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    // Get the latest ended season for each event to get the event slug
    const seasonsWithLatestEnded = await Promise.all(
      seasons.map(async (season) => {
        const latestEndedSeason = await SeasonModel.findOne({
          eventId: season.eventId,
          status: "ended"
        })
          .sort({ endDate: -1 })
          .select("slug");

        return {
          ...season.toObject(),
          eventSlug: latestEndedSeason?.slug || null, // Event slug from latest ended season
          latestEndedSeasonSlug: latestEndedSeason?.slug || null // Latest ended season slug
        };
      })
    );

    const total = await SeasonModel.countDocuments(filter);

    res.json({
      success: true,
      data: seasonsWithLatestEnded,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get all upcoming events error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch upcoming events" });
  }
};

/**
 * Manual sync function to update event seasons arrays
 * This can be used to fix existing data where the relationship is broken
 */
export const syncEventSeasons = async (req: Request, res: Response) => {
  try {
    // Get all seasons
    const seasons = await SeasonModel.find({});

    // Group seasons by eventId
    const seasonsByEvent: { [eventId: string]: string[] } = {};

    seasons.forEach((season) => {
      const eventId = season.eventId.toString();
      if (!seasonsByEvent[eventId]) {
        seasonsByEvent[eventId] = [];
      }
      seasonsByEvent[eventId].push(season._id.toString());
    });

    // Update each event with its seasons
    const updatePromises = Object.entries(seasonsByEvent).map(
      async ([eventId, seasonIds]) => {
        try {
          await EventModel.findByIdAndUpdate(eventId, {
            $set: { seasons: seasonIds },
          });
          return { eventId, success: true, seasonCount: seasonIds.length };
        } catch (error) {
          return {
            eventId,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }
    );

    const results = await Promise.all(updatePromises);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    res.json({
      success: true,
      message: `Sync completed. ${successful.length} events updated successfully, ${failed.length} failed.`,
      results: {
        successful,
        failed,
      },
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync event-seasons relationship",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
