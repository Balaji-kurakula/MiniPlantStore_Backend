const mongoose = require('mongoose');
require('dotenv').config();

const Plant = require('../models/Plant');
const Wishlist = require('../models/Wishlist');

async function setupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plant-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Force IPv4
    });
    console.log('✅ Connected to MongoDB for setup');

    // Drop existing collections (optional - for fresh setup)
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (let collection of collections) {
      if (['plants', 'wishlists'].includes(collection.name)) {
        await mongoose.connection.db.collection(collection.name).drop();
        console.log(`🗑️ Dropped collection: ${collection.name}`);
      }
    }

    // Create collections with validation
    await Plant.createCollection();
    await Wishlist.createCollection();
    console.log('✅ Collections created successfully');

    // Create indexes
    await createIndexes();
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function createIndexes() {
  try {
    // Plant indexes
    await Plant.collection.createIndex({ name: 1 });
    await Plant.collection.createIndex({ categories: 1 });
    await Plant.collection.createIndex({ price: 1 });
    await Plant.collection.createIndex({ isAvailable: 1 });
    await Plant.collection.createIndex({ createdAt: -1 });
    
    // Compound indexes for common queries
    await Plant.collection.createIndex({ isAvailable: 1, categories: 1 });
    await Plant.collection.createIndex({ price: 1, isAvailable: 1 });
    
    // Text search index
    await Plant.collection.createIndex(
      { 
        name: 'text', 
        categories: 'text', 
        description: 'text',
        scientificName: 'text' 
      },
      { 
        weights: { 
          name: 10, 
          scientificName: 8, 
          categories: 5, 
          description: 1 
        },
        name: 'plant_search_index'
      }
    );

    // Wishlist indexes
    await Wishlist.collection.createIndex({ userId: 1 });
    await Wishlist.collection.createIndex({ userId: 1, 'plants.plantId': 1 });

    console.log('✅ All indexes created successfully');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

// Run setup
setupDatabase();
