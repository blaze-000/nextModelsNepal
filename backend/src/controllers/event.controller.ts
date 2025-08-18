import { Request, Response } from "express";
import { EventModel } from "../models/events.model";
import { createEventSchema, updateEventSchema } from "../validations/event.validation";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

/**
 * Helper function to safely delete a file
 */
const deleteFile = (filePath: string): void => {
  try {
    if (filePath && filePath.trim() !== "") {
      const fullPath = path.resolve(filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

/**
 * Create Event
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    // Validate text fields
    const validatedData = createEventSchema.parse(req.body);

    // Check if files were uploaded
    if (!req.files ||
      !(req.files as any).titleImage ||
      !(req.files as any).coverImage ||
      !(req.files as any).purposeImage) {
      return res.status(400).json({
        success: false,
        message: "All image files are required"
      });
    }

    // Get file paths
    const titleImage = (req.files as any).titleImage[0].path;
    const coverImage = (req.files as any).coverImage[0].path;
    const purposeImage = (req.files as any).purposeImage[0].path;

    // Create event with file paths
    const eventData = {
      ...validatedData,
      titleImage,
      coverImage,
      purposeImage,
    };

    const newEvent = await EventModel.create(eventData);
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Create event error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Get All Events
 */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search = "",
      managedBy = ""
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = {};

    // Add search filter
    if (search && typeof search === "string") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { overview: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } }
      ];
    }

    // Add managedBy filter
    if (managedBy && typeof managedBy === "string") {
      filter.managedBy = managedBy;
    }

    const events = await EventModel.find(filter)
      .populate("seasons")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await EventModel.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

/**
 * Get Event by ID
 */
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const event = await EventModel.findById(id).populate("seasons");
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update Event
 */
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    // Get existing event to check for old images
    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Validate text fields
    const validatedData = updateEventSchema.parse(req.body);

    // Handle image uploads
    const updateData: any = { ...validatedData };

    if (req.files) {
      const files = req.files as any;

      // Update only the images that were uploaded and delete old ones
      if (files.titleImage) {
        // Delete old title image if it exists
        if (existingEvent.titleImage) {
          deleteFile(existingEvent.titleImage);
        }
        updateData.titleImage = files.titleImage[0].path;
      }
      if (files.coverImage) {
        // Delete old cover image if it exists
        if (existingEvent.coverImage) {
          deleteFile(existingEvent.coverImage);
        }
        updateData.coverImage = files.coverImage[0].path;
      }
      if (files.purposeImage) {
        // Delete old purpose image if it exists
        if (existingEvent.purposeImage) {
          deleteFile(existingEvent.purposeImage);
        }
        updateData.purposeImage = files.purposeImage[0].path;
      }
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      console.error("Update event error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

/**
 * Delete Event
 */
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Delete associated image files
    if (event.titleImage) {
      deleteFile(event.titleImage);
    }
    if (event.coverImage) {
      deleteFile(event.coverImage);
    }
    if (event.purposeImage) {
      deleteFile(event.purposeImage);
    }

    const deletedEvent = await EventModel.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get Events for homepage timeline
 */
export const getEventsForTimeline = async (req: Request, res: Response) => {
  try {
    // Get all events with their seasons populated
    const events = await EventModel.find()
      .populate({
        path: "seasons",
        select: "status startDate endDate slug year getTicketLink",
        options: { sort: { year: -1 } } // Sort by year descending
      });

    // Filter out events that have any upcoming seasons
    const filteredEvents = events.filter(event => {
      if (!event.seasons || event.seasons.length === 0) {
        return false; // Exclude events with no seasons
      }

      // Check if any season has "upcoming" status
      const hasUpcomingSeason = (event.seasons as any[]).some((season: any) =>
        season.status === "upcoming"
      );

      return !hasUpcomingSeason;
    });

    // Process each event to select the appropriate child season
    const processedEvents = filteredEvents.map(event => {
      const seasons = (event.seasons as any[]) || [];

      // Find ongoing season first, then highest year
      let selectedSeason: any = null;

      // First priority: ongoing season
      selectedSeason = seasons.find((season: any) => season.status === "ongoing");

      // Second priority: highest year if no ongoing season
      if (!selectedSeason && seasons.length > 0) {
        selectedSeason = seasons[0]; // Already sorted by year descending
      }

      // If no season found, skip this event
      if (!selectedSeason) {
        return null;
      }

      return {
        eventName: event.name,
        overview: event.overview,
        coverImage: event.coverImage,
        managedBy: event.managedBy,
        season: {
          status: selectedSeason.status,
          startDate: selectedSeason.startDate,
          endDate: selectedSeason.endDate,
          slug: selectedSeason.slug,
          getTicketLink: selectedSeason.getTicketLink
        }
      };
    }).filter(event => event !== null); // Remove null events

    // Sort events by season status: ongoing first, ended later
    const sortedEvents = processedEvents.sort((a, b) => {
      // Define status priority: ongoing = 1, ended = 2
      const statusPriority = {
        'ongoing': 1,
        'ended': 2
      };

      const aPriority = statusPriority[a.season.status as keyof typeof statusPriority] || 3;
      const bPriority = statusPriority[b.season.status as keyof typeof statusPriority] || 3;

      return aPriority - bPriority;
    });

    res.json({
      success: true,
      data: sortedEvents
    });
  } catch (error) {
    console.error("Get events for timeline error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events for timeline" });
  }
};