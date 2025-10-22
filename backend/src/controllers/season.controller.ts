import { Request, Response } from "express";
import { SeasonModel, EventModel } from '../models/events.model.js';
import {
  createSeasonSchema,
  updateSeasonSchema,
} from '../validations/season.validation.js';
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Consistent helper from model.controller
const deleteImageFiles = (imagePaths: string[]) => {
  imagePaths.forEach((imagePath) => {
    if (imagePath) {
      // Handle both relative and absolute paths
      let filename = imagePath;
      if (imagePath.startsWith('/uploads/')) {
        filename = path.basename(imagePath);
      } else if (imagePath.includes('/')) {
        filename = path.basename(imagePath);
      }

      const fullPath = path.join(process.cwd(), "uploads", filename);

      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
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
    const files = req.files as any;
    if (!files || (Array.isArray(files) && !files.find(f => f.fieldname === 'image')) || (!Array.isArray(files) && !files.image)) {
      return res.status(400).json({
        success: false,
        message: "Main image is required",
      });
    }

    // Get file paths - handle both array and object formats
    let image: string;
    let posterImage: string | undefined;
    const galleryImages: string[] = [];
    let processedTimeline = validatedData.timeline;

    if (Array.isArray(files)) {
      // Handle array format from upload.any()
      const imageFile = files.find(f => f.fieldname === 'image');
      if (imageFile) {
        image = `/uploads/${path.basename(imageFile.path)}`;
      } else {
        return res.status(400).json({
          success: false,
          message: "Main image is required",
        });
      }

      const posterFile = files.find(f => f.fieldname === 'posterImage');
      if (posterFile) {
        posterImage = `/uploads/${path.basename(posterFile.path)}`;
      }

      // Process gallery images
      const galleryFiles = files.filter(f => f.fieldname === 'gallery');
      galleryFiles.forEach((file: any) => {
        galleryImages.push(`/uploads/${path.basename(file.path)}`);
      });

      // Process timeline icon files
      let processedTimeline = validatedData.timeline;
      if (validatedData.timeline && Array.isArray(validatedData.timeline)) {
        // Production: Processing timeline for create
        // Production: Files received

        processedTimeline = validatedData.timeline.map((item, index) => {
          // Production: Processing timeline item
          const timelineIconFile = files.find(f => f.fieldname === `timelineIcon_${index}`);
          console.log(`Timeline icon file for index ${index}:`, timelineIconFile);

          if (timelineIconFile) {
            return {
              ...item,
              icon: `/uploads/${path.basename(timelineIconFile.path)}`
            };
          }
          // Production: Final timeline item
          return item;
        });
      }
    } else {
      // Handle object format (fallback)
      image = `/uploads/${path.basename(files.image[0].path)}`;
      posterImage = files.posterImage
        ? `/uploads/${path.basename(files.posterImage[0].path)}`
        : undefined;

      // Process gallery images
      if (files.gallery) {
        const galleryFiles = Array.isArray(files.gallery)
          ? files.gallery
          : [files.gallery];
        galleryFiles.forEach((file: any) => {
          galleryImages.push(`/uploads/${path.basename(file.path)}`);
        });
      }

      // Process timeline icon files
      let processedTimeline = validatedData.timeline;
      if (validatedData.timeline && Array.isArray(validatedData.timeline)) {
        processedTimeline = validatedData.timeline.map((item, index) => {
          const timelineIconKey = `timelineIcon_${index}`;
          if (files[timelineIconKey]) {
            return {
              ...item,
              icon: `/uploads/${path.basename(files[timelineIconKey][0].path)}`
            };
          }
          return item;
        });
      }
    }

    // Create season with file paths
    const seasonData = {
      ...validatedData,
      image,
      ...(posterImage && { posterImage }),
      ...(galleryImages.length > 0 && { gallery: galleryImages }),
      ...(processedTimeline && { timeline: processedTimeline }),
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
 * Get Season by Slug : It only returns ended seasons of the event and its event details
 */
export const getSeasonBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: "Invalid season slug" });
    }

    const season = await SeasonModel.findOne({ slug, status: "ended" })
      .populate({
        path: "eventId",
        populate: {
          path: "seasons",
          select: "year slug",
          match: { status: "ended" }
        }
      }) // Populate parent event with all details and its ended children's year and slug
      .populate("winners")
      .populate("jury")
      .populate("sponsors")

    if (!season) {
      return res
        .status(404)
        .json({ success: false, message: "Season not found" });
    }

    res.json({ success: true, data: season });
  } catch (error) {
    console.error("Get season by slug error:", error);
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

    // Ensure image field is always included in update data
    if (existingSeason.image) {
      updateData.image = existingSeason.image;
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

    // Handle gallery images (even when no new files are uploaded)
    if (retainGallery !== undefined) {
      let images = [...(existingSeason.gallery || [])];

      // Handle retainGallery (same as retainImages in model)
      const toDelete = images.filter((img) => !retainGallery.includes(img));
      if (toDelete.length) deleteImageFiles(toDelete);
      images = retainGallery;

      // Append any newly uploaded gallery images
      if (req.files) {
        const files = req.files as any;
        if (Array.isArray(files)) {
          const galleryFiles = files.filter(f => f.fieldname === 'gallery');
          const newImages = galleryFiles.map((file: any) => `/uploads/${path.basename(file.path)}`);
          images = [...images, ...newImages];
        } else if (files.gallery) {
          const newImages = Array.isArray(files.gallery)
            ? files.gallery.map((file: any) => `/uploads/${path.basename(file.path)}`)
            : [`/uploads/${path.basename(files.gallery.path)}`];
          images = [...images, ...newImages];
        }
      }

      updateData.gallery = images;
    }

    if (req.files) {
      const files = req.files as any;

      // Handle files from upload.any() which returns an array
      if (Array.isArray(files) && files.length > 0) {
        // Find the main image file
        const imageFile = files.find(f => f.fieldname === 'image');
        if (imageFile) {
          if (existingSeason.image) {
            deleteImageFiles([existingSeason.image]);
          }
          updateData.image = `/uploads/${path.basename(imageFile.path)}`;
        }
      } else if (files.image && files.image.length > 0) {
        // Fallback for object format
        if (existingSeason.image) {
          deleteImageFiles([existingSeason.image]);
        }
        updateData.image = `/uploads/${path.basename(files.image[0].path)}`;
      }

      // Handle poster image
      if (Array.isArray(files)) {
        const posterFile = files.find(f => f.fieldname === 'posterImage');
        if (posterFile) {
          if (existingSeason.posterImage) {
            deleteImageFiles([existingSeason.posterImage]);
          }
          updateData.posterImage = `/uploads/${path.basename(posterFile.path)}`;
        }
      } else if (files.posterImage) {
        if (existingSeason.posterImage) {
          deleteImageFiles([existingSeason.posterImage]);
        }
        updateData.posterImage = `/uploads/${path.basename(files.posterImage[0].path)}`;
      }
    }

    // Process timeline icon files
    if (validatedData.timeline && Array.isArray(validatedData.timeline)) {
      // Production: Processing timeline for update
      // Production: Files received for update

      const processedTimeline = validatedData.timeline.map((item, index) => {
        // Production: Processing timeline item for update

        if (req.files) {
          const files = req.files as any;
          if (Array.isArray(files)) {
            const timelineIconFile = files.find(f => f.fieldname === `timelineIcon_${index}`);
            // Production: Timeline icon file for update
            if (timelineIconFile) {
              // Delete old timeline icon if it exists
              if (existingSeason.timeline && existingSeason.timeline[index] && existingSeason.timeline[index].icon) {
                deleteImageFiles([existingSeason.timeline[index].icon]);
              }
              return {
                ...item,
                icon: `/uploads/${path.basename(timelineIconFile.path)}`
              };
            }
          } else if (files[`timelineIcon_${index}`]) {
            // Delete old timeline icon if it exists
            if (existingSeason.timeline && existingSeason.timeline[index] && existingSeason.timeline[index].icon) {
              deleteImageFiles([existingSeason.timeline[index].icon]);
            }
            return {
              ...item,
              icon: `/uploads/${path.basename(files[`timelineIcon_${index}`][0].path)}`
            };
          }
        }
        // Production: Final timeline item
        return item;
      });
      updateData.timeline = processedTimeline;
    }

    const updatedSeason = await SeasonModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false, // Disable validators for updates since we handle validation manually
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
      .populate("eventId", "name overview coverImage") // Populate event with name, overview, and coverImage
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
 * Get One Earliest Upcoming Event
 */
export const getEarliestUpcomingEvent = async (req: Request, res: Response) => {
  try {
    // Filter for upcoming seasons and get the earliest one
    const earliestUpcomingSeason = await SeasonModel.findOne({ status: "upcoming" })
      .populate("eventId", "name overview") // Populate event with name, overview, and coverImage
      .populate("criteria")
      .populate("auditions")
      .sort({ startDate: 1 }) // Sort by startDate ascending to get the earliest upcoming
      .limit(1);

    if (!earliestUpcomingSeason) {
      return res.json({
        success: true,
        message: "No upcoming event",
        data: null
      });
    }

    res.json({
      success: true,
      data: earliestUpcomingSeason
    });
  } catch (error) {
    console.error("Get earliest upcoming event error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch earliest upcoming event" });
  }
};

/**
 * Get all events that are opened for voting
 */
export const getVotingEvents = async (req: Request, res: Response) => {
  try {
    // First filter seasons that have status: ongoing
    // Then find seasons that have voting: on
    const votingSeasons = await SeasonModel.find({
      status: "ongoing",
      votingOpened: true
    }).populate("eventId", "name titleImage");

    // Transform data to include parent event's name, titleImage, and season's slug
    const votingEvents = votingSeasons.map(season => {
      const eventData = season.eventId as any; // Type assertion for populated field
      return {
        eventName: eventData.name,
        image: season.image,
        slug: season.slug
      };
    });

    res.json({ success: true, data: votingEvents });
  } catch (error) {
    console.error("Get voting events error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch voting events" });
  }
};

/**
 * Get details of a voting season
 */
export const getVotingSeasonDetails = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const season = await SeasonModel.findOne({ slug, status: "ongoing" })
      .populate("eventId", "name")
      .populate("contestants");

    if (!season) {
      return res.status(404).json({ success: false, message: "Voting season not found" });
    }

    // Filter out eliminated contestants
    const activeContestants = (season as any).contestants?.filter((contestant: any) =>
      contestant.status.toLowerCase() !== "eliminated"
    ) || [];

    // Transform data to include parent event's name, voting_end_time, season's image
    const seasonData = season.toObject();
    const votingSeasonDetails = {
      eventName: (season.eventId as any)?.name,
      ...seasonData,
      contestants: activeContestants // Override the original contestants with filtered ones
    };

    res.json({ success: true, data: votingSeasonDetails });
  } catch (error) {
    console.error("Get voting season details error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch voting season details" });
  }
};