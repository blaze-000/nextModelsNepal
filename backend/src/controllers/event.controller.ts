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
        // Production: File deletion logged
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

/**
 * Get All Past Events
 * Returns events with only one season that has status "ended" with the latest year
 */
export const getAllPastEvents = async (req: Request, res: Response) => {
  try {
    // Get all events with their seasons populated, sorted by year descending
    const events = await EventModel.find()
      .populate({
        path: "seasons",
        select: "status year slug endDate",
        options: { sort: { year: -1 } } // Sort by year descending
      });

    // Filter events that have at least one season with status "ended"
    const eventsWithEndedSeasons = events.filter(event => {
      if (!event.seasons || event.seasons.length === 0) {
        return false;
      }

      // Check if any season has "ended" status
      return (event.seasons as any[]).some((season: any) => season.status === "ended");
    });

    // Process each event to get only the latest ended season
    const pastEvents = eventsWithEndedSeasons.map(event => {
      const seasons = (event.seasons as any[]) || [];

      // Find the season with status "ended" and the latest year
      const endedSeasons = seasons.filter((season: any) => season.status === "ended");

      if (endedSeasons.length === 0) {
        return null;
      }

      // Get the season with the latest year (already sorted by year descending)
      const latestEndedSeason = endedSeasons[0];

      return {
        name: event.name,
        coverImage: event.coverImage,
        overview: event.overview,
        season: {
          year: latestEndedSeason.year,
          slug: latestEndedSeason.slug,
          endDate: latestEndedSeason.endDate
        }
      };
    }).filter(event => event !== null); // Remove null events

    res.json({
      success: true,
      data: pastEvents
    });
  } catch (error) {
    console.error("Get all past events error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch past events" });
  }
};

/**
 * Get All Past Winners
 * Returns winners with rank, name, parent season's year, and grandparent event's name
 */
export const getAllPastWinners = async (req: Request, res: Response) => {
  try {
    // Import WinnerModel and SeasonModel
    const { WinnerModel, SeasonModel } = await import("../models/events.model");

    // Get all winners with their parent season and grandparent event populated
    const winners = await WinnerModel.find()
      .populate({
        path: "seasonId",
        select: "year status eventId",
        populate: {
          path: "eventId",
          select: "name"
        }
      });

    // Filter winners from seasons with status "ended"
    const pastWinners = winners.filter(winner => {
      const season = winner.seasonId as any;
      return season && season.status === "ended";
    });

    // Format the response data
    const formattedWinners = pastWinners.map(winner => {
      const season = winner.seasonId as any;
      const event = season?.eventId as any;

      return {
        _id: winner._id,
        rank: winner.rank,
        name: winner.name,
        year: season?.year,
        eventName: event?.name,
        image: winner.image,
        slug: winner.slug
      };
    });

    // Sort: Winners (champions) first, then runner-ups
    const sortedWinners = formattedWinners.sort((a, b) => {
      const rankOrder = {
        "Winner": 1,
        "1st Runner Up": 2,
        "2nd Runner Up": 3,
        "3rd Runner Up": 4,
        "4th Runner Up": 5,
        "5th Runner Up": 6
      };

      const aRankOrder = rankOrder[a.rank as keyof typeof rankOrder] || 999;
      const bRankOrder = rankOrder[b.rank as keyof typeof rankOrder] || 999;

      // ✅ Primary sort: rank priority
      if (aRankOrder !== bRankOrder) {
        return aRankOrder - bRankOrder;
      }

      // ✅ Secondary sort: year descending
      return b.year - a.year;
    });

    res.json({
      success: true,
      data: sortedWinners
    });
  } catch (error) {
    console.error("Get all past winners error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch past winners" });
  }
};

/**
 * Get Latest Gallery
 * Returns gallery of the season with status "ended" and most recent endDate
 * Also returns list of events with ended seasons and their years
 */
export const getLatestGallery = async (req: Request, res: Response) => {
  try {
    // Import SeasonModel
    const { SeasonModel } = await import("../models/events.model");

    // Get the season with status "ended" and most recent endDate
    const latestEndedSeason = await SeasonModel.findOne({ status: "ended" })
      .populate({
        path: "eventId",
        select: "name"
      })
      .sort({ endDate: -1 });

    // Get all events with their seasons to find events with ended seasons
    const events = await EventModel.find()
      .populate({
        path: "seasons",
        select: "year status",
        match: { status: "ended" }
      });

    // Filter events that have at least one ended season and format the data
    const eventsWithEndedSeasons = events
      .filter(event => event.seasons && event.seasons.length > 0)
      .map(event => {
        const endedSeasons = (event.seasons as any[]).filter(season => season.status === "ended");
        const years = endedSeasons.map(season => season.year).sort((a, b) => b - a); // Sort years descending

        return {
          eventId: event._id,
          eventName: event.name,
          years: years
        };
      });

    // Prepare response data
    const responseData = {
      latestGallery: latestEndedSeason ? {
        eventId: (latestEndedSeason.eventId as any)._id,
        eventName: (latestEndedSeason.eventId as any).name,
        year: latestEndedSeason.year,
        gallery: latestEndedSeason.gallery || []
      } : null,
      eventsWithEndedSeasons: eventsWithEndedSeasons
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error("Get latest gallery error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch latest gallery" });
  }
};

/**
 * Get Gallery by Event and Year
 * Returns gallery for a specific event and season year
 */
export const getGalleryByEventAndYear = async (req: Request, res: Response) => {
  try {
    const { eventId, year } = req.params;

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID format" });
    }

    // Validate year format
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      return res.status(400).json({ success: false, message: "Invalid year format" });
    }

    // Import SeasonModel
    const { SeasonModel } = await import("../models/events.model");

    // Find the season with the specified eventId and year
    const season = await SeasonModel.findOne({
      eventId: eventId,
      year: yearNum,
      status: "ended"
    }).populate({
      path: "eventId",
      select: "name"
    });

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found for the specified event and year"
      });
    }

    const responseData = {
      eventId: (season.eventId as any)._id,
      eventName: (season.eventId as any).name,
      year: season.year,
      gallery: season.gallery || []
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error("Get gallery by event and year error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch gallery" });
  }
};