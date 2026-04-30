const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    
    // Attempt Atlas/Configured DB connection with a short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Atlas Connection Error: ${error.message}`);
    console.log('Falling back to local MongoMemoryServer for development...');
    
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      await mongoose.connect(uri);
      console.log(`Local MongoDB Started: ${uri}`);
    } catch (fallbackError) {
      console.error(`Fallback Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
