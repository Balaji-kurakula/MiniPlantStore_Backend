const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  plants: [{
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 500
    }
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
wishlistSchema.index({ 'plants.plantId': 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
