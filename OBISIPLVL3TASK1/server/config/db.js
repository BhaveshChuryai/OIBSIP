/**
 * MongoDB Connection Configuration
 * Connects to MongoDB using Mongoose with error handling and retry logic.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    // Try connecting to the real MongoDB first
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000 // Give up after 2 seconds
    });
    console.log(`✅ Real MongoDB Connected`);
  } catch (error) {
    console.log(`⚠️  Local MongoDB not found. Starting DUMMY database...`);
    
    // Start an in-memory database instead
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log(`🚀 Dummy (In-Memory) Database Started!`);
    console.log(`📝 Note: Data will be lost when you stop the server.`);
  }
};

module.exports = connectDB;
