const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set mongoose options for better connection handling
    mongoose.set('strictQuery', false);
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@')); // Log URI without credentials
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'urvann',
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Socket timeout
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    console.log(`📊 Connection State: ${conn.connection.readyState}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName
    });
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

module.exports = connectDB;
