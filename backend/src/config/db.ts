import mongoose from 'mongoose';

export const connectDB = async () => {
  const DATABASE_URI = process.env.DATABASE_URI;

  try {
    await mongoose.connect(DATABASE_URI as string, {
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
    } as any);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
