const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [100, 'Plant name cannot exceed 100 characters']
  },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Price cannot be negative']
  },
  categories: [{ 
    type: String, 
    required: true,
    enum: ['Indoor', 'Outdoor', 'Succulent', 'Air Purifying', 'Home Decor', 'Flowering', 'Foliage', 'Medicinal']
  }],
  isAvailable: { 
    type: Boolean, 
    default: true
  },
  description: { 
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  scientificName: { 
    type: String,
    trim: true
  },
  image: { 
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Plant'
  },
  lightRequirement: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  wateringFrequency: { 
    type: String
  },
  potSize: { 
    type: String
  },
  careInstructions: { 
    type: String
  },
  popularity: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema);
