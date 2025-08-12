import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Store emails in lowercase for consistency
    trim: true // Remove whitespace
  },
  password: {
    type: String,
    required: true,
    select: false // Exclude password by default in queries
  }
}, { timestamps: true });

export const AdminModel = mongoose.model("Admin", AdminSchema);