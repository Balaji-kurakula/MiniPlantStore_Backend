const mongoose = require('mongoose');
require('dotenv').config();

const samplePlants = [
  {
    name: "Money Plant (Golden Pothos)",
    price: 299,
    categories: ["Indoor", "Air Purifying", "Home Decor"],
    isAvailable: true,
    description: "Easy-to-care trailing plant that brings prosperity and purifies air naturally",
    scientificName: "Epipremnum aureum",
    lightRequirement: "Low",
    wateringFrequency: "Weekly",
    potSize: "Medium",
    careInstructions: "Water when topsoil feels dry. Prefers indirect light.",
    image: "https://images.unsplash.com/photo-1509423350716-97f2360dc3ba?w=400",
    popularity: 95
  },
  {
    name: "Snake Plant (Sansevieria)",
    price: 499,
    categories: ["Indoor", "Air Purifying", "Succulent"],
    isAvailable: true,
    description: "Extremely low maintenance plant perfect for beginners and dark spaces",
    scientificName: "Sansevieria trifasciata",
    lightRequirement: "Low",
    wateringFrequency: "Bi-weekly",
    potSize: "Large",
    careInstructions: "Water sparingly. Can tolerate neglect and low light.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400",
    popularity: 90
  },
  {
    name: "Peace Lily",
    price: 699,
    categories: ["Indoor", "Air Purifying", "Flowering"],
    isAvailable: true,
    description: "Elegant flowering plant that blooms beautiful white flowers",
    scientificName: "Spathiphyllum wallisii",
    lightRequirement: "Medium",
    wateringFrequency: "Weekly",
    potSize: "Medium",
    careInstructions: "Keep soil moist but not waterlogged. Enjoys humidity.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    popularity: 85
  },
  {
    name: "Rubber Plant (Ficus)",
    price: 799,
    categories: ["Indoor", "Foliage", "Home Decor"],
    isAvailable: true,
    description: "Glossy burgundy leaves make this plant a stunning statement piece",
    scientificName: "Ficus elastica",
    lightRequirement: "High",
    wateringFrequency: "Weekly",
    potSize: "Large",
    careInstructions: "Bright, indirect light. Water when topsoil is dry.",
    image: "https://images.unsplash.com/photo-1586076054808-fe7c27267ba3?w=400",
    popularity: 80
  },
  {
    name: "Aloe Vera",
    price: 349,
    categories: ["Indoor", "Outdoor", "Succulent", "Medicinal"],
    isAvailable: true,
    description: "Healing succulent plant with medicinal properties for skin care",
    scientificName: "Aloe barbadensis miller",
    lightRequirement: "High",
    wateringFrequency: "Monthly",
    potSize: "Small",
    careInstructions: "Bright light, minimal water. Let soil dry completely between waterings.",
    image: "https://images.unsplash.com/photo-1509423350716-97f2360dc3ba?w=400",
    popularity: 88
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plant-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Force IPv4
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Get database reference
    const db = mongoose.connection.db;

    // Clear existing data
    await db.collection('plants').deleteMany({});
    console.log('🗑️ Cleared existing plants');

    // Insert sample data
    const result = await db.collection('plants').insertMany(samplePlants);
    console.log(`🌱 Successfully seeded ${result.insertedCount} plants`);

    // Display some statistics
    const totalPlants = await db.collection('plants').countDocuments();
    const availablePlants = await db.collection('plants').countDocuments({ isAvailable: true });
    
    console.log(`\n📊 Database Statistics:`);
    console.log(`   Total Plants: ${totalPlants}`);
    console.log(`   Available Plants: ${availablePlants}`);

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding
seedDatabase();
