const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');

    if (!uri && process.env.NODE_ENV === 'production') {
      console.error('❌ CRITICAL ERROR: MONGODB_URI is not defined in the environment variables.');
      console.error('Please configure the MONGODB_URI in your cloud provider settings.');
      process.exit(1);
    }
    
    // Attempt Atlas/Configured DB connection with a short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Atlas Connection Error: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Failed to connect to MongoDB in production. Exiting...');
      process.exit(1);
    }

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
