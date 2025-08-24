const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Plant = require('../models/Plant');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && (String(new mongoose.Types.ObjectId(id)) === id);
};

// @route   GET /api/wishlist/:userId
// @desc    Get user's wishlist
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Getting wishlist for user:', userId); // Debug log
    
    const wishlist = await Wishlist.findOne({ userId })
      .populate({
        path: 'plants.plantId',
        select: 'name price categories isAvailable image scientificName lightRequirement'
      })
      .lean();

    if (!wishlist) {
      return res.json({ 
        success: true,
        data: {
          plants: [],
          totalItems: 0
        }
      });
    }

    // Filter out items where plant doesn't exist (deleted plants)
    const validPlants = wishlist.plants
      .filter(item => item.plantId)
      .map(item => ({
        ...item.plantId,
        addedAt: item.addedAt,
        notes: item.notes,
        wishlistItemId: item._id
      }));

    res.json({
      success: true,
      data: {
        plants: validPlants,
        totalItems: validPlants.length,
        updatedAt: wishlist.updatedAt
      }
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/wishlist/:userId
// @desc    Add plant to wishlist
// @access  Public
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { plantId, notes = '' } = req.body;

    console.log('Adding to wishlist:', { userId, plantId }); // Debug log

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID is required'
      });
    }

    if (!isValidObjectId(plantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID format. Please provide a valid MongoDB ObjectId.'
      });
    }

    // Check if plant exists
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ 
        success: false,
        message: 'Plant not found' 
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      // Create new wishlist
      wishlist = new Wishlist({
        userId,
        plants: [{ plantId, notes, addedAt: new Date() }]
      });
    } else {
      // Check if plant already in wishlist
      const existingPlant = wishlist.plants.find(
        item => item.plantId.toString() === plantId
      );

      if (existingPlant) {
        return res.status(400).json({ 
          success: false,
          message: 'Plant already in wishlist',
          isInWishlist: true 
        });
      }

      // Add plant to existing wishlist
      wishlist.plants.push({ plantId, notes, addedAt: new Date() });
    }

    await wishlist.save();

    res.status(201).json({
      success: true,
      message: 'Plant added to wishlist successfully',
      data: {
        totalItems: wishlist.plants.length,
        addedItem: plant.name
      }
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add plant to wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/wishlist/:userId/:plantId
// @desc    Remove plant from wishlist
// @access  Public
router.delete('/:userId/:plantId', async (req, res) => {
  try {
    const { userId, plantId } = req.params;

    console.log('Removing from wishlist:', { userId, plantId }); // Debug log

    if (!isValidObjectId(plantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID format'
      });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ 
        success: false,
        message: 'Wishlist not found' 
      });
    }

    const initialLength = wishlist.plants.length;
    wishlist.plants = wishlist.plants.filter(
      item => item.plantId.toString() !== plantId
    );

    if (wishlist.plants.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        message: 'Plant not found in wishlist' 
      });
    }

    await wishlist.save();

    res.json({
      success: true,
      message: 'Plant removed from wishlist',
      data: {
        totalItems: wishlist.plants.length
      }
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove plant from wishlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; // ← Make sure this line exists
