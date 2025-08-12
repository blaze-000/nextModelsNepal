import { Request, Response } from "express";
import { FeedBackModel } from "../models/feedback.model";
import fs from "fs";
import path from "path";

// Helper function to delete image file
const deleteImage = (imagePath: string) => {
  if (imagePath) {
    const fullPath = path.join(process.cwd(), "uploads", path.basename(imagePath));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Create a new feedback
export const createFeedback = async (req: Request, res: Response) => {
  const session = await FeedBackModel.startSession();
  session.startTransaction();

  try {
    const { index, name, message } = req.body;
    const newIndex = parseInt(index);
    
    // Shift existing documents with index >= newIndex
    await FeedBackModel.updateMany(
      { index: { $gte: newIndex } },
      { $inc: { index: 1 } },
      { session }
    );

    // Create new feedback
    const newFeedback = new FeedBackModel({
      index: newIndex,
      name,
      message,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await newFeedback.save({ session });
    await session.commitTransaction();
    
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Error creating feedback", error });
  } finally {
    session.endSession();
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await FeedBackModel.find().sort({ index: 1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedbacks", error });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await FeedBackModel.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedback", error });
  }
};

// Update feedback by ID
export const updateFeedbackById = async (req: Request, res: Response) => {
  const session = await FeedBackModel.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { index, name, message } = req.body;
    const existingFeedback = await FeedBackModel.findById(id).session(session);
    
    if (!existingFeedback) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    // Handle image update
    let imagePath = existingFeedback.image;
    if (req.file) {
      if (existingFeedback.image) {
        deleteImage(existingFeedback.image);
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Handle index update
    if (index !== undefined && index !== existingFeedback.index) {
      const newIndex = parseInt(index);
      const oldIndex = existingFeedback.index;

      if (newIndex < oldIndex) {
        // Increment index by 1 for documents where index >= newIndex && index < oldIndex
        await FeedBackModel.updateMany(
          { index: { $gte: newIndex, $lt: oldIndex } },
          { $inc: { index: 1 } },
          { session }
        );
      } else if (newIndex > oldIndex) {
        // Decrement index by 1 for documents where index <= newIndex && index > oldIndex
        await FeedBackModel.updateMany(
          { index: { $lte: newIndex, $gt: oldIndex } },
          { $inc: { index: -1 } },
          { session }
        );
      }

      existingFeedback.index = newIndex;
    }

    // Update other fields
    if (name) existingFeedback.name = name;
    if (message) existingFeedback.message = message;
    if (imagePath !== existingFeedback.image) existingFeedback.image = imagePath;

    await existingFeedback.save({ session });
    await session.commitTransaction();
    
    res.status(200).json({ success: true, data: existingFeedback });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Error updating feedback", error });
  } finally {
    session.endSession();
  }
};

// Delete feedback by ID
export const deleteFeedbackById = async (req: Request, res: Response) => {
  const session = await FeedBackModel.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const feedback = await FeedBackModel.findById(id).session(session);
    
    if (!feedback) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    // Delete image if exists
    if (feedback.image) {
      deleteImage(feedback.image);
    }

    // Get the index of the feedback to be deleted
    const deletedIndex = feedback.index;
    
    // Delete the feedback
    await FeedBackModel.findByIdAndDelete(id, { session });
    
    // Decrement index for all feedbacks with index > deletedIndex
    await FeedBackModel.updateMany(
      { index: { $gt: deletedIndex } },
      { $inc: { index: -1 } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Error deleting feedback", error });
  } finally {
    session.endSession();
  }
};
