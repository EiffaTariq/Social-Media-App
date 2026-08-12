import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    console.log('Trying to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'SocialMediaDb',
    });
    console.log('Connected to MongoDB');
    
  console.log("Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};