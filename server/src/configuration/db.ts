import mongoose from 'mongoose';
import { config } from '../config';

const connectDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB connected successfully');
  }
    catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;