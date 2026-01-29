import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://newAdmin:Niyigaba2002%40@127.0.0.1:27017/salonease?authSource=admin');
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
};