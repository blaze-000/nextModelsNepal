import { Request, Response } from "express";
import { EventModel, SeasonModel } from "../models/events.model";
import { createEventSchema, updateEventSchema } from "../validations/event.validation";
import mongoose from "mongoose";

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

// ... other controller methods remain the same
/**
 * Get All Events
 */
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const events = await EventModel.find()
      .populate("seasons")
      .sort({ [String(sort)]: sortOrder })
      .limit(Number(limit))
      .skip(skip);

    const total = await EventModel.countDocuments();

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

    const validatedData = updateEventSchema.parse(req.body);
    const updatedEvent = await EventModel.findByIdAndUpdate(id, validatedData, {
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
