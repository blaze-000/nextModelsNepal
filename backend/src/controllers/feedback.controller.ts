import { Request, Response } from "express";
import { Feedback } from "../models/feedback.model";
import fs from "fs";
import path from "path";

// Helper: delete image file from uploads
const deleteImage = (imagePath: string) => {
  if (!imagePath) return;
  const fullPath = path.join(process.cwd(), "uploads", path.basename(imagePath));
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// Create new feedback
export const createFeedback = async (req: Request, res: Response) => {
  const session = await Feedback.startSession();
  session.startTransaction();

  try {
    let { order, name, message } = req.body;

    // Determine max order
    const maxOrderDoc = await Feedback.findOne().sort({ order: -1 }).session(session);
    const maxOrder = maxOrderDoc ? maxOrderDoc.order : 0;

    let newOrder;
    const parsedOrder = order !== undefined && order !== null && order !== '' ? parseInt(order) : undefined;

    if (parsedOrder === undefined || parsedOrder > maxOrder) {
      // If order is undefined, null, empty string, or greater than max existing order → assign maxOrder + 1
      newOrder = maxOrder + 1;
    } else {
      // If order <= maxOrder → increment order of all feedbacks where order >= newOrder
      newOrder = parsedOrder;

      // Get all feedbacks that need to be shifted, sorted by order descending to avoid conflicts
      const feedbacksToShift = await Feedback.find({ order: { $gte: newOrder } })
        .sort({ order: -1 })
        .session(session);

      // Update each feedback's order one by one, starting from the highest order
      for (const feedback of feedbacksToShift) {
        await Feedback.updateOne(
          { _id: feedback._id },
          { order: feedback.order + 1 },
          { session }
        );
      }
    }

    const newFeedback = new Feedback({
      name,
      message,
      order: newOrder,
      image: `/uploads/${req.file?.filename}`, // required on create
    });

    await newFeedback.save({ session });
    await session.commitTransaction();

    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating feedback", error });
  } finally {
    session.endSession();
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedbacks", error });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching feedback", error });
  }
};

// Update feedback
export const updateFeedbackById = async (req: Request, res: Response) => {
  const session = await Feedback.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { order, name, message } = req.body;

    const feedback = await Feedback.findById(id).session(session);
    if (!feedback) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    // Handle image update
    if (req.file) {
      if (feedback.image) deleteImage(feedback.image);
      feedback.image = `/uploads/${req.file.filename}`;
    }

    // Handle order update
    if (order !== undefined) {
      const parsedOrder = order !== undefined && order !== null && order !== '' ? parseInt(order) : undefined;
      const currentOrder = feedback.order;
      const maxOrderDoc = await Feedback.findOne().sort({ order: -1 }).session(session);
      const maxOrder = maxOrderDoc ? maxOrderDoc.order : 0;

      let finalOrder;
      if (parsedOrder === undefined || parsedOrder > maxOrder) {
        // If order is undefined, null, empty string, or greater than maxOrder → assign maxOrder + 1
        finalOrder = maxOrder + 1;
      } else {
        // If order <= maxOrder → increment order of all feedbacks where order >= newOrder
        finalOrder = parsedOrder;

        // Only shift if the order is actually changing and it's a valid order
        if (parsedOrder !== currentOrder && parsedOrder >= 1) {
          // Determine the range of feedbacks that need to be shifted
          let startOrder, endOrder;

          if (parsedOrder < currentOrder) {
            // Moving up: shift feedbacks from parsedOrder to currentOrder-1
            startOrder = parsedOrder;
            endOrder = currentOrder - 1;
          } else {
            // Moving down: shift feedbacks from currentOrder+1 to parsedOrder
            startOrder = currentOrder + 1;
            endOrder = parsedOrder;
          }

          // First, temporarily move the current feedback to a safe position
          const tempOrder = maxOrder + 2;
          await Feedback.updateOne(
            { _id: id },
            { order: tempOrder },
            { session }
          );

          // Get feedbacks in the range that need to be shifted
          const feedbacksToShift = await Feedback.find({
            order: { $gte: startOrder, $lte: endOrder },
            _id: { $ne: id }
          })
            .sort({ order: -1 })
            .session(session);

          // Update each feedback's order one by one, starting from the highest order
          for (const feedbackToShift of feedbacksToShift) {
            const newOrder = parsedOrder < currentOrder ? feedbackToShift.order + 1 : feedbackToShift.order - 1;
            await Feedback.updateOne(
              { _id: feedbackToShift._id },
              { order: newOrder },
              { session }
            );
          }

          // Now move the current feedback to its final position
          await Feedback.updateOne(
            { _id: id },
            { order: parsedOrder },
            { session }
          );
        }
      }

      feedback.order = finalOrder;
    }

    if (name) feedback.name = name;
    if (message) feedback.message = message;

    await feedback.save({ session });
    await session.commitTransaction();

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating feedback", error });
  } finally {
    session.endSession();
  }
};

// Delete feedback
export const deleteFeedbackById = async (req: Request, res: Response) => {
  const session = await Feedback.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id).session(session);
    if (!feedback) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    const deletedOrder = feedback.order;

    if (feedback.image) deleteImage(feedback.image);
    await Feedback.findByIdAndDelete(id, { session });

    // Shift up remaining feedbacks
    await Feedback.updateMany({ order: { $gt: deletedOrder } }, { $inc: { order: -1 } }, { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting feedback", error });
  } finally {
    session.endSession();
  }
};
